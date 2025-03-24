
// This file is maintained for backwards compatibility
// It re-exports the new modular implementation
import elevenlabsService from './elevenlabs';
export default elevenlabsService;

// Re-export individual functions for direct imports
export const {
  loadCredentials,
  setElevenLabsCredentials,
  startConversation,
  sendAudioToAgent,
  getFeedback
} = elevenlabsService;
