const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export interface SchoolOverviewDto {
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  location: string;
  district: string;
}

export interface ClassStatsDto {
  classLevel: string;
  studentCount: number;
  averageGrade: any;
  completionRate: number;
}

export interface ActivityStatsDto {
  totalActivities: number;
  recentActivities: number;
  topActivityTypes: string[];
  studentParticipation: number;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  description: string;
  badgeType: string;
  badgeColor: string;
  authorName: string;
  authorRole: string;
  priority: string;
  isPinned: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface DashboardResponseDto {
  schoolOverview: SchoolOverviewDto;
  classStats: ClassStatsDto[];
  activityStats: ActivityStatsDto;
  announcements: AnnouncementDto[];
}

export interface TeacherDto {
  id: string;
  name: string;
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experienceYears: number;
  totalStudents: number;
  joinedDate: string;
  profileImage?: string;
}

export interface TeachersResponseDto {
  teachers: TeacherDto[];
  totalTeachers: number;
  averageExperience: number;
  totalStudentsAssigned: number;
}

export interface StudentDto {
  id: string;
  name: string;
  classLevel: string;
  overallGrade: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  stemProjects: number;
  careerAspiration: string;
  profileImage?: string;
}

export interface StudentsResponseDto {
  students: StudentDto[];
  totalStudents: number;
  averageGrade: any;
  completionRate: number;
}

export interface AnnouncementFilters {
  badgeType?: string;
  priority?: string;
  pinnedOnly?: boolean;
  limit?: number;
  offset?: number;
}

class ApiService {
  private buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Very important: sends cookies for auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard APIs
  async getDashboard(): Promise<DashboardResponseDto> {
    return this.makeRequest('/school-admin/dashboard');
  }

  // Analytics APIs
  async getAnalyticsOverview() {
    return this.makeRequest('/school-admin/analytics/overview');
  }

  async getClassPerformanceAnalytics() {
    return this.makeRequest('/school-admin/analytics/class-performance');
  }

  async getStudentActivitiesAnalytics() {
    return this.makeRequest('/school-admin/analytics/student-activities');
  }

  // Teachers APIs
  async getTeachers(): Promise<TeachersResponseDto> {
    return this.makeRequest('/school-admin/teachers');
  }

  async getTeacherDetails(teacherId: string) {
    return this.makeRequest(`/school-admin/teachers/${encodeURIComponent(teacherId)}/details`);
  }

  async getTeachersStats() {
    return this.makeRequest('/school-admin/teachers/stats');
  }

  // Students APIs
  async getStudents(classLevel?: string, limit?: number, offset?: number): Promise<StudentsResponseDto> {
    const params: Record<string, any> = {};
    if (classLevel?.trim()) params.classLevel = classLevel.trim();
    if (limit && limit > 0) params.limit = limit;
    if (offset && offset >= 0) params.offset = offset;

    const query = this.buildQueryParams(params);
    const endpoint = query ? `/school-admin/students?${query}` : '/school-admin/students';

    return this.makeRequest(endpoint);
  }

  async getStudentDetails(studentId: string) {
    return this.makeRequest(`/school-admin/students/${encodeURIComponent(studentId)}/details`);
  }

  async getStudentsCount() {
    return this.makeRequest('/school-admin/stats/students-count');
  }

  // Announcements APIs
  async getAnnouncements(filters: AnnouncementFilters = {}) {
    const params: Record<string, any> = {};

    if (filters.badgeType?.trim()) params.badgeType = filters.badgeType.trim();
    if (filters.priority?.trim()) params.priority = filters.priority.trim();
    if (typeof filters.pinnedOnly === 'boolean') params.pinnedOnly = filters.pinnedOnly;
    if (filters.limit && filters.limit > 0) params.limit = filters.limit;
    if (filters.offset && filters.offset >= 0) params.offset = filters.offset;

    const query = this.buildQueryParams(params);
    const endpoint = query ? `/school-admin/announcements?${query}` : '/school-admin/announcements';

    return this.makeRequest(endpoint);
  }

  // New method: fetch HEI partnership announcements
  async getHEIPartnershipAnnouncements(limit?: number, offset?: number) {
    const params: Record<string, any> = {};
    if (limit && limit > 0) params.limit = limit;
    if (offset && offset >= 0) params.offset = offset;

    const query = this.buildQueryParams(params);
    const endpoint = query
      ? `/school-admin/announcements/hei-partnership?${query}`
      : `/school-admin/announcements/hei-partnership`;

    return this.makeRequest(endpoint);
  }

  async createAnnouncement(announcement: any) {
    return this.makeRequest('/school-admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    });
  }

  async updateAnnouncement(announcementId: string, announcement: any) {
    return this.makeRequest(`/school-admin/announcements/${encodeURIComponent(announcementId)}`, {
      method: 'PUT',
      body: JSON.stringify(announcement),
    });
  }

  async deleteAnnouncement(announcementId: string) {
    return this.makeRequest(`/school-admin/announcements/${encodeURIComponent(announcementId)}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
