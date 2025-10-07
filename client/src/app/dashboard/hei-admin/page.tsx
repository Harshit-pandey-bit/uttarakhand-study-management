'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Bell,
  Calendar,
  BarChart3,
  ArrowRight,
  Pin,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import { HEIAdminDashboard, DashboardStats } from '@/types/hei-admin-types';

export default function HEIAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<HEIAdminDashboard | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await heiAdminAPI.getDashboard();
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HEI Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadDashboard}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { stats, recentAssignments, recentAnnouncements, trendsData } = dashboardData;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HEI Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage mentors, schools, and partnerships
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/hei-admin/announcements">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Create Announcement
            </Button>
          </Link>
          <Link href="/dashboard/hei-admin/mentors/assign">
            <Button className="gap-2">
              <UserCheck className="h-4 w-4" />
              Assign Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Mentors"
          value={stats.totalMentors}
          subtitle={`${stats.activeMentors} active`}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Partner Schools"
          value={stats.partnerSchools}
          subtitle={`${stats.totalSchools} total schools`}
          icon={Building2}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Under supervision"
          icon={GraduationCap}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle="Across partnerships"
          icon={UserCheck}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold mt-1">{stats.activeAssignments}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {stats.pendingAssignments > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600">
                  {stats.pendingAssignments} pending
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Announcements</p>
                <p className="text-2xl font-bold mt-1">{stats.recentAnnouncementsCount}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <Link href="/dashboard/hei-admin/announcements">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View all announcements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Mentors</p>
                <p className="text-2xl font-bold mt-1">{stats.inactiveMentors}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            {stats.inactiveMentors > 0 && (
              <div className="mt-3">
                <Link href="/dashboard/hei-admin/mentors?status=inactive">
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    Review inactive mentors
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Assignments</span>
              <Link href="/dashboard/hei-admin/mentors/assign">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recentAssignments || recentAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No recent assignments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{assignment.mentorName}</p>
                      <p className="text-sm text-gray-600">{assignment.schoolName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(assignment.assignmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={assignment.status === 'active' ? 'default' : 'secondary'}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements - FIXED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Announcements</span>
              <Link href="/dashboard/hei-admin/announcements">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recentAnnouncements || recentAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No recent announcements</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{announcement.title}</p>
                          {announcement.isPinned && (
                            <Pin className="h-3 w-3 text-purple-600" />
                          )}
                          {announcement.isNew && (
                            <Badge variant="outline" className="text-xs">NEW</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {announcement.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          announcement.priority === 'critical' || announcement.priority === 'urgent'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="ml-2"
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: announcement.badgeColor || '#6366f1',
                          color: '#ffffff',
                        }}
                      >
                        {announcement.badgeType}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        By {announcement.authorName}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trends Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Trends & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mentor Assignment Trend */}
            <div>
              <h4 className="text-sm font-medium mb-3">Mentor Assignments (Monthly)</h4>
              <div className="space-y-2">
                {trendsData.mentorAssignmentTrend.slice(-6).map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* School Partnerships by Region */}
            <div>
              <h4 className="text-sm font-medium mb-3">Schools by Region</h4>
              <div className="space-y-2">
                {trendsData.schoolPartnershipsByRegion.slice(0, 6).map((item) => (
                  <div key={item.region} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.region}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Workload Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3">Mentor Workload</h4>
              <div className="space-y-2">
                {trendsData.mentorWorkloadDistribution.map((item) => (
                  <div key={item.range} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.range}</span>
                    <Badge variant="outline">{item.count} mentors</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Link href="/dashboard/hei-admin/mentors">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                View All Mentors
              </Button>
            </Link>
            <Link href="/dashboard/hei-admin/mentors/assign">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserCheck className="h-4 w-4" />
                Assign Mentor
              </Button>
            </Link>
            <Link href="/dashboard/hei-admin/partnerships">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" />
                View Partnerships
              </Button>
            </Link>
            <Link href="/dashboard/hei-admin/announcements">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Send Announcement
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function StatsCard({ title, value, subtitle, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`h-14 w-14 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
