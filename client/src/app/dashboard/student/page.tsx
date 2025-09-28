'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
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
  Zap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { StudentDashboardData } from '@/types/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch dashboard data using apiClient
  const fetchDashboardData = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getStudentDashboard(user.id);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 space-y-8">
        {/* Loading Welcome Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white min-h-[320px]">
          <CardContent className="p-12">
            <div className="space-y-6">
              <Skeleton className="h-6 w-32 bg-white/20" />
              <Skeleton className="h-12 w-96 bg-white/20" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-24 bg-white/20 rounded-2xl" />
                <Skeleton className="h-8 w-32 bg-white/20 rounded-2xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">No data available</h2>
            <p className="text-gray-600">Unable to load your dashboard data.</p>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = Math.round((dashboardData.profileStats.completedAssignments / dashboardData.profileStats.totalAssignments) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white min-h-[320px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-6 flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <span className="text-blue-200 font-semibold text-lg">
                  Welcome back!
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                  {greeting}, {dashboardData.student.name}!
                  <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg text-4xl lg:text-5xl xl:text-6xl">
                    ✨
                  </span>
                </h1>
                
                <div className="flex items-center space-x-3 text-blue-100 mb-6">
                  <GraduationCap className="h-6 w-6" />
                  <span className="text-xl font-semibold">
                    {dashboardData.student.class} • {dashboardData.student.school}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                  <span className="font-semibold text-lg">{completionPercentage}% Assignment Progress</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <Users className="w-5 h-5 text-purple-300" />
                  <span className="font-semibold text-lg">{dashboardData.profileStats.mentoringSessionsAttended} Sessions Attended</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <GraduationCap className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Assignments Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide">
                  Assignments
                </p>
                <p className="text-3xl font-bold text-emerald-700">
                  {dashboardData.profileStats.completedAssignments}/{dashboardData.profileStats.totalAssignments}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              {completionPercentage}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Tests Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                  Upcoming Tests
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {dashboardData.profileStats.upcomingTests}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  This week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Sessions Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
                  Mentor Sessions
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {dashboardData.profileStats.mentoringSessionsAttended}
                </p>
                <p className="text-xs text-purple-600 font-medium">
                  Total attended
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Progress Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide">
                  Career Progress
                </p>
                <p className="text-3xl font-bold text-teal-700">
                  85%
                </p>
                <p className="text-xs text-teal-600 font-medium">
                  Assessment done
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
                Quick Actions
              </span>
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
                    {dashboardData.profileStats.totalAssignments - dashboardData.profileStats.completedAssignments}
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

        {/* Recent Activities */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
                Recent Activities
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600">Your latest learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                         style={{
                           background: activity.status === 'completed' ? 
                             'linear-gradient(135deg, #10b981, #059669)' :
                             activity.status === 'upcoming' ? 
                             'linear-gradient(135deg, #3b82f6, #2563eb)' :
                             activity.status === 'pending' ? 
                             'linear-gradient(135deg, #f59e0b, #d97706)' :
                             'linear-gradient(135deg, #6366f1, #4f46e5)'
                         }}>
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="lg:col-span-4 bg-white/70 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
                Upcoming Sessions
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600">Your scheduled mentor meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {dashboardData.upcomingSessions.length > 0 ? (
                dashboardData.upcomingSessions.map((session) => (
                  <div key={session.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`px-3 py-1 rounded-xl font-medium text-xs ${
                        session.type === 'Individual' ? 
                        'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
                        'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming sessions</p>
                </div>
              )}
              <Link href="/dashboard/student/mentoring/sessions">
                <Button variant="outline" className="w-full rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                  View All Sessions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Guidance CTA */}
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700"></div>
        <CardContent className="relative p-8 lg:p-12">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-yellow-300" />
                <span className="text-purple-100 font-medium">Career Discovery</span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Discover Your Dream Career!
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
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                <GraduationCap className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
