
import { Feedback } from '@/types/conversation';

const generateClaudeFeedback = async (messages: Array<any>): Promise<{
  success: boolean;
  feedback?: Feedback;
  error?: string;
}> => {
  try {
    // If no messages to analyze, return error
    if (!messages || messages.length < 3) {
      return {
        success: false,
        error: "Not enough conversation data to analyze"
      };
    }

    // Prepare conversation history for Claude
    const conversationText = messages.map(msg => 
      `${msg.isUser ? 'User' : 'Agent'}: ${msg.text}`
    ).join('\n\n');
    
    // Create the prompt for Claude
    const prompt = `
You are an expert negotiation coach. Please analyze this negotiation conversation and provide detailed feedback:

${conversationText}

Provide a comprehensive analysis with:
1. An overall score from 0-100
2. Feedback on the PREP framework (preparation, research, empathy, practice)
3. Feedback on content & arguments
4. Feedback on delivery & communication
5. Specific strengths (3-5 bullet points for each area)
6. Areas for improvement (3-5 bullet points for each area)

Format your response as a JSON object exactly matching this structure:
{
  "overallScore": number,
  "areas": {
    "prepFramework": {
      "score": number,
      "strengths": [string, string, string],
      "improvements": [string, string, string]
    },
    "content": {
      "score": number,
      "strengths": [string, string, string],
      "improvements": [string, string, string]
    },
    "delivery": {
      "score": number,
      "strengths": [string, string, string],
      "improvements": [string, string, string]
    }
  }
}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Claude API error:', data);
      throw new Error(data.error?.message || 'Failed to generate feedback');
    }

    // Extract the content from Claude's response
    const content = data.content?.[0]?.text || '';
    console.log('Claude response content:', content);
    
    // Find the JSON object in the response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/{[\s\S]*}/) ||
                      content.match(/\{[\s\S]*?\}/);
                      
    if (!jsonMatch) {
      console.error('Could not parse JSON from Claude response:', content);
      throw new Error('Could not parse JSON response from Claude');
    }
    
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonStr);
    
    const feedbackData = JSON.parse(jsonStr);
    console.log('Parsed feedback data:', feedbackData);
    
    return {
      success: true,
      feedback: feedbackData
    };
  } catch (error) {
    console.error('Error generating Claude feedback:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateClaudeFeedback
};
