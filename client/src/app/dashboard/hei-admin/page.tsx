'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
  Settings,
  Megaphone,
  Send,
  X
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
    averageImprovement: "18%"
  },
  monthlyMetrics: [
    { month: "July", sessions: 120, studentsReached: 340, improvement: "15%" },
    { month: "August", sessions: 135, studentsReached: 380, improvement: "17%" },
    { month: "September", sessions: 142, studentsReached: 420, improvement: "19%" }
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
  icon: React.ElementType;
  color: string;
}

interface AnnouncementData {
  title: string;
  body: string;
  audience: string[];
}

// Audience options for the announcement
const audienceOptions = [
  { id: 'schools', label: 'Schools', icon: Building2 },
  { id: 'hei-mentor', label: 'HEI Mentors', icon: UserCheck },
  { id: 'teacher', label: 'Teachers', icon: Users }
];

export default function HEIAdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    title: '',
    body: '',
    audience: []
  });

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
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Active Mentors",
      value: heiAdminData.overallImpact.activeMentors,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Students Reached",
      value: heiAdminData.overallImpact.studentsReached,
      icon: Target,
      color: "text-purple-600"
    }
  ];

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setAnnouncementData(prev => ({
      ...prev,
      audience: checked 
        ? [...prev.audience, audienceId]
        : prev.audience.filter(id => id !== audienceId)
    }));
  };

  const handleSubmitAnnouncement = () => {
    if (!announcementData.title.trim() || !announcementData.body.trim() || announcementData.audience.length === 0) {
      alert('Please fill in all fields and select at least one audience');
      return;
    }
    
    // Here you would typically send the announcement data to your backend
    console.log('Sending announcement:', announcementData);
    
    // Reset form and close modal
    setAnnouncementData({ title: '', body: '', audience: [] });
    setIsAnnouncementModalOpen(false);
    
    // You could add a success toast/notification here
    alert('Announcement sent successfully!');
  };

  const resetAnnouncementForm = () => {
    setAnnouncementData({ title: '', body: '', audience: [] });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white/20">
              <AvatarImage src={heiAdminData.admin.avatar} alt={heiAdminData.admin.name} />
              <AvatarFallback className="bg-white/20 text-white text-sm sm:text-lg font-semibold">
                {heiAdminData.admin.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {heiAdminData.admin.name}</h1>
              <p className="text-orange-100 text-sm sm:text-base">
                {heiAdminData.admin.designation}
              </p>
              <p className="text-orange-100 text-xs sm:text-sm">
                {heiAdminData.admin.institution}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-orange-100 text-xs sm:text-sm">
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-white font-semibold text-sm sm:text-base">
              {currentTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Announcement Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-blue-800">
            <Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />
            Announcements
          </CardTitle>
          <CardDescription className="text-blue-600">
            Communicate important updates to your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <Megaphone className="h-4 w-4 mr-2" />
                Create New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                  Create Announcement
                </DialogTitle>
                <DialogDescription>
                  Share important updates with your network
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Announcement Title */}
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Announcement Title</Label>
                  <Input
                    id="announcement-title"
                    placeholder="Enter announcement title..."
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {/* Announcement Body */}
                <div className="space-y-2">
                  <Label htmlFor="announcement-body">Message</Label>
                  <Textarea
                    id="announcement-body"
                    placeholder="Enter your announcement message..."
                    rows={4}
                    value={announcementData.body}
                    onChange={(e) => setAnnouncementData(prev => ({ ...prev, body: e.target.value }))}
                  />
                </div>

                {/* Audience Selection */}
                <div className="space-y-3">
                  <Label>Select Audience (Multiple)</Label>
                  <div className="space-y-2">
                    {audienceOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={option.id}
                          checked={announcementData.audience.includes(option.id)}
                          onCheckedChange={(checked) => handleAudienceChange(option.id, checked as boolean)}
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <option.icon className="h-4 w-4 text-gray-600" />
                          <Label htmlFor={option.id} className="cursor-pointer flex-1">
                            {option.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {announcementData.audience.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {announcementData.audience.map((audienceId) => {
                        const option = audienceOptions.find(opt => opt.id === audienceId);
                        return option ? (
                          <Badge key={audienceId} variant="secondary" className="text-xs">
                            {option.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetAnnouncementForm();
                    setIsAnnouncementModalOpen(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAnnouncement}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={!announcementData.title.trim() || !announcementData.body.trim() || announcementData.audience.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full bg-gray-100 ${stat.color} flex-shrink-0 ml-4`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content - Overview Only */}
      <div className="space-y-6">
        {/* Monthly Growth Metrics */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Monthly Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {heiAdminData.monthlyMetrics.map((metric) => (
              <div key={metric.month} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{metric.month} 2025</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {metric.sessions} sessions • {metric.studentsReached} students
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{metric.improvement}</p>
                  <p className="text-xs text-gray-500">improvement</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <Button className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 text-sm sm:text-base">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Assign Mentor</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 text-sm sm:text-base">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Add Partnership</span>
              </Button>
              {/* <Button variant="outline" className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 text-sm sm:text-base sm:col-span-2 lg:col-span-1">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>View Analytics</span>
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
