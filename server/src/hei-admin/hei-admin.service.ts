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
  heiId: string,
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

  console.log('🔍 Getting mentors for HEI:', heiId, 'Filters:', filters, 'Page:', page);

  // Build query
  let query = this.supabase
    .from('hei_mentor_profiles')
    .select('*, users!inner(id, full_name, email, avatar_url)', { count: 'exact' })
    .eq('hei_id', heiId);

  // Apply status filter
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Apply search filter
  if (filters.search) {
    query = query.or(`users.full_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`);
  }

  // Execute query with pagination
  const { data: mentors, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching mentors:', error);
    throw error;
  }

  console.log(`✅ Found ${mentors?.length || 0} mentors, total count: ${count}`);

  if (!mentors || mentors.length === 0) {
    return {
      data: [],
      total: count || 0,
      page,
      limit,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    };
  }

  // Get mentor IDs for assignments
  const mentorIds = mentors.map(m => m.id);

  // Fetch assignments for these mentors
  const { data: assignments } = await this.supabase
    .from('mentor_student_assignments')
    .select('mentor_id, student_id')
    .in('mentor_id', mentorIds)
    .eq('status', 'active');

  // Get student profiles to find schools
  const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
  const { data: studentProfiles } = await this.supabase
    .from('student_profiles')
    .select('user_id, school_id')
    .in('user_id', studentUserIds);

  // Get school details
  const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
  const { data: schools } = await this.supabase
    .from('schools')
    .select('id, name, location')
    .in('id', schoolIds);

  // Map mentors to DTO
  const mentorList: MentorListItemDto[] = mentors.map(mentor => {
    // Handle users relationship (can be array or object)
    const user = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

    // Calculate assignments for this mentor
    const mentorAssignments = (assignments || []).filter(a => a.mentor_id === mentor.id);
    const mentorStudentIds = mentorAssignments.map(a => a.student_id);
    
    // Get student profiles for this mentor
    const mentorStudentProfiles = (studentProfiles || []).filter(sp =>
      mentorStudentIds.includes(sp.user_id)
    );

    // Build unique schools map
    const mentorSchools = new Map();
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
      status: mentor.status,
      assignedSchoolsCount: assignedSchools.length,
      totalStudentsSupervised: studentsCount,
      lastActive: mentor.last_active,
      joinDate: mentor.created_at,
      heiId: mentor.hei_id,
      workloadStatus,
      assignedSchools,
    };
  });

  // Apply workload filter if specified
  let filteredList = mentorList;
  if (filters.workload && filters.workload !== 'all') {
    filteredList = mentorList.filter(m => m.workloadStatus === filters.workload);
  }

  const total = count || 0;
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


  async getMentor(mentorId: string): Promise<MentorDetailsDto> {
    const { data: mentor, error } = await this.supabase
      .from('hei_mentor_profiles')
      .select('*, users!inner(id, full_name, email, avatar_url)')
      .eq('id', mentorId)
      .single();

    if (error || !mentor) {
      throw new NotFoundException('Mentor not found');
    }

    const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, student_id, assigned_at, status, notes')
      .eq('mentor_id', mentorId);

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, name, logo, location, district')
      .in('id', schoolIds);

    const schoolsMap = new Map();
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
    const { error } = await this.supabase
      .from('hei_mentor_profiles')
      .update({ status: statusDto.status })
      .eq('id', mentorId);

    if (error) throw error;
  }

  async getMentorCapacity(mentorId: string): Promise<MentorCapacityDto> {
    const { data: mentor, error } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, max_students, users!inner(full_name)')
      .eq('id', mentorId)
      .single();

    if (error || !mentor) {
      throw new NotFoundException('Mentor not found');
    }

    const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('mentor_id', mentorId)
      .eq('status', 'active');

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, name')
      .in('id', schoolIds);

    const schoolsMap = new Map();
    (schools || []).forEach(school => {
      schoolsMap.set(school.id, {
        schoolId: school.id,
        schoolName: school.name || 'Unknown',
        location: '',
      });
    });

    const currentStudentsCount = assignments?.length || 0;
    const maxCapacity = mentor.max_students;
    const availableCapacity = Math.max(0, maxCapacity - currentStudentsCount);
    const workloadPercentage = Math.round((currentStudentsCount / maxCapacity) * 100);

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

  async getAvailableMentors(heiId: string) {
    const { data: mentors, error } = await this.supabase
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
      `)
      .eq('hei_id', heiId);

    if (error) throw error;

    const mentorsWithCapacity = await Promise.all(
      (mentors || []).map(async (mentor) => {
        const { count: currentAssignmentsCount } = await this.supabase
          .from('mentor_student_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', mentor.id)
          .eq('status', 'active');

        const { data: assignments } = await this.supabase
          .from('mentor_student_assignments')
          .select('student_id')
          .eq('mentor_id', mentor.id)
          .eq('status', 'active');

        const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
        
        const { data: studentProfiles } = await this.supabase
          .from('student_profiles')
          .select('school_id')
          .in('user_id', studentUserIds);

        const uniqueSchools = Array.from(new Set(
          (studentProfiles || []).map(s => s.school_id).filter(Boolean)
        ));

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
          currentSchoolsCount: uniqueSchools.length,
          currentStudentsCount: currentAssignmentsCount || 0,
          created_at: mentor.created_at,
          updated_at: mentor.updated_at,
        };
      }),
    );

    return mentorsWithCapacity;
  }

  /* ==================== ASSIGNMENTS ==================== */

  async getUnassignedSchools(): Promise<UnassignedSchoolDto[]> {
    const { data: allSchools } = await this.supabase
      .from('schools')
      .select('*');

    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('status', 'active');

    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    const assignedSchoolIds = Array.from(new Set(
      (studentProfiles || []).map(s => s.school_id).filter(Boolean)
    ));

    const unassignedSchools = (allSchools || []).filter(
      school => !assignedSchoolIds.includes(school.id)
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
    const { data: students } = await this.supabase
      .from('student_profiles')
      .select('user_id, schools(id, name, location)')
      .in('school_id', createDto.schoolIds);

    const assignments = (students || []).map((student) => ({
      mentor_id: createDto.mentorId,
      student_id: student.user_id,
      assigned_by: userId,
      status: 'active',
      assigned_at: createDto.assignmentDate,
      notes: createDto.notes,
    }));

    const { data, error } = await this.supabase
      .from('mentor_student_assignments')
      .insert(assignments)
      .select();

    if (error) throw new BadRequestException(error.message);

    return data;
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

    const [studentsData, teachersData] = await Promise.all([
      this.supabase.from('student_profiles').select('school_id').in('school_id', schoolIds),
      this.supabase.from('teacher_profiles').select('school_id').in('school_id', schoolIds),
    ]);

    const partnerships: SchoolPartnershipDto[] = (schools || []).map(school => {
      const schoolStudentProfiles = (studentProfiles || []).filter(sp => sp.school_id === school.id);
      const schoolStudentUserIds = schoolStudentProfiles.map(sp => sp.user_id);
      const schoolAssignments = (assignments || []).filter(a => schoolStudentUserIds.includes(a.student_id));

      const assignment = schoolAssignments[0];
      const mentorProfile = mentorProfiles?.find(m => m.id === assignment?.mentor_id);
      const mentorUser = mentorUsers?.find(u => u.id === mentorProfile?.user_id);
      
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
        mentorId: assignment?.mentor_id,
        mentorName: mentorUser?.full_name,
        mentorAvatar: mentorUser?.avatar_url,
        mentorEmail: mentorUser?.email,
        studentsCount,
        teachersCount,
        partnershipDate: assignment?.assigned_at,
        status: assignment ? 'active' : 'pending',
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

  // 2. Get students and teachers count
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

  // 3. Find assigned mentor
  const studentUserIds = (studentsData.data || [])
    .map((s: any) => s.user_id)
    .filter(Boolean);
  
  console.log(`✅ Found ${studentUserIds.length} student user IDs:`, studentUserIds);

  let assignedMentor: any = undefined;

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
    console.log('❌ Assignment error:', assignmentError);

    const currentAssignment = assignments?.[0];

    if (currentAssignment) {
      console.log('✅ Current assignment found:', JSON.stringify(currentAssignment));

      // Fetch mentor profile - ✅ FIXED: Removed contact_number
      const { data: mentorProfile, error: mentorProfileError } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id, designation, department')
        .eq('id', currentAssignment.mentor_id)
        .single();

      console.log('📋 Mentor profile query result:', JSON.stringify(mentorProfile));
      console.log('❌ Mentor profile error:', mentorProfileError);

      if (mentorProfile) {
        console.log('✅ Mentor profile found:', JSON.stringify(mentorProfile));

        // Fetch mentor user details
        const { data: mentorUser, error: mentorUserError } = await this.supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', mentorProfile.user_id)
          .single();

        console.log('👤 Mentor user query result:', JSON.stringify(mentorUser));
        console.log('❌ Mentor user error:', mentorUserError);

        if (mentorUser) {
          assignedMentor = {
            id: mentorProfile.id,
            name: mentorUser.full_name || 'Unknown',
            email: mentorUser.email || '',
            avatar: mentorUser.avatar_url,
            designation: mentorProfile.designation,
            department: mentorProfile.department,
            contactNumber: null, // ✅ Set to null since column doesn't exist
            assignmentDate: currentAssignment.assigned_at,
          };

          console.log('✅ Assigned mentor constructed:', JSON.stringify(assignedMentor));
        } else {
          console.log('⚠️ Mentor user not found for user_id:', mentorProfile.user_id);
        }
      } else {
        console.log('⚠️ Mentor profile not found for mentor_id:', currentAssignment.mentor_id);
      }
    } else {
      console.log('⚠️ No assignments found for student user IDs:', studentUserIds);
    }
  } else {
    console.log('⚠️ No students found in this school');
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
      principalName: school.principal_name,
      principalContact: school.principal_contact,
      principalEmail: school.principal_email,
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
