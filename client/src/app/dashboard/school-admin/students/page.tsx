'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Search,
  Eye,
  MoreHorizontal,
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  Activity,
  BarChart3,
  School,
  User,
  Target
} from 'lucide-react';
import { apiService } from '@/lib/services/api';
import { StudentsResponseDto } from '@/lib/services/api';
import { StudentDto } from '@/lib/services/api';

export default function StudentsPage() {
  const [studentsData, setStudentsData] = useState<StudentsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [isViewStudentDialogOpen, setIsViewStudentDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
  const [classStats, setClassStats] = useState<any[]>([]);

  useEffect(() => {
    fetchStudentsData();
    fetchClassStats();
  }, []);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStudents();
      setStudentsData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching students data:', error);
      setError('Failed to load students data');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStats = async () => {
    try {
      const data = await apiService.getStudentsCount();
      setClassStats(data || []);
    } catch (error) {
      console.error('Error fetching class stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !studentsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Failed to load students'}</p>
          <button 
            onClick={fetchStudentsData} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get unique classes for filter
  const classes = [...new Set(studentsData.students.map(student => student.classLevel))];

  // Filter students based on search and filters
  const filteredStudents = studentsData.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.classLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.careerAspiration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.classLevel === filterClass;
    
    return matchesSearch && matchesClass;
  });

  const handleViewStudent = (student: StudentDto): void => {
    setSelectedStudent(student);
    setIsViewStudentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <School className="h-8 w-8 text-yellow-300" />
                <span className="text-blue-200 font-semibold text-lg">Student Management</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
                School Students
                <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg">
                  🎓
                </span>
              </h1>
              
              <p className="text-blue-100 text-lg max-w-2xl">
                Comprehensive student management system
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{studentsData.totalStudents} Total Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <BookOpen className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">{studentsData.completionRate}% Completion</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <GraduationCap className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">All Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid - Only Total Students card */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-blue-700">{studentsData.totalStudents}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Average Grade: {studentsData.averageGrade}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Distribution */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Class-wise Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {classStats.map((classData, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{classData.classLevel || `Class ${index + 1}`}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Students:</span>
                        <span className="font-medium">{classData.studentCount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Grade:</span>
                        <span className="font-medium text-green-600">{classData.averageGrade || 'A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Student Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Students won prizes in Science Fair 2024</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Achievement</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New admission applications received</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Admission</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Parent-Teacher meetings scheduled</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Event</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Students Tab */}
        <TabsContent value="students" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, class, or career aspiration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-14 w-14 border-2 border-blue-100">
                        <AvatarImage src={student.profileImage} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.classLevel}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Student Info Grid - Only Overall Grade */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {student.overallGrade}
                      </p>
                      <p className="text-xs text-gray-600">Overall Grade</p>
                    </div>
                  </div>

                  {/* Career Aspiration */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Career Aspiration:</p>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <Badge variant="outline" className="text-sm font-medium text-purple-700 bg-purple-50 border-purple-200">
                        {student.careerAspiration}
                      </Badge>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge className="text-xs bg-green-100 text-green-800">
                        active
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Score: {student.averageScore}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results state */}
          {filteredStudents.length === 0 && (
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600 mb-4">No students match your current search criteria.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterClass('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((className, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {className}
                    <Badge variant="secondary">
                      {studentsData.students.filter(s => s.classLevel === className).length} students
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">
                          {studentsData.students.filter(s => s.classLevel === className).length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Total Students</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-gray-700">Sample Students:</h5>
                      <div className="space-y-2">
                        {studentsData.students
                          .filter(student => student.classLevel === className)
                          .slice(0, 4)
                          .map((student) => (
                            <div key={student.id} className="flex items-center space-x-3 text-sm p-2 rounded-md bg-gray-50">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.profileImage} alt={student.name} />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.careerAspiration}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {student.overallGrade}
                              </Badge>
                            </div>
                          ))}
                        {studentsData.students.filter(s => s.classLevel === className).length > 4 && (
                          <div className="text-center p-2 text-sm text-gray-500 bg-gray-50 rounded-md">
                            +{studentsData.students.filter(s => s.classLevel === className).length - 4} more students
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Detail Modal */}
      <Dialog open={isViewStudentDialogOpen} onOpenChange={setIsViewStudentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.profileImage} alt={selectedStudent.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedStudent.name}</DialogTitle>
                    <DialogDescription className="text-lg">
                      {selectedStudent.classLevel}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="academics">Academics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Class Level:</span>
                            <span>{selectedStudent.classLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overall Grade:</span>
                            <span>{selectedStudent.overallGrade}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Score:</span>
                            <span>{selectedStudent.averageScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">STEM Projects:</span>
                            <span>{selectedStudent.stemProjects}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Career Aspiration</h4>
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Target className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-800 text-lg">{selectedStudent.careerAspiration}</p>
                          <p className="text-sm text-purple-600">Future Career Goal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academics" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Academic Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Assignment Progress</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completed</span>
                            <span>{selectedStudent.completedAssignments}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total</span>
                            <span>{selectedStudent.totalAssignments}</span>
                          </div>
                          <Progress 
                            value={(selectedStudent.completedAssignments / selectedStudent.totalAssignments) * 100} 
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">STEM Projects</h5>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{selectedStudent.stemProjects}</p>
                          <p className="text-sm text-gray-600">Projects Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Overall Performance</h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="text-center p-8 bg-green-50 rounded-lg">
                        <p className="text-5xl font-bold text-green-600 mb-3">
                          {selectedStudent.overallGrade}
                        </p>
                        <p className="text-lg text-gray-600">Overall Grade</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Average Score: {selectedStudent.averageScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
