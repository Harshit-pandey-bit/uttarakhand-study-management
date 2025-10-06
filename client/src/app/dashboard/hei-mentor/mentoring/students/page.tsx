// src/app/dashboard/hei-mentor/mentoring/students/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter,
  School,
  GraduationCap,
  TrendingUp,
  Calendar,
  MessageCircle,
  Eye,
  Award,
  AlertTriangle,
  CheckCircle
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
      setStudents(response.students);
      setTotalStudents(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to load students');
      console.error('Students error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      // Remove filter when "All" is selected
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (progress >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (progress >= 40) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  const filteredStudents = students.filter(student =>
    searchTerm === '' || 
    student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <p className="text-gray-600">Monitor and guide your assigned students' progress</p>
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
              {/* Class Level Filter - Fixed */}
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

              {/* School Filter - Fixed */}
              <Select 
                value={filters.school_id || 'all'} 
                onValueChange={(value) => handleFilterChange('school_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  <SelectItem value="school_001">GSSS Rajouri</SelectItem>
                  <SelectItem value="school_002">GHS Udhampur</SelectItem>
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
            const progressStatus = getProgressStatus(student.stats.assignmentProgress);
            
            return (
              <Card key={student.user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.user.name}</h3>
                        <p className="text-sm text-gray-600">
                          Class {student.profile.class_level}{student.profile.section}
                        </p>
                      </div>
                    </div>
                    <Badge className={progressStatus.color}>
                      {progressStatus.label}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <School className="h-4 w-4 mr-2" />
                      {student.school.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Roll: {student.profile.roll_number}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Assignment Progress</span>
                        <span className={`font-medium ${getProgressColor(student.stats.assignmentProgress)}`}>
                          {student.stats.assignmentProgress}%
                        </span>
                      </div>
                      <Progress value={student.stats.assignmentProgress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{student.stats.completedAssignments}</p>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{student.stats.averageGrade}%</p>
                        <p className="text-gray-600">Avg Grade</p>
                      </div>
                    </div>
                  </div>

                  {/* Holland Test Status */}
                  {student.hollandResult ? (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-800">Holland Test Completed</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {student.hollandResult.personality_code}
                        </Badge>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        Top: {student.hollandResult.top_categories.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">Holland Test Pending</span>
                      </div>
                    </div>
                  )}

                  {/* Career Interests */}
                  {student.profile.career_aspirations && student.profile.career_aspirations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Career Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.profile.career_aspirations.slice(0, 2).map((career, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Last active: {new Date(student.stats.lastActivity).toLocaleDateString('en-IN')}
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
