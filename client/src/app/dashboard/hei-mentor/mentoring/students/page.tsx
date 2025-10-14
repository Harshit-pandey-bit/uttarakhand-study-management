// src/app/dashboard/hei-mentor/mentoring/students/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter,
  School,
  Eye,
  MessageCircle,
  Calendar,
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { AssignedStudent, StudentFilters } from '@/types/hei-mentor';

export default function StudentsPage() {
  const [students, setStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const studentsPerPage = 12;

  useEffect(() => {
    fetchStudents();
  }, [currentPage, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await heiMentorAPI.getAssignedStudents(filters, currentPage, studentsPerPage);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setStudents(response.data.students);
        setTotalStudents(response.data.total);
        setHasMore(response.data.hasMore);
      }
    } catch (err) {
      setError('Failed to load students');
      console.error('Students error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof StudentFilters];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getEngagementStatus = (sessionsAttended: number) => {
    if (sessionsAttended >= 10) return { label: 'Highly Engaged', color: 'bg-green-100 text-green-800' };
    if (sessionsAttended >= 5) return { label: 'Active', color: 'bg-blue-100 text-blue-800' };
    if (sessionsAttended >= 1) return { label: 'Getting Started', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Not Yet Active', color: 'bg-gray-100 text-gray-800' };
  };

  const filteredStudents = students.filter(student =>
    searchTerm === '' || 
    student.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assigned Students</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => fetchStudents()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Students</h1>
          <p className="text-gray-600">Monitor and guide your assigned students</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or school..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Class Level Filter */}
              <Select 
                value={filters.class_level || 'all'} 
                onValueChange={(value) => handleFilterChange('class_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>

              {/* School Filter */}
              <Select 
                value={filters.school_id || 'all'} 
                onValueChange={(value) => handleFilterChange('school_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            // ✅ Safe access with optional chaining and defaults
            const sessionsAttended = student.stats?.sessionsAttended ?? 0;
            const lastActivity = student.stats?.lastActivity;
            const engagementStatus = getEngagementStatus(sessionsAttended);
            
            return (
              <Card key={student.user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {student.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.user.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          Class {student.profile.class_level || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Badge className={engagementStatus.color}>
                      {engagementStatus.label}
                    </Badge>
                  </div>

                  {/* School Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <School className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{student.school.name}</span>
                    </div>
                  </div>

                  {/* Student Stats */}
                  <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Sessions Attended</span>
                      </div>
                      <span className="font-semibold text-gray-900">{sessionsAttended}</span>
                    </div>
                    
                    {lastActivity && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Last activity: {new Date(lastActivity).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Career Aspirations */}
                  {student.profile.career_aspirations && student.profile.career_aspirations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Career Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.profile.career_aspirations.slice(0, 2).map((career, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {career}
                          </Badge>
                        ))}
                        {student.profile.career_aspirations.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.profile.career_aspirations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Assigned: {new Date(student.assignment.assigned_at).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/hei-mentor/mentoring/students/${student.user.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/hei-mentor/mentoring/chat?student=${student.user.id}`}>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? "No students match your current filters."
                : "You don't have any assigned students yet."}
            </p>
            {(searchTerm || Object.keys(filters).length > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalStudents > studentsPerPage && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalStudents / studentsPerPage)}
          </span>
          
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
