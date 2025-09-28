// server/src/dashboard/dashboard.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  StudentDashboardDto,
  StudentBasicInfoDto,
  ProfileStatsDto,
  RecentActivityDto,
  UpcomingSessionDto,
  NotificationDto,
  MentoringSessionDto,
  ProjectDto,
  TestDto,
  CreateActivityDto,
  ActivityType,
  ActivityStatus,
  SessionType,
  ProjectStatus,
} from './dto/dashboard.dto';

// Define interfaces for database types
interface DatabaseUser {
  id: string;
  full_name: string;
  email: string;
  profile_image?: string;
  student_profiles: Array<{
    class_level: string;
    school_name: string;
    location: string;
    stream?: string;
  }>;
}

interface DatabaseSession {
  id: string;
  title: string;
  description?: string;
  session_date: string;
  duration: number;
  session_type: string;
  subject: string;
  max_participants: number;
  meeting_link?: string;
  status: string;
  users?: {
    full_name: string;
  };
  session_participants: Array<{
    id?: string;
    student_id?: string;
  }>;
}

@Injectable()
export class DashboardService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // =============================================
  // MAIN DASHBOARD ENDPOINT
  // =============================================

  async getStudentDashboard(studentId: string): Promise<StudentDashboardDto> {
    console.log('🏠 Getting dashboard data for student:', studentId);

    try {
      // Get all dashboard data in parallel
      const [
        studentInfo,
        profileStats,
        recentActivities,
        upcomingSessions,
        quickActions
      ] = await Promise.all([
        this.getStudentBasicInfo(studentId),
        this.getProfileStats(studentId),
        this.getRecentActivities(studentId, 10),
        this.getUpcomingSessions(studentId, 5),
        this.getQuickActions(studentId)
      ]);

      const dashboardData: StudentDashboardDto = {
        student: studentInfo,
        profileStats: profileStats,
        recentActivities: recentActivities,
        upcomingSessions: upcomingSessions,
        quickActions: quickActions
      };

      console.log('✅ Dashboard data retrieved successfully');
      return dashboardData;

    } catch (error) {
      console.log('❌ Error getting dashboard data:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // =============================================
  // STUDENT INFO & STATS
  // =============================================

  async getStudentBasicInfo(studentId: string): Promise<StudentBasicInfoDto> {
    console.log('👤 Getting student basic info');

    try {
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select(`
          full_name,
          email,
          profile_image,
          student_profiles!inner(
            class_level,
            school_name,
            location,
            stream
          )
        `)
        .eq('id', studentId)
        .single();

      if (userError || !user) {
        throw new NotFoundException('Student not found');
      }

      const typedUser = user as DatabaseUser;
      const profile = typedUser.student_profiles[0];

      if (!profile) {
        throw new NotFoundException('Student profile not found');
      }

      return {
        name: typedUser.full_name,
        class: profile.class_level,
        school: profile.school_name,
        profileImage: typedUser.profile_image,
        location: profile.location,
        stream: profile.stream
      };

    } catch (error) {
      console.log('❌ Error getting student info:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getProfileStats(studentId: string): Promise<ProfileStatsDto> {
    console.log('📊 Getting profile statistics');

    try {
      // Get or create dashboard stats
      let { data: stats } = await this.supabase
        .from('student_dashboard_stats')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (!stats) {
        // Create initial stats record
        await this.updateDashboardStats(studentId);
        const { data: newStats } = await this.supabase
          .from('student_dashboard_stats')
          .select('*')
          .eq('student_id', studentId)
          .single();
        stats = newStats;
      }

      // Get upcoming tests count
      const studentClass = await this.getStudentClass(studentId);
      const { data: upcomingTests } = await this.supabase
        .from('tests')
        .select('id')
        .eq('class_level', studentClass)
        .gt('test_date', new Date().toISOString())
        .eq('is_active', true);

      return {
        completedAssignments: stats?.completed_assignments || 0,
        totalAssignments: stats?.total_assignments || 0,
        upcomingTests: upcomingTests?.length || 0,
        mentoringSessionsAttended: stats?.mentoring_sessions_attended || 0,
        averageScore: Number(stats?.average_assignment_score || 0),
        careerExplorationProgress: Number(stats?.career_exploration_progress || 0)
      };

    } catch (error) {
      console.log('❌ Error getting profile stats:', error instanceof Error ? error.message : 'Unknown error');
      return {
        completedAssignments: 0,
        totalAssignments: 0,
        upcomingTests: 0,
        mentoringSessionsAttended: 0,
        averageScore: 0,
        careerExplorationProgress: 0
      };
    }
  }

  // =============================================
  // ACTIVITIES & TIMELINE
  // =============================================

  async getRecentActivities(studentId: string, limit: number = 10): Promise<RecentActivityDto[]> {
    console.log('⚡ Getting recent activities');

    try {
      const { data: activities, error } = await this.supabase
        .from('student_recent_activities')
        .select('*')
        .eq('student_id', studentId)
        .order('activity_date', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error('Failed to fetch activities: ' + error.message);
      }

      const formattedActivities = activities?.map(activity => ({
        id: activity.id as string,
        type: activity.activity_type as ActivityType,
        title: activity.activity_title as string,
        status: activity.status as ActivityStatus,
        date: activity.activity_date as string,
        description: activity.activity_description as string | undefined,
        metadata: activity.metadata as Record<string, any> | undefined
      })) || [];

      console.log('✅ Retrieved', formattedActivities.length, 'recent activities');
      return formattedActivities;

    } catch (error) {
      console.log('❌ Error getting recent activities:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async addActivity(studentId: string, activityData: CreateActivityDto): Promise<RecentActivityDto> {
    console.log('➕ Adding new activity');

    try {
      const { data: activity, error } = await this.supabase
        .from('student_recent_activities')
        .insert({
          student_id: studentId,
          activity_type: activityData.activityType,
          activity_title: activityData.activityTitle,
          activity_description: activityData.activityDescription,
          resource_id: activityData.resourceId,
          status: activityData.status,
          activity_date: activityData.activityDate,
          metadata: activityData.metadata
        })
        .select('*')
        .single();

      if (error || !activity) {
        throw new Error('Failed to add activity: ' + (error?.message || 'No data returned'));
      }

      // Update dashboard stats if needed
      await this.updateDashboardStats(studentId);

      return {
        id: activity.id,
        type: activity.activity_type as ActivityType,
        title: activity.activity_title,
        status: activity.status as ActivityStatus,
        date: activity.activity_date,
        description: activity.activity_description,
        metadata: activity.metadata
      };

    } catch (error) {
      console.log('❌ Error adding activity:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // =============================================
  // MENTORING SESSIONS
  // =============================================

  async getUpcomingSessions(studentId: string, limit: number = 5): Promise<UpcomingSessionDto[]> {
    console.log('📅 Getting upcoming mentoring sessions');

    try {
      const { data: sessions, error } = await this.supabase
        .from('mentoring_sessions')
        .select(`
          *,
          users!mentoring_sessions_mentor_id_fkey(full_name),
          session_participants!left(student_id)
        `)
        .eq('status', 'scheduled')
        .gt('session_date', new Date().toISOString())
        .order('session_date', { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error('Failed to fetch sessions: ' + error.message);
      }

      const formattedSessions = sessions?.map(session => {
        const typedSession = session as DatabaseSession;
        const sessionDate = new Date(typedSession.session_date);
        const isRegistered = typedSession.session_participants?.some(
          (participant) => participant.student_id === studentId
        ) || false;

        return {
          id: typedSession.id,
          date: sessionDate.toISOString().split('T')[0],
          time: sessionDate.toTimeString().substring(0, 5),
          mentor: typedSession.users?.full_name || 'Unknown Mentor',
          subject: typedSession.subject,
          type: typedSession.session_type as SessionType,
          description: typedSession.description || '',
          duration: typedSession.duration,
          meetingLink: typedSession.meeting_link,
          isRegistered
        };
      }) || [];

      console.log('✅ Retrieved', formattedSessions.length, 'upcoming sessions');
      return formattedSessions;

    } catch (error) {
      console.log('❌ Error getting upcoming sessions:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getAllMentoringSessions(studentId: string): Promise<MentoringSessionDto[]> {
    console.log('📚 Getting all available mentoring sessions');

    try {
      const { data: sessions, error } = await this.supabase
        .from('mentoring_sessions')
        .select(`
          *,
          users!mentoring_sessions_mentor_id_fkey(full_name),
          session_participants!left(id)
        `)
        .eq('status', 'scheduled')
        .gt('session_date', new Date().toISOString())
        .order('session_date', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch all sessions: ' + error.message);
      }

      const studentRegistrations = await this.getStudentSessionRegistrations(studentId);

      const formattedSessions = sessions?.map(session => {
        const typedSession = session as DatabaseSession;
        
        return {
          id: typedSession.id,
          title: typedSession.title,
          description: typedSession.description || '',
          mentorName: typedSession.users?.full_name || 'Unknown Mentor',
          sessionDate: typedSession.session_date,
          duration: typedSession.duration,
          type: typedSession.session_type as SessionType,
          subject: typedSession.subject,
          maxParticipants: typedSession.max_participants,
          currentParticipants: typedSession.session_participants?.length || 0,
          meetingLink: typedSession.meeting_link || '',
          status: typedSession.status,
          isRegistered: studentRegistrations.includes(typedSession.id)
        };
      }) || [];

      console.log('✅ Retrieved', formattedSessions.length, 'mentoring sessions');
      return formattedSessions;

    } catch (error) {
      console.log('❌ Error getting mentoring sessions:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async registerForSession(studentId: string, sessionId: string): Promise<{ success: boolean; message: string }> {
    console.log('📝 Registering student for session');

    try {
      // Check if session exists and has space
      const { data: session } = await this.supabase
        .from('mentoring_sessions')
        .select(`
          *,
          session_participants!left(id)
        `)
        .eq('id', sessionId)
        .single();

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      const participantCount = session.session_participants?.length || 0;
      if (participantCount >= session.max_participants) {
        throw new BadRequestException('Session is full');
      }

      // Register student
      const { error } = await this.supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          student_id: studentId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new BadRequestException('Already registered for this session');
        }
        throw new Error('Failed to register: ' + error.message);
      }

      // Add activity
      await this.addActivity(studentId, {
        activityType: ActivityType.SESSION,
        activityTitle: `Registered for ${session.title}`,
        status: ActivityStatus.UPCOMING,
        activityDate: new Date().toISOString(),
        resourceId: sessionId,
        metadata: { sessionDate: session.session_date }
      });

      console.log('✅ Successfully registered for session');
      return { success: true, message: 'Successfully registered for session' };

    } catch (error) {
      console.log('❌ Error registering for session:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // =============================================
  // NOTIFICATIONS
  // =============================================

  async getNotifications(studentId: string, unreadOnly: boolean = false): Promise<NotificationDto[]> {
    console.log('🔔 Getting notifications');

    try {
      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', studentId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data: notifications, error } = await query
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw new Error('Failed to fetch notifications: ' + error.message);
      }

      const formattedNotifications = notifications?.map(notification => ({
        id: notification.id as string,
        title: notification.title as string,
        message: notification.message as string,
        type: notification.notification_type as string,
        isRead: Boolean(notification.is_read),
        priority: notification.priority as string,
        createdAt: notification.created_at as string,
        actionUrl: notification.action_url as string | undefined
      })) || [];

      console.log('✅ Retrieved', formattedNotifications.length, 'notifications');
      return formattedNotifications;

    } catch (error) {
      console.log('❌ Error getting notifications:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
    console.log('✅ Marking notification as read');

    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        throw new Error('Failed to mark notification as read: ' + error.message);
      }

      return { success: true };

    } catch (error) {
      console.log('❌ Error marking notification as read:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // =============================================
  // PROJECTS & PORTFOLIO
  // =============================================

  async getStudentProjects(studentId: string): Promise<ProjectDto[]> {
    console.log('🎨 Getting student projects');

    try {
      const { data: projects, error } = await this.supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch projects: ' + error.message);
      }

      const formattedProjects = projects?.map(project => ({
        id: project.id as string,
        title: project.title as string,
        description: project.description as string || '',
        projectType: project.project_type as string,
        subject: project.subject as string,
        startDate: project.start_date as string,
        endDate: project.end_date as string | undefined,
        status: project.status as ProjectStatus,
        skillsUsed: (project.skills_used as string[]) || [],
        technologies: (project.technologies as string[]) || [],
        progressPercentage: this.calculateProjectProgress(project)
      })) || [];

      console.log('✅ Retrieved', formattedProjects.length, 'projects');
      return formattedProjects;

    } catch (error) {
      console.log('❌ Error getting projects:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  // =============================================
  // TESTS & ASSESSMENTS
  // =============================================

  async getUpcomingTests(studentId: string): Promise<TestDto[]> {
    console.log('📝 Getting upcoming tests');

    try {
      const studentClass = await this.getStudentClass(studentId);

      const { data: tests, error } = await this.supabase
        .from('tests')
        .select(`
          *,
          test_results!left(
            score, percentage, grade, completed_at
          )
        `)
        .eq('class_level', studentClass)
        .gt('test_date', new Date().toISOString())
        .eq('is_active', true)
        .order('test_date', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch tests: ' + error.message);
      }

      const formattedTests = tests?.map(test => {
        const result = test.test_results?.[0];
        
        return {
          id: test.id as string,
          title: test.title as string,
          description: test.description as string || '',
          subject: test.subject as string,
          testDate: test.test_date as string,
          duration: test.duration as number,
          totalMarks: test.total_marks as number,
          testType: test.test_type as string,
          hasCompleted: Boolean(result),
          result: result ? {
            score: result.score as number,
            percentage: Number(result.percentage),
            grade: result.grade as string,
            completedAt: result.completed_at as string
          } : undefined
        };
      }) || [];

      console.log('✅ Retrieved', formattedTests.length, 'upcoming tests');
      return formattedTests;

    } catch (error) {
      console.log('❌ Error getting upcoming tests:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  // =============================================
  // NEW ANALYTICS METHODS
  // =============================================

  async getWeeklyAnalytics(studentId: string): Promise<any> {
    console.log('📊 Getting real weekly analytics for student:', studentId);

    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get real weekly activity data
      const { data: weeklyActivities, error: activitiesError } = await this.supabase
        .from('student_recent_activities')
        .select('activity_type, created_at, metadata')
        .eq('student_id', studentId)
        .gte('created_at', oneWeekAgo.toISOString());

      if (activitiesError) {
        throw new Error('Failed to fetch weekly activities: ' + activitiesError.message);
      }

      // Get assignment completions this week
      const assignmentsCompleted = weeklyActivities?.filter(
        activity => activity.activity_type === 'assignment' && 
                   (activity.metadata as any)?.status === 'completed'
      ).length || 0;

      // Get sessions attended this week
      const { data: weeklySessionsAttended, error: sessionsError } = await this.supabase
        .from('session_participants')
        .select('session_id, attendance_status')
        .eq('student_id', studentId)
        .eq('attendance_status', 'attended')
        .gte('registration_date', oneWeekAgo.toISOString());

      if (sessionsError) {
        throw new Error('Failed to fetch weekly sessions: ' + sessionsError.message);
      }

      const sessionsAttended = weeklySessionsAttended?.length || 0;

      // Get careers explored this week
      const careersExplored = weeklyActivities?.filter(
        activity => activity.activity_type === 'career_explored'
      ).length || 0;

      // Calculate study time from activities (if tracked)
      const studyTimeHours = weeklyActivities?.reduce((total, activity) => {
        const metadata = activity.metadata as any;
        return total + (metadata?.studyTimeMinutes || 0);
      }, 0) / 60 || 0;

      // Calculate progress trend by comparing with previous week
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const { data: previousWeekActivities } = await this.supabase
        .from('student_recent_activities')
        .select('activity_type')
        .eq('student_id', studentId)
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString());

      const previousWeekCount = previousWeekActivities?.length || 0;
      const currentWeekCount = weeklyActivities?.length || 0;
      const progressTrend = currentWeekCount > previousWeekCount ? 'up' : 
                           currentWeekCount < previousWeekCount ? 'down' : 'stable';

      return {
        weeklyStats: {
          assignmentsCompleted,
          sessionsAttended,
          careersExplored,
          studyTimeHours: Math.round(studyTimeHours * 10) / 10,
          progressTrend
        },
        weeklyGoals: {
          assignments: 5,
          sessions: 3,
          careers: 10,
          studyTime: 15
        },
        achievements: this.generateAchievements(assignmentsCompleted, sessionsAttended, careersExplored)
      };

    } catch (error) {
      console.log('❌ Error getting weekly analytics:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getProfileOverview(studentId: string): Promise<any> {
    console.log('👤 Getting real profile overview for student:', studentId);

    try {
      const [basicInfo, profileStats] = await Promise.all([
        this.getStudentBasicInfo(studentId),
        this.getProfileStats(studentId)
      ]);

      // Get real academic performance data
      const { data: testResults, error: testError } = await this.supabase
        .from('test_results')
        .select(`
          score, percentage, grade,
          tests!inner(subject, total_marks)
        `)
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false });

      if (testError) {
        throw new Error('Failed to fetch test results: ' + testError.message);
      }

      // Get real assignment grades
      const { data: assignmentResults, error: assignmentError } = await this.supabase
        .from('assignment_submissions')
        .select(`
          score, grade,
          assignments!inner(subject, total_marks)
        `)
        .eq('student_id', studentId)
        .not('score', 'is', null)
        .order('submitted_at', { ascending: false });

      if (assignmentError) {
        throw new Error('Failed to fetch assignment results: ' + assignmentError.message);
      }

      // Calculate real academic stats
      const subjectStats = this.calculateSubjectStats(testResults || [], assignmentResults || []);
      const overallGPA = this.calculateGPA(subjectStats);
      
      // Get class rank (if available)
      const { data: classStats } = await this.supabase
        .from('student_dashboard_stats')
        .select('student_id, average_assignment_score')
        .not('average_assignment_score', 'is', null);

      const classmates = classStats?.filter(stat => stat.student_id !== studentId) || [];
      const studentAverage = profileStats.averageScore;
      const rank = classmates.filter(classmate => 
        Number(classmate.average_assignment_score) < studentAverage
      ).length + 1;

      // Get real Holland test results
      const { data: hollandResults } = await this.supabase
        .from('holland_results')
        .select('personality_code, completed_at')
        .eq('student_id', studentId)
        .single();

      // Get real career exploration data
      const { data: careerActivities } = await this.supabase
        .from('student_activities')
        .select('id')
        .eq('student_id', studentId)
        .eq('activity_type', 'career_explored');

      const { data: favoriteCareers } = await this.supabase
        .from('student_favorites')
        .select('id')
        .eq('student_id', studentId);

      return {
        basicInfo,
        academicStats: {
          currentGPA: overallGPA,
          rank: rank,
          totalStudents: classmates.length + 1,
          subjects: subjectStats
        },
        careerProgress: {
          testCompleted: Boolean(hollandResults),
          personalityType: hollandResults?.personality_code || null,
          careersExplored: careerActivities?.length || 0,
          favoriteCareers: favoriteCareers?.length || 0
        }
      };

    } catch (error) {
      console.log('❌ Error getting profile overview:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // =============================================
  // HELPER METHODS
  // =============================================

  private async getStudentClass(studentId: string): Promise<string> {
    const { data: profile } = await this.supabase
      .from('student_profiles')
      .select('class_level')
      .eq('user_id', studentId)
      .single();

    return profile?.class_level || '10th';
  }

  private async getStudentSessionRegistrations(studentId: string): Promise<string[]> {
    const { data: registrations } = await this.supabase
      .from('session_participants')
      .select('session_id')
      .eq('student_id', studentId);

    return registrations?.map(reg => reg.session_id as string) || [];
  }

  private async getQuickActions(studentId: string): Promise<string[]> {
    const actions: string[] = [];

    try {
      // Check if Holland Code test is completed
      const { data: hollandResult } = await this.supabase
        .from('holland_results')
        .select('id')
        .eq('student_id', studentId)
        .single();

      if (!hollandResult) {
        actions.push('Complete Holland Code personality test');
      }

      // Check for pending assignments
      const studentClass = await this.getStudentClass(studentId);
      const { data: pendingAssignments } = await this.supabase
        .from('assignments')
        .select('id')
        .eq('class_level', studentClass)
        .eq('is_active', true)
        .gt('due_date', new Date().toISOString())
        .not('id', 'in', `(
          SELECT assignment_id FROM assignment_submissions 
          WHERE student_id = '${studentId}'
        )`);

      if (pendingAssignments && pendingAssignments.length > 0) {
        actions.push(`Submit ${pendingAssignments.length} pending assignment${pendingAssignments.length > 1 ? 's' : ''}`);
      }

      // Check for available sessions to register
      const { data: availableSessions } = await this.supabase
        .from('mentoring_sessions')
        .select('id')
        .eq('status', 'scheduled')
        .gt('session_date', new Date().toISOString())
        .not('id', 'in', `(
          SELECT session_id FROM session_participants 
          WHERE student_id = '${studentId}'
        )`);

      if (availableSessions && availableSessions.length > 0) {
        actions.push('Register for upcoming mentoring sessions');
      }

      // Check for unread notifications
      const { data: unreadNotifications } = await this.supabase
        .from('notifications')
        .select('id')
        .eq('user_id', studentId)
        .eq('is_read', false);

      if (unreadNotifications && unreadNotifications.length >= 3) {
        actions.push('Check important notifications');
      }

      // Check if profile is incomplete
      const { data: profile } = await this.supabase
        .from('student_profiles')
        .select('interests, career_goals, skills')
        .eq('user_id', studentId)
        .single();

      if (!profile?.interests || !profile?.career_goals) {
        actions.push('Complete your profile setup');
      }

      return actions.slice(0, 3); // Return max 3 actions

    } catch (error) {
      console.log('Warning: Error getting quick actions:', error instanceof Error ? error.message : 'Unknown error');
      return ['Complete Holland Code personality test']; // Fallback
    }
  }

  private async updateDashboardStats(studentId: string): Promise<void> {
    try {
      const studentClass = await this.getStudentClass(studentId);

      // Get assignment stats using database function
      const { data: assignmentStats } = await this.supabase.rpc('get_student_assignment_stats', {
        student_id_param: studentId,
        class_level_param: studentClass
      });

      // Get session stats using database function
      const { data: sessionStats } = await this.supabase.rpc('get_student_session_stats', {
        student_id_param: studentId
      });

      // Get career progress
      const { data: careerProgress } = await this.supabase
        .from('student_career_progress')
        .select('total_progress')
        .eq('student_id', studentId)
        .single();

      // Update or insert dashboard stats
      await this.supabase
        .from('student_dashboard_stats')
        .upsert({
          student_id: studentId,
          completed_assignments: Number(assignmentStats?.completed || 0),
          total_assignments: Number(assignmentStats?.total || 0),
          mentoring_sessions_attended: Number(sessionStats?.attended || 0),
          total_mentoring_sessions: Number(sessionStats?.total || 0),
          average_assignment_score: Number(assignmentStats?.average_score || 0),
          career_exploration_progress: Number(careerProgress?.total_progress || 0),
          last_updated: new Date().toISOString()
        });

    } catch (error) {
      console.log('Warning: Failed to update dashboard stats:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private calculateProjectProgress(project: any): number {
    if (project.status === 'completed') return 100;
    if (project.status === 'planning') return 10;
    if (project.status === 'on-hold') return 0;

    // For in-progress projects, calculate based on dates if available
    if (project.start_date && project.end_date) {
      const start = new Date(project.start_date).getTime();
      const end = new Date(project.end_date).getTime();
      const now = new Date().getTime();
      
      if (now <= start) return 10;
      if (now >= end) return 90;
      
      const progress = ((now - start) / (end - start)) * 80 + 10; // 10-90% based on time
      return Math.round(progress);
    }

    return 50; // Default for in-progress without dates
  }

  private generateAchievements(assignments: number, sessions: number, careers: number): Array<{title: string, description: string, icon: string}> {
    const achievements: Array<{title: string, description: string, icon: string}> = [];

    if (assignments >= 3) {
      achievements.push({
        title: 'Assignment Streak',
        description: `${assignments} assignments completed this week`,
        icon: '🔥'
      });
    }

    if (careers >= 5) {
      achievements.push({
        title: 'Career Explorer',
        description: `Explored ${careers} new careers`,
        icon: '🌟'
      });
    }

    if (sessions >= 2) {
      achievements.push({
        title: 'Active Learner',
        description: `Attended ${sessions} mentoring sessions`,
        icon: '🎓'
      });
    }

    return achievements;
  }

  private calculateSubjectStats(testResults: any[], assignmentResults: any[]): Array<{name: string, grade: string, score: number}> {
    const subjectMap = new Map<string, {scores: number[], totalMarks: number[]}>();

    // Process test results
    testResults.forEach(result => {
      const subject = result.tests?.subject;
      if (subject) {
        if (!subjectMap.has(subject)) {
          subjectMap.set(subject, { scores: [], totalMarks: [] });
        }
        const subjectData = subjectMap.get(subject)!;
        subjectData.scores.push(Number(result.score));
        subjectData.totalMarks.push(Number(result.tests.total_marks));
      }
    });

    // Process assignment results
    assignmentResults.forEach(result => {
      const subject = result.assignments?.subject;
      if (subject) {
        if (!subjectMap.has(subject)) {
          subjectMap.set(subject, { scores: [], totalMarks: [] });
        }
        const subjectData = subjectMap.get(subject)!;
        subjectData.scores.push(Number(result.score));
        subjectData.totalMarks.push(Number(result.assignments.total_marks));
      }
    });

    // Calculate averages for each subject
    const subjectStats: Array<{name: string, grade: string, score: number}> = [];
    subjectMap.forEach((data, subject) => {
      const totalScore = data.scores.reduce((sum, score) => sum + score, 0);
      const totalMarks = data.totalMarks.reduce((sum, marks) => sum + marks, 0);
      const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
      
      subjectStats.push({
        name: subject,
        grade: this.calculateLetterGrade(percentage),
        score: Math.round(percentage)
      });
    });

    return subjectStats.sort((a, b) => b.score - a.score);
  }

  private calculateGPA(subjectStats: Array<{grade: string}>): number {
    if (subjectStats.length === 0) return 0;
    
    const gradePoints: Record<string, number> = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };
    
    const totalPoints = subjectStats.reduce((sum, subject) => {
      return sum + (gradePoints[subject.grade] || 0);
    }, 0);
    
    return Math.round((totalPoints / subjectStats.length) * 10) / 10;
  }

  private calculateLetterGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  }
}
