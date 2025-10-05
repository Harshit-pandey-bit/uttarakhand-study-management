'use client';

import { useState } from 'react';
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
  User
} from 'lucide-react';

// TypeScript interfaces
interface Grade {
  marks: number;
  grade: string;
}

interface Grades {
  [subject: string]: Grade;
}

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  class: string;
  section: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
  admission_date: string;
  subjects: string[];
  grades: Grades;
  extracurricular: string[];
  achievements: string[];
  status: string;
  bloodGroup: string;
  emergencyContact: string;
  transport: string;
  hostel: boolean;
  scholarship: string | null;
}

interface SchoolInfo {
  name: string;
  district: string;
  totalStudents: number;
  activeStudents: number;
  totalBoys: number;
  totalGirls: number;
  totalClasses: number;
}

interface ClassStat {
  class: string;
  students: number;
}

interface StudentsData {
  schoolInfo: SchoolInfo;
  students: Student[];
  classStats: ClassStat[];
}

// Enhanced student data with proper typing
const studentsData: StudentsData = {
  schoolInfo: {
    name: "Govt Senior Secondary School Dehradun",
    district: "Dehradun, Uttarakhand",
    totalStudents: 450,
    activeStudents: 435,
    totalBoys: 230,
    totalGirls: 220,
    totalClasses: 15
  },
  students: [
    // 12th Science Students
    {
      id: "S001",
      rollNumber: "2024001",
      name: "Aarav Sharma",
      class: "12th Science",
      section: "A",
      fatherName: "Rajesh Sharma",
      motherName: "Priya Sharma",
      dateOfBirth: "2007-03-15",
      gender: "Male",
      category: "General",
      avatar: "/students/aarav-sharma.jpg",
      phone: "+91 98765 43301",
      email: "aarav.sharma@student.edu.in",
      address: "123 Gandhi Nagar, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Physical Education"],
      grades: {
        physics: { marks: 88, grade: "A1" },
        chemistry: { marks: 85, grade: "A1" },
        mathematics: { marks: 92, grade: "A1" },
        english: { marks: 78, grade: "A2" },
        physical_education: { marks: 95, grade: "A1" }
      },
      extracurricular: ["Science Club", "Mathematics Olympiad", "School Cricket Team"],
      achievements: ["First Prize in Science Fair 2024", "School Topper in Mathematics", "Best Student Award"],
      status: "active",
      bloodGroup: "B+",
      emergencyContact: "+91 98765 43311",
      transport: "School Bus",
      hostel: false,
      scholarship: "Merit Scholarship - 50%"
    },
    {
      id: "S006",
      rollNumber: "2024006",
      name: "Ravi Kumar",
      class: "12th Science",
      section: "A",
      fatherName: "Suresh Kumar",
      motherName: "Kavita Kumar",
      dateOfBirth: "2007-05-20",
      gender: "Male",
      category: "OBC",
      avatar: "/students/ravi-kumar.jpg",
      phone: "+91 98765 43306",
      email: "ravi.kumar@student.edu.in",
      address: "456 Ballupur, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Physical Education"],
      grades: {
        physics: { marks: 82, grade: "A1" },
        chemistry: { marks: 79, grade: "A2" },
        mathematics: { marks: 87, grade: "A1" },
        english: { marks: 75, grade: "A2" },
        physical_education: { marks: 90, grade: "A1" }
      },
      extracurricular: ["Physics Club", "School Basketball Team"],
      achievements: ["Physics Olympiad Participant", "Sports Captain"],
      status: "active",
      bloodGroup: "A+",
      emergencyContact: "+91 98765 43316",
      transport: "Private",
      hostel: false,
      scholarship: "OBC Scholarship - 25%"
    },
    {
      id: "S007",
      rollNumber: "2024007",
      name: "Priya Singh",
      class: "12th Science",
      section: "B",
      fatherName: "Vikram Singh",
      motherName: "Meera Singh",
      dateOfBirth: "2007-08-12",
      gender: "Female",
      category: "General",
      avatar: "/students/priya-singh.jpg",
      phone: "+91 98765 43307",
      email: "priya.singh@student.edu.in",
      address: "789 Rajpur Road, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Physics", "Chemistry", "Biology", "English", "Physical Education"],
      grades: {
        physics: { marks: 90, grade: "A1" },
        chemistry: { marks: 88, grade: "A1" },
        biology: { marks: 94, grade: "A1" },
        english: { marks: 83, grade: "A1" },
        physical_education: { marks: 92, grade: "A1" }
      },
      extracurricular: ["Biology Club", "Environmental Club", "Drama Society"],
      achievements: ["Best Student in Biology", "Environmental Award Winner"],
      status: "active",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43317",
      transport: "School Bus",
      hostel: false,
      scholarship: null
    },

    // 12th Commerce Students
    {
      id: "S008",
      rollNumber: "2024008",
      name: "Neha Gupta",
      class: "12th Commerce",
      section: "A",
      fatherName: "Amit Gupta",
      motherName: "Sunita Gupta",
      dateOfBirth: "2007-01-25",
      gender: "Female",
      category: "General",
      avatar: "/students/neha-gupta.jpg",
      phone: "+91 98765 43308",
      email: "neha.gupta@student.edu.in",
      address: "321 Clock Tower, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"],
      grades: {
        accountancy: { marks: 93, grade: "A1" },
        business_studies: { marks: 89, grade: "A1" },
        economics: { marks: 91, grade: "A1" },
        english: { marks: 86, grade: "A1" },
        mathematics: { marks: 88, grade: "A1" }
      },
      extracurricular: ["Commerce Club", "Debate Society", "Student Council"],
      achievements: ["Commerce Topper", "Best Speaker Award", "Student Council President"],
      status: "active",
      bloodGroup: "AB+",
      emergencyContact: "+91 98765 43318",
      transport: "Private",
      hostel: false,
      scholarship: "Merit Scholarship - 30%"
    },
    {
      id: "S009",
      rollNumber: "2024009",
      name: "Rohit Verma",
      class: "12th Commerce",
      section: "A",
      fatherName: "Manoj Verma",
      motherName: "Rekha Verma",
      dateOfBirth: "2007-06-18",
      gender: "Male",
      category: "SC",
      avatar: "/students/rohit-verma.jpg",
      phone: "+91 98765 43309",
      email: "rohit.verma@student.edu.in",
      address: "567 Haridwar Road, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"],
      grades: {
        accountancy: { marks: 85, grade: "A1" },
        business_studies: { marks: 82, grade: "A1" },
        economics: { marks: 80, grade: "A1" },
        english: { marks: 78, grade: "A2" },
        mathematics: { marks: 83, grade: "A1" }
      },
      extracurricular: ["Business Club", "Computer Club"],
      achievements: ["Business Plan Competition Winner", "Computer Skills Certificate"],
      status: "active",
      bloodGroup: "B-",
      emergencyContact: "+91 98765 43319",
      transport: "School Bus",
      hostel: false,
      scholarship: "SC Category Scholarship - 100%"
    },

    // 11th Science Students
    {
      id: "S010",
      rollNumber: "2024010",
      name: "Arjun Patel",
      class: "11th Science",
      section: "A",
      fatherName: "Suresh Patel",
      motherName: "Kavita Patel",
      dateOfBirth: "2008-04-10",
      gender: "Male",
      category: "OBC",
      avatar: "/students/arjun-patel.jpg",
      phone: "+91 98765 43310",
      email: "arjun.patel@student.edu.in",
      address: "890 Patel Nagar, Dehradun",
      admission_date: "2023-04-01",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Physical Education"],
      grades: {
        physics: { marks: 86, grade: "A1" },
        chemistry: { marks: 84, grade: "A1" },
        mathematics: { marks: 89, grade: "A1" },
        english: { marks: 81, grade: "A1" },
        physical_education: { marks: 88, grade: "A1" }
      },
      extracurricular: ["Science Club", "Football Team", "Quiz Club"],
      achievements: ["Science Quiz Winner", "Football Team Captain"],
      status: "active",
      bloodGroup: "A-",
      emergencyContact: "+91 98765 43320",
      transport: "Bicycle",
      hostel: false,
      scholarship: "OBC Scholarship - 25%"
    },

    // 11th Commerce Students
    {
      id: "S002",
      rollNumber: "2024002",
      name: "Ananya Patel",
      class: "11th Commerce",
      section: "B",
      fatherName: "Suresh Patel",
      motherName: "Meena Patel",
      dateOfBirth: "2008-07-22",
      gender: "Female",
      category: "OBC",
      avatar: "/students/ananya-patel.jpg",
      phone: "+91 98765 43302",
      email: "ananya.patel@student.edu.in",
      address: "456 Clock Tower, Dehradun",
      admission_date: "2023-04-01",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"],
      grades: {
        accountancy: { marks: 90, grade: "A1" },
        business_studies: { marks: 87, grade: "A1" },
        economics: { marks: 85, grade: "A1" },
        english: { marks: 82, grade: "A1" },
        mathematics: { marks: 89, grade: "A1" }
      },
      extracurricular: ["Debate Club", "Commerce Society", "School Magazine Committee"],
      achievements: ["Best Speaker in Inter-School Debate", "Commerce Quiz Winner", "Perfect Student Award"],
      status: "active",
      bloodGroup: "A+",
      emergencyContact: "+91 98765 43312",
      transport: "Private",
      hostel: false,
      scholarship: "Need-based Scholarship - 30%"
    },

    // 10th Students
    {
      id: "S003",
      rollNumber: "2024003",
      name: "Arjun Singh",
      class: "10th",
      section: "A",
      fatherName: "Vikram Singh",
      motherName: "Kavita Singh",
      dateOfBirth: "2009-01-10",
      gender: "Male",
      category: "SC",
      avatar: "/students/arjun-singh.jpg",
      phone: "+91 98765 43303",
      email: "arjun.singh@student.edu.in",
      address: "789 Karanpur, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science"],
      grades: {
        hindi: { marks: 88, grade: "A1" },
        english: { marks: 75, grade: "A2" },
        mathematics: { marks: 85, grade: "A1" },
        science: { marks: 82, grade: "A1" },
        social_science: { marks: 80, grade: "A1" }
      },
      extracurricular: ["Football Team", "Art Club", "Cultural Committee"],
      achievements: ["Best Player - School Football Championship", "Art Competition Winner", "Cultural Fest Organizer"],
      status: "active",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43313",
      transport: "Walking",
      hostel: false,
      scholarship: "SC Category Scholarship - 100%"
    },
    {
      id: "S011",
      rollNumber: "2024011",
      name: "Sneha Sharma",
      class: "10th",
      section: "B",
      fatherName: "Rajesh Sharma",
      motherName: "Pooja Sharma",
      dateOfBirth: "2009-03-15",
      gender: "Female",
      category: "General",
      avatar: "/students/sneha-sharma.jpg",
      phone: "+91 98765 43311",
      email: "sneha.sharma@student.edu.in",
      address: "123 Gandhi Road, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science"],
      grades: {
        hindi: { marks: 92, grade: "A1" },
        english: { marks: 88, grade: "A1" },
        mathematics: { marks: 90, grade: "A1" },
        science: { marks: 87, grade: "A1" },
        social_science: { marks: 85, grade: "A1" }
      },
      extracurricular: ["Dance Club", "Music Society", "Literary Club"],
      achievements: ["Classical Dance Champion", "School Choir Leader", "Poetry Competition Winner"],
      status: "active",
      bloodGroup: "B+",
      emergencyContact: "+91 98765 43321",
      transport: "School Bus",
      hostel: false,
      scholarship: null
    },

    // 9th Students
    {
      id: "S004",
      rollNumber: "2024004",
      name: "Kavya Gupta",
      class: "9th",
      section: "C",
      fatherName: "Amit Gupta",
      motherName: "Sunita Gupta",
      dateOfBirth: "2010-09-18",
      gender: "Female",
      category: "General",
      avatar: "/students/kavya-gupta.jpg",
      phone: "+91 98765 43304",
      email: "kavya.gupta@student.edu.in",
      address: "321 Patel Nagar, Dehradun",
      admission_date: "2023-04-01",
      subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science"],
      grades: {
        hindi: { marks: 92, grade: "A1" },
        english: { marks: 88, grade: "A1" },
        mathematics: { marks: 85, grade: "A1" },
        science: { marks: 87, grade: "A1" },
        social_science: { marks: 90, grade: "A1" }
      },
      extracurricular: ["Dance Club", "Hindi Literature Society", "Environmental Club"],
      achievements: ["Best Dancer - Annual Function", "Hindi Poetry Competition Winner", "Environment Day Ambassador"],
      status: "active",
      bloodGroup: "AB-",
      emergencyContact: "+91 98765 43314",
      transport: "School Bus",
      hostel: false,
      scholarship: null
    },

    // 8th Students
    {
      id: "S005",
      rollNumber: "2024005",
      name: "Rohit Kumar",
      class: "8th",
      section: "B",
      fatherName: "Manoj Kumar",
      motherName: "Rekha Kumar",
      dateOfBirth: "2011-11-05",
      gender: "Male",
      category: "OBC",
      avatar: "/students/rohit-kumar.jpg",
      phone: "+91 98765 43305",
      email: "rohit.kumar@student.edu.in",
      address: "567 Rajpur Road, Dehradun",
      admission_date: "2022-04-01",
      subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science"],
      grades: {
        hindi: { marks: 78, grade: "A2" },
        english: { marks: 72, grade: "B1" },
        mathematics: { marks: 88, grade: "A1" },
        science: { marks: 85, grade: "A1" },
        social_science: { marks: 82, grade: "A1" }
      },
      extracurricular: ["Basketball Team", "Computer Club", "Music Society"],
      achievements: ["Best Basketball Player", "Computer Quiz Winner", "School Band Member"],
      status: "active",
      bloodGroup: "B-",
      emergencyContact: "+91 98765 43315",
      transport: "Bicycle",
      hostel: false,
      scholarship: "OBC Scholarship - 25%"
    }
  ],
  classStats: [
    { class: "12th Science", students: 45 },
    { class: "12th Commerce", students: 35 },
    { class: "11th Science", students: 50 },
    { class: "11th Commerce", students: 40 },
    { class: "10th", students: 120 },
    { class: "9th", students: 110 },
    { class: "8th", students: 50 }
  ]
};

export default function StudentsPage() {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [isViewStudentDialogOpen, setIsViewStudentDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Get unique classes for filter
  const classes = [...new Set(studentsData.students.map(student => student.class))];

  // Filter students based on search and filters
  const filteredStudents = studentsData.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesGender = filterGender === 'all' || student.gender.toLowerCase() === filterGender;
    
    return matchesSearch && matchesClass && matchesStatus && matchesGender;
  });

  const getGradeColor = (grade: string): string => {
    if (grade === 'A1') return 'bg-green-100 text-green-800';
    if (grade === 'A2') return 'bg-blue-100 text-blue-800';
    if (grade === 'B1') return 'bg-yellow-100 text-yellow-800';
    if (grade === 'B2') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewStudent = (student: Student): void => {
    setSelectedStudent(student);
    setIsViewStudentDialogOpen(true);
  };

  const calculateOverallGrade = (grades: Grades): string => {
    const totalMarks = Object.values(grades).reduce((sum: number, subject: Grade) => sum + subject.marks, 0);
    const avgMarks = totalMarks / Object.keys(grades).length;
    
    if (avgMarks >= 91) return 'A1';
    if (avgMarks >= 81) return 'A2';
    if (avgMarks >= 71) return 'B1';
    if (avgMarks >= 61) return 'B2';
    return 'C';
  };

  const calculateAverageMarks = (grades: Grades): number => {
    const totalMarks = Object.values(grades).reduce((sum: number, subject: Grade) => sum + subject.marks, 0);
    return Math.round(totalMarks / Object.keys(grades).length);
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
                Comprehensive student management system for {studentsData.schoolInfo.name}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{studentsData.schoolInfo.totalStudents} Total Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <User className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">{studentsData.schoolInfo.totalBoys} Boys</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <User className="w-5 h-5 text-pink-300" />
                  <span className="font-semibold">{studentsData.schoolInfo.totalGirls} Girls</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <BookOpen className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">{studentsData.schoolInfo.totalClasses} Classes</span>
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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-blue-700">{studentsData.schoolInfo.totalStudents}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {studentsData.schoolInfo.activeStudents} active
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Boys</p>
                    <p className="text-3xl font-bold text-green-700">{studentsData.schoolInfo.totalBoys}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round((studentsData.schoolInfo.totalBoys / studentsData.schoolInfo.totalStudents) * 100)}% of total
                    </p>
                  </div>
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Girls</p>
                    <p className="text-3xl font-bold text-pink-700">{studentsData.schoolInfo.totalGirls}</p>
                    <p className="text-xs text-pink-600 mt-1">
                      {Math.round((studentsData.schoolInfo.totalGirls / studentsData.schoolInfo.totalStudents) * 100)}% of total
                    </p>
                  </div>
                  <User className="h-8 w-8 text-pink-600" />
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
                {studentsData.classStats.map((classData, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{classData.class}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Students:</span>
                        <span className="font-medium">{classData.students}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Status:</span>
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
                    <p className="text-sm font-medium">Aarav Sharma won First Prize in Science Fair 2024</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Achievement</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New admission applications received for next session</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Admission</Badge>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Parent-Teacher meetings scheduled for next week</p>
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
                    placeholder="Search students by name, roll number, or class..."
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
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
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
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students Display - ONLY VIEW DETAILS OPTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-14 w-14 border-2 border-blue-100">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{student.name}</h4>
                        <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                        <p className="text-xs text-gray-500">{student.class} - Section {student.section}</p>
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
                        <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {/* REMOVED: Edit option */}
                        {/* REMOVED: Report Card option */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Student Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {calculateAverageMarks(student.grades)}%
                      </p>
                      <p className="text-xs text-gray-600">Avg Marks</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {calculateOverallGrade(student.grades)}
                      </p>
                      <p className="text-xs text-gray-600">Overall Grade</p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.slice(0, 3).map((subject: string) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {student.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{student.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">{student.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{student.category}</p>
                    </div>
                  </div>

                  {/* Status and Transport */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                        {student.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {student.transport}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(student.admission_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
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
                    setFilterStatus('all');
                    setFilterGender('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Classes Tab - Simplified without "View All Students" button */}
        <TabsContent value="classes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentsData.classStats.map((classData, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {classData.class}
                    <Badge variant="secondary">{classData.students} students</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{classData.students}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Students</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-gray-700">Sample Students:</h5>
                      <div className="space-y-2">
                        {studentsData.students
                          .filter(student => student.class === classData.class)
                          .slice(0, 4)
                          .map((student) => (
                            <div key={student.id} className="flex items-center space-x-3 text-sm p-2 rounded-md bg-gray-50">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">Roll: {student.rollNumber} • Section {student.section}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {calculateOverallGrade(student.grades)}
                              </Badge>
                            </div>
                          ))}
                        {studentsData.students.filter(student => student.class === classData.class).length > 4 && (
                          <div className="text-center p-2 text-sm text-gray-500 bg-gray-50 rounded-md">
                            +{studentsData.students.filter(student => student.class === classData.class).length - 4} more students
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

      {/* Individual Student Detail Modal - REMOVED FAMILY TAB AND SPECIFIC FIELDS */}
      <Dialog open={isViewStudentDialogOpen} onOpenChange={setIsViewStudentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedStudent.name}</DialogTitle>
                    <DialogDescription className="text-lg">
                      {selectedStudent.class} - Section {selectedStudent.section} • Roll No: {selectedStudent.rollNumber}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* UPDATED: Only 3 tabs now - Overview, Academics, Activities (removed Family) */}
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="academics">Academics</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date of Birth:</span>
                          <span>{new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span>{selectedStudent.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span>{selectedStudent.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>{selectedStudent.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>{selectedStudent.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Academic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Class:</span>
                          <span>{selectedStudent.class}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Section:</span>
                          <span>{selectedStudent.section}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Roll Number:</span>
                          <span>{selectedStudent.rollNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-sm text-gray-700">{selectedStudent.address}</p>
                  </div>

                  {selectedStudent.scholarship && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Scholarship</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedStudent.scholarship}
                      </Badge>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="academics" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Subject-wise Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedStudent.grades).map(([subject, data]: [string, Grade]) => (
                        <div key={subject} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium capitalize">{subject.replace('_', ' ')}</h5>
                            <Badge className={getGradeColor(data.grade)}>
                              {data.grade}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Marks:</span>
                            <span className="font-medium">{data.marks}/100</span>
                          </div>
                          <Progress value={data.marks} className="w-full mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Overall Performance</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600 mb-2">
                          {calculateAverageMarks(selectedStudent.grades)}%
                        </p>
                        <p className="text-sm text-gray-600">Average Marks</p>
                      </div>
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600 mb-2">
                          {calculateOverallGrade(selectedStudent.grades)}
                        </p>
                        <p className="text-sm text-gray-600">Overall Grade</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Extracurricular Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.extracurricular.map((activity: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Achievements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedStudent.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
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
