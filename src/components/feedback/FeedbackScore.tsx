
import React from 'react';
import { getScoreColor, getScoreBackground, getScoreIcon } from '@/utils/feedbackUtils';

interface FeedbackScoreProps {
  score: number;
}

const FeedbackScore = ({ score }: FeedbackScoreProps) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBackground(score)}`}>
      {getScoreIcon(score)}
      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}/100
      </span>
    </div>
  );
};

export default FeedbackScore;
