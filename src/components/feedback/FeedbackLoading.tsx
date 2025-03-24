
import React from 'react';
import FeedbackCalculating from './FeedbackCalculating';
import { Loader2 } from 'lucide-react';

interface FeedbackLoadingProps {
  pollingActive?: boolean;
}

const FeedbackLoading = ({ pollingActive = false }: FeedbackLoadingProps) => {
  // When polling is active, show the more detailed calculating UI
  // Otherwise, show the simpler loading UI for initial request
  if (pollingActive) {
    return <FeedbackCalculating />;
  }
  
  // Improved loading UI for initial request
  return (
    <div className="w-full mt-6 flex items-center justify-center p-8 bg-blue-50/50 rounded-lg border-2 border-blue-200 shadow-md" data-feedback-section="true">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="text-lg font-medium text-blue-800 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Initializing analysis...
        </p>
      </div>
    </div>
  );
};

export default FeedbackLoading;
