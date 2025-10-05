'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SummativeAssessment } from '@/types/assessments';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Award,
  TrendingUp,
  Users
} from 'lucide-react';

interface SummativeStatsProps {
  assessments: SummativeAssessment[];
}

export default function SummativeStats({ assessments }: SummativeStatsProps) {
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === 'active').length;
  const scheduledAssessments = assessments.filter(a => a.status === 'scheduled').length;
  const completedAssessments = assessments.filter(a => a.status === 'closed').length;

  // Calculate average score across all completed assessments
  const completedWithScores = assessments.filter(a => a.averageScore !== null);
  const overallAverage = completedWithScores.length > 0
    ? Math.round(completedWithScores.reduce((sum, a) => sum + (a.averageScore || 0), 0) / completedWithScores.length)
    : 0;

  // Calculate total students across all assessments
  const totalStudents = assessments.reduce((sum, a) => sum + a.total, 0);

  const statCards = [
    {
      title: 'Total Assessments',
      value: totalAssessments,
      icon: GraduationCap,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Active Now',
      value: activeAssessments,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Scheduled',
      value: scheduledAssessments,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: `${overallAverage}%`,
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
          <Card key={index} className="border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
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
              {stat.title === 'Total Assessments' && completedAssessments > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {completedAssessments} completed
                </p>
              )}
              {stat.title === 'Average Score' && completedWithScores.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  From {completedWithScores.length} completed assessments
                </p>
              )}
              {stat.title === 'Active Now' && totalStudents > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {totalStudents} students enrolled
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
