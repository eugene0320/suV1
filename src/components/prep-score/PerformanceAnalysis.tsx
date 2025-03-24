
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PerformanceAnalysisProps {
  score: number;
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ score }) => {
  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        Performance Analysis
      </h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Evaluation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">PREP Framework</TableCell>
            <TableCell>
              {score >= 80 ? (
                <span className="text-green-600">Excellent usage of the framework</span>
              ) : score >= 60 ? (
                <span className="text-yellow-600">Partial application of the framework</span>
              ) : (
                <span className="text-red-600">Limited or no application of the framework</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Negotiation Result</TableCell>
            <TableCell>
              {score >= 70 ? (
                <span className="text-green-600">Successfully completed</span>
              ) : score >= 50 ? (
                <span className="text-yellow-600">Partially successful</span>
              ) : (
                <span className="text-red-600">Needs improvement</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Engagement Level</TableCell>
            <TableCell>
              {score >= 75 ? (
                <span className="text-green-600">High engagement</span>
              ) : score >= 55 ? (
                <span className="text-yellow-600">Moderate engagement</span>
              ) : (
                <span className="text-red-600">Low engagement</span>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceAnalysis;
