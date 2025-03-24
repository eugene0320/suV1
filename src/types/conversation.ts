
export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  audioUrl?: string;
  timestamp: Date;
  isInitialMessage?: boolean;
};

export type FeedbackArea = {
  score: number;
  strengths: string[];
  improvements: string[];
};

export type Feedback = {
  overallScore: number;
  areas: {
    prepFramework: FeedbackArea;
    content: FeedbackArea;
    delivery: FeedbackArea;
  };
};
