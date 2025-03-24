
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FeedbackArea as FeedbackAreaType } from '@/types/conversation';
import { getScoreColor, getScoreBackground, getProgressColor, getScoreIcon } from '@/utils/feedbackUtils';
import FeedbackStrengthsList from './FeedbackStrengthsList';
import FeedbackImprovementsList from './FeedbackImprovementsList';

interface FeedbackAreaProps {
  area: FeedbackAreaType;
  title: string;
}

const FeedbackArea = ({ area, title }: FeedbackAreaProps) => {
  return (
    <div className={`p-4 rounded-lg border ${getScoreBackground(area.score)}`}>
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          {getScoreIcon(area.score)}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className={`${getScoreColor(area.score)} font-medium`}>
          {area.score}/100
        </span>
      </div>
      <Progress 
        value={area.score} 
        className="h-2 mb-2"
        indicatorClassName={getProgressColor(area.score)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FeedbackStrengthsList strengths={area.strengths} />
        <FeedbackImprovementsList improvements={area.improvements} />
      </div>
    </div>
  );
};

export default FeedbackArea;
