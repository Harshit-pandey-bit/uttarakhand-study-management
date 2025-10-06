// server/src/school-admin/school-admin.service.ts

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SchoolAdminDashboardResponseDto,
  SchoolOverviewDto,
  ClassStatsDto,
  TeacherSummaryDto,
  StudentSummaryDto,
  AnnouncementDto,
  ActivityStatsDto,
  TeachersResponseDto,
  StudentsResponseDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnalyticsOverviewDto,
  StudentActivitiesAnalyticsDto
} from './dto/school-admin-dashboard.dto';

@Injectable()
export class SchoolAdminService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  async getSchoolAdminDashboard(adminUserId: string): Promise<SchoolAdminDashboardResponseDto> {
    console.log('🏫 Getting school admin dashboard data for:', adminUserId);
    
    try {
      // Get admin profile and school ID
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      // Fetch all dashboard components in parallel
      const [
        schoolOverview,
        classStats,
        activityStats,
        announcements,
        heiAnnouncements
      ] = await Promise.all([
        this.getSchoolOverview(schoolId),
        this.getClassStats(schoolId),
        this.getActivityStats(schoolId),
        this.getSchoolAnnouncements(schoolId),
        this.getHEIAnnouncements(adminUserId)
      ]);

      const response: SchoolAdminDashboardResponseDto = {
        schoolOverview,
        classStats,
        activityStats,
        announcements,
        heiAnnouncements
      };

      console.log('✅ School admin dashboard response prepared');
      return response;

    } catch (error) {
      console.log('❌ Error getting school admin dashboard:', error.message);
      throw error;
    }
  }

  async getTeachersData(adminUserId: string): Promise<TeachersResponseDto> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      const { data: teachers, error } = await this.supabase
        .from('teacher_profiles')
        .select(`
          id,
          user_id,
          employee_id,
          subjects,
          classes,
          qualification,
          experience_years,
          joined_date,
          users!teacher_profiles_user_id_fkey (full_name, avatar_url)
        `)
        .eq('school_id', schoolId);

      if (error) {
        console.log('❌ Error fetching teachers:', error.message);
        return { teachers: [], totalTeachers: 0, averageExperience: 0, totalStudentsAssigned: 0 };
      }

      // Get student counts for each teacher
      const teachersWithDetails = await Promise.all(teachers?.map(async (teacher) => {
        const studentCount = await this.getStudentCountForTeacher(teacher.user_id);
        
        const userData = teacher.users as any;
        return {
          id: teacher.user_id,
          name: userData?.full_name || 'Unknown',
          employeeId: teacher.employee_id || 'N/A',
          subjects: teacher.subjects || [],
          classes: teacher.classes || [],
          qualification: teacher.qualification || 'Not specified',
          experienceYears: teacher.experience_years || 0,
          totalStudents: studentCount,
          joinedDate: teacher.joined_date ? new Date(teacher.joined_date).toDateString() : 'N/A',
          profileImage: userData?.avatar_url || null
        };
      }) || []);

      const totalStudentsAssigned = teachersWithDetails.reduce((sum, t) => sum + t.totalStudents, 0);
      const averageExperience = teachersWithDetails.length > 0 
        ? teachersWithDetails.reduce((sum, t) => sum + t.experienceYears, 0) / teachersWithDetails.length 
        : 0;

      return {
        teachers: teachersWithDetails,
        totalTeachers: teachersWithDetails.length,
        averageExperience: Math.round(averageExperience * 10) / 10,
        totalStudentsAssigned
      };

    } catch (error) {
      console.log('❌ Error getting teachers data:', error.message);
      throw error;
    }
  }

  async getStudentsData(adminUserId: string, classLevel?: string, limit = 50, offset = 0): Promise<StudentsResponseDto> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      let query = this.supabase
        .from('student_profiles')
        .select(`
          id,
          user_id,
          class_level,
          career_aspiration,
          users!student_profiles_user_id_fkey (full_name, avatar_url)
        `)
        .eq('school_id', schoolId);

      if (classLevel) {
        query = query.eq('class_level', classLevel);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: students, error } = await query;

      if (error) {
        console.log('❌ Error fetching students:', error.message);
        return { students: [], totalStudents: 0, averageGrade: 0, completionRate: 0 };
      }

      // Get detailed performance data for each student
      const studentsWithDetails = await Promise.all(students?.map(async (student) => {
        const [assignments, stemProjects, testResults] = await Promise.all([
          this.getStudentAssignmentStats(student.user_id),
          this.getStudentStemProjects(student.user_id),
          this.getStudentTestResults(student.user_id)
        ]);

        const userData = student.users as any;
        return {
          id: student.user_id,
          name: userData?.full_name || 'Unknown',
          classLevel: student.class_level || 'N/A',
          overallGrade: this.calculateOverallGrade(testResults.averageScore),
          averageScore: testResults.averageScore,
          completedAssignments: assignments.completed,
          totalAssignments: assignments.total,
          stemProjects: stemProjects,
          careerAspiration: student.career_aspiration || 'Not set',
          profileImage: userData?.avatar_url || null
        };
      }) || []);

      const totalScore = studentsWithDetails.reduce((sum, s) => sum + s.averageScore, 0);
      const averageGrade = studentsWithDetails.length > 0 ? totalScore / studentsWithDetails.length : 0;
      
      const totalCompleted = studentsWithDetails.reduce((sum, s) => sum + s.completedAssignments, 0);
      const totalAssignments = studentsWithDetails.reduce((sum, s) => sum + s.totalAssignments, 0);
      const completionRate = totalAssignments > 0 ? (totalCompleted / totalAssignments) * 100 : 0;

      return {
        students: studentsWithDetails,
        totalStudents: studentsWithDetails.length,
        averageGrade: Math.round(averageGrade * 10) / 10,
        completionRate: Math.round(completionRate * 10) / 10
      };

    } catch (error) {
      console.log('❌ Error getting students data:', error.message);
      throw error;
    }
  }
  // Announcement Management Methods
  async getAnnouncements(adminUserId: string, badgeType?: string, priority?: string, pinnedOnly?: boolean, limit = 20, offset = 0): Promise<AnnouncementDto[]> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      let query = this.supabase
        .from('announcements_with_author')
        .select('*')
        .or(`school_id.is.null,school_id.eq.${schoolId}`)
        .eq('is_active', true)
        .in('author_role', ['school_admin', 'teacher']) // School-level announcements
        .order('created_at', { ascending: false });

      if (badgeType) {
        query = query.eq('badge_type', badgeType);
      }

      if (priority) {
        query = query.eq('priority', priority);
      }

      if (pinnedOnly) {
        query = query.eq('is_pinned', true);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: announcements, error } = await query;

      if (error) {
        console.log('❌ Error fetching announcements:', error.message);
        return [];
      }

      return announcements?.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        badgeType: announcement.badge_type,
        badgeColor: announcement.badge_color,
        authorName: announcement.author_name,
        authorRole: announcement.author_role,
        priority: announcement.priority,
        isPinned: announcement.is_pinned,
        isNew: announcement.is_new,
        createdAt: announcement.created_at,
        metadata: announcement.metadata
      })) || [];

    } catch (error) {
      console.log('❌ Error getting announcements:', error.message);
      return [];
    }
  }

  async createAnnouncement(adminUserId: string, createAnnouncementDto: CreateAnnouncementDto): Promise<AnnouncementDto> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      // Validate target audience for school admin
      const validTargetAudience = ['teacher', 'student'];
      const invalidAudience = createAnnouncementDto.targetAudience.filter(
        role => !validTargetAudience.includes(role)
      );

      if (invalidAudience.length > 0) {
        throw new BadRequestException(`School admin cannot target: ${invalidAudience.join(', ')}`);
      }

      const { data: announcement, error } = await this.supabase
        .from('announcements')
        .insert({
          title: createAnnouncementDto.title,
          description: createAnnouncementDto.description,
          badge_type: createAnnouncementDto.badgeType,
          badge_color: createAnnouncementDto.badgeColor || '#6366f1',
          created_by: adminUserId,
          author_role: 'school_admin',
          target_audience: createAnnouncementDto.targetAudience,
          priority: createAnnouncementDto.priority,
          school_id: schoolId,
          class_level: createAnnouncementDto.classLevel || null,
          is_pinned: createAnnouncementDto.isPinned || false,
          starts_at: createAnnouncementDto.startsAt ? new Date(createAnnouncementDto.startsAt) : new Date(),
          expires_at: createAnnouncementDto.expiresAt ? new Date(createAnnouncementDto.expiresAt) : null,
          metadata: createAnnouncementDto.metadata || {}
        })
        .select(`
          *,
          users!announcements_created_by_fkey (full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.log('❌ Error creating announcement:', error.message);
        throw new BadRequestException('Failed to create announcement');
      }

      const userData = announcement.users as any;
      return {
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        badgeType: announcement.badge_type,
        badgeColor: announcement.badge_color,
        authorName: userData?.full_name || 'Unknown',
        authorRole: announcement.author_role,
        priority: announcement.priority,
        isPinned: announcement.is_pinned,
        isNew: true,
        createdAt: announcement.created_at,
        metadata: announcement.metadata
      };

    } catch (error) {
      console.log('❌ Error creating announcement:', error.message);
      throw error;
    }
  }

  async updateAnnouncement(adminUserId: string, announcementId: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<AnnouncementDto> {
    try {
      // Verify ownership
      const { data: existingAnnouncement, error: fetchError } = await this.supabase
        .from('announcements')
        .select('created_by')
        .eq('id', announcementId)
        .single();

      if (fetchError || !existingAnnouncement) {
        throw new NotFoundException('Announcement not found');
      }

      if (existingAnnouncement.created_by !== adminUserId) {
        throw new ForbiddenException('You can only update your own announcements');
      }

      // Validate target audience if provided
      if (updateAnnouncementDto.targetAudience) {
        const validTargetAudience = ['teacher', 'student'];
        const invalidAudience = updateAnnouncementDto.targetAudience.filter(
          role => !validTargetAudience.includes(role)
        );

        if (invalidAudience.length > 0) {
          throw new BadRequestException(`School admin cannot target: ${invalidAudience.join(', ')}`);
        }
      }

      const updateData: any = {};
      
      if (updateAnnouncementDto.title) updateData.title = updateAnnouncementDto.title;
      if (updateAnnouncementDto.description) updateData.description = updateAnnouncementDto.description;
      if (updateAnnouncementDto.badgeType) updateData.badge_type = updateAnnouncementDto.badgeType;
      if (updateAnnouncementDto.badgeColor) updateData.badge_color = updateAnnouncementDto.badgeColor;
      if (updateAnnouncementDto.targetAudience) updateData.target_audience = updateAnnouncementDto.targetAudience;
      if (updateAnnouncementDto.priority) updateData.priority = updateAnnouncementDto.priority;
      if (updateAnnouncementDto.classLevel !== undefined) updateData.class_level = updateAnnouncementDto.classLevel;
      if (updateAnnouncementDto.isPinned !== undefined) updateData.is_pinned = updateAnnouncementDto.isPinned;
      if (updateAnnouncementDto.startsAt) updateData.starts_at = new Date(updateAnnouncementDto.startsAt);
      if (updateAnnouncementDto.expiresAt !== undefined) {
        updateData.expires_at = updateAnnouncementDto.expiresAt ? new Date(updateAnnouncementDto.expiresAt) : null;
      }
      if (updateAnnouncementDto.metadata) updateData.metadata = updateAnnouncementDto.metadata;

      const { data: announcement, error } = await this.supabase
        .from('announcements')
        .update(updateData)
        .eq('id', announcementId)
        .select(`
          *,
          users!announcements_created_by_fkey (full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.log('❌ Error updating announcement:', error.message);
        throw new BadRequestException('Failed to update announcement');
      }

      const userData = announcement.users as any;
      return {
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        badgeType: announcement.badge_type,
        badgeColor: announcement.badge_color,
        authorName: userData?.full_name || 'Unknown',
        authorRole: announcement.author_role,
        priority: announcement.priority,
        isPinned: announcement.is_pinned,
        isNew: false,
        createdAt: announcement.created_at,
        metadata: announcement.metadata
      };

    } catch (error) {
      console.log('❌ Error updating announcement:', error.message);
      throw error;
    }
  }

  async deleteAnnouncement(adminUserId: string, announcementId: string) {
    try {
      // Verify ownership
      const { data: existingAnnouncement, error: fetchError } = await this.supabase
        .from('announcements')
        .select('created_by')
        .eq('id', announcementId)
        .single();

      if (fetchError || !existingAnnouncement) {
        throw new NotFoundException('Announcement not found');
      }

      if (existingAnnouncement.created_by !== adminUserId) {
        throw new ForbiddenException('You can only delete your own announcements');
      }

      const { error } = await this.supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) {
        console.log('❌ Error deleting announcement:', error.message);
        throw new BadRequestException('Failed to delete announcement');
      }

      return { message: 'Announcement deleted successfully' };

    } catch (error) {
      console.log('❌ Error deleting announcement:', error.message);
      throw error;
    }
  }

  async getHEIAnnouncements(adminUserId: string, limit = 10, offset = 0): Promise<AnnouncementDto[]> {
    try {
      // Get HEI partnership announcements that school admin can view
      let query = this.supabase
        .from('announcements_with_author')
        .select('*')
        .eq('is_active', true)
        .contains('target_audience', ['school_admin']) // Announcements targeting school admins
        .in('author_role', ['hei_admin', 'hei_mentor']) // From HEI roles
        .order('created_at', { ascending: false });

      query = query.range(offset, offset + limit - 1);

      const { data: announcements, error } = await query;

      if (error) {
        console.log('❌ Error fetching HEI announcements:', error.message);
        return [];
      }

      return announcements?.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        badgeType: announcement.badge_type,
        badgeColor: announcement.badge_color,
        authorName: announcement.author_name,
        authorRole: announcement.author_role,
        priority: announcement.priority,
        isPinned: announcement.is_pinned,
        isNew: announcement.is_new,
        createdAt: announcement.created_at,
        metadata: announcement.metadata
      })) || [];

    } catch (error) {
      console.log('❌ Error getting HEI announcements:', error.message);
      return [];
    }
  }

  // Analytics Methods
  async getAnalyticsOverview(adminUserId: string): Promise<AnalyticsOverviewDto> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      const [
        totalStudents,
        totalTeachers,
        classPerformance,
        averageAttendance
      ] = await Promise.all([
        this.getTotalStudentsCount(schoolId),
        this.getTotalTeachersCount(schoolId),
        this.getClassStats(schoolId),
        this.getAverageAttendance(schoolId)
      ]);

      const completionRate = classPerformance.length > 0 
        ? classPerformance.reduce((sum, cls) => sum + cls.completionRate, 0) / classPerformance.length
        : 0;

      return {
        totalStudents,
        totalTeachers,
        averageAttendance,
        completionRate: Math.round(completionRate),
        classPerformance
      };

    } catch (error) {
      console.log('❌ Error getting analytics overview:', error.message);
      throw error;
    }
  }

  async getStudentActivitiesAnalytics(adminUserId: string): Promise<StudentActivitiesAnalyticsDto> {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      // Get all students in the school
      const { data: students } = await this.supabase
        .from('student_profiles')
        .select('user_id')
        .eq('school_id', schoolId);

      if (!students || students.length === 0) {
        return {
          totalActivities: 0,
          participationRate: 0,
          topActivities: [],
          recentGrowth: 0
        };
      }

      const studentIds = students.map(s => s.user_id);

      // Get activity statistics
      const { data: activities } = await this.supabase
        .from('student_activities')
        .select('activity_type, created_at, student_id')
        .in('student_id', studentIds);

      if (!activities) {
        return {
          totalActivities: 0,
          participationRate: 0,
          topActivities: [],
          recentGrowth: 0
        };
      }

      // Calculate metrics
      const activeStudents = new Set(activities.map(a => a.student_id)).size;
      const participationRate = (activeStudents / students.length) * 100;

      // Get top activity types
      const activityTypes = activities.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topActivities = Object.entries(activityTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type);

      // Calculate recent growth (last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      const recentActivities = activities.filter(
        a => new Date(a.created_at) >= thirtyDaysAgo
      ).length;

      const previousActivities = activities.filter(
        a => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo
      ).length;

      const recentGrowth = previousActivities > 0 
        ? ((recentActivities - previousActivities) / previousActivities) * 100
        : 0;

      return {
        totalActivities: activities.length,
        participationRate: Math.round(participationRate),
        topActivities,
        recentGrowth: Math.round(recentGrowth)
      };

    } catch (error) {
      console.log('❌ Error getting student activities analytics:', error.message);
      return {
        totalActivities: 0,
        participationRate: 0,
        topActivities: [],
        recentGrowth: 0
      };
    }
  }

  // Additional endpoint methods
  async getStudentsCountByClass(adminUserId: string) {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      const { data: classData } = await this.supabase
        .from('student_profiles')
        .select('class_level')
        .eq('school_id', schoolId);

      if (!classData) return [];

      // Group by class level
      const classGroups = classData.reduce((acc, student) => {
        const classLevel = student.class_level || 'Unknown';
        acc[classLevel] = (acc[classLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(classGroups).map(([classLevel, count]) => ({
        classLevel,
        studentCount: count
      }));

    } catch (error) {
      console.log('❌ Error getting students count by class:', error.message);
      return [];
    }
  }

  async getTeachersStats(adminUserId: string) {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      const { data: teachers } = await this.supabase
        .from('teacher_profiles')
        .select('experience_years, subjects, classes')
        .eq('school_id', schoolId);

      if (!teachers || teachers.length === 0) {
        return {
          totalTeachers: 0,
          averageExperience: 0,
          totalSubjects: 0,
          totalClasses: 0
        };
      }

      const averageExperience = teachers.reduce((sum, t) => sum + (t.experience_years || 0), 0) / teachers.length;
      const allSubjects = new Set();
      const allClasses = new Set();

      teachers.forEach(teacher => {
        (teacher.subjects || []).forEach(subject => allSubjects.add(subject));
        (teacher.classes || []).forEach(cls => allClasses.add(cls));
      });

      return {
        totalTeachers: teachers.length,
        averageExperience: Math.round(averageExperience * 10) / 10,
        totalSubjects: allSubjects.size,
        totalClasses: allClasses.size
      };

    } catch (error) {
      console.log('❌ Error getting teachers stats:', error.message);
      return {
        totalTeachers: 0,
        averageExperience: 0,
        totalSubjects: 0,
        totalClasses: 0
      };
    }
  }

  async getTeachersStatsSummary(adminUserId: string) {
    try {
      const teachersResponse = await this.getTeachersData(adminUserId);
      
      return {
        totalTeachers: teachersResponse.totalTeachers,
        averageExperience: teachersResponse.averageExperience,
        totalStudentsAssigned: teachersResponse.totalStudentsAssigned,
        mostExperiencedTeacher: teachersResponse.teachers.reduce((max, teacher) => 
          teacher.experienceYears > max.experienceYears ? teacher : max, 
          teachersResponse.teachers[0] || null
        ),
        teachersBySubject: this.groupTeachersBySubject(teachersResponse.teachers)
      };

    } catch (error) {
      console.log('❌ Error getting teachers stats summary:', error.message);
      throw error;
    }
  }

  async getStudentsPerformanceSummary(adminUserId: string) {
    try {
      const studentsResponse = await this.getStudentsData(adminUserId);
      
      const gradeDistribution = studentsResponse.students.reduce((acc, student) => {
        acc[student.overallGrade] = (acc[student.overallGrade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPerformers = studentsResponse.students
        .filter(s => s.averageScore >= 85)
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 10);

      const lowPerformers = studentsResponse.students
        .filter(s => s.averageScore < 60)
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 10);

      return {
        totalStudents: studentsResponse.totalStudents,
        averageGrade: studentsResponse.averageGrade,
        completionRate: studentsResponse.completionRate,
        gradeDistribution,
        topPerformers,
        lowPerformers
      };

    } catch (error) {
      console.log('❌ Error getting students performance summary:', error.message);
      throw error;
    }
  }

  async getClassPerformanceAnalytics(adminUserId: string) {
    try {
      const classStats = await this.getClassStats(await this.getAdminSchoolId(adminUserId));
      
      return {
        classPerformance: classStats,
        bestPerformingClass: classStats.reduce((max, cls) => 
          cls.averageGrade > max.averageGrade ? cls : max, 
          classStats[0] || null
        ),
        mostCompletedClass: classStats.reduce((max, cls) => 
          cls.completionRate > max.completionRate ? cls : max, 
          classStats[0] || null
        ),
        overallTrends: {
          averagePerformance: classStats.reduce((sum, cls) => sum + cls.averageGrade, 0) / classStats.length || 0,
          averageCompletion: classStats.reduce((sum, cls) => sum + cls.completionRate, 0) / classStats.length || 0
        }
      };

    } catch (error) {
      console.log('❌ Error getting class performance analytics:', error.message);
      throw error;
    }
  }

    // Individual Detail Methods
  async getStudentDetails(adminUserId: string, studentId: string) {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      // Verify student belongs to admin's school
      const { data: student, error: studentError } = await this.supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', studentId)
        .eq('school_id', schoolId)
        .single();

      if (studentError || !student) {
        throw new ForbiddenException('Student not found or not in your school');
      }

      // Get comprehensive student data
      const [
        userData,
        assignmentStats,
        testResults,
        stemProjects,
        activities,
        hollandResults
      ] = await Promise.all([
        this.getUserData(studentId),
        this.getStudentAssignmentStats(studentId),
        this.getStudentTestResults(studentId),
        this.getStudentStemProjectDetails(studentId),
        this.getStudentActivities(studentId),
        this.getStudentHollandResults(studentId)
      ]);

      return {
        student: userData,
        profile: student,
        academic: {
          assignments: assignmentStats,
          testResults: testResults,
          overallGrade: this.calculateOverallGrade(testResults.averageScore),
          subjectPerformance: await this.getStudentSubjectPerformance(studentId)
        },
        stemProjects,
        activities,
        hollandResults,
        careerGuidance: await this.getStudentCareerGuidance(studentId)
      };

    } catch (error) {
      console.log('❌ Error getting student details:', error.message);
      throw error;
    }
  }

  async getTeacherDetails(adminUserId: string, teacherId: string) {
    try {
      const schoolId = await this.getAdminSchoolId(adminUserId);
      
      // Verify teacher belongs to admin's school
      const { data: teacher, error: teacherError } = await this.supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', teacherId)
        .eq('school_id', schoolId)
        .single();

      if (teacherError || !teacher) {
        throw new ForbiddenException('Teacher not found or not in your school');
      }

      // Get comprehensive teacher data
      const [
        userData,
        studentCount,
        assignments,
        classDetails,
        teacherPerformance
      ] = await Promise.all([
        this.getUserData(teacherId),
        this.getStudentCountForTeacher(teacherId),
        this.getTeacherAssignments(teacherId),
        this.getTeacherClassDetails(teacher.classes || []),
        this.getTeacherPerformanceMetrics(teacherId)
      ]);

      return {
        teacher: userData,
        profile: teacher,
        studentCount,
        assignments,
        classDetails,
        performance: teacherPerformance,
        professionalDetails: {
          qualification: teacher.qualification,
          experienceYears: teacher.experience_years,
          subjects: teacher.subjects,
          classes: teacher.classes,
          employeeId: teacher.employee_id,
          joinedDate: teacher.joined_date
        }
      };

    } catch (error) {
      console.log('❌ Error getting teacher details:', error.message);
      throw error;
    }
  }

  // Private Helper Methods
  private async getAdminSchoolId(adminUserId: string): Promise<string> {
    const { data: admin, error } = await this.supabase
      .from('school_admin_profiles')
      .select('school_id')
      .eq('user_id', adminUserId)
      .single();

    if (error || !admin) {
      throw new ForbiddenException('Admin profile not found or invalid permissions');
    }

    return admin.school_id;
  }

  private async getSchoolOverview(schoolId: string): Promise<SchoolOverviewDto> {
    const { data: school, error } = await this.supabase
      .from('schools')
      .select('name, location, district, total_students')
      .eq('id', schoolId)
      .single();

    if (error || !school) {
      throw new NotFoundException('School not found');
    }

    // Get actual counts
    const [studentCount, teacherCount] = await Promise.all([
      this.getTotalStudentsCount(schoolId),
      this.getTotalTeachersCount(schoolId)
    ]);

    return {
      schoolName: school.name,
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      location: school.location || 'N/A',
      district: school.district || 'N/A'
    };
  }

  private async getClassStats(schoolId: string): Promise<ClassStatsDto[]> {
    try {
      const { data: classData } = await this.supabase
        .from('student_profiles')
        .select('class_level, user_id')
        .eq('school_id', schoolId);

      if (!classData) return [];

      // Group by class level
      const classGroups = classData.reduce((acc, student) => {
        const classLevel = student.class_level || 'Unknown';
        if (!acc[classLevel]) {
          acc[classLevel] = [];
        }
        acc[classLevel].push(student.user_id);
        return acc;
      }, {} as Record<string, string[]>);

      // Calculate stats for each class
      const classStats = await Promise.all(
        Object.entries(classGroups).map(async ([classLevel, studentIds]) => {
          const [avgGrade, completionRate] = await Promise.all([
            this.getClassAverageGrade(studentIds),
            this.getClassCompletionRate(studentIds, classLevel)
          ]);

          return {
            classLevel,
            studentCount: studentIds.length,
            averageGrade: avgGrade,
            completionRate
          };
        })
      );

      return classStats;
    } catch (error) {
      console.log('❌ Error getting class stats:', error.message);
      return [];
    }
  }

  private async getActivityStats(schoolId: string): Promise<ActivityStatsDto> {
    try {
      // Get all students in the school
      const { data: students } = await this.supabase
        .from('student_profiles')
        .select('user_id')
        .eq('school_id', schoolId);

      if (!students || students.length === 0) {
        return {
          totalActivities: 0,
          recentActivities: 0,
          topActivityTypes: [],
          studentParticipation: 0
        };
      }

      const studentIds = students.map(s => s.user_id);

      // Get activity statistics
      const { data: activities } = await this.supabase
        .from('student_activities')
        .select('activity_type, created_at, student_id')
        .in('student_id', studentIds);

      if (!activities) return {
        totalActivities: 0,
        recentActivities: 0,
        topActivityTypes: [],
        studentParticipation: 0
      };

      // Calculate recent activities (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentActivities = activities.filter(
        a => new Date(a.created_at) >= thirtyDaysAgo
      ).length;

      // Get top activity types
      const activityTypes = activities.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topActivityTypes = Object.entries(activityTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type);

      // Calculate student participation rate
      const activeStudents = new Set(activities.map(a => a.student_id)).size;
      const participationRate = (activeStudents / students.length) * 100;

      return {
        totalActivities: activities.length,
        recentActivities,
        topActivityTypes,
        studentParticipation: Math.round(participationRate)
      };

    } catch (error) {
      console.log('❌ Error getting activity stats:', error.message);
      return {
        totalActivities: 0,
        recentActivities: 0,
        topActivityTypes: [],
        studentParticipation: 0
      };
    }
  }

  private async getSchoolAnnouncements(schoolId: string): Promise<AnnouncementDto[]> {
    try {
      const { data: announcements } = await this.supabase
        .from('announcements_with_author')
        .select('*')
        .eq('school_id', schoolId)
        .eq('is_active', true)
        .in('author_role', ['school_admin', 'teacher'])
        .order('created_at', { ascending: false })
        .limit(10);

      return announcements?.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        badgeType: announcement.badge_type,
        badgeColor: announcement.badge_color,
        authorName: announcement.author_name,
        authorRole: announcement.author_role,
        priority: announcement.priority,
        isPinned: announcement.is_pinned,
        isNew: announcement.is_new,
        createdAt: announcement.created_at,
        metadata: announcement.metadata
      })) || [];

    } catch (error) {
      console.log('❌ Error getting school announcements:', error.message);
      return [];
    }
  }

  // Utility Helper Methods
  private async getTotalStudentsCount(schoolId: string): Promise<number> {
    const { count } = await this.supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    return count || 0;
  }

  private async getTotalTeachersCount(schoolId: string): Promise<number> {
    const { count } = await this.supabase
      .from('teacher_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    return count || 0;
  }

  private async getStudentCountForTeacher(teacherId: string): Promise<number> {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('class_level')
      .eq('teacher_id', teacherId);

    if (!assignments || assignments.length === 0) return 0;

    const classLevels = [...new Set(assignments.map(a => a.class_level))];
    
    const { count } = await this.supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })
      .in('class_level', classLevels);

    return count || 0;
  }

  private async getStudentAssignmentStats(studentId: string) {
    const { data: profile } = await this.supabase
      .from('student_profiles')
      .select('class_level')
      .eq('user_id', studentId)
      .single();

    if (!profile) return { completed: 0, total: 0 };

    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('id')
      .eq('class_level', profile.class_level)
      .eq('is_active', true);

    const { data: submissions } = await this.supabase
      .from('assignment_submissions')
      .select('assignment_id')
      .eq('student_id', studentId);

    const completed = assignments?.filter(a => 
      submissions?.some(s => s.assignment_id === a.id)
    ).length || 0;

    return {
      completed,
      total: assignments?.length || 0
    };
  }

  private async getStudentStemProjects(studentId: string): Promise<number> {
    const { count } = await this.supabase
      .from('student_projects')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('project_type', 'STEM');

    return count || 0;
  }

  private async getStudentTestResults(studentId: string) {
    const { data: results } = await this.supabase
      .from('test_results')
      .select('score, percentage')
      .eq('student_id', studentId);

    if (!results || results.length === 0) {
      return { averageScore: 0, testCount: 0 };
    }

    const totalScore = results.reduce((sum, result) => sum + (result.percentage || 0), 0);
    const averageScore = totalScore / results.length;

    return {
      averageScore: Math.round(averageScore * 10) / 10,
      testCount: results.length
    };
  }

  private calculateOverallGrade(averageScore: number): string {
    if (averageScore >= 90) return 'A+';
    if (averageScore >= 80) return 'A';
    if (averageScore >= 70) return 'B';
    if (averageScore >= 60) return 'C';
    if (averageScore >= 50) return 'D';
    return 'F';
  }

  private async getClassAverageGrade(studentIds: string[]): Promise<number> {
    if (studentIds.length === 0) return 0;

    const grades = await Promise.all(
      studentIds.map(id => this.getStudentTestResults(id))
    );

    const totalScore = grades.reduce((sum, grade) => sum + grade.averageScore, 0);
    return Math.round((totalScore / grades.length) * 10) / 10;
  }

  private async getClassCompletionRate(studentIds: string[], classLevel: string): Promise<number> {
    if (studentIds.length === 0) return 0;

    const stats = await Promise.all(
      studentIds.map(id => this.getStudentAssignmentStats(id))
    );

    const totalCompleted = stats.reduce((sum, stat) => sum + stat.completed, 0);
    const totalAssignments = stats.reduce((sum, stat) => sum + stat.total, 0);

    return totalAssignments > 0 ? Math.round((totalCompleted / totalAssignments) * 100) : 0;
  }

  private async getUserData(userId: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log('❌ Error fetching user data:', error.message);
      return null;
    }

    return user;
  }

  private async getStudentStemProjectDetails(studentId: string) {
    const { data: projects } = await this.supabase
      .from('student_projects')
      .select('*')
      .eq('student_id', studentId)
      .eq('project_type', 'STEM');

    return projects || [];
  }

  private async getStudentActivities(studentId: string) {
    const { data: activities } = await this.supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(20);

    return activities || [];
  }

  private async getStudentHollandResults(studentId: string) {
    const { data: results } = await this.supabase
      .from('holland_test_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1);

    return results?.[0] || null;
  }

  private async getStudentSubjectPerformance(studentId: string) {
    const { data: results } = await this.supabase
      .from('test_results')
      .select('subject, percentage')
      .eq('student_id', studentId);

    if (!results) return {};

    const subjectPerformance = results.reduce((acc, result) => {
      const subject = result.subject || 'Unknown';
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(result.percentage);
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate average for each subject
    return Object.entries(subjectPerformance).reduce((acc, [subject, scores]) => {
      acc[subject] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return acc;
    }, {} as Record<string, number>);
  }

  private async getStudentCareerGuidance(studentId: string) {
    const { data: guidance } = await this.supabase
      .from('career_pathways')
      .select(`
        *,
        alternative_routes (*)
      `)
      .eq('student_id', studentId);

    return guidance || [];
  }

  private async getTeacherAssignments(teacherId: string) {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    return assignments || [];
  }

  private async getTeacherClassDetails(classes: string[]) {
    if (classes.length === 0) return [];

    const classDetails = await Promise.all(
      classes.map(async (classLevel) => {
        const { count: studentCount } = await this.supabase
          .from('student_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('class_level', classLevel);

        return {
          classLevel,
          studentCount: studentCount || 0
        };
      })
    );

    return classDetails;
  }

  private async getTeacherPerformanceMetrics(teacherId: string) {
    const [assignments, submissions] = await Promise.all([
      this.getTeacherAssignments(teacherId),
      this.getTeacherSubmissionStats(teacherId)
    ]);

    const activeAssignments = assignments.filter(a => a.is_active).length;
    const completedAssignments = assignments.filter(a => !a.is_active).length;

    return {
      totalAssignments: assignments.length,
      activeAssignments,
      completedAssignments,
      averageSubmissionRate: submissions.averageSubmissionRate,
      recentActivity: assignments.filter(a => 
        new Date(a.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    };
  }

  private async getTeacherSubmissionStats(teacherId: string) {
    const { data: assignments } = await this.supabase
      .from('assignments')
      .select('id, class_level')
      .eq('teacher_id', teacherId);

    if (!assignments || assignments.length === 0) {
      return { averageSubmissionRate: 0, totalSubmissions: 0 };
    }

    // Calculate submission rates for teacher's assignments
    const submissionStats = await Promise.all(
      assignments.map(async (assignment) => {
        const [totalStudents, submissions] = await Promise.all([
          this.getStudentsInClass(assignment.class_level),
          this.getAssignmentSubmissions(assignment.id)
        ]);

        return {
          assignmentId: assignment.id,
          totalStudents,
          submissions: submissions.length,
          submissionRate: totalStudents > 0 ? (submissions.length / totalStudents) * 100 : 0
        };
      })
    );

    const averageSubmissionRate = submissionStats.length > 0
      ? submissionStats.reduce((sum, stat) => sum + stat.submissionRate, 0) / submissionStats.length
      : 0;

    const totalSubmissions = submissionStats.reduce((sum, stat) => sum + stat.submissions, 0);

    return {
      averageSubmissionRate: Math.round(averageSubmissionRate),
      totalSubmissions
    };
  }

  private async getStudentsInClass(classLevel: string): Promise<number> {
    const { count } = await this.supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('class_level', classLevel);

    return count || 0;
  }

  private async getAssignmentSubmissions(assignmentId: string) {
    const { data: submissions } = await this.supabase
      .from('assignment_submissions')
      .select('id')
      .eq('assignment_id', assignmentId);

    return submissions || [];
  }

  private async getAverageAttendance(schoolId: string): Promise<number> {
    // This would need an attendance table - for now return a placeholder
    // You can implement this when you have attendance tracking
    return 85; // Placeholder average attendance
  }

  private groupTeachersBySubject(teachers: TeacherSummaryDto[]) {
    return teachers.reduce((acc, teacher) => {
      teacher.subjects.forEach(subject => {
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push({
          name: teacher.name,
          experience: teacher.experienceYears,
          students: teacher.totalStudents
        });
      });
      return acc;
    }, {} as Record<string, any[]>);
  }
}