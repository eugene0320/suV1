const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse raw body for HMAC validation
const rawBodyParser = (req, res, next) => {
  let data = '';
  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    req.rawBody = data;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('ElevenLabs Webhook Server Running');
});

// Webhook endpoint
app.post('/webhook/elevenlabs', rawBodyParser, async (req, res) => {
  try {
    // Extract signature header
    const signatureHeader = req.headers['elevenlabs-signature'];
    if (!signatureHeader) {
      console.error('Missing ElevenLabs-Signature header');
      return res.status(401).send('Missing signature header');
    }

    // Parse the headers
    const headers = signatureHeader.split(',');
    const timestamp = headers.find(e => e.startsWith('t=')).substring(2);
    const signature = headers.find(e => e.startsWith('v0='));

    if (!timestamp || !signature) {
      console.error('Invalid signature format');
      return res.status(401).send('Invalid signature format');
    }

    // Validate timestamp (within 30 minutes)
    const reqTimestamp = parseInt(timestamp) * 1000;
    const tolerance = Date.now() - 30 * 60 * 1000;
    if (reqTimestamp < tolerance) {
      console.error('Request expired');
      return res.status(403).send('Request expired');
    }

    // Validate HMAC signature
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook secret not configured');
      return res.status(500).send('Server configuration error: Missing webhook secret');
    }

    const message = `${timestamp}.${req.rawBody}`;
    const digest = 'v0=' + crypto.createHmac('sha256', secret).update(message).digest('hex');
    
    if (signature !== digest) {
      console.error('Invalid signature');
      return res.status(401).send('Invalid signature');
    }

    // Parse webhook data
    const webhookData = JSON.parse(req.rawBody);
    console.log('Received valid webhook from ElevenLabs:', webhookData.type);

    // Process webhook data
    const success = await processWebhookData(webhookData);
    if (success) {
      return res.status(200).send('Webhook processed successfully');
    } else {
      console.error('Failed to process webhook data');
      return res.status(500).send('Failed to process webhook data');
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Internal server error');
  }
});

/**
 * Process ElevenLabs webhook data and store it in Supabase
 * @param webhookData - The payload received from the ElevenLabs post-call webhook
 * @returns Promise<boolean> - True if processing succeeds, false otherwise
 */
async function processWebhookData(webhookData) {
  try {
    if (!webhookData || !webhookData.data) {
      console.error('Invalid webhook data received');
      return false;
    }

    const { data } = webhookData;
    const conversationId = data.conversation_id;

    if (!conversationId) {
      console.error('No conversation_id found in webhook data');
      return false;
    }

    console.log(`Processing webhook data for conversation ${conversationId}`);

    // Extract user_id from dynamic variables if available
    const userId = data.conversation_initiation_client_data?.dynamic_variables?.user_id || null;

    // Check if we have transcript data
    if (data.transcript && data.transcript.length > 0) {
      // Format transcript for storage
      const formattedTranscript = JSON.stringify(
        data.transcript.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.message,
        }))
      );

      // Update or insert conversation record
      const { error: updateError } = await supabase
        .from('conversations')
        .upsert(
          {
            conversation_id: conversationId,
            user_id: userId,
            transcript: formattedTranscript,
            end_time: new Date().toISOString(),
            analysis_summary: data.analysis?.transcript_summary || null,
            call_duration: data.metadata?.call_duration_secs || null,
          },
          { onConflict: 'conversation_id' } // Upsert to handle existing or new records
        );

      if (updateError) {
        console.error('Error updating conversation in Supabase:', updateError);
        return false;
      }

      console.log('Successfully updated conversation in Supabase');

      // Store individual messages in conversation_logs
      for (const msg of data.transcript) {
        const { data: existingMsg, error: checkError } = await supabase
          .from('conversation_logs')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('message', msg.message)
          .limit(1);

        if (checkError) {
          console.error('Error checking existing message:', checkError);
          continue;
        }

        if (!existingMsg || existingMsg.length === 0) {
          const { error: logError } = await supabase
            .from('conversation_logs')
            .insert([
              {
                conversation_id: conversationId,
                user_id: userId,
                speaker: msg.role === 'user' ? 'user' : 'assistant',
                message: msg.message,
                timestamp: new Date().toISOString(),
              },
            ]);

          if (logError) {
            console.error('Error storing message in logs:', logError);
          }
        }
      }

      return true;
    } else {
      console.error('No transcript found in webhook data');
      return false;
    }
  } catch (error) {
    console.error('Error processing webhook data:', error);
    return false;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});

module.exports = app;
