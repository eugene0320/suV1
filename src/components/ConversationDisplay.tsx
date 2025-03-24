
import React from 'react';
import ConversationMessage from './ConversationMessage';
import { Message } from '../types/conversation';

type ConversationDisplayProps = {
  messages: Message[];
};

const ConversationDisplay = ({ messages }: ConversationDisplayProps) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 h-[350px] overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 italic">Start the conversation to begin practicing...</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <ConversationMessage 
            key={index}
            text={message.text}
            isUser={message.isUser}
            audioUrl={message.audioUrl}
            isInitialMessage={message.isInitialMessage}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ConversationDisplay;
