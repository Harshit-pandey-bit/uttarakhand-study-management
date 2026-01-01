'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Building2,
  GraduationCap,
  Mail,
  AlertCircle,
  Eye,
  School,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import { MentorStatus, PaginatedResponse, MentorListItem } from '@/types/hei-admin-types';

export default function MentorsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentors, setMentors] = useState<PaginatedResponse<MentorListItem>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MentorStatus | ''>('');
  const [workloadFilter, setWorkloadFilter] = useState('');

  useEffect(() => {
    loadMentors();
  }, [currentPage, statusFilter, workloadFilter, searchQuery]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await heiAdminAPI.getMentors(
        {
          status: statusFilter || undefined,
          workload: (workloadFilter as any) || undefined,
          search: searchQuery || undefined,
        },
        {
          page: currentPage,
          limit: itemsPerPage,
        }
      );

      console.log('Mentors API Response:', response);

      if (response.success && response.data) {
        setMentors(response.data);
      } else {
        setError(response.error || 'Failed to load mentors');
        setMentors({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err: any) {
      console.error('Error loading mentors:', err);
      setError(err.message || 'An unexpected error occurred');
      setMentors({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const getWorkloadBadge = (mentor: MentorListItem) => {
    switch (mentor.workloadStatus) {
      case 'under-assigned':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Under Assigned</Badge>;
      case 'optimal':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optimal</Badge>;
      case 'over-assigned':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Over Assigned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: MentorStatus | string) => {
    // Normalize status to lowercase string for comparison
    const statusStr = (status || 'active').toString().toLowerCase();

    switch (statusStr) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'away':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Away</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  const activeCount = mentors.data?.filter((m) => m.status === MentorStatus.ACTIVE).length || 0;
  const awayCount = mentors.data?.filter((m) => m.status === MentorStatus.AWAY).length || 0;
  const inactiveCount = mentors.data?.filter((m) => m.status === MentorStatus.INACTIVE).length || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
          <p className="text-gray-600 mt-1">Manage HEI mentors and their school assignments</p>
        </div>
        <Link href="/dashboard/hei-admin/mentors/assign">
          <Button className="gap-2">
            <UserCheck className="h-4 w-4" />
            Assign Mentor
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mentors</p>
                <p className="text-2xl font-bold mt-1">{mentors.total || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-1">{activeCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Away</p>
                <p className="text-2xl font-bold mt-1">{awayCount}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold mt-1">{inactiveCount}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MentorStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={MentorStatus.ACTIVE}>Active</option>
              <option value={MentorStatus.AWAY}>Away</option>
              <option value={MentorStatus.INACTIVE}>Inactive</option>
            </select>

            <select
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Workloads</option>
              <option value="under-assigned">Under Assigned</option>
              <option value="optimal">Optimal</option>
              <option value="over-assigned">Over Assigned</option>
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setWorkloadFilter('');
                setCurrentPage(1);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentors List */}
      {!mentors.data || mentors.data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-600 mb-2">No registered HEI mentors are available in the system.</p>
              <p className="text-sm text-gray-500">Mentors appear here once they register with the 'hei_mentor' role.</p>
              {!error && (
                <Button className="mt-4" onClick={loadMentors}>
                  Retry Loading
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mentors.data.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                        {getStatusBadge(mentor.status)}
                        {getWorkloadBadge(mentor)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{mentor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{mentor.designation || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{mentor.qualification || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {mentor.assignedSchoolsCount || 0} school(s) • {mentor.totalStudentsSupervised || 0} students
                          </span>
                        </div>
                      </div>

                      {/* Assigned Schools Section */}
                      {mentor.assignedSchools && mentor.assignedSchools.length > 0 ? (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <School className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-700">Assigned Schools ({mentor.assignedSchools.length}):</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {mentor.assignedSchools.map((school) => (
                              <Badge key={school.schoolId} variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                                {school.schoolName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 italic">No schools assigned yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/dashboard/hei-admin/mentors/${mentor.id}`}>
                    <Button variant="default" size="sm" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {mentors.totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, mentors.total)} of {mentors.total} mentors
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!mentors.hasPrev}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {mentors.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(mentors.totalPages, p + 1))}
                  disabled={!mentors.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
