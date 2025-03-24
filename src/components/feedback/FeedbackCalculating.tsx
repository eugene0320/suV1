
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calculator, BarChart2 } from 'lucide-react';

const FeedbackCalculating = () => {
  return (
    <Card className="w-full mt-6 border-2 border-blue-200 shadow-md" data-feedback-section="true">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600 animate-pulse" />
            <span>Calculating PREP Score</span>
          </div>
          <div className="bg-blue-100 px-4 py-1 rounded-full flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 font-semibold text-xl">
              Analyzing...
            </span>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" /> 
          Analyzing your negotiation performance
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        {/* Placeholder layout with skeleton UI */}
        <div className="space-y-6">
          {/* PREP Framework placeholder */}
          <div className="p-4 rounded-lg border bg-blue-50/50">
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">PREP Framework</h3>
              </div>
              <span className="font-medium text-gray-500">X/100</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded mb-4">
              <div className="h-2 w-1/2 bg-blue-400 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-1">Strengths</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Analyzing your preparation...</li>
                  <li className="animate-pulse">Evaluating strategy...</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-600 mb-1">For Improvement</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Identifying areas for growth...</li>
                  <li className="animate-pulse">Assessing approach...</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Content placeholder */}
          <div className="p-4 rounded-lg border bg-yellow-50/50">
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">Content & Arguments</h3>
              </div>
              <span className="font-medium text-gray-500">X/100</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded mb-4">
              <div className="h-2 w-3/5 bg-yellow-400 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-1">Strengths</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Assessing argument structure...</li>
                  <li className="animate-pulse">Analyzing evidence usage...</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-600 mb-1">For Improvement</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Evaluating clarity...</li>
                  <li className="animate-pulse">Checking persuasiveness...</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Delivery placeholder */}
          <div className="p-4 rounded-lg border bg-green-50/50">
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">Delivery & Communication</h3>
              </div>
              <span className="font-medium text-gray-500">X/100</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded mb-4">
              <div className="h-2 w-2/3 bg-green-400 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-1">Strengths</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Measuring voice quality...</li>
                  <li className="animate-pulse">Checking pace and clarity...</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-600 mb-1">For Improvement</h4>
                <ul className="text-sm list-disc pl-5 text-gray-500">
                  <li className="animate-pulse">Analyzing confidence...</li>
                  <li className="animate-pulse">Evaluating engagement...</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCalculating;
