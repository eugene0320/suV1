
import { useState, useEffect } from 'react';

/**
 * Hook to capture and manage conversation IDs from ElevenLabs events
 */
export const useConversationIdCapture = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleConversationEvent = (event: any) => {
      if (event.detail && event.detail.conversationId) {
        console.log('Conversation ID captured:', event.detail.conversationId);
        setConversationId(event.detail.conversationId);
        
        localStorage.setItem('currentConversationId', event.detail.conversationId);
      }
    };
    
    window.addEventListener('elevenlabs-convai:call', handleConversationEvent as EventListener);
    const widgetConversationCapture = (event: any) => {
      console.log('Widget call event detected:', event);
      if (event.detail && event.detail.conversationId) {
        console.log('Widget conversation ID captured:', event.detail.conversationId);
        setConversationId(event.detail.conversationId);
        localStorage.setItem('currentConversationId', event.detail.conversationId);
      }
    };
    window.addEventListener('widgetCallStart', widgetConversationCapture as EventListener);
    
    const storedId = localStorage.getItem('currentConversationId');
    if (storedId) {
      console.log('Restored conversation ID from localStorage:', storedId);
      setConversationId(storedId);
    }
    
    return () => {
      window.removeEventListener('elevenlabs-convai:call', handleConversationEvent as EventListener);
      window.removeEventListener('widgetCallStart', widgetConversationCapture as EventListener);
    };
  }, []);
  
  return conversationId;
};
