
import { useState } from 'react';
import { Feedback } from '@/types/conversation';
import { useToast } from '@/components/ui/use-toast';
import { useConversationIdCapture } from './feedback/useConversationIdCapture';
import { usePolling } from './feedback/usePolling';
import { 
  generateElevenLabsFeedback, 
  generateClaudeFeedback, 
  generateSyntheticFeedback 
} from './feedback/feedbackGenerators';

export const useFeedbackGeneration = (apiKey: string, agentId: string, messages: Array<any>) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackSource, setFeedbackSource] = useState<string | null>(null);
  const { toast } = useToast();
  
  const conversationId = useConversationIdCapture();
  const { isPolling, setIsPolling, handlePollingResult } = usePolling(apiKey, agentId, messages);

  const shouldGenerateFeedback = () => {
    return messages.length >= 3;
  };

  const generateFeedback = async () => {
    console.log('generateFeedback called with messages:', messages.length);
    console.log('Current conversation ID:', conversationId);
    
    if (!shouldGenerateFeedback()) {
      console.log('Not enough messages for feedback');
      toast({
        title: "Not enough conversation",
        description: "Please have at least a couple of exchanges before requesting feedback.",
        variant: "destructive",
      });
      return;
    }

    if (feedback) {
      console.log('Using existing feedback from source:', feedbackSource);
      toast({
        title: "Analysis Complete",
        description: "Your negotiation performance report is ready below.",
      });
      return;
    }

    try {
      setIsLoadingFeedback(true);
      console.log('Starting feedback generation process');
      
      const currentConversationId = conversationId || localStorage.getItem('currentConversationId');
      console.log('Using conversation ID for feedback:', currentConversationId);
      
      if (currentConversationId) {
        const elevenLabsResult = await generateElevenLabsFeedback(apiKey, agentId, currentConversationId);
        
        if (elevenLabsResult.success) {
          setFeedback(elevenLabsResult.feedback);
          setFeedbackSource(elevenLabsResult.source);
          toast({
            title: "Feedback Generated",
            description: "Your negotiation analysis is now available below.",
          });
          setIsLoadingFeedback(false);
          return;
        } else if (elevenLabsResult.polling) {
          toast({
            title: "Processing Conversation",
            description: "Please wait while we analyze your conversation (up to 90 seconds).",
          });
          
          setIsPolling(true);
          
          // Start the polling process
          const pollingResult = await handlePollingResult(currentConversationId);
          
          if (pollingResult.success) {
            setFeedback(pollingResult.feedback);
            setFeedbackSource(pollingResult.feedbackSource);
          }
          
          setIsPolling(false);
          setIsLoadingFeedback(false);
          return;
        }
      }
      
      const claudeResult = await generateClaudeFeedback(messages);
      
      if (claudeResult.success) {
        setFeedback(claudeResult.feedback);
        setFeedbackSource(claudeResult.source);
        toast({
          title: "Feedback Generated",
          description: "Your negotiation analysis is now available below.",
        });
      } else {
        const syntheticResult = await generateSyntheticFeedback(apiKey, agentId);
        
        if (syntheticResult.success) {
          setFeedback(syntheticResult.feedback);
          setFeedbackSource(syntheticResult.source);
          toast({
            title: "Feedback Generated",
            description: "Your negotiation analysis is now available below.",
          });
        } else {
          toast({
            title: "Feedback Error",
            description: "Failed to generate feedback. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Feedback Error",
        description: "An unexpected error occurred while generating feedback.",
        variant: "destructive",
      });
    } finally {
      if (!isPolling) {
        setIsLoadingFeedback(false);
      }
    }
  };

  return {
    feedback,
    isLoadingFeedback,
    generateFeedback,
    shouldGenerateFeedback,
    feedbackSource,
    conversationId,
    isPolling
  };
};
