
import React, { useEffect } from 'react';
import { Feedback } from '@/types/conversation';
import { useFeedbackGeneration } from '@/hooks/useFeedbackGeneration';

type FeedbackManagerProps = {
  apiKey: string;
  agentId: string;
  messages: Array<any>;
  children: (props: {
    feedback: Feedback | null;
    isLoadingFeedback: boolean;
    handleGetFeedback: () => void;
    feedbackSource: string | null;
    conversationId: string | null;
    isPolling: boolean;
  }) => React.ReactNode;
};

const FeedbackManager = ({ apiKey, agentId, messages, children }: FeedbackManagerProps) => {
  const { 
    feedback, 
    isLoadingFeedback, 
    generateFeedback,
    shouldGenerateFeedback,
    feedbackSource,
    conversationId,
    isPolling
  } = useFeedbackGeneration(apiKey, agentId, messages);

  // Pre-fetch feedback when messages change
  useEffect(() => {
    // Only pre-fetch feedback if there are enough messages and the last message is from the agent
    // This indicates the conversation might have ended
    const shouldPrefetch = shouldGenerateFeedback() && 
                           !messages[messages.length - 1]?.isUser;
    
    if (shouldPrefetch && !feedback && !isLoadingFeedback && !isPolling) {
      console.log('Auto-generating feedback based on messages...');
      generateFeedback();
    }
  }, [messages, feedback, isLoadingFeedback, isPolling, shouldGenerateFeedback, generateFeedback]);
  
  // Listen for conversation segment complete events
  useEffect(() => {
    const handleConversationComplete = (event: CustomEvent) => {
      console.log('Conversation segment complete detected', event.detail);
      
      // Only proceed if we have enough messages and no feedback yet
      if (shouldGenerateFeedback() && !feedback && !isLoadingFeedback && !isPolling) {
        console.log('Triggering feedback generation from event', event.detail);
        // Trigger immediate feedback generation
        generateFeedback();
      }
    };
    
    // Add event listener for custom conversation complete event
    window.addEventListener('conversationSegmentComplete', 
      handleConversationComplete as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('conversationSegmentComplete', 
        handleConversationComplete as EventListener);
    };
  }, [shouldGenerateFeedback, feedback, isLoadingFeedback, isPolling, generateFeedback]);

  return (
    <>
      {children({
        feedback,
        isLoadingFeedback,
        handleGetFeedback: generateFeedback,
        feedbackSource,
        conversationId,
        isPolling
      })}
    </>
  );
};

export default FeedbackManager;
