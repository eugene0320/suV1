
import apiClient from './apiClient';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service to handle polling for conversation data
 */
const pollingService = {
  /**
   * Polls for conversation data until it's available or max attempts reached
   */
  pollForConversationData: async (
    apiKey: string, 
    conversationId: string, 
    maxAttempts = 10, 
    initialDelay = 2000,
    onAttempt?: (attempt: number, maxAttempts: number) => void
  ) => {
    console.log(`Starting polling for conversation ${conversationId}`);
    
    let attempts = 0;
    let delay = initialDelay;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts} for conversation ${conversationId}`);
        
        // Notify about the attempt if callback provided
        if (onAttempt) {
          onAttempt(attempts, maxAttempts);
        }
        
        // Try to get the conversation data
        const result = await apiClient.getConversationById(apiKey, conversationId);
        
        if (result.success && result.conversation) {
          console.log(`Successfully retrieved conversation data after ${attempts} attempts`);
          
          // Store the conversation data in Supabase
          try {
            if (result.conversation.transcript && result.conversation.transcript.length > 0) {
              // Format the transcript for storage
              const formattedTranscript = JSON.stringify(result.conversation.transcript.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.message
              })));
              
              // Update the existing conversation record with transcript
              const { data, error } = await supabase
                .from('conversations')
                .update({ 
                  transcript: formattedTranscript,
                  end_time: new Date().toISOString() 
                })
                .eq('conversation_id', conversationId);
                
              if (error) {
                console.error('Error updating conversation with transcript:', error);
              } else {
                console.log('Successfully updated conversation with transcript in Supabase');
              }
              
              // Also store individual messages in conversation_logs
              for (const msg of result.conversation.transcript) {
                const { data: logData, error: logError } = await supabase
                  .from('conversation_logs')
                  .insert([{
                    conversation_id: conversationId,
                    speaker: msg.role === 'user' ? 'user' : 'assistant',
                    message: msg.message,
                    timestamp: new Date().toISOString()
                  }]);
                  
                if (logError) {
                  console.error('Error storing message in logs:', logError);
                }
              }
            }
          } catch (dbError) {
            console.error('Error storing conversation data in Supabase:', dbError);
          }
          
          return result.conversation;
        }
        
        // Wait before next attempt with exponential backoff
        console.log(`Waiting ${delay}ms before next polling attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 15000); // Exponential backoff, max 15 seconds
      } catch (error) {
        console.error(`Error polling for conversation data (attempt ${attempts}):`, error);
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 15000);
      }
    }
    
    console.log(`Max polling attempts (${maxAttempts}) reached for conversation ${conversationId}`);
    return null;
  }
};

export default pollingService;
