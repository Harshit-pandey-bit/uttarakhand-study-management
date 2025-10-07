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

  /* ---------- DASHBOARD ---------- */

  async getDashboard(adminUserId: string): Promise<HEIAdminDashboardDto> {
    console.log('🎓 Getting HEI Admin dashboard for:', adminUserId);

    try {
      const { data: adminProfile, error: adminError } = await this.supabase
        .from('hei_admin_profiles')
        .select('hei_id')
        .eq('user_id', adminUserId)
        .single();

      if (adminError || !adminProfile) {
        throw new NotFoundException('HEI Admin profile not found');
      }

      const heiId = adminProfile.hei_id;

      const [stats, recentAssignments, recentAnnouncements, trendsData] = await Promise.all([
        this.getDashboardStats(heiId),
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
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  async getDashboardStats(heiId: string): Promise<DashboardStatsDto> {
    // Get mentor counts
    const { data: mentors } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id, status')
      .eq('hei_id', heiId);

    const totalMentors = mentors?.length || 0;
    const activeMentors = mentors?.filter(m => m.status === 'active').length || 0;
    const inactiveMentors = mentors?.filter(m => m.status === 'inactive').length || 0;

    // Get student assignments
    const mentorIds = mentors?.map(m => m.id) || [];
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, status, student_id')
      .in('mentor_id', mentorIds);

    const activeAssignmentsList = (assignments || []).filter(a => a.status === 'active');
    const activeAssignments = activeAssignmentsList.length;

    // Get student_ids (which are user_ids)
    const studentUserIds = activeAssignmentsList.map(a => a.student_id).filter(Boolean);
    
    // Query student_profiles using user_id
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('school_id')
      .in('user_id', studentUserIds);

    // Get unique school IDs
    const assignedSchoolIds = Array.from(new Set(
      (studentProfiles || []).map(s => s.school_id).filter(Boolean)
    ));

    const { count: totalSchools } = await this.supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });

    const totalStudents = activeAssignmentsList.length;

    const { data: teachers } = await this.supabase
      .from('teacher_profiles')
      .select('id')
      .in('school_id', assignedSchoolIds);

    const { count: recentAnnouncementsCount } = await this.supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    return {
      totalMentors,
      activeMentors,
      inactiveMentors,
      totalSchools: totalSchools || 0,
      partnerSchools: assignedSchoolIds.length,
      totalStudents,
      totalTeachers: teachers?.length || 0,
      pendingAssignments: 0,
      activeAssignments,
      recentAnnouncementsCount: recentAnnouncementsCount || 0,
    };
  }

  async getTrendsData(heiId: string): Promise<TrendsDataDto> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get mentor IDs
    const { data: mentors } = await this.supabase
      .from('hei_mentor_profiles')
      .select('id')
      .eq('hei_id', heiId);

    const mentorIds = mentors?.map(m => m.id) || [];

    // Get assignments
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('assigned_at, mentor_id, student_id')
      .in('mentor_id', mentorIds)
      .gte('assigned_at', sixMonthsAgo.toISOString());

    // Group assignments by month
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

    // Get student profiles with schools
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('school_id, user_id')
      .in('user_id', studentUserIds);

    // Get schools data
    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, district')
      .in('id', schoolIds);

    // Create school map
    const schoolMap = new Map(schools?.map(s => [s.id, s]) || []);

    // Count by region
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

    // Get mentor workload distribution
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

    const [mentorData, userData, studentProfiles, studentUsers] = await Promise.all([
      this.supabase.from('hei_mentor_profiles').select('id, user_id').in('id', mentorIdsUnique),
      this.supabase.from('users').select('id, full_name, email').in('id', assignedByIds),
      this.supabase.from('student_profiles').select('user_id, school_id').in('user_id', studentUserIds),
      this.supabase.from('users').select('id, full_name').in('id', studentUserIds),
    ]);

    const mentorUserIds = mentorData.data?.map(m => m.user_id) || [];
    const { data: mentorUsers } = await this.supabase
      .from('users')
      .select('id, full_name, email')
      .in('id', mentorUserIds);

    // Get schools
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
  // Get HEI ID
  const { data: adminProfile } = await this.supabase
    .from('hei_admin_profiles')
    .select('hei_id')
    .eq('user_id', createdBy)
    .single();

  const heiId = adminProfile?.hei_id;

  // Use announcements table directly to get target_audience
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

  // Calculate isNew (created within last 7 days)
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


  /* ---------- MENTORS ---------- */

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

    let query = this.supabase
      .from('hei_mentor_profiles')
      .select('*, users!inner(id, full_name, email, avatar_url)', { count: 'exact' })
      .eq('hei_id', heiId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data: mentors, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get student assignments
    const mentorIds = mentors?.map(m => m.id) || [];
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('mentor_id, student_id')
      .in('mentor_id', mentorIds)
      .eq('status', 'active');

    // Get student profiles
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // Get schools
    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, name, location')
      .in('id', schoolIds);

    const mentorList: MentorListItemDto[] = (mentors || []).map(mentor => {
      const userArray = Array.isArray(mentor.users) ? mentor.users[0] : mentor.users;
      const mentorAssignments = (assignments || []).filter(a => a.mentor_id === mentor.id);
      
      // Get unique schools for this mentor
      const mentorStudentIds = mentorAssignments.map(a => a.student_id);
      const mentorStudentProfiles = (studentProfiles || []).filter(sp => 
        mentorStudentIds.includes(sp.user_id)
      );
      
      const mentorSchools = new Map();
      mentorStudentProfiles.forEach(profile => {
        const school = schools?.find(s => s.id === profile.school_id);
        if (school) {
          mentorSchools.set(school.id, {
            schoolId: school.id,
            schoolName: school.name || 'Unknown',
            location: school.location || '',
          });
        }
      });

      const assignedSchools = Array.from(mentorSchools.values());
      const studentsCount = mentorAssignments.length;

      const workloadPercentage = (studentsCount / mentor.max_students) * 100;
      let workloadStatus: 'under-assigned' | 'optimal' | 'over-assigned' = 'optimal';
      if (workloadPercentage < 50) workloadStatus = 'under-assigned';
      else if (workloadPercentage > 100) workloadStatus = 'over-assigned';

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
        totalStudentsSupervised: studentsCount,
        lastActive: mentor.last_active,
        joinDate: mentor.created_at,
        heiId: mentor.hei_id,
        workloadStatus,
        assignedSchools,
      };
    });

    let filteredList = mentorList;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredList = mentorList.filter(m => 
        m.name.toLowerCase().includes(searchLower) || 
        m.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.workload && filters.workload !== 'all') {
      filteredList = filteredList.filter(m => m.workloadStatus === filters.workload);
    }

    const total = count || filteredList.length;
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

    // Get student assignments
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('id, student_id, assigned_at, status, notes')
      .eq('mentor_id', mentorId);

    // Get student profiles
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // Get schools
    const schoolIds = Array.from(new Set((studentProfiles || []).map(s => s.school_id).filter(Boolean)));
    const { data: schools } = await this.supabase
      .from('schools')
      .select('id, name, logo, location, district')
      .in('id', schoolIds);

    // Group students by school
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

    // Get active student assignments
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('mentor_id', mentorId)
      .eq('status', 'active');

    // Get student profiles
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // Get unique schools
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
      .select('*, users!inner(full_name, email, avatar_url)')
      .eq('hei_id', heiId)
      .eq('status', 'active');

    if (error) throw error;
    return mentors;
  }

  /* ---------- ASSIGNMENTS ---------- */

  async getUnassignedSchools(): Promise<UnassignedSchoolDto[]> {
    // Get all schools
    const { data: allSchools } = await this.supabase
      .from('schools')
      .select('*');

    // Get assignments
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id')
      .eq('status', 'active');

    // Get student profiles
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    const assignedSchoolIds = Array.from(new Set(
      (studentProfiles || []).map(s => s.school_id).filter(Boolean)
    ));

    // Filter unassigned schools
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

  async createAssignment(
    createDto: CreateAssignmentDto,
    createdBy: string
  ): Promise<MentorAssignmentDto[]> {
    // createDto.schoolIds now represents student user IDs
    const assignments = createDto.schoolIds.map(studentUserId => ({
      mentor_id: createDto.mentorId,
      student_id: studentUserId,
      assigned_by: createdBy,
      assigned_at: createDto.assignmentDate,
      status: 'active',
      notes: createDto.notes,
    }));

    const { data, error } = await this.supabase
      .from('mentor_student_assignments')
      .insert(assignments)
      .select();

    if (error) throw error;

    const { data: mentor } = await this.supabase
      .from('hei_mentor_profiles')
      .select('hei_id')
      .eq('id', createDto.mentorId)
      .single();

    return this.getRecentAssignments(mentor?.hei_id || '', data.length);
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

  /* ---------- PARTNERSHIPS ---------- */

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

    if (error) throw error;

    const schoolIds = schools?.map(s => s.id) || [];

    // Get assignments and related data
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id, mentor_id, assigned_at')
      .eq('status', 'active');

    // Get student profiles
    const studentUserIds = (assignments || []).map(a => a.student_id).filter(Boolean);
    const { data: studentProfiles } = await this.supabase
      .from('student_profiles')
      .select('user_id, school_id')
      .in('user_id', studentUserIds);

    // Get mentor info
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
      // Find assignments for students in this school
      const schoolStudentProfiles = (studentProfiles || []).filter(sp => sp.school_id === school.id);
      const schoolStudentUserIds = schoolStudentProfiles.map(sp => sp.user_id);
      const schoolAssignments = (assignments || []).filter(a => schoolStudentUserIds.includes(a.student_id));

      const assignment = schoolAssignments[0];
      const mentorProfile = mentorProfiles?.find(m => m.id === assignment?.mentor_id);
      const mentorUser = mentorUsers?.find(u => u.id === mentorProfile?.user_id);
      
      const studentsCount = studentsData.data?.filter(s => s.school_id === school.id).length || 0;
      const teachersCount = teachersData.data?.filter(t => t.school_id === school.id).length || 0;

      return {
        id: school.id,
        schoolName: school.name,
        schoolLogo: school.logo,
        location: school.location,
        district: school.district,
        state: school.state,
        principalName: school.principal_name,
        principalContact: school.principal_contact,
        assignedMentorId: assignment?.mentor_id,
        assignedMentorName: mentorUser?.full_name,
        assignedMentorAvatar: mentorUser?.avatar_url,
        assignedMentorEmail: mentorUser?.email,
        studentsCount,
        teachersCount,
        partnershipStartDate: assignment?.assigned_at,
        partnershipStatus: assignment ? PartnershipStatus.ACTIVE : PartnershipStatus.PENDING,
        lastContactDate: school.last_contact_date,
        programsEnrolled: school.programs_enrolled || [],
      };
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: partnerships,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getPartnership(schoolId: string): Promise<PartnershipDetailsDto> {
    const { data: school, error: schoolError } = await this.supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) {
      throw new NotFoundException('School not found');
    }

    // Get student profiles for this school
    const { data: schoolStudents } = await this.supabase
      .from('student_profiles')
      .select('user_id')
      .eq('school_id', schoolId);

    const studentUserIds = (schoolStudents || []).map(s => s.user_id).filter(Boolean);

    // Get assignments for these students
    const { data: assignments } = await this.supabase
      .from('mentor_student_assignments')
      .select('student_id, mentor_id, assigned_at')
      .in('student_id', studentUserIds)
      .eq('status', 'active')
      .limit(1);

    const currentAssignment = assignments?.[0];

    let assignedMentor: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      designation: string;
      department: string;
      contactNumber?: string;
      assignmentDate: string;
    } | undefined = undefined;

    if (currentAssignment) {
      const { data: mentorProfile } = await this.supabase
        .from('hei_mentor_profiles')
        .select('id, user_id, designation, department, contact_number')
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
            contactNumber: mentorProfile.contact_number,
            assignmentDate: currentAssignment.assigned_at,
          };
        }
      }
    }

    const [studentsData, teachersData, sessions, assignmentsData] = await Promise.all([
      this.supabase.from('student_profiles').select('id, class').eq('school_id', schoolId),
      this.supabase.from('teacher_profiles').select('id, subject').eq('school_id', schoolId),
      this.supabase.from('mentoring_schedules').select('id').eq('school_id', schoolId),
      this.supabase.from('assignments').select('id').eq('school_id', schoolId),
    ]);

    const gradeDistribution = (studentsData.data || []).reduce((acc, student) => {
      const grade = student.class || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const subjectDistribution = (teachersData.data || []).reduce((acc, teacher) => {
      const subject = teacher.subject || 'Unknown';
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
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
        schoolType: school.school_type,
        infrastructure: school.infrastructure,
        partnershipStatus: currentAssignment ? PartnershipStatus.ACTIVE : PartnershipStatus.PENDING,
        partnershipStartDate: currentAssignment?.assigned_at,
      },
      assignedMentor,
      mentorHistory: [],
      students: {
        total: studentsData.data?.length || 0,
        gradeDistribution: Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count })),
      },
      teachers: {
        total: teachersData.data?.length || 0,
        subjectDistribution: Object.entries(subjectDistribution).map(([subject, count]) => ({ subject, count })),
      },
      statistics: {
        totalMentoringSessions: sessions.data?.length || 0,
        totalAssignmentsCreated: assignmentsData.data?.length || 0,
        studentEngagementRate: 75,
        teacherParticipationRate: 85,
      },
    };
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

  /* ---------- ANNOUNCEMENTS ---------- */



  
/* ---------- ANNOUNCEMENTS ---------- */


async getAnnouncements(
  createdBy: string,
  pagination: { page: number; limit: number }
): Promise<PaginatedAnnouncementListDto> {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  // Get HEI ID
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
  // Get HEI ID
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
