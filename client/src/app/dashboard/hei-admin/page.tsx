'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Users, GraduationCap, School, UserCheck, Calendar, AlertCircle } from 'lucide-react';
import { heiAdminAPI } from '@/lib/api/hei-admin-client';
import { PartnershipOverviewStats, MentorAssignment, Announcement } from '@/types/hei-admin-types';
import Link from 'next/link';

export default function HEIAdminDashboard() {
  const [stats, setStats] = useState<PartnershipOverviewStats | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<MentorAssignment[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, dashboardResponse] = await Promise.all([
        heiAdminAPI.getPartnershipOverviewStats(),
        heiAdminAPI.getDashboard()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (dashboardResponse.success && dashboardResponse.data) {
        setRecentAssignments(dashboardResponse.data.recentAssignments || []);
        setRecentAnnouncements(dashboardResponse.data.recentAnnouncements || []);
      }

      if (!statsResponse.success) {
        setError(statsResponse.error || 'Failed to load statistics');
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HEI Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HEI Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage mentors, schools, and partnerships</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Create Announcement
          </Button>
          <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            Assign Mentor
          </Button>
        </div>
      </div>

      {/* Stats Grid - Only 4 main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total HEI Mentors"
          value={stats?.totalMentors || 0}
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Partner Schools"
          value={stats?.totalSchools || 0}
          icon={<School className="h-5 w-5" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<GraduationCap className="h-5 w-5" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={<UserCheck className="h-5 w-5" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Assignments & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Recent Assignments</h3>
              </div>
              <Link href="/dashboard/hei-admin/mentors">
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </div>
            {recentAssignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent assignments</p>
            ) : (
              <div className="space-y-3">
                {recentAssignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{assignment.mentorName}</p>
                      <p className="text-sm text-gray-600">{assignment.schoolName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(assignment.assignmentDate).toLocaleDateString()}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full mt-1">
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Recent Announcements</h3>
              </div>
              <Link href="/dashboard/hei-admin/announcements">
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </div>
            {recentAnnouncements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent announcements</p>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 line-clamp-1">{announcement.title}</p>
                          {announcement.isPinned && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                        announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                        announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({ title, value, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
