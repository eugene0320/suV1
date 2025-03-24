
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, formatDuration, getScoreBackground, getScoreColor, getScoreIcon } from '@/utils/prepScoreUtils';

interface PerformanceOverviewProps {
  score: number;
  date: string;
  duration: number;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ score, date, duration }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Score card */}
      <div className={`p-4 rounded-lg ${getScoreBackground(score)} flex flex-col items-center justify-center shadow-sm`}>
        <p className="text-sm font-medium mb-1 text-gray-600">PREP Score</p>
        <div className="flex items-center space-x-2">
          {getScoreIcon(score)}
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      
      {/* Date card */}
      <div className="p-4 rounded-lg bg-blue-50 flex flex-col items-center justify-center shadow-sm">
        <p className="text-sm font-medium mb-1 text-gray-600">Conversation Date</p>
        <div className="flex items-center space-x-2">
          <Calendar className="text-blue-600 w-5 h-5" />
          <span className="text-sm font-semibold text-gray-800">
            {formatDate(date)}
          </span>
        </div>
      </div>
      
      {/* Duration card */}
      <div className="p-4 rounded-lg bg-indigo-50 flex flex-col items-center justify-center shadow-sm">
        <p className="text-sm font-medium mb-1 text-gray-600">Call Duration</p>
        <div className="flex items-center space-x-2">
          <Clock className="text-indigo-600 w-5 h-5" />
          <span className="text-sm font-semibold text-gray-800">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;
