'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  BookOpen,
  Calendar,
  Settings,
  Activity,
  Clock,
  School,
  Sparkles,
  MapPin,
  Users,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { apiService } from '@/lib/services/api';
import { DashboardResponseDto } from '@/lib/services/api';

export default function SchoolAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'achievement': return 'bg-emerald-100 text-emerald-800';
      case 'admission': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'student_achievement': return <Award className="h-4 w-4" />;
      case 'admission': return <BookOpen className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'infrastructure': return <Settings className="h-4 w-4" />;
      case 'teacher_training': return <BookOpen className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Failed to load dashboard'}</p>
          <button 
            onClick={fetchDashboardData} 
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-pink-50/30 p-6 space-y-8">
      {/* Enhanced Hero Welcome Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-700 to-rose-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white min-h-[320px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-6 flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <span className="text-rose-200 font-semibold text-lg">
                  School Administration Portal
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {greeting}!
                  <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg text-4xl lg:text-5xl xl:text-6xl">
                    🏫
                  </span>
                </h1>
                
                <div className="flex items-center space-x-3 text-rose-100 mb-2">
                  <School className="h-6 w-6" />
                  <span className="text-xl font-semibold">
                    {dashboardData.schoolOverview.schoolName}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-rose-200 mb-6">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{dashboardData.schoolOverview.district}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>{dashboardData.schoolOverview.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <Users className="w-5 h-5 text-rose-300" />
                  <span className="font-semibold text-lg">{dashboardData.schoolOverview.totalStudents} Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <UserCheck className="w-5 h-5 text-pink-300" />
                  <span className="font-semibold text-lg">{dashboardData.schoolOverview.totalTeachers} Teachers</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <BarChart3 className="w-5 h-5 text-emerald-300" />
                  <span className="font-semibold text-lg">{dashboardData.activityStats.totalActivities} Activities</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <School className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Only 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Students Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {dashboardData.schoolOverview.totalStudents}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData.schoolOverview.totalStudents / 500) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              Active enrollment
            </p>
          </CardContent>
        </Card>

        {/* Teaching Staff Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                  Teaching Staff
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {dashboardData.schoolOverview.totalTeachers}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dashboardData.schoolOverview.totalTeachers / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium">
              Active faculty
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activities - Full Width */}
      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
              Activities
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600">Latest school updates and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.announcements.length > 0 ? (
              dashboardData.announcements.slice(0, 6).map((announcement) => (
                <div key={announcement.id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                       style={{
                         background: announcement.badgeType === 'Achievement' ? 
                           'linear-gradient(135deg, #10b981, #059669)' :
                           announcement.badgeType === 'Admission' ? 
                           'linear-gradient(135deg, #3b82f6, #2563eb)' :
                           announcement.badgeType === 'Event' ? 
                           'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #6366f1, #4f46e5)'
                       }}>
                    <div className="text-white">
                      {getActivityIcon(announcement.badgeType)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <Badge className={`text-xs px-2 py-1 rounded-lg font-medium ${getStatusColor(announcement.badgeType)}`}>
                      {announcement.badgeType}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 col-span-3">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
