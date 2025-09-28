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
  CheckCircle,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

// Dummy data from specifications [file:1] - Logic unchanged
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 space-y-8">
      {/* SMALLER Welcome Section with NO EMOJI ANIMATION */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-400/30 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        
        <div className="absolute top-10 left-20 w-2 h-2 bg-yellow-300/60 rounded-full animate-bounce animation-delay-500"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-pink-300/60 rounded-full animate-bounce animation-delay-1500"></div>
        <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-cyan-300/60 rounded-full animate-bounce animation-delay-3000"></div>
        
        {/* REDUCED CONTAINER SIZE - Less padding and height */}
        <div className="relative z-10 p-8 lg:p-12 text-white min-h-[320px] flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Main Content Area */}
            <div className="space-y-6 flex-1">
              <div className="flex items-center space-x-3 mb-4 group-hover:scale-105 transition-transform duration-500">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse group-hover:animate-spin" />
                <span className="text-blue-200 font-semibold text-lg group-hover:text-blue-100 transition-colors duration-300">Welcome back!</span>
              </div>
              
              <div className="group-hover:translate-x-2 transition-transform duration-700">
                {/* REDUCED GREETING AND USER NAME SIZE */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent hover:from-yellow-200 hover:via-white hover:to-blue-200 transition-all duration-700 leading-tight">
                  {greeting}, {user?.full_name || studentDashboardData.student.name}!
                  {/* LARGE COLORFUL STATIC EMOJI - NO ANIMATION */}
                  <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg text-4xl lg:text-5xl xl:text-6xl" 
                        style={{ 
                          textShadow: '0 0 15px rgba(255, 255, 0, 0.4), 0 0 30px rgba(255, 165, 0, 0.2)',
                          filter: 'brightness(1.2) saturate(1.3)',
                          fontSize: 'inherit'
                        }}>
                    👋
                  </span>
                </h1>
                
                {/* School Info */}
                <div className="flex items-center space-x-3 text-blue-100 mb-6 group-hover:text-blue-50 transition-colors duration-300">
                  <GraduationCap className="h-6 w-6 group-hover:rotate-12 transition-transform duration-500" />
                  <span className="text-xl font-semibold">
                    {studentDashboardData.student.class} • {studentDashboardData.student.school}
                  </span>
                </div>
              </div>

              {/* Progress Pills */}
              <div className="flex flex-wrap gap-3 group-hover:translate-y-1 transition-transform duration-500">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <TrendingUp className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-semibold text-lg">{completionPercentage}% Assignment Progress</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <Users className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-semibold text-lg">{studentDashboardData.profileStats.mentoringSessionsAttended} Sessions Attended</span>
                </div>
              </div>
            </div>
            
            {/* Right Icon */}
            <div className="hidden lg:block relative group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl hover:shadow-4xl hover:bg-white/20 transition-all duration-500">
                <GraduationCap className="h-16 w-16 text-white drop-shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce hover:animate-spin hover:scale-125 transition-all duration-300"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-pink-400 rounded-full animate-pulse hover:animate-bounce hover:scale-150 transition-all duration-300"></div>
              <div className="absolute top-4 -left-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-1000 hover:animate-spin transition-all duration-300"></div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-linear rounded-3xl"></div>
      </div>

      {/* Stats Grid - Keep existing hover animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/5 to-teal-300/5 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
          
          <CardContent className="relative p-6 group-hover:transform group-hover:translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl transition-all duration-500">
                <CheckCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <div className="text-right group-hover:transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide group-hover:text-emerald-700 transition-colors duration-200">Assignments</p>
                <p className="text-3xl font-bold text-emerald-700 group-hover:text-4xl transition-all duration-300">
                  {studentDashboardData.profileStats.completedAssignments}/
                  {studentDashboardData.profileStats.totalAssignments}
                </p>
              </div>
            </div>
            
            {/* GREEN PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-3 group-hover:h-4 transition-all duration-300">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-emerald-600 mt-2 font-medium group-hover:font-semibold transition-all duration-200">{completionPercentage}% Complete</p>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/5 to-indigo-300/5 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
          
          <CardContent className="relative p-6 group-hover:transform group-hover:translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl transition-all duration-500">
                <Award className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <div className="text-right group-hover:transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide group-hover:text-blue-700 transition-colors duration-200">Upcoming Tests</p>
                <p className="text-3xl font-bold text-blue-700 group-hover:text-4xl transition-all duration-300">
                  {studentDashboardData.profileStats.upcomingTests}
                </p>
                <p className="text-xs text-blue-600 font-medium group-hover:font-semibold transition-all duration-200">This week</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-300/5 to-pink-300/5 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
          
          <CardContent className="relative p-6 group-hover:transform group-hover:translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl transition-all duration-500">
                <Users className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <div className="text-right group-hover:transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide group-hover:text-purple-700 transition-colors duration-200">Mentor Sessions</p>
                <p className="text-3xl font-bold text-purple-700 group-hover:text-4xl transition-all duration-300">
                  {studentDashboardData.profileStats.mentoringSessionsAttended}
                </p>
                <p className="text-xs text-purple-600 font-medium group-hover:font-semibold transition-all duration-200">Total attended</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-300/5 to-cyan-300/5 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
          
          <CardContent className="relative p-6 group-hover:transform group-hover:translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl transition-all duration-500">
                <Target className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-teal-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <div className="text-right group-hover:transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide group-hover:text-teal-700 transition-colors duration-200">Career Progress</p>
                <p className="text-3xl font-bold text-teal-700 group-hover:text-4xl transition-all duration-300">85%</p>
                <p className="text-xs text-teal-600 font-medium group-hover:font-semibold transition-all duration-200">Assessment done</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - SIMPLIFIED SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simplified Quick Actions */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Jump into key activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
              <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-semibold">Take Holland Code Test</span>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </Link>
            
            <Link href="/dashboard/student/assignments">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300">
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-semibold">View Assignments</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {studentDashboardData.profileStats.totalAssignments - studentDashboardData.profileStats.completedAssignments}
                  </Badge>
                </span>
              </Button>
            </Link>

            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">Book Mentor Session</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>

            <Link href="/dashboard/student/stem-tools">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300">
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Microscope className="h-4 w-4" />
                    <span className="font-semibold">Explore STEM Tools</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Simplified Recent Activities */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">Recent Activities</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Your latest learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentDashboardData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    activity.status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 
                    activity.status === 'upcoming' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 
                    activity.status === 'pending' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    'bg-gradient-to-br from-indigo-400 to-indigo-600'
                  }`}>
                    <div className="text-white">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  
                  <Badge className={`${getStatusColor(activity.status)} text-xs px-2 py-1 rounded-lg font-medium`}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simplified Upcoming Sessions */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">Upcoming Sessions</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Your scheduled mentor meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {studentDashboardData.upcomingSessions.map((session, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`px-3 py-1 rounded-xl font-medium text-xs ${
                      session.type === 'Individual' 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                        : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
                    }`}>
                      {session.type}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">{session.date}</span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">{session.subject}</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                          {session.mentor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 font-medium">{session.mentor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-bold text-blue-600">{session.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/dashboard/student/mentoring/sessions">
                <Button variant="outline" className="w-full rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                  View All Sessions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simplified Career Guidance CTA */}
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700"></div>
        
        <CardContent className="relative p-8 lg:p-12">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-yellow-300" />
                <span className="text-purple-100 font-medium">Career Discovery</span>
              </div>
              
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Discover Your Dream Career! 🚀
                </h3>
                <p className="text-purple-100 text-lg leading-relaxed mb-6 max-w-2xl">
                  Take our comprehensive Holland Code assessment to find careers that perfectly match your personality, interests, and strengths.
                </p>
              </div>

              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="flex items-center space-x-3">
                    <span>Start Career Assessment</span>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                <GraduationCap className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom animation styles */}
      <style jsx>{`
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .shadow-4xl {
          box-shadow: 0 50px 100px -12px rgb(0 0 0 / 0.25);
        }
      `}</style>
    </div>
  );
}
