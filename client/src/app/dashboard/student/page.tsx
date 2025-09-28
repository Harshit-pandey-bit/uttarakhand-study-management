'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  GraduationCap,
  BookOpen,
  Users,
  Microscope,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

// Dummy data from specifications [file:1]
const studentDashboardData = {
  student: {
    name: 'Rahul Sharma',
    class: '10th',
    school: 'Govt School Dehradun',
  },
  profileStats: {
    completedAssignments: 23,
    totalAssignments: 30,
    upcomingTests: 3,
    mentoringSessionsAttended: 12
  },
  recentActivities: [
    { type: 'assignment', title: 'Physics - Light Reflection', status: 'completed', date: '2025-09-25' },
    { type: 'session', title: 'Career Guidance with Dr. Kumar', status: 'upcoming', date: '2025-09-28' },
    { type: 'test', title: 'Mathematics Unit Test', status: 'pending', date: '2025-09-30' },
    { type: 'project', title: 'Water Conservation Project', status: 'in-progress', date: '2025-09-20' }
  ],
  quickActions: [
    'Take Holland Code Test',
    'Submit Assignment',
    'Book Mentor Session',
    'Explore STEM Tools'
  ],
  upcomingSessions: [
    {
      date: '2025-09-28',
      time: '10:00 AM',
      mentor: 'Dr. Rajesh Kumar',
      subject: 'Career Guidance',
      type: 'Individual'
    },
    {
      date: '2025-09-29',
      time: '2:00 PM',
      mentor: 'Prof. Sunita Sharma',
      subject: 'Physics Doubt Clearing',
      type: 'Group'
    }
  ]
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'session': return <Users className="h-4 w-4" />;
      case 'test': return <Award className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const completionPercentage = Math.round(
    (studentDashboardData.profileStats.completedAssignments / 
     studentDashboardData.profileStats.totalAssignments) * 100
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {greeting}, {user?.full_name || studentDashboardData.student.name}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              {studentDashboardData.student.class} • {studentDashboardData.student.school}
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                {completionPercentage}% Assignment Progress
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="w-3 h-3 mr-1" />
                {studentDashboardData.profileStats.mentoringSessionsAttended} Sessions Attended
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Assignments</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {studentDashboardData.profileStats.completedAssignments}/
                  {studentDashboardData.profileStats.totalAssignments}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <Progress value={completionPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Upcoming Tests</p>
                <p className="text-2xl font-bold text-blue-700">
                  {studentDashboardData.profileStats.upcomingTests}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Mentor Sessions</p>
                <p className="text-2xl font-bold text-purple-700">
                  {studentDashboardData.profileStats.mentoringSessionsAttended}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm font-medium">Career Progress</p>
                <p className="text-2xl font-bold text-teal-700">85%</p>
              </div>
              <Target className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Jump into key activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white justify-between">
                <span className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Take Holland Code Test</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/dashboard/student/assignments">
              <Button variant="outline" className="w-full justify-between border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <span className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>View Assignments</span>
                </span>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {studentDashboardData.profileStats.totalAssignments - studentDashboardData.profileStats.completedAssignments}
                </Badge>
              </Button>
            </Link>

            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button variant="outline" className="w-full justify-between border-blue-200 text-blue-700 hover:bg-blue-50">
                <span className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Book Mentor Session</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard/student/stem-tools">
              <Button variant="outline" className="w-full justify-between border-teal-200 text-teal-700 hover:bg-teal-50">
                <span className="flex items-center space-x-2">
                  <Microscope className="h-4 w-4" />
                  <span>Explore STEM Tools</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>Your latest learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentDashboardData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-emerald-100' : 
                      activity.status === 'upcoming' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Upcoming Sessions</span>
            </CardTitle>
            <CardDescription>Your scheduled mentor meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentDashboardData.upcomingSessions.map((session, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {session.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{session.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{session.subject}</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {session.mentor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{session.mentor}</span>
                    <span className="text-sm font-medium text-blue-600">
                      {session.time}
                    </span>
                  </div>
                </div>
              ))}
              
              <Link href="/dashboard/student/mentoring/sessions">
                <Button variant="outline" className="w-full text-sm">
                  View All Sessions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Guidance CTA */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Discover Your Dream Career! 🚀</h3>
              <p className="text-purple-100 mb-4">
                Take our Holland Code assessment to find careers that match your personality and interests.
              </p>
              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  Start Career Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <GraduationCap className="h-16 w-16 text-purple-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
