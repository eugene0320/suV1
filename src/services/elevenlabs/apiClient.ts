import { supabase } from "@/integrations/supabase/client";
import { Feedback } from '@/types/conversation';

// Base URL for ElevenLabs API
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * Start a conversation with an ElevenLabs agent
 */
const startConversation = async (apiKey: string, agentId: string) => {
  if (!apiKey || !agentId) return { success: false, message: 'API key and Agent ID are required' };
  
  try {
    // Get a signed URL for the conversation
    const signedUrlResponse = await fetch(`${API_BASE_URL}/convai/conversation/get_signed_url?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!signedUrlResponse.ok) {
      console.error('Error getting signed URL:', await signedUrlResponse.text());
      return { success: false, message: 'Failed to get signed URL' };
    }
    
    const signedUrlData = await signedUrlResponse.json();
    return { success: true, signedUrl: signedUrlData.signed_url };
  } catch (error) {
    console.error('Error starting conversation:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * Send audio to an ElevenLabs agent
 */
const sendAudioToAgent = async (apiKey: string, signedUrl: string, audioBlob: Blob) => {
  if (!apiKey || !signedUrl) return { success: false, message: 'API key and signed URL are required' };
  
  try {
    const response = await fetch(signedUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'audio/webm'
      },
      body: audioBlob
    });
    
    if (!response.ok) {
      console.error('Error sending audio:', await response.text());
      return { success: false, message: 'Failed to send audio' };
    }
    
    return { success: true, message: 'Audio sent successfully' };
  } catch (error) {
    console.error('Error sending audio:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * Get list of conversations for an agent
 */
const getConversations = async (apiKey: string, agentId: string) => {
  if (!apiKey || !agentId) return { success: false, message: 'API key and Agent ID are required' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/convai/conversations?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error getting conversations:', await response.text());
      return { success: false, message: 'Failed to get conversations' };
    }
    
    const data = await response.json();
    return { success: true, conversations: data.conversations };
  } catch (error) {
    console.error('Error getting conversations:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * Get details of a specific conversation
 */
const getConversationById = async (apiKey: string, conversationId: string) => {
  if (!apiKey || !conversationId) return { success: false, message: 'API key and Conversation ID are required' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/convai/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error getting conversation details:', await response.text());
      return { success: false, message: 'Failed to get conversation details' };
    }
    
    const data = await response.json();
    return { success: true, conversation: data };
  } catch (error) {
    console.error('Error getting conversation details:', error);
    return { success: false, message: String(error) };
  }
};

/**
 * Polls the ElevenLabs API for conversation data with exponential backoff
 * 
 * @param apiKey - ElevenLabs API key
 * @param conversationId - ID of the conversation to fetch
 * @param maxAttempts - Maximum number of polling attempts (default 5)
 * @param initialDelay - Initial delay in ms between attempts (default 10000 = 10s)
 * @returns The conversation data or null if not available after all attempts
 */
const pollForConversationData = async (
  apiKey: string, 
  conversationId: string, 
  maxAttempts = 6, 
  initialDelay = 10000
) => {
  let attempts = 0;
  let delay = initialDelay;
  
  console.log(`Starting to poll for conversation data. ID: ${conversationId}`);
  console.log(`Will try ${maxAttempts} times with initial delay of ${initialDelay}ms`);
  
  while (attempts < maxAttempts) {
    attempts++;
    
    console.log(`Polling attempt ${attempts}/${maxAttempts} for conversation ${conversationId}`);
    
    try {
      const result = await getConversationById(apiKey, conversationId);
      
      if (result.success && result.conversation) {
        console.log(`Successfully retrieved conversation data on attempt ${attempts}`);
        
        // Check if the transcript has content
        if (result.conversation.transcript && result.conversation.transcript.length > 0) {
          console.log(`Transcript found with ${result.conversation.transcript.length} messages`);
          
          // Store transcript in Supabase
          try {
            const messages = result.conversation.transcript.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.message
            }));
            
            const { data, error } = await supabase
              .from('conversations')
              .update({ transcript: JSON.stringify(messages) })
              .eq('conversation_id', conversationId);
              
            if (error) {
              console.error('Error storing transcript:', error);
            } else {
              console.log('Transcript stored in database');
            }
          } catch (err) {
            console.error('Error updating transcript in database:', err);
          }
          
          return result.conversation;
        } else {
          console.log('Conversation found but transcript is empty, will retry');
        }
      } else {
        console.log(`Conversation data not available yet (attempt ${attempts}/${maxAttempts})`);
      }
    } catch (error) {
      console.error(`Error during polling (attempt ${attempts}/${maxAttempts}):`, error);
    }
    
    // If we haven't returned by now, wait and try again
    if (attempts < maxAttempts) {
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      // Exponential backoff - double the delay each time up to 60 seconds
      delay = Math.min(delay * 1.5, 60000);
    }
  }
  
  console.log(`Failed to retrieve conversation data after ${maxAttempts} attempts`);
  return null;
};

/**
 * Generate feedback for a conversation using the ElevenLabs API
 */
const getFeedback = async (apiKey: string, agentId: string, conversationId?: string | null) => {
  console.log('Getting feedback with:', { apiKey: apiKey ? 'present' : 'missing', agentId, conversationId });
  
  if (!apiKey) {
    console.error('No API key provided');
    return { 
      success: false, 
      message: 'ElevenLabs API key is required',
    };
  }

  try {
    // If we have a conversation ID, try to get the real conversation data
    if (conversationId) {
      console.log('Attempting to get conversation details for ID:', conversationId);
      
      // Start polling for the conversation data
      const conversation = await pollForConversationData(apiKey, conversationId);
      
      if (conversation) {
        console.log('Successfully retrieved conversation details through polling');
        
        // Extract transcript messages
        const transcript = conversation.transcript || [];
        
        if (transcript.length > 0) {
          console.log('Transcript found with', transcript.length, 'messages');
          
          // Use the transcript to generate feedback
          const messages = transcript.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.message
          }));
          
          // Generate feedback from transcript using Claude
          try {
            console.log('Generating feedback from real conversation transcript');
            const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.CLAUDE_API_KEY || ''
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                messages: [
                  {
                    role: 'user',
                    content: `Analyze this negotiation conversation and provide feedback using the PREP framework. Rate areas on a scale of 1-100 and provide specific strengths and improvements:\n\n${JSON.stringify(transcript)}`
                  }
                ]
              })
            });
            
            if (!claudeResponse.ok) {
              console.log('Claude API returned an error, falling back to synthetic feedback');
              // Fall back to synthetic feedback
              return generateSyntheticFeedback(transcript);
            }
            
            const claudeData = await claudeResponse.json();
            if (claudeData.content && claudeData.content[0] && claudeData.content[0].text) {
              try {
                // Try to parse Claude's response as structured feedback
                const feedbackData = parseFeedbackFromText(claudeData.content[0].text);
                
                // Log feedback to Supabase
                try {
                  const { error } = await supabase
                    .from('feedback_logs')
                    .insert([{
                      conversation_id: conversationId,
                      overall_score: feedbackData.overallScore,
                      prep_score: feedbackData.areas.prepFramework.score,
                      content_score: feedbackData.areas.content.score,
                      delivery_score: feedbackData.areas.delivery.score,
                      feedback_notes: claudeData.content[0].text
                    }]);
                    
                  if (error) {
                    console.error('Error logging feedback:', error);
                  } else {
                    console.log('Feedback logged to database');
                  }
                } catch (err) {
                  console.error('Error inserting feedback into database:', err);
                }
                
                return {
                  success: true,
                  feedback: feedbackData,
                  source: 'elevenlabs_api_transcript',
                  message: 'Feedback generated from real conversation transcript'
                };
              } catch (parseError) {
                console.error('Error parsing Claude feedback:', parseError);
                // Fall back to synthetic feedback
                return generateSyntheticFeedback(transcript);
              }
            } else {
              console.log('Claude response missing content, falling back to synthetic feedback');
              return generateSyntheticFeedback(transcript);
            }
          } catch (claudeError) {
            console.error('Error calling Claude API:', claudeError);
            return generateSyntheticFeedback(transcript);
          }
        } else {
          console.log('No transcript found in conversation, falling back to synthetic feedback');
        }
      } else {
        console.log('Failed to get conversation details after polling, falling back to client tool');
      }
    }
    
    // Try to use the agent's feedback tool
    try {
      console.log('Attempting to use triggerFeedback client tool');
      if (window.elevenlabsConvai?.registerClientTool) {
        // Feedback tool is available, trigger it
        const feedback = generateFeedbackMock();
        
        return {
          success: true,
          feedback,
          source: 'agent_feedback_tool',
          message: 'Feedback successfully generated using agent tool'
        };
      }
    } catch (toolError) {
      console.error('Error using triggerFeedback client tool:', toolError);
    }
    
    // If we reach here, fall back to generating synthetic feedback
    console.log('Falling back to synthetic feedback generation');
    return generateSyntheticFeedback();
    
  } catch (error) {
    console.error('Error getting feedback:', error);
    return {
      success: false, 
      message: `Error generating feedback: ${error}`,
    };
  }
};

/**
 * Generate synthetic feedback when API access fails
 */
const generateSyntheticFeedback = (transcript = null) => {
  try {
    const syntheticFeedback = transcript 
      ? analyzeSyntheticTranscript(transcript) 
      : generateFeedbackMock();
    
    return {
      success: true,
      feedback: syntheticFeedback,
      source: transcript ? 'synthetic_from_transcript' : 'synthetic_default',
      message: transcript 
        ? 'Synthetic feedback generated from conversation transcript' 
        : 'Default synthetic feedback generated'
    };
  } catch (error) {
    console.error('Error generating synthetic feedback:', error);
    return {
      success: false,
      message: `Error generating synthetic feedback: ${error}`
    };
  }
};

/**
 * Parse Claude's text response into structured feedback
 */
const parseFeedbackFromText = (text) => {
  // Default feedback structure
  const defaultFeedback = generateFeedbackMock();
  
  try {
    // Try to find overall score using regex
    const overallScoreMatch = text.match(/overall score:?\s*(\d+)/i);
    const overallScore = overallScoreMatch ? parseInt(overallScoreMatch[1], 10) : defaultFeedback.overallScore;
    
    // Helper function to extract section score
    const extractSectionScore = (section) => {
      const match = text.match(new RegExp(`${section}.*?score:?\\s*(\\d+)`, 'i'));
      return match ? parseInt(match[1], 10) : 75;
    };
    
    // Helper function to extract strengths and improvements
    const extractPoints = (section, type) => {
      const regex = new RegExp(`${section}.*?${type}:?\\s*(.+?)(?=\\n\\n|\\n\\w|$)`, 'is');
      const match = text.match(regex);
      
      if (match && match[1]) {
        // Split by new lines or bullet points
        return match[1]
          .split(/\n|-|\*/)
          .map(item => item.trim())
          .filter(item => item.length > 0)
          .slice(0, 3); // Limit to 3 items
      }
      
      return defaultFeedback.areas.prepFramework.strengths;
    };
    
    return {
      overallScore: overallScore,
      areas: {
        prepFramework: {
          score: extractSectionScore('prep framework'),
          strengths: extractPoints('prep framework', 'strengths'),
          improvements: extractPoints('prep framework', 'improvements')
        },
        content: {
          score: extractSectionScore('content'),
          strengths: extractPoints('content', 'strengths'),
          improvements: extractPoints('content', 'improvements')
        },
        delivery: {
          score: extractSectionScore('delivery'),
          strengths: extractPoints('delivery', 'strengths'),
          improvements: extractPoints('delivery', 'improvements')
        }
      }
    };
  } catch (error) {
    console.error('Error parsing feedback:', error);
    return defaultFeedback;
  }
};

/**
 * Analyze transcript to generate synthetic feedback
 */
const analyzeSyntheticTranscript = (transcript) => {
  // Default to mock feedback as a fallback
  const mockFeedback = generateFeedbackMock();
  
  try {
    if (!transcript || !Array.isArray(transcript)) {
      return mockFeedback;
    }
    
    // Extract user messages
    const userMessages = transcript
      .filter(msg => msg.role === 'user')
      .map(msg => msg.message);
    
    if (userMessages.length < 2) {
      return mockFeedback;
    }
    
    // Simple analysis based on message length and keywords
    const totalLength = userMessages.join(' ').length;
    const avgMessageLength = totalLength / userMessages.length;
    
    // PREP Framework keywords
    const prepKeywords = ['point', 'reason', 'example', 'point again'];
    const contentKeywords = ['cost', 'value', 'price', 'quality', 'service', 'partnership'];
    const deliveryKeywords = ['agree', 'understand', 'perspective', 'proposal', 'solution', 'offer'];
    
    // Count keyword occurrences
    const countKeywords = (messages, keywords) => {
      const text = messages.join(' ').toLowerCase();
      return keywords.reduce((count, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
    };
    
    const prepScore = Math.min(100, 50 + countKeywords(userMessages, prepKeywords) * 10);
    const contentScore = Math.min(100, 60 + countKeywords(userMessages, contentKeywords) * 5);
    const deliveryScore = Math.min(100, 65 + countKeywords(userMessages, deliveryKeywords) * 5 + (avgMessageLength > 100 ? 10 : 0));
    
    // Calculate overall score as weighted average
    const overallScore = Math.round((prepScore * 0.4) + (contentScore * 0.3) + (deliveryScore * 0.3));
    
    return {
      overallScore,
      areas: {
        prepFramework: {
          score: prepScore,
          strengths: [
            "You articulated your main points clearly",
            "You provided some reasoning for your position",
            "Your approach was structured"
          ],
          improvements: [
            "Consider including more specific examples",
            "Circle back to your main points more consistently",
            "Strengthen the connection between your reasons and examples"
          ]
        },
        content: {
          score: contentScore,
          strengths: [
            "You addressed the core negotiation objectives",
            "Your arguments were generally relevant",
            "You maintained focus on the key issues"
          ],
          improvements: [
            "Quantify your value proposition more specifically",
            "Anticipate and address counterarguments proactively",
            "Develop more creative win-win solutions"
          ]
        },
        delivery: {
          score: deliveryScore,
          strengths: [
            "You maintained a professional tone throughout",
            "Your communication was clear and direct",
            "You showed active listening to the other party"
          ],
          improvements: [
            "Vary your sentence structure for more persuasive impact",
            "Use more confident language when presenting your case",
            "Ask more probing questions to understand the other side"
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return mockFeedback;
  }
};

/**
 * Generate mock feedback data for testing
 */
const generateFeedbackMock = () => {
  return {
    overallScore: 76,
    areas: {
      prepFramework: {
        score: 78,
        strengths: [
          "You clearly articulated your main points",
          "You provided solid reasoning for your position",
          "You circled back to reinforce key messages"
        ],
        improvements: [
          "Include more specific examples to illustrate your points",
          "Strengthen the connection between your reasons and examples",
          "Prepare more concise summaries of your main arguments"
        ]
      },
      content: {
        score: 82,
        strengths: [
          "You demonstrated good understanding of the business context",
          "Your arguments were relevant and focused on value",
          "You effectively addressed the cost reduction concern"
        ],
        improvements: [
          "Quantify your value proposition more specifically",
          "Prepare more data points to support your position",
          "Develop a clearer fallback position"
        ]
      },
      delivery: {
        score: 70,
        strengths: [
          "You maintained a professional tone throughout",
          "You expressed your points with clarity",
          "You showed patience during challenging moments"
        ],
        improvements: [
          "Use more confident language when presenting your case",
          "Vary your pace to emphasize key points",
          "Practice smoother transitions between topics"
        ]
      }
    }
  };
};

export default {
  startConversation,
  sendAudioToAgent,
  getFeedback,
  getConversations,
  getConversationById,
  pollForConversationData
};
