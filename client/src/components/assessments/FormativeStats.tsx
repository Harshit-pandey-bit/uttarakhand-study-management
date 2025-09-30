'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormativeAssessment } from '@/types/assessments';
import {
  Activity,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';

interface FormativeStatsProps {
  assessments: FormativeAssessment[];
}

export default function FormativeStats({ assessments }: FormativeStatsProps) {
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === 'active').length;
  const completedAssessments = assessments.filter(a => a.status === 'closed').length;
  const draftAssessments = assessments.filter(a => a.status === 'draft').length;

  // Calculate average completion rate
  const totalStudents = assessments.reduce((sum, a) => sum + a.total, 0);
  const totalCompleted = assessments.reduce((sum, a) => sum + a.completed, 0);
  const avgCompletionRate = totalStudents > 0 ? Math.round((totalCompleted / totalStudents) * 100) : 0;

  // Calculate average score
  const assessmentsWithScores = assessments.filter(a => a.avg !== null);
  const avgScore = assessmentsWithScores.length > 0 
    ? Math.round(assessmentsWithScores.reduce((sum, a) => sum + (a.avg || 0), 0) / assessmentsWithScores.length)
    : 0;

  const statCards = [
    {
      title: 'Total Assessments',
      value: totalAssessments,
      icon: Activity,
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Active Now',
      value: activeAssessments,
      icon: Clock,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed',
      value: completedAssessments,
      icon: CheckCircle2,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Avg Completion',
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
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
              {stat.title === 'Total Assessments' && draftAssessments > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {draftAssessments} in draft
                </p>
              )}
              {stat.title === 'Avg Completion' && totalStudents > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {totalCompleted} of {totalStudents} responses
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
