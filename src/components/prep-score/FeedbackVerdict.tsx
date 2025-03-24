
import React from 'react';
import { getScoreBackground, getScoreIcon } from '@/utils/prepScoreUtils';
import { PrepScoreFeedback } from '@/types/prepScore';

interface FeedbackVerdictProps {
  feedback: PrepScoreFeedback;
  score: number;
}

const FeedbackVerdict: React.FC<FeedbackVerdictProps> = ({ feedback, score }) => {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${getScoreBackground(score)} border border-${score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'}-200`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        {getScoreIcon(score)}
        Feedback Summary
      </h3>
      <p className="text-gray-700 italic">{feedback.verdict}</p>
    </div>
  );
};

export default FeedbackVerdict;
