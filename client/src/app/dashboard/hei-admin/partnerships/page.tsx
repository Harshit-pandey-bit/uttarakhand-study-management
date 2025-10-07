'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Search,
  MapPin,
  Users,
  GraduationCap,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  UserCheck,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  SchoolPartnership,
  PartnershipFilters,
  PartnershipStatus,
  PartnershipOverviewStats,
  PaginatedResponse,
} from '@/types/hei-admin-types';

export default function PartnershipsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerships, setPartnerships] = useState<PaginatedResponse<SchoolPartnership> | null>(
    null
  );
  const [stats, setStats] = useState<PartnershipOverviewStats | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PartnershipStatus | 'all'>('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [mentorFilter, setMentorFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadPartnerships();
    loadStats();
  }, [currentPage, statusFilter, districtFilter, searchQuery]);

  const loadPartnerships = async () => {
    try {
      setLoading(true);
      const filters: PartnershipFilters = {};

      if (statusFilter !== 'all') {
        filters.status = statusFilter as PartnershipStatus;
      }
      if (districtFilter !== 'all') {
        filters.district = districtFilter;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }

      const response = await heiAdminAPI.getPartnerships(filters, {
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setPartnerships(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to load partnerships');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await heiAdminAPI.getPartnershipOverviewStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await heiAdminAPI.exportPartnershipsData();
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `partnerships-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const getStatusBadgeVariant = (status: PartnershipStatus) => {
    switch (status) {
      case PartnershipStatus.ACTIVE:
        return 'default';
      case PartnershipStatus.PENDING:
        return 'secondary';
      case PartnershipStatus.INACTIVE:
        return 'outline';
      case PartnershipStatus.SUSPENDED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get unique districts for filter
  const uniqueDistricts = partnerships
    ? Array.from(new Set(partnerships.data.map((p) => p.district)))
    : [];

  if (loading && !partnerships) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Partnerships</h1>
          <p className="text-gray-600 mt-1">Manage school partnerships and collaborations</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total HEI Mentors</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalMentors}</p>
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
                  <p className="text-2xl font-bold mt-1">{stats.totalSchools}</p>
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
                  <p className="text-2xl font-bold mt-1">{stats.totalStudents}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalTeachers}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secondary Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Partnerships</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    {stats.activePartnerships}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">
                    {stats.pendingRequests}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold mt-1 text-blue-600">
                    {stats.growthRate}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by school name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={PartnershipStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={PartnershipStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={PartnershipStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={PartnershipStatus.SUSPENDED}>Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* District Filter */}
            {uniqueDistricts.length > 0 && (
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {uniqueDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partnerships Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Partnerships List
            {partnerships && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({partnerships.total} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <Button onClick={loadPartnerships} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : !partnerships || partnerships.data.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No partnerships found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Assigned Mentor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Partnership Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerships.data.map((partnership) => (
                      <TableRow key={partnership.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {partnership.schoolLogo ? (
                              <img
                                src={partnership.schoolLogo}
                                alt={partnership.schoolName}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{partnership.schoolName}</p>
                              {partnership.principalName && (
                                <p className="text-xs text-gray-500">
                                  Principal: {partnership.principalName}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p>{partnership.location}</p>
                              <p className="text-xs text-gray-500">{partnership.district}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {partnership.assignedMentorName ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={partnership.assignedMentorAvatar} />
                                <AvatarFallback className="text-xs">
                                  {partnership.assignedMentorName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {partnership.assignedMentorName}
                                </p>
                                {partnership.assignedMentorEmail && (
                                  <p className="text-xs text-gray-500">
                                    {partnership.assignedMentorEmail}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{partnership.studentsCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{partnership.teachersCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(partnership.partnershipStatus)}>
                            {partnership.partnershipStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {partnership.partnershipStartDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              {new Date(partnership.partnershipStartDate).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/hei-admin/partnerships/${partnership.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, partnerships.total)} of{' '}
                  {partnerships.total} partnerships
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={!partnerships.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!partnerships.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
