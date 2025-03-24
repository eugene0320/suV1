
import React from 'react';
import { Message } from '@/types/conversation';
import ClientToolsRegister from './events/ClientToolsRegister';
import WidgetEventListener from './events/WidgetEventListener';
import MessageEventListener from './events/MessageEventListener';
import FeedbackTrigger from './events/FeedbackTrigger';

// Need to extend the global Window interface to access the ElevenLabs widget events
declare global {
  interface Window {
    elevenlabsConvai: {
      addEventListener: (event: string, callback: (data: any) => void) => void;
      registerClientTool: (name: string, callback: (data: any) => Promise<string>) => void;
    };
    dispatchEvent: (event: Event) => boolean;
    CustomEvent: new <T>(typeArg: string, eventInitDict?: CustomEventInit<T>) => CustomEvent<T>;
  }
}

type ConversationEventListenersProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationStarted: React.Dispatch<React.SetStateAction<boolean>>;
  conversationStarted: boolean;
  messages: Message[];
};

/**
 * Main component that coordinates all event listeners for the conversation
 */
const ConversationEventListeners = ({
  setMessages,
  setConversationStarted,
  conversationStarted,
  messages
}: ConversationEventListenersProps) => {
  return (
    <>
      {/* Register client tools */}
      <ClientToolsRegister 
        messages={messages}
        setConversationStarted={setConversationStarted}
      />
      
      {/* Listen for widget events */}
      <WidgetEventListener 
        setMessages={setMessages}
        setConversationStarted={setConversationStarted}
        conversationStarted={conversationStarted}
        messages={messages}
      />
      
      {/* Handle message events */}
      <MessageEventListener 
        setMessages={setMessages}
        setConversationStarted={setConversationStarted}
        messages={messages}
      />
      
      {/* Trigger feedback generation */}
      <FeedbackTrigger 
        setConversationStarted={setConversationStarted}
        messages={messages}
      />
    </>
  );
};

export default ConversationEventListeners;
