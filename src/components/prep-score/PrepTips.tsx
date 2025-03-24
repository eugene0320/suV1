
import React from 'react';

const PrepTips: React.FC = () => {
  return (
    <div className="p-4 rounded-lg bg-blue-50 mt-4 shadow-sm border border-blue-100">
      <h3 className="font-medium text-gray-700 mb-2">PREP Framework Tips:</h3>
      <ul className="text-sm list-disc pl-5 space-y-1">
        <li><strong>P</strong>oint: Make clear, concise statements about your position.</li>
        <li><strong>R</strong>eason: Explain why your position makes sense.</li>
        <li><strong>E</strong>xample: Provide specific examples or evidence to support your case.</li>
        <li><strong>P</strong>oint: Restate your key points to reinforce your message.</li>
      </ul>
    </div>
  );
};

export default PrepTips;
