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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* DESIGN ONLY: Enhanced Loading Header */}
          <Card className="bg-white border-0 shadow-xl rounded-2xl">
            <CardHeader className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
                </div>
                <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </CardHeader>
          </Card>

          {/* DESIGN ONLY: Enhanced Loading Content */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Header */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/dashboard/student/mentoring">
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3 hover:shadow-md transition-all">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Mentoring
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    📅 My Sessions
                  </h1>
                  <p className="text-gray-600 text-lg">Manage your mentoring sessions</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/dashboard/student/mentoring/sessions/schedule">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule New Session
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* DESIGN ONLY: Enhanced Success Alert */}
        {scheduled && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="bg-green-200 p-3 rounded-full w-fit">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <AlertDescription className="text-green-800 font-semibold text-lg ml-4">
              ✅ Session scheduled successfully! You'll receive a confirmation email shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* DESIGN ONLY: Enhanced Search and Filter */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  placeholder="🔍 Search sessions by topic or mentor name..."
                  className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-lg bg-gray-50 hover:bg-white transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl h-14">
                <Filter className="mr-2 h-5 w-5" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DESIGN ONLY: Enhanced Sessions Tabs */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-8 py-6">
                <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-2 h-auto">
                  <TabsTrigger 
                    value="upcoming" 
                    className="flex items-center justify-center space-x-2 py-4 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>📅 Upcoming</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="flex items-center justify-center space-x-2 py-4 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>✅ Completed</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cancelled" 
                    className="flex items-center justify-center space-x-2 py-4 rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>❌ Cancelled</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                <TabsContent value="upcoming" className="mt-0">
                  <SessionsList 
                    sessions={filteredSessions} 
                    type="upcoming"
                    getStatusColor={getStatusColor}
                    getSessionTypeColor={getSessionTypeColor}
                  />
                </TabsContent>

                <TabsContent value="completed" className="mt-0">
                  <SessionsList 
                    sessions={filteredSessions} 
                    type="completed"
                    getStatusColor={getStatusColor}
                    getSessionTypeColor={getSessionTypeColor}
                  />
                </TabsContent>

                <TabsContent value="cancelled" className="mt-0">
                  <SessionsList 
                    sessions={filteredSessions} 
                    type="cancelled"
                    getStatusColor={getStatusColor}
                    getSessionTypeColor={getSessionTypeColor}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// DESIGN ONLY: Enhanced Reusable Sessions List Component
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

    const emptyEmojis = {
      upcoming: '📅',
      completed: '✅',
      cancelled: '❌'
    };

    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 rounded-full p-8 w-fit mx-auto mb-6">
          <Calendar className="h-20 w-20 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          {emptyEmojis[type as keyof typeof emptyEmojis]} {emptyMessages[type as keyof typeof emptyMessages]}
        </h3>
        <p className="text-gray-500 mb-8 text-lg">
          {type === 'upcoming' && "Schedule your first mentoring session to get started"}
          {type === 'completed' && "Complete some sessions to see them here"}
          {type === 'cancelled' && "Cancelled sessions will appear here"}
        </p>
        {type === 'upcoming' && (
          <Link href="/dashboard/student/mentoring/sessions/schedule">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg">
              📅 Schedule Session
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <Card
          key={session.id}
          className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
        >
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6 flex-1">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarImage src={session.mentor.avatar} />
                  <AvatarFallback className="bg-blue-200 text-blue-700 font-bold text-lg">
                    {session.mentor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {session.topic}
                    </h3>
                    <Badge className={`${getStatusColor(session.status)} px-3 py-1 text-sm font-semibold rounded-xl border-2`}>
                      {session.status === 'in-progress' ? '🔴 Live' : 
                       session.status === 'upcoming' ? '📅 Upcoming' :
                       session.status === 'completed' ? '✅ Completed' : session.status}
                    </Badge>
                    <Badge className={`${getSessionTypeColor(session.type)} px-3 py-1 text-sm font-semibold rounded-xl border-2`}>
                      {session.type === 'individual' ? '👤 Individual' : '👥 Group'}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4 text-lg">
                    with <span className="font-bold text-blue-700">👨‍🏫 {session.mentor.name}</span>
                    <span className="text-gray-500 ml-2">({session.mentor.designation})</span>
                  </p>

                  <div className="flex items-center flex-wrap gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">{new Date(session.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">{session.time} ({session.duration})</span>
                    </div>
                    {session.type === 'group' && session.participants && (
                      <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold">{session.participants.length} participants</span>
                      </div>
                    )}
                  </div>

                  {/* DESIGN ONLY: Enhanced Feedback for completed sessions */}
                  {session.status === 'completed' && session.feedback && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Star className="h-6 w-6 text-yellow-500 fill-current" />
                        <span className="text-lg font-bold text-green-800">⭐ Your Rating: {session.feedback.rating}/5</span>
                      </div>
                      <p className="text-green-700 italic">"{session.feedback.comment}"</p>
                    </div>
                  )}

                  {/* DESIGN ONLY: Enhanced Session notes */}
                  {session.notes && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-blue-800">📝 Session Notes:</span>
                      </div>
                      <p className="text-blue-800">{session.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* DESIGN ONLY: Enhanced Action Buttons */}
              <div className="flex flex-col space-y-3 ml-6">
                {session.status === 'upcoming' && (
                  <>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg">
                      <Video className="mr-2 h-5 w-5" />
                      🎥 Join Session
                    </Button>
                    <Button variant="outline" className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      💬 Chat
                    </Button>
                  </>
                )}

                {session.status === 'in-progress' && (
                  <>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse px-6 py-3 rounded-xl shadow-lg">
                      <Video className="mr-2 h-5 w-5" />
                      🔴 Join Live
                    </Button>
                    <Button variant="outline" className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl">
                      <Phone className="mr-2 h-5 w-5" />
                      📞 Audio Only
                    </Button>
                  </>
                )}

                {session.status === 'completed' && (
                  <>
                    {session.recordingUrl && (
                      <Button variant="outline" className="border-2 border-green-300 text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl">
                        <Download className="mr-2 h-5 w-5" />
                        📹 Recording
                      </Button>
                    )}
                    <Button variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      💭 Feedback
                    </Button>
                  </>
                )}

                <Button variant="ghost" className="hover:bg-gray-100 px-4 py-3 rounded-xl">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
