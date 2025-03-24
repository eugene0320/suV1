
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type APIKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, agentId: string) => void;
};

const APIKeyModal = ({ isOpen, onClose, onSave }: APIKeyModalProps) => {
  // Using the correct default API key format
  const [apiKey, setApiKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Clear defaults to encourage users to enter their own credentials
      setApiKey('');
      setAgentId('');
      setError('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter your ElevenLabs API key');
      return;
    }
    
    if (!agentId.trim()) {
      setError('Please enter your ElevenLabs Agent ID');
      return;
    }
    
    onSave(apiKey, agentId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ElevenLabs Integration</DialogTitle>
          <DialogDescription>
            Enter your ElevenLabs API key and Agent ID to enable the feedback feature.
            The widget will work without these credentials, but you'll need them for the feedback functionality.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">ElevenLabs API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="Enter your ElevenLabs API key (starts with sk_...)"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="agentId">Agent ID</Label>
            <Input
              id="agentId"
              value={agentId}
              onChange={(e) => {
                setAgentId(e.target.value);
                setError('');
              }}
              placeholder="Enter your ElevenLabs Agent ID"
            />
            <p className="text-xs text-gray-500">Default Agent ID: nAizm5QqD2TtXLqB5nuS</p>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="text-sm text-gray-500">
            <p>You can get your API key from the <a href="https://elevenlabs.io/account/api" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">ElevenLabs dashboard</a>.</p>
            <p className="mt-1">The widget uses the default Agent ID, but you need to provide it again for the feedback functionality.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyModal;
