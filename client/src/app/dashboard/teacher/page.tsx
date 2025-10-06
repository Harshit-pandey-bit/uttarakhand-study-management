'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Brain, 
  Award, 
  Calendar, 
  Video, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  GraduationCap
} from 'lucide-react';

// Teacher dashboard data with proper typing
const teacherDashboardData = {
  teacher: { 
    name: "Priya Verma", 
    subject: "Mathematics", 
    classes: ["9th A", "10th B"], 
    school: "Govt Senior Secondary School Dehradun",
    experience: "8 years",
    avatar: "/teachers/priya-verma.jpg"
  },
  classStats: { 
    totalStudents: 65, 
    assignmentsGraded: 45, 
    pendingGrading: 12, 
    avgPerformance: 77,
    attendanceRate: 89,
    activeProjects: 8
  },
  cpdProgress: { 
    coursesCompleted: 3, 
    totalCourses: 5, 
    overallProgress: 60,
    certificates: ["DIKSHA Teaching Methods", "NISHTHA", "Inclusive Education"],
    upcomingDeadline: "Digital Assessment - Due Oct 5"
  },
  recentActivity: [
    { 
      action: "Generated assignment", 
      subject: "Quadratic Equations", 
      time: "2 hours ago",
      class: "10th B"
    },
    { 
      action: "Reviewed student portfolio", 
      student: "Rahul Sharma", 
      time: "4 hours ago",
      class: "9th A"
    },
    { 
      action: "Completed DIKSHA module", 
      module: "Assessment Strategies", 
      time: "1 day ago",
      points: 50
    },
    { 
      action: "Created lesson plan", 
      subject: "Trigonometry", 
      time: "2 days ago",
      class: "10th B"
    },
    { 
      action: "Attended virtual lab", 
      subject: "Physics Experiments", 
      time: "3 days ago",
      class: "9th A"
    }
  ]
};

// Quick Stats Card Component
interface QuickStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  description 
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <Badge variant="secondary" className="text-xs">
                {change}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main Teacher Dashboard Component
export default function TeacherDashboardHome() {
  const [data] = useState(teacherDashboardData);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-violet-200">
            <AvatarImage src={data.teacher.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-semibold">
              {data.teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {data.teacher.name}!
            </h1>
            <p className="text-gray-600">
              {data.teacher.subject} Teacher • {data.teacher.school}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <Badge 
                variant="outline" 
                className="text-xs border-violet-200 text-violet-700"
              >
                {data.teacher.experience} Experience
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs border-violet-200 text-violet-700"
              >
                Classes: {data.teacher.classes.join(', ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Total Students Card Only */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
        <QuickStatCard
          title="Total Students"
          value={data.classStats.totalStudents}
          change="Active"
          icon={Users}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          description="Across all classes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - CPD */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Development */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-500" />
                  Professional Development
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-violet-200 text-violet-700 hover:bg-violet-50"
                >
                  View Courses
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">{data.cpdProgress.overallProgress}%</span>
                </div>
                <Progress value={data.cpdProgress.overallProgress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {data.cpdProgress.coursesCompleted} of {data.cpdProgress.totalCourses} courses completed
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Certificates</h4>
                <div className="flex flex-wrap gap-2">
                  {data.cpdProgress.certificates.map((cert, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-violet-100 text-violet-800"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Upcoming:</span> {data.cpdProgress.upcomingDeadline}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-emerald-500" />
                Recent Activity
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 bg-violet-50 rounded-lg border border-violet-100"
                  >
                    <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                        {activity.subject && `: ${activity.subject}`}
                        {activity.student && ` for ${activity.student}`}
                        {activity.module && `: ${activity.module}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.class && `${activity.class} • `}
                        {activity.time}
                        {activity.points && ` • +${activity.points} CPD points`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Assignment
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Lesson Plan
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <Users className="h-4 w-4 mr-2" />
                View Student Progress
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <Award className="h-4 w-4 mr-2" />
                Continue CPD Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
