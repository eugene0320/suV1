
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types/conversation';

type FeedbackTriggerProps = {
  setConversationStarted: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Message[];
};

/**
 * Component responsible for triggering feedback generation when agent stops speaking
 */
const FeedbackTrigger = ({
  setConversationStarted,
  messages
}: FeedbackTriggerProps) => {
  const { toast } = useToast();
  
  // Set up listener for agent stopped speaking event
  useEffect(() => {
    const setupFeedbackTrigger = () => {
      if (window.elevenlabsConvai) {
        // Listen for when the agent has finished speaking
        window.elevenlabsConvai.addEventListener('agentStoppedSpeaking', () => {
          console.log('Agent stopped speaking - triggering feedback generation');
          setConversationStarted(true);
          
          // Only show notification and trigger feedback if we have enough messages
          if (messages.length >= 3) {
            // Show a toast notification to let user know feedback is being generated
            toast({
              title: "Analyzing your conversation...",
              description: "Your performance report will appear automatically.",
              duration: 3000,
            });
            
            // Get conversation ID if available
            const conversationId = localStorage.getItem('currentConversationId');
            
            // Dispatch a custom event to trigger immediate feedback generation
            window.dispatchEvent(new CustomEvent('conversationSegmentComplete', {
              detail: { 
                messageCount: messages.length,
                conversationId: conversationId
              }
            }));
            
            // Scroll to the feedback section after a delay
            setTimeout(() => {
              const feedbackSection = document.querySelector('[data-feedback-section="true"]');
              if (feedbackSection) {
                feedbackSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 1000);
          }
        });
      } else {
        // Widget not loaded yet, retry after a short delay
        setTimeout(setupFeedbackTrigger, 1000);
      }
    };
    
    setupFeedbackTrigger();
  }, [messages, setConversationStarted, toast]);

  return null; // This component doesn't render anything
};

export default FeedbackTrigger;
