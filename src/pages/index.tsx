
import React, { useState } from 'react';
import Header from '@/components/Header';
import ScenarioInfo from '@/components/ScenarioInfo';
import VoiceControls from '@/components/VoiceControls';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import CredentialsManager from '@/components/CredentialsManager';
import FeedbackManager from '@/components/FeedbackManager';
import ConversationEventListeners from '@/components/ConversationEventListeners';
import PrepScoreLookup from '@/components/PrepScoreLookup';
import { Message } from '@/types/conversation';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStarted, setConversationStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container px-4 pb-12">
        {/* Updated grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Left column - ScenarioInfo */}
          <div className="md:col-span-6 lg:col-span-5">
            <ScenarioInfo />
          </div>
          
          {/* Right column - PrepScoreLookup */}
          <div className="md:col-span-6 lg:col-span-7">
            <PrepScoreLookup />
          </div>
        </div>
        
        {/* Voice controls and feedback - full width */}
        <div className="mt-6">
          {/* Track event listeners in a separate component */}
          <ConversationEventListeners 
            setMessages={setMessages}
            setConversationStarted={setConversationStarted}
            conversationStarted={conversationStarted}
            messages={messages}
          />
          
          {/* Credentials management */}
          <CredentialsManager>
            {({ apiKey, agentId }) => (
              <FeedbackManager
                apiKey={apiKey}
                agentId={agentId}
                messages={messages}
              >
                {({ feedback, isLoadingFeedback, handleGetFeedback, feedbackSource, conversationId, isPolling }) => (
                  <>
                    <div className="space-y-6">
                      {/* Voice Controls Widget - Minimal Space */}
                      <VoiceControls 
                        onGetFeedback={handleGetFeedback}
                        conversationStarted={conversationStarted}
                        messages={messages}
                      />
                      
                      {/* Show only feedback display - give more emphasis */}
                      <FeedbackDisplay 
                        feedback={feedback}
                        isLoading={isLoadingFeedback || isPolling}
                        source={feedbackSource}
                        data-feedback-section="true"
                        pollingActive={isPolling}
                        conversationId={conversationId}
                      />
                    </div>
                  </>
                )}
              </FeedbackManager>
            )}
          </CredentialsManager>
        </div>
      </main>
      
      <footer className="py-6 border-t mt-12">
        <div className="container text-center text-sm text-gray-500">
          <p>SpeakUp MVP - Powered by ElevenLabs & Lovable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
