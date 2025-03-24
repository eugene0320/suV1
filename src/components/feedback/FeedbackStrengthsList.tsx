
import React from 'react';

interface FeedbackStrengthsListProps {
  strengths: string[];
}

const FeedbackStrengthsList = ({ strengths }: FeedbackStrengthsListProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-green-600 mb-1">Strengths</h4>
      <ul className="text-sm list-disc pl-5">
        {strengths.map((strength, i) => (
          <li key={i}>{strength}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackStrengthsList;
