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
  TrendingUp,
  Target,
  School,
  BookOpen,
  Calendar,
  Star,
  ChevronRight,
  Plus,
  BarChart3,
  Award,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Settings
} from 'lucide-react';

// Dummy data from PDF specifications
const heiAdminData = {
  admin: {
    name: "Dr. Suresh Chandra",
    designation: "Dean, Outreach Programs",
    institution: "IIT Roorkee",
    avatar: "/admin/dr-suresh.jpg",
    joinDate: "2023-06-01"
  },
  overallImpact: {
    partneredSchools: 25,
    activeMentors: 12,
    studentsReached: 450,
    totalSessions: 1250,
    averageImprovement: "18%"
  },
  monthlyMetrics: [
    { month: "July", sessions: 120, studentsReached: 340, improvement: "15%" },
    { month: "August", sessions: 135, studentsReached: 380, improvement: "17%" },
    { month: "September", sessions: 142, studentsReached: 420, improvement: "19%" }
  ],
  mentorPerformance: [
    { 
      name: "Dr. Rajesh Kumar", 
      sessions: 45, 
      rating: 4.8, 
      studentsHelped: 32, 
      improvement: "24%",
      avatar: "/mentors/dr-rajesh.jpg",
      expertise: ["Physics", "Career Guidance"]
    },
    { 
      name: "Prof. Sunita Sharma", 
      sessions: 38, 
      rating: 4.6, 
      studentsHelped: 28, 
      improvement: "21%",
      avatar: "/mentors/prof-sunita.jpg",
      expertise: ["Chemistry", "Research Methods"]
    },
    {
      name: "Dr. Amit Verma",
      sessions: 52,
      rating: 4.7,
      studentsHelped: 35,
      improvement: "23%",
      avatar: "/mentors/dr-amit.jpg",
      expertise: ["Mathematics", "Data Science"]
    }
  ],
  schoolPartnershipHealth: [
    { 
      school: "Govt School Dehradun", 
      engagement: "High", 
      sessions: 65, 
      satisfaction: "4.7",
      studentsActive: 45,
      lastActivity: "2025-10-01"
    },
    { 
      school: "Govt School Rishikesh", 
      engagement: "Medium", 
      sessions: 45, 
      satisfaction: "4.3",
      studentsActive: 32,
      lastActivity: "2025-09-30"
    },
    {
      school: "Govt School Haridwar",
      engagement: "High",
      sessions: 58,
      satisfaction: "4.5",
      studentsActive: 38,
      lastActivity: "2025-10-02"
    }
  ],
  recentActivities: [
    {
      type: "mentor_assignment",
      message: "Dr. Rajesh Kumar assigned to 3 new schools",
      timestamp: "2 hours ago",
      icon: UserCheck
    },
    {
      type: "session_completed",
      message: "15 mentoring sessions completed today",
      timestamp: "4 hours ago",
      icon: CheckCircle
    },
    {
      type: "partnership_renewed",
      message: "Partnership with Govt School Dehradun renewed",
      timestamp: "1 day ago",
      icon: Building2
    }
  ],
  alerts: [
    {
      type: "warning",
      message: "2 mentors approaching maximum session limit",
      priority: "medium"
    },
    {
      type: "info",
      message: "New partnership request from 3 schools pending review",
      priority: "low"
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

export default function HEIAdminDashboard() {
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
      title: "Partnered Schools",
      value: heiAdminData.overallImpact.partneredSchools,
      change: "+3 this quarter",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Active Mentors",
      value: heiAdminData.overallImpact.activeMentors,
      change: "+2 this month",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Students Reached",
      value: heiAdminData.overallImpact.studentsReached,
      change: "+45 this month",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Total Sessions",
      value: heiAdminData.overallImpact.totalSessions,
      change: "+142 this month",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const getEngagementColor = (engagement: string) => {
    switch (engagement.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src={heiAdminData.admin.avatar} alt={heiAdminData.admin.name} />
              <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                {heiAdminData.admin.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {heiAdminData.admin.name}</h1>
              <p className="text-orange-100">
                {heiAdminData.admin.designation}
              </p>
              <p className="text-orange-100 text-sm">
                {heiAdminData.admin.institution}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">
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

      {/* Alerts Section */}
      {heiAdminData.alerts.length > 0 && (
        <div className="space-y-2">
          {heiAdminData.alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.priority)}`}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3" />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
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

      {/* Main Dashboard Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Growth Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {heiAdminData.monthlyMetrics.map((metric) => (
                  <div key={metric.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{metric.month} 2025</p>
                        <p className="text-sm text-gray-600">
                          {metric.sessions} sessions • {metric.studentsReached} students
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{metric.improvement}</p>
                      <p className="text-xs text-gray-500">improvement</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {heiAdminData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full">
                  View All Activities <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Assign Mentor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Building2 className="h-6 w-6" />
                  <span>Add Partnership</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mentor Performance Overview</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {heiAdminData.mentorPerformance.map((mentor, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xl font-bold text-blue-600">{mentor.sessions}</p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-xl font-bold text-green-600">{mentor.studentsHelped}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Impact Score</span>
                      <span className="font-medium">{mentor.improvement}</span>
                    </div>
                    <Progress value={parseInt(mentor.improvement)} className="w-full" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Expertise:</p>
                    <div className="flex space-x-1">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Assign</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">School Partnership Health</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partnership
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heiAdminData.schoolPartnershipHealth.map((school, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{school.school}</CardTitle>
                    <Badge className={getEngagementColor(school.engagement)}>
                      {school.engagement} Engagement
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-blue-600">{school.sessions}</p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-green-600">{school.studentsActive}</p>
                      <p className="text-xs text-gray-600">Active Students</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-yellow-600">{school.satisfaction}</p>
                      <p className="text-xs text-gray-600">Satisfaction</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Last Activity: {school.lastActivity}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Improvement</p>
                    <p className="text-2xl font-bold">{heiAdminData.overallImpact.averageImprovement}</p>
                    <p className="text-xs text-green-600">+3% from last quarter</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-green-600">+5% this month</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentor Utilization</p>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-yellow-600">Optimal range</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Partnership Score</p>
                    <p className="text-2xl font-bold">4.6</p>
                    <p className="text-xs text-green-600">Above target</p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Institutional Impact Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Program Effectiveness</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Career Guidance Sessions</span>
                        <span className="font-medium">85% satisfaction</span>
                      </div>
                      <Progress value={85} className="w-full" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Subject Mentoring</span>
                        <span className="font-medium">78% improvement</span>
                      </div>
                      <Progress value={78} className="w-full" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">STEM Activities</span>
                        <span className="font-medium">92% engagement</span>
                      </div>
                      <Progress value={92} className="w-full" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Regional Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Dehradun District</span>
                        <span className="font-medium">12 schools</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Haridwar District</span>
                        <span className="font-medium">8 schools</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Rishikesh District</span>
                        <span className="font-medium">5 schools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
