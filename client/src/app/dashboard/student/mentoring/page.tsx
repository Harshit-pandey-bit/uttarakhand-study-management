'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Video,
  Calendar,
  MessageCircle,
  Users,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Phone,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';

// Types based on PDF specifications
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
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
  meetingLink?: string;
  participants?: string[];
}

interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  expertise: string[];
  avatar: string;
  rating: number;
  sessionsCompleted: number;
  studentsHelped: number;
  bio: string;
  availability: string[];
}

export default function StudentMentoringPage() {
  const { user } = useAuth();
  
  // State management
  const [upcomingSessions, setUpcomingSessions] = useState<MentoringSession[]>([]);
  const [recentSessions, setRecentSessions] = useState<MentoringSession[]>([]);
  const [assignedMentors, setAssignedMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data based on PDF specifications
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setUpcomingSessions([
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
        }
      ]);

      setRecentSessions([
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
          duration: '45 minutes'
        }
      ]);

      setAssignedMentors([
        {
          id: 'MENTOR001',
          name: 'Dr. Rajesh Kumar',
          designation: 'Assistant Professor',
          department: 'Physics Department',
          expertise: ['Physics', 'Career Guidance', 'Research Methods'],
          avatar: '/mentors/dr-rajesh.jpg',
          rating: 4.8,
          sessionsCompleted: 45,
          studentsHelped: 32,
          bio: 'Specializes in Optics and helping students with Physics concepts and engineering career guidance.',
          availability: ['Monday 10-12', 'Wednesday 14-16', 'Friday 10-12']
        },
        {
          id: 'MENTOR002',
          name: 'Prof. Sunita Sharma',
          designation: 'Professor',
          department: 'Chemistry Department',
          expertise: ['Chemistry', 'Research Methods', 'Lab Techniques'],
          avatar: '/mentors/prof-sunita.jpg',
          rating: 4.6,
          sessionsCompleted: 38,
          studentsHelped: 28,
          bio: 'Expert in Organic Chemistry with focus on practical applications and research methodologies.',
          availability: ['Tuesday 9-11', 'Thursday 14-16', 'Friday 9-11']
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getSessionTypeColor = (type: string) => {
    return type === 'individual' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-orange-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentoring Hub</h1>
            <p className="text-gray-600 text-lg">
              Connect with HEI mentors for guidance and support
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{upcomingSessions.length}</p>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recentSessions.length + 12}</p>
                <p className="text-sm text-gray-600">Sessions Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{assignedMentors.length}</p>
                <p className="text-sm text-gray-600">Assigned Mentors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">4.7</p>
                <p className="text-sm text-gray-600">Session Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Upcoming Sessions</CardTitle>
          <Link href="/dashboard/student/mentoring/sessions">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming sessions scheduled</p>
              <Link href="/dashboard/student/mentoring/sessions/schedule">
                <Button className="mt-4">Schedule Your First Session</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
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
                          <Badge className={getSessionTypeColor(session.type)}>
                            {session.type === 'individual' ? 'Individual' : 'Group'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          with <span className="font-medium">{session.mentor.name}</span>
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Video className="mr-2 h-4 w-4" />
                        Join Session
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your Mentors */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Your Mentors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback className="text-lg">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {mentor.designation}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {mentor.department}
                    </p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentor.sessionsCompleted} sessions
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentor.studentsHelped} students helped
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {mentor.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/student/mentoring/sessions/schedule?mentor=${mentor.id}`}>
                        <Button size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Session
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/student/mentoring/sessions/schedule">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Schedule Session</h3>
                  <p className="text-blue-100">Book a mentoring session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/mentoring/sessions">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Video className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">My Sessions</h3>
                  <p className="text-green-100">View all sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/mentoring/chat">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <MessageCircle className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Group Chat</h3>
                  <p className="text-purple-100">Join discussion groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
