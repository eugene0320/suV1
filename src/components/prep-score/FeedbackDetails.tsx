
import React from 'react';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { PrepScoreFeedback } from '@/types/prepScore';

interface FeedbackDetailsProps {
  feedback: PrepScoreFeedback;
}

const FeedbackDetails: React.FC<FeedbackDetailsProps> = ({ feedback }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="p-4 rounded-lg border border-green-200 bg-green-50/50 shadow-sm">
        <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Strengths
        </h3>
        <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
          {feedback.positives.map((positive, index) => (
            <li key={index}>{positive}</li>
          ))}
        </ul>
      </div>
      
      {/* Areas for improvement */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 shadow-sm">
        <h3 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Areas for Improvement
        </h3>
        <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
          {feedback.improvement_suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackDetails;
