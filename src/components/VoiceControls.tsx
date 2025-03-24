import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Mic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
type VoiceControlsProps = {
  onGetFeedback: () => void;
  conversationStarted: boolean;
  messages?: Array<any>;
};
const VoiceControls = ({
  onGetFeedback,
  conversationStarted,
  messages = []
}: VoiceControlsProps) => {
  const {
    toast
  } = useToast();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Set up a timer to check if the widget has loaded
  useEffect(() => {
    const checkWidgetInterval = setInterval(() => {
      // If the ElevenLabs widget exists, clear the interval
      if (window.elevenlabsConvai) {
        clearInterval(checkWidgetInterval);
        setWidgetLoaded(true);

        // Listen for microphone activity
        window.elevenlabsConvai.addEventListener('microphoneActivity', data => {
          setIsRecording(data.isActive);
        });
      }
    }, 1000);

    // Clean up
    return () => clearInterval(checkWidgetInterval);
  }, []);
  useEffect(() => {
    // Add the widget script if it doesn't exist
    if (widgetContainerRef.current) {
      // Clear previous widget if any
      widgetContainerRef.current.innerHTML = '';

      // Create the widget element
      const widgetElement = document.createElement('div');
      widgetElement.id = 'elevenlabs-widget-container';

      // Get user ID from localStorage or generate a random one if not available
      const userId = localStorage.getItem('userId') || `user_${Math.random().toString(36).substring(2, 15)}`;

      // Store the user ID if it's newly generated
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
      }

      // Add the custom element
      const convaiElement = document.createElement('elevenlabs-convai');
      convaiElement.setAttribute('agent-id', 'nAizm5QqD2TtXLqB5nuS');

      // Add dynamic variables including user ID for webhook identification
      convaiElement.setAttribute('dynamic-variables', JSON.stringify({
        user_id: userId
      }));

      // Make sure the initial message is visible by setting a high timeout
      convaiElement.setAttribute('message-timeout', '3600000'); // 1 hour in ms

      // Enable debug mode to help with debugging
      convaiElement.setAttribute('debug', 'true');

      // Add data attribute for easier selection
      convaiElement.setAttribute('data-convai-widget', 'true');

      // Append custom element to container
      widgetElement.appendChild(convaiElement);
      widgetContainerRef.current.appendChild(widgetElement);

      // Log when the widget is added
      console.log('ElevenLabs widget added to the DOM with user ID:', userId);

      // Add a mutation observer to detect when the widget is fully loaded
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            console.log('Widget DOM updated, likely fully loaded');
            setWidgetLoaded(true);
          }
        }
      });
      observer.observe(widgetElement, {
        childList: true,
        subtree: true
      });
    }
  }, []);
  const handleFeedbackClick = () => {
    if (!conversationStarted) {
      toast({
        title: "Please start the conversation first",
        description: "Begin talking with the agent using the widget to start the simulation."
      });
      return;
    }
    onGetFeedback();

    // Show success toast when feedback is requested
    toast({
      title: "Feedback requested",
      description: "Analyzing your negotiation skills..."
    });
  };
  return <div className="mb-4">
      {/* Widget loading indicator - more compact */}
      {!widgetLoaded}

      {/* Recording indicator that appears when active - more compact */}
      {isRecording && <div className="flex items-center justify-center p-2 mb-2 bg-red-50 border border-red-200 rounded-md animate-pulse text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-red-600">Recording</span>
          <Mic className="h-4 w-4 text-red-500 ml-1" />
        </div>}
      
      {/* ElevenLabs widget container - more compact styling */}
      <div className="shadow-sm border border-gray-200 rounded-md overflow-hidden" ref={widgetContainerRef}>
        {/* ElevenLabs Convai Widget will be inserted here by useEffect */}
      </div>
      
      {/* Hidden feedback button - kept for compatibility but not displayed */}
      <div className="hidden">
        <Button onClick={handleFeedbackClick} data-feedback-button="true">
          Hidden Feedback Button
        </Button>
      </div>
      
      {/* Status message more compact */}
      {conversationStarted && messages.length >= 3 && <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2 flex items-center text-sm">
          <MessageSquareText className="h-4 w-4 text-blue-500 mr-2" />
          <div>
            <p className="font-medium text-blue-700">Analysis Active</p>
            <p className="text-xs text-blue-600">Performance will be evaluated when conversation ends</p>
          </div>
        </div>}
    </div>;
};
export default VoiceControls;