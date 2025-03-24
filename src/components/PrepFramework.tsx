
import React from 'react';

const PrepFramework = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold text-speakup-primary mb-2">PREP Framework</h3>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-start">
          <span className="font-bold text-speakup-primary mr-2">P:</span>
          <span><span className="font-semibold">Point</span> - State your main point clearly</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold text-speakup-primary mr-2">R:</span>
          <span><span className="font-semibold">Reason</span> - Explain why this is important</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold text-speakup-primary mr-2">E:</span>
          <span><span className="font-semibold">Example</span> - Provide evidence or examples</span>
        </div>
        <div className="flex items-start">
          <span className="font-bold text-speakup-primary mr-2">P:</span>
          <span><span className="font-semibold">Point</span> - Restate your point</span>
        </div>
      </div>
    </div>
  );
};

export default PrepFramework;
