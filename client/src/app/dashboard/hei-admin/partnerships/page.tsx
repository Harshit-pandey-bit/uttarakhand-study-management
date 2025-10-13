'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Users,
  GraduationCap,
  TrendingUp,
  Building2,
  MapPin,
  UserCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import heiAdminAPI from '@/lib/api/hei-admin-client';

export default function PartnershipsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [partnerships, setPartnerships] = useState<any>({ partnerships: [], total: 0 });
  const [stats, setStats] = useState<any>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [currentPage, statusFilter, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [partnershipsResponse, statsResponse] = await Promise.all([
        heiAdminAPI.getPartnerships(
          {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: searchQuery || undefined,
          },
          { page: currentPage, limit: itemsPerPage }
        ),
        heiAdminAPI.getPartnershipOverviewStats(),
      ]);

      if (partnershipsResponse.success) {
        setPartnerships(partnershipsResponse.data);
      } else {
        setError(partnershipsResponse.error || 'Failed to load partnerships');
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err: any) {
      console.error('Error loading partnerships:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge className={`${statusColors[status?.toLowerCase()] || statusColors.pending}`}>
        {status || 'Pending'}
      </Badge>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">School Partnerships</h1>
        <p className="text-gray-600 mt-2">Manage school partnerships and collaborations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total HEI Mentors</p>
                <p className="text-3xl font-bold">{stats.totalMentors || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partner Schools</p>
                <p className="text-3xl font-bold">{stats.totalSchools || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold">{stats.totalTeachers || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Partnerships</p>
                <p className="text-3xl font-bold">{stats.activePartnerships || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold">{stats.pendingRequests || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-3xl font-bold">{stats.growthRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by school name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="outline" onClick={loadData}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partnerships List */}
      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : partnerships.partnerships && partnerships.partnerships.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Partnership Schools ({partnerships.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnerships.partnerships.map((school: any) => (
                <div
                  key={school.schoolId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-lg">{school.schoolName}</h3>
                        {getStatusBadge(school.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {school.location}, {school.district}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{school.studentsCount} Students</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4" />
                          <span>{school.teachersCount} Teachers</span>
                        </div>
                      </div>

                      {school.mentorName && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">
                            Mentor: <span className="font-medium text-gray-900">{school.mentorName}</span>
                          </span>
                        </div>
                      )}

                      {school.principalName && (
                        <div className="mt-2 text-sm text-gray-600">
                          Principal: {school.principalName}
                          {school.principalContact && ` • ${school.principalContact}`}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/hei-admin/partnerships/${school.schoolId}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {partnerships.total > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, partnerships.total)} of{' '}
                  {partnerships.total} partnerships
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(partnerships.total / itemsPerPage) }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={loading}
                        className="w-10"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage >= Math.ceil(partnerships.total / itemsPerPage) || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No partnerships found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
