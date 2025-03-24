
export interface PrepScoreMetadata {
  start_time_unix_secs?: number;
  call_duration_secs?: number;
  cost?: number;
  [key: string]: any;
}

export interface PrepScoreFeedback {
  positives: string[];
  negatives: string[];
  improvement_suggestions: string[];
  verdict: string;
}

export interface PrepScoreResponse {
  feedbackId: string;
  conversationId: string | null;
  prepScore: number;
  date: string;
  duration: number;
  status: string;
  metadata: PrepScoreMetadata | null;
  feedback: PrepScoreFeedback | null;
}
