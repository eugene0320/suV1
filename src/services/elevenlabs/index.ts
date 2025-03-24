
import credentialsManager from './credentialsManager';
import apiClient from './apiClient';
import loggingService from './loggingService';
import pollingService from './pollingService';

/**
 * Main ElevenLabs service that combines all functionality
 */
const elevenlabsService = {
  // Credentials management
  loadCredentials: credentialsManager.loadCredentials,
  setElevenLabsCredentials: credentialsManager.setCredentials,
  
  // API communication
  startConversation: apiClient.startConversation,
  sendAudioToAgent: apiClient.sendAudioToAgent,
  getFeedback: apiClient.getFeedback,
  getConversations: apiClient.getConversations,
  getConversationById: apiClient.getConversationById,
  
  // Polling functionality
  pollForConversationData: pollingService.pollForConversationData,
  
  // Logging functionality
  logConversation: loggingService.logConversation,
  logFeedback: loggingService.logFeedback
};

// Initialize with default credentials when loaded
(async () => {
  try {
    const creds = await credentialsManager.loadCredentials();
    // If no credentials were found, it will automatically create a record with defaults
    console.log('ElevenLabs service initialized with credentials:', 
      creds.apiKey ? 'API Key present' : 'No API key',
      creds.agentId ? 'Agent ID present' : 'No Agent ID');
  } catch (error) {
    console.error('Error initializing ElevenLabs service:', error);
  }
})();

export default elevenlabsService;
