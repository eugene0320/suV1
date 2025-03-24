
import { Feedback } from '@/types/conversation';
import elevenlabsService from '@/services/elevenlabs';
import claudeFeedbackService from '@/services/feedback/claudeFeedbackService';

type FeedbackResult = {
  success: boolean;
  feedback?: Feedback | null;
  source?: string | null;
  message?: string;
  polling?: boolean;
};

/**
 * Generate feedback using ElevenLabs API with polling
 */
export const generateElevenLabsFeedback = async (
  apiKey: string, 
  agentId: string, 
  conversationId: string | null
): Promise<FeedbackResult> => {
  if (!conversationId) {
    console.log('No conversation ID provided for ElevenLabs feedback');
    return {
      success: false,
      message: 'No conversation ID provided'
    };
  }

  console.log('Attempting to get feedback using conversation ID:', conversationId);
  
  const initialResult = await elevenlabsService.getFeedback(apiKey, agentId, conversationId);
  
  if (initialResult.success && initialResult.feedback) {
    console.log('ElevenLabs API feedback generated successfully on first try:', initialResult.feedback);
    return {
      success: true,
      feedback: initialResult.feedback,
      source: initialResult.source || 'elevenlabs_api'
    };
  } else {
    console.log('Initial feedback fetch failed, will need polling');
    
    return {
      success: false,
      polling: true,
      message: 'Waiting for ElevenLabs to process conversation data. This may take up to 90 seconds.'
    };
  }
};

/**
 * Generate feedback using Claude API
 */
export const generateClaudeFeedback = async (messages: Array<any>): Promise<FeedbackResult> => {
  console.log('Attempting to generate feedback with Claude...');
  const claudeResult = await claudeFeedbackService.generateClaudeFeedback(messages);
  
  if (claudeResult.success && claudeResult.feedback) {
    console.log('Claude feedback generated successfully:', claudeResult.feedback);
    return {
      success: true,
      feedback: claudeResult.feedback,
      source: 'claude'
    };
  } else {
    console.log('Claude feedback failed', claudeResult.error);
    return {
      success: false,
      message: claudeResult.error || 'Unknown error'
    };
  }
};

/**
 * Generate synthetic feedback as fallback
 */
export const generateSyntheticFeedback = async (apiKey: string, agentId: string): Promise<FeedbackResult> => {
  console.log('Falling back to ElevenLabs synthetic feedback...');
  const result = await elevenlabsService.getFeedback(apiKey, agentId);
  
  if (result.success && result.feedback) {
    console.log('ElevenLabs synthetic feedback generated successfully:', result.feedback);
    console.log('Feedback source:', result.source);
    return {
      success: true,
      feedback: result.feedback,
      source: result.source || 'elevenlabs_synthetic'
    };
  } else {
    console.error('ElevenLabs feedback failed:', result.message || 'Unknown error');
    return {
      success: false,
      message: result.message || 'Unknown error'
    };
  }
};
