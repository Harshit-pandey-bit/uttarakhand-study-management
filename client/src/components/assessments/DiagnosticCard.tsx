'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DiagnosticAssessment } from '@/types/assessments';
import {
  Brain,
  Users,
  Clock,
  Eye,
  BarChart3,
  Share,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  BookOpen
} from 'lucide-react';

interface DiagnosticCardProps {
  assessment: DiagnosticAssessment;
  onView: (assessment: DiagnosticAssessment) => void;
}

export default function DiagnosticCard({ assessment, onView }: DiagnosticCardProps) {
  const completionRate = assessment.participants > 0 ? Math.round((assessment.completed / assessment.participants) * 100) : 0;
  const averagePercentage = assessment.averageScore || 0;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'pre-assessment':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'skill-gap':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'learning-difficulty':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'readiness-check':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformanceIcon = () => {
    if (averagePercentage >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (averagePercentage >= 60) return <Target className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const criticalInsights = assessment.insights.filter(insight => insight.severity === 'high').length;
  const strengths = assessment.insights.filter(insight => insight.type === 'strength').length;

  return (
    <Card className="border-teal-100 hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-teal-600 transition-colors">
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
            <BookOpen className="h-4 w-4 mr-2 text-teal-400" />
            <span>{assessment.totalQuestions} questions</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-teal-400" />
            <span>{assessment.duration} min</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-teal-400" />
            <span>{assessment.participants} students</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Brain className="h-4 w-4 mr-2 text-teal-400" />
            <span>{assessment.skillAreas.length} skill areas</span>
          </div>
        </div>

        {/* Completion Progress */}
        {assessment.participants > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-teal-400" />
                Completion
              </span>
              <span className="font-medium text-gray-900">
                {assessment.completed}/{assessment.participants} ({completionRate}%)
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        )}

        {/* Performance Indicator */}
        {assessment.averageScore !== null && (
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-teal-700 flex items-center">
                {getPerformanceIcon()}
                <span className="ml-1">Average Performance</span>
              </span>
              <span className="text-xl font-bold text-teal-800">{averagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={averagePercentage} className="h-1.5" />
          </div>
        )}

        {/* Insights Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-red-50 border border-red-100 rounded p-2 text-center">
            <div className="font-bold text-red-700">{criticalInsights}</div>
            <div className="text-red-600">Critical Issues</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded p-2 text-center">
            <div className="font-bold text-green-700">{strengths}</div>
            <div className="text-green-600">Strengths Found</div>
          </div>
        </div>

        {/* Top Skill Area Performance */}
        {assessment.skillAreas.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Top Performing Area</h4>
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-medium truncate">
                  {assessment.skillAreas.reduce((prev, current) => 
                    (prev.averagePerformance > current.averagePerformance) ? prev : current
                  ).name}
                </span>
                <span className="text-teal-700 font-bold">
                  {Math.max(...assessment.skillAreas.map(area => area.averagePerformance))}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
            onClick={() => onView(assessment)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
            onClick={() => {/* Handle analytics */}}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
            onClick={() => {/* Handle share */}}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
