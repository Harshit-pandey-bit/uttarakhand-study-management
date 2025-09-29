'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  Video,
  MessageCircle,
  MoreHorizontal,
  CalendarDays,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types based on PDF specifications
interface TimetableSession {
  id: string;
  time: string;
  mentor: {
    id: string;
    name: string;
    avatar: string;
  };
  students: string[] | string; // Can be individual or group
  subject: string;
  type: 'individual' | 'group';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
}

interface MentorAvailability {
  mentorId: string;
  mentorName: string;
  availability: string[]; // e.g., ['Monday 10-12', 'Wednesday 14-16']
  avatar: string;
}

interface UpcomingChange {
  date: string;
  change: string;
  affectedStudents: string[];
  reason: string;
}

interface DigitalTimetableProps {
  userRole: 'student' | 'teacher' | 'hei-mentor' | 'hei-admin';
  studentId?: string;
  mentorId?: string;
  schoolId?: string;
  onSessionSelect?: (session: TimetableSession) => void;
  onScheduleSession?: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
  '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
];

export default function DigitalTimetable({
  userRole,
  studentId,
  mentorId,
  schoolId,
  onSessionSelect,
  onScheduleSession
}: DigitalTimetableProps) {
  // State management
  const [view, setView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, TimetableSession[]>>({});
  const [mentorAvailability, setMentorAvailability] = useState<MentorAvailability[]>([]);
  const [upcomingChanges, setUpcomingChanges] = useState<UpcomingChange[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data based on PDF specifications
  useEffect(() => {
    setTimeout(() => {
      // Mock weekly schedule data
      const mockWeeklySchedule: Record<string, TimetableSession[]> = {
        Monday: [
          {
            id: 'SES001',
            time: '10:00-11:00',
            mentor: {
              id: 'M001',
              name: 'Dr. Rajesh Kumar',
              avatar: '/mentors/dr-rajesh.jpg'
            },
            students: ['Rahul Sharma'],
            subject: 'Physics',
            type: 'individual',
            status: 'scheduled',
            meetingLink: 'https://meet.google.com/physics-session-001'
          },
          {
            id: 'SES002',
            time: '14:00-15:00',
            mentor: {
              id: 'M002',
              name: 'Prof. Sunita Sharma',
              avatar: '/mentors/prof-sunita.jpg'
            },
            students: 'Class 9th Group',
            subject: 'Chemistry',
            type: 'group',
            status: 'scheduled',
            meetingLink: 'https://meet.google.com/chemistry-group-001'
          }
        ],
        Tuesday: [
          {
            id: 'SES003',
            time: '09:00-10:00',
            mentor: {
              id: 'M002',
              name: 'Prof. Sunita Sharma',
              avatar: '/mentors/prof-sunita.jpg'
            },
            students: ['Priya Singh', 'Amit Kumar'],
            subject: 'Career Guidance',
            type: 'group',
            status: 'scheduled'
          }
        ],
        Wednesday: [
          {
            id: 'SES004',
            time: '14:00-15:00',
            mentor: {
              id: 'M001',
              name: 'Dr. Rajesh Kumar',
              avatar: '/mentors/dr-rajesh.jpg'
            },
            students: 'Class 10th Group',
            subject: 'Physics',
            type: 'group',
            status: 'scheduled'
          }
        ],
        Friday: [
          {
            id: 'SES005',
            time: '10:00-11:00',
            mentor: {
              id: 'M003',
              name: 'Dr. Anjali Mehta',
              avatar: '/mentors/dr-anjali.jpg'
            },
            students: ['Rahul Sharma'],
            subject: 'Mathematics',
            type: 'individual',
            status: 'rescheduled'
          }
        ]
      };

      // Mock mentor availability data
      const mockMentorAvailability: MentorAvailability[] = [
        {
          mentorId: 'M001',
          mentorName: 'Dr. Rajesh Kumar',
          availability: ['Monday 10-12', 'Wednesday 14-16', 'Friday 10-12'],
          avatar: '/mentors/dr-rajesh.jpg'
        },
        {
          mentorId: 'M002',
          mentorName: 'Prof. Sunita Sharma',
          availability: ['Tuesday 9-11', 'Thursday 14-16', 'Friday 9-11'],
          avatar: '/mentors/prof-sunita.jpg'
        },
        {
          mentorId: 'M003',
          mentorName: 'Dr. Anjali Mehta',
          availability: ['Monday 14-16', 'Wednesday 10-12', 'Friday 14-16'],
          avatar: '/mentors/dr-anjali.jpg'
        }
      ];

      // Mock upcoming changes
      const mockUpcomingChanges: UpcomingChange[] = [
        {
          date: '2025-10-02',
          change: 'Dr. Kumar unavailable - session rescheduled',
          affectedStudents: ['Rahul Sharma'],
          reason: 'Mentor attending conference'
        },
        {
          date: '2025-10-03',
          change: 'Group session moved to earlier time',
          affectedStudents: ['Class 9th Group'],
          reason: 'Laboratory scheduling conflict'
        }
      ];

      setWeeklySchedule(mockWeeklySchedule);
      setMentorAvailability(mockMentorAvailability);
      setUpcomingChanges(mockUpcomingChanges);
      setLoading(false);
    }, 1000);
  }, [currentDate, userRole, studentId, mentorId]);

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    return DAYS.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getSessionsForDay = (day: string) => {
    const sessions = weeklySchedule[day] || [];
    if (selectedMentor === 'all') return sessions;
    return sessions.filter(session => session.mentor.id === selectedMentor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'rescheduled': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'individual'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-teal-100 text-teal-700';
  };

  const formatStudentDisplay = (students: string[] | string) => {
    if (typeof students === 'string') return students;
    if (students.length === 1) return students[0];
    if (students.length === 2) return students.join(' & ');
    return `${students[0]} +${students.length - 1} others`;
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
                <div className="flex space-x-3">
                  <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* DESIGN ONLY: Enhanced Loading Grid */}
          <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-8 gap-0">
                <div className="bg-gray-50 p-4 border-r border-b">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="bg-gray-50 p-4 border-r border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                ))}
                {Array.from({ length: 8 * 8 }).map((_, i) => (
                  <div key={i} className="p-4 border-r border-b h-20">
                    {i % 3 === 0 && (
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Header & Controls */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  📅 Digital Timetable
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  {view === 'week' ? '📋 Weekly' : '📅 Monthly'} mentoring schedule
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* DESIGN ONLY: Enhanced View Toggle */}
                <Select value={view} onValueChange={(value: 'week' | 'month') => setView(value)}>
                  <SelectTrigger className="w-full sm:w-32 border-2 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">📋 Week</SelectItem>
                    <SelectItem value="month">📅 Month</SelectItem>
                  </SelectContent>
                </Select>

                {/* DESIGN ONLY: Enhanced Mentor Filter */}
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Mentors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">👥 All Mentors</SelectItem>
                    {mentorAvailability.map((mentor) => (
                      <SelectItem key={mentor.mentorId} value={mentor.mentorId}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={mentor.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {mentor.mentorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{mentor.mentorName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* DESIGN ONLY: Enhanced Navigation */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateWeek('prev')}
                    className="border-2 border-gray-200 rounded-xl hover:bg-blue-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="px-4 py-2 bg-blue-50 rounded-xl text-center min-w-[180px]">
                    <span className="font-semibold text-blue-800">
                      {weekDates[0].toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })} - {weekDates[6].toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateWeek('next')}
                    className="border-2 border-gray-200 rounded-xl hover:bg-blue-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* DESIGN ONLY: Enhanced Add Session Button */}
                {(userRole === 'hei-mentor' || userRole === 'student') && onScheduleSession && (
                  <Button
                    onClick={onScheduleSession}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* DESIGN ONLY: Enhanced Upcoming Changes Alert */}
        {upcomingChanges.length > 0 && (
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-200 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-orange-800 mb-3">⚠️ Upcoming Schedule Changes</h3>
                  <div className="space-y-3">
                    {upcomingChanges.map((change, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-orange-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                          <div>
                            <span className="font-semibold text-orange-700">
                              📅 {new Date(change.date).toLocaleDateString('en-IN')}:
                            </span>
                            <span className="ml-2 text-orange-600">{change.change}</span>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 w-fit">
                            ({change.reason})
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DESIGN ONLY: Enhanced Weekly Schedule Grid */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-0 min-w-[800px]">
                {/* DESIGN ONLY: Enhanced Header */}
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 border-r border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-blue-800">Time</span>
                  </div>
                </div>
                
                {DAYS.map((day, index) => (
                  <div key={day} className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 border-r border-gray-200">
                    <div className="text-center space-y-1">
                      <div className="font-bold text-blue-800">{day}</div>
                      <div className="text-sm text-blue-600">
                        {weekDates[index].toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* DESIGN ONLY: Enhanced Time Slots */}
                {TIME_SLOTS.map((timeSlot, slotIndex) => (
                  <>
                    {/* Time Column */}
                    <div key={`time-${timeSlot}`} className="bg-gray-50 p-4 border-r border-b border-gray-200 flex items-center">
                      <span className="font-semibold text-gray-700 text-sm">{timeSlot}</span>
                    </div>

                    {/* Day Columns */}
                    {DAYS.map((day) => {
                      const sessionsForDay = getSessionsForDay(day);
                      const sessionForSlot = sessionsForDay.find(
                        session => session.time === timeSlot
                      );

                      return (
                        <div 
                          key={`${day}-${timeSlot}`} 
                          className={`p-2 border-r border-b border-gray-200 min-h-[120px] ${
                            sessionForSlot ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'
                          } transition-colors duration-200`}
                        >
                          {sessionForSlot && (
                            <div
                              className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-blue-200 hover:border-blue-300"
                              onClick={() => onSessionSelect?.(sessionForSlot)}
                            >
                              <div className="space-y-3">
                                {/* DESIGN ONLY: Enhanced Mentor Info */}
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={sessionForSlot.mentor.avatar} />
                                    <AvatarFallback className="bg-blue-200 text-blue-700 text-xs font-semibold">
                                      {sessionForSlot.mentor.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold text-blue-700 truncate">
                                      {sessionForSlot.mentor.name}
                                    </div>
                                  </div>
                                </div>

                                {/* DESIGN ONLY: Enhanced Subject */}
                                <div className="text-sm font-bold text-gray-800">
                                  📚 {sessionForSlot.subject}
                                </div>

                                {/* DESIGN ONLY: Enhanced Students */}
                                <div className="text-xs text-gray-600">
                                  👥 {formatStudentDisplay(sessionForSlot.students)}
                                </div>

                                {/* DESIGN ONLY: Enhanced Badges */}
                                <div className="flex flex-wrap gap-1">
                                  <Badge className={`${getTypeColor(sessionForSlot.type)} text-xs px-2 py-1`}>
                                    {sessionForSlot.type === 'individual' ? (
                                      <>👤 Individual</>
                                    ) : (
                                      <>👥 Group</>
                                    )}
                                  </Badge>
                                  
                                  <Badge className={`${getStatusColor(sessionForSlot.status)} text-xs px-2 py-1 border`}>
                                    {sessionForSlot.status}
                                  </Badge>
                                </div>

                                {/* DESIGN ONLY: Enhanced Action Buttons */}
                                {sessionForSlot.status === 'scheduled' && (
                                  <div className="flex space-x-1 pt-2">
                                    {sessionForSlot.meetingLink && (
                                      <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-7"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(sessionForSlot.meetingLink, '_blank');
                                        }}
                                      >
                                        <Video className="h-3 w-3 mr-1" />
                                        Join
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs px-2 py-1 h-7 border-blue-300 text-blue-600 hover:bg-blue-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <MessageCircle className="h-3 w-3 mr-1" />
                                      Chat
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DESIGN ONLY: Enhanced Mentor Availability Summary */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>👨‍🏫 Mentor Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorAvailability.map((mentor) => (
                <div
                  key={mentor.mentorId}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback className="bg-blue-200 text-blue-700 font-bold">
                        {mentor.mentorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-blue-800">{mentor.mentorName}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {mentor.availability.map((slot, index) => (
                      <Badge
                        key={index}
                        className="bg-white text-blue-700 border-blue-300 text-xs mr-2 mb-2"
                      >
                        🕒 {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
