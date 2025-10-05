'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Bell,
  Search,
  Calendar,
  Clock,
  School,
  Users,
  BookOpen,
  Award,
  Building,
  Pin,
  AlertCircle,
  Info,
  Megaphone
} from 'lucide-react';

// Single HEI Partner and Notifications data
const heiPartnershipData = {
  schoolInfo: {
    name: "Govt Senior Secondary School Dehradun",
    district: "Dehradun, Uttarakhand",
  },
  heiPartner: {
    id: "HEI001",
    name: "Delhi University",
    shortName: "DU",
    type: "Central University",
    location: "Delhi",
    website: "www.du.ac.in",
    contact: "+91 11-2766-7696",
    email: "admissions@du.ac.in",
    logo: "/partners/delhi-university.jpg",
    status: "active",
    joinedDate: "2023-01-15",
    programs: ["B.A.", "B.Com", "B.Sc.", "M.A.", "M.Com", "M.Sc.", "B.Tech", "MBA"],
    description: "One of India's premier universities offering undergraduate and postgraduate programs across multiple disciplines."
  },
  notifications: [
    {
      id: "N001",
      type: "announcement",
      priority: "high",
      title: "New Admission Guidelines for 2024-25",
      message: "Delhi University has updated the admission criteria for undergraduate programs. Important changes include:\n\n• Minimum 75% marks required in 12th standard for Science stream\n• Minimum 70% marks required for Commerce stream\n• Additional entrance test may be required for some courses\n• Online application process starts from December 1, 2024\n• Last date for application submission is January 15, 2025\n\nStudents are advised to check the detailed eligibility criteria on our website and prepare accordingly. Career counseling sessions will be arranged for interested students.",
      createdAt: "2024-10-03T10:30:00Z",
      createdBy: "Dr. Rajesh Kumar",
      createdByRole: "HEI Admin",
      isRead: false,
      isPinned: true
    },
    {
      id: "N002",
      type: "scholarship",
      priority: "high", 
      title: "Merit Scholarship Program for Government School Students",
      message: "Delhi University is pleased to announce a special merit-based scholarship program exclusively for students from government schools.\n\nScholarship Benefits:\n• Full tuition fee waiver for selected courses\n• Monthly stipend of ₹5,000 for living expenses\n• Book allowance of ₹10,000 per year\n• Priority hostel accommodation\n\nEligibility Criteria:\n• Students from government schools only\n• Minimum 85% marks in 12th standard\n• Family income below ₹3 lakh per annum\n• Must clear DU entrance examination\n\nApplication Process:\n• Online application through DU portal\n• Submit income certificate and school verification\n• Attend scholarship interview if shortlisted\n\nThis is an excellent opportunity for our bright students to pursue higher education at one of India's top universities.",
      createdAt: "2024-10-02T14:15:00Z",
      createdBy: "Prof. Meera Sharma",
      createdByRole: "HEI Admin",
      isRead: true,
      isPinned: true
    },
    {
      id: "N003",
      type: "event",
      priority: "medium",
      title: "University Campus Visit and Orientation Program",
      message: "Delhi University invites students from your school for a comprehensive campus visit and orientation program.\n\nProgram Details:\n• Date: October 25-26, 2024 (2 days)\n• Time: 9:00 AM to 4:00 PM both days\n• Venue: Delhi University Main Campus\n• Transportation: Will be arranged from school\n\nProgram Includes:\n• Campus tour and facility visits\n• Interaction with current students and faculty\n• Department-wise information sessions\n• Admission guidance and counseling\n• Career opportunities presentation\n• Cultural program and refreshments\n\nEligible Students:\n• Class 11 and 12 students\n• Students interested in higher education\n• Maximum 50 students can participate\n\nThis program will help students understand university life and make informed decisions about their future academic pursuits.",
      createdAt: "2024-10-01T09:45:00Z",
      createdBy: "Dr. Amit Singh",
      createdByRole: "HEI Admin",
      isRead: false,
      isPinned: false
    },
    {
      id: "N004",
      type: "career",
      priority: "medium",
      title: "Career Counseling and Guidance Session",
      message: "Delhi University is organizing an exclusive career counseling session for students interested in various academic and professional paths.\n\nSession Details:\n• Date: October 15, 2024\n• Time: 2:00 PM to 5:00 PM\n• Mode: Online via Zoom\n• Registration: Mandatory for participation\n\nTopics Covered:\n• Career opportunities in different fields\n• Course selection guidance\n• Industry trends and job market analysis\n• Skill development recommendations\n• Higher education pathways\n• Q&A session with career experts\n\nWho Should Attend:\n• Class 11 and 12 students\n• Students confused about career choices\n• Parents are also welcome to join\n\nExpert Panel:\n• Industry professionals\n• University faculty members\n• Career counseling specialists\n• Successful alumni\n\nRegistration is free but mandatory. Students will receive a participation certificate.",
      createdAt: "2024-09-30T11:30:00Z",
      createdBy: "Dr. Sunita Yadav",
      createdByRole: "HEI Admin",
      isRead: false,
      isPinned: false
    },
    {
      id: "N005",
      type: "announcement",
      priority: "medium",
      title: "New Academic Programs Launched for 2024-25",
      message: "Delhi University is excited to announce the launch of new undergraduate and postgraduate programs for the academic year 2024-25.\n\nNew Undergraduate Programs:\n• B.Sc. in Data Science and Analytics\n• B.A. in Digital Humanities\n• B.Com in Financial Markets\n• B.Tech in Artificial Intelligence\n\nNew Postgraduate Programs:\n• M.Sc. in Cyber Security\n• M.A. in Environmental Studies\n• MBA in Digital Marketing\n• M.Tech in Machine Learning\n\nKey Features:\n• Industry-aligned curriculum\n• Practical hands-on training\n• Industry internships guaranteed\n• Placement assistance provided\n• Modern infrastructure and labs\n\nAdmission Process:\n• Applications open: December 1, 2024\n• Entrance exam: January 2025\n• Merit-based selection\n• Limited seats available\n\nThese programs are designed to meet the demands of the modern job market and provide excellent career prospects for students.",
      createdAt: "2024-09-28T13:45:00Z",
      createdBy: "Prof. Ravi Kumar",
      createdByRole: "HEI Admin",
      isRead: true,
      isPinned: false
    },
    {
      id: "N006",
      type: "information",
      priority: "low",
      title: "Updated Contact Information and Office Hours",
      message: "Please note the updated contact information and office hours for Delhi University Admissions Office.\n\nNew Contact Details:\n• Phone: +91-11-2766-7000 (Admissions Helpline)\n• Email: admissions@du.ac.in\n• WhatsApp: +91-98765-43210 (Quick queries)\n• Website: www.du.ac.in/admissions\n\nOffice Hours:\n• Monday to Friday: 9:00 AM to 5:00 PM\n• Saturday: 9:00 AM to 1:00 PM\n• Sunday: Closed\n• Lunch Break: 1:00 PM to 2:00 PM\n\nOnline Services Available:\n• Application submission\n• Document verification\n• Fee payment\n• Status tracking\n• Virtual counseling sessions\n\nFor urgent queries outside office hours, please use the WhatsApp number or email. We aim to respond within 24 hours.",
      createdAt: "2024-09-25T16:20:00Z",
      createdBy: "Ms. Priya Gupta",
      createdByRole: "HEI Admin",
      isRead: true,
      isPinned: false
    }
  ]
};

export default function HEIPartnershipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Filter notifications
  const filteredNotifications = heiPartnershipData.notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.isRead) ||
                       (filterRead === 'unread' && !notification.isRead);
    
    return matchesSearch && matchesPriority && matchesType && matchesRead;
  });

  // Sort notifications - pinned first, then by date
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="h-4 w-4" />;
      case 'scholarship': return <Award className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'career': return <Users className="h-4 w-4" />;
      case 'information': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'scholarship': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'career': return 'bg-orange-100 text-orange-800';
      case 'information': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setIsNotificationOpen(true);
    
    // Mark as read if not already read
    if (!notification.isRead) {
      notification.isRead = true;
    }
  };

  const unreadCount = heiPartnershipData.notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-yellow-300" />
                <span className="text-blue-200 font-semibold text-lg">HEI Partnership</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
                {heiPartnershipData.heiPartner.name}
                <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg">
                  🎓
                </span>
              </h1>
              
              <p className="text-blue-100 text-lg max-w-2xl">
                Announcements and opportunities from {heiPartnershipData.heiPartner.name}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Bell className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{unreadCount} Unread</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <School className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">{heiPartnershipData.heiPartner.type}</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <Megaphone className="w-5 h-5 text-purple-300" />
                  <span className="font-semibold">{heiPartnershipData.notifications.length} Announcements</span>
                </div>
              </div>
            </div>
            
            {/* HEI Partner Info */}
            <div className="hidden lg:block text-right">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <h3 className="text-xl font-bold">{heiPartnershipData.heiPartner.shortName}</h3>
                  <p className="text-blue-200 text-sm">{heiPartnershipData.heiPartner.location}</p>
                  <p className="text-blue-300 text-xs mt-1">{heiPartnershipData.heiPartner.website}</p>
                </div>
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage src={heiPartnershipData.heiPartner.logo} alt={heiPartnershipData.heiPartner.name} />
                  <AvatarFallback className="bg-white/10 text-white text-xl font-bold">
                    {heiPartnershipData.heiPartner.shortName}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="information">Information</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRead} onValueChange={setFilterRead}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {sortedNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
              !notification.isRead ? 'ring-2 ring-blue-200' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* HEI Logo */}
                <Avatar className="h-12 w-12 border-2 border-gray-200 shrink-0">
                  <AvatarImage src={heiPartnershipData.heiPartner.logo} alt={heiPartnershipData.heiPartner.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {heiPartnershipData.heiPartner.shortName}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-lg ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {notification.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <Badge className={`${getPriorityColor(notification.priority)} border shrink-0`}>
                      {notification.priority.toUpperCase()}
                    </Badge>
                  </div>

                  {/* HEI Info and Type */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{heiPartnershipData.heiPartner.name}</span>
                    </div>
                    <Badge className={`${getTypeColor(notification.type)} flex items-center space-x-1`}>
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </Badge>
                  </div>

                  {/* Message Preview */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {notification.message.split('\n')[0]}
                  </p>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{notification.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No notifications state */}
      {sortedNotifications.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements Found</h3>
            <p className="text-gray-600 mb-4">No announcements match your current filters.</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('all');
                setFilterType('all');
                setFilterRead('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification Detail Popup - Simplified */}
      <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage src={heiPartnershipData.heiPartner.logo} alt={heiPartnershipData.heiPartner.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                      {heiPartnershipData.heiPartner.shortName}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <DialogTitle className="text-2xl">{selectedNotification.title}</DialogTitle>
                        <DialogDescription className="text-lg mt-1">
                          {heiPartnershipData.heiPartner.name}
                        </DialogDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(selectedNotification.priority)} border`}>
                          {selectedNotification.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getTypeColor(selectedNotification.type)} flex items-center space-x-1`}>
                          {getTypeIcon(selectedNotification.type)}
                          <span className="capitalize">{selectedNotification.type}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Announcement Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">Posted:</span>
                      <div className="font-medium">{new Date(selectedNotification.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600">By:</span>
                      <div className="font-medium">{selectedNotification.createdBy}</div>
                      <div className="text-xs text-gray-500">{selectedNotification.createdByRole}</div>
                    </div>
                  </div>
                </div>

                {/* Full Message */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Announcement Details:</h4>
                  <div className="prose max-w-none bg-white p-6 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNotification.message}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Contact {heiPartnershipData.heiPartner.shortName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span>{heiPartnershipData.heiPartner.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-blue-600" />
                      <span>{heiPartnershipData.heiPartner.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
