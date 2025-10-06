// src/app/dashboard/hei-mentor/mentoring/schools/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  School,
  Users, 
  Search, 
  Filter,
  MapPin,
  GraduationCap,
  TrendingUp,
  Calendar,
  MessageCircle,
  Eye,
  Award,
  BookOpen,
  Phone,
  Mail
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { School as SchoolType } from '@/types/hei-mentor';

interface SchoolWithStats extends SchoolType {
  studentsAssigned: number;
  averageProgress: number;
  activeStudents: number;
  completedAssignments: number;
  hollandTestsCompleted: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);

  const schoolsPerPage = 9;

  useEffect(() => {
    fetchSchools();
  }, [currentPage, districtFilter, typeFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await heiMentorAPI.getDashboard(); // We'll get schools from dashboard data
      
      // Mock enhanced school data with stats
      const schoolsWithStats: SchoolWithStats[] = response.assignedSchools.map(school => ({
        ...school,
        activeStudents: Math.floor(school.studentsAssigned * 0.8),
        completedAssignments: Math.floor(school.studentsAssigned * 12),
        hollandTestsCompleted: Math.floor(school.studentsAssigned * 0.7)
      }));
      
      setSchools(schoolsWithStats);
      setTotalSchools(schoolsWithStats.length);
    } catch (err) {
      setError('Failed to load schools');
      console.error('Schools error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter logic would be implemented here
  };

  const clearFilters = () => {
    setDistrictFilter('all');
    setTypeFilter('all');
    setSearchTerm('');
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
    return { label: 'Needs Focus', color: 'bg-red-100 text-red-800' };
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = searchTerm === '' || 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = districtFilter === 'all' || school.district === districtFilter;
    const matchesType = typeFilter === 'all' || school.type === typeFilter;
    
    return matchesSearch && matchesDistrict && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assigned Schools</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded"></div>
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
        <Button onClick={() => fetchSchools()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Schools</h1>
          <p className="text-gray-600">Monitor and support your assigned educational institutions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Schools</p>
          <p className="text-2xl font-bold text-blue-600">{totalSchools}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <School className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{totalSchools}</p>
            <p className="text-sm text-gray-600">Total Schools</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-gray-900">
              {schools.reduce((sum, school) => sum + school.studentsAssigned, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(schools.reduce((sum, school) => sum + school.averageProgress, 0) / schools.length)}%
            </p>
            <p className="text-sm text-gray-600">Avg Progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-gray-900">
              {schools.reduce((sum, school) => sum + school.hollandTestsCompleted, 0)}
            </p>
            <p className="text-sm text-gray-600">Holland Tests</p>
          </CardContent>
        </Card>
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
                    placeholder="Search schools by name or location..."
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
              {/* District Filter */}
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="Rajouri">Rajouri</SelectItem>
                  <SelectItem value="Udhampur">Udhampur</SelectItem>
                  <SelectItem value="Jammu">Jammu</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Aided">Aided</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <Button type="button" variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const progressStatus = getProgressStatus(school.averageProgress);
            
            return (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <School className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">
                          {school.name}
                        </h3>
                        <p className="text-sm text-gray-600">{school.code}</p>
                      </div>
                    </div>
                    <Badge className={progressStatus.color}>
                      {progressStatus.label}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {school.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Badge variant="outline" className="mr-2">
                        {school.type}
                      </Badge>
                      <span>{school.district} District</span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Student Progress</span>
                      <span className={`font-medium ${getProgressColor(school.averageProgress)}`}>
                        {school.averageProgress}%
                      </span>
                    </div>
                    <Progress value={school.averageProgress} className="h-2" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-900">{school.studentsAssigned}</p>
                      <p className="text-xs text-blue-600">Assigned</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="font-semibold text-green-900">{school.activeStudents}</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="font-semibold text-purple-900">{school.completedAssignments}</p>
                      <p className="text-xs text-purple-600">Assignments</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="font-semibold text-orange-900">{school.hollandTestsCompleted}</p>
                      <p className="text-xs text-orange-600">Holland Tests</p>
                    </div>
                  </div>

                  {/* School Contact */}
                  {school.principal_name && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-800">Principal: {school.principal_name}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      {school.total_students} total students
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/hei-mentor/mentoring/schools/${school.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/hei-mentor/mentoring/students?school=${school.id}`}>
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Students
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
            <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || districtFilter !== 'all' || typeFilter !== 'all'
                ? "No schools match your current filters."
                : "You don't have any assigned schools yet."}
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
