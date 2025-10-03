'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  School,
  Users,
  Calendar,
  BookOpen,
  Video,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Plus,
  FileText,
  MessageSquare,
  Award,
  Target,
  BarChart3,
  GraduationCap,
  Activity
} from 'lucide-react';

// Dummy data from PDF specifications
const heiMentorData = {
  mentor: {
    name: "Dr. Rajesh Kumar",
    designation: "Assistant Professor",
    department: "Physics",
    institution: "IIT Roorkee",
    avatar: "/mentors/dr-rajesh.jpg",
    expertise: ["Physics", "Career Guidance", "Research Methodology"],
    rating: 4.8,
    totalSessions: 145,
    joinDate: "2024-01-15"
  },
  assignedSchools: [
    {
      id: "S001",
      name: "Govt School Dehradun",
      studentsAssigned: 25,
      sessionsThisMonth: 8,
      avgProgress: "23%",
      location: "Dehradun, Uttarakhand",
      principalName: "Mrs. Sunita Sharma",
      lastSession: "2025-09-26"
    },
    {
      id: "S002", 
      name: "Govt School Rishikesh",
      studentsAssigned: 18,
      sessionsThisMonth: 6,
      avgProgress: "19%",
      location: "Rishikesh, Uttarakhand",
      principalName: "Mr. Ramesh Chandra",
      lastSession: "2025-09-25"
    }
  ],
  upcomingSessions: [
    {
      id: "SES001",
      date: "2025-09-28",
      time: "10:00 AM",
      duration: "60 mins",
      students: ["Rahul Sharma", "Priya Singh"],
      topic: "Career Guidance: Engineering Pathways",
      school: "Govt School Dehradun",
      type: "group",
      status: "confirmed"
    },
    {
      id: "SES002",
      date: "2025-09-29",
      time: "2:00 PM",
      duration: "45 mins", 
      students: ["Group Session - 10th Class"],
      topic: "Physics: Light and Reflection",
      school: "Govt School Rishikesh",
      type: "class",
      status: "pending"
    },
    {
      id: "SES003",
      date: "2025-10-04",
      time: "11:00 AM",
      duration: "30 mins",
      students: ["Amit Kumar"],
      topic: "Individual Doubt Clearing",
      school: "Govt School Dehradun", 
      type: "individual",
      status: "confirmed"
    }
  ],
  contentCreated: {
    assignments: 12,
    resources: 8,
    videos: 3,
    lastCreated: "Assignment: Wave Motion Problems"
  },
  impactMetrics: {
    studentsHelped: 43,
    averageImprovement: "23%",
    sessionRating: 4.7,
    totalHours: 98,
    completionRate: "92%"
  }
};

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function HEIMentorDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const dashboardStats: DashboardStats[] = [
    {
      title: "Total Students",
      value: String(heiMentorData.assignedSchools.reduce((sum, school) => sum + school.studentsAssigned, 0)),
      change: "+5 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Sessions This Month", 
      value: String(heiMentorData.assignedSchools.reduce((sum, school) => sum + school.sessionsThisMonth, 0)),
      change: "+3 from last month",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Average Rating",
      value: String(heiMentorData.impactMetrics.sessionRating),
      change: "+0.2 improvement",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Impact Score",
      value: heiMentorData.impactMetrics.averageImprovement,
      change: "+5% this quarter",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-blue-100 text-blue-800';
      case 'class': return 'bg-green-100 text-green-800';
      case 'individual': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src={heiMentorData.mentor.avatar} alt={heiMentorData.mentor.name} />
              <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                {heiMentorData.mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {heiMentorData.mentor.name}</h1>
              <p className="text-teal-100">
                {heiMentorData.mentor.designation} • {heiMentorData.mentor.department}
              </p>
              <p className="text-teal-100 text-sm">
                {heiMentorData.mentor.institution}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-teal-100 text-sm">
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-white font-semibold">
              {currentTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Schools Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Assigned Schools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heiMentorData.assignedSchools.map((school) => (
              <div key={school.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.location}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {school.studentsAssigned} students
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {school.sessionsThisMonth} sessions
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{school.avgProgress}</p>
                  <p className="text-xs text-gray-500">avg. progress</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Schedule New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {heiMentorData.upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.topic}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session.date} at {session.time} • {session.duration}
                  </p>
                  <p className="text-xs text-gray-400">{session.school}</p>
                  <p className="text-xs text-gray-400">
                    Students: {Array.isArray(session.students) ? session.students.join(', ') : session.students}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getSessionTypeColor(session.type)}>
                    {session.type}
                  </Badge>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Student Progress & Content Creation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Student Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heiMentorData.assignedSchools.map((school) => (
                <div key={school.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{school.name}</span>
                    <span className="text-sm text-green-600">{school.avgProgress}</span>
                  </div>
                  <Progress value={parseInt(school.avgProgress)} className="w-full" />
                  <p className="text-xs text-gray-500">
                    {school.studentsAssigned} students • Last session: {school.lastSession}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Overall Impact</p>
                  <p className="text-2xl font-bold text-green-700">{heiMentorData.impactMetrics.averageImprovement}</p>
                  <p className="text-xs text-green-600">average improvement</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Creation Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Creation Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">{heiMentorData.contentCreated.assignments}</p>
                <p className="text-xs text-gray-600">Assignments</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">{heiMentorData.contentCreated.resources}</p>
                <p className="text-xs text-gray-600">Resources</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Video className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{heiMentorData.contentCreated.videos}</p>
                <p className="text-xs text-gray-600">Videos</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{heiMentorData.impactMetrics.studentsHelped}</p>
                <p className="text-xs text-gray-600">Students Helped</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Recent Activity:</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">{heiMentorData.contentCreated.lastCreated}</p>
                <p className="text-xs text-gray-500">Created 2 days ago</p>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button className="flex-1" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button className="flex-1" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Record Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{heiMentorData.impactMetrics.studentsHelped}</p>
              <p className="text-sm text-gray-600">Students Helped</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{heiMentorData.impactMetrics.averageImprovement}</p>
              <p className="text-sm text-gray-600">Avg Improvement</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{heiMentorData.impactMetrics.sessionRating}</p>
              <p className="text-sm text-gray-600">Session Rating</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{heiMentorData.impactMetrics.totalHours}</p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
