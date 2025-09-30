'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormativeAssessment } from '@/types/assessments';
import {
  FileText,
  Clock,
  Calendar,
  Activity,
  Eye,
  BarChart3,
  Edit,
  Users,
  Share
} from 'lucide-react';

interface FormativeCardProps {
  assessment: FormativeAssessment;
  onView: (assessment: FormativeAssessment) => void;
}

export default function FormativeCard({ assessment, onView }: FormativeCardProps) {
  const completionRate = assessment.total > 0 ? Math.round((assessment.completed / assessment.total) * 100) : 0;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'exit-ticket':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'poll':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-indigo-100 hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
              {assessment.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{assessment.subject} • {assessment.class}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${getTypeBadgeStyle(assessment.type)}`}>
                {assessment.type.replace('-', ' ')}
              </Badge>
              <Badge className={`text-xs ${getStatusBadgeStyle(assessment.status)}`}>
                {assessment.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assessment Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{assessment.questions} questions</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{assessment.duration} min</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
            <span>Due {formatDate(assessment.due)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{assessment.total} students</span>
          </div>
        </div>

        {/* Completion Progress */}
        {assessment.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-1 text-indigo-400" />
                Completion
              </span>
              <span className="font-medium text-gray-900">
                {assessment.completed}/{assessment.total} ({completionRate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Average Score Display */}
        {assessment.avg !== null && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-700">Class Average</span>
              <span className="text-xl font-bold text-indigo-800">{assessment.avg}%</span>
            </div>
            <div className="mt-1">
              <div className="w-full bg-indigo-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full" 
                  style={{ width: `${assessment.avg}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={() => onView(assessment)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={() => {/* Handle analytics */}}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={() => {/* Handle share */}}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
