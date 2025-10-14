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
  HEIMentorDashboardDto,
  AssignedStudentsResponseDto,
  StudentFiltersDto,
  AssignedStudentDto,
  StudentDetailDto,
  AssignedSchoolDto,
  SchoolDetailDto,
  SchoolFiltersDto,
  AssignedSchoolsResponseDto
} from './dto/mentoring.dto';

// Fix 3: Update CreateMentorSessionData to match DTO properly
interface CreateMentorSessionData {
  title: string;
  description?: string;
  session_date: string; // Changed from sessionDate
  duration: number;
  session_type: SessionType; // Use enum instead of string
  subject: string;
  max_participants: number; // Changed from maxParticipants
  meeting_link?: string; // Changed from meetingLink
  session_notes?: string; // Changed from sessionNotes
}


interface UpdateMentorSessionData {
  title?: string;
  description?: string;
  session_date?: string;
  duration?: number;
  status?: string;
  meeting_link?: string;
  session_notes?: string;
  max_participants?: number;
}

interface SendMentorMessageData {
  messagecontent: string;
  messagetype?: string; // Optional but will be ignored/forced to 'text'
  // Removed all file-related fields:
  // fileurl?: string;     ❌ REMOVED
  // filename?: string;    ❌ REMOVED
  // filesize?: number;    ❌ REMOVED
  // filetype?: string;    ❌ REMOVED
}


// Add these interfaces after your existing interfaces
interface UpdateMentorProfileData {
  designation?: string;
  department?: string;
  expertise?: string[];
  qualification?: string;
  experience_years?: number;
  research_interests?: string[];
  max_students?: number;
}

interface AssignmentFilters {
  subject?: string;
  classLevel?: string;
  difficulty?: string;
  page: number;
  limit: number;
}

interface CreateAssignmentData {
  title: string;
  description?: string;
  subject: string;
  class_level: string;
  due_date: string;
  total_marks?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  ncert_chapter?: string;
  time_estimate?: number;
  submission_format?: string[];
  teacher_notes?: string;
}

interface SubmissionFilters {
  status?: string;
  page: number;
  limit: number;
}

interface GradeSubmissionData {
  score: number;
  feedback?: string;
  grade?: string;
}


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
    
    // ✅ FIXED: Try to find mentor profile by ID first, then by user_id
    let mentorProfile: any = null;
    
    // Try matching by profile ID first
    const { data: profileById, error: profileError } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, user_id')
      .eq('id', mentorId)
      .single();

    if (profileById) {
      mentorProfile = profileById;
      this.logger.log(`✅ Found mentor by profile ID: ${mentorProfile.id}`);
    } else {
      // If not found by profile ID, try by user_id
      const { data: profileByUserId, error: userError } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id')
        .eq('user_id', mentorId)
        .single();
      
      if (profileByUserId) {
        mentorProfile = profileByUserId;
        this.logger.log(`✅ Found mentor by user ID: ${mentorProfile.id}`);
      }
    }

    if (!mentorProfile) {
      this.logger.error(`❌ Mentor profile not found for ID: ${mentorId}`);
      throw new NotFoundException('Mentor profile not found');
    }

    // ✅ CRITICAL FIX: Use user_id for mentor_id column (FK references users table)
    const sessionData = {
      title: createData.title,
      description: createData.description,
      mentor_id: mentorProfile.user_id,  // ✅ Use user_id, NOT profile ID!
      session_date: createData.sessionDate,
      duration: createData.duration,
      session_type: createData.sessionType,
      subject: createData.subject,
      max_participants: createData.maxParticipants || 1,
      meeting_link: createData.meetingLink || null,
      meeting_room: createData.meetingRoom || null,
      session_notes: createData.sessionNotes || null,
      status: SessionStatus.SCHEDULED,
    };

    this.logger.log(`Inserting session data:`, JSON.stringify(sessionData));

    const { data: session, error } = await this.supabase
      .from('mentoring_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      this.logger.error('❌ Supabase insert error:', JSON.stringify(error));
      throw error;
    }

    this.logger.log(`✅ Session created successfully: ${session.id}`);

    // Auto-create session group chat
    if (session) {
      await this.createSessionChatRoom(session.id, mentorProfile.id);
    }

    return this.formatSessionDto(session as DatabaseSession, mentorId);
  } catch (error: any) {
    this.logger.error('❌ Error creating session:', error);
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
          content: messageData.messagecontent,
          message_type: messageData.messageType,
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

  // Add these methods to your existing mentoring.service.ts

/* ---------- HEI MENTOR METHODS ---------- */


async getStudentProgress(mentorId: string, studentId: string) {
  try {
    // Verify mentor has access to this student
    const { data: assignment } = await this.supabase
      .from('mentor_student_assignments')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('student_id', studentId)
      .eq('status', 'active')
      .single();

    if (!assignment) {
      throw new ForbiddenException('Access denied to this student');
    }

    // Get student basic info
    const { data: student } = await this.supabase
      .from('students')
      .select(`
        *,
        users!inner(id, full_name, email, phone, profile_picture),
        student_profiles!inner(
          *,
          schools!inner(id, name, location)
        )
      `)
      .eq('id', studentId)
      .single();

    // Get student stats
    const { data: stats } = await this.supabase
      .from('student_dashboard_stats')
      .select('*')
      .eq('student_id', studentId)
      .single();

    // Get Holland assessment results
    const { data: hollandResults } = await this.supabase
      .from('holland_assessment_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get recent activities
    const { data: activities } = await this.supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(20);

    return {
      student: {
        ...student,
        user: student.users,
        profile: student.student_profiles,
        school: student.student_profiles.schools
      },
      stats: stats || {},
      hollandResults,
      activities: activities || [],
      progressMetrics: {
        overallProgress: 68, // Calculate from actual data
        assignmentsCompleted: stats?.assignments_completed || 0,
        sessionsAttended: stats?.sessions_attended || 0,
        averageGrade: stats?.average_grade || 0,
        careerReadiness: hollandResults ? 85 : 20
      }
    };

  } catch (error: any) {
    this.logger.error('Error fetching student progress:', error);
    throw new BadRequestException('Failed to fetch student progress');
  }
}


async getHEIMentorAnalytics(mentorId: string) {
  try {
    // Get basic stats
    const dashboard = await this.getHEIMentorDashboard(mentorId);
    
    // Add detailed analytics
    const monthlySessionData = await this.getMonthlySessionData(mentorId);
    const studentProgressDistribution = await this.getStudentProgressDistribution(mentorId);
    const subjectWisePerformance = await this.getSubjectWisePerformance(mentorId);
    
    return {
      overview: dashboard,
      monthlyTrends: monthlySessionData,
      studentDistribution: studentProgressDistribution,
      subjectPerformance: subjectWisePerformance,
      recommendations: await this.generateMentorRecommendations(mentorId)
    };

  } catch (error: any) {
    this.logger.error('Error fetching HEI mentor analytics:', error);
    throw new BadRequestException('Failed to fetch mentor analytics');
  }
}

// Helper methods
private async getAssignedStudentIds(mentorId: string): Promise<string[]> {
  const { data: assignments } = await this.supabase
    .from('mentor_student_assignments')
    .select('student_id')
    .eq('mentor_id', mentorId)
    .eq('status', 'active');
    
  return (assignments || []).map(a => a.student_id);
}

private getActivityTitle(activityType: string): string {
  const titles: Record<string, string> = {
    assignment_submitted: 'Assignment Submitted',
    session_attended: 'Session Attended',
    assessment_completed: 'Assessment Completed',
    chat_message: 'Chat Activity',
    profile_updated: 'Profile Updated'
  };
  return titles[activityType] || 'Activity';
}

private getActivityDescription(activity: any): string {
  // Format activity description based on type and metadata
  return `${activity.activity_type} - ${activity.created_at}`;
}

/* ---------- HEI MENTOR ANALYTICS HELPER METHODS ---------- */

private async getMonthlySessionData(mentorId: string): Promise<any[]> {
  try {
    // Get session data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: sessions } = await this.supabase
      .from('mentoring_sessions')
      .select('session_date, status')
      .eq('mentor_id', mentorId)
      .gte('session_date', twelveMonthsAgo.toISOString())
      .order('session_date', { ascending: true });

    // Group by month and count
     const monthlyData = {} as Record<string, { scheduled: number; completed: number; cancelled: number }>;

    (sessions || []).forEach(session => {
      const month = new Date(session.session_date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) monthlyData[month] = { scheduled: 0, completed: 0, cancelled: 0 };
      monthlyData[month][session.status]++;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));

  } catch (error: any) {
    this.logger.error('Error fetching monthly session data:', error);
    return [];
  }
}

private async getStudentProgressDistribution(mentorId: string): Promise<any[]> {
  try {
    // Get progress scores for all assigned students
    const assignedStudentIds = await this.getAssignedStudentIds(mentorId);
    
    if (assignedStudentIds.length === 0) {
      return [];
    }

    const { data: statsData } = await this.supabase
      .from('student_dashboard_stats')
      .select('overall_progress, assignment_completion_rate, session_attendance_rate')
      .in('student_id', assignedStudentIds);

    // Calculate distribution ranges
    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 }
    ];

    (statsData || []).forEach(stats => {
      const progress = stats.overall_progress || 0;
      const range = ranges.find(r => progress >= r.min && progress <= r.max);
      if (range) range.count++;
    });

    return ranges;

  } catch (error: any) {
    this.logger.error('Error fetching student progress distribution:', error);
    return [];
  }
}

private async getSubjectWisePerformance(mentorId: string): Promise<any[]> {
  try {
    // Get assignment performance by subject
    const { data: assignmentPerf } = await this.supabase
      .from('assignments')
      .select(`
        subject,
        assignment_submissions!inner(score, status)
      `)
      .eq('teacher_id', mentorId)
      .eq('assignment_submissions.status', 'graded');

    // Group by subject and calculate averages
    const subjectData = {};
    
    (assignmentPerf || []).forEach(assignment => {
      const subject = assignment.subject || 'General';
      if (!subjectData[subject]) {
        subjectData[subject] = { scores: [], total: 0 };
      }
      
      assignment.assignment_submissions.forEach(submission => {
        if (submission.score !== null) {
          subjectData[subject].scores.push(submission.score);
          subjectData[subject].total++;
        }
      });
    });

    // Calculate averages
    return Object.entries(subjectData).map(([subject, data]: [string, any]) => ({
      subject,
      averageScore: data.scores.length > 0 
        ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
        : 0,
      totalSubmissions: data.total
    }));

  } catch (error: any) {
    this.logger.error('Error fetching subject-wise performance:', error);
    return [];
  }
}

private async generateMentorRecommendations(mentorId: string): Promise<any[]> {
  try {
    // Define the recommendation interface
    interface MentorRecommendation {
      id: string;
      type: 'warning' | 'action' | 'info';
      title: string;
      description: string;
      actionText: string;
      priority: 'high' | 'medium' | 'low';
    }

    // Initialize with proper typing
    const recommendations: MentorRecommendation[] = [];

    // Get assigned students count
    const assignedStudentIds = await this.getAssignedStudentIds(mentorId);
    
    // Check for students with low attendance
    const { data: lowAttendance } = await this.supabase
      .from('student_dashboard_stats')
      .select('student_id, session_attendance_rate')
      .in('student_id', assignedStudentIds)
      .lt('session_attendance_rate', 60);

    if (lowAttendance && lowAttendance.length > 0) {
      recommendations.push({
        id: 'low_attendance',
        type: 'warning',
        title: 'Students with Low Attendance',
        description: `${lowAttendance.length} students have attendance below 60%`,
        actionText: 'Review attendance',
        priority: 'high'
      });
    }

    // Check for pending grading
    const { count: pendingGrades } = await this.supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted')
      .in('assignment_id', 
        await this.getMentorAssignmentIds(mentorId)
      );

    if (pendingGrades && pendingGrades > 5) {
      recommendations.push({
        id: 'pending_grades',
        type: 'action',
        title: 'Assignments Need Grading',
        description: `${pendingGrades} assignments are waiting for grades`,
        actionText: 'Grade assignments',
        priority: pendingGrades > 20 ? 'high' : 'medium'
      });
    }

    // Check for inactive students
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentActivity } = await this.supabase
      .from('student_activities')
      .select('student_id')
      .in('student_id', assignedStudentIds)
      .gte('created_at', oneWeekAgo.toISOString());

    const activeStudentIds = new Set(recentActivity?.map(a => a.student_id) || []);
    const inactiveCount = assignedStudentIds.length - activeStudentIds.size;

    if (inactiveCount > 0) {
      recommendations.push({
        id: 'inactive_students',
        type: 'info',
        title: 'Inactive Students',
        description: `${inactiveCount} students haven't been active this week`,
        actionText: 'Check on students',
        priority: 'medium'
      });
    }

    return recommendations;

  } catch (error: any) {
    this.logger.error('Error generating mentor recommendations:', error);
    return [];
  }
}

/* ---------- NEW HEI-MENTOR SERVICE METHODS ---------- */


// ✅ FIXED VERSION - mentoring.service.ts
// Replace the existing getMentorProfile method with this:

async getMentorProfile(mentorId: string): Promise<any> {
  try {
    this.logger.log(`Fetching mentor profile for: ${mentorId}`);

    // ✅ Let Supabase auto-detect relationships
    const { data: profile, error } = await this.supabase
      .from('hei_mentor_profiles')
      .select(`
        *,
        users!inner(*),
        heis!inner(*)
      `)
      .eq('user_id', mentorId)
      .single();

    if (error) {
      this.logger.error('Supabase error:', JSON.stringify(error));
      throw new NotFoundException('Profile not found');
    }

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Transform response
    const { users: user, heis: hei, ...profileFields } = profile;

    return {
      success: true,
      data: {
        user: user || null,
        profile: profileFields,
        hei: hei || null,
      }
    };
  } catch (error: any) {
    this.logger.error('Error fetching mentor profile:', error);
    throw new BadRequestException('Failed to fetch mentor profile');
  }
}



async updateMentorProfile(mentorId: string, updateData: any): Promise<any> {
  try {
    const { data: updatedProfile, error } = await this.supabase
      .from('hei_mentor_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', mentorId)
      .select(`
        *,
        user:users!hei_mentor_profiles_user_id_fkey(*),
        hei:heis!hei_mentor_profiles_hei_id_fkey(*)
      `)
      .single();

    if (error) throw new BadRequestException('Failed to update profile');
    return { success: true, message: 'Profile updated successfully', data: updatedProfile };
  } catch (error: any) {
    this.logger.error('Error updating mentor profile:', error);
    throw new BadRequestException('Failed to update profile');
  }
}


async getAssignments(mentorId: string, filters: any): Promise<any> {
  try {
    let query = this.supabase
      .from('assignments')
      .select(`*, _count:assignment_submissions(count)`)
      .eq('teacher_id', mentorId)
      .eq('is_active', true);

    if (filters.subject) query = query.eq('subject', filters.subject);
    if (filters.classLevel) query = query.eq('class_level', filters.classLevel);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);

    const { data: assignments, error, count } = await query
      .range((filters.page - 1) * filters.limit, filters.page * filters.limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException('Failed to fetch assignments');

    return {
      success: true,
      data: assignments || [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / filters.limit)
      }
    };
  } catch (error: any) {
    this.logger.error('Error fetching assignments:', error);
    throw new BadRequestException('Failed to fetch assignments');
  }
}

async createAssignment(mentorId: string, assignmentData: any): Promise<any> {
  try {
    const { data: assignment, error } = await this.supabase
      .from('assignments')
      .insert({
        ...assignmentData,
        teacher_id: mentorId,
        ai_generated: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Failed to create assignment');
    return { success: true, message: 'Assignment created successfully', data: assignment };
  } catch (error: any) {
    this.logger.error('Error creating assignment:', error);
    throw new BadRequestException('Failed to create assignment');
  }
}

async getSubmissions(mentorId: string, assignmentId: string, filters: any): Promise<any> {
  try {
    // Verify assignment belongs to mentor
    const { data: assignment } = await this.supabase
      .from('assignments')
      .select('id')
      .eq('id', assignmentId)
      .eq('teacher_id', mentorId)
      .single();

    if (!assignment) {
      throw new BadRequestException('Assignment not found or not authorized');
    }

    let query = this.supabase
      .from('assignment_submissions')
      .select(`
        *,
        student:student_profiles!assignment_submissions_student_id_fkey(
          user:users!student_profiles_user_id_fkey(name, email)
        ),
        assignment:assignments!assignment_submissions_assignment_id_fkey(title, total_marks)
      `)
      .eq('assignment_id', assignmentId);

    if (filters.status) query = query.eq('status', filters.status);

    const { data: submissions, error, count } = await query
      .range((filters.page - 1) * filters.limit, filters.page * filters.limit - 1)
      .order('submitted_at', { ascending: false });

    if (error) throw new BadRequestException('Failed to fetch submissions');

    return {
      success: true,
      data: submissions || [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / filters.limit)
      }
    };
  } catch (error: any) {
    this.logger.error('Error fetching submissions:', error);
    throw new BadRequestException('Failed to fetch submissions');
  }
}

async gradeSubmission(mentorId: string, submissionId: string, gradeData: any): Promise<any> {
  try {
    // Verify submission belongs to mentor's assignment
    const { data: submission } = await this.supabase
      .from('assignment_submissions')
      .select(`*, assignment:assignments!assignment_submissions_assignment_id_fkey(teacher_id)`)
      .eq('id', submissionId)
      .single();

    if (!submission || submission.assignment.teacher_id !== mentorId) {
      throw new BadRequestException('Submission not found or not authorized');
    }

    const { data: gradedSubmission, error } = await this.supabase
      .from('assignment_submissions')
      .update({
        score: gradeData.score,
        feedback: gradeData.feedback,
        grade: gradeData.grade,
        graded_by: mentorId,
        graded_at: new Date().toISOString(),
        status: 'graded',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select(`
        *,
        student:student_profiles!assignment_submissions_student_id_fkey(
          user:users!student_profiles_user_id_fkey(name, email)
        )
      `)
      .single();

    if (error) throw new BadRequestException('Failed to grade submission');
    return { success: true, message: 'Submission graded successfully', data: gradedSubmission };
  } catch (error: any) {
    this.logger.error('Error grading submission:', error);
    throw new BadRequestException('Failed to grade submission');
  }
}



/* ---------- ADDITIONAL HELPER METHODS ---------- */

private async getMentorAssignmentIds(mentorId: string): Promise<string[]> {
  try {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('id')
      .eq('teacher_id', mentorId);
      
    return (assignments || []).map(a => a.id);
  } catch (error) {
    this.logger.error('Error fetching mentor assignment IDs:', error);
    return [];
  }
}

async getMentorSessions(
  mentorId: string, 
  filters: { status?: string; limit?: number }
): Promise<any> {
  try {
    this.logger.log(`Fetching sessions for mentor: ${mentorId}`);

    // ✅ Step 1: Get mentor profile ID from user ID
    const { data: mentorProfile, error: profileError } = await this.supabase
      .from('hei_mentor_profiles')  // ← snake_case
      .select('id')
      .eq('user_id', mentorId)  // ← snake_case
      .single();

    if (profileError || !mentorProfile) {
      this.logger.error('Mentor profile not found:', profileError);
      throw new NotFoundException('Mentor profile not found');
    }

    this.logger.log(`Found mentor profile ID: ${mentorProfile.id}`);

    // ✅ Step 2: Build correct query with snake_case
    let query = this.supabase
      .from('mentoring_sessions')  // ← snake_case
      .select(`
        *,
        participants:session_participants(
          id,
          student_id,
          attendance_status,
          registration_date
        )
      `)
      .eq('mentor_id', mentorProfile.id)  // ← Use profile ID, snake_case
      .order('session_date', { ascending: false });  // ← snake_case

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data: sessions, error } = await query;

    if (error) {
      this.logger.error('Supabase error fetching sessions:', error);
      throw new BadRequestException('Failed to fetch mentor sessions');
    }

    this.logger.log(`Successfully fetched ${sessions?.length || 0} sessions`);

    return {
      success: true,
      data: sessions || [],
      total: sessions?.length || 0
    };
  } catch (error: any) {
    this.logger.error('Error fetching mentor sessions:', error);
    
    if (error instanceof NotFoundException) {
      throw error;
    }
    
    throw new BadRequestException('Failed to fetch mentor sessions');
  }
}


async getMentorSessionById(mentorId: string, sessionId: string): Promise<any> {
  try {
    const { data: session, error } = await this.supabase
      .from('mentoring_sessions')
      .select(`
        *,
        mentor:users!mentoring_sessions_mentor_id_fkey(id, name, email),
        participants:session_participants(
          *,
          student:student_profiles!session_participants_student_id_fkey(
            *,
            user:users!student_profiles_user_id_fkey(name, email, phone)
          )
        ),
        feedback:session_feedback(*)
      `)
      .eq('id', sessionId)
      .eq('mentor_id', mentorId)
      .single();

    if (error || !session) {
      throw new NotFoundException('Session not found or not authorized');
    }

    return { success: true, data: session };
  } catch (error: any) {
    this.logger.error('Error fetching mentor session:', error);
    throw error;
  }
}

async createMentorSession(mentorId: string, sessionData: CreateSessionDto): Promise<SessionDto> {
  try {
    this.logger.log(`Creating session: ${sessionData.title}`);

    // Get mentor profile
    const { data: mentorProfile } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, user_id')
      .eq('user_id', mentorId)
      .single();

    if (!mentorProfile) {
      throw new NotFoundException('Mentor profile not found');
    }

    // Fix 1: Use proper database column names that match the schema
    const insertData: Partial<DatabaseSession> = {
      title: sessionData.title,
      description: sessionData.description,
      mentor_id: mentorProfile.id, // Use mentor profile ID, not user ID
      session_date: sessionData.sessionDate, // Maps to session_date column
      duration: sessionData.duration,
      session_type: sessionData.sessionType, // Maps to session_type column  
      subject: sessionData.subject,
      max_participants: sessionData.maxParticipants, // Maps to max_participants column
      meeting_link: sessionData.meetingLink || null,
      meeting_room: sessionData.meetingRoom || null,
      session_notes: sessionData.sessionNotes || null, // Maps to session_notes column
      status: SessionStatus.SCHEDULED,
    };

    const { data: session, error } = await this.supabase
      .from('mentoring_sessions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Auto-create session group chat
    if (session) {
      await this.createSessionChatRoom(session.id, mentorProfile.id);
    }

    // Fix 2: Return properly typed SessionDto
    return this.formatSessionDto(session as DatabaseSession, mentorId);
  } catch (error: any) {
    this.logger.error('Error creating mentor session:', error);
    throw new BadRequestException('Failed to create session');
  }
}


async updateMentorSession(mentorId: string, sessionId: string, updateData: UpdateMentorSessionData): Promise<any> {
  try {
    // Verify session belongs to mentor
    const { data: existingSession } = await this.supabase
      .from('mentoring_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('mentor_id', mentorId)
      .single();

    if (!existingSession) {
      throw new BadRequestException('Session not found or not authorized');
    }

    const updateFields: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Add fields that are being updated
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.session_date !== undefined) updateFields.session_date = updateData.session_date;
    if (updateData.duration !== undefined) updateFields.duration = updateData.duration;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.meeting_link !== undefined) updateFields.meeting_link = updateData.meeting_link;
    if (updateData.session_notes !== undefined) updateFields.session_notes = updateData.session_notes;
    if (updateData.max_participants !== undefined) updateFields.max_participants = updateData.max_participants;

    const { data: updatedSession, error } = await this.supabase
      .from('mentoring_sessions')
      .update(updateFields)
      .eq('id', sessionId)
      .select(`
        *,
        mentor:users!mentoring_sessions_mentor_id_fkey(id, name, email),
        participants:session_participants(
          *,
          student:student_profiles!session_participants_student_id_fkey(
            user:users!student_profiles_user_id_fkey(name, email)
          )
        )
      `)
      .single();

    if (error) throw new BadRequestException('Failed to update session');

    return {
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    };
  } catch (error: any) {
    this.logger.error('Error updating mentor session:', error);
    throw new BadRequestException('Failed to update session');
  }
}

async getMentorChatRooms(mentorId: string): Promise<any> {
  try {
    const { data: chatRooms, error } = await this.supabase
      .from('chat_rooms')
      .select(`
        *,
        participants:chat_room_participants(
          *,
          user:users!chat_room_participants_user_id_fkey(id, name, email)
        ),
        last_message:chat_messages(
          id,
          message_content,
          created_at,
          sender:users!chat_messages_sender_id_fkey(name)
        )
      `)
      .eq('chat_room_participants.user_id', mentorId)
      .eq('chat_room_participants.is_active', true)
      .order('updated_at', { ascending: false });

    if (error) throw new BadRequestException('Failed to fetch chat rooms');

    return {
      success: true,
      data: chatRooms || []
    };
  } catch (error: any) {
    this.logger.error('Error fetching mentor chat rooms:', error);
    throw new BadRequestException('Failed to fetch chat rooms');
  }
}

async getMentorChatMessages(mentorId: string, roomId: string, limit: number): Promise<any> {
  try {
    // Verify mentor has access to this room
    const { data: roomAccess } = await this.supabase
      .from('chat_room_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', mentorId)
      .eq('is_active', true)
      .single();

    if (!roomAccess) {
      throw new BadRequestException('Access denied to this chat room');
    }

    const { data: messages, error } = await this.supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey(id, name, email),
        room:chat_rooms!chat_messages_room_id_fkey(name)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new BadRequestException('Failed to fetch messages');

    return {
      success: true,
      data: {
        room_id: roomId,
        messages: messages || []
      }
    };
  } catch (error: any) {
    this.logger.error('Error fetching mentor chat messages:', error);
    throw new BadRequestException('Failed to fetch messages');
  }
}

// Fixed sendMentorChatMessage function - removed non-existent updateUnreadCounts call
async sendMentorChatMessage(mentorId: string, roomId: string, messageData: SendMentorMessageData): Promise<any> {
  try {
    // Verify mentor has access to this chat room
    const { data: roomAccess } = await this.supabase
      .from('chatroomparticipants')
      .select('id')
      .eq('roomid', roomId)
      .eq('userid', mentorId)
      .eq('isactive', true)
      .single();

    if (!roomAccess) {
      throw new BadRequestException('Access denied to this chat room');
    }

    // Only allow text messages - no file uploads
    if (messageData.messagetype && messageData.messagetype !== MessageType.TEXT) {
      throw new BadRequestException('Only text messages are supported. File sharing is not available.');
    }

    // Create message data - text only
    const insertData: Record<string, any> = {
      roomid: roomId,
      senderid: mentorId,
      messagecontent: messageData.messagecontent,
      messagetype: MessageType.TEXT, // Force text type only
      createdat: new Date().toISOString(),
      isedited: false,
      isdeleted: false
    };

    // Insert message
    const { data: message, error } = await this.supabase
      .from('chatmessages')
      .insert(insertData)
      .select(`
        *,
        sender:users!chatmessages_senderid_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      this.logger.error('Database error sending message:', error);
      throw new BadRequestException('Failed to send message');
    }

    // Update room's last activity
    await this.supabase
      .from('chatrooms')
      .update({ 
        updatedat: new Date().toISOString() 
      })
      .eq('id', roomId);

    // ❌ REMOVED: await this.updateUnreadCounts(roomId, mentorId);
    // This method doesn't exist - you can implement it later if needed

    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message.id,
        content: message.messagecontent,
        messageType: MessageType.TEXT,
        senderName: (message as any).sender?.full_name || 'Unknown',
        senderId: message.senderid,
        fileUrl: null, // Always null - no file support
        replyTo: null,
        isEdited: false,
        createdAt: message.createdat,
        reactions: []
      }
    };

  } catch (error: any) {
    this.logger.error('Error sending mentor chat message:', error);
    
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    throw new BadRequestException('Failed to send message');
  }
}


  // ===============================================
  // HEI-MENTOR SPECIFIC METHODS
  // ===============================================

  async getHEIMentorDashboard(mentorId: string): Promise<HEIMentorDashboardDto> {
    try {
      this.logger.log(`Getting HEI mentor dashboard for: ${mentorId}`);

      // Get mentor profile
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id')
        .eq('user_id', mentorId)
        .single();

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }

      const mentorProfileId = mentorProfile.id;

      // Parallel queries for dashboard data
      const [
        assignedStudentsResult,
        assignedSchoolsResult,
        sessionsResult,
        completedSessionsResult,
        upcomingSessionsResult,
        ratingsResult
      ] = await Promise.all([
        // Get assigned students count
        this.supabase
          .from('mentor_student_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', mentorProfileId)
          .eq('status', 'active'),

        // Get assigned schools count (via students)
        this.supabase
          .from('mentor_student_assignments')
          .select(`
            student_profiles!mentor_student_assignments_student_id_fkey(
              school_id
            )
          `)
          .eq('mentor_id', mentorProfileId)
          .eq('status', 'active'),

        // Get active sessions
        this.supabase
          .from('mentoring_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', mentorProfileId)
          .in('status', ['scheduled', 'in_progress']),

        // Get completed sessions
        this.supabase
          .from('mentoring_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', mentorProfileId)
          .eq('status', 'completed'),

        // Get upcoming sessions with details
        this.supabase
          .from('mentoring_sessions')
          .select('*')
          .eq('mentor_id', mentorProfileId)
          .eq('status', 'scheduled')
          .order('session_date', { ascending: true })
          .limit(5),

        // Get average rating from session feedback
        this.supabase
          .from('session_feedback')
          .select('rating')
          .not('rating', 'is', null)
      ]);

      // Process results
      const totalAssignedStudents = assignedStudentsResult.count || 0;

      // Get unique school count
      const schoolIds = new Set(
        (assignedSchoolsResult.data || [])
          .map((item: any) => item.student_profiles?.school_id)
          .filter(id => id)
      );
      const assignedSchools = schoolIds.size;

      const activeSessions = sessionsResult.count || 0;
      const completedSessions = completedSessionsResult.count || 0;

      // Calculate average rating
      const ratings = (ratingsResult.data || []).map(f => f.rating).filter(r => r !== null);
      const averageRating = ratings.length > 0 
        ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10 
        : 0;

      // Calculate total teaching hours (assuming 1 hour per completed session for now)
      const totalTeachingHours = completedSessions;

      // Format upcoming sessions
      const upcomingSessions = (upcomingSessionsResult.data || []).map(session => 
        this.formatSessionDto(session as DatabaseSession, mentorId)
      );

      // Mock recent activities - you can implement actual logic
      const recentActivities = [
        {
          type: 'session_completed',
          description: 'Completed Python Programming session',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'student_assigned',
          description: 'New student assigned from Delhi Public School',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      // Mock student distribution - implement with actual data
      const studentDistribution = {
        'Class 10': Math.floor(totalAssignedStudents * 0.4),
        'Class 11': Math.floor(totalAssignedStudents * 0.35),
        'Class 12': Math.floor(totalAssignedStudents * 0.25),
      };

      return {
        totalAssignedStudents,
        assignedSchools,
        activeSessions,
        completedSessions,
        averageRating,
        totalTeachingHours,
        upcomingSessions,
        recentActivities,
        studentDistribution,
      };

    } catch (error: any) {
      this.logger.error('Error fetching HEI mentor dashboard:', error);
      throw new BadRequestException('Failed to fetch mentor dashboard');
    }
  }

  async getAssignedStudents(mentorId: string, filters: StudentFiltersDto): Promise<AssignedStudentsResponseDto> {
  try {
    this.logger.log(`Getting assigned students for mentor: ${mentorId}`);

    // Get mentor profile
    const { data: mentorProfile } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id')
      .eq('user_id', mentorId)
      .single();

    if (!mentorProfile) {
      throw new NotFoundException('Mentor profile not found');
    }

    // ❌ OLD (BROKEN):
    // .select(`
    //   *,
    //   student_profiles!mentor_student_assignments_student_id_fkey(...)
    // `)

    // ✅ NEW (CORRECT):
    // Don't rely on automatic relationship detection
    // Query assignments first, then join manually
    
    const { data: assignments, error } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, student_id, status, assigned_at')  // ← Just the assignment data
      .eq('mentor_id', mentorProfile.id);

    if (error) throw error;

    if (!assignments || assignments.length === 0) {
      return {
        students: [],
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 20,
        activeStudents: 0,
        inactiveStudents: 0
      };
    }

    // ✅ Manually fetch student profiles using student_ids
    const studentIds = assignments.map(a => a.student_id);

    const { data: studentProfiles, error: profileError } = await this.supabase
      .from('student_profiles')
      .select(`
        id,
        user_id,
        class_level,
        school_id,
        users!student_profiles_user_id_fkey(id, full_name, email, phone),
        schools!student_profiles_school_id_fkey(id, name)
      `)
      .in('id', studentIds);  // ← Query by student_profile IDs

    if (profileError) throw profileError;

    // ✅ Combine the data
    const students = assignments.map(assignment => {
      const profile = studentProfiles?.find(p => p.id === assignment.student_id);
      const user = Array.isArray(profile?.users) ? profile.users[0] : profile?.users;
      const school = Array.isArray(profile?.schools) ? profile.schools[0] : profile?.schools;

      return {
        id: assignment.student_id,
        name: user?.full_name || 'Unknown Student',
        email: user?.email || '',
        classLevel: profile?.class_level || 'Unknown',
        schoolName: school?.name || 'Unknown School',
        phoneNumber: user?.phone,
        subjects:'Mathematics, Science', // Mock - implement based on your data
        averageScore: Math.round(Math.random() * 20 + 70), // Mock
        completedSessions: Math.floor(Math.random() * 15), // Mock
        upcomingSessions: Math.floor(Math.random() * 5), // Mock
        lastSessionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: assignment.status,
        assignedAt: assignment.assigned_at
      };
    });

    return {
      students,
      total: students.length,
      page: filters.page || 1,
      limit: filters.limit || 20,
      activeStudents: students.filter(s => s.status === 'active').length,
      inactiveStudents: students.filter(s => s.status !== 'active').length
    };

  } catch (error: any) {
    this.logger.error('Error fetching assigned students:', error);
    throw new BadRequestException('Failed to fetch assigned students');
  }
}

  async getStudentById(mentorId: string, studentId: string): Promise<StudentDetailDto> {
    try {
      this.logger.log(`Getting student details: ${studentId} for mentor: ${mentorId}`);

      // Get mentor profile
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id')
        .eq('user_id', mentorId)
        .single();

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }

      // Verify student is assigned to this mentor
      const { data: assignment } = await this.supabase
        .from('mentor_student_assignments')
        .select(`
          *,
          student_profiles!mentor_student_assignments_student_id_fkey(
            *,
            users!student_profiles_user_id_fkey(
              id,
              full_name,
              email,
              phone
            ),
            schools!student_profiles_school_id_fkey(
              id,
              name
            )
          )
        `)
        .eq('mentor_id', mentorProfile.id)
        .eq('student_id', studentId)
        .single();

      if (!assignment) {
        throw new NotFoundException('Student not found or not assigned to this mentor');
      }

      const profile = assignment.student_profiles;
      const user = profile?.users;
      const school = profile?.schools;

      // Get recent sessions for this student
      const { data: recentSessions } = await this.supabase
        .from('session_participants')
        .select(`
          *,
          mentoring_sessions!session_participants_session_id_fkey(
            id,
            title,
            session_date,
            duration,
            status
          )
        `)
        .eq('student_id', studentId)
        .order('registration_date', { ascending: false })
        .limit(10);

      // Get assignments (mock for now)
      const assignments = [
        {
          id: '1',
          title: 'Python Basics Assignment',
          subject: 'Computer Science',
          dueDate: '2025-10-15',
          status: 'submitted',
          score: 85,
        }
      ];

      // Mock progress history
      const progressHistory = [
        {
          date: '2025-09-01',
          subject: 'Mathematics',
          score: 78,
          topic: 'Algebra',
        },
        {
          date: '2025-09-15',
          subject: 'Science',
          score: 82,
          topic: 'Physics - Motion',
        }
      ];

      return {
        id: studentId,
        name: user?.full_name || 'Unknown Student',
        email: user?.email || '',
        classLevel: profile?.class_level || 'Unknown',
        schoolName: school?.name || 'Unknown School',
        phoneNumber: user?.phone,
        subjects: 'Mathematics, Science, Computer Science',
        averageScore: 81.5,
        completedSessions: (recentSessions || []).filter(s => s.attendance_status === 'completed').length,
        upcomingSessions: (recentSessions || []).filter(s => s.attendance_status === 'registered').length,
        lastSessionDate: recentSessions?.[0]?.mentoring_sessions?.session_date,
        status: assignment.status,
        assignedAt: assignment.assigned_at,
        notes: assignment.notes,
        recentSessions: recentSessions || [],
        assignments,
        progressHistory,
        subjectPerformance: {
          mathematics: 78,
          science: 82,
          english: 85,
        },
        attendanceRate: 87.5,
      };

    } catch (error: any) {
      this.logger.error('Error fetching student details:', error);
      throw error;
    }
  }

  async getAssignedSchools(mentorId: string, filters: SchoolFiltersDto): Promise<AssignedSchoolsResponseDto> {
    try {
      this.logger.log(`Getting assigned schools for mentor: ${mentorId}`);

      // Get mentor profile
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id')
        .eq('user_id', mentorId)
        .single();

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }

      // Get schools through assigned students
      const { data: assignments } = await this.supabase
        .from('mentor_student_assignments')
        .select(`
          student_profiles!mentor_student_assignments_student_id_fkey(
            school_id,
            schools!student_profiles_school_id_fkey(
              *
            )
          )
        `)
        .eq('mentor_id', mentorProfile.id)
        .eq('status', 'active');

      // Extract unique schools
      const schoolsMap = new Map();
      const studentCountBySchool = new Map();

      (assignments || []).forEach(assignment => {
        const profiles = Array.isArray(assignment.student_profiles) 
          ? assignment.student_profiles[0]    // Get first element if array
          : assignment.student_profiles;
        
        const schools = Array.isArray(profiles?.schools) 
          ? profiles.schools[0]               // Get first element if array
          : profiles?.schools;                // Use as-is if single object
        if (schools) {
          schoolsMap.set(schools.id, schools);
          studentCountBySchool.set(
            schools.id, 
            (studentCountBySchool.get(schools.id) || 0) + 1
          );
        }
      });

      // Convert to array and format
      const schools: AssignedSchoolDto[] = Array.from(schoolsMap.values()).map(school => ({
        id: school.id,
        name: school.name,
        city: school.city || 'Unknown',
        state: school.state || 'Unknown',
        board: school.board || 'Unknown',
        type: school.type || 'Unknown',
        totalStudents: school.total_students || 0,
        assignedStudents: studentCountBySchool.get(school.id) || 0,
        principalName: school.principal_name || 'Unknown',
        contactEmail: school.contact_email || '',
        contactPhone: school.contact_phone || '',
        assignedAt: new Date().toISOString(), // Mock - implement actual assignment date
        status: 'active',
      }));

      // Apply filters
      let filteredSchools = schools;

      if (filters.city) {
        filteredSchools = filteredSchools.filter(s => s.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }

      if (filters.state) {
        filteredSchools = filteredSchools.filter(s => s.state.toLowerCase().includes(filters.state!.toLowerCase()));
      }

      if (filters.board) {
        filteredSchools = filteredSchools.filter(s => s.board.toLowerCase().includes(filters.board!.toLowerCase()));
      }

      if (filters.type) {
        filteredSchools = filteredSchools.filter(s => s.type === filters.type);
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedSchools = filteredSchools.slice(startIndex, startIndex + limit);

      const totalStudentsAcrossSchools = paginatedSchools.reduce((sum, school) => sum + school.assignedStudents, 0);

      return {
        schools: paginatedSchools,
        total: filteredSchools.length,
        page,
        limit,
        totalStudentsAcrossSchools,
      };

    } catch (error: any) {
      this.logger.error('Error fetching assigned schools:', error);
      throw new BadRequestException('Failed to fetch assigned schools');
    }
  }

  async getSchoolById(mentorId: string, schoolId: string): Promise<SchoolDetailDto> {
    try {
      this.logger.log(`Getting school details: ${schoolId} for mentor: ${mentorId}`);

      // Get mentor profile
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id')
        .eq('user_id', mentorId)
        .single();

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }

      // Get school details
      const { data: school, error: schoolError } = await this.supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .single();

      if (schoolError || !school) {
        throw new NotFoundException('School not found');
      }

      // Verify mentor has students in this school
      const { data: assignments } = await this.supabase
        .from('mentor_student_assignments')
        .select(`
          *,
          student_profiles!mentor_student_assignments_student_id_fkey(
            *,
            users!student_profiles_user_id_fkey(
              id,
              full_name,
              email,
              phone
            )
          )
        `)
        .eq('mentor_id', mentorProfile.id)
        .eq('status', 'active');

      // Filter students from this school
      const schoolStudents = (assignments || [])
        .filter(assignment => assignment.student_profiles?.school_id === schoolId)
        .map(assignment => {
          const profile = assignment.student_profiles;
          const user = profile?.users;

          return {
            id: assignment.student_id,
            name: user?.full_name || 'Unknown Student',
            email: user?.email || '',
            classLevel: profile?.class_level || 'Unknown',
            schoolName: school.name,
            phoneNumber: user?.phone,
            subjects: 'Mathematics, Science',
            averageScore: Math.round(Math.random() * 20 + 70),
            completedSessions: Math.floor(Math.random() * 15),
            upcomingSessions: Math.floor(Math.random() * 5),
            lastSessionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: assignment.status,
            assignedAt: assignment.assigned_at,
          };
        });

      if (schoolStudents.length === 0) {
        throw new ForbiddenException('No students assigned from this school');
      }

      // Calculate class distribution
      const classDistribution: Record<string, number> = {};
      schoolStudents.forEach(student => {
        classDistribution[student.classLevel] = (classDistribution[student.classLevel] || 0) + 1;
      });

      // Mock recent activities
      const recentActivities = [
        {
          type: 'session_completed',
          description: 'Mathematics session completed with Class 10 students',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'assignment_submitted',
          description: 'Science assignment submitted by 5 students',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      return {
        id: school.id,
        name: school.name,
        city: school.city || 'Unknown',
        state: school.state || 'Unknown',
        board: school.board || 'Unknown',
        type: school.type || 'Unknown',
        totalStudents: school.total_students || 0,
        assignedStudents: schoolStudents.length,
        principalName: school.principal_name || 'Unknown',
        contactEmail: school.contact_email || '',
        contactPhone: school.contact_phone || '',
        assignedAt: new Date().toISOString(), // Mock
        status: 'active',
        address: school.address || 'Address not available',
        description: school.description,
        students: schoolStudents,
        recentActivities,
        classDistribution,
        averagePerformance: 82.5, // Mock - calculate from actual performance data
        completedSessions: 15, // Mock - count from actual sessions
        upcomingSessions: 3, // Mock - count upcoming sessions
      };

    } catch (error: any) {
      this.logger.error('Error fetching school details:', error);
      throw error;
    }
  }

}
