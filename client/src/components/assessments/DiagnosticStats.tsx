'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DiagnosticAssessment } from '@/types/assessments';
import {
  Brain,
  Users,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp
} from 'lucide-react';

interface DiagnosticStatsProps {
  assessments: DiagnosticAssessment[];
}

export default function DiagnosticStats({ assessments }: DiagnosticStatsProps) {
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === 'active').length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;

  // Calculate total insights and critical issues
  const totalInsights = assessments.reduce((sum, a) => sum + a.insights.length, 0);
  const criticalIssues = assessments.reduce((sum, a) => 
    sum + a.insights.filter(insight => insight.severity === 'high').length, 0
  );

  // Calculate average completion rate
  const totalParticipants = assessments.reduce((sum, a) => sum + a.participants, 0);
  const totalCompleted = assessments.reduce((sum, a) => sum + a.completed, 0);
  const avgCompletionRate = totalParticipants > 0 ? Math.round((totalCompleted / totalParticipants) * 100) : 0;

  const statCards = [
    {
      title: 'Total Diagnostics',
      value: totalAssessments,
      icon: Brain,
      color: 'teal',
      bgColor: 'bg-teal-500',
      lightBg: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      title: 'Active Now',
      value: activeAssessments,
      icon: Target,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Critical Issues',
      value: criticalIssues,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-500',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Completion Rate',
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-teal-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.lightBg} p-3 rounded-full`}>
                  <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              
              {/* Additional context */}
              {stat.title === 'Total Diagnostics' && completedAssessments > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {completedAssessments} completed
                </p>
              )}
              {stat.title === 'Critical Issues' && totalInsights > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {totalInsights} total insights found
                </p>
              )}
              {stat.title === 'Completion Rate' && totalParticipants > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {totalCompleted} of {totalParticipants} completed
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
