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
  BarChart3
} from 'lucide-react';

// TypeScript interfaces
interface Certification {
  name: string;
  date: string;
  provider: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  designation: string;
  classes: string[];
  cpdProgress: number;
  studentsAssigned: number;
  performanceRating: number;
  avatar: string;
  lastActivity: string;
  certifications: Certification[];
  joiningDate: string;
  qualifications: string[];
  experience: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  attendance: string;
  workload: string;
  salary: string;
  emergencyContact: string;
  bloodGroup: string;
  subjects: string[];
  achievements: string[];
}

interface SchoolInfo {
  name: string;
  district: string;
  totalTeachers: number;
  activeTeachers: number;
  onLeave: number;
  avgCPDProgress: number;
  avgPerformance: number;
  totalStudentsAssigned: number;
}

interface DepartmentStat {
  department: string;
  teachers: number;
}

interface TeachersData {
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
  departmentStats: DepartmentStat[];
}

// Enhanced teacher data for the school
const teachersData: TeachersData = {
  schoolInfo: {
    name: "Govt Senior Secondary School Dehradun",
    district: "Dehradun, Uttarakhand",
    totalTeachers: 25,
    activeTeachers: 23,
    onLeave: 2,
    avgCPDProgress: 72,
    avgPerformance: 4.5,
    totalStudentsAssigned: 450
  },
  teachers: [
    {
      id: "T001",
      name: "Priya Verma",
      subject: "Mathematics",
      designation: "Senior Teacher",
      classes: ["9th A", "10th B", "11th Science"],
      cpdProgress: 85,
      studentsAssigned: 75,
      performanceRating: 4.8,
      avatar: "/teachers/priya-verma.jpg",
      lastActivity: "2025-10-04",
      certifications: [
        { name: "DIKSHA Teaching Methods", date: "2024-08-15", provider: "NCERT" },
        { name: "Digital Classroom Management", date: "2024-09-20", provider: "DIKSHA" },
        { name: "Advanced Mathematics Pedagogy", date: "2025-01-10", provider: "NISHTHA" }
      ],
      joiningDate: "2020-04-15",
      qualifications: ["M.Sc Mathematics", "B.Ed", "PGDCA"],
      experience: "8 years",
      phone: "+91 98765 43201",
      email: "priya.verma@school.edu.in",
      address: "Sector 15, Dehradun",
      status: "active",
      attendance: "96%",
      workload: "high",
      salary: "₹45,000",
      emergencyContact: "+91 98765 43211",
      bloodGroup: "A+",
      subjects: ["Mathematics", "Computer Science"],
      achievements: [
        "Best Teacher Award 2024",
        "100% Board Results in Mathematics",
        "Digital Innovation Champion"
      ]
    },
    {
      id: "T002",
      name: "Rajesh Singh",
      subject: "Physics",
      designation: "Head of Science Department",
      classes: ["10th A", "11th Science", "12th Science"],
      cpdProgress: 78,
      studentsAssigned: 65,
      performanceRating: 4.6,
      avatar: "/teachers/rajesh-singh.jpg",
      lastActivity: "2025-10-03",
      certifications: [
        { name: "NISHTHA Program Module 1-18", date: "2024-06-30", provider: "NCERT" },
        { name: "Science Lab Management", date: "2024-11-15", provider: "DIKSHA" },
        { name: "Physics Practical Training", date: "2025-02-20", provider: "State Board" }
      ],
      joiningDate: "2018-06-20",
      qualifications: ["M.Sc Physics", "B.Ed", "M.Phil"],
      experience: "12 years",
      phone: "+91 98765 43202",
      email: "rajesh.singh@school.edu.in",
      address: "Karanpur, Dehradun",
      status: "active",
      attendance: "94%",
      workload: "high",
      salary: "₹52,000",
      emergencyContact: "+91 98765 43212",
      bloodGroup: "B+",
      subjects: ["Physics", "Mathematics"],
      achievements: [
        "Department Head Excellence Award",
        "State Level Science Fair Coordinator",
        "Physics Olympiad Mentor"
      ]
    },
    {
      id: "T003",
      name: "Meera Gupta",
      subject: "English",
      designation: "Senior Teacher",
      classes: ["8th A", "9th B", "10th C"],
      cpdProgress: 92,
      studentsAssigned: 70,
      performanceRating: 4.9,
      avatar: "/teachers/meera-gupta.jpg",
      lastActivity: "2025-10-04",
      certifications: [
        { name: "English Communication Excellence", date: "2024-07-10", provider: "British Council" },
        { name: "Digital Content Creation", date: "2024-10-25", provider: "DIKSHA" },
        { name: "Creative Writing Workshop", date: "2025-03-15", provider: "Literary Society" }
      ],
      joiningDate: "2019-03-10",
      qualifications: ["M.A English Literature", "B.Ed", "PGDTE"],
      experience: "10 years",
      phone: "+91 98765 43203",
      email: "meera.gupta@school.edu.in",
      address: "Clock Tower, Dehradun",
      status: "active",
      attendance: "98%",
      workload: "medium",
      salary: "₹48,000",
      emergencyContact: "+91 98765 43213",
      bloodGroup: "O+",
      subjects: ["English", "Hindi"],
      achievements: [
        "Excellence in English Teaching Award",
        "School Magazine Editor",
        "Inter-school Debate Competition Coordinator"
      ]
    },
    {
      id: "T004",
      name: "Amit Kumar",
      subject: "Chemistry",
      designation: "Junior Teacher",
      classes: ["11th Science", "12th Science"],
      cpdProgress: 55,
      studentsAssigned: 45,
      performanceRating: 4.2,
      avatar: "/teachers/amit-kumar.jpg",
      lastActivity: "2025-10-02",
      certifications: [
        { name: "Basic Teaching Methodology", date: "2024-05-20", provider: "DIKSHA" },
        { name: "Chemistry Lab Safety", date: "2024-12-10", provider: "State Board" }
      ],
      joiningDate: "2022-07-01",
      qualifications: ["M.Sc Chemistry", "B.Ed"],
      experience: "3 years",
      phone: "+91 98765 43204",
      email: "amit.kumar@school.edu.in",
      address: "Patel Nagar, Dehradun",
      status: "active",
      attendance: "91%",
      workload: "low",
      salary: "₹35,000",
      emergencyContact: "+91 98765 43214",
      bloodGroup: "AB+",
      subjects: ["Chemistry"],
      achievements: [
        "Promising New Teacher Award",
        "Chemistry Lab Setup Coordinator"
      ]
    },
    {
      id: "T005",
      name: "Sunita Devi",
      subject: "Hindi",
      designation: "Senior Teacher",
      classes: ["6th A", "7th B", "8th C", "9th D"],
      cpdProgress: 88,
      studentsAssigned: 80,
      performanceRating: 4.7,
      avatar: "/teachers/sunita-devi.jpg",
      lastActivity: "2025-10-04",
      certifications: [
        { name: "Hindi Literature Advanced Course", date: "2024-04-15", provider: "Hindi Sahitya Sammelan" },
        { name: "DIKSHA Advanced Training", date: "2024-09-30", provider: "DIKSHA" },
        { name: "Cultural Studies Certificate", date: "2025-01-20", provider: "Cultural Ministry" }
      ],
      joiningDate: "2017-01-15",
      qualifications: ["M.A Hindi Literature", "B.Ed", "Sahitya Ratna"],
      experience: "15 years",
      phone: "+91 98765 43205",
      email: "sunita.devi@school.edu.in",
      address: "Rajpur, Dehradun",
      status: "active",
      attendance: "99%",
      workload: "high",
      salary: "₹50,000",
      emergencyContact: "+91 98765 43215",
      bloodGroup: "A-",
      subjects: ["Hindi", "Sanskrit"],
      achievements: [
        "Best Hindi Teacher State Award",
        "Cultural Program Coordinator",
        "Perfect Attendance Award (5 years)"
      ]
    }
  ],
  departmentStats: [
    { department: "Science", teachers: 8 },
    { department: "Mathematics", teachers: 4 },
    { department: "Languages", teachers: 6 },
    { department: "Social Studies", teachers: 4 },
    { department: "Arts & Sports", teachers: 3 }
  ]
};

export default function TeachersPage() {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkload, setFilterWorkload] = useState<string>('all');
  const [isViewTeacherDialogOpen, setIsViewTeacherDialogOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Get unique subjects for filter
  const subjects = [...new Set(teachersData.teachers.map(teacher => teacher.subject))];

  // Filter teachers based on search and filters
  const filteredTeachers = teachersData.teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || teacher.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    const matchesWorkload = filterWorkload === 'all' || teacher.workload === filterWorkload;
    
    return matchesSearch && matchesSubject && matchesStatus && matchesWorkload;
  });

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWorkloadColor = (workload: string): string => {
    switch (workload) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTeacher = (teacher: Teacher): void => {
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
                Comprehensive teacher management system for {teachersData.schoolInfo.name}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <UserCheck className="w-5 h-5 text-rose-300" />
                  <span className="font-semibold">{teachersData.schoolInfo.totalTeachers} Total Teachers</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{teachersData.schoolInfo.totalStudentsAssigned} Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Activity className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">{teachersData.schoolInfo.activeTeachers} Active</span>
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
          {/* Stats Grid - Now only 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-3xl font-bold text-blue-700">{teachersData.schoolInfo.totalTeachers}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {teachersData.schoolInfo.activeTeachers} active
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
                    <p className="text-3xl font-bold text-orange-700">{teachersData.schoolInfo.totalStudentsAssigned}</p>
                    <p className="text-xs text-orange-600 mt-1">All covered</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Stats */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {teachersData.departmentStats.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{dept.department}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Teachers</span>
                        <span className="font-medium">{dept.teachers}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Status</span>
                        <span className="font-medium text-green-600">Active</span>
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
                    <p className="text-sm font-medium">Meera Gupta completed Creative Writing Certification</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rajesh Singh updated lab equipment inventory</p>
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
                    placeholder="Search teachers by name, subject, or designation..."
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
                <Select value={filterWorkload} onValueChange={setFilterWorkload}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by workload" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workloads</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Display - Cards View Only, ONLY VIEW DETAILS OPTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Teacher Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-14 w-14 border-2 border-rose-100">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-semibold">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.subject}</p>
                        <p className="text-xs text-gray-500">{teacher.designation}</p>
                      </div>
                    </div>
                    {/* UPDATED: Only View Details option */}
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
                      <p className="text-lg font-bold text-blue-600">{teacher.studentsAssigned}</p>
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

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-medium">{teacher.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Attendance</p>
                      <p className="font-medium">{teacher.attendance}</p>
                    </div>
                  </div>

                  {/* Status and Workload */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge className={`text-xs ${getStatusColor(teacher.status)}`}>
                        {teacher.status}
                      </Badge>
                      <Badge className={`text-xs ${getWorkloadColor(teacher.workload)}`}>
                        {teacher.workload} workload
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(teacher.joiningDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
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
                    setFilterStatus('all');
                    setFilterWorkload('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Departments Tab - REMOVED "View Department Details" BUTTON */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachersData.departmentStats.map((dept, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {dept.department}
                    <Badge variant="secondary">{dept.teachers} teachers</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{dept.teachers}</p>
                        <p className="text-xs text-gray-600">Faculty Members</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Department Faculty</h5>
                      <div className="space-y-1">
                        {teachersData.teachers
                          .filter(teacher => {
                            if (dept.department === 'Science') return ['Physics', 'Chemistry', 'Biology'].includes(teacher.subject);
                            if (dept.department === 'Mathematics') return teacher.subject === 'Mathematics';
                            if (dept.department === 'Languages') return ['English', 'Hindi', 'Sanskrit'].includes(teacher.subject);
                            if (dept.department === 'Social Studies') return ['History', 'Geography', 'Civics'].includes(teacher.subject);
                            return ['PE', 'Art', 'Music'].includes(teacher.subject);
                          })
                          .slice(0, 3)
                          .map((teacher) => (
                            <div key={teacher.id} className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                <AvatarFallback className="text-xs">
                                  {teacher.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{teacher.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {teacher.subject}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* REMOVED: View Department Details Button */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Teacher Detail Modal - REMOVED BLOOD GROUP, SALARY, AND ATTENDANCE */}
      <Dialog open={isViewTeacherDialogOpen} onOpenChange={setIsViewTeacherDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTeacher && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-lg font-semibold">
                      {selectedTeacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedTeacher.name}</DialogTitle>
                    <DialogDescription className="text-lg">
                      {selectedTeacher.designation} • {selectedTeacher.subject}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* UPDATED: Only 2 tabs now - Overview and Classes */}
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span>{selectedTeacher.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone</span>
                          <span>{selectedTeacher.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address</span>
                          <span>{selectedTeacher.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Contact</span>
                          <span>{selectedTeacher.emergencyContact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Professional Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience</span>
                          <span>{selectedTeacher.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joining Date</span>
                          <span>{new Date(selectedTeacher.joiningDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Workload</span>
                          <Badge className={getWorkloadColor(selectedTeacher.workload)}>
                            {selectedTeacher.workload}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Qualifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.qualifications.map((qual, index) => (
                        <Badge key={index} variant="secondary">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Achievements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTeacher.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Certifications</h4>
                    <div className="space-y-4">
                      {selectedTeacher.certifications.map((cert, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{cert.name}</h5>
                            <Badge variant="secondary">{cert.provider}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Completed: {new Date(cert.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4 mt-6">
                  <h4 className="font-semibold">Assigned Classes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTeacher.classes.map((className: string, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium">{className}</h5>
                        <p className="text-sm text-gray-600">Subject: {selectedTeacher.subject}</p>
                        <p className="text-sm text-gray-600">
                          Students: ~{Math.floor(selectedTeacher.studentsAssigned / selectedTeacher.classes.length)} (approx)
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
