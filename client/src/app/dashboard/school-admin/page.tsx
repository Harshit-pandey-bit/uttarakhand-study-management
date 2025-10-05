'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Users,
  UserCheck,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  School,
  GraduationCap,
  Clock,
  CheckCircle,
  Plus,
  ChevronRight,
  Activity,
  Target,
  Star,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Home
} from 'lucide-react';
import Link from 'next/link';

// Complete dummy data for School Admin Dashboard
const schoolAdminData = {
  admin: {
    name: "Mrs. Sunita Sharma",
    designation: "Principal",
    school: "Govt Senior Secondary School Dehradun",
    district: "Dehradun, Uttarakhand",
    avatar: "/admin/sunita-sharma.jpg",
    experience: "15 years",
    qualifications: "M.Ed, B.Ed",
    phone: "+91 98765 43210",
    email: "principal.gssd@edu.gov.in",
    establishedYear: "1985"
  },
  schoolStats: {
    totalStudents: 450,
    totalTeachers: 25,
    activeClasses: 12,
    completionRate: "87%",
    averageAttendance: "92%"
  },
  teacherProgress: [
    {
      name: "Priya Verma",
      subject: "Mathematics",
      classes: ["9th A", "10th B"],
      cpdProgress: 75,
      studentsAssigned: 65,
      performanceRating: 4.6,
      avatar: "/teachers/priya-verma.jpg",
      lastActivity: "2025-10-03",
      certifications: ["DIKSHA Teaching Methods", "Digital Classroom"]
    },
    {
      name: "Rajesh Singh",
      subject: "Physics",
      classes: ["10th A", "11th Science"],
      cpdProgress: 60,
      studentsAssigned: 55,
      performanceRating: 4.4,
      avatar: "/teachers/rajesh-singh.jpg",
      lastActivity: "2025-10-02",
      certifications: ["NISHTHA Program", "Science Lab Management"]
    },
    {
      name: "Meera Gupta",
      subject: "English",
      classes: ["8th A", "9th B"],
      cpdProgress: 85,
      studentsAssigned: 70,
      performanceRating: 4.7,
      avatar: "/teachers/meera-gupta.jpg",
      lastActivity: "2025-10-04",
      certifications: ["English Communication", "Digital Content Creation"]
    }
  ],
  studentProgress: {
    byClass: [
      { class: "6th", students: 45, avgScore: "78%", improvement: "+5%" },
      { class: "7th", students: 52, avgScore: "82%", improvement: "+7%" },
      { class: "8th", students: 48, avgScore: "75%", improvement: "+3%" },
      { class: "9th", students: 55, avgScore: "80%", improvement: "+8%" },
      { class: "10th", students: 60, avgScore: "85%", improvement: "+12%" },
      { class: "11th", students: 40, avgScore: "77%", improvement: "+6%" },
      { class: "12th", students: 35, avgScore: "88%", improvement: "+15%" }
    ],
    subjectWise: [
      { subject: "Mathematics", avgScore: "79%", improvement: "+8%", weakAreas: ["Algebra", "Geometry"] },
      { subject: "Science", avgScore: "82%", improvement: "+10%", weakAreas: ["Physics Numericals"] },
      { subject: "English", avgScore: "85%", improvement: "+12%", weakAreas: ["Grammar", "Writing"] }
    ]
  },
  // FIXED: Added back the recentActivities property
  recentActivities: [
    {
      type: "teacher_cpd",
      title: "3 teachers completed DIKSHA courses this week",
      date: "2 hours ago",
      status: "completed",
      icon: Award
    },
    {
      type: "infrastructure",
      title: "Smart classroom projector repaired in Room 201",
      date: "1 day ago",
      status: "completed",
      icon: Settings
    },
    {
      type: "student_achievement",
      title: "15 students qualified for district science fair",
      date: "2 days ago",
      status: "completed",
      icon: Award
    },
    {
      type: "teacher_training",
      title: "Digital literacy workshop completed successfully",
      date: "3 days ago",
      status: "completed",
      icon: BookOpen
    }
  ]
};

interface DashboardStats {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function SchoolAdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [greeting, setGreeting] = useState('');

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'teacher_cpd': return <Award className="h-4 w-4" />;
      case 'infrastructure': return <Settings className="h-4 w-4" />;
      case 'student_achievement': return <Award className="h-4 w-4" />;
      case 'teacher_training': return <BookOpen className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const completionPercentage = parseInt(schoolAdminData.schoolStats.completionRate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-pink-50/30 p-6 space-y-8">
      {/* Enhanced Hero Welcome Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-700 to-rose-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white min-h-[320px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-6 flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <span className="text-rose-200 font-semibold text-lg">
                  School Administration Portal
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {greeting}, {schoolAdminData.admin.name}!
                  <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg text-4xl lg:text-5xl xl:text-6xl">
                    🏫
                  </span>
                </h1>
                
                <div className="flex items-center space-x-3 text-rose-100 mb-2">
                  <School className="h-6 w-6" />
                  <span className="text-xl font-semibold">
                    {schoolAdminData.admin.designation} • {schoolAdminData.admin.school}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-rose-200 mb-6">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{schoolAdminData.admin.district}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Est. {schoolAdminData.admin.establishedYear}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>{schoolAdminData.admin.experience} Experience</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <Users className="w-5 h-5 text-rose-300" />
                  <span className="font-semibold text-lg">{schoolAdminData.schoolStats.totalStudents} Students</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <UserCheck className="w-5 h-5 text-pink-300" />
                  <span className="font-semibold text-lg">{schoolAdminData.schoolStats.totalTeachers} Teachers</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <BarChart3 className="w-5 h-5 text-emerald-300" />
                  <span className="font-semibold text-lg">{schoolAdminData.schoolStats.completionRate} Completion</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <School className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Stats Grid - Now only 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Students Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {schoolAdminData.schoolStats.totalStudents}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((schoolAdminData.schoolStats.totalStudents / 500) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              +12 new admissions this month
            </p>
          </CardContent>
        </Card>

        {/* Teaching Staff Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                  Teaching Staff
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {schoolAdminData.schoolStats.totalTeachers}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((schoolAdminData.schoolStats.totalTeachers / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium">
              +2 new joiners this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activities - Now Full Width */}
      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
              Activities
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600">Latest school updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schoolAdminData.recentActivities.length > 0 ? (
              schoolAdminData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                       style={{
                         background: activity.status === 'completed' ? 
                           'linear-gradient(135deg, #10b981, #059669)' :
                           activity.status === 'upcoming' ? 
                           'linear-gradient(135deg, #3b82f6, #2563eb)' :
                           activity.status === 'pending' ? 
                           'linear-gradient(135deg, #f59e0b, #d97706)' :
                           'linear-gradient(135deg, #6366f1, #4f46e5)'
                       }}>
                    <div className="text-white">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <Badge className={`${getStatusColor(activity.status)} text-xs px-2 py-1 rounded-lg font-medium`}>
                    {activity.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 col-span-2">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
