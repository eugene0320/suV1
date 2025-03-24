
import React, { useEffect } from 'react';
import { Message } from '@/types/conversation';

type ClientToolsRegisterProps = {
  messages: Message[];
  setConversationStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Component responsible for registering client tools with the ElevenLabs widget
 */
const ClientToolsRegister = ({ messages, setConversationStarted }: ClientToolsRegisterProps) => {
  // Register client tools for the ElevenLabs widget
  useEffect(() => {
    const registerClientTools = () => {
      if (window.elevenlabsConvai?.registerClientTool) {
        console.log('Registering triggerFeedback client tool...');
        
        // Register the triggerFeedback client tool
        window.elevenlabsConvai.registerClientTool('triggerFeedback', async (data) => {
          console.log('triggerFeedback client tool called with data:', data);
          
          // Get conversation ID from local storage if available
          const conversationId = localStorage.getItem('currentConversationId');
          
          // Dispatch the feedback generation event with conversation ID
          window.dispatchEvent(new CustomEvent('conversationSegmentComplete', {
            detail: { 
              messageCount: messages.length,
              conversationId: conversationId
            }
          }));
          
          // Return a confirmation message to the agent
          return "Feedback generation triggered successfully.";
        });
        
        // Also register triggerName in case it's needed
        window.elevenlabsConvai.registerClientTool('triggerName', async (data) => {
          console.log('triggerName client tool called with data:', data);
          return "Name trigger acknowledged.";
        });
        
        // Add more client tools as needed
        window.elevenlabsConvai.registerClientTool('triggerStartNegotiation', async (data) => {
          console.log('triggerStartNegotiation client tool called with data:', data);
          setConversationStarted(true);
          return "Negotiation started successfully.";
        });
      } else {
        // Widget not loaded yet, retry after a short delay
        setTimeout(registerClientTools, 1000);
      }
    };
    
    // Start registering client tools after a short delay
    setTimeout(registerClientTools, 2000);
  }, [messages, setConversationStarted]);

  return null; // This component doesn't render anything
};

export default ClientToolsRegister;
