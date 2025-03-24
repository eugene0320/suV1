
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getScoreBackground = (score: number) => {
  if (score >= 80) return "bg-green-50";
  if (score >= 60) return "bg-yellow-50"; 
  return "bg-red-50";
};

export const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-yellow-600";
  return "bg-red-600";
};

export const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="text-green-600 w-5 h-5" />;
  if (score >= 60) return <Info className="text-yellow-600 w-5 h-5" />;
  return <AlertTriangle className="text-red-600 w-5 h-5" />;
};
