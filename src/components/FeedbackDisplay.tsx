
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Feedback } from '@/types/conversation';
import FeedbackLoading from './feedback/FeedbackLoading';
import FeedbackArea from './feedback/FeedbackArea';
import FeedbackScore from './feedback/FeedbackScore';

type FeedbackDisplayProps = {
  feedback: Feedback | null;
  isLoading: boolean;
  source?: string | null;
  pollingActive?: boolean;
  conversationId?: string;
};

const FeedbackDisplay = ({ feedback, isLoading, source, pollingActive, conversationId }: FeedbackDisplayProps) => {
  if (isLoading) {
    return <FeedbackLoading pollingActive={pollingActive} />;
  }

  if (!feedback) return null;

  return (
    <Card className="w-full mt-6 border-2 border-blue-200 shadow-lg animate-fadeIn" data-feedback-section="true">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="mr-2">📊</span>
            Negotiation Performance Report
          </div>
          <FeedbackScore score={feedback.overallScore} />
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between items-center w-full">
            <div>
              Automatically generated analysis of your negotiation skills
              {source && <span className="ml-1 text-xs text-gray-500">(Source: {source})</span>}
            </div>
            {conversationId && (
              <div className="text-sm bg-blue-100 px-3 py-1 rounded-md">
                <span className="font-semibold">Feedback ID:</span> {conversationId.substring(0, 6).toUpperCase()}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* PREP Framework */}
          <FeedbackArea 
            area={feedback.areas.prepFramework} 
            title="PREP Framework" 
          />

          {/* Content */}
          <FeedbackArea 
            area={feedback.areas.content} 
            title="Content & Arguments" 
          />

          {/* Delivery */}
          <FeedbackArea 
            area={feedback.areas.delivery} 
            title="Delivery & Communication" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
