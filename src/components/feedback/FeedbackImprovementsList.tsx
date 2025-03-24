
import React from 'react';

interface FeedbackImprovementsListProps {
  improvements: string[];
}

const FeedbackImprovementsList = ({ improvements }: FeedbackImprovementsListProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-amber-600 mb-1">For Improvement</h4>
      <ul className="text-sm list-disc pl-5">
        {improvements.map((improvement, i) => (
          <li key={i}>{improvement}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackImprovementsList;
