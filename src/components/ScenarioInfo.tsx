
import React from 'react';
import PrepFramework from './PrepFramework';
import { Calculator, Briefcase } from 'lucide-react';

const ScenarioInfo = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="border-b border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Cost Negotiation with Apple</h2>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start space-x-2">
          <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 text-sm">Your Role:</p>
            <p className="text-gray-900">Technical Sales Representative at TSMC</p>
          </div>
        </div>
        
        <div>
          <p className="font-medium text-gray-700 text-sm">Scenario:</p>
          <p className="text-gray-800">Apple is requesting a 15% cost reduction. Your goal is to maintain current pricing while preserving the business relationship.</p>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <PrepFramework />
      </div>
      
      {/* Add extra padding area that will only be visible if needed to fill space */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <p className="mb-2">Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Focus on value over price</li>
            <li>Emphasize quality and reliability</li>
            <li>Discuss long-term partnership benefits</li>
            <li>Consider offering non-monetary concessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScenarioInfo;
