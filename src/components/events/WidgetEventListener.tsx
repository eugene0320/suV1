
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types/conversation';
import { supabase } from '@/integrations/supabase/client';

type WidgetEventListenerProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationStarted: React.Dispatch<React.SetStateAction<boolean>>;
  conversationStarted: boolean;
  messages: Message[];
};

/**
 * Component responsible for listening to ElevenLabs widget events
 */
const WidgetEventListener = ({
  setMessages,
  setConversationStarted,
  conversationStarted,
  messages
}: WidgetEventListenerProps) => {
  const { toast } = useToast();
  
  // Initialize event listeners for the ElevenLabs widget
  useEffect(() => {
    const initializeWidgetEvents = () => {
      if (window.elevenlabsConvai) {
        // Listen for conversation start
        window.elevenlabsConvai.addEventListener('ready', () => {
          console.log('ElevenLabs Convai widget is ready');
        });
        
        // Listen for call start and capture conversation ID
        window.elevenlabsConvai.addEventListener('widgetCallStart', (data) => {
          console.log('Call started with data:', data);
          let conversationId = null;
          
          // Extract conversation ID from various possible formats
          if (data && data.conversationId) {
            conversationId = data.conversationId;
          } else if (data && data.detail && data.detail.conversationId) {
            conversationId = data.detail.conversationId;
          } else if (typeof data === 'string' && data.length > 5) {
            // Sometimes the ID might be directly passed as a string
            conversationId = data;
          }
          
          if (conversationId) {
            console.log('Conversation ID from call start:', conversationId);
            localStorage.setItem('currentConversationId', conversationId);
            
            // Store conversation in Supabase immediately
            const storeConversation = async () => {
              try {
                // Check if this conversation already exists
                const { data: existingData, error: checkError } = await supabase
                  .from('conversations')
                  .select('conversation_id')
                  .eq('conversation_id', conversationId)
                  .single();
                
                if (checkError || !existingData) {
                  // Only insert if the conversation doesn't exist
                  const { data: insertData, error } = await supabase
                    .from('conversations')
                    .insert([{
                      conversation_id: conversationId,
                      start_time: new Date().toISOString()
                    }]);
                    
                  if (error) {
                    console.error('Error storing conversation:', error);
                  } else {
                    console.log('Conversation stored in Supabase:', insertData);
                  }
                } else {
                  console.log('Conversation already exists in database');
                }
              } catch (err) {
                console.error('Error saving conversation to Supabase:', err);
              }
            };
            
            storeConversation();
            
            // Dispatch custom event that other components can listen for
            window.dispatchEvent(new CustomEvent('elevenlabs-convai:call', {
              detail: { conversationId: conversationId }
            }));
            
            // Set conversation as started
            setConversationStarted(true);
          }
        });
        
        // Listen for widget interactions to ensure conversation is marked as started
        window.elevenlabsConvai.addEventListener('widgetInteraction', () => {
          console.log('Widget interaction detected');
          if (!conversationStarted) {
            console.log('Setting conversation as started');
            setConversationStarted(true);
          }
        });
        
        // Listen for call end
        window.elevenlabsConvai.addEventListener('widgetCallEnd', (data) => {
          console.log('Call ended with data:', data);
          const conversationId = localStorage.getItem('currentConversationId');
          
          if (conversationId) {
            // Update conversation end time in Supabase
            const updateConversation = async () => {
              try {
                const { data: updateData, error } = await supabase
                  .from('conversations')
                  .update({ end_time: new Date().toISOString() })
                  .eq('conversation_id', conversationId);
                  
                if (error) {
                  console.error('Error updating conversation end time:', error);
                } else {
                  console.log('Conversation end time updated:', updateData);
                }
              } catch (err) {
                console.error('Error updating conversation in Supabase:', err);
              }
            };
            
            updateConversation();
            
            // Trigger feedback generation at the end of the call
            // with a short delay to ensure the UI transitions smoothly
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('conversationSegmentComplete', {
                detail: { 
                  messageCount: messages.length,
                  conversationId: conversationId,
                  callEnded: true
                }
              }));
            }, 500);

            // Show toast notification that analysis is starting
            toast({
              title: "Analyzing your negotiation",
              description: "We're calculating your PREP score now...",
            });
          }
        });
        
        // Listen for microphone activity
        window.elevenlabsConvai.addEventListener('microphoneActivity', (data) => {
          // This event will be used by the VoiceControls component to show recording status
        });

        // Listen for errors
        window.elevenlabsConvai.addEventListener('error', (error) => {
          console.error('ElevenLabs Convai widget error:', error);
          
          toast({
            title: "Conversation Error",
            description: "An error occurred with the conversation. Please refresh and try again.",
            variant: "destructive",
          });
        });
      } else {
        // Widget not loaded yet, retry after a short delay
        setTimeout(initializeWidgetEvents, 1000);
      }
    };

    // Start initializing events after a short delay to ensure the widget script has loaded
    setTimeout(initializeWidgetEvents, 2000);
  }, [conversationStarted, messages, setConversationStarted, toast]);

  return null; // This component doesn't render anything
};

export default WidgetEventListener;
