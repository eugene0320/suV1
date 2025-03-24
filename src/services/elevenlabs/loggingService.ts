
import { supabase } from "@/integrations/supabase/client";

/**
 * Process ElevenLabs webhook data and store it in Supabase
 * @param webhookData - The payload received from the ElevenLabs post-call webhook
 * @returns Promise<boolean> - True if processing succeeds, false otherwise
 */
export const processWebhookData = async (webhookData: any): Promise<boolean> => {
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

    // Extract the ElevenLabs user_id as is without conversion
    const elevenLabsUserId = data.conversation_initiation_client_data?.dynamic_variables?.user_id || null;
    if (elevenLabsUserId) {
      console.log(`Found ElevenLabs user_id: ${elevenLabsUserId}`);
    }

    // Check if we have transcript data
    if (data.transcript && data.transcript.length > 0) {
      // Format transcript for storage
      const formattedTranscript = JSON.stringify(
        data.transcript.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.message,
        }))
      );

      // Get the current schema of the conversations table
      const { data: tableInfo, error: tableError } = await supabase
        .from('conversations')
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.error('Error checking table schema:', tableError);
        return false;
      }
      
      // Build the update object based on available columns
      const updateObject: any = {
        conversation_id: conversationId,
        transcript: formattedTranscript,
        end_time: new Date().toISOString(),
      };
      
      // Only add fields if they exist in the schema (using first record as template)
      if (tableInfo && tableInfo.length > 0) {
        const sampleRecord = tableInfo[0];
        
        // Add elevenlabs_user_id if column exists and we have a value
        if ('elevenlabs_user_id' in sampleRecord && elevenLabsUserId) {
          updateObject.elevenlabs_user_id = elevenLabsUserId;
        }
        
        if ('call_duration' in sampleRecord) {
          updateObject.call_duration = data.metadata?.call_duration_secs || null;
        }
        
        if ('analysis_summary' in sampleRecord) {
          updateObject.analysis_summary = data.analysis?.transcript_summary || null;
        }
      }

      // Update or insert conversation record
      const { error: updateError } = await supabase
        .from('conversations')
        .upsert(
          updateObject,
          { onConflict: 'conversation_id' } // Upsert to handle existing or new records
        );

      if (updateError) {
        console.error('Error updating conversation in Supabase:', updateError);
        return false;
      }

      console.log('Successfully updated conversation in Supabase');

      // Store individual messages in conversation_logs
      for (const msg of data.transcript) {
        // First check if this message already exists to avoid duplicates
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
          // Build message object based on schema
          const messageObject: any = {
            conversation_id: conversationId,
            speaker: msg.role === 'user' ? 'user' : 'assistant',
            message: msg.message,
            timestamp: new Date().toISOString(),
          };
          
          // Add elevenlabs_user_id if available
          if (elevenLabsUserId) {
            messageObject.elevenlabs_user_id = elevenLabsUserId;
          }
          
          const { error: logError } = await supabase
            .from('conversation_logs')
            .insert([messageObject]);

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
};

/**
 * Log conversation data to Supabase
 */
const logConversation = async (conversationId: string, transcript: any[], userId?: string) => {
  try {
    if (!conversationId) {
      console.error('No conversation ID provided for logging');
      return { success: false, message: 'No conversation ID provided' };
    }

    // Check if this conversation already exists in the database
    const { data: existingData, error: checkError } = await supabase
      .from('conversations')
      .select('conversation_id')
      .eq('conversation_id', conversationId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "row not found" which is expected if it doesn't exist
      console.error('Error checking for existing conversation:', checkError);
      return { success: false, message: 'Error checking database' };
    }

    // If the conversation exists, update it; otherwise, create a new record
    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('conversations')
        .update({
          transcript: JSON.stringify(transcript),
          updated_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId);

      if (error) {
        console.error('Error updating conversation in database:', error);
        return { success: false, message: 'Failed to update conversation' };
      }

      result = { success: true, message: 'Conversation updated', data };
    } else {
      // Create new record
      // Make sure to match the expected types in Supabase
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          conversation_id: conversationId,
          // Convert userId to number if it's a numeric string, otherwise pass null
          user_id: userId && !isNaN(Number(userId)) ? Number(userId) : null,
          transcript: JSON.stringify(transcript),
          start_time: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing conversation in database:', error);
        return { success: false, message: 'Failed to store conversation' };
      }

      result = { success: true, message: 'Conversation stored', data };
    }

    return result;
  } catch (error) {
    console.error('Error in logConversation:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * Log feedback data to Supabase
 */
const logFeedback = async (conversationId: string, feedback: any) => {
  try {
    if (!conversationId) {
      console.error('No conversation ID provided for feedback logging');
      return { success: false, message: 'No conversation ID provided' };
    }

    // Insert feedback into database
    const { data, error } = await supabase
      .from('conversation_feedback')
      .insert([
        {
          conversation_id: conversationId,
          feedback_data: JSON.stringify(feedback),
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error storing feedback in database:', error);
      return { success: false, message: 'Failed to store feedback' };
    }

    // Also update the analysis fields in the conversations table
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        prep_score: feedback.prepScore || null,
        prep_breakdown: JSON.stringify(feedback.prepBreakdown) || null,
        analysis_summary: feedback.summary || null,
        strengths: JSON.stringify(feedback.strengths) || null,
        areas_for_improvement: JSON.stringify(feedback.areasForImprovement) || null
      })
      .eq('conversation_id', conversationId);

    if (updateError) {
      console.error('Error updating conversation with feedback data:', updateError);
      // Continue since we did store the feedback, just not all the summary fields
    }

    return { success: true, message: 'Feedback stored', data };
  } catch (error) {
    console.error('Error in logFeedback:', error);
    return { success: false, message: String(error) };
  }
};

export default {
  logConversation,
  logFeedback,
  processWebhookData
};
