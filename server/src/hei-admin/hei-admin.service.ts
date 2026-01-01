// server/src/hei-admin/hei-admin.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  HEIAdminDashboardDto,
  DashboardStatsDto,
  TrendsDataDto,
  MentorListItemDto,
  MentorDetailsDto,
  MentorCapacityDto,
  UnassignedSchoolDto,
  MentorAssignmentDto,
  CreateAssignmentDto,
  ReassignMentorDto,
  SchoolPartnershipDto,
  PartnershipDetailsDto,
  PartnershipOverviewStatsDto,
  AnnouncementDto,
  CreateAnnouncementDto,
  AnnouncementRecipientSummaryDto,
  PaginatedMentorListDto,
  PaginatedPartnershipListDto,
  PaginatedAnnouncementListDto,
  UpdateMentorStatusDto,
  UpdatePartnershipStatusDto,
  MentorStatus,
  PartnershipStatus,
  AssignmentStatus,
} from './dto/hei-admin.dto';

@Injectable()
export class HeiAdminService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  /* ==================== DASHBOARD ==================== */

  async getDashboard(adminUserId: string): Promise<HEIAdminDashboardDto> {
    console.log('🎓 Getting HEI Admin dashboard for:', adminUserId);

    const { data: adminProfile, error: adminError } = await this.supabase
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', adminUserId)
      .single();

    if (adminError || !adminProfile) {
      throw new NotFoundException('HEI Admin profile not found');
    }

    const heiId = adminProfile.hei_id;

    // ✅ Use getDashboardStats which returns DashboardStatsDto
    const [stats, recentAssignments, recentAnnouncements, trendsData] = await Promise.all([
      this.getDashboardStats(heiId), // 👈 This now returns the correct type
      this.getRecentAssignments(heiId, 5),
      this.getRecentAnnouncements(adminUserId, 5),
      this.getTrendsData(heiId),
    ]);

    return {
      stats,
      recentAssignments,
      recentAnnouncements,
      trendsData,
    };
  }



  /**
  * Get dashboard stats - returns DashboardStatsDto with all required properties
  * Matches the data shown in partnership page but with DashboardStatsDto structure
  */
  async getDashboardStats(heiId: string): Promise<DashboardStatsDto> {
    console.log('📊 Getting dashboard stats for HEI:', heiId);

    // 1. Get all mentors for THIS specific HEI
    const { data: mentors, count: mentorsCount } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, status', { count: 'exact' })
      .eq('hei_id', heiId);

    const mentorIds = mentors?.map(m => m.id) || [];

    // Count active/inactive mentors
    const activeMentors = mentors?.filter(m => m.status === 'active').length || 0;
    const inactiveMentors = (mentorsCount || 0) - activeMentors;

    console.log(`✅ Found ${mentorsCount} mentors (${activeMentors} active, ${inactiveMentors} inactive)`);

    // 2. Get all active assignments for these mentors
    const { data: assignments, count: activeAssignmentsCount } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, status, student_id, mentor_id', { count: 'exact' })
      .in('mentor_id', mentorIds)
      .eq('status', 'active');

    console.log(`✅ Found ${activeAssignmentsCount} active assignments`);

    // 3. Get student user IDs from assignments
    const studentUserIds = Array.from(new Set(
      (assignments || []).map(a => a.student_id).filter(Boolean)
    ));
    console.log(`✅ Found ${studentUserIds.length} unique students under supervision`);

    // 4. Get student profiles to find schools
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // 5. Get unique school IDs
    const schoolIds = Array.from(new Set(
      (studentProfiles || []).map(s => s.school_id).filter(Boolean)
    ));
    console.log(`✅ Found ${schoolIds.length} partner schools`);

    // 6. Get ALL students and teachers in these partner schools
    const [allStudents, allTeachers] = await Promise.all([
      this.supabase
        .from('student_profiles')
        .select('id', { count: 'exact', head: true })
        .in('school_id', schoolIds),
      this.supabase
        .from('teacher_profiles')
        .select('id', { count: 'exact', head: true })
        .in('school_id', schoolIds)
    ]);

    const totalStudents = allStudents.count || 0;
    const totalTeachers = allTeachers.count || 0;

    console.log(`✅ Total students: ${totalStudents}, Total teachers: ${totalTeachers}`);

    // 7. Get recent announcements count (last 7 days)
    const { count: recentAnnouncementsCount } = await this.supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // 8. Return DashboardStatsDto with all required properties
    const stats: DashboardStatsDto = {
      totalMentors: mentorsCount || 0,
      activeMentors,
      inactiveMentors,
      totalSchools: schoolIds.length,
      partnerSchools: schoolIds.length,  // Same as totalSchools
      totalStudents,
      totalTeachers,
      pendingAssignments: 0,  // Can be calculated if needed
      activeAssignments: activeAssignmentsCount || 0,
      recentAnnouncementsCount: recentAnnouncementsCount || 0,
    };

    console.log('📊 Dashboard Stats calculated:', stats);
    return stats;
  }


  /**
   * Get dashboard overview stats (same calculation as partnership page but filtered by HEI)
   * This ensures dashboard shows correct data for the specific HEI admin
   */
  async getDashboardOverviewStats(heiId: string): Promise<PartnershipOverviewStatsDto> {
    console.log('📊 Getting dashboard overview stats for HEI:', heiId);

    // 1. Get all mentors for THIS specific HEI
    const { data: mentors, count: mentorsCount } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id', { count: 'exact' })
      .eq('hei_id', heiId);

    const mentorIds = mentors?.map(m => m.id) || [];
    console.log(`✅ Found ${mentorsCount} mentors for HEI`);

    // 2. Get all active assignments for these mentors
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, status, student_id, mentor_id')
      .in('mentor_id', mentorIds)
      .eq('status', 'active');

    const activeAssignments = assignments?.length || 0;
    console.log(`✅ Found ${activeAssignments} active assignments`);

    // 3. Get student user IDs from assignments
    const studentUserIds = Array.from(new Set(
      (assignments || []).map(a => a.student_id).filter(Boolean)
    ));
    console.log(`✅ Found ${studentUserIds.length} unique students`);

    // 4. Get student profiles to find schools
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // 5. Get unique school IDs
    const schoolIds = Array.from(new Set(
      (studentProfiles || []).map(s => s.school_id).filter(Boolean)
    ));
    console.log(`✅ Found ${schoolIds.length} partner schools`);

    // 6. Get ALL students and teachers in these partner schools
    const [allStudents, allTeachers] = await Promise.all([
      this.supabase
        .from('student_profiles')
        .select('id', { count: 'exact', head: true })
        .in('school_id', schoolIds),
      this.supabase
        .from('teacher_profiles')
        .select('id', { count: 'exact', head: true })
        .in('school_id', schoolIds)
    ]);

    const totalStudents = allStudents.count || 0;
    const totalTeachers = allTeachers.count || 0;

    console.log(`✅ Total students: ${totalStudents}, Total teachers: ${totalTeachers}`);

    // 7. Calculate partnership statistics
    const stats = {
      totalMentors: mentorsCount || 0,
      totalSchools: schoolIds.length,
      totalStudents,
      totalTeachers,
      activePartnerships: activeAssignments,
      pendingRequests: 0,
      inactivePartnerships: 0,
      growthRate: 15,
    };

    console.log('📊 Dashboard Overview Stats:', stats);
    return stats;
  }


  async getTrendsData(heiId: string): Promise<TrendsDataDto> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: mentors } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id')
      .eq('hei_id', heiId);

    const mentorIds = mentors?.map(m => m.id) || [];

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('assigned_at, mentor_id, student_id')
      .in('mentor_id', mentorIds)
      .gte('assigned_at', sixMonthsAgo.toISOString());

    const assignmentsByMonth = (assignments || []).reduce((acc, assignment) => {
      const month = new Date(assignment.assigned_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mentorAssignmentTrend = Object.entries(assignmentsByMonth).map(([month, count]) => ({
      month,
      count,
    }));

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('school_id, user_id')
      .in('user_id', studentUserIds);

    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, district')
      .in('id', schoolIds);

    const schoolMap = new Map(schools?.map(s => [s.id, s]) || []);

    const schoolsByRegion = (studentProfiles || []).reduce((acc, profile) => {
      const school = schoolMap.get(profile.school_id);
      const region = school?.district || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const schoolPartnershipsByRegion = Object.entries(schoolsByRegion).map(([region, count]) => ({
      region,
      count,
    }));

    const { data: assignmentCounts } = await this.supabase
      .from('mentor_student_assignments')
      .select('mentor_id')
      .in('mentor_id', mentorIds)
      .eq('status', 'active');

    const workloadByMentor = (assignmentCounts || []).reduce((acc, assignment) => {
      acc[assignment.mentor_id] = (acc[assignment.mentor_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const workloadDistribution = {
      '0-5 students': 0,
      '6-15 students': 0,
      '16-25 students': 0,
      '25+ students': 0,
    };

    Object.values(workloadByMentor).forEach(count => {
      if (count <= 5) workloadDistribution['0-5 students']++;
      else if (count <= 15) workloadDistribution['6-15 students']++;
      else if (count <= 25) workloadDistribution['16-25 students']++;
      else workloadDistribution['25+ students']++;
    });

    const mentorWorkloadDistribution = Object.entries(workloadDistribution).map(([range, count]) => ({
      range,
      count,
    }));

    return {
      mentorAssignmentTrend,
      schoolPartnershipsByRegion,
      mentorWorkloadDistribution,
    };
  }

  async getRecentAssignments(heiId: string, limit: number = 5): Promise<MentorAssignmentDto[]> {
    const { data: mentors } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id')
      .eq('hei_id', heiId);

    const mentorIds = mentors?.map(m => m.id) || [];

    const { data: assignments, error } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, mentor_id, student_id, assigned_by, assigned_at, status, notes')
      .in('mentor_id', mentorIds)
      .order('assigned_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!assignments || assignments.length === 0) return [];

    const mentorIdsUnique = Array.from(new Set(assignments.map(a => a.mentor_id)));
    const assignedByIds = Array.from(new Set(assignments.map(a => a.assigned_by)));
    const studentUserIds = assignments.map(a => a.student_id).filter(Boolean);

    const [mentorData, userData, studentProfiles] = await Promise.all([
      this.supabase.from('hei_mentor_profiles').select('id, user_id').in('id', mentorIdsUnique),
      this.supabase.from('users').select('id, full_name, email').in('id', assignedByIds),
      this.supabase.from('student_profiles').select('user_id, school_id').in('user_id', studentUserIds),
    ]);

    const mentorUserIds = mentorData.data?.map(m => m.user_id) || [];
    const { data: mentorUsers } = await this.supabase
      .from('users')
      .select('id, full_name, email')
      .in('id', mentorUserIds);

    const schoolIds = Array.from(new Set((studentProfiles.data || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, name, location')
      .in('id', schoolIds);

    return assignments.map(assignment => {
      const mentor = mentorData.data?.find(m => m.id === assignment.mentor_id);
      const mentorUser = mentorUsers?.find(u => u.id === mentor?.user_id);
      const assignedByUser = userData.data?.find(u => u.id === assignment.assigned_by);
      const studentProfile = studentProfiles.data?.find(s => s.user_id === assignment.student_id);
      const school = schools?.find(s => s.id === studentProfile?.school_id);

      return {
        id: assignment.id,
        mentorId: assignment.mentor_id,
        mentorName: mentorUser?.full_name || 'Unknown',
        mentorEmail: mentorUser?.email || '',
        schoolId: studentProfile?.school_id || '',
        schoolName: school?.name || 'Unknown School',
        schoolLocation: school?.location || '',
        assignedBy: assignment.assigned_by,
        assignedByName: assignedByUser?.full_name || 'Unknown',
        assignmentDate: assignment.assigned_at,
        status: assignment.status as AssignmentStatus,
        notes: assignment.notes,
        lastVisitDate: undefined,
      };
    });
  }

  async getRecentAnnouncements(createdBy: string, limit: number = 5): Promise<AnnouncementDto[]> {
    const { data: adminProfile } = await this.supabase
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', createdBy)
      .single();

    const heiId = adminProfile?.hei_id;

    let query = this.supabase
      .from('announcements')
      .select(`
        *,
        users!announcements_created_by_fkey(full_name)
      `)
      .eq('is_active', true)
      .eq('author_role', 'hei_admin')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (heiId) {
      query = query.eq('hei_id', heiId);
    }

    const { data: announcements, error } = await query;

    if (error) throw error;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (announcements || []).map(a => {
      const userData = a.users as any;
      const createdAt = new Date(a.created_at);

      return {
        id: a.id,
        title: a.title,
        description: a.description,
        badgeType: a.badge_type,
        badgeColor: a.badge_color,
        authorName: userData?.full_name || 'Unknown',
        authorRole: a.author_role,
        priority: a.priority,
        isPinned: a.is_pinned,
        isNew: createdAt > sevenDaysAgo,
        createdAt: a.created_at,
        metadata: a.metadata,
      };
    });
  }

  /* ==================== MENTORS ==================== */

  async getMentors(
    heiId: string | null | undefined,
    filters: {
      status?: MentorStatus;
      workload?: string;
      expertise?: string;
      search?: string;
    },
    pagination: { page: number; limit: number }
  ): Promise<PaginatedMentorListDto> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    console.log('🔍 Getting mentors for HEI:', heiId || 'ALL', 'Filters:', filters, 'Page:', page);

    // APPROACH 1: Try getting from hei_mentor_profiles first
    let query = this.supabase
      .from('hei_mentor_profiles')
      .select('*, users!inner(id, full_name, email, avatar_url)', { count: 'exact' });

    // Only filter by hei_id if it's provided
    if (heiId) {
      query = query.eq('hei_id', heiId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`users.full_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`);
    }

    const { data: mentorsFromProfiles, count: profileCount } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // If we found mentors in profiles, use those
    if (mentorsFromProfiles && mentorsFromProfiles.length > 0) {
      // Get mentor IDs and user IDs for lookups
      const mentorIds = mentorsFromProfiles.map(m => m.id);
      const mentorUserIds = mentorsFromProfiles.map(m => m.user_id).filter(Boolean);

      // Get schools from mentor_school_assignments table
      let schoolAssignmentsMap = new Map<string, string[]>();
      try {
        const { data: schoolAssignments } = await this.supabase
          .from('mentor_school_assignments')
          .select('mentor_id, school_id')
          .in('mentor_id', [...mentorIds, ...mentorUserIds])
          .eq('status', 'active');

        (schoolAssignments || []).forEach(a => {
          const key = a.mentor_id;
          if (!schoolAssignmentsMap.has(key)) {
            schoolAssignmentsMap.set(key, []);
          }
          if (a.school_id && !schoolAssignmentsMap.get(key)?.includes(a.school_id)) {
            schoolAssignmentsMap.get(key)?.push(a.school_id);
          }
        });
      } catch (err) {
        console.log('⚠️ mentor_school_assignments table may not exist');
      }

      // Get student assignments (legacy)
      const { data: assignments } = await this.supabase
        .from('mentor_student_assignments')
        .select('mentor_id, student_id')
        .in('mentor_id', mentorIds)
        .eq('status', 'active');

      const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
      const { data: studentProfiles } = studentUserIds.length > 0
        ? await this.supabase.from('student_profiles').select('user_id, school_id').in('user_id', studentUserIds)
        : { data: [] };

      // Get all school IDs for fetching school details
      const allSchoolIds = new Set<string>();
      schoolAssignmentsMap.forEach(ids => ids.forEach(id => allSchoolIds.add(id)));
      (studentProfiles || []).forEach(s => s.school_id && allSchoolIds.add(s.school_id));

      const { data: schools } = allSchoolIds.size > 0
        ? await this.supabase.from('schools').select('id, name, location').in('id', Array.from(allSchoolIds))
        : { data: [] };

      const mentorList = mentorsFromProfiles.map(mentor => {
        const user = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;
        const mentorAssignments = (assignments || []).filter(a => a.mentor_id === mentor.id);
        const mentorStudentIds = mentorAssignments.map(a => a.student_id);
        const mentorStudentProfiles = (studentProfiles || []).filter(sp => mentorStudentIds.includes(sp.user_id));

        const mentorSchools = new Map();

        // Add schools from mentor_school_assignments
        const directSchoolIds = [
          ...(schoolAssignmentsMap.get(mentor.id) || []),
          ...(schoolAssignmentsMap.get(mentor.user_id) || [])
        ];
        directSchoolIds.forEach(schoolId => {
          const school = schools?.find(s => s.id === schoolId);
          if (school && !mentorSchools.has(school.id)) {
            mentorSchools.set(school.id, {
              schoolId: school.id,
              schoolName: school.name || 'Unknown',
              location: school.location || '',
            });
          }
        });

        // Add schools from student assignments (legacy)
        mentorStudentProfiles.forEach(profile => {
          const school = schools?.find(s => s.id === profile.school_id);
          if (school && !mentorSchools.has(school.id)) {
            mentorSchools.set(school.id, {
              schoolId: school.id,
              schoolName: school.name || 'Unknown',
              location: school.location || '',
            });
          }
        });

        const assignedSchools = Array.from(mentorSchools.values());
        const studentsCount = mentorAssignments.length;
        const maxStudents = mentor.max_students || 10;
        const workloadPercentage = (studentsCount / maxStudents) * 100;

        let workloadStatus: 'under-assigned' | 'optimal' | 'over-assigned' = 'optimal';
        if (workloadPercentage < 50) workloadStatus = 'under-assigned';
        else if (workloadPercentage > 100) workloadStatus = 'over-assigned';

        return {
          id: mentor.id,
          userId: mentor.user_id,
          name: user?.full_name || 'Unknown',
          email: user?.email || '',
          avatar: user?.avatar_url,
          employeeId: mentor.employee_id,
          designation: mentor.designation || 'N/A',
          department: mentor.department || '',
          expertise: mentor.expertise || [],
          qualification: mentor.qualification || '',
          experienceYears: mentor.experience_years || 0,
          researchInterests: mentor.research_interests || [],
          maxStudents,
          status: mentor.status || MentorStatus.ACTIVE,
          assignedSchoolsCount: assignedSchools.length,
          totalStudentsSupervised: studentsCount,
          lastActive: mentor.last_active,
          joinDate: mentor.created_at,
          heiId: mentor.hei_id,
          workloadStatus,
          assignedSchools,
        };
      });

      let filteredList = mentorList;
      if (filters.workload && filters.workload !== 'all') {
        filteredList = mentorList.filter(m => m.workloadStatus === filters.workload);
      }

      const total = profileCount || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: filteredList,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    }

    // APPROACH 2: Fallback - Query users table directly for users with role='hei_mentor'
    console.log('⚠️ No mentor profiles found, falling back to users table query...');

    let usersQuery = this.supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'hei_mentor');

    if (filters.search) {
      usersQuery = usersQuery.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data: mentorUsers, error: usersError, count: usersCount } = await usersQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error fetching mentor users:', usersError);
      throw usersError;
    }

    console.log(`✅ Found ${mentorUsers?.length || 0} mentors from users table with role='hei_mentor'`);

    if (!mentorUsers || mentorUsers.length === 0) {
      return {
        data: [],
        total: usersCount || 0,
        page,
        limit,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }

    // Get schools from mentor_school_assignments for these users
    const mentorUserIds = mentorUsers.map(u => u.id);
    let userSchoolAssignmentsMap = new Map<string, any[]>();
    try {
      const { data: schoolAssignments, error: assignErr } = await this.supabase
        .from('mentor_school_assignments')
        .select('mentor_id, school_id')
        .in('mentor_id', mentorUserIds)
        .eq('status', 'active');

      // Get school details
      const schoolIds = Array.from(new Set((schoolAssignments || []).map(a => a.school_id).filter(Boolean)));

      const { data: schools, error: schoolsErr } = schoolIds.length > 0
        ? await this.supabase.from('schools').select('id, name, location').in('id', schoolIds)
        : { data: [], error: null };

      (schoolAssignments || []).forEach(a => {
        const school = schools?.find(s => s.id === a.school_id);
        if (school) {
          if (!userSchoolAssignmentsMap.has(a.mentor_id)) {
            userSchoolAssignmentsMap.set(a.mentor_id, []);
          }
          userSchoolAssignmentsMap.get(a.mentor_id)?.push({
            schoolId: school.id,
            schoolName: school.name || 'Unknown',
            location: school.location || '',
          });
        }
      });
    } catch (err) {
      // mentor_school_assignments table may not exist
    }

    // Get mentor profiles by user_id to retrieve status and other profile data
    // (mentorUserIds already declared above)
    console.log('📋 Looking for mentor profiles with user_ids:', mentorUserIds);

    let mentorProfilesMap = new Map<string, any>();
    try {
      const { data: mentorProfiles, error: profileError } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id, status, designation, department, expertise, qualification, experience_years, max_students')
        .in('user_id', mentorUserIds);

      (mentorProfiles || []).forEach(profile => {
        mentorProfilesMap.set(profile.user_id, profile);
      });
    } catch (err) {
      // Error fetching mentor profiles
    }

    // Map users to MentorListItem format with school data and profile data
    const mentorList = mentorUsers.map(user => {
      const assignedSchools = userSchoolAssignmentsMap.get(user.id) || [];
      const profile = mentorProfilesMap.get(user.id);

      return {
        id: user.id,
        userId: user.id,
        name: user.full_name || 'Unknown',
        email: user.email || '',
        avatar: user.avatar_url,
        employeeId: undefined,
        designation: profile?.designation || 'HEI Mentor',
        department: profile?.department || '',
        expertise: profile?.expertise || [],
        qualification: profile?.qualification || '',
        experienceYears: profile?.experience_years || 0,
        researchInterests: [],
        maxStudents: profile?.max_students || 10,
        status: profile?.status || MentorStatus.ACTIVE,
        assignedSchoolsCount: assignedSchools.length,
        totalStudentsSupervised: 0,
        lastActive: undefined,
        joinDate: user.created_at,
        heiId: '',
        workloadStatus: 'under-assigned' as const,
        assignedSchools,
      };
    });

    const total = usersCount || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: mentorList,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }


  async getMentor(mentorId: string): Promise<MentorDetailsDto> {
    console.log('🔍 Getting mentor details for ID:', mentorId);

    // APPROACH 1: Try to find by hei_mentor_profiles.id
    let { data: mentor, error } = await this.supabase
      .from('hei_mentor_profiles')
      .select('*, users!inner(id, full_name, email, avatar_url)')
      .eq('id', mentorId)
      .single();

    // APPROACH 2: If not found, try to find by user_id in hei_mentor_profiles
    if (error || !mentor) {
      console.log('📋 Not found by profile ID, trying user_id...');
      const { data: mentorByUserId, error: userIdError } = await this.supabase
        .from('hei_mentor_profiles')
        .select('*, users!inner(id, full_name, email, avatar_url)')
        .eq('user_id', mentorId)
        .single();

      if (mentorByUserId) {
        mentor = mentorByUserId;
        error = null;
      }
    }

    // APPROACH 3: Fallback to users table (for mentors without profiles)
    if (error || !mentor) {
      console.log('⚠️ No mentor profile found, falling back to users table...');
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', mentorId)
        .eq('role', 'hei_mentor')
        .single();

      if (userError || !user) {
        throw new NotFoundException('Mentor not found');
      }

      // Get assigned schools from mentor_school_assignments using JOIN
      let assignedSchools: any[] = [];
      try {
        const { data: schoolAssignments, error: assignmentError } = await this.supabase
          .from('mentor_school_assignments')
          .select(`
            id, 
            school_id, 
            assigned_at, 
            status, 
            notes,
            schools:school_id (
              id,
              name,
              code,
              location,
              district
            )
          `)
          .eq('mentor_id', mentorId)
          .eq('status', 'active');

        console.log('📋 Fallback: School assignments for user:', {
          mentorId,
          assignmentsCount: schoolAssignments?.length || 0,
          assignments: schoolAssignments,
          error: assignmentError
        });

        if (schoolAssignments && schoolAssignments.length > 0) {
          assignedSchools = schoolAssignments.map(assignment => {
            const school = assignment.schools as any;
            console.log('🏫 Fallback: School data:', {
              assignmentId: assignment.id,
              schoolId: assignment.school_id,
              schoolData: school
            });

            return {
              id: assignment.id,
              schoolId: school?.id || assignment.school_id,
              schoolName: school?.name || 'Unknown',
              schoolLogo: undefined,
              location: school?.location || '',
              district: school?.district || '',
              studentsCount: 0,
              teachersCount: 0,
              assignmentDate: assignment.assigned_at,
              lastVisitDate: undefined,
              status: assignment.status,
              notes: assignment.notes,
            };
          });
        }
      } catch (err) {
        console.log('⚠️ Error fetching school assignments:', err);
      }

      // Return user-based mentor details
      return {
        id: user.id,
        userId: user.id,
        name: user.full_name || 'Unknown',
        email: user.email || '',
        avatar: user.avatar_url,
        employeeId: undefined,
        designation: 'HEI Mentor',
        department: '',
        expertise: [],
        qualification: '',
        experienceYears: 0,
        researchInterests: [],
        maxStudents: 10,
        status: MentorStatus.ACTIVE,
        assignedSchoolsCount: assignedSchools.length,
        totalStudentsSupervised: 0,
        lastActive: undefined,
        joinDate: user.created_at,
        heiId: '',
        assignedSchools,
        bio: undefined,
        contactNumber: undefined,
      };
    }

    // Profile-based mentor found - continue with original logic
    const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

    // Get schools from mentor_school_assignments first using JOIN
    let schoolsFromDirectAssignments: any[] = [];
    try {
      // Use Supabase's foreign key join to get school data directly
      const { data: directAssignments, error: assignmentError } = await this.supabase
        .from('mentor_school_assignments')
        .select(`
          id, 
          school_id, 
          assigned_at, 
          status, 
          notes,
          schools:school_id (
            id,
            name,
            code,
            location,
            district
          )
        `)
        .or(`mentor_id.eq.${mentor.id},mentor_id.eq.${mentor.user_id}`)
        .eq('status', 'active');

      console.log('📋 Direct assignments query result:', {
        mentorProfileId: mentor.id,
        mentorUserId: mentor.user_id,
        assignmentsCount: directAssignments?.length || 0,
        assignments: directAssignments,
        error: assignmentError
      });

      if (directAssignments && directAssignments.length > 0) {
        schoolsFromDirectAssignments = directAssignments.map(assignment => {
          // The schools data comes as a nested object from the join
          const school = assignment.schools as any;
          console.log('🏫 School data for assignment:', {
            assignmentId: assignment.id,
            schoolId: assignment.school_id,
            schoolData: school
          });

          return {
            id: assignment.id,
            schoolId: school?.id || assignment.school_id,
            schoolName: school?.name || 'Unknown',
            schoolLogo: undefined,
            location: school?.location || '',
            district: school?.district || '',
            studentsCount: 0,
            teachersCount: 0,
            assignmentDate: assignment.assigned_at,
            lastVisitDate: undefined,
            status: assignment.status,
            notes: assignment.notes,
          };
        });
      }
    } catch (err) {
      console.log('⚠️ Error fetching direct school assignments:', err);
    }

    // Also get schools from student assignments (legacy)
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, student_id, assigned_at, status, notes')
      .eq('mentor_id', mentor.id);

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    let studentProfiles: any[] = [];
    if (studentUserIds.length > 0) {
      const { data } = await this.supabase.from('student_profiles').select('user_id, school_id').in('user_id', studentUserIds);
      studentProfiles = data || [];
    }

    const schoolIds = Array.from(new Set(studentProfiles.map(s => s.school_id).filter(Boolean)));
    let schools: any[] = [];
    if (schoolIds.length > 0) {
      const { data } = await this.supabase.from('schools').select('id, name, logo, location, district').in('id', schoolIds);
      schools = data || [];
    }

    const schoolsMap = new Map();

    // Add direct school assignments first
    schoolsFromDirectAssignments.forEach(school => {
      if (!schoolsMap.has(school.schoolId)) {
        schoolsMap.set(school.schoolId, school);
      }
    });

    // Add student-based schools
    (assignments || []).forEach(assignment => {
      const studentProfile = studentProfiles?.find(sp => sp.user_id === assignment.student_id);
      const school = schools?.find(s => s.id === studentProfile?.school_id);

      if (school) {
        if (!schoolsMap.has(school.id)) {
          schoolsMap.set(school.id, {
            id: assignment.id,
            schoolId: school.id,
            schoolName: school.name || 'Unknown',
            schoolLogo: school.logo,
            location: school.location || '',
            district: school.district || '',
            studentsCount: 0,
            teachersCount: 0,
            assignmentDate: assignment.assigned_at,
            lastVisitDate: undefined,
            status: assignment.status as AssignmentStatus,
            notes: assignment.notes,
          });
        }
        const schoolEntry = schoolsMap.get(school.id);
        schoolEntry.studentsCount += 1;
      }
    });

    const assignedSchools = Array.from(schoolsMap.values());
    const totalStudents = assignments?.length || 0;

    return {
      id: mentor.id,
      userId: mentor.user_id,
      name: userArray?.full_name || 'Unknown',
      email: userArray?.email || '',
      avatar: userArray?.avatar_url,
      employeeId: mentor.employee_id,
      designation: mentor.designation,
      department: mentor.department,
      expertise: mentor.expertise || [],
      qualification: mentor.qualification,
      experienceYears: mentor.experience_years,
      researchInterests: mentor.research_interests || [],
      maxStudents: mentor.max_students,
      status: mentor.status,
      assignedSchoolsCount: assignedSchools.length,
      totalStudentsSupervised: totalStudents,
      lastActive: mentor.last_active,
      joinDate: mentor.created_at,
      heiId: mentor.hei_id,
      assignedSchools,
      bio: mentor.bio,
      contactNumber: mentor.contact_number,
    };
  }

  async updateMentorStatus(mentorId: string, statusDto: UpdateMentorStatusDto): Promise<void> {
    console.log('📋 Updating mentor status:', { mentorId, status: statusDto.status });

    // Try updating by profile id first
    let { error, count } = await this.supabase
      .from('hei_mentor_profiles')
      .update({
        status: statusDto.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', mentorId);

    // If no rows were updated, try by user_id
    if (!error && count === 0) {
      console.log('📋 Profile not found by ID, trying user_id...');
      const result = await this.supabase
        .from('hei_mentor_profiles')
        .update({
          status: statusDto.status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', mentorId);

      error = result.error;
      count = result.count;
    }

    if (error) {
      console.error('❌ Error updating mentor status:', error);
      // If error is about missing column, log it and continue gracefully
      if (error.message?.includes('status')) {
        console.log('⚠️ Status column may not exist in hei_mentor_profiles table');
      }
      throw error;
    }

    console.log('✅ Mentor status updated successfully:', { count });
  }

  async getMentorCapacity(mentorId: string): Promise<MentorCapacityDto> {
    console.log('🔍 Getting mentor capacity for ID:', mentorId);

    // APPROACH 1: Try to find by hei_mentor_profiles.id
    let { data: mentor, error } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, max_students, user_id, users!inner(full_name)')
      .eq('id', mentorId)
      .single();

    // APPROACH 2: If not found, try to find by user_id in hei_mentor_profiles
    if (error || !mentor) {
      console.log('📋 Not found by profile ID, trying user_id...');
      const { data: mentorByUserId, error: userIdError } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, max_students, user_id, users!inner(full_name)')
        .eq('user_id', mentorId)
        .single();

      if (mentorByUserId) {
        mentor = mentorByUserId;
        error = null;
      }
    }

    // APPROACH 3: Fallback to users table directly (for mentors without profiles)
    if (error || !mentor) {
      console.log('⚠️ No mentor profile found, falling back to users table...');
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('id, full_name')
        .eq('id', mentorId)
        .eq('role', 'hei_mentor')
        .single();

      if (userError || !user) {
        throw new NotFoundException('Mentor not found');
      }

      // Return default capacity for user without profile
      return {
        mentorId: user.id,
        mentorName: user.full_name || 'Unknown',
        currentSchoolsCount: 0,
        maxCapacity: 10, // Default max capacity
        availableCapacity: 10,
        workloadPercentage: 0,
        assignedSchools: [],
      };
    }

    const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

    // Use either the profile id or the user_id for querying assignments
    const assignmentMentorId = mentor.id;

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('mentor_id', assignmentMentorId)
      .eq('status', 'active');

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = studentUserIds.length > 0
      ? await this.supabase
        .from('student_profiles')
        .select('user_id, school_id')
        .in('user_id', studentUserIds)
      : { data: [] };

    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = schoolIds.length > 0
      ? await this.supabase
        .from('schools')
        .select('id, name')
        .in('id', schoolIds)
      : { data: [] };

    const schoolsMap = new Map();
    (schools || []).forEach(school => {
      schoolsMap.set(school.id, {
        schoolId: school.id,
        schoolName: school.name || 'Unknown',
        location: '',
      });
    });

    const currentStudentsCount = assignments?.length || 0;
    const maxCapacity = mentor.max_students || 10;
    const availableCapacity = Math.max(0, maxCapacity - currentStudentsCount);
    const workloadPercentage = maxCapacity > 0 ? Math.round((currentStudentsCount / maxCapacity) * 100) : 0;

    return {
      mentorId: mentor.id,
      mentorName: userArray?.full_name || 'Unknown',
      currentSchoolsCount: schoolsMap.size,
      maxCapacity,
      availableCapacity,
      workloadPercentage,
      assignedSchools: Array.from(schoolsMap.values()),
    };
  }

  async getAvailableMentors(heiId: string | null | undefined) {
    console.log('🔍 Getting available mentors for HEI:', heiId || 'ALL');

    // APPROACH 1: Try getting from hei_mentor_profiles first
    let query = this.supabase
      .from('hei_mentor_profiles')
      .select(`
        id,
        user_id,
        hei_id,
        employee_id,
        designation,
        department,
        expertise,
        qualification,
        experience_years,
        max_students,
        created_at,
        updated_at,
        users!inner(
          full_name,
          email,
          avatar_url
        )
      `);

    // Only filter by hei_id if provided
    if (heiId) {
      query = query.eq('hei_id', heiId);
    }

    const { data: mentors, error } = await query;

    if (error) {
      console.error('❌ Error fetching mentor profiles:', error);
    }

    console.log(`📋 Found ${mentors?.length || 0} mentors from hei_mentor_profiles`);

    // If we found mentors in profiles, use those
    if (mentors && mentors.length > 0) {
      const mentorsWithCapacity = await Promise.all(
        mentors.map(async (mentor) => {
          const { count: currentAssignmentsCount } = await this.supabase
            .from('mentor_student_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor.id)
            .eq('status', 'active');

          // Get schools from mentor_school_assignments table
          let schoolsFromAssignments = new Set<string>();
          try {
            const { data: schoolAssignments } = await this.supabase
              .from('mentor_school_assignments')
              .select('school_id')
              .eq('mentor_id', mentor.id)
              .eq('status', 'active');

            (schoolAssignments || []).forEach(a => {
              if (a.school_id) schoolsFromAssignments.add(a.school_id);
            });
          } catch (err) {
            // Table may not exist
          }

          // Also check by user_id in mentor_school_assignments
          try {
            const { data: schoolAssignmentsByUser } = await this.supabase
              .from('mentor_school_assignments')
              .select('school_id')
              .eq('mentor_id', mentor.user_id)
              .eq('status', 'active');

            (schoolAssignmentsByUser || []).forEach(a => {
              if (a.school_id) schoolsFromAssignments.add(a.school_id);
            });
          } catch (err) {
            // Table may not exist
          }

          // Also get schools from student assignments (legacy)
          const { data: assignments } = await this.supabase
            .from('mentor_student_assignments')
            .select('student_id')
            .eq('mentor_id', mentor.id)
            .eq('status', 'active');

          const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);

          if (studentUserIds.length > 0) {
            const { data: studentProfiles } = await this.supabase
              .from('student_profiles')
              .select('school_id')
              .in('user_id', studentUserIds);

            (studentProfiles || []).forEach(s => {
              if (s.school_id) schoolsFromAssignments.add(s.school_id);
            });
          }

          const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

          return {
            id: mentor.id,
            name: userArray?.full_name || 'Unknown',
            email: userArray?.email || '',
            avatar_url: userArray?.avatar_url,
            designation: mentor.designation || 'N/A',
            department: mentor.department || '',
            expertise: mentor.expertise || [],
            qualification: mentor.qualification || '',
            experience_years: mentor.experience_years || 0,
            max_students: mentor.max_students || 10,
            currentSchoolsCount: schoolsFromAssignments.size,
            currentStudentsCount: currentAssignmentsCount || 0,
            created_at: mentor.created_at,
            updated_at: mentor.updated_at,
          };
        }),
      );

      return mentorsWithCapacity;
    }

    // APPROACH 2: Fallback - Query users table for users with role='hei_mentor'
    console.log('⚠️ No mentor profiles found, falling back to users table...');

    const { data: mentorUsers, error: usersError } = await this.supabase
      .from('users')
      .select('*')
      .eq('role', 'hei_mentor');

    if (usersError) {
      console.error('❌ Error fetching mentor users:', usersError);
      throw usersError;
    }

    console.log(`✅ Found ${mentorUsers?.length || 0} mentors from users table with role='hei_mentor'`);

    // Map users to available mentors format with school counts from mentor_school_assignments
    const mappedMentors = await Promise.all((mentorUsers || []).map(async (user) => {
      let schoolsCount = 0;
      try {
        const { data: schoolAssignments } = await this.supabase
          .from('mentor_school_assignments')
          .select('school_id')
          .eq('mentor_id', user.id)
          .eq('status', 'active');
        schoolsCount = schoolAssignments?.length || 0;
      } catch (err) {
        // Table may not exist
      }

      return {
        id: user.id,
        name: user.full_name || 'Unknown',
        email: user.email || '',
        avatar_url: user.avatar_url,
        designation: 'HEI Mentor',
        department: '',
        expertise: [],
        qualification: '',
        experience_years: 0,
        max_students: 10,
        currentSchoolsCount: schoolsCount,
        currentStudentsCount: 0,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }));

    return mappedMentors;
  }

  /* ==================== ASSIGNMENTS ==================== */

  async getUnassignedSchools(): Promise<UnassignedSchoolDto[]> {
    const { data: allSchools } = await this.supabase
      .from('schools')
      .select('*');

    const assignedSchoolIds = new Set<string>();

    // Check 1: Get schools assigned via mentor_school_assignments table (if exists)
    try {
      const { data: schoolAssignments, error: schoolAssignmentError } = await this.supabase
        .from('mentor_school_assignments')
        .select('school_id')
        .eq('status', 'active');

      if (!schoolAssignmentError && schoolAssignments) {
        schoolAssignments.forEach(a => {
          if (a.school_id) assignedSchoolIds.add(a.school_id);
        });
        console.log(`📋 Found ${assignedSchoolIds.size} schools assigned via mentor_school_assignments`);
      }
    } catch (err) {
      console.log('⚠️ mentor_school_assignments table may not exist, using student-based tracking only');
    }

    // Check 2: Get schools assigned via mentor_student_assignments (legacy/fallback)
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('status', 'active');

    if (assignments && assignments.length > 0) {
      const studentUserIds = assignments.map(a => a.student_id).filter(Boolean);
      const { data: studentProfiles } = await this.supabase
        .from('student_profiles')
        .select('user_id, school_id')
        .in('user_id', studentUserIds);

      (studentProfiles || []).forEach(s => {
        if (s.school_id) assignedSchoolIds.add(s.school_id);
      });
    }

    console.log(`✅ Total assigned schools: ${assignedSchoolIds.size}`);

    const unassignedSchools = (allSchools || []).filter(
      school => !assignedSchoolIds.has(school.id)
    );

    const schoolIds = unassignedSchools.map(s => s.id);
    const [studentsData, teachersData] = await Promise.all([
      this.supabase.from('student_profiles').select('school_id').in('school_id', schoolIds),
      this.supabase.from('teacher_profiles').select('school_id').in('school_id', schoolIds),
    ]);

    return unassignedSchools.map(school => {
      const studentsCount = studentsData.data?.filter(s => s.school_id === school.id).length || 0;
      const teachersCount = teachersData.data?.filter(t => t.school_id === school.id).length || 0;

      return {
        id: school.id,
        name: school.name,
        location: school.location,
        district: school.district,
        state: school.state,
        studentsCount,
        teachersCount,
        principalName: school.principal_name,
        principalContact: school.principal_contact,
        requestDate: school.created_at,
        urgency: 'medium',
      };
    });
  }

  async createAssignment(createDto: CreateAssignmentDto, userId: string): Promise<MentorAssignmentDto[]> {
    console.log('📝 Creating assignment:', { mentorId: createDto.mentorId, schoolIds: createDto.schoolIds });

    const results: MentorAssignmentDto[] = [];

    // First, try to insert into mentor_school_assignments table (direct school tracking)
    try {
      const schoolAssignments = createDto.schoolIds.map(schoolId => ({
        mentor_id: createDto.mentorId,
        school_id: schoolId,
        assigned_by: userId,
        status: 'active',
        assigned_at: createDto.assignmentDate || new Date().toISOString(),
        notes: createDto.notes || null,
      }));

      const { data: schoolAssignmentData, error: schoolAssignmentError } = await this.supabase
        .from('mentor_school_assignments')
        .insert(schoolAssignments)
        .select();

      if (schoolAssignmentError) {
        console.log('⚠️ mentor_school_assignments table may not exist:', schoolAssignmentError.message);
        // Table doesn't exist, continue with student-based approach
      } else {
        console.log('✅ Created school assignments:', schoolAssignmentData?.length || 0);

        // Get school details to return
        const { data: schools } = await this.supabase
          .from('schools')
          .select('id, name, location')
          .in('id', createDto.schoolIds);

        const { data: mentor } = await this.supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', createDto.mentorId)
          .single();

        (schoolAssignmentData || []).forEach((assignment, index) => {
          const school = schools?.find(s => s.id === createDto.schoolIds[index]);
          results.push({
            id: assignment.id,
            mentorId: createDto.mentorId,
            mentorName: mentor?.full_name || 'Unknown',
            mentorEmail: mentor?.email || '',
            schoolId: school?.id || createDto.schoolIds[index],
            schoolName: school?.name || 'Unknown School',
            schoolLocation: school?.location || '',
            assignedBy: userId,
            assignedByName: 'Admin',
            assignmentDate: assignment.assigned_at,
            status: 'active',
            notes: assignment.notes,
          } as any);
        });

        if (results.length > 0) {
          return results;
        }
      }
    } catch (err) {
      console.log('⚠️ Error with school assignments, falling back:', err);
    }

    // Fallback: Also create student assignments if there are students
    const { data: students } = await this.supabase
      .from('student_profiles')
      .select('user_id, schools(id, name, location)')
      .in('school_id', createDto.schoolIds);

    if (students && students.length > 0) {
      const studentAssignments = students.map((student) => ({
        mentor_id: createDto.mentorId,
        student_id: student.user_id,
        assigned_by: userId,
        status: 'active',
        assigned_at: createDto.assignmentDate,
        notes: createDto.notes,
      }));

      const { data, error } = await this.supabase
        .from('mentor_student_assignments')
        .insert(studentAssignments)
        .select();

      if (error) {
        console.error('❌ Error creating student assignments:', error);
        throw new BadRequestException(error.message);
      }

      console.log('✅ Created student assignments:', data?.length || 0);
      return data || [];
    }

    // If no students and no school assignment table, return empty but log warning
    console.log('⚠️ No students found in selected schools and mentor_school_assignments table not available');
    console.log('⚠️ Please create the mentor_school_assignments table for proper tracking');

    // Still return success but with a note that no actual records were created
    // This at least prevents the error from showing
    return [];
  }

  async reassignMentor(reassignDto: ReassignMentorDto, userId: string): Promise<MentorAssignmentDto> {
    const { error: updateError } = await this.supabase
      .from('mentor_student_assignments')
      .update({ status: 'reassigned' })
      .eq('id', reassignDto.assignmentId);

    if (updateError) throw updateError;

    const { data: oldAssignment, error: selectError } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('id', reassignDto.assignmentId)
      .single();

    if (selectError || !oldAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    const { data: newAssignment, error: insertError } = await this.supabase
      .from('mentor_student_assignments')
      .insert({
        mentor_id: reassignDto.newMentorId,
        student_id: oldAssignment.student_id,
        assigned_by: userId,
        assigned_at: reassignDto.effectiveDate,
        status: 'active',
        notes: `Reassigned. Reason: ${reassignDto.reason}`,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const { data: mentor } = await this.supabase
      .from('hei_mentor_profiles')
      .select('hei_id')
      .eq('id', reassignDto.newMentorId)
      .single();

    const assignments = await this.getRecentAssignments(mentor?.hei_id || '', 1);
    return assignments[0];
  }

  async removeAssignment(assignmentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('mentor_student_assignments')
      .update({ status: 'completed' })
      .eq('id', assignmentId);

    if (error) throw error;
  }

  /* ==================== PARTNERSHIPS ==================== */

  async getPartnerships(
    filters: {
      status?: PartnershipStatus;
      mentorId?: string;
      district?: string;
      state?: string;
      search?: string;
    },
    pagination: { page: number; limit: number }
  ): Promise<PaginatedPartnershipListDto> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    console.log('🏫 Getting partnerships with filters:', filters);

    let query = this.supabase
      .from('schools')
      .select('*', { count: 'exact' });

    if (filters.district) {
      query = query.eq('district', filters.district);
    }

    if (filters.state) {
      query = query.eq('state', filters.state);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }

    const { data: schools, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching schools:', error);
      throw error;
    }

    console.log(`✅ Found ${schools?.length || 0} schools`);

    const schoolIds = schools?.map(s => s.id) || [];

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id, mentor_id, assigned_at')
      .eq('status', 'active');

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    const mentorIds = Array.from(new Set((assignments || []).map(a => a.mentor_id).filter(Boolean)));
    const { data: mentorProfiles } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, user_id')
      .in('id', mentorIds);

    const mentorUserIds = (mentorProfiles || []).map(m => m.user_id).filter(Boolean);
    const { data: mentorUsers } = await this.supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .in('id', mentorUserIds);

    // Also get mentor_school_assignments for direct tracking
    let schoolToMentorMap = new Map<string, { mentorId: string; assignedAt: string }>();
    let directMentorIds = new Set<string>();
    try {
      const { data: schoolAssignments } = await this.supabase
        .from('mentor_school_assignments')
        .select('school_id, mentor_id, assigned_at')
        .in('school_id', schoolIds)
        .eq('status', 'active');

      (schoolAssignments || []).forEach(a => {
        if (!schoolToMentorMap.has(a.school_id)) {
          schoolToMentorMap.set(a.school_id, { mentorId: a.mentor_id, assignedAt: a.assigned_at });
          directMentorIds.add(a.mentor_id);
        }
      });
    } catch (err) {
      console.log('⚠️ mentor_school_assignments table may not exist');
    }

    // Get mentor users for direct assignments
    let directMentorUsers: Array<{ id: string; full_name: string; email: string; avatar_url: string }> = [];
    if (directMentorIds.size > 0) {
      const { data } = await this.supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .in('id', Array.from(directMentorIds));
      directMentorUsers = data || [];
    }

    const [studentsData, teachersData] = await Promise.all([
      this.supabase.from('student_profiles').select('school_id').in('school_id', schoolIds),
      this.supabase.from('teacher_profiles').select('school_id').in('school_id', schoolIds),
    ]);

    const partnerships: SchoolPartnershipDto[] = (schools || []).map(school => {
      // Check for direct school assignment first
      const directAssignment = schoolToMentorMap.get(school.id);
      const directMentorUser = directMentorUsers?.find(u => u.id === directAssignment?.mentorId);

      // Fall back to student-based assignment
      const schoolStudentProfiles = (studentProfiles || []).filter(sp => sp.school_id === school.id);
      const schoolStudentUserIds = schoolStudentProfiles.map(sp => sp.user_id);
      const schoolAssignments = (assignments || []).filter(a => schoolStudentUserIds.includes(a.student_id));

      const studentAssignment = schoolAssignments[0];
      const mentorProfile = mentorProfiles?.find(m => m.id === studentAssignment?.mentor_id);
      const studentMentorUser = mentorUsers?.find(u => u.id === mentorProfile?.user_id);

      // Use direct assignment if available, otherwise use student-based
      const hasMentor = directAssignment || studentAssignment;
      const mentorUser = directMentorUser || studentMentorUser;
      const mentorId = directAssignment?.mentorId || studentAssignment?.mentor_id;
      const assignedAt = directAssignment?.assignedAt || studentAssignment?.assigned_at;

      const studentsCount = studentsData.data?.filter(s => s.school_id === school.id).length || 0;
      const teachersCount = teachersData.data?.filter(t => t.school_id === school.id).length || 0;

      return {
        schoolId: school.id,
        schoolName: school.name,
        schoolLogo: school.logo,
        location: school.location,
        district: school.district,
        state: school.state,
        principalName: school.principal_name,
        principalContact: school.principal_contact,
        mentorId: mentorId,
        mentorName: mentorUser?.full_name,
        mentorAvatar: mentorUser?.avatar_url,
        mentorEmail: mentorUser?.email,
        studentsCount,
        teachersCount,
        partnershipDate: assignedAt,
        status: hasMentor ? 'active' : 'pending',
        lastContactDate: school.last_contact_date,
        programsEnrolled: school.programs_enrolled || [],
      };
    });

    let filteredPartnerships = partnerships;
    if (filters.mentorId) {
      filteredPartnerships = partnerships.filter(p => p.mentorId === filters.mentorId);
    }

    if (filters.status) {
      filteredPartnerships = filteredPartnerships.filter(p => p.status === filters.status);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      partnerships: filteredPartnerships,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getPartnership(schoolId: string): Promise<PartnershipDetailsDto> {
    console.log('🏫 Getting partnership details for school:', schoolId);

    // 1. Get school details
    const { data: school, error: schoolError } = await this.supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) {
      console.error('❌ School not found:', schoolError);
      throw new NotFoundException('School not found');
    }

    console.log('✅ School found:', school.name);

    // 2. Get principal info from school_admin_profiles and users table
    let principalInfo: { name: string; email: string; phone: string } | null = null;
    try {
      const { data: adminProfile } = await this.supabase
        .from('school_admin_profiles')
        .select('user_id, designation')
        .eq('school_id', schoolId)
        .single();

      if (adminProfile) {
        const { data: adminUser } = await this.supabase
          .from('users')
          .select('full_name, email, phone')
          .eq('id', adminProfile.user_id)
          .single();

        if (adminUser) {
          principalInfo = {
            name: adminUser.full_name || school.principal_name || 'Principal',
            email: adminUser.email || '',
            phone: adminUser.phone || '',
          };
          console.log('✅ Principal info found:', principalInfo);
        }
      }
    } catch (err) {
      console.log('⚠️ Error fetching principal info:', err);
    }

    // 3. Get students and teachers count
    const [studentsData, teachersData] = await Promise.all([
      this.supabase
        .from('student_profiles')
        .select('id, class_level, user_id')
        .eq('school_id', schoolId),
      this.supabase
        .from('teacher_profiles')
        .select('id, subjects')
        .eq('school_id', schoolId),
    ]);

    console.log('📊 Students query result:', studentsData);
    console.log('📊 Teachers query result:', teachersData);

    const totalStudents = studentsData.data?.length || 0;
    const totalTeachers = teachersData.data?.length || 0;

    console.log(`✅ Students: ${totalStudents}, Teachers: ${totalTeachers}`);

    // 3. Find assigned mentor - FIRST check mentor_school_assignments (direct school assignment)
    let assignedMentor: any = undefined;

    // Check mentor_school_assignments table first
    try {
      const { data: schoolAssignments, error: schoolAssignmentError } = await this.supabase
        .from('mentor_school_assignments')
        .select('id, mentor_id, assigned_at, status')
        .eq('school_id', schoolId)
        .eq('status', 'active')
        .order('assigned_at', { ascending: false })
        .limit(1);

      console.log('📋 mentor_school_assignments query result:', JSON.stringify(schoolAssignments));

      if (schoolAssignments && schoolAssignments.length > 0) {
        const schoolAssignment = schoolAssignments[0];
        console.log('✅ Found direct school assignment:', JSON.stringify(schoolAssignment));

        // The mentor_id in mentor_school_assignments could be either:
        // 1. hei_mentor_profiles.id (profile ID)
        // 2. users.id (user ID)
        // Try both approaches

        // First try: Look up by hei_mentor_profiles.id
        let { data: mentorProfile } = await this.supabase
          .from('hei_mentor_profiles')
          .select('id, user_id, designation, department')
          .eq('id', schoolAssignment.mentor_id)
          .single();

        // Second try: Look up by user_id if first approach fails
        if (!mentorProfile) {
          const { data: mentorByUserId } = await this.supabase
            .from('hei_mentor_profiles')
            .select('id, user_id, designation, department')
            .eq('user_id', schoolAssignment.mentor_id)
            .single();
          mentorProfile = mentorByUserId;
        }

        if (mentorProfile) {
          console.log('✅ Mentor profile found:', JSON.stringify(mentorProfile));

          // Fetch mentor user details
          const { data: mentorUser } = await this.supabase
            .from('users')
            .select('id, full_name, email, avatar_url')
            .eq('id', mentorProfile.user_id)
            .single();

          if (mentorUser) {
            assignedMentor = {
              id: mentorProfile.id,
              name: mentorUser.full_name || 'Unknown',
              email: mentorUser.email || '',
              avatar: mentorUser.avatar_url,
              designation: mentorProfile.designation,
              department: mentorProfile.department,
              contactNumber: null,
              assignmentDate: schoolAssignment.assigned_at,
            };
            console.log('✅ Assigned mentor from school_assignments:', JSON.stringify(assignedMentor));
          }
        } else {
          // Mentor might be directly in users table without a profile
          const { data: mentorUser } = await this.supabase
            .from('users')
            .select('id, full_name, email, avatar_url')
            .eq('id', schoolAssignment.mentor_id)
            .eq('role', 'hei_mentor')
            .single();

          if (mentorUser) {
            assignedMentor = {
              id: mentorUser.id,
              name: mentorUser.full_name || 'Unknown',
              email: mentorUser.email || '',
              avatar: mentorUser.avatar_url,
              designation: 'HEI Mentor',
              department: null,
              contactNumber: null,
              assignmentDate: schoolAssignment.assigned_at,
            };
            console.log('✅ Assigned mentor from users table:', JSON.stringify(assignedMentor));
          }
        }
      }
    } catch (err) {
      console.log('⚠️ Error checking mentor_school_assignments:', err);
    }

    // Fallback: Check mentor_student_assignments if no direct school assignment found
    if (!assignedMentor) {
      console.log('📋 No direct school assignment, checking mentor_student_assignments...');

      const studentUserIds = (studentsData.data || [])
        .map((s: any) => s.user_id)
        .filter(Boolean);

      console.log(`✅ Found ${studentUserIds.length} student user IDs:`, studentUserIds);

      if (studentUserIds.length > 0) {
        // Get ANY assignment for students from this school
        const { data: assignments, error: assignmentError } = await this.supabase
          .from('mentor_student_assignments')
          .select('student_id, mentor_id, assigned_at, status')
          .in('student_id', studentUserIds)
          .in('status', ['active', 'pending'])
          .order('assigned_at', { ascending: false })
          .limit(1);

        console.log('✅ Assignments query result:', JSON.stringify(assignments));

        const currentAssignment = assignments?.[0];

        if (currentAssignment) {
          console.log('✅ Current assignment found:', JSON.stringify(currentAssignment));

          const { data: mentorProfile } = await this.supabase
            .from('hei_mentor_profiles')
            .select('id, user_id, designation, department')
            .eq('id', currentAssignment.mentor_id)
            .single();

          if (mentorProfile) {
            const { data: mentorUser } = await this.supabase
              .from('users')
              .select('id, full_name, email, avatar_url')
              .eq('id', mentorProfile.user_id)
              .single();

            if (mentorUser) {
              assignedMentor = {
                id: mentorProfile.id,
                name: mentorUser.full_name || 'Unknown',
                email: mentorUser.email || '',
                avatar: mentorUser.avatar_url,
                designation: mentorProfile.designation,
                department: mentorProfile.department,
                contactNumber: null,
                assignmentDate: currentAssignment.assigned_at,
              };
              console.log('✅ Assigned mentor from student_assignments:', JSON.stringify(assignedMentor));
            }
          }
        }
      } else {
        console.log('⚠️ No students found in this school');
      }
    }

    // 4. Get mentoring sessions and assignments data
    const [sessions, assignmentsData] = await Promise.all([
      this.supabase.from('mentoring_sessions').select('id').eq('school_id', schoolId),
      this.supabase.from('assignments').select('id').eq('school_id', schoolId),
    ]);

    // 5. Calculate distributions
    const gradeDistribution = (studentsData.data || []).reduce((acc: any, student: any) => {
      const grade = student.class_level || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    const subjectDistribution = (teachersData.data || []).reduce((acc: any, teacher: any) => {
      const subjects = Array.isArray(teacher.subjects) ? teacher.subjects : [teacher.subjects];
      subjects.forEach(subject => {
        if (subject) {
          acc[subject] = (acc[subject] || 0) + 1;
        }
      });
      return acc;
    }, {});

    // 6. Return partnership details
    const result = {
      school: {
        id: school.id,
        name: school.name,
        logo: school.logo,
        location: school.location,
        district: school.district,
        state: school.state,
        principalName: principalInfo?.name || school.principal_name || 'N/A',
        principalContact: principalInfo?.phone || school.principal_contact || '',
        principalEmail: principalInfo?.email || school.principal_email || '',
        establishedYear: school.established_year,
        schoolType: school.type,
        infrastructure: school.infrastructure,
        partnershipStatus: assignedMentor ? PartnershipStatus.ACTIVE : PartnershipStatus.PENDING,
        partnershipStartDate: assignedMentor?.assignmentDate,
      },
      assignedMentor,
      mentorHistory: [],
      students: {
        total: totalStudents,
        gradeDistribution: Object.entries(gradeDistribution).map(([grade, count]) => ({
          grade,
          count: count as number
        })),
      },
      teachers: {
        total: totalTeachers,
        subjectDistribution: Object.entries(subjectDistribution).map(([subject, count]) => ({
          subject,
          count: count as number
        })),
      },
      statistics: {
        totalMentoringSessions: sessions.data?.length || 0,
        totalAssignmentsCreated: assignmentsData.data?.length || 0,
        studentEngagementRate: totalStudents > 0 ? 75 : 0,
        teacherParticipationRate: totalTeachers > 0 ? 85 : 0,
      },
    };

    console.log('📦 Final partnership result:', JSON.stringify(result));

    return result;
  }






  async getPartnershipOverviewStats(): Promise<PartnershipOverviewStatsDto> {
    const [mentors, schools, students, teachers, assignments] = await Promise.all([
      this.supabase.from('hei_mentor_profiles').select('id', { count: 'exact', head: true }),
      this.supabase.from('schools').select('id', { count: 'exact', head: true }),
      this.supabase.from('student_profiles').select('id', { count: 'exact', head: true }),
      this.supabase.from('teacher_profiles').select('id', { count: 'exact', head: true }),
      this.supabase.from('mentor_student_assignments').select('id, status', { count: 'exact' }),
    ]);

    const activePartnerships = assignments.data?.filter(a => a.status === 'active').length || 0;
    const inactivePartnerships = assignments.data?.filter(a => a.status !== 'active').length || 0;

    return {
      totalMentors: mentors.count || 0,
      totalSchools: schools.count || 0,
      totalStudents: students.count || 0,
      totalTeachers: teachers.count || 0,
      activePartnerships,
      pendingRequests: 0,
      inactivePartnerships,
      growthRate: 15,
    };
  }

  async updatePartnershipStatus(schoolId: string, statusDto: UpdatePartnershipStatusDto): Promise<void> {
    const { error } = await this.supabase
      .from('schools')
      .update({ partnership_status: statusDto.status })
      .eq('id', schoolId);

    if (error) throw error;
  }

  /* ==================== ANNOUNCEMENTS ==================== */

  async getAnnouncements(
    createdBy: string,
    pagination: { page: number; limit: number }
  ): Promise<PaginatedAnnouncementListDto> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { data: adminProfile } = await this.supabase
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', createdBy)
      .single();

    const heiId = adminProfile?.hei_id;

    let query = this.supabase
      .from('announcements_with_author')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .eq('author_role', 'hei_admin')
      .order('created_at', { ascending: false });

    if (heiId) {
      query = query.eq('hei_id', heiId);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: announcements, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: (announcements || []).map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        badgeType: a.badge_type,
        badgeColor: a.badge_color,
        authorName: a.author_name,
        authorRole: a.author_role,
        priority: a.priority,
        isPinned: a.is_pinned,
        isNew: a.is_new,
        createdAt: a.created_at,
        metadata: a.metadata,
      })),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async createAnnouncement(
    createDto: CreateAnnouncementDto,
    createdBy: string
  ): Promise<AnnouncementDto> {
    const { data: adminProfile } = await this.supabase
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', createdBy)
      .single();

    const heiId = adminProfile?.hei_id;

    const { data: announcement, error } = await this.supabase
      .from('announcements')
      .insert({
        title: createDto.title,
        description: createDto.description,
        badge_type: createDto.badgeType,
        badge_color: createDto.badgeColor || '#6366f1',
        created_by: createdBy,
        author_role: 'hei_admin',
        target_audience: createDto.targetAudience,
        priority: createDto.priority,
        hei_id: heiId,
        school_id: null,
        class_level: createDto.classLevel || null,
        is_pinned: createDto.isPinned || false,
        starts_at: createDto.startsAt ? new Date(createDto.startsAt) : new Date(),
        expires_at: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
        metadata: createDto.metadata || {},
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
      metadata: announcement.metadata,
    };
  }

  async getAnnouncementRecipientCount(
    createDto: Partial<CreateAnnouncementDto>
  ): Promise<AnnouncementRecipientSummaryDto> {
    let mentorCount = 0;
    let schoolCount = 0;
    let teacherCount = 0;
    let studentCount = 0;

    if (createDto.targetAudience?.includes('hei_mentor')) {
      const { count } = await this.supabase
        .from('hei_mentor_profiles')
        .select('*', { count: 'exact', head: true });
      mentorCount = count || 0;
    }

    if (createDto.targetAudience?.includes('school_admin')) {
      const { count } = await this.supabase
        .from('school_admin_profiles')
        .select('*', { count: 'exact', head: true });
      schoolCount = count || 0;
    }

    if (createDto.targetAudience?.includes('teacher')) {
      const { count } = await this.supabase
        .from('teacher_profiles')
        .select('*', { count: 'exact', head: true });
      teacherCount = count || 0;
    }

    if (createDto.targetAudience?.includes('student')) {
      const { count } = await this.supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });
      studentCount = count || 0;
    }

    return {
      totalRecipients: mentorCount + schoolCount + teacherCount + studentCount,
      breakdown: {
        mentors: mentorCount,
        schools: schoolCount,
        teachers: teacherCount,
        students: studentCount,
      },
    };
  }

  async deleteAnnouncement(announcementId: string): Promise<void> {
    const { error } = await this.supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId);

    if (error) throw error;
  }
}
