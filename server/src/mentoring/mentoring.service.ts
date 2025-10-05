// server/src/mentoring/mentoring.service.ts (COMPLETE SYNCHRONIZED VERSION)

import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  MentoringDashboardDto,
  MentoringStatsDto,
  MentorDto,
  SessionDto,
  SessionListDto,
  CreateSessionDto,
  UpdateSessionDto,
  SessionFeedbackDto,
  MentorAvailabilityDto,
  MentorMatchRequestDto,
  WhatsAppGroupDto,
  WhatsAppQuestionDto,
  CreateQuestionDto,
  ChatRoomDto,
  ChatMessageDto,
  SendMessageDto,
  CreateChatRoomDto,
  TimetableSlotDto,
  WeeklyTimetableDto,
  AvailableSlotDto,
  BookSessionDto,
  SessionType,
  SessionStatus,
  ParticipantStatus,
  MessageType,
} from './dto/mentoring.dto';

// ✅ COMPREHENSIVE TYPE DEFINITIONS
interface DatabaseSession {
  id: string;
  title: string;
  description: string;
  mentor_id: string;
  session_date: string;
  duration: number;
  session_type: SessionType;
  subject: string;
  max_participants: number;
  current_participants?: number;
  meeting_link: string | null;
  meeting_room: string | null;
  session_notes: string | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
  session_participants?: any[];
  hei_mentor_profiles?: any;
}

interface DatabaseMentor {
  id: string;
  user_id: string;
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
  designation: string;
  department: string;
  expertise: string[];
  qualification: string;
  experience_years: number;
  max_students: number;
  research_interests: string[];
  created_at: string;
  mentor_student_assignments?: any[];
}

interface DatabaseChatRoom {
  id: string;
  name: string;
  description: string;
  room_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  metadata?: Record<string, any> | null;
}

interface DatabaseChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  file_url: string | null;
  reply_to_id: string | null;
  is_edited: boolean;
  created_at: string;
  users?: { full_name: string };
}

interface DatabaseChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  role?: 'mentor' | 'student';
  is_admin: boolean;
  is_active: boolean;
  joined_at: string;
  last_seen?: string;
  unread_count?: number;
}

interface DatabaseWhatsAppGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  member_count: number;
  max_members: number;
  whatsapp_link: string;
  mentor_id: string;
  active_hours: string;
  guidelines: string[];
  created_at: string;
  hei_mentor_profiles?: DatabaseMentor;
  whatsapp_group_members?: any[];
}

interface DatabaseSessionParticipant {
  id: string;
  session_id: string;
  student_id: string;
  attendance_status: string;
  registration_date: string;
  rating: number | null;
  feedback: string | null;
}

interface MentorStudentAssignment {
  id: string;
  mentor_id: string;
  student_id: string;
  status: string;
  assigned_at: string;
  created_at: string;
  assigned_by?: string;
  completed_at?: string;
  notes?: string;
}

interface CreateChatRoomData {
  name: string;
  subject?: string;
  participantIds: string[];
}

interface CreateDepartmentChatData {
  name: string;
  department: string;
}

@Injectable()
export class MentoringService {
  private readonly logger = new Logger(MentoringService.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  /* ---------- DASHBOARD METHODS ---------- */

  async getMentoringDashboard(studentId: string): Promise<MentoringDashboardDto> {
    try {
      this.logger.log(`Fetching mentoring dashboard for student: ${studentId}`);

      const [upcomingSessions, recentSessions, assignedMentors, stats, recentActivity, weeklyTimetable] = 
        await Promise.all([
          this.getUpcomingSessions(studentId, 5),
          this.getRecentSessions(studentId, 3),
          this.getAssignedMentors(studentId),
          this.getMentoringStats(studentId),
          this.getRecentActivity(studentId, 10),
          this.getWeeklyTimetable(studentId),
        ]);

      return {
        upcomingSessions: upcomingSessions.sessions,
        recentSessions: recentSessions.sessions,
        assignedMentors,
        stats,
        recentActivity,
        weeklyTimetable: weeklyTimetable.days,
      };
    } catch (error: any) {
      this.logger.error('Error fetching mentoring dashboard:', error);
      throw new BadRequestException('Failed to fetch mentoring dashboard');
    }
  }

  async getMentoringStats(studentId: string): Promise<MentoringStatsDto> {
    try {
      // Get upcoming sessions count
      const { count: upcomingSessions } = await this.supabase
        .from('session_participants')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('attendance_status', 'registered');

      // Get completed sessions count
      const { count: completedSessions } = await this.supabase
        .from('session_participants')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('attendance_status', 'completed');

      // Get assigned mentors count
      const { count: assignedMentors } = await this.supabase
        .from('mentor_student_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('status', 'active');

      // Get average rating
      const { data: feedbacks } = await this.supabase
        .from('session_participants')
        .select('rating')
        .eq('student_id', studentId)
        .not('rating', 'is', null);

      const averageRating = feedbacks && feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length
        : 0;

      // Get active WhatsApp groups
      const { count: activeWhatsAppGroups } = await this.supabase
        .from('whatsapp_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('is_active', true);

      return {
        upcomingSessions: upcomingSessions || 0,
        completedSessions: completedSessions || 0,
        assignedMentors: assignedMentors || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalHoursCompleted: 0, // TODO: Calculate from completed sessions
        activeWhatsAppGroups: activeWhatsAppGroups || 0,
      };
    } catch (error: any) {
      this.logger.error('Error fetching mentoring stats:', error);
      throw new BadRequestException('Failed to fetch mentoring stats');
    }
  }

  /* ---------- SESSION MANAGEMENT METHODS ---------- */

  async getSessions(
    studentId: string,
    status?: SessionStatus,
    limit: number = 20,
    offset: number = 0
  ): Promise<SessionListDto> {
    try {
      this.logger.log(`Getting sessions for student: ${studentId}`);

      // Get all sessions first
      let sessionsQuery = this.supabase
        .from('mentoring_sessions')
        .select('*');

      if (status) {
        sessionsQuery = sessionsQuery.eq('status', status);
      }

      const { data: allSessions, error: sessionsError } = await sessionsQuery
        .order('session_date', { ascending: true });

      if (sessionsError) throw sessionsError;

      if (!allSessions || allSessions.length === 0) {
        return { sessions: [], total: 0, page: 1, limit };
      }

      const typedSessions = allSessions as DatabaseSession[];

      // Get session participants
      const sessionIds = typedSessions.map(s => s.id);
      const { data: participants } = await this.supabase
        .from('session_participants')
        .select('*')
        .in('session_id', sessionIds);

      const typedParticipants = (participants || []) as DatabaseSessionParticipant[];

      // Get mentor profiles
      const mentorIds = typedSessions
        .map(s => s.mentor_id)
        .filter((id): id is string => id !== null && id !== undefined);

      let mentorProfiles: DatabaseMentor[] = [];
      if (mentorIds.length > 0) {
        const { data: mentors } = await this.supabase
          .from('hei_mentor_profiles')
          .select('*')
          .in('id', mentorIds);
        mentorProfiles = (mentors || []) as DatabaseMentor[];
      }

      // Get user names for mentors
      const userIds = mentorProfiles
        .map(m => m.user_id)
        .filter((id): id is string => id !== null && id !== undefined);

      let users: any[] = [];
      if (userIds.length > 0) {
        const { data: userData } = await this.supabase
          .from('users')
          .select('id, full_name')
          .in('id', userIds);
        users = userData || [];
      }

      // Combine data
      const combinedSessions: DatabaseSession[] = typedSessions.map(session => {
        session.session_participants = typedParticipants.filter(p => p.session_id === session.id);
        
        const mentorProfile = mentorProfiles.find(m => m.id === session.mentor_id);
        if (mentorProfile) {
          const user = users.find(u => u.id === mentorProfile.user_id);
          session.hei_mentor_profiles = {
            ...mentorProfile,
            users: user ? { full_name: user.full_name } : { full_name: 'Unknown Mentor' }
          };
        }
        return session;
      });

      // Filter accessible sessions
      const accessibleSessions = combinedSessions.filter(session => {
        const isParticipant = session.session_participants?.some((p: any) => p.student_id === studentId) ?? false;
        const isPublicSession = ['group', 'workshop'].includes(session.session_type);
        return isParticipant || isPublicSession;
      });

      // Apply pagination
      const paginatedSessions = accessibleSessions.slice(offset, offset + limit);
      const formattedSessions = paginatedSessions.map(session => this.formatSessionDto(session, studentId));

      return {
        sessions: formattedSessions,
        total: accessibleSessions.length,
        page: Math.floor(offset / limit) + 1,
        limit,
      };
    } catch (error: any) {
      this.logger.error('Error getting sessions:', error);
      throw new BadRequestException('Failed to get sessions');
    }
  }

  async getSessionById(sessionId: string, studentId: string): Promise<SessionDto> {
    try {
      const { data: session, error } = await this.supabase
        .from('mentoring_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        throw new NotFoundException('Session not found');
      }

      return this.formatSessionDto(session as DatabaseSession, studentId);
    } catch (error: any) {
      this.logger.error('Error getting session by ID:', error);
      throw error;
    }
  }

  async createSession(mentorId: string, createData: CreateSessionDto): Promise<SessionDto> {
    try {
      this.logger.log(`Creating session: ${createData.title}`);

      // Get mentor profile
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id')
        .eq('user_id', mentorId)
        .single();

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }

      const sessionData = {
        title: createData.title,
        description: createData.description,
        mentor_id: mentorProfile.id,
        session_date: createData.sessionDate,
        duration: createData.duration,
        session_type: createData.sessionType,
        subject: createData.subject,
        max_participants: createData.maxParticipants,
        meeting_link: createData.meetingLink || null,
        meeting_room: createData.meetingRoom || null,
        session_notes: createData.sessionNotes || null,
        status: SessionStatus.SCHEDULED,
      };

      const { data: session, error } = await this.supabase
        .from('mentoring_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      // Auto-create session group chat
      if (session) {
        await this.createSessionChatRoom(session.id, mentorProfile.id);
      }

      return this.formatSessionDto(session as DatabaseSession, mentorId);
    } catch (error: any) {
      this.logger.error('Error creating session:', error);
      throw new BadRequestException('Failed to create session');
    }
  }

  async updateSession(sessionId: string, mentorId: string, updateData: UpdateSessionDto): Promise<SessionDto> {
    try {
      const { data: session, error } = await this.supabase
        .from('mentoring_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return this.formatSessionDto(session as DatabaseSession, mentorId);
    } catch (error: any) {
      this.logger.error('Error updating session:', error);
      throw new BadRequestException('Failed to update session');
    }
  }

  async joinSession(sessionId: string, studentId: string): Promise<void> {
    try {
      this.logger.log(`Student ${studentId} joining session ${sessionId}`);

      // Check if already joined
      const { data: existingParticipant } = await this.supabase
        .from('session_participants')
        .select('id')
        .eq('session_id', sessionId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existingParticipant) {
        throw new BadRequestException('Already registered for this session');
      }

      const { error } = await this.supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          student_id: studentId,
          attendance_status: 'registered',
        });

      if (error) throw error;

      // Auto-add to session chat
      await this.addStudentToSessionChat(sessionId, studentId);
      
      this.logger.log('✅ Student joined session and added to chat');
    } catch (error: any) {
      this.logger.error('Error joining session:', error);
      throw new BadRequestException('Failed to join session');
    }
  }

  async submitSessionFeedback(sessionId: string, studentId: string, feedbackData: SessionFeedbackDto): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('session_participants')
        .update({
          rating: feedbackData.rating,
          feedback: feedbackData.comment,
        })
        .eq('session_id', sessionId)
        .eq('student_id', studentId);

      if (error) throw error;

      this.logger.log('✅ Feedback submitted successfully');
    } catch (error: any) {
      this.logger.error('Error submitting feedback:', error);
      throw new BadRequestException('Failed to submit feedback');
    }
  }

  /* ---------- MENTOR MANAGEMENT METHODS ---------- */

  async getAvailableMentors(subject?: string, limit: number = 20): Promise<MentorDto[]> {
    try {
      let query = this.supabase
        .from('hei_mentor_profiles')
        .select(`
          *,
          users!inner(full_name),
          mentor_student_assignments!left(id)
        `);

      if (subject) {
        query = query.contains('expertise', [subject]);
      }

      const { data: mentors, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (mentors || []).map((mentor: any) => this.formatMentorDto(mentor));
    } catch (error: any) {
      this.logger.error('Error getting available mentors:', error);
      throw new BadRequestException('Failed to get available mentors');
    }
  }

  async getMentorById(mentorId: string): Promise<MentorDto> {
    try {
      const { data: mentor, error } = await this.supabase
        .from('hei_mentor_profiles')
        .select(`
          *,
          users!inner(full_name),
          mentor_student_assignments!left(id)
        `)
        .eq('id', mentorId)
        .single();

      if (error || !mentor) {
        throw new NotFoundException('Mentor not found');
      }

      return this.formatMentorDto(mentor);
    } catch (error: any) {
      this.logger.error('Error getting mentor by ID:', error);
      throw error;
    }
  }

  async getMentorAvailability(mentorId: string): Promise<MentorAvailabilityDto[]> {
    try {
      const { data: availability, error } = await this.supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('day_of_week');

      if (error) throw error;

      return (availability || []).map(slot => ({
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        isAvailable: slot.is_available,
      }));
    } catch (error: any) {
      this.logger.error('Error getting mentor availability:', error);
      throw new BadRequestException('Failed to get mentor availability');
    }
  }

  async requestMentorMatch(studentId: string, matchRequest: MentorMatchRequestDto): Promise<void> {
    try {
      this.logger.log(`Processing mentor match request for student: ${studentId}`);

      // Find compatible mentors
      const { data: mentors, error } = await this.supabase
        .from('hei_mentor_profiles')
        .select('*')
        .contains('expertise', matchRequest.interests)
        .limit(1);

      if (error) throw error;

      const bestMentor = mentors?.[0];
      
      if (bestMentor) {
        // Create assignment
        const { error: assignError } = await this.supabase
          .from('mentor_student_assignments')
          .insert({
            mentor_id: bestMentor.id,
            student_id: studentId,
            status: 'active',
          });

        if (assignError) throw assignError;

        // Auto-create 1:1 chat room
        await this.createMentorStudentChatRoom(bestMentor.id, studentId);
        
        this.logger.log('✅ Mentor assigned and chat room created');
      } else {
        throw new NotFoundException('No available mentors found matching your criteria');
      }
    } catch (error: any) {
      this.logger.error('Error in mentor match request:', error);
      throw new BadRequestException('Failed to match with mentor');
    }
  }

  /* ---------- TIMETABLE & SCHEDULING METHODS ---------- */

  async getWeeklyTimetable(studentId: string, weekStart?: string): Promise<WeeklyTimetableDto> {
    try {
      const startDate = weekStart ? new Date(weekStart) : new Date();
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      // For now, return empty timetable
      return {
        weekStart: startDate.toISOString().split('T')[0],
        weekEnd: endDate.toISOString().split('T')[0],
        days: Array.from({ length: 7 }, () => []),
      };
    } catch (error: any) {
      this.logger.error('Error getting weekly timetable:', error);
      throw new BadRequestException('Failed to get weekly timetable');
    }
  }

  async getAvailableSlots(mentorId?: string, date?: string): Promise<AvailableSlotDto[]> {
    try {
      // For now, return empty slots
      return [];
    } catch (error: any) {
      this.logger.error('Error getting available slots:', error);
      throw new BadRequestException('Failed to get available slots');
    }
  }

  async bookSession(studentId: string, bookingData: BookSessionDto): Promise<SessionDto> {
    try {
      this.logger.log(`Booking session for student: ${studentId}`);

      const sessionData: CreateSessionDto = {
        title: `${bookingData.subject} Session`,
        description: bookingData.description || `One-on-one session for ${bookingData.subject}`,
        mentorId: bookingData.mentorId,
        sessionDate: bookingData.sessionDate,
        duration: bookingData.duration,
        sessionType: SessionType.ONE_ON_ONE,
        subject: bookingData.subject,
        maxParticipants: 1,
      };

      const session = await this.createSession(bookingData.mentorId, sessionData);
      await this.joinSession(session.id, studentId);

      return session;
    } catch (error: any) {
      this.logger.error('Error booking session:', error);
      throw new BadRequestException('Failed to book session');
    }
  }

  /* ---------- WHATSAPP GROUP METHODS ---------- */

  async getWhatsAppGroups(studentId: string): Promise<WhatsAppGroupDto[]> {
    try {
      const { data: groups, error } = await this.supabase
        .from('whatsapp_groups')
        .select(`
          *,
          hei_mentor_profiles(
            id,
            designation,
            department,
            users(full_name)
          ),
          whatsapp_group_members!left(
            id, is_active, unread_count, is_pinned, student_id
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (groups || []).map((group: any) => this.formatWhatsAppGroupDto(group, studentId));
    } catch (error: any) {
      this.logger.error('Error getting WhatsApp groups:', error);
      throw new BadRequestException('Failed to get WhatsApp groups');
    }
  }

  async createWhatsAppGroup(userId: string, groupData: any): Promise<WhatsAppGroupDto> {
    try {
      this.logger.log(`Creating WhatsApp group entry: ${groupData.name}`);
      
      const { data: group, error } = await this.supabase
        .from('whatsapp_groups')
        .insert({
          name: groupData.name,
          subject: groupData.subject,
          description: groupData.description,
          whatsapp_link: groupData.whatsappLink,
          mentor_id: userId,
          is_active: true,
          member_count: 0,
          max_members: 256,
          active_hours: '9:00 AM - 6:00 PM',
        })
        .select()
        .single();

      if (error) throw error;

      return this.formatWhatsAppGroupDto(group, userId);
    } catch (error: any) {
      this.logger.error('Error creating WhatsApp group:', error);
      throw new BadRequestException('Failed to create WhatsApp group');
    }
  }

  async joinWhatsAppGroup(groupId: string, studentId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('whatsapp_group_members')
        .insert({
          group_id: groupId,
          student_id: studentId,
          is_active: true,
        });

      if (error) throw error;

      this.logger.log('✅ Successfully joined WhatsApp group');
    } catch (error: any) {
      this.logger.error('Error joining WhatsApp group:', error);
      throw new BadRequestException('Failed to join WhatsApp group');
    }
  }

  async leaveWhatsAppGroup(groupId: string, studentId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('whatsapp_group_members')
        .update({ is_active: false })
        .eq('group_id', groupId)
        .eq('student_id', studentId);

      if (error) throw error;

      this.logger.log('✅ Successfully left WhatsApp group');
    } catch (error: any) {
      this.logger.error('Error leaving WhatsApp group:', error);
      throw new BadRequestException('Failed to leave WhatsApp group');
    }
  }

  async getWhatsAppQuestions(groupId?: string, limit: number = 20): Promise<WhatsAppQuestionDto[]> {
    try {
      let query = this.supabase
        .from('whatsapp_questions')
        .select(`
          *,
          student:users!whatsapp_questions_student_id_fkey(full_name),
          answerer:users!whatsapp_questions_answered_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data: questions, error } = await query.limit(limit);

      if (error) throw error;

      return (questions || []).map((q: any) => ({
        id: q.id,
        question: q.question,
        subject: q.subject,
        studentName: q.student?.full_name || 'Unknown',
        answeredBy: q.answerer?.full_name || '',
        answer: q.answer || '',
        upvotes: q.upvotes,
        isResolved: q.is_resolved,
        createdAt: q.created_at,
      }));
    } catch (error: any) {
      this.logger.error('Error getting WhatsApp questions:', error);
      throw new BadRequestException('Failed to get WhatsApp questions');
    }
  }

  async createWhatsAppQuestion(studentId: string, questionData: CreateQuestionDto): Promise<WhatsAppQuestionDto> {
    try {
      const { data: question, error } = await this.supabase
        .from('whatsapp_questions')
        .insert({
          group_id: questionData.groupId,
          student_id: studentId,
          question: questionData.question,
          subject: questionData.subject,
        })
        .select(`
          *,
          student:users!whatsapp_questions_student_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: question.id,
        question: question.question,
        subject: question.subject,
        studentName: question.student?.full_name || 'Unknown',
        answeredBy: '',
        answer: '',
        upvotes: 0,
        isResolved: false,
        createdAt: question.created_at,
      };
    } catch (error: any) {
      this.logger.error('Error creating WhatsApp question:', error);
      throw new BadRequestException('Failed to create WhatsApp question');
    }
  }

  /* ---------- CHAT SYSTEM METHODS ---------- */

  async getChatRooms(userId: string): Promise<ChatRoomDto[]> {
    try {
      this.logger.log(`Fetching chat rooms for user: ${userId}`);

      const { data: userRooms, error } = await this.supabase
        .from('chat_room_participants')
        .select(`
          room_id,
          chat_rooms!inner(
            id,
            name,
            description,
            room_type,
            created_by,
            created_at,
            is_active
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      const chatRooms: ChatRoomDto[] = [];

      if (!userRooms || userRooms.length === 0) {
        return chatRooms;
      }

      for (const userRoom of userRooms) {
        const room = (userRoom as any).chat_rooms as DatabaseChatRoom;
        
        // Get participant count
        const { count: participantCount } = await this.supabase
          .from('chat_room_participants')
          .select('*', { count: 'exact' })
          .eq('room_id', room.id)
          .eq('is_active', true);

        // Get participants info
        const { data: participants } = await this.supabase
          .from('chat_room_participants')
          .select('user_id, is_admin')
          .eq('room_id', room.id)
          .eq('is_active', true);

        // Get last message
        const { data: lastMessage } = await this.supabase
          .from('chat_messages')
          .select('id, content, created_at, message_type, users(full_name)')
          .eq('room_id', room.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const formattedLastMessage: ChatMessageDto | null = lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          messageType: lastMessage.message_type || MessageType.TEXT,
          senderName: (lastMessage as any).users?.full_name || 'Unknown',
          senderId: '',
          fileUrl: undefined,
          replyTo: undefined,
          isEdited: false,
          createdAt: lastMessage.created_at,
          reactions: []
        } : null;

        chatRooms.push({
          id: room.id,
          name: room.name,
          description: room.description,
          roomType: room.room_type,
          participantCount: participantCount || 0,
          unreadCount: 0,
          lastMessage: formattedLastMessage,
          createdBy: room.created_by,
          createdAt: room.created_at,
          isActive: room.is_active,
          participants: (participants || []).map((p: any) => ({
            userId: p.user_id,
            role: 'student',
            isAdmin: p.is_admin
          }))
        });
      }

      return chatRooms;
    } catch (error: any) {
      this.logger.error('Error getting chat rooms:', error);
      throw new BadRequestException('Failed to get chat rooms');
    }
  }

  async getChatMessages(roomId: string, userId: string, limit: number = 50): Promise<ChatMessageDto[]> {
    try {
      // Verify user has access to this room
      const { data: participant } = await this.supabase
        .from('chat_room_participants')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (!participant) {
        throw new ForbiddenException('Access denied to this chat room');
      }

      const { data: messages, error } = await this.supabase
        .from('chat_messages')
        .select(`
          *,
          users(full_name)
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (messages || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        messageType: msg.message_type || MessageType.TEXT,
        senderName: (msg as any).users?.full_name || 'Unknown',
        senderId: msg.sender_id,
        fileUrl: msg.file_url || undefined,
        replyTo: undefined,
        isEdited: msg.is_edited,
        createdAt: msg.created_at,
        reactions: []
      })).reverse();
    } catch (error: any) {
      this.logger.error('Error getting chat messages:', error);
      throw error;
    }
  }

  async sendChatMessage(roomId: string, userId: string, messageData: SendMessageDto): Promise<ChatMessageDto> {
    try {
      const { data: message, error } = await this.supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: userId,
          content: messageData.content,
          message_type: messageData.messageType,
          file_url: messageData.fileUrl,
          reply_to_id: messageData.replyToId,
        })
        .select(`
          *,
          users(full_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: message.id,
        content: message.content,
        messageType: message.message_type || MessageType.TEXT,
        senderName: (message as any).users?.full_name || 'Unknown',
        senderId: message.sender_id,
        fileUrl: message.file_url || undefined,
        replyTo: undefined,
        isEdited: false,
        createdAt: message.created_at,
        reactions: []
      };
    } catch (error: any) {
      this.logger.error('Error sending chat message:', error);
      throw new BadRequestException('Failed to send chat message');
    }
  }

  async createChatRoom(roomData: CreateChatRoomDto): Promise<ChatRoomDto> {
    try {
      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .insert({
          name: roomData.name,
          description: roomData.description,
          room_type: roomData.roomType || 'text_only',
          created_by: roomData.participantIds[0],
          is_active: true,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      const participants = roomData.participantIds.map((userId: string, index: number) => ({
        room_id: room.id,
        user_id: userId,
        is_admin: index === 0,
        is_active: true,
      }));

      const { error: participantsError } = await this.supabase
        .from('chat_room_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return {
        id: room.id,
        name: room.name,
        description: room.description,
        roomType: room.room_type,
        participantCount: participants.length,
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: participants.map(p => ({
          userId: p.user_id,
          role: 'student',
          isAdmin: p.is_admin
        }))
      };
    } catch (error: any) {
      this.logger.error('Error creating chat room:', error);
      throw new BadRequestException('Failed to create chat room');
    }
  }

  async joinChatRoom(roomId: string, userId: string): Promise<void> {
    try {
      console.log(`User joining chat room: ${roomId}`);
      
      // Check if already joined
      const { data: existingParticipant } = await this.supabase
        .from('chat_room_participants')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingParticipant) {
        throw new BadRequestException('Already joined this chat room');
      }

      const { error } = await this.supabase
        .from('chat_room_participants')
        .insert({
          room_id: roomId,
          user_id: userId,
          is_active: true,
        });

      if (error) throw new Error(`Failed to join chat room: ${error.message}`);
      
      console.log('✅ Successfully joined chat room');
    } catch (error: any) {
      console.log('❌ Error joining chat room:', error.message);
      throw error;
    }
  }

  async getUserChatRooms(userId: string): Promise<ChatRoomDto[]> {
    try {
      console.log(`Getting user chat rooms: ${userId}`);
      
      const { data: rooms, error } = await this.supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_room_participants!inner(id, is_active)
        `)
        .eq('chat_room_participants.user_id', userId)
        .eq('chat_room_participants.is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw new Error(`Failed to get chat rooms: ${error.message}`);

      return (rooms || []).map((room: any) => ({
        id: room.id,
        name: room.name,
        description: room.description || '',
        roomType: room.room_type,
        participantCount: 0, // Would need additional query
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: []
      }));
    } catch (error: any) {
      console.log('❌ Error getting user chat rooms:', error.message);
      throw error;
    }
  }

  /* ---------- AUTO-CHAT CREATION METHODS ---------- */

  async createMentorStudentChatRoom(mentorId: string, studentId: string): Promise<ChatRoomDto | null> {
    try {
      this.logger.log(`Creating mentor-student chat room: ${mentorId} <-> ${studentId}`);

      // Get mentor and student info
      const { data: mentor, error: mentorError } = await this.supabase
        .from('hei_mentor_profiles')
        .select(`
          id,
          users!inner(id, full_name, email)
        `)
        .eq('id', mentorId)
        .single();

      if (mentorError) throw mentorError;

      const { data: student, error: studentError } = await this.supabase
        .from('users')
        .select('id, full_name')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      const roomName = `${(mentor as any).users.full_name} ↔ ${student.full_name}`;
      
      // Check if chat room already exists
      const { data: existingRoom } = await this.supabase
        .from('chat_rooms')
        .select('id')
        .eq('room_type', 'one_on_one')
        .contains('metadata', { mentor_id: mentorId, student_id: studentId })
        .single();

      if (existingRoom) {
        this.logger.log('✅ Chat room already exists for this mentor-student pair');
        return null;
      }

      // Create chat room
      const roomData = {
        name: roomName,
        description: '1:1 Mentoring Chat - Ask questions, get guidance, and stay connected!',
        room_type: 'one_on_one',
        created_by: mentorId,
        is_active: true,
        metadata: { 
          mentor_id: mentorId, 
          student_id: studentId,
          relationship_type: 'mentor_student'
        },
      };

      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      const participantsData = [
        {
          room_id: room.id,
          user_id: mentorId,
          is_admin: true,
          is_active: true,
        },
        {
          room_id: room.id,
          user_id: studentId,
          is_admin: false,
          is_active: true,
        },
      ];

      const { error: participantError } = await this.supabase
        .from('chat_room_participants')
        .insert(participantsData);

      if (participantError) throw participantError;

      this.logger.log(`✅ Auto-created mentor-student chat room: ${roomName}`);
      
      return {
        id: room.id,
        name: room.name,
        description: room.description,
        roomType: room.room_type,
        participantCount: participantsData.length,
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: participantsData.map(p => ({
          userId: p.user_id,
          role: p.user_id === mentorId ? 'mentor' : 'student',
          isAdmin: p.is_admin
        }))
      };
    } catch (error: any) {
      this.logger.error('❌ Failed to create mentor-student chat:', error);
      return null;
    }
  }

  async createSessionChatRoom(sessionId: string, mentorId: string): Promise<ChatRoomDto | null> {
    try {
      this.logger.log(`Creating session chat room for session: ${sessionId}`);

      const { data: session, error: sessionError } = await this.supabase
        .from('mentoring_sessions')
        .select('id, title, session_type')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const roomName = `${session.title} - Group Chat`;
      
      // Check if session chat already exists
      const { data: existingRoom } = await this.supabase
        .from('chat_rooms')
        .select('id')
        .eq('room_type', 'session_group')
        .contains('metadata', { session_id: sessionId })
        .single();

      if (existingRoom) {
        this.logger.log('✅ Session chat room already exists');
        return null;
      }

      // Create session chat room
      const roomData = {
        name: roomName,
        description: `Group discussion for ${session.title}. Ask questions, share insights, and collaborate!`,
        room_type: 'session_group',
        created_by: mentorId,
        is_active: true,
        metadata: { 
          session_id: sessionId,
          session_type: session.session_type,
        },
      };

      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      // Add mentor as admin
      const participantData = {
        room_id: room.id,
        user_id: mentorId,
        is_admin: true,
        is_active: true,
      };

      const { error: participantError } = await this.supabase
        .from('chat_room_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      this.logger.log(`✅ Auto-created session chat room: ${roomName}`);

      return {
        id: room.id,
        name: room.name,
        description: room.description,
        roomType: room.room_type,
        participantCount: 1,
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: [{
          userId: participantData.user_id,
          role: 'mentor',
          isAdmin: participantData.is_admin
        }]
      };
    } catch (error: any) {
      this.logger.error('❌ Failed to create session chat:', error);
      return null;
    }
  }

  async addStudentToSessionChat(sessionId: string, studentId: string): Promise<boolean> {
    try {
      this.logger.log(`Adding student ${studentId} to session ${sessionId} chat`);

      // Find session chat room
      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .select('id, name')
        .eq('room_type', 'session_group')
        .contains('metadata', { session_id: sessionId })
        .single();

      if (roomError || !room) {
        this.logger.warn(`No session chat room found for session: ${sessionId}`);
        return false;
      }

      // Check if student is already in the room
      const { data: existingParticipant } = await this.supabase
        .from('chat_room_participants')
        .select('id')
        .eq('room_id', room.id)
        .eq('user_id', studentId)
        .single();

      if (existingParticipant) {
        this.logger.log('✅ Student already in session chat');
        return true;
      }

      // Add student to chat room
      const participantData = {
        room_id: room.id,
        user_id: studentId,
        is_admin: false,
        is_active: true,
      };

      const { error: participantError } = await this.supabase
        .from('chat_room_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      this.logger.log(`✅ Added student to session chat: ${room.name}`);
      return true;
    } catch (error: any) {
      this.logger.error('❌ Failed to add student to session chat:', error);
      return false;
    }
  }

  /* ---------- MANUAL CHAT CREATION METHODS ---------- */

  async createStudyGroupChat(creatorId: string, data: CreateChatRoomData): Promise<ChatRoomDto> {
    try {
      this.logger.log(`Creating study group chat: ${data.name}`);

      const roomName = `${data.subject} - ${data.name}`;
      
      const roomData = {
        name: roomName,
        description: `Study group for ${data.subject}. Collaborate, share notes, and learn together!`,
        room_type: 'study_group',
        created_by: creatorId,
        is_active: true,
        metadata: { 
          subject: data.subject,
          study_group_type: 'student_created'
        },
      };

      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      // Add all participants
      const allParticipantIds = [creatorId, ...data.participantIds];
      const participantsData = allParticipantIds.map(userId => ({
        room_id: room.id,
        user_id: userId,
        is_admin: userId === creatorId,
        is_active: true,
      }));

      const { error: participantError } = await this.supabase
        .from('chat_room_participants')
        .insert(participantsData);

      if (participantError) throw participantError;

      this.logger.log(`✅ Created study group chat: ${roomName}`);

      return {
        id: room.id,
        name: room.name,
        description: room.description,
        roomType: room.room_type,
        participantCount: participantsData.length,
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: participantsData.map(p => ({
          userId: p.user_id,
          role: 'student',
          isAdmin: p.is_admin
        }))
      };
    } catch (error: any) {
      this.logger.error('❌ Failed to create study group chat:', error);
      throw new BadRequestException('Failed to create study group chat');
    }
  }

  async createDepartmentChat(mentorId: string, data: CreateDepartmentChatData): Promise<ChatRoomDto> {
    try {
      this.logger.log(`Creating department chat: ${data.name}`);

      const roomName = `${data.department} - ${data.name}`;
      
      const roomData = {
        name: roomName,
        description: `Department-wide discussion for ${data.department}. Stay updated with announcements and connect with peers!`,
        room_type: 'department',
        created_by: mentorId,
        is_active: true,
        metadata: { 
          department: data.department,
          access_level: 'department_wide'
        },
      };

      const { data: room, error: roomError } = await this.supabase
        .from('chat_rooms')
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      // Add mentor as admin
      const participantData = {
        room_id: room.id,
        user_id: mentorId,
        is_admin: true,
        is_active: true,
      };

      const { error: participantError } = await this.supabase
        .from('chat_room_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      this.logger.log(`✅ Created department chat: ${roomName}`);

      return {
        id: room.id,
        name: room.name,
        description: room.description,
        roomType: room.room_type,
        participantCount: 1,
        unreadCount: 0,
        lastMessage: null,
        createdBy: room.created_by,
        createdAt: room.created_at,
        isActive: room.is_active,
        participants: [{
          userId: participantData.user_id,
          role: 'mentor',
          isAdmin: participantData.is_admin
        }]
      };
    } catch (error: any) {
      this.logger.error('❌ Failed to create department chat:', error);
      throw new BadRequestException('Failed to create department chat');
    }
  }

  /* ---------- SYSTEM INFO METHODS ---------- */

  getSystemFeatures(): any {
    return {
      mentoring: {
        sessionBooking: true,
        mentorMatching: true,
        feedback: true,
        timetable: true,
      },
      communication: {
        whatsappGroups: true,
        textOnlyChat: true,
        googleMeetIntegration: true,
      },
      storage: {
        localFiles: true,
        temporaryUploads: true,
        autoCleanup: true,
      },
      limitations: {
        noFileUploadsInChat: true,
        textOnlyMessaging: true,
        fileRetention: '30 days',
      },
    };
  }

  getUsageDisclaimer(): any {
    return {
      chatSystem: 'Chat system supports text messages only. No file uploads to keep the system fast and efficient.',
      whatsappGroups: 'WhatsApp group links are processed and stored locally. Join instructions are provided for both mobile and desktop.',
      googleMeet: 'Google Meet integration creates professional meeting rooms for mentoring sessions.',
      dataRetention: 'Temporary files are automatically cleaned up after 30 days to manage storage efficiently.',
      support: 'For technical issues, contact your institution administrators.',
    };
  }

  /* ---------- STUB IMPLEMENTATIONS (TO BE COMPLETED) ---------- */

  async getUpcomingSessions(studentId: string, limit: number = 10): Promise<SessionListDto> {
    // Get upcoming sessions
    const { data: upcomingSessions } = await this.supabase
      .from('session_participants')
      .select(`
        mentoring_sessions!inner(*)
      `)
      .eq('student_id', studentId)
      .eq('attendance_status', 'registered')
      .limit(limit);

    const sessions = (upcomingSessions || []).map((item: any) => 
      this.formatSessionDto(item.mentoring_sessions, studentId)
    );

    return { sessions, total: sessions.length, page: 1, limit };
  }

  async getRecentSessions(studentId: string, limit: number = 5): Promise<SessionListDto> {
    // Get recent completed sessions
    const { data: recentSessions } = await this.supabase
      .from('session_participants')
      .select(`
        mentoring_sessions!inner(*)
      `)
      .eq('student_id', studentId)
      .eq('attendance_status', 'completed')
      .limit(limit);

    const sessions = (recentSessions || []).map((item: any) => 
      this.formatSessionDto(item.mentoring_sessions, studentId)
    );

    return { sessions, total: sessions.length, page: 1, limit };
  }

  async getAssignedMentors(studentId: string): Promise<MentorDto[]> {
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select(`
        hei_mentor_profiles!inner(
          *,
          users!inner(full_name),
          mentor_student_assignments!left(id)
        )
      `)
      .eq('student_id', studentId)
      .eq('status', 'active');

    return (assignments || []).map((assignment: any) => 
      this.formatMentorDto(assignment.hei_mentor_profiles)
    );
  }

  async getRecentActivity(studentId: string, limit: number = 10): Promise<any[]> {
    // Simplified recent activity
    return [
      {
        type: 'session_completed',
        description: 'Completed session with Dr. Sharma',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'feedback_given',
        description: 'Submitted feedback for Python workshop',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /* ---------- HELPER METHODS ---------- */

  private formatSessionDto(session: DatabaseSession, userId: string): SessionDto {
    const participant = session.session_participants?.find((p: any) => p.student_id === userId);
    const currentParticipants = session.session_participants?.length || 0;

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      sessionDate: session.session_date,
      duration: session.duration,
      sessionType: session.session_type,
      subject: session.subject,
      maxParticipants: session.max_participants,
      currentParticipants,
      meetingLink: session.meeting_link || '',
      meetingRoom: session.meeting_room || '',
      status: session.status,
      mentor: session.hei_mentor_profiles ? this.formatMentorDto(session.hei_mentor_profiles) : {} as MentorDto,
      sessionNotes: session.session_notes || '',
      canJoin: session.status === SessionStatus.SCHEDULED && currentParticipants < session.max_participants,
      hasJoined: !!participant,
    };
  }

  private formatMentorDto(mentor: any): MentorDto {
    const currentStudents = mentor.mentor_student_assignments?.length || 0;

    return {
      id: mentor.id,
      name: mentor.users?.full_name || 'Unknown',
      designation: mentor.designation || '',
      department: mentor.department || '',
      expertise: mentor.expertise || [],
      qualification: mentor.qualification || '',
      experienceYears: mentor.experience_years || 0,
      rating: 4.5, // Mock rating
      maxStudents: mentor.max_students || 30,
      currentStudents,
      isAvailable: currentStudents < (mentor.max_students || 30),
      researchInterests: mentor.research_interests || [],
    };
  }

  private formatWhatsAppGroupDto(group: DatabaseWhatsAppGroup, studentId: string): WhatsAppGroupDto {
    const membership = group.whatsapp_group_members?.find((m: any) => m.student_id === studentId);

    return {
      id: group.id,
      name: group.name,
      subject: group.subject || '',
      description: group.description || '',
      memberCount: group.member_count,
      maxMembers: group.max_members,
      whatsappLink: group.whatsapp_link || '',
      mentor: group.hei_mentor_profiles ? this.formatMentorDto(group.hei_mentor_profiles) : {} as MentorDto,
      activeHours: group.active_hours,
      guidelines: group.guidelines || [],
      hasJoined: !!membership?.is_active,
      unreadCount: (membership as any)?.unread_count || 0,
    };
  }
}
