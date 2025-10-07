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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  MentorListItem,
  MentorFilters,
  MentorStatus,
  PaginatedResponse,
} from '@/types/hei-admin-types';

export default function MentorsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentors, setMentors] = useState<PaginatedResponse<MentorListItem> | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MentorStatus | 'all'>('all');
  const [workloadFilter, setWorkloadFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadMentors();
  }, [currentPage, statusFilter, workloadFilter, searchQuery]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const filters: MentorFilters = {};
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter as MentorStatus;
      }
      if (workloadFilter !== 'all') {
        filters.workload = workloadFilter as any;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }

      const response = await heiAdminAPI.getMentors(filters, {
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setMentors(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to load mentors');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await heiAdminAPI.exportMentorsData();
      if (response.success && response.data) {
        // Handle blob download
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mentors-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleStatusChange = async (mentorId: string, newStatus: MentorStatus) => {
    try {
      const response = await heiAdminAPI.updateMentorStatus(mentorId, newStatus);
      if (response.success) {
        loadMentors(); // Reload the list
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const getWorkloadBadgeVariant = (status: string) => {
    switch (status) {
      case 'under-assigned':
        return 'secondary';
      case 'optimal':
        return 'default';
      case 'over-assigned':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: MentorStatus) => {
    switch (status) {
      case MentorStatus.ACTIVE:
        return 'default';
      case MentorStatus.AWAY:
        return 'secondary';
      case MentorStatus.INACTIVE:
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading && !mentors) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentors Management</h1>
          <p className="text-gray-600 mt-1">
            Manage HEI mentors and their school assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/hei-admin/mentors/assign">
            <Button className="gap-2">
              <UserCheck className="h-4 w-4" />
              Assign Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {mentors && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold mt-1">{mentors.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    {mentors.data.filter((m) => m.status === MentorStatus.ACTIVE).length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Away</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">
                    {mentors.data.filter((m) => m.status === MentorStatus.AWAY).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold mt-1 text-gray-600">
                    {mentors.data.filter((m) => m.status === MentorStatus.INACTIVE).length}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-gray-600" />
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={MentorStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={MentorStatus.AWAY}>Away</SelectItem>
                <SelectItem value={MentorStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Workload Filter */}
            <Select
              value={workloadFilter}
              onValueChange={setWorkloadFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by workload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workloads</SelectItem>
                <SelectItem value="under-assigned">Under-assigned</SelectItem>
                <SelectItem value="optimal">Optimal</SelectItem>
                <SelectItem value="over-assigned">Over-assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Mentors List
            {mentors && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({mentors.total} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <Button onClick={loadMentors} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : !mentors || mentors.data.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No mentors found</p>
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
                      <TableHead>Mentor</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Schools Assigned</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Workload</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentors.data.map((mentor) => (
                      <TableRow key={mentor.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={mentor.avatar} />
                              <AvatarFallback>
                                {mentor.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{mentor.name}</p>
                              <p className="text-sm text-gray-500">{mentor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{mentor.designation}</p>
                            <p className="text-xs text-gray-500">{mentor.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(mentor.status)}>
                            {mentor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {mentor.assignedSchoolsCount}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {' '}/ {mentor.maxStudents}
                          </span>
                        </TableCell>
                        <TableCell>{mentor.totalStudentsSupervised}</TableCell>
                        <TableCell>
                          <Badge variant={getWorkloadBadgeVariant(mentor.workloadStatus)}>
                            {mentor.workloadStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {mentor.lastActive
                            ? new Date(mentor.lastActive).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/dashboard/hei-admin/mentors/${mentor.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(`mailto:${mentor.email}`, '_blank')
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {mentor.status !== MentorStatus.ACTIVE && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(mentor.id, MentorStatus.ACTIVE)}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Mark as Active
                                </DropdownMenuItem>
                              )}
                              {mentor.status !== MentorStatus.AWAY && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(mentor.id, MentorStatus.AWAY)}
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Mark as Away
                                </DropdownMenuItem>
                              )}
                              {mentor.status !== MentorStatus.INACTIVE && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(mentor.id, MentorStatus.INACTIVE)}
                                  className="text-red-600"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Mark as Inactive
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                  {Math.min(currentPage * itemsPerPage, mentors.total)} of {mentors.total}{' '}
                  mentors
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={!mentors.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!mentors.hasNext}
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
