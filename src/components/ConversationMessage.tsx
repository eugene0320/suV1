
import React from 'react';

type MessageProps = {
  text: string;
  isUser: boolean;
  audioUrl?: string;
  isInitialMessage?: boolean;
};

const ConversationMessage = ({ text, isUser, audioUrl, isInitialMessage }: MessageProps) => {
  return (
    <div className={`p-4 rounded-lg shadow mb-4 ${
      isInitialMessage 
        ? 'bg-yellow-50 border-l-4 border-yellow-400 mr-12' 
        : isUser 
          ? 'bg-blue-100 ml-12' 
          : 'bg-white mr-12'
    }`}>
      <div className="flex items-center mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
          isUser 
            ? 'bg-speakup-primary text-white' 
            : isInitialMessage 
              ? 'bg-yellow-400 text-white' 
              : 'bg-gray-200'
        }`}>
          {isUser ? 'You' : 'AI'}
        </div>
        <div className="font-semibold flex items-center">
          {isUser ? 'You (TSMC Representative)' : 'Apple Procurement Manager'}
          
          {isInitialMessage && (
            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 py-1 px-2 rounded-full">
              Initial Instructions
            </span>
          )}
        </div>
      </div>
      
      <p className={`${isInitialMessage ? 'text-gray-900 font-medium' : 'text-gray-800'} mb-2`}>
        {text}
      </p>
      
      {audioUrl && (
        <div className="mt-2">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default ConversationMessage;
