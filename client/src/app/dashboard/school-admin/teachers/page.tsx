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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  UserCheck,
  Search,
  Eye,
  MoreHorizontal,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  GraduationCap,
  Activity,
  CheckCircle,
  FileText,
  BarChart3,
  School
} from 'lucide-react';
import { apiService} from '@/lib/services/api';
import { TeachersResponseDto} from '@/lib/services/api';
import { TeacherDto } from '@/lib/services/api';

export default function TeachersPage() {
  const [teachersData, setTeachersData] = useState<TeachersResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkload, setFilterWorkload] = useState<string>('all');
  const [isViewTeacherDialogOpen, setIsViewTeacherDialogOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(null);

  useEffect(() => {
    fetchTeachersData();
  }, []);

  const fetchTeachersData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTeachers();
      setTeachersData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching teachers data:', error);
      setError('Failed to load teachers data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !teachersData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Failed to load teachers'}</p>
          <button 
            onClick={fetchTeachersData} 
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get unique subjects for filter
  const subjects = [...new Set(teachersData.teachers.flatMap(teacher => teacher.subjects))];

  // Filter teachers based on search and filters
  const filteredTeachers = teachersData.teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || teacher.subjects.includes(filterSubject);
    
    return matchesSearch && matchesSubject;
  });

  const handleViewTeacher = (teacher: TeacherDto): void => {
    setSelectedTeacher(teacher);
    setIsViewTeacherDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-pink-50/30 p-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-700 to-rose-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-yellow-300" />
                <span className="text-rose-200 font-semibold text-lg">Faculty Management</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent leading-tight">
                School Teachers
                <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg">
                  👩‍🏫
                </span>
              </h1>
              
              <p className="text-rose-100 text-lg max-w-2xl">
                Comprehensive teacher management system
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <UserCheck className="w-5 h-5 text-rose-300" />
                  <span className="font-semibold">{teachersData.totalTeachers} Total Teachers</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{teachersData.totalStudentsAssigned} Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Activity className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">Avg {teachersData.averageExperience}y Experience</span>
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
          <TabsTrigger value="faculty">All Faculty</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-3xl font-bold text-blue-700">{teachersData.totalTeachers}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {teachersData.totalTeachers} active
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Students Assigned</p>
                    <p className="text-3xl font-bold text-orange-700">{teachersData.totalStudentsAssigned}</p>
                    <p className="text-xs text-orange-600 mt-1">All covered</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Teacher Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Teachers completed professional development courses</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lab equipment inventory updated</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Parent-Teacher meeting scheduled for next week</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Faculty Tab */}
        <TabsContent value="faculty" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search teachers by name, subject, or qualification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Teacher Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-14 w-14 border-2 border-rose-100">
                        <AvatarImage src={teacher.profileImage} alt={teacher.name} />
                        <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-semibold">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.subjects.join(', ')}</p>
                        <p className="text-xs text-gray-500">{teacher.qualification}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewTeacher(teacher)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Teacher Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{teacher.totalStudents}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{teacher.classes.length}</p>
                      <p className="text-xs text-gray-600">Classes</p>
                    </div>
                  </div>

                  {/* Classes Taught */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Classes</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.slice(0, 3).map((cls: string) => (
                        <Badge key={cls} variant="secondary" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                      {teacher.classes.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{teacher.classes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="grid grid-cols-1 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-medium">{teacher.experienceYears} years</p>
                    </div>
                  </div>

                  {/* Joining Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge className="text-xs bg-green-100 text-green-800">
                        active
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(teacher.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results state */}
          {filteredTeachers.length === 0 && (
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teachers Found</h3>
                <p className="text-gray-600 mb-4">No teachers match your current search criteria.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterSubject('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {subject}
                    <Badge variant="secondary">
                      {teachersData.teachers.filter(t => t.subjects.includes(subject)).length} teachers
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {teachersData.teachers.filter(t => t.subjects.includes(subject)).length}
                        </p>
                        <p className="text-xs text-gray-600">Faculty Members</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Department Faculty</h5>
                      <div className="space-y-1">
                        {teachersData.teachers
                          .filter(teacher => teacher.subjects.includes(subject))
                          .slice(0, 3)
                          .map((teacher) => (
                            <div key={teacher.id} className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={teacher.profileImage} alt={teacher.name} />
                                <AvatarFallback className="text-xs">
                                  {teacher.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{teacher.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {teacher.experienceYears}y
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Teacher Detail Modal */}
      <Dialog open={isViewTeacherDialogOpen} onOpenChange={setIsViewTeacherDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTeacher && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedTeacher.profileImage} alt={selectedTeacher.name} />
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-lg font-semibold">
                      {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedTeacher.name}</DialogTitle>
                    <DialogDescription className="text-lg">
                      {selectedTeacher.qualification} • {selectedTeacher.subjects.join(', ')}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Employee ID</span>
                            <span>{selectedTeacher.employeeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience</span>
                            <span>{selectedTeacher.experienceYears} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Students</span>
                            <span>{selectedTeacher.totalStudents}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subjects</span>
                            <span>{selectedTeacher.subjects.join(', ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Qualification</span>
                            <span>{selectedTeacher.qualification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined Date</span>
                            <span>{new Date(selectedTeacher.joinedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4 mt-6">
                  <h4 className="font-semibold">Assigned Classes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTeacher.classes.map((className: string, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium">{className}</h5>
                        <p className="text-sm text-gray-600">Subjects: {selectedTeacher.subjects.join(', ')}</p>
                        <p className="text-sm text-gray-600">
                          Students: ~{Math.floor(selectedTeacher.totalStudents / selectedTeacher.classes.length)} (approx)
                        </p>
                      </div>
                    ))}
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
