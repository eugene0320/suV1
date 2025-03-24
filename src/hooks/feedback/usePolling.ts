
import { useState, useEffect, useCallback } from 'react';
import { Feedback } from '@/types/conversation';
import { useToast } from '@/hooks/use-toast';
import elevenlabsService from '@/services/elevenlabs';
import { generateClaudeFeedback, generateSyntheticFeedback } from './feedbackGenerators';

/**
 * Displays toast notifications for different feedback scenarios
 */
const useFeedbackToasts = () => {
  const { toast } = useToast();
  
  const showAnalysisComplete = useCallback(() => {
    toast({
      title: "Analysis Complete",
      description: "Your negotiation performance report is ready below."
    });
  }, [toast]);
  
  const showPollingStarted = useCallback(() => {
    toast({
      title: "Calculating PREP Score",
      description: "Please wait while we analyze your conversation (up to 90 seconds)."
    });
  }, [toast]);
  
  const showFeedbackError = useCallback((message: string = "Failed to generate feedback after multiple attempts. Please try again.") => {
    toast({
      title: "Feedback Error",
      description: message,
      variant: "destructive"
    });
  }, [toast]);
  
  return {
    showAnalysisComplete,
    showPollingStarted,
    showFeedbackError
  };
};

// Define a consistent return type for all feedback functions
type FeedbackResult = {
  success: boolean;
  feedback: Feedback | null;
  feedbackSource: string | null;
};

/**
 * Hook to handle polling for conversation data
 */
export const usePolling = (apiKey: string, agentId: string, messages: Array<any>) => {
  const [isPolling, setIsPolling] = useState(false);
  const toasts = useFeedbackToasts();
  
  // Handle polling process with conversation service
  useEffect(() => {
    let pollingTimeout: NodeJS.Timeout | null = null;
    
    const startPolling = async (conversationId: string) => {
      if (!isPolling) return;
      
      console.log('Starting polling for conversation data');
      toasts.showPollingStarted();
      
      try {
        const conversation = await elevenlabsService.pollForConversationData(apiKey, conversationId);
        
        if (conversation) {
          console.log('Successfully retrieved conversation details through polling');
          return conversation;
        } 
        
        console.log('Polling for conversation data failed');
        return null;
      } catch (error) {
        console.error('Error during polling:', error);
        return null;
      }
    };
    
    if (isPolling) {
      const conversationId = localStorage.getItem('currentConversationId');
      if (conversationId) {
        pollingTimeout = setTimeout(() => startPolling(conversationId), 2000);
      } else {
        setIsPolling(false);
      }
    }
    
    return () => {
      if (pollingTimeout) clearTimeout(pollingTimeout);
    };
  }, [isPolling, apiKey, agentId, toasts]);

  /**
   * Attempts to get feedback from ElevenLabs API
   */
  const attemptElevenLabsFeedback = async (conversationId: string): Promise<FeedbackResult> => {
    const conversation = await elevenlabsService.pollForConversationData(apiKey, conversationId);
    
    if (!conversation) {
      return { success: false, feedback: null, feedbackSource: null };
    }
    
    console.log('Successfully retrieved conversation details through polling');
    const result = await elevenlabsService.getFeedback(apiKey, agentId, conversationId);
    
    if (result.success && result.feedback) {
      toasts.showAnalysisComplete();
      return {
        success: true,
        feedback: result.feedback,
        feedbackSource: result.source || 'elevenlabs_api_polling'
      };
    }
    
    return { success: false, feedback: null, feedbackSource: null };
  };
  
  /**
   * Handles fallback to Claude when ElevenLabs polling fails
   */
  const handleClaudeFallback = async (): Promise<FeedbackResult> => {
    const claudeResult = await generateClaudeFeedback(messages);
    
    if (claudeResult.success && claudeResult.feedback) {
      toasts.showAnalysisComplete();
      return {
        success: true,
        feedback: claudeResult.feedback,
        feedbackSource: claudeResult.source || 'claude'
      };
    }
    
    return { success: false, feedback: null, feedbackSource: null };
  };
  
  /**
   * Final fallback to synthetic feedback
   */
  const handleSyntheticFallback = async (): Promise<FeedbackResult> => {
    const syntheticResult = await generateSyntheticFeedback(apiKey, agentId);
    
    if (syntheticResult.success && syntheticResult.feedback) {
      toasts.showAnalysisComplete();
      return {
        success: true,
        feedback: syntheticResult.feedback,
        feedbackSource: syntheticResult.source || 'elevenlabs_synthetic'
      };
    }
    
    return { success: false, feedback: null, feedbackSource: null };
  };

  /**
   * Main function to handle the polling result and fallbacks
   */
  const handlePollingResult = async (conversationId: string): Promise<FeedbackResult> => {
    try {
      // First try ElevenLabs feedback
      const elevenLabsResult = await attemptElevenLabsFeedback(conversationId);
      if (elevenLabsResult.success) {
        return elevenLabsResult;
      }
      
      // Fallback to Claude
      const claudeResult = await handleClaudeFallback();
      if (claudeResult.success) {
        return claudeResult;
      }
      
      // Final fallback to synthetic feedback
      const syntheticResult = await handleSyntheticFallback();
      if (syntheticResult.success) {
        return syntheticResult;
      }
      
      // All methods failed
      toasts.showFeedbackError();
      return { success: false, feedback: null, feedbackSource: null };
    } catch (error) {
      console.error('Error during polling result handling:', error);
      toasts.showFeedbackError("An unexpected error occurred while polling for feedback data.");
      return { success: false, feedback: null, feedbackSource: null };
    }
  };

  return {
    isPolling,
    setIsPolling,
    handlePollingResult
  };
};
