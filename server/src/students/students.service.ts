// server/src/students/students.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  StudentDashboardResponseDto,
  StudentProfileDto,
  ProfileStatsDto,
  RecentActivityDto,
  UpcomingSessionDto,
} from './dto/student-dashboard.dto';

@Injectable()
export class StudentsService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // server/src/students/students.service.ts - Quick fix for school name

async getStudentDashboard(studentId: string): Promise<StudentDashboardResponseDto> {
  console.log('🎓 Getting dashboard data for student:', studentId);

  try {
    // Get basic user info
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('id, full_name, avatar_url, role')
      .eq('id', studentId)
      .single();

    if (userError || !user) {
      throw new NotFoundException('Student not found');
    }

    // Get student profile
    const { data: profile, error: profileError } = await this.supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', studentId)
      .single();

    let schoolName = 'N/A';
    let classLevel = 'N/A';

    if (profile && !profileError) {
      classLevel = profile.class_level || 'N/A';
      
      // Fix: Get school name with better error handling
      if (profile.school_id) {
        console.log('🔍 Looking up school with ID:', profile.school_id);
        
        const { data: school, error: schoolError } = await this.supabase
          .from('schools')
          .select('name, location, district')
          .eq('id', profile.school_id)
          .single();

        console.log('📊 School lookup result:', { 
          school: school, 
          error: schoolError,
          schoolId: profile.school_id
        });

        if (school && !schoolError) {
          schoolName = school.name;
        } else {
          console.log('❌ School not found, checking if school exists...');
          
          // Check if any school exists with this ID using a different approach
          const { data: schoolCheck, error: checkError } = await this.supabase
            .from('schools')
            .select('*')
            .eq('id', profile.school_id)
            .maybeSingle(); // Use maybeSingle instead of single

          console.log('🔍 School check result:', { schoolCheck, checkError });

          if (schoolCheck) {
            schoolName = schoolCheck.name;
          }
        }
      }
    }

    // Get other dashboard data
    const profileStats = await this.getProfileStats(studentId, classLevel);
    const recentActivities = await this.getRecentActivities(studentId);
    const upcomingSessions = await this.getUpcomingSessions(studentId);

    const response: StudentDashboardResponseDto = {
      student: {
        name: user.full_name,
        class: classLevel,
        school: schoolName,
        profileImage: user.avatar_url,
      },
      profileStats,
      recentActivities,
      upcomingSessions,
    };

    console.log('✅ Dashboard response:', response);
    return response;

  } catch (error) {
    console.log('❌ Error getting dashboard data:', error.message);
    throw error;
  }
}


  private async getProfileStats(studentId: string, classLevel?: string): Promise<ProfileStatsDto> {
    try {
      if (!classLevel) {
        console.log('⚠️ No class level found, returning default stats');
        return {
          completedAssignments: 0,
          totalAssignments: 0,
          upcomingTests: 0,
          mentoringSessionsAttended: 0,
        };
      }

      // Get assignment stats using a simpler approach first
      const { data: assignments } = await this.supabase
        .from('assignments')
        .select('id')
        .eq('class_level', classLevel)
        .eq('is_active', true)
        .gte('due_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      const { data: submissions } = await this.supabase
        .from('assignment_submissions')
        .select('assignment_id')
        .eq('student_id', studentId);

      const completedCount = assignments?.filter(assignment => 
        submissions?.some(sub => sub.assignment_id === assignment.id)
      )?.length || 0;

      // Get mentoring sessions attended
      const { count: sessionsAttended } = await this.supabase
        .from('mentoring_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('status', 'completed');

      // Get upcoming tests
      const { count: upcomingTests } = await this.supabase
        .from('tests')
        .select('*', { count: 'exact', head: true })
        .eq('class_level', classLevel)
        .gte('test_date', new Date().toISOString())
        .eq('is_active', true);

      const stats = {
        completedAssignments: completedCount,
        totalAssignments: assignments?.length || 0,
        upcomingTests: upcomingTests || 0,
        mentoringSessionsAttended: sessionsAttended || 0,
      };

      console.log('📊 Profile stats:', stats);
      return stats;

    } catch (error) {
      console.log('⚠️ Error getting profile stats:', error.message);
      return {
        completedAssignments: 0,
        totalAssignments: 0,
        upcomingTests: 0,
        mentoringSessionsAttended: 0,
      };
    }
  }

  private async getRecentActivities(studentId: string): Promise<RecentActivityDto[]> {
    try {
      const { data: activities, error } = await this.supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', studentId)
        .order('activity_date', { ascending: false })
        .limit(5);

      if (error) {
        console.log('⚠️ Error getting activities:', error.message);
        return [];
      }

      const mappedActivities = activities?.map(activity => ({
        type: activity.activity_type as 'assignment' | 'session' | 'test' | 'project',
        title: activity.title,
        status: activity.status as 'completed' | 'upcoming' | 'pending' | 'in-progress',
        date: new Date(activity.activity_date).toISOString(),
      })) || [];

      console.log('📊 Recent activities:', mappedActivities.length);
      return mappedActivities;

    } catch (error) {
      console.log('⚠️ Error getting recent activities:', error.message);
      return [];
    }
  }

  private async getUpcomingSessions(studentId: string): Promise<UpcomingSessionDto[]> {
    try {
      const { data: sessions, error } = await this.supabase
        .from('mentoring_sessions')
        .select(`
          id, 
          session_date, 
          session_time, 
          subject, 
          session_type,
          users!mentoring_sessions_mentor_id_fkey (full_name)
        `)
        .eq('student_id', studentId)
        .eq('status', 'scheduled')
        .gte('session_date', new Date().toISOString())
        .order('session_date', { ascending: true })
        .limit(3);

      if (error) {
        console.log('⚠️ Error getting sessions:', error.message);
        return [];
      }

      const mappedSessions = sessions?.map(session => {
        // Handle the mentor data (which could be an array or object)
        const mentorData = session.users as any;
        const mentorName = Array.isArray(mentorData) 
          ? mentorData[0]?.full_name 
          : mentorData?.full_name;

        return {
          id: session.id,
          date: new Date(session.session_date).toDateString(),
          time: session.session_time,
          mentor: mentorName || 'TBD',
          subject: session.subject || 'General',
          type: session.session_type === 'group' ? 'Group' as const : 'Individual' as const,
        };
      }) || [];

      console.log('📊 Upcoming sessions:', mappedSessions.length);
      return mappedSessions;

    } catch (error) {
      console.log('⚠️ Error getting upcoming sessions:', error.message);
      return [];
    }
  }
}
