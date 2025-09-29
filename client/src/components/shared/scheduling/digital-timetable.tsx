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
  const [loading, setLoading] = useState<boolean>(true);

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
      <Card className="w-full">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Digital Timetable</CardTitle>
              <p className="text-gray-600 mt-1">
                {view === 'week' ? 'Weekly' : 'Monthly'} mentoring schedule
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <Select value={view} onValueChange={(value: 'week' | 'month') => setView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>Week</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="month">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Month</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Mentor Filter */}
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mentors</SelectItem>
                  {mentorAvailability.map((mentor) => (
                    <SelectItem key={mentor.mentorId} value={mentor.mentorId}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={mentor.avatar} />
                          <AvatarFallback className="text-xs">
                            {mentor.mentorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{mentor.mentorName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Navigation */}
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {weekDates[0].toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {weekDates[6].toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Add Session Button */}
              {(userRole === 'hei-mentor' || userRole === 'student') && onScheduleSession && (
                <Button onClick={onScheduleSession} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upcoming Changes Alert */}
      {upcomingChanges.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Upcoming Schedule Changes</h3>
                <div className="space-y-2">
                  {upcomingChanges.map((change, index) => (
                    <div key={index} className="text-sm text-orange-700">
                      <span className="font-medium">
                        {new Date(change.date).toLocaleDateString('en-IN')}:
                      </span>
                      {' '}{change.change}
                      <span className="text-orange-600"> ({change.reason})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-7 border-b">
                <div className="p-4 bg-gray-50 border-r">
                  <span className="text-sm font-medium text-gray-500">Time</span>
                </div>
                {DAYS.map((day, index) => (
                  <div key={day} className="p-4 bg-gray-50 border-r last:border-r-0">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{day}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {weekDates[index].toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {TIME_SLOTS.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-7 border-b last:border-b-0">
                  {/* Time Column */}
                  <div className="p-4 bg-gray-50 border-r">
                    <div className="text-sm font-medium text-gray-600">
                      {timeSlot}
                    </div>
                  </div>

                  {/* Day Columns */}
                  {DAYS.map((day) => {
                    const sessionsForDay = getSessionsForDay(day);
                    const sessionForSlot = sessionsForDay.find(
                      session => session.time === timeSlot
                    );

                    return (
                      <div key={`${day}-${timeSlot}`} className="p-2 border-r last:border-r-0 min-h-[80px]">
                        {sessionForSlot && (
                          <div
                            className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onSessionSelect?.(sessionForSlot)}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={sessionForSlot.mentor.avatar} />
                                <AvatarFallback className="text-xs">
                                  {sessionForSlot.mentor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium truncate">
                                {sessionForSlot.mentor.name}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {sessionForSlot.subject}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatStudentDisplay(sessionForSlot.students)}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <Badge className={getTypeColor(sessionForSlot.type)}>
                                  {sessionForSlot.type === 'individual' ? (
                                    <User className="mr-1 h-3 w-3" />
                                  ) : (
                                    <Users className="mr-1 h-3 w-3" />
                                  )}
                                  <span className="text-xs">
                                    {sessionForSlot.type}
                                  </span>
                                </Badge>
                                
                                <Badge className={getStatusColor(sessionForSlot.status)}>
                                  <span className="text-xs">
                                    {sessionForSlot.status}
                                  </span>
                                </Badge>
                              </div>

                              {/* Action Buttons */}
                              {sessionForSlot.status === 'scheduled' && (
                                <div className="flex items-center space-x-1 mt-2">
                                  {sessionForSlot.meetingLink && (
                                    <Button variant="ghost" size="sm" className="p-1 h-6">
                                      <Video className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="p-1 h-6">
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="p-1 h-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentor Availability Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mentor Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorAvailability.map((mentor) => (
              <div key={mentor.mentorId} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback>
                      {mentor.mentorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mentor.mentorName}</h3>
                  </div>
                </div>
                <div className="space-y-1">
                  {mentor.availability.map((slot, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
