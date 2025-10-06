// src/app/dashboard/hei-mentor/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  School,
  MessageCircle,
  Video,
  ArrowRight,
  CheckCircle,
  Award,
  Bell,
  Clock,
  Plus,
  Eye,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { HEIMentorDashboardData } from '@/types/hei-mentor';

export default function HEIMentorDashboard() {
  const [dashboardData, setDashboardData] = useState<HEIMentorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await heiMentorAPI.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { mentor, stats, upcomingSessions, recentActivity, assignedSchools, pendingActions } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarFallback className="bg-white/10 text-white font-bold">
                {mentor.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {mentor.user.name}!
              </h1>
              <p className="text-blue-100">
                {mentor.profile.designation}, {mentor.profile.department}
              </p>
              <p className="text-blue-200 text-sm">
                {mentor.hei.name}
              </p>
              <div className="flex items-center mt-2 space-x-3">
                <Badge className="bg-green-500/20 text-green-100 border-green-400">
                  Active Mentor
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Mentoring Students Across</p>
            <p className="text-xl font-bold">{assignedSchools.length} Schools</p>
          </div>
        </div>
      </div>

      {/* Updated Stats Grid - Actionable Metrics Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Assigned Students</p>
                <p className="text-2xl font-bold text-blue-900">{stats.assignedStudents}</p>
                <p className="text-xs text-blue-600">
                  {stats.studentsActiveThisWeek} active this week
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Need Attention</p>
                <p className="text-2xl font-bold text-orange-900">{stats.studentsNeedingAttention}</p>
                <p className="text-xs text-orange-600">Students falling behind</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Career Tests Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.studentsCompletedHollandTest}</p>
                <p className="text-xs text-green-600">
                  out of {stats.assignedStudents} students
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Pending Actions</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.ungradedAssignments + stats.pendingSubmissions}
                </p>
                <p className="text-xs text-purple-600">
                  {stats.ungradedAssignments} to grade, {stats.pendingSubmissions} submissions
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Student Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((stats.studentsCompletedHollandTest / stats.assignedStudents) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Holland Tests Complete</p>
            </div>
            <Progress 
              value={(stats.studentsCompletedHollandTest / stats.assignedStudents) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((stats.studentsWithCareerPlans / stats.assignedStudents) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Have Career Plans</p>
            </div>
            <Progress 
              value={(stats.studentsWithCareerPlans / stats.assignedStudents) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-purple-600">
                {stats.averageStudentProgress}%
              </div>
              <p className="text-sm text-gray-600">Avg Progress</p>
            </div>
            <Progress value={stats.averageStudentProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-orange-600">
                {stats.upcomingSessionsThisWeek}
              </div>
              <p className="text-sm text-gray-600">Sessions This Week</p>
            </div>
            <Calendar className="h-8 w-8 mx-auto text-orange-600" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Link href="/dashboard/hei-mentor/mentoring/sessions/schedule">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </Link>
                <Link href="/dashboard/hei-mentor/mentoring/sessions">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.subject}</p>
                      <p className="text-xs text-gray-500">
                        {session.participants.length} participants
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(session.session_date).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(session.session_date).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {session.duration}min
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming sessions</p>
                <Link href="/dashboard/hei-mentor/mentoring/sessions/schedule">
                  <Button className="mt-2" size="sm">Schedule Session</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingActions.map(action => (
              <div key={action.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  action.priority === 'high' ? 'bg-red-500' : 
                  action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                  {action.count && (
                    <Badge variant="secondary" className="mt-1">
                      {action.count} items
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Assigned Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          
          <Link href="/dashboard/hei-mentor/mentoring/sessions/schedule">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Schedule Session</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/hei-mentor/content/assignments/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Create Assignment</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/hei-mentor/mentoring/chat">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Open Chat</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Assigned Schools */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assigned Schools</h3>
            <Link href="/dashboard/hei-mentor/mentoring/schools">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedSchools.map(school => (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-sm">{school.name}</h4>
                      <p className="text-xs text-gray-600">{school.district}</p>
                    </div>
                    <School className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Students Assigned:</span>
                      <span className="font-medium">{school.studentsAssigned}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress:</span>
                        <span className="font-medium">{school.averageProgress}%</span>
                      </div>
                      <Progress value={school.averageProgress} className="h-2" />
                    </div>

                    <Link href={`/dashboard/hei-mentor/mentoring/schools/${school.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.is_read ? 'bg-gray-300' : 'bg-blue-500'
                }`}></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
