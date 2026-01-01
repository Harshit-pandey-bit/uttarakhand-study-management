// server/src/teacher/teacher.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  TeacherDashboardResponseDto,
  TeacherProfileDto,
  UpdateSubjectsClassesDto,
  AssignmentDto,
  CreateAssignmentDto,
  GradeSubmissionDto,
  GradebookDataDto,
  MentoringSessionDto,
  ScheduleSessionDto,
  AnnouncementDto,
  ActivityDto,
} from './dto/teacher-dashboard.dto';

@Injectable()
export class TeacherService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  /* ---------- DASHBOARD METHODS ---------- */

  async getTeacherDashboard(
    teacherUserId: string,
  ): Promise<TeacherDashboardResponseDto> {
    console.log('Getting teacher dashboard data for:', teacherUserId);

    try {
      // Get teacher profile with user and school data
      const { data: teacherProfile, error: profileError } = await this.supabase
        .from('teacher_profiles')
        .select(`
          *,
          users:user_id (
            id, email, full_name, phone, avatar_url,
            is_active, onboarding_completed, created_at, updated_at, role
          ),
          schools:school_id (
            id, name, type, location, district, principal_name
          )
        `)
        .eq('user_id', teacherUserId)
        .single();

      if (profileError || !teacherProfile) {
        console.error('Profile error:', profileError);
        throw new NotFoundException('Teacher profile not found');
      }

      // Get stats
      const stats = await this.getTeacherStats(teacherUserId, teacherProfile.id);

      // Get recent activities
      const recentActivity = await this.getRecentActivities(teacherUserId);

      // Get upcoming deadlines
      const upcomingDeadlines = await this.getUpcomingDeadlines(teacherUserId);

      // Get announcements
      const announcements = await this.getAnnouncementsForTeacher(
        teacherUserId,
        teacherProfile.school_id,
      );

      // Quick actions (static for MVP)
      const quickActions = [
        {
          title: 'Create Assignment',
          description: 'Design new assignment for your students',
          action: '/teacher/ai-assistant/assignment-creator',
          icon: 'FileText',
        },
        {
          title: 'Plan Lesson',
          description: 'Create NCERT-aligned lesson plans',
          action: '/teacher/ai-assistant/ncert-generator',
          icon: 'BookOpen',
        },
        {
          title: 'Grade Assignments',
          description: 'Review pending submissions',
          action: '/teacher/assessments/summative-tracking',
          icon: 'CheckCircle',
        },
        {
          title: 'Schedule HEI Session',
          description: 'Book mentoring session with HEI',
          action: '/teacher/virtual-collaboration/hei-coordination',
          icon: 'Video',
        },
      ];

      return {
        teacher: {
          user: teacherProfile.users,
          profile: {
            id: teacherProfile.id,
            user_id: teacherProfile.user_id,
            school_id: teacherProfile.school_id,
            employee_id: teacherProfile.employeeid,
            subjects: teacherProfile.subjects,
            classes: teacherProfile.classes,
            qualification: teacherProfile.qualification,
            experience_years: teacherProfile.experienceyears,
            joined_date: teacherProfile.joineddate,
            created_at: teacherProfile.createdat,
            updated_at: teacherProfile.updatedat,
          },
          school: teacherProfile.schools,
        },
        stats,
        recent_activity: recentActivity,
        upcoming_deadlines: upcomingDeadlines,
        announcements,
        quick_actions: quickActions,
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      throw error;
    }
  }

  private async getTeacherStats(teacherUserId: string, teacherProfileId: string) {
    // Get total students (count distinct student_ids from assignment submissions)
    const { count: totalStudents } = await this.supabase
      .from('assignmentsubmissions')
      .select('studentid', { count: 'exact', head: true })
      .eq('teacherid', teacherUserId);

    // Get active assignments
    const { count: activeAssignments } = await this.supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('teacherid', teacherUserId)
      .eq('isactive', true)
      .gte('duedate', new Date().toISOString());

    // Get pending grading
    const { count: pendingGrading } = await this.supabase
      .from('assignmentsubmissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted');

    // Get upcoming sessions (using mentoringsessions table)
    const { count: upcomingSessions } = await this.supabase
      .from('mentoringsessions')
      .select('*', { count: 'exact', head: true })
      .gte('sessiondate', new Date().toISOString())
      .eq('status', 'scheduled');

    // Calculate average assignment score
    const { data: submissions } = await this.supabase
      .from('assignmentsubmissions')
      .select('score')
      .eq('status', 'graded')
      .not('score', 'is', null);

    let averageScore = 0;
    let completionRate = 0;

    if (submissions && submissions.length > 0) {
      const totalScore = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
      averageScore = totalScore / submissions.length;
      completionRate = 92; // Placeholder
    }

    return {
      total_students: totalStudents || 0,
      active_assignments: activeAssignments || 0,
      pending_grading: pendingGrading || 0,
      upcoming_sessions: upcomingSessions || 0,
      lesson_plans_created: 0,
      this_month_activities: 28,
      average_assignment_score: parseFloat(averageScore.toFixed(1)),
      completion_rate: completionRate,
    };
  }

  private async getRecentActivities(teacherUserId: string): Promise<ActivityDto[]> {
    const { data: recentAssignments } = await this.supabase
      .from('assignments')
      .select('id, title, createdat')
      .eq('teacherid', teacherUserId)
      .order('createdat', { ascending: false })
      .limit(3);

    const activities: ActivityDto[] = [];

    if (recentAssignments) {
      for (const assignment of recentAssignments) {
        activities.push({
          id: `activity_${assignment.id}`,
          type: 'assignment_created',
          title: `Created: ${assignment.title}`,
          description: 'New assignment created',
          timestamp: assignment.createdat,
        });
      }
    }

    return activities;
  }

  private async getUpcomingDeadlines(teacherUserId: string) {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('*')
      .eq('teacherid', teacherUserId)
      .gte('duedate', new Date().toISOString())
      .order('duedate', { ascending: true })
      .limit(5);

    const { data: sessions } = await this.supabase
      .from('mentoringsessions')
      .select('*')
      .gte('sessiondate', new Date().toISOString())
      .eq('status', 'scheduled')
      .order('sessiondate', { ascending: true })
      .limit(5);

    return {
      assignments: assignments || [],
      sessions: sessions || [],
    };
  }

  private async getAnnouncementsForTeacher(
    teacherUserId: string,
    schoolId: string,
  ) {
    const { data: announcements } = await this.supabase
      .from('announcements')
      .select(`
        *,
        announcementviews!left (user_id)
      `)
      .or(`school_id.eq.${schoolId},targetaudience.cs.{"teacher"}`)
      .order('createdat', { ascending: false })
      .limit(5);

    if (!announcements) return [];

    return announcements.map((ann) => ({
      ...ann,
      user_has_viewed:
        ann.announcementviews?.some((view: any) => view.user_id === teacherUserId) || false,
    }));
  }

  /* ---------- PROFILE METHODS ---------- */

  async getTeacherProfile(teacherUserId: string): Promise<TeacherProfileDto> {
    const { data, error } = await this.supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', teacherUserId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Teacher profile not found');
    }

    return data;
  }

  async updateSubjectsAndClasses(
    teacherUserId: string,
    updateDto: UpdateSubjectsClassesDto,
  ): Promise<TeacherProfileDto> {
    const { data, error } = await this.supabase
      .from('teacher_profiles')
      .update({
        subjects: updateDto.subjects,
        classes: updateDto.classes,
        updatedat: new Date().toISOString(),
      })
      .eq('user_id', teacherUserId)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update profile');
    }

    return data;
  }

  /* ---------- ASSIGNMENT METHODS ---------- */

  async getAssignments(
    teacherUserId: string,
    filters: { subject?: string; class_level?: string },
  ): Promise<AssignmentDto[]> {
    let query = this.supabase
      .from('assignments')
      .select('*')
      .eq('teacherid', teacherUserId);

    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }

    if (filters.class_level) {
      query = query.eq('classlevel', filters.class_level);
    }

    const { data, error } = await query.order('createdat', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch assignments');
    }

    const assignmentsWithStats = await Promise.all(
      (data || []).map(async (assignment) => {
        const stats = await this.getAssignmentSubmissionStats(assignment.id);
        return {
          ...assignment,
          submission_stats: stats,
        };
      }),
    );

    return assignmentsWithStats;
  }

  private async getAssignmentSubmissionStats(assignmentId: string) {
    const { data: submissions } = await this.supabase
      .from('assignmentsubmissions')
      .select('status, score')
      .eq('assignmentid', assignmentId);

    const totalStudents = submissions?.length || 0;
    const submitted =
      submissions?.filter((s) => s.status === 'submitted' || s.status === 'graded').length || 0;
    const graded = submissions?.filter((s) => s.status === 'graded').length || 0;
    const pending = submitted - graded;

    const gradedSubmissions =
      submissions?.filter((s) => s.status === 'graded' && s.score !== null) || [];
    const averageScore =
      gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length
        : 0;

    return {
      total_students: totalStudents,
      submitted,
      graded,
      pending,
      average_score: parseFloat(averageScore.toFixed(1)),
    };
  }

  async createAssignment(
    teacherUserId: string,
    createDto: CreateAssignmentDto,
  ): Promise<AssignmentDto> {
    const { data, error } = await this.supabase
      .from('assignments')
      .insert({
        title: createDto.title,
        description: createDto.description,
        subject: createDto.subject,
        classlevel: createDto.class_level,
        teacherid: teacherUserId,
        totalmarks: 50,
        duedate: createDto.due_date,
        isactive: true,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Create assignment error:', error);
      throw new BadRequestException('Failed to create assignment');
    }

    return {
      ...data,
      submission_stats: {
        total_students: 0,
        submitted: 0,
        graded: 0,
        pending: 0,
        average_score: 0,
      },
    };
  }

  async gradeSubmission(submissionId: string, gradeDto: GradeSubmissionDto): Promise<any> {
    const { data, error } = await this.supabase
      .from('assignmentsubmissions')
      .update({
        score: gradeDto.total_score,
        feedback: gradeDto.feedback,
        status: 'graded',
        gradedat: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to grade submission');
    }

    return data;
  }

  /* ---------- GRADEBOOK METHODS ---------- */

  async getGradebookData(
    teacherUserId: string,
    classLevel: string,
    subject: string,
  ): Promise<GradebookDataDto> {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('id, title')
      .eq('teacherid', teacherUserId)
      .eq('classlevel', classLevel)
      .eq('subject', subject);

    if (!assignments || assignments.length === 0) {
      return {
        class_level: classLevel,
        subject,
        students: [],
        class_average: 0,
        assignment_averages: [],
      };
    }

    const assignmentIds = assignments.map((a) => a.id);
    const { data: submissions } = await this.supabase
      .from('assignmentsubmissions')
      .select('*')
      .in('assignmentid', assignmentIds);

    const studentMap = new Map();

    submissions?.forEach((sub) => {
      if (!studentMap.has(sub.studentid)) {
        studentMap.set(sub.studentid, {
          student_id: sub.studentid,
          student_name: 'Student', // You may need to join with users table
          roll_number: 'N/A',
          assignments: [],
          total_percentage: 0,
        });
      }

      const student = studentMap.get(sub.studentid);
      const percentage = ((sub.score || 0) / 50) * 100; // Assuming 50 total marks
      student.assignments.push({
        assignment_id: sub.assignmentid,
        assignment_name: assignments.find((a) => a.id === sub.assignmentid)?.title || 'Assignment',
        max_marks: 50,
        scored_marks: sub.score || 0,
        percentage,
        status: sub.status,
      });
    });

    const students = Array.from(studentMap.values()).map((student) => {
      const totalPercentage =
        student.assignments.reduce((sum: number, a: any) => sum + a.percentage, 0) /
        student.assignments.length;
      return {
        ...student,
        total_percentage: parseFloat(totalPercentage.toFixed(2)),
        grade: this.calculateGrade(totalPercentage),
      };
    });

    const assignmentAverages = assignments.map((assignment) => {
      const assignmentSubs = submissions?.filter((s) => s.assignmentid === assignment.id) || [];
      const averageScore =
        assignmentSubs.length > 0
          ? assignmentSubs.reduce((sum, s) => sum + (s.score || 0), 0) / assignmentSubs.length
          : 0;
      const completionRate =
        (assignmentSubs.filter((s) => s.status === 'graded').length / assignmentSubs.length) * 100;

      return {
        assignment_id: assignment.id,
        assignment_name: assignment.title,
        average_score: parseFloat(averageScore.toFixed(1)),
        completion_rate: parseFloat(completionRate.toFixed(1)),
      };
    });

    const classAverage =
      students.length > 0
        ? students.reduce((sum, s) => sum + s.total_percentage, 0) / students.length
        : 0;

    return {
      class_level: classLevel,
      subject,
      students,
      class_average: parseFloat(classAverage.toFixed(2)),
      assignment_averages: assignmentAverages,
    };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  /* ---------- HEI SESSION METHODS ---------- */

  async getHEISessions(teacherUserId: string): Promise<MentoringSessionDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('mentoringsessions')
        .select('*')
        .order('sessiondate', { ascending: true });

      if (error) {
        console.error('Failed to fetch sessions:', error.message);
        // Return empty array instead of throwing for dashboard data
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('getHEISessions error:', error);
      return [];
    }
  }

  async scheduleHEISession(
    teacherUserId: string,
    scheduleDto: ScheduleSessionDto,
  ): Promise<MentoringSessionDto> {
    const { data, error } = await this.supabase
      .from('mentoringsessions')
      .insert({
        title: scheduleDto.title,
        description: scheduleDto.description,
        sessiondate: scheduleDto.session_date,
        duration: scheduleDto.duration,
        sessiontype: scheduleDto.session_type,
        subject: scheduleDto.subject,
        maxparticipants: scheduleDto.session_type === 'individual' ? 1 : 20,
        status: 'scheduled',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to schedule session');
    }

    return data;
  }

  /* ---------- ANNOUNCEMENT METHODS ---------- */

  async getAnnouncements(
    teacherUserId: string,
    filters: { badge_type?: string; priority?: string; unread_only?: boolean },
  ): Promise<AnnouncementDto[]> {
    try {
      const { data: profile } = await this.supabase
        .from('teacher_profiles')
        .select('school_id')
        .eq('user_id', teacherUserId)
        .single();

      if (!profile) {
        console.log('Teacher profile not found for announcements, returning empty array');
        return [];
      }

      let query = this.supabase
        .from('announcements')
        .select(`
          *,
          announcementviews!left (user_id)
        `)
        .or(`school_id.eq.${profile.school_id},targetaudience.cs.{"teacher"}`);

      if (filters.badge_type) {
        query = query.eq('badgetype', filters.badge_type);
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query.order('createdat', { ascending: false });

      if (error) {
        console.error('Failed to fetch announcements:', error.message);
        return [];
      }

      let announcements = (data || []).map((ann) => ({
        ...ann,
        user_has_viewed:
          ann.announcementviews?.some((view: any) => view.user_id === teacherUserId) || false,
      }));

      if (filters.unread_only) {
        announcements = announcements.filter((a) => !a.user_has_viewed);
      }

      return announcements;
    } catch (error) {
      console.error('getAnnouncements error:', error);
      return [];
    }
  }

  async markAnnouncementAsRead(teacherUserId: string, announcementId: string): Promise<void> {
    const { error } = await this.supabase.from('announcementviews').insert({
      announcementid: announcementId,
      user_id: teacherUserId,
      viewedat: new Date().toISOString(),
    });

    if (error) {
      throw new BadRequestException('Failed to mark announcement as read');
    }
  }
}
