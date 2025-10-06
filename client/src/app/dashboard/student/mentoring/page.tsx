'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  Users,
  Star,
  BookOpen,
  MessageCircle,
  Video,
  User,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Award,
  Activity,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import API client and types
import { mentoringAPI } from '@/lib/api/mentoringClient';
import { 
  MentoringDashboard, 
  Session, 
  Mentor, 
  MentoringStats,
  SessionStatus 
} from '@/types/mentoring';

export default function MentoringDashboardPage() {
  // State management
  const [dashboardData, setDashboardData] = useState<MentoringDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await mentoringAPI.getDashboard();
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getSessionStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatSessionTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await mentoringAPI.joinSession(sessionId);
      if (response.data?.meetingLink) {
        window.open(response.data.meetingLink, '_blank');
      }
    } catch (err) {
      console.error('Failed to join session:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your mentoring dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="text-red-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Unable to load dashboard</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              onClick={loadDashboardData} 
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-200 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No mentoring data available</h3>
        <p className="text-gray-500 mb-4">Start by booking your first mentoring session</p>
        <Link href="/dashboard/student/mentoring/sessions/schedule">
          <Button>Book Your First Session</Button>
        </Link>
      </div>
    );
  }

  const { upcomingSessions, recentSessions, assignedMentors, stats } = dashboardData;

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mentoring Hub
            </h1>
            <p className="text-xl text-gray-600">
              Connect with HEI mentors for guidance and support
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-blue-900">{stats.upcomingSessions}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Sessions Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completedSessions}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Assigned Mentors</p>
                <p className="text-3xl font-bold text-purple-900">{stats.assignedMentors}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium mb-1">Session Rating</p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <Link href="/dashboard/student/mentoring/sessions">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No upcoming sessions scheduled
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Book a session with your mentors to get started
                  </p>
                  <Link href="/dashboard/student/mentoring/sessions/schedule">
                    <Button>Schedule Session</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                            <Badge className={cn("text-xs", getSessionStatusColor(session.status))}>
                              {session.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatSessionTime(session.sessionDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>with {session.mentor.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {session.canJoin && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinSession(session.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Join
                            </Button>
                          )}
                          <Link href={`/dashboard/student/mentoring/sessions/${session.id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/student/mentoring/sessions/schedule">
                  <Button
                    className="w-full h-auto py-4 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <BookOpen className="h-6 w-6" />
                      <span className="font-medium">Book a mentoring session</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/student/mentoring/sessions">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 border-gray-300 hover:border-gray-400"
                    size="lg"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span className="font-medium">View all sessions</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/student/mentoring/chat">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 border-gray-300 hover:border-gray-400"
                    size="lg"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <MessageCircle className="h-6 w-6" />
                      <span className="font-medium">Join discussion groups</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Mentors Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Your Mentors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedMentors.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No assigned mentors yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-gray-600">{mentor.designation}</p>
                          <p className="text-xs text-gray-500 mt-1">{mentor.department}</p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">{mentor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/student/mentoring/mentors/${mentor.id}`}>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/dashboard/student/mentoring/sessions/schedule?mentorId=${mentor.id}`}>
                          <Button size="sm" className="flex-1">
                            Book Session
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          Completed session with {session.mentor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatSessionTime(session.sessionDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
