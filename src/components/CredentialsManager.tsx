
import React, { useState, useEffect } from 'react';
import elevenlabsService from '@/services/elevenlabs';
import { useToast } from '@/components/ui/use-toast';
import APIKeyModal from '@/components/APIKeyModal';

type CredentialsManagerProps = {
  children: (props: {
    apiKey: string;
    agentId: string;
    apiKeyModalOpen: boolean;
    setApiKeyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
};

const CredentialsManager = ({ children }: CredentialsManagerProps) => {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const { toast } = useToast();

  // Load saved credentials on initial load
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const { apiKey: savedApiKey, agentId: savedAgentId } = await elevenlabsService.loadCredentials();
        
        if (savedApiKey && savedAgentId) {
          console.log('Loaded saved credentials');
          setApiKey(savedApiKey);
          setAgentId(savedAgentId);
          await elevenlabsService.setElevenLabsCredentials(savedApiKey, savedAgentId);
        } else {
          console.log('No saved credentials found');
          setApiKeyModalOpen(true);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
        setApiKeyModalOpen(true);
      }
    };
    
    loadSavedCredentials();
  }, []);

  // Handle saving API key
  const handleSaveAPIKey = async (newApiKey: string, newAgentId: string) => {
    setApiKey(newApiKey);
    setAgentId(newAgentId);
    
    try {
      // This will save to both Supabase and localStorage
      await elevenlabsService.setElevenLabsCredentials(newApiKey, newAgentId);
      
      toast({
        title: "API Key Saved",
        description: "Your ElevenLabs credentials have been saved and will be remembered for future sessions.",
      });
    } catch (error) {
      console.error('Error saving credentials:', error);
      
      toast({
        title: "Warning",
        description: "Your credentials were saved for this session but may not persist. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {children({
        apiKey,
        agentId,
        apiKeyModalOpen,
        setApiKeyModalOpen,
      })}
      
      <APIKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSave={handleSaveAPIKey}
      />
    </>
  );
};

export default CredentialsManager;
