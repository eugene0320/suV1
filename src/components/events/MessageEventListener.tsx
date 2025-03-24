
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/conversation';
import { supabase } from '@/integrations/supabase/client';

type MessageEventListenerProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationStarted: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Message[];
};

/**
 * Component responsible for handling agent and user message events
 */
const MessageEventListener = ({
  setMessages,
  setConversationStarted,
  messages
}: MessageEventListenerProps) => {
  const { toast } = useToast();
  
  // Set up listeners for agent/user messages
  useEffect(() => {
    const setupMessageListeners = () => {
      if (window.elevenlabsConvai) {
        // Listen for agent messages
        window.elevenlabsConvai.addEventListener('agentMessage', (data) => {
          console.log('Agent message received:', data);
          
          // Always ensure conversation is marked as started when agent speaks
          setConversationStarted(true);
          
          // Get conversation ID for logging
          const conversationId = localStorage.getItem('currentConversationId');
          let messageText = '';
          
          // Extract message text from different possible formats
          if (typeof data === 'string') {
            messageText = data;
          } else if (data && data.text) {
            messageText = data.text;
          } else if (data && data.message) {
            messageText = data.message;
          } else if (data && data.response) {
            messageText = data.response;
          }
          
          if (!messageText && data) {
            // Try to stringify the data if we couldn't extract text
            try {
              messageText = JSON.stringify(data);
            } catch (e) {
              messageText = "Agent message (format unknown)";
            }
          }
          
          if (messages.length === 0) {
            // For the initial message, add a special flag to highlight it
            setMessages(prev => [...prev, {
              id: uuidv4(),
              text: messageText,
              isUser: false,
              timestamp: new Date(),
              isInitialMessage: true
            }]);
            
            // Explicitly mark conversation as started and show feedback notification
            setTimeout(() => {
              toast({
                title: "Conversation started!",
                description: "After you respond, you can get feedback on your negotiation skills.",
                duration: 5000,
              });
            }, 3000); // Delay to let user read the initial message
          } else {
            // Regular agent messages
            setMessages(prev => [...prev, {
              id: uuidv4(),
              text: messageText,
              isUser: false,
              timestamp: new Date()
            }]);
          }
          
          // Log message to Supabase
          if (conversationId) {
            const logMessage = async () => {
              try {
                const { error } = await supabase
                  .from('conversation_logs')
                  .insert([{
                    conversation_id: conversationId,
                    speaker: 'agent',
                    message: messageText
                  }]);
                  
                if (error) {
                  console.error('Error logging agent message to Supabase:', error);
                } else {
                  console.log('Agent message logged to Supabase');
                }
              } catch (err) {
                console.error('Error logging agent message to Supabase:', err);
              }
            };
            
            logMessage();
          }
        });

        // Listen for user messages
        window.elevenlabsConvai.addEventListener('userMessage', (data) => {
          console.log('User message received:', data);
          
          // Get conversation ID for logging
          const conversationId = localStorage.getItem('currentConversationId');
          let messageText = '';
          
          // Extract message text from different possible formats
          if (typeof data === 'string') {
            messageText = data;
          } else if (data && data.text) {
            messageText = data.text;
          } else if (data && data.message) {
            messageText = data.message;
          } else if (data && data.transcript) {
            messageText = data.transcript;
          }
          
          if (!messageText && data) {
            // Try to stringify the data if we couldn't extract text
            try {
              messageText = JSON.stringify(data);
            } catch (e) {
              messageText = "User message (format unknown)";
            }
          }
          
          setMessages(prev => [...prev, {
            id: uuidv4(),
            text: messageText,
            isUser: true,
            timestamp: new Date()
          }]);
          
          // Log message to Supabase
          if (conversationId) {
            const logMessage = async () => {
              try {
                const { error } = await supabase
                  .from('conversation_logs')
                  .insert([{
                    conversation_id: conversationId,
                    speaker: 'user',
                    message: messageText
                  }]);
                  
                if (error) {
                  console.error('Error logging user message to Supabase:', error);
                } else {
                  console.log('User message logged to Supabase');
                }
              } catch (err) {
                console.error('Error logging user message to Supabase:', err);
              }
            };
            
            logMessage();
          }
        });
      } else {
        // Widget not loaded yet, retry after a short delay
        setTimeout(setupMessageListeners, 1000);
      }
    };
    
    setupMessageListeners();
  }, [messages, setConversationStarted, setMessages, toast]);

  return null; // This component doesn't render anything
};

export default MessageEventListener;
