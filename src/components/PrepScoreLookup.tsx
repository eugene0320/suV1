
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { BarChart } from 'lucide-react';
import { PrepScoreResponse, PrepScoreMetadata, PrepScoreFeedback } from '@/types/prepScore';

// Import refactored components
import PerformanceOverview from './prep-score/PerformanceOverview';
import FeedbackVerdict from './prep-score/FeedbackVerdict';
import FeedbackDetails from './prep-score/FeedbackDetails';
import PerformanceAnalysis from './prep-score/PerformanceAnalysis';
import PrepTips from './prep-score/PrepTips';
import ScoreLookupInput from './prep-score/ScoreLookupInput';

const PrepScoreLookup: React.FC = () => {
  const [feedbackId, setFeedbackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<PrepScoreResponse | null>(null);

  // Handle lookup from Supabase
  const handleLookup = async () => {
    if (!feedbackId.trim()) {
      setError('Please enter a feedback ID');
      return;
    }
    setLoading(true);
    setError(null);
    setScoreData(null);
    try {
      // Query from the prep_score_analysis table
      const {
        data,
        error
      } = await supabase.from('prep_score_analysis').select('*').eq('feedback_id', feedbackId.trim().toUpperCase()).single();
      if (error) {
        console.error('Error fetching PREP score:', error);
        toast({
          title: "Not Found",
          description: "PREP score not found for the given feedback ID",
          variant: "destructive"
        });
        setError('PREP score not found for the given feedback ID');
        return;
      }

      // Parse JSON data and safely cast to appropriate types
      const metadata = data.metadata ? (typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata) as PrepScoreMetadata : null;
      const feedback = data.feedback ? (typeof data.feedback === 'string' ? JSON.parse(data.feedback) : data.feedback) as PrepScoreFeedback : null;

      // Format the data for display
      setScoreData({
        feedbackId: data.feedback_id,
        conversationId: data.conversation_id,
        prepScore: data.prep_score,
        date: data.date,
        duration: data.duration_seconds,
        status: data.status,
        metadata: metadata,
        feedback: feedback
      });
      toast({
        title: "Success",
        description: `Found PREP score for ${data.feedback_id}`,
        variant: "default"
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-blue-100 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-600" />
          <CardTitle>PREP Score Lookup</CardTitle>
        </div>
        <CardDescription>
          Enter your 6-character feedback ID to view your negotiation results
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <ScoreLookupInput 
          feedbackId={feedbackId} 
          setFeedbackId={setFeedbackId} 
          handleLookup={handleLookup} 
          loading={loading} 
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {scoreData && (
          <div className="space-y-5 animate-fadeIn">
            <PerformanceOverview 
              score={scoreData.prepScore} 
              date={scoreData.date} 
              duration={scoreData.duration} 
            />
            
            {scoreData.feedback && (
              <FeedbackVerdict 
                feedback={scoreData.feedback} 
                score={scoreData.prepScore} 
              />
            )}
            
            {scoreData.feedback && (
              <FeedbackDetails feedback={scoreData.feedback} />
            )}
            
            <PerformanceAnalysis score={scoreData.prepScore} />
            
            <PrepTips />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrepScoreLookup;
