'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SummativeAssessment } from '@/types/assessments';
import {
  GraduationCap,
  Clock,
  Calendar,
  Users,
  Eye,
  BarChart3,
  Edit,
  Share,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

interface SummativeCardProps {
  assessment: SummativeAssessment;
  onView: (assessment: SummativeAssessment) => void;
}

export default function SummativeCard({ assessment, onView }: SummativeCardProps) {
  const submissionRate = assessment.total > 0 ? Math.round((assessment.submitted / assessment.total) * 100) : 0;
  const passingRate = assessment.averageScore !== null ? Math.round((assessment.averageScore / assessment.totalMarks) * 100) : 0;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
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
      case 'mid-term':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'final-exam':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'project':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'research-paper':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'presentation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'portfolio':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="border-emerald-100 hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-emerald-600 transition-colors">
              {assessment.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{assessment.subject} • {assessment.class}</p>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getTypeBadgeStyle(assessment.type)}`}>
                {formatType(assessment.type)}
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
            <Award className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{assessment.totalMarks} marks</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Target className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{assessment.weightage}% weightage</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-emerald-400" />
            <span>Due {formatDate(assessment.dueDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{assessment.total} students</span>
          </div>
        </div>

        {/* Duration for timed assessments */}
        {assessment.duration > 0 && (
          <div className="flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-lg p-2">
            <Clock className="h-4 w-4 mr-2 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              {Math.round(assessment.duration / 60)}h {assessment.duration % 60}min
            </span>
          </div>
        )}

        {/* Submission Progress */}
        {assessment.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-1 text-emerald-400" />
                Submissions
              </span>
              <span className="font-medium text-gray-900">
                {assessment.submitted}/{assessment.total} ({submissionRate}%)
              </span>
            </div>
            <Progress value={submissionRate} className="h-2" />
          </div>
        )}

        {/* Average Score Display */}
        {assessment.averageScore !== null && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-700">Class Average</span>
              <span className="text-xl font-bold text-emerald-800">
                {assessment.averageScore}/{assessment.totalMarks}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-600">Pass Rate: {passingRate}%</span>
              <span className="text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {Math.round((assessment.averageScore / assessment.totalMarks) * 100)}%
              </span>
            </div>
            <Progress value={(assessment.averageScore / assessment.totalMarks) * 100} className="h-1.5 mt-1" />
          </div>
        )}

        {/* Passing Marks Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
          <span>Passing Marks: {assessment.passingMarks}/{assessment.totalMarks}</span>
          <span>Pass %: {Math.round((assessment.passingMarks / assessment.totalMarks) * 100)}%</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
            onClick={() => onView(assessment)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
            onClick={() => {/* Handle analytics */}}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
            onClick={() => {/* Handle share */}}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
