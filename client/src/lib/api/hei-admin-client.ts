// client/src/lib/api/hei-admin-client.ts

import {
  APIResponse,
  HEIAdminDashboard,
  DashboardStats,
  TrendsData,
  HEIMentor,
  MentorListItem,
  MentorDetails,
  MentorCapacity,
  MentorFilters,
  UnassignedSchool,
  MentorAssignment,
  CreateAssignment,
  ReassignMentor,
  SchoolPartnership,
  PartnershipDetails,
  PartnershipOverviewStats,
  PartnershipFilters,
  Announcement,
  CreateAnnouncement,
  AnnouncementRecipientSummary,
  PaginationParams,
  PaginatedResponse,
  MentorStatus,
  PartnershipStatus,
} from '@/types/hei-admin-types';

class HEIAdminAPIClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        data: data.data || data,
        success: true,
        message: data.message,
      };
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        error: error.message || 'An unexpected error occurred',
        success: false,
      };
    }
  }

  /* ---------- DASHBOARD ---------- */

  async getDashboard(): Promise<APIResponse<HEIAdminDashboard>> {
    return this.request<HEIAdminDashboard>('/hei-admin/dashboard');
  }

  async getStats(): Promise<APIResponse<DashboardStats>> {
    return this.request<DashboardStats>('/hei-admin/stats');
  }

  async getTrendsData(): Promise<APIResponse<TrendsData>> {
    return this.request<TrendsData>('/hei-admin/trends');
  }

  /* ---------- MENTORS ---------- */

  async getMentors(
    filters?: MentorFilters,
    pagination?: PaginationParams
  ): Promise<APIResponse<PaginatedResponse<MentorListItem>>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.workload) queryParams.append('workload', filters.workload);
    if (filters?.expertise) queryParams.append('expertise', filters.expertise);
    if (filters?.search) queryParams.append('search', filters.search);
    if (pagination?.page) queryParams.append('page', pagination.page.toString());
    if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<MentorListItem>>(
      `/hei-admin/mentors${query ? `?${query}` : ''}`
    );
  }

  async getMentor(mentorId: string): Promise<APIResponse<MentorDetails>> {
    return this.request<MentorDetails>(`/hei-admin/mentors/${mentorId}`);
  }

  async updateMentorStatus(
    mentorId: string,
    status: MentorStatus
  ): Promise<APIResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/hei-admin/mentors/${mentorId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getMentorCapacity(mentorId: string): Promise<APIResponse<MentorCapacity>> {
    return this.request<MentorCapacity>(`/hei-admin/mentors/${mentorId}/capacity`);
  }

  async getAvailableMentors(): Promise<APIResponse<any[]>> {
    return this.request<any[]>('/hei-admin/mentors/available');
  }

  /* ---------- ASSIGNMENTS ---------- */

  async getUnassignedSchools(): Promise<APIResponse<UnassignedSchool[]>> {
    return this.request<UnassignedSchool[]>('/hei-admin/assignments/unassigned-schools');
  }

  async createAssignment(data: CreateAssignment): Promise<APIResponse<MentorAssignment[]>> {
    return this.request<MentorAssignment[]>('/hei-admin/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reassignMentor(data: ReassignMentor): Promise<APIResponse<MentorAssignment>> {
    return this.request<MentorAssignment>('/hei-admin/assignments/reassign', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeAssignment(
    assignmentId: string,
    reason?: string
  ): Promise<APIResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/hei-admin/assignments/${assignmentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  async getAssignmentHistory(
    schoolId?: string,
    mentorId?: string
  ): Promise<APIResponse<MentorAssignment[]>> {
    const queryParams = new URLSearchParams();
    if (schoolId) queryParams.append('schoolId', schoolId);
    if (mentorId) queryParams.append('mentorId', mentorId);

    const query = queryParams.toString();
    return this.request<MentorAssignment[]>(
      `/hei-admin/assignments/history${query ? `?${query}` : ''}`
    );
  }

  /* ---------- PARTNERSHIPS ---------- */

  async getPartnerships(
    params?: PartnershipFilters & PaginationParams
  ): Promise<APIResponse<{ partnerships: SchoolPartnership[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status as string);
    if (params?.mentorId) queryParams.append('mentorId', params.mentorId);
    if (params?.district) queryParams.append('district', params.district);
    if (params?.state) queryParams.append('state', params.state);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request<{ partnerships: SchoolPartnership[]; total: number; page: number; limit: number }>(
      `/hei-admin/partnerships${query ? `?${query}` : ''}`
    );
  }

  async getPartnership(schoolId: string): Promise<APIResponse<PartnershipDetails>> {
    return this.request<PartnershipDetails>(`/hei-admin/partnerships/${schoolId}`);
  }

  // ✅ FIXED: Added both method names for compatibility
  async getPartnershipStats(): Promise<APIResponse<PartnershipOverviewStats>> {
    return this.request<PartnershipOverviewStats>('/hei-admin/partnerships/overview-stats');
  }

  // ✅ FIXED: Alias method for backward compatibility
  async getPartnershipOverviewStats(): Promise<APIResponse<PartnershipOverviewStats>> {
    return this.getPartnershipStats();
  }

  async updatePartnershipStatus(
    schoolId: string,
    status: PartnershipStatus
  ): Promise<APIResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/hei-admin/partnerships/${schoolId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  /* ---------- ANNOUNCEMENTS ---------- */

  async getAnnouncements(
    page: number = 1,
    limit: number = 10
  ): Promise<APIResponse<PaginatedResponse<Announcement>>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return this.request<PaginatedResponse<Announcement>>(
      `/hei-admin/announcements?${queryParams.toString()}`
    );
  }

  async createAnnouncement(data: CreateAnnouncement): Promise<APIResponse<Announcement>> {
    return this.request<Announcement>('/hei-admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnnouncementRecipientCount(
    data: Partial<CreateAnnouncement>
  ): Promise<APIResponse<AnnouncementRecipientSummary>> {
    return this.request<AnnouncementRecipientSummary>('/hei-admin/announcements/recipient-count', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(announcementId: string): Promise<APIResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/hei-admin/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  }

  /* ---------- EXPORT FUNCTIONS ---------- */

  async exportMentorsData(): Promise<APIResponse<Blob>> {
    return this.request<Blob>('/hei-admin/mentors/export', {
      headers: {
        'Accept': 'text/csv',
      },
    });
  }

  async exportPartnershipsData(): Promise<APIResponse<Blob>> {
    return this.request<Blob>('/hei-admin/partnerships/export', {
      headers: {
        'Accept': 'text/csv',
      },
    });
  }
}

export const heiAdminAPI = new HEIAdminAPIClient();
export { HEIAdminAPIClient };
export default heiAdminAPI;
