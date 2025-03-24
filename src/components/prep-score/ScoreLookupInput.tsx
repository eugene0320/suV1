
import React from 'react';

interface ScoreLookupInputProps {
  feedbackId: string;
  setFeedbackId: (value: string) => void;
  handleLookup: () => void;
  loading: boolean;
}

const ScoreLookupInput: React.FC<ScoreLookupInputProps> = ({ 
  feedbackId, 
  setFeedbackId, 
  handleLookup, 
  loading 
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">
        Enter your 6-character feedback ID to view your negotiation results
      </p>
      <div className="flex">
        <input
          type="text"
          value={feedbackId}
          onChange={(e) => setFeedbackId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter feedback ID"
          maxLength={6}
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {loading ? 'Looking up...' : 'View'}
        </button>
      </div>
    </div>
  );
};

export default ScoreLookupInput;
