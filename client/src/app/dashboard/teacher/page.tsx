'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Video,
  Bell,
  TrendingUp,
  Calendar,
  Award,
  Presentation,
  Brain,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { teacherAPI } from '@/lib/teacher-client';
import {
  TeacherDashboardData,
  Activity,
  Announcement,
  TeacherAssignment,
  MentoringSession
} from '@/types/teacher-types';

export default function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await teacherAPI.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <span>{error || 'Failed to load dashboard'}</span>
        </div>
      </div>
    );
  }

  const { teacher, stats, recent_activity, upcoming_deadlines, announcements, quick_actions } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {teacher.user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {teacher.school.name} • {teacher.profile.subjects.join(', ')} Teacher
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
              {teacher.profile.experience_years} years experience
            </Badge>
            <Avatar className="h-12 w-12">
              <AvatarImage src={teacher.user.avatar_url} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {teacher.user.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total_students}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active_assignments}</p>
                  <p className="text-sm text-gray-600">Active Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending_grading}</p>
                  <p className="text-sm text-gray-600">Pending Grading</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.upcoming_sessions}</p>
                  <p className="text-sm text-gray-600">Upcoming Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks to get you started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quick_actions.map((action, index) => (
                  <Link key={index} href={action.action}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 hover:border-purple-300 hover:bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            {action.icon === 'FileText' && <FileText className="h-5 w-5 text-purple-600" />}
                            {action.icon === 'BookOpen' && <BookOpen className="h-5 w-5 text-purple-600" />}
                            {action.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5 text-purple-600" />}
                            {action.icon === 'Video' && <Video className="h-5 w-5 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {activity.type === 'assignment_created' && <FileText className="h-4 w-4 text-green-600" />}
                      {activity.type === 'assignment_graded' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'lesson_plan_created' && <BookOpen className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'session_attended' && <Video className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Assignment Completion Rate</span>
                    <span className="text-sm text-gray-600">{stats.completion_rate}%</span>
                  </div>
                  <Progress value={stats.completion_rate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Average Assignment Score</span>
                    <span className="text-sm text-gray-600">{stats.average_assignment_score}%</span>
                  </div>
                  <Progress value={stats.average_assignment_score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Monthly Activities</span>
                    <span className="text-sm text-gray-600">{stats.this_month_activities}</span>
                  </div>
                  <Progress value={(stats.this_month_activities / 50) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-red-500" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">Assignments</h4>
                  {upcoming_deadlines.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {upcoming_deadlines.assignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg border">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-xs text-gray-600">
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            {assignment.submission_stats.pending} pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming assignment deadlines</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">HEI Sessions</h4>
                  {upcoming_deadlines.sessions.length > 0 ? (
                    <div className="space-y-2">
                      {upcoming_deadlines.sessions.slice(0, 2).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{session.title}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(session.session_date).toLocaleDateString()} at {new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {session.session_type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming sessions</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                <span>Latest Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {announcement.badge_type}
                      </Badge>
                      {announcement.is_new && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                          New
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{announcement.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{announcement.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">By {announcement.author_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Link href="/dashboard/teacher/virtual-collaboration/hei-coordination/announcements">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All Announcements
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Professional Development */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-500" />
                <span>Professional Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Lesson Plans Created</p>
                    <p className="text-xs text-gray-600">This month</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.lesson_plans_created}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Link href="/dashboard/teacher/cpd/diksha">
                    <Button variant="outline" size="sm" className="w-full">
                      <Award className="h-4 w-4 mr-1" />
                      DIKSHA
                    </Button>
                  </Link>
                  <Link href="/dashboard/teacher/cpd/nishtha">
                    <Button variant="outline" size="sm" className="w-full">
                      <Presentation className="h-4 w-4 mr-1" />
                      NISHTHA
                    </Button>
                  </Link>
                  <Link href="/dashboard/teacher/cpd/swayam">
                    <Button variant="outline" size="sm" className="w-full">
                      <Brain className="h-4 w-4 mr-1" />
                      Swayam
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
