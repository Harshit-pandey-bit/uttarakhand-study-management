'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  School,
  Target,
  Clock
} from 'lucide-react';
import heiMentorAPI from '@/lib/api/hei-mentor-client';
import type { HEIMentorDashboardData, HEIMentorDashboardStats } from '@/types/hei-mentor';

// Define default stats object with proper typing
const defaultStats: HEIMentorDashboardStats = {
  assignedStudents: 0,
  studentsActiveThisWeek: 0,
  studentsCompletedHollandTest: 0,
  studentsNeedingAttention: 0,
  pendingSubmissions: 0,
  ungradedAssignments: 0,
  upcomingSessionsThisWeek: 0,
  studentsWithCareerPlans: 0,
  averageStudentProgress: 0,
};

export default function HEIMentorDashboard() {
  const [dashboardData, setDashboardData] = useState<HEIMentorDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await heiMentorAPI.getDashboard();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Unable to load your dashboard data.</p>
          <Button onClick={fetchDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h2>
          <p className="text-gray-500">Dashboard data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  // Safe destructuring with typed defaults
  const { 
    mentor, 
    stats = defaultStats,  // Now properly typed!
    upcomingSessions = [], 
    recentActivity = [], 
    assignedSchools = [], 
    pendingActions = [] 
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src={mentor?.user?.profile_picture} />
              <AvatarFallback className="bg-white/10 text-white font-bold">
                {mentor?.user?.name?.split(' ').map(n => n[0]).join('') || 'HM'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {mentor?.user?.name || 'HEI Mentor'}!
              </h1>
              <p className="text-blue-100">
                {mentor?.profile?.designation || 'Mentor'}, {mentor?.profile?.department || 'Department'}
              </p>
              <p className="text-blue-200 text-sm">
                {mentor?.hei?.name || 'Higher Education Institution'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{assignedSchools?.length || 0}</div>
              <div className="text-blue-200 text-sm">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.assignedStudents}</div>
              <div className="text-blue-200 text-sm">Assigned Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.studentsActiveThisWeek}</div>
              <div className="text-blue-200 text-sm">Active This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.upcomingSessionsThisWeek}</div>
              <div className="text-blue-200 text-sm">Sessions This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Stats & Actions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Need Attention</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.studentsNeedingAttention}
                      </p>
                      <p className="text-xs text-gray-500">Students falling behind</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Career Tests Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.studentsCompletedHollandTest}
                      </p>
                      <p className="text-xs text-gray-500">
                        out of {stats.assignedStudents} students
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.ungradedAssignments + stats.pendingSubmissions}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.ungradedAssignments} to grade, {stats.pendingSubmissions} submissions
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions && upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.slice(0, 3).map((session, index) => (
                      <div key={session?.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{session?.title || 'Session'}</h4>
                          <p className="text-sm text-gray-600">{session?.subject || 'Subject'}</p>
                          <p className="text-xs text-gray-500">
                            {session?.participants?.length || 0} participants
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {session?.session_date ? new Date(session.session_date).toLocaleDateString('en-IN') : 'Date TBD'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session?.session_date ? new Date(session.session_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming sessions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Session</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Create Assignment</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <MessageSquare className="h-6 w-6" />
                    <span>Open Chat</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Schools & Activity */}
          <div className="space-y-6">

            {/* Assigned Schools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  Assigned Schools
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignedSchools && assignedSchools.length > 0 ? (
                  <div className="space-y-3">
                    {assignedSchools.slice(0, 4).map((school, index) => (
                      <div key={school?.id || index} className="p-3 border rounded-lg hover:bg-gray-50">
                        <h4 className="font-semibold text-sm">{school?.name || 'School Name'}</h4>
                        <p className="text-xs text-gray-500">{school?.district || 'District'}</p>
                        <div className="mt-1 flex justify-between text-xs">
                          <span>{school?.studentsAssigned || 0} students</span>
                          <span>{school?.averageProgress || 0}% avg progress</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <School className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No assigned schools</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={activity?.id || index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity?.title || 'Activity'}</p>
                          <p className="text-xs text-gray-500">{activity?.description || 'Description'}</p>
                          <p className="text-xs text-gray-400">
                            {activity?.timestamp ? new Date(activity.timestamp).toLocaleString('en-IN') : 'Recently'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
