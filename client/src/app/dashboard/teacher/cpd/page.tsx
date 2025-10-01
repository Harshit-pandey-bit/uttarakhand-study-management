'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  Target,
  ArrowRight,
  Star,
  CheckCircle2,
  Play,
  Download,
  Share,
  Bell,
  Trophy,
  Brain,
  GraduationCap,
  Shield
} from 'lucide-react';

interface PDOverviewData {
  stats: {
    totalCourses: number;
    completedCourses: number;
    certificatesEarned: number;
    totalHours: number;
    currentStreak: number;
    overallProgress: number;
  };
  quickActions: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    path: string;
    count?: number;
  }[];
  recentActivity: {
    type: 'completion' | 'enrollment' | 'certificate' | 'achievement';
    title: string;
    description: string;
    time: string;
    icon: React.ComponentType<any>;
    color: string;
  }[];
  upcomingDeadlines: {
    title: string;
    course: string;
    dueDate: string;
    progress: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  recommendations: {
    title: string;
    provider: string;
    duration: string;
    rating: number;
    enrolled: number;
    category: string;
  }[];
}

const professionalDevelopmentData: PDOverviewData = {
  stats: {
    totalCourses: 15,
    completedCourses: 8,
    certificatesEarned: 12,
    totalHours: 284,
    currentStreak: 15,
    overallProgress: 73
  },
  quickActions: [
    {
      title: 'DIKSHA Courses',
      description: 'Access comprehensive training courses',
      icon: BookOpen,
      color: 'bg-indigo-500',
      path: '/dashboard/teacher/professional-development/diksha',
      count: 45
    },
    {
      title: 'NISHTHA Programs',
      description: 'National teacher training initiatives',
      icon: GraduationCap,
      color: 'bg-emerald-500',
      path: '/dashboard/teacher/professional-development/nishtha',
      count: 18
    },
    {
      title: 'My Certificates',
      description: 'View and download certificates',
      icon: Award,
      color: 'bg-purple-500',
      path: '/dashboard/teacher/professional-development/certificates',
      count: 12
    }
  ],
  recentActivity: [
    {
      type: 'certificate',
      title: 'Certificate Earned',
      description: 'NISHTHA - Foundational Literacy and Numeracy',
      time: '2 hours ago',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      type: 'completion',
      title: 'Course Completed',
      description: 'Digital Tools for Classroom Management',
      time: '1 day ago',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      type: 'enrollment',
      title: 'New Enrollment',
      description: 'School Leadership Excellence Program',
      time: '3 days ago',
      icon: Play,
      color: 'text-blue-600'
    },
    {
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Completed 15-day learning streak',
      time: '1 week ago',
      icon: Trophy,
      color: 'text-orange-600'
    }
  ],
  upcomingDeadlines: [
    {
      title: 'ICT Integration Module 5',
      course: 'Digital Teaching Methods',
      dueDate: '2025-10-05',
      progress: 75,
      priority: 'high'
    },
    {
      title: 'School Leadership Assessment',
      course: 'Educational Leadership Program',
      dueDate: '2025-10-12',
      progress: 45,
      priority: 'medium'
    },
    {
      title: 'Mathematics Pedagogy Final',
      course: 'Advanced Math Teaching',
      dueDate: '2025-10-20',
      progress: 20,
      priority: 'low'
    }
  ],
  recommendations: [
    {
      title: 'AI in Education',
      provider: 'DIKSHA - NCERT',
      duration: '15 hours',
      rating: 4.8,
      enrolled: 12500,
      category: 'Technology'
    },
    {
      title: 'Inclusive Classroom Practices',
      provider: 'NIEPA',
      duration: '20 hours',
      rating: 4.7,
      enrolled: 8900,
      category: 'Pedagogy'
    },
    {
      title: 'Assessment Strategies',
      provider: 'CBSE',
      duration: '12 hours',
      rating: 4.6,
      enrolled: 15600,
      category: 'Assessment'
    }
  ]
};

export default function ProfessionalDevelopmentPage() {
  const router = useRouter();
  const [data] = useState(professionalDevelopmentData);

  const handleQuickAction = (path: string) => {
    router.push(path);
  };

  const handleViewAllActivity = () => {
    // Could navigate to a detailed activity page
    console.log('Viewing all activity');
  };

  const handleViewAllDeadlines = () => {
    // Could navigate to a detailed deadlines page
    console.log('Viewing all deadlines');
  };

  const handleEnrollRecommendation = (title: string) => {
    console.log('Enrolling in:', title);
    // Implement enrollment logic
  };

  const handleShareProgress = () => {
    const shareData = {
      title: 'Professional Development Progress',
      text: `I've completed ${data.stats.completedCourses} courses and earned ${data.stats.certificatesEarned} certificates in my professional development journey!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Progress shared to clipboard!');
    }
  };

  const handleDownloadReport = () => {
    console.log('Downloading progress report');
    // Implement PDF download logic
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-indigo-500" />
            Professional Development
          </h1>
          <p className="text-gray-600 mt-2">
            Track your learning journey and enhance your teaching skills
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={handleShareProgress} className="bg-indigo-600 hover:bg-indigo-700">
            <Share className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="lg:col-span-2 border-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Learning Hours</p>
                <p className="text-3xl font-bold text-indigo-600">{data.stats.totalHours}</p>
                <p className="text-xs text-gray-500 mt-1">Across all programs</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{data.stats.completedCourses}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{data.stats.certificatesEarned}</div>
            <div className="text-sm text-gray-600 mt-1">Certificates</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.stats.totalCourses}</div>
            <div className="text-sm text-gray-600 mt-1">Total Courses</div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{data.stats.currentStreak}</div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="border-indigo-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <Badge className="bg-indigo-100 text-indigo-700">{data.stats.overallProgress}% Complete</Badge>
          </div>
          <Progress value={data.stats.overallProgress} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            You're making excellent progress! {100 - data.stats.overallProgress}% more to reach your professional development goals.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="border-indigo-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <Target className="h-5 w-5 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleQuickAction(action.path)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        {action.count && (
                          <Badge variant="outline">{action.count}</Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-indigo-600">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-600">{action.description}</p>
                      <div className="flex items-center mt-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-indigo-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="outline" size="sm" onClick={handleViewAllActivity}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full bg-white ${activity.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Course Recommendations */}
          <Card className="border-indigo-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recommended Courses</h3>
                <Brain className="h-5 w-5 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{course.provider}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                          {course.rating}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {course.enrolled.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="outline" className="mb-2">{course.category}</Badge>
                      <Button 
                        size="sm" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => handleEnrollRecommendation(course.title)}
                      >
                        Enroll
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Deadlines & Notifications */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="border-red-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-red-500" />
                  Upcoming Deadlines
                </h3>
                <Button variant="outline" size="sm" onClick={handleViewAllDeadlines}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getPriorityStyle(deadline.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{deadline.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {deadline.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{deadline.course}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{deadline.progress}%</span>
                      </div>
                      <Progress value={deadline.progress} className="h-2" />
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {new Date(deadline.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Showcase */}
          <Card className="border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Latest Achievement</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-yellow-800 mb-2">15-Day Learning Streak!</h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Congratulations on maintaining your learning momentum for 15 consecutive days!
                </p>
                <Button 
                  size="sm" 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={handleShareProgress}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-gray-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">This Month</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Courses Started</span>
                  <span className="font-semibold text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hours Completed</span>
                  <span className="font-semibold text-green-600">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificates Earned</span>
                  <span className="font-semibold text-purple-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Learning Streak</span>
                  <span className="font-semibold text-orange-600">{data.stats.currentStreak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
