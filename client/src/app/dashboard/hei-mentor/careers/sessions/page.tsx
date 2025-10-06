// src/app/dashboard/hei-mentor/careers/sessions/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Video,
  Phone,
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  Target,
  Award,
  FileText,
  Send,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  CalendarDays,
  Bell,
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';

// Counseling session interfaces
interface CounselingSession {
  session_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  class_level: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  session_type: 'initial' | 'follow_up' | 'career_planning' | 'college_prep' | 'skill_assessment' | 'goal_setting';
  session_mode: 'in_person' | 'video_call' | 'phone_call';
  location: string;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress' | 'no_show';
  agenda: string[];
  session_notes?: string;
  student_feedback?: string;
  action_items: ActionItem[];
  next_session_needed: boolean;
  next_session_date?: string;
  preparation_materials: string[];
  session_rating?: number;
  career_focus: string[];
  priority_level: 'high' | 'medium' | 'low';
}

interface ActionItem {
  id: string;
  description: string;
  due_date: string;
  assigned_to: 'student' | 'mentor';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface SessionFilters {
  status: string;
  session_type: string;
  date_range: string;
  student_class: string;
  search_query: string;
  priority_level: string;
}

interface SessionStats {
  total_sessions: number;
  completed_sessions: number;
  scheduled_sessions: number;
  cancelled_sessions: number;
  avg_session_rating: number;
  completion_rate: number;
  most_common_topics: { topic: string; count: number }[];
  upcoming_sessions_today: number;
  sessions_this_week: number;
}

export default function CounselingSessionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'calendar' | 'analytics'>('upcoming');
  const [showScheduleDialog, setShowScheduleDialog] = useState<boolean>(false);
  const [showSessionDialog, setShowSessionDialog] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  
  const [filters, setFilters] = useState<SessionFilters>({
    status: 'all',
    session_type: 'all',
    date_range: 'upcoming',
    student_class: 'all',
    search_query: '',
    priority_level: 'all'
  });

  const [newSession, setNewSession] = useState({
    student_id: '',
    session_date: '',
    session_time: '',
    duration_minutes: 45,
    session_type: 'initial',
    session_mode: 'video_call',
    location: '',
    agenda: '',
    priority_level: 'medium',
    preparation_materials: ''
  });

  useEffect(() => {
    fetchSessionsData();
  }, [filters]);

  const fetchSessionsData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock sessions data
      const mockSessions: CounselingSession[] = [
        {
          session_id: 'sess_001',
          student_id: 'std_001',
          student_name: 'Arjun Sharma',
          student_email: 'arjun.sharma@school.edu',
          class_level: '12',
          session_date: '2025-10-15',
          session_time: '14:00',
          duration_minutes: 45,
          session_type: 'career_planning',
          session_mode: 'video_call',
          location: 'Google Meet',
          meeting_link: 'https://meet.google.com/abc-defg-hij',
          status: 'scheduled',
          agenda: ['Review career assessment results', 'Discuss college application strategy', 'Set short-term goals'],
          priority_level: 'high',
          action_items: [
            {
              id: 'ai_001',
              description: 'Research top 5 computer science programs',
              due_date: '2025-10-20',
              assigned_to: 'student',
              status: 'pending',
              priority: 'high',
              category: 'Research'
            }
          ],
          next_session_needed: true,
          next_session_date: '2025-10-29',
          preparation_materials: ['Career assessment report', 'College preferences list'],
          career_focus: ['Software Engineering', 'Data Science']
        },
        {
          session_id: 'sess_002',
          student_id: 'std_002',
          student_name: 'Priya Patel',
          student_email: 'priya.patel@school.edu',
          class_level: '11',
          session_date: '2025-10-12',
          session_time: '10:30',
          duration_minutes: 60,
          session_type: 'initial',
          session_mode: 'in_person',
          location: 'Counseling Room 201',
          status: 'completed',
          agenda: ['Introduction and rapport building', 'Career interests exploration', 'Assessment planning'],
          session_notes: 'Student shows strong interest in creative fields. Recommended Holland Code assessment. Very engaged and motivated.',
          student_feedback: 'Very helpful session. Looking forward to the assessment results.',
          session_rating: 5,
          priority_level: 'medium',
          action_items: [
            {
              id: 'ai_002',
              description: 'Complete Holland Code assessment',
              due_date: '2025-10-17',
              assigned_to: 'student',
              status: 'completed',
              priority: 'high',
              category: 'Assessment'
            },
            {
              id: 'ai_003',
              description: 'Research design schools and programs',
              due_date: '2025-10-20',
              assigned_to: 'student',
              status: 'in_progress',
              priority: 'medium',
              category: 'Research'
            }
          ],
          next_session_needed: true,
          next_session_date: '2025-10-25',
          preparation_materials: ['Assessment results', 'Portfolio examples'],
          career_focus: ['Graphic Design', 'UI/UX Design', 'Digital Marketing']
        },
        {
          session_id: 'sess_003',
          student_id: 'std_003',
          student_name: 'Rahul Singh',
          student_email: 'rahul.singh@school.edu',
          class_level: '12',
          session_date: '2025-10-08',
          session_time: '16:00',
          duration_minutes: 45,
          session_type: 'follow_up',
          session_mode: 'video_call',
          location: 'Microsoft Teams',
          meeting_link: 'https://teams.microsoft.com/join/xyz123',
          status: 'completed',
          agenda: ['Review internship applications', 'Discuss interview preparation', 'Plan skill development'],
          session_notes: 'Student has applied to 3 internships. Need to work on interview confidence. Recommended mock interview practice.',
          student_feedback: 'Great advice on interview preparation. Feel more confident now.',
          session_rating: 4,
          priority_level: 'high',
          action_items: [
            {
              id: 'ai_004',
              description: 'Practice mock interviews with peers',
              due_date: '2025-10-15',
              assigned_to: 'student',
              status: 'in_progress',
              priority: 'high',
              category: 'Skill Development'
            },
            {
              id: 'ai_005',
              description: 'Update LinkedIn profile with projects',
              due_date: '2025-10-12',
              assigned_to: 'student',
              status: 'completed',
              priority: 'medium',
              category: 'Professional Development'
            }
          ],
          next_session_needed: true,
          next_session_date: '2025-10-22',
          preparation_materials: ['Interview questions list', 'Portfolio updates'],
          career_focus: ['Software Engineering', 'Machine Learning']
        },
        {
          session_id: 'sess_004',
          student_id: 'std_004',
          student_name: 'Ananya Gupta',
          student_email: 'ananya.gupta@school.edu',
          class_level: '11',
          session_date: '2025-10-20',
          session_time: '11:00',
          duration_minutes: 45,
          session_type: 'skill_assessment',
          session_mode: 'in_person',
          location: 'Career Lab',
          status: 'scheduled',
          agenda: ['Skills gap analysis', 'Learning pathway planning', 'Resource identification'],
          priority_level: 'medium',
          action_items: [],
          next_session_needed: false,
          preparation_materials: ['Skills inventory worksheet', 'Learning goals form'],
          career_focus: ['Healthcare', 'Biotechnology']
        },
        {
          session_id: 'sess_005',
          student_id: 'std_005',
          student_name: 'Vikram Reddy',
          student_email: 'vikram.reddy@school.edu',
          class_level: '12',
          session_date: '2025-10-18',
          session_time: '15:30',
          duration_minutes: 30,
          session_type: 'goal_setting',
          session_mode: 'phone_call',
          location: 'Phone Session',
          status: 'scheduled',
          agenda: ['Review progress on previous goals', 'Set new quarterly goals', 'Timeline planning'],
          priority_level: 'low',
          action_items: [],
          next_session_needed: true,
          next_session_date: '2025-11-15',
          preparation_materials: ['Goal tracking sheet', 'Progress report'],
          career_focus: ['Business', 'Entrepreneurship']
        }
      ];

      const mockStats: SessionStats = {
        total_sessions: 45,
        completed_sessions: 32,
        scheduled_sessions: 8,
        cancelled_sessions: 5,
        avg_session_rating: 4.3,
        completion_rate: 91.4,
        most_common_topics: [
          { topic: 'Career Planning', count: 18 },
          { topic: 'College Preparation', count: 12 },
          { topic: 'Skill Development', count: 10 },
          { topic: 'Interview Preparation', count: 8 }
        ],
        upcoming_sessions_today: 2,
        sessions_this_week: 6
      };

      setSessions(mockSessions);
      setStats(mockStats);
      
    } catch (error) {
      console.error('Failed to fetch sessions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSession = (): void => {
    // Implement session scheduling logic
    console.log('Scheduling session:', newSession);
    setShowScheduleDialog(false);
    // Reset form
    setNewSession({
      student_id: '',
      session_date: '',
      session_time: '',
      duration_minutes: 45,
      session_type: 'initial',
      session_mode: 'video_call',
      location: '',
      agenda: '',
      priority_level: 'medium',
      preparation_materials: ''
    });
  };

  const handleCompleteSession = (sessionId: string): void => {
    // Implement session completion logic
    console.log('Completing session:', sessionId);
    setShowSessionDialog(false);
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getSessionTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      initial: <User className="h-4 w-4" />,
      follow_up: <RefreshCw className="h-4 w-4" />,
      career_planning: <Target className="h-4 w-4" />,
      college_prep: <BookOpen className="h-4 w-4" />,
      skill_assessment: <Award className="h-4 w-4" />,
      goal_setting: <TrendingUp className="h-4 w-4" />
    };
    return icons[type] || <MessageSquare className="h-4 w-4" />;
  };

  const getSessionModeIcon = (mode: string) => {
    const icons: Record<string, React.ReactNode> = {
      video_call: <Video className="h-4 w-4" />,
      phone_call: <Phone className="h-4 w-4" />,
      in_person: <MapPin className="h-4 w-4" />
    };
    return icons[mode] || <MessageSquare className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Counseling Sessions</h1>
          <p className="text-gray-600">Schedule, track, and manage personalized career guidance sessions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Counseling Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Student</Label>
                    <Select value={newSession.student_id} onValueChange={(value) => setNewSession(prev => ({ ...prev, student_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="std_001">Arjun Sharma - Class 12</SelectItem>
                        <SelectItem value="std_002">Priya Patel - Class 11</SelectItem>
                        <SelectItem value="std_003">Rahul Singh - Class 12</SelectItem>
                        <SelectItem value="std_004">Ananya Gupta - Class 11</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Session Type</Label>
                    <Select value={newSession.session_type} onValueChange={(value) => setNewSession(prev => ({ ...prev, session_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Session</SelectItem>
                        <SelectItem value="follow_up">Follow-up</SelectItem>
                        <SelectItem value="career_planning">Career Planning</SelectItem>
                        <SelectItem value="college_prep">College Preparation</SelectItem>
                        <SelectItem value="skill_assessment">Skill Assessment</SelectItem>
                        <SelectItem value="goal_setting">Goal Setting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={newSession.session_date}
                      onChange={(e) => setNewSession(prev => ({ ...prev, session_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input 
                      type="time" 
                      value={newSession.session_time}
                      onChange={(e) => setNewSession(prev => ({ ...prev, session_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Select value={newSession.duration_minutes.toString()} onValueChange={(value) => setNewSession(prev => ({ ...prev, duration_minutes: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Session Mode</Label>
                    <Select value={newSession.session_mode} onValueChange={(value) => setNewSession(prev => ({ ...prev, session_mode: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video_call">Video Call</SelectItem>
                        <SelectItem value="phone_call">Phone Call</SelectItem>
                        <SelectItem value="in_person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select value={newSession.priority_level} onValueChange={(value) => setNewSession(prev => ({ ...prev, priority_level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Location/Meeting Details</Label>
                  <Input 
                    placeholder="Room number, meeting link, or location details"
                    value={newSession.location}
                    onChange={(e) => setNewSession(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Session Agenda</Label>
                  <Textarea 
                    placeholder="Enter session topics and objectives (one per line)"
                    value={newSession.agenda}
                    onChange={(e) => setNewSession(prev => ({ ...prev, agenda: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Preparation Materials</Label>
                  <Textarea 
                    placeholder="Materials student should bring or review before session"
                    value={newSession.preparation_materials}
                    onChange={(e) => setNewSession(prev => ({ ...prev, preparation_materials: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleSession}>
                    Schedule Session
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.total_sessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completion_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.avg_session_rating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.sessions_this_week}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search students or sessions..."
                      value={filters.search_query}
                      onChange={(e) => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filters.session_type} onValueChange={(value) => setFilters(prev => ({ ...prev, session_type: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="initial">Initial</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="career_planning">Career Planning</SelectItem>
                    <SelectItem value="college_prep">College Prep</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.priority_level} onValueChange={(value) => setFilters(prev => ({ ...prev, priority_level: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            {sessions
              .filter(session => session.status === 'scheduled' || session.status === 'in_progress')
              .map((session: CounselingSession) => (
              <Card key={session.session_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getSessionTypeIcon(session.session_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{session.student_name}</h3>
                        <p className="text-sm text-gray-600">{session.student_email} • Class {session.class_level}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(session.priority_level)}>
                            {session.priority_level} priority
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {session.session_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(session.session_date).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.session_time} ({session.duration_minutes}min)
                    </div>
                    <div className="flex items-center">
                      {getSessionModeIcon(session.session_mode)}
                      <span className="ml-2 capitalize">{session.session_mode.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {session.location}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Session Agenda:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {session.agenda.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {session.career_focus.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Career Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {session.career_focus.map((focus: string) => (
                          <Badge key={focus} variant="outline" className="text-xs">{focus}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {session.preparation_materials.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Student Preparation:</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <ul className="text-sm text-blue-800 space-y-1">
                          {session.preparation_materials.map((material: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {session.meeting_link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Session Details - {session.student_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Session details content would go here */}
                            <p>Detailed session information, notes, and management options...</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" onClick={() => handleCompleteSession(session.session_id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Sessions Tab */}
        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-4">
            {sessions
              .filter(session => session.status === 'completed')
              .map((session: CounselingSession) => (
              <Card key={session.session_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{session.student_name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(session.session_date).toLocaleDateString('en-IN')} • 
                          {session.session_type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </p>
                        {session.session_rating && (
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < session.session_rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">({session.session_rating}/5)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>

                  {session.session_notes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Session Notes:</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm">{session.session_notes}</p>
                      </div>
                    </div>
                  )}

                  {session.student_feedback && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Student Feedback:</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800 text-sm italic">"{session.student_feedback}"</p>
                      </div>
                    </div>
                  )}

                  {session.action_items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Action Items:</p>
                      <div className="space-y-2">
                        {session.action_items.map((item: ActionItem) => (
                          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className={`h-4 w-4 ${item.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className={`text-sm ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(item.status)} variant="outline">
                                {item.status}
                              </Badge>
                              <Badge className={getPriorityColor(item.priority)} variant="outline">
                                {item.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {session.next_session_needed && session.next_session_date && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          Follow-up session scheduled for {new Date(session.next_session_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Calendar integration coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">Full calendar view with scheduling capabilities</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Session Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Most Common Session Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.most_common_topics.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{topic.topic}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${(topic.count / 20) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{topic.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Session Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Session Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${stats.completion_rate}%`}}></div>
                        </div>
                        <span className="text-sm font-medium">{stats.completion_rate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.round(stats.avg_session_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{stats.avg_session_rating}/5</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats.scheduled_sessions}</p>
                        <p className="text-xs text-blue-800">Scheduled</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled_sessions}</p>
                        <p className="text-xs text-red-800">Cancelled</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
