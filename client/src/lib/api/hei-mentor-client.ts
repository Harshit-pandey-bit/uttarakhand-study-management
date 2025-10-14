// src/lib/hei-mentor-client.ts
import type {
  HEIMentorDashboardData,
  MentoringSession,
  AssignedStudent,
  Assignment,
  AssignmentSubmission,
  ChatRoom,
  ChatMessage,
  School,
  SessionListResponse,
  StudentListResponse,
  AssignmentListResponse,
  ChatRoomListResponse,
  CreateSessionRequest,
  UpdateSessionRequest,
  CreateAssignmentRequest,
  GradeSubmissionRequest,
  SendMessageRequest,
  UpdateMentorProfileRequest,
  SessionFilters,
  StudentFilters,
  AssignmentFilters
} from '@/types/hei-mentor';

// API Response interface for consistency
interface APIResponse<T> {
  data?: T;
  error?: string;
}

class HEIMentorAPIClient {
  private baseURL = 'http://localhost:3001/api';

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
        credentials: 'include', // Include httpOnly cookies for authentication
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('HEI-Mentor API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /* ---------- DASHBOARD METHODS ---------- */
  async getDashboard(): Promise<APIResponse<HEIMentorDashboardData>> {
    return this.request('/mentoring/hei-mentor/dashboard');
  }

  /* ---------- PROFILE METHODS ---------- */
  async getMentorProfile(): Promise<APIResponse<any>> {
    return this.request('/mentoring/hei-mentor/profile');
  }

  async updateMentorProfile(data: UpdateMentorProfileRequest): Promise<APIResponse<any>> {
    return this.request('/mentoring/hei-mentor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /* ---------- SESSION MANAGEMENT ---------- */
  async getSessions(
    filters: SessionFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<APIResponse<SessionListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.request(`/mentoring/hei-mentor/sessions?${params.toString()}`);
  }

  async getSessionById(sessionId: string): Promise<APIResponse<MentoringSession>> {
    return this.request(`/mentoring/hei-mentor/sessions/${sessionId}`);
  }

  async createSession(data: CreateSessionRequest): Promise<APIResponse<MentoringSession>> {
    return this.request('/mentoring/hei-mentor/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSession(
    sessionId: string,
    data: UpdateSessionRequest
  ): Promise<APIResponse<MentoringSession>> {
    return this.request(`/mentoring/hei-mentor/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /* ---------- STUDENT MANAGEMENT ---------- */
  async getAssignedStudents(
    filters: StudentFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<APIResponse<StudentListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.request(`/mentoring/hei-mentor/students?${params.toString()}`);
  }

  async getStudentById(studentId: string): Promise<APIResponse<AssignedStudent>> {
    return this.request(`/mentoring/hei-mentor/students/${studentId}`);
  }

  /* ---------- SCHOOL MANAGEMENT ---------- */
  async getAssignedSchools(): Promise<APIResponse<School[]>> {
    return this.request('/mentoring/hei-mentor/schools');
  }

  async getSchoolById(schoolId: string): Promise<APIResponse<School>> {
    return this.request(`/mentoring/hei-mentor/schools/${schoolId}`);
  }

  /* ---------- ASSIGNMENT MANAGEMENT ---------- */
  async getAssignments(
    filters: AssignmentFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<APIResponse<AssignmentListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.request(`/assignments/hei-mentor?${params.toString()}`);
  }

  async createAssignment(data: CreateAssignmentRequest): Promise<APIResponse<Assignment>> {
    return this.request('/assignments/hei-mentor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAssignment(
    assignmentId: string,
    data: CreateAssignmentRequest
  ): Promise<APIResponse<Assignment>> {
    return this.request(`/assignments/hei-mentor/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAssignment(assignmentId: string): Promise<APIResponse<void>> {
    return this.request(`/assignments/hei-mentor/${assignmentId}`, {
      method: 'DELETE',
    });
  }

  /* ---------- SUBMISSION MANAGEMENT ---------- */
  async getSubmissions(assignmentId: string): Promise<APIResponse<AssignmentSubmission[]>> {
    return this.request(`/assignments/hei-mentor/${assignmentId}/submissions`);
  }

  async gradeSubmission(
    submissionId: string,
    gradeData: GradeSubmissionRequest
  ): Promise<APIResponse<AssignmentSubmission>> {
    return this.request(`/assignments/hei-mentor/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  /* ---------- ASSIGNMENT STATS ---------- */
  async getAssignmentStats(): Promise<APIResponse<any>> {
    return this.request('/assignments/hei-mentor/stats');
  }

  /* ---------- CHAT SYSTEM ---------- */
  async getChatRooms(): Promise<APIResponse<ChatRoomListResponse>> {
    return this.request('/mentoring/hei-mentor/chat/rooms');
  }

  async getChatMessages(
    roomId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<APIResponse<ChatMessage[]>> {
    return this.request(`/mentoring/hei-mentor/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(
    roomId: string,
    messageData: SendMessageRequest
  ): Promise<APIResponse<ChatMessage>> {
    return this.request(`/mentoring/hei-mentor/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  /* ---------- UTILITY METHODS ---------- */
  async refreshData(): Promise<void> {
    // Helper method to refresh cached data if needed
    console.log('Refreshing HEI-Mentor data...');
  }

  // Helper method to handle errors consistently
  handleError(response: APIResponse<any>): void {
    if (response.error) {
      console.error('HEI-Mentor API Error:', response.error);
      throw new Error(response.error);
    }
  }

  // Helper method to extract data or throw error
  extractData<T>(response: APIResponse<T>): T {
    if (response.error) {
      throw new Error(response.error);
    }
    if (!response.data) {
      throw new Error('No data received from API');
    }
    return response.data;
  }
}

// Export singleton instance following the same pattern as the mentoring client
export const heiMentorAPI = new HEIMentorAPIClient();
export default heiMentorAPI;
