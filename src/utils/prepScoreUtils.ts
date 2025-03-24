
import React from 'react';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Function to format duration in seconds to mm:ss format
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Function to format date to a more readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get score color based on score value
export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

// Get score background based on score value
export const getScoreBackground = (score: number): string => {
  if (score >= 80) return "bg-green-50";
  if (score >= 60) return "bg-yellow-50"; 
  return "bg-red-50";
};

// Get score icon based on score value - using createElement instead of JSX
export const getScoreIcon = (score: number): React.ReactNode => {
  if (score >= 80) return React.createElement(CheckCircle, { className: "text-green-600 w-5 h-5" });
  if (score >= 60) return React.createElement(Info, { className: "text-yellow-600 w-5 h-5" });
  return React.createElement(AlertTriangle, { className: "text-red-600 w-5 h-5" });
};
