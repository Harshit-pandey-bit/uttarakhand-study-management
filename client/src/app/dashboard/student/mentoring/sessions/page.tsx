'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Video,
  Calendar,
  Clock,
  MessageCircle,
  Users,
  User,
  Search,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Star,
  Phone,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MentoringSession {
  id: string;
  date: string;
  time: string;
  mentor: {
    name: string;
    designation: string;
    avatar: string;
    rating: number;
  };
  type: 'individual' | 'group';
  topic: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'in-progress';
  duration: string;
  meetingLink?: string;
  participants?: string[];
  feedback?: {
    rating: number;
    comment: string;
  };
  recordingUrl?: string;
  notes?: string;
}

export default function SessionsListPage() {
  const searchParams = useSearchParams();
  const scheduled = searchParams.get('scheduled');

  // State management
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MentoringSession[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data based on PDF specifications
  useEffect(() => {
    setTimeout(() => {
      const mockSessions: MentoringSession[] = [
        // Upcoming Sessions
        {
          id: 'SES001',
          date: '2025-09-30',
          time: '10:00 AM',
          mentor: {
            name: 'Dr. Rajesh Kumar',
            designation: 'Assistant Professor, Physics',
            avatar: '/mentors/dr-rajesh.jpg',
            rating: 4.8
          },
          type: 'individual',
          topic: 'Career Guidance - Engineering Paths',
          status: 'upcoming',
          duration: '45 minutes',
          meetingLink: 'https://meet.google.com/xyz-abc-def'
        },
        {
          id: 'SES002',
          date: '2025-10-02',
          time: '2:00 PM',
          mentor: {
            name: 'Prof. Sunita Sharma',
            designation: 'Professor, Chemistry',
            avatar: '/mentors/prof-sunita.jpg',
            rating: 4.6
          },
          type: 'group',
          topic: 'Chemical Bonding - Doubt Clearing',
          status: 'upcoming',
          duration: '60 minutes',
          participants: ['Rahul Sharma', 'Priya Singh', 'Amit Kumar', '5 others']
        },
        // Completed Sessions
        {
          id: 'SES003',
          date: '2025-09-25',
          time: '11:00 AM',
          mentor: {
            name: 'Dr. Rajesh Kumar',
            designation: 'Assistant Professor, Physics',
            avatar: '/mentors/dr-rajesh.jpg',
            rating: 4.8
          },
          type: 'individual',
          topic: 'Physics: Light & Reflection',
          status: 'completed',
          duration: '45 minutes',
          feedback: {
            rating: 5,
            comment: 'Excellent session! Very clear explanation of concepts.'
          },
          recordingUrl: 'https://example.com/recording/ses003',
          notes: 'Covered basics of light reflection, refraction, and practical applications.'
        },
        {
          id: 'SES004',
          date: '2025-09-20',
          time: '3:00 PM',
          mentor: {
            name: 'Prof. Sunita Sharma',
            designation: 'Professor, Chemistry',
            avatar: '/mentors/prof-sunita.jpg',
            rating: 4.6
          },
          type: 'group',
          topic: 'Organic Chemistry Basics',
          status: 'completed',
          duration: '60 minutes',
          feedback: {
            rating: 4,
            comment: 'Good session, would like more practice problems.'
          },
          recordingUrl: 'https://example.com/recording/ses004',
          participants: ['Rahul Sharma', 'Priya Singh', 'Neha Gupta', '3 others']
        },
        // In Progress
        {
          id: 'SES005',
          date: '2025-09-29',
          time: '4:00 PM',
          mentor: {
            name: 'Dr. Anjali Mehta',
            designation: 'Associate Professor, Mathematics',
            avatar: '/mentors/dr-anjali.jpg',
            rating: 4.7
          },
          type: 'individual',
          topic: 'Calculus Problem Solving',
          status: 'in-progress',
          duration: '45 minutes',
          meetingLink: 'https://meet.google.com/live-session'
        }
      ];

      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = sessions;

    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = sessions.filter(s => s.status === 'upcoming' || s.status === 'in-progress');
    } else if (activeTab === 'completed') {
      filtered = sessions.filter(s => s.status === 'completed');
    } else if (activeTab === 'cancelled') {
      filtered = sessions.filter(s => s.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, activeTab, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSessionTypeColor = (type: string) => {
    return type === 'individual' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700';
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Top Left Layout */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-start justify-between">
          {/* Left Side - Back Button and Title */}
          <div>
            {/* Back Button - Top */}
            <div className="mb-6">
              <Link href="/dashboard/student/mentoring">
                <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Mentoring
                </Button>
              </Link>
            </div>
            
            {/* Title and Description - Below with proper spacing */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">My Sessions</h1>
              <p className="text-xl text-gray-600">Manage your mentoring sessions</p>
            </div>
          </div>
          
          {/* Right Side - Schedule Button */}
          <div>
            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule New Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {scheduled && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Session scheduled successfully! You'll receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search sessions by topic or mentor name..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Tabs */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Completed</span>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Cancelled</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <SessionsList 
                sessions={filteredSessions} 
                type="upcoming"
                getStatusColor={getStatusColor}
                getSessionTypeColor={getSessionTypeColor}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <SessionsList 
                sessions={filteredSessions} 
                type="completed"
                getStatusColor={getStatusColor}
                getSessionTypeColor={getSessionTypeColor}
              />
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              <SessionsList 
                sessions={filteredSessions} 
                type="cancelled"
                getStatusColor={getStatusColor}
                getSessionTypeColor={getSessionTypeColor}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Sessions List Component
function SessionsList({ 
  sessions, 
  type,
  getStatusColor,
  getSessionTypeColor 
}: {
  sessions: MentoringSession[];
  type: string;
  getStatusColor: (status: string) => string;
  getSessionTypeColor: (type: string) => string;
}) {
  if (sessions.length === 0) {
    const emptyMessages = {
      upcoming: 'No upcoming sessions scheduled',
      completed: 'No completed sessions yet',
      cancelled: 'No cancelled sessions'
    };

    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {emptyMessages[type as keyof typeof emptyMessages]}
        </h3>
        <p className="text-gray-500 mb-6">
          {type === 'upcoming' && "Schedule your first mentoring session to get started"}
          {type === 'completed' && "Complete some sessions to see them here"}
          {type === 'cancelled' && "Cancelled sessions will appear here"}
        </p>
        {type === 'upcoming' && (
          <Link href="/dashboard/student/mentoring/sessions/schedule">
            <Button>Schedule Session</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.mentor.avatar} />
                <AvatarFallback>
                  {session.mentor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session.topic}
                  </h3>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'in-progress' ? 'Live' : session.status}
                  </Badge>
                  <Badge className={getSessionTypeColor(session.type)}>
                    {session.type === 'individual' ? 'Individual' : 'Group'}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-2">
                  with <span className="font-medium">{session.mentor.name}</span>
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  {session.type === 'group' && session.participants && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{session.participants.length} participants</span>
                    </div>
                  )}
                </div>

                {/* Feedback for completed sessions */}
                {session.status === 'completed' && session.feedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">Your Rating: {session.feedback.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600">{session.feedback.comment}</p>
                  </div>
                )}

                {/* Session notes */}
                {session.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800">{session.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 ml-4">
              {session.status === 'upcoming' && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Video className="mr-2 h-4 w-4" />
                    Join Session
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </>
              )}

              {session.status === 'in-progress' && (
                <>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 animate-pulse">
                    <Video className="mr-2 h-4 w-4" />
                    Join Live
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Audio Only
                  </Button>
                </>
              )}

              {session.status === 'completed' && (
                <>
                  {session.recordingUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Recording
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Feedback
                  </Button>
                </>
              )}

              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
