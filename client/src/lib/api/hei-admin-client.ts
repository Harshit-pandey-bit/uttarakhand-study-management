// src/lib/api/hei-admin-client.ts

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
    return this.request('/hei-admin/dashboard');
  }

  async getStats(): Promise<APIResponse<DashboardStats>> {
    return this.request('/hei-admin/stats');
  }

  async getTrendsData(): Promise<APIResponse<TrendsData>> {
    return this.request('/hei-admin/trends');
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
    return this.request(`/hei-admin/mentors/${mentorId}`);
  }

  async updateMentorStatus(
    mentorId: string,
    status: MentorStatus
  ): Promise<APIResponse<void>> {
    return this.request(`/hei-admin/mentors/${mentorId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getMentorCapacity(mentorId: string): Promise<APIResponse<MentorCapacity>> {
    return this.request(`/hei-admin/mentors/${mentorId}/capacity`);
  }

  async getAvailableMentors(): Promise<APIResponse<HEIMentor[]>> {
    return this.request('/hei-admin/mentors/available');
  }

  /* ---------- ASSIGNMENTS ---------- */

  async getUnassignedSchools(): Promise<APIResponse<UnassignedSchool[]>> {
    return this.request('/hei-admin/assignments/unassigned-schools');
  }

  async createAssignment(data: CreateAssignment): Promise<APIResponse<MentorAssignment[]>> {
    return this.request('/hei-admin/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reassignMentor(data: ReassignMentor): Promise<APIResponse<MentorAssignment>> {
    return this.request('/hei-admin/assignments/reassign', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeAssignment(
    assignmentId: string,
    reason?: string
  ): Promise<APIResponse<void>> {
    return this.request(`/hei-admin/assignments/${assignmentId}`, {
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
    return this.request(
      `/hei-admin/assignments/history${query ? `?${query}` : ''}`
    );
  }

  /* ---------- PARTNERSHIPS ---------- */

  async getPartnerships(
    filters?: PartnershipFilters,
    pagination?: PaginationParams
  ): Promise<APIResponse<PaginatedResponse<SchoolPartnership>>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.mentorId) queryParams.append('mentorId', filters.mentorId);
    if (filters?.district) queryParams.append('district', filters.district);
    if (filters?.state) queryParams.append('state', filters.state);
    if (filters?.search) queryParams.append('search', filters.search);
    if (pagination?.page) queryParams.append('page', pagination.page.toString());
    if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<SchoolPartnership>>(
      `/hei-admin/partnerships${query ? `?${query}` : ''}`
    );
  }

  async getPartnership(schoolId: string): Promise<APIResponse<PartnershipDetails>> {
    return this.request(`/hei-admin/partnerships/${schoolId}`);
  }

  async getPartnershipOverviewStats(): Promise<APIResponse<PartnershipOverviewStats>> {
    return this.request('/hei-admin/partnerships/overview-stats');
  }

  async updatePartnershipStatus(
    schoolId: string,
    status: PartnershipStatus
  ): Promise<APIResponse<void>> {
    return this.request(`/hei-admin/partnerships/${schoolId}/status`, {
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
    return this.request('/hei-admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnnouncementRecipientCount(
    data: Partial<CreateAnnouncement>
  ): Promise<APIResponse<AnnouncementRecipientSummary>> {
    return this.request('/hei-admin/announcements/recipient-count', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(announcementId: string): Promise<APIResponse<void>> {
    return this.request(`/hei-admin/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  }

  /* ---------- EXPORT FUNCTIONS ---------- */

  async exportMentorsData(): Promise<APIResponse<string>> {
    return this.request('/hei-admin/mentors/export', {
      headers: {
        'Accept': 'text/csv',
      },
    });
  }

  async exportPartnershipsData(): Promise<APIResponse<string>> {
    return this.request('/hei-admin/partnerships/export', {
      headers: {
        'Accept': 'text/csv',
      },
    });
  }
}

export const heiAdminAPI = new HEIAdminAPIClient();
export { HEIAdminAPIClient };
export default heiAdminAPI;
