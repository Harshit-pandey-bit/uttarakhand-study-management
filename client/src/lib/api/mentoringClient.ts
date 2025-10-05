// src/lib/api/mentoringClient.ts

import { 
  APIResponse,
  MentoringDashboard,
  MentoringStats,
  Session,
  SessionList,
  CreateSession,
  UpdateSession,
  SessionFeedback,
  Mentor,
  MentorAvailability,
  MentorMatchRequest,
  WhatsAppGroup,
  WhatsAppQuestion,
  CreateQuestion,
  ChatRoom,
  ChatMessage,
  SendMessage,
  CreateChatRoom,
  TimetableSlot,
  WeeklyTimetable,
  AvailableSlot,
  BookSession,
  SessionFilters,
  PaginationMeta
} from '@/types/mentoring';

class MentoringAPIClient {
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
        credentials: 'include', // Include httpOnly cookies
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
      console.error('Mentoring API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /* ---------- DASHBOARD METHODS ---------- */
  async getDashboard(): Promise<APIResponse<MentoringDashboard>> {
    return this.request('/mentoring/dashboard');
  }

  async getStats(): Promise<APIResponse<MentoringStats>> {
    return this.request('/mentoring/stats');
  }

  async getRecentActivity(): Promise<APIResponse<any[]>> {
    return this.request('/mentoring/recent-activity');
  }

  /* ---------- SESSION MANAGEMENT ---------- */
  async getSessions(
    filters: SessionFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<APIResponse<SessionList>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    });
    return this.request(`/mentoring/sessions?${params.toString()}`);
  }

  async getSession(sessionId: string): Promise<APIResponse<Session>> {
    return this.request(`/mentoring/sessions/${sessionId}`);
  }

  async createSession(sessionData: CreateSession): Promise<APIResponse<Session>> {
    return this.request('/mentoring/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(
    sessionId: string, 
    updateData: UpdateSession
  ): Promise<APIResponse<Session>> {
    return this.request(`/mentoring/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteSession(sessionId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async joinSession(sessionId: string): Promise<APIResponse<{ meetingLink: string }>> {
    return this.request(`/mentoring/sessions/${sessionId}/join`, {
      method: 'POST',
    });
  }

  async leaveSession(sessionId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/sessions/${sessionId}/leave`, {
      method: 'POST',
    });
  }

  async submitSessionFeedback(
    sessionId: string, 
    feedback: SessionFeedback
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/sessions/${sessionId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  /* ---------- MENTOR MANAGEMENT ---------- */
  async getMentors(): Promise<APIResponse<Mentor[]>> {
    return this.request('/mentoring/mentors');
  }

  async getMentor(mentorId: string): Promise<APIResponse<Mentor>> {
    return this.request(`/mentoring/mentors/${mentorId}`);
  }

  async getMentorAvailability(mentorId: string): Promise<APIResponse<MentorAvailability[]>> {
    return this.request(`/mentoring/mentors/${mentorId}/availability`);
  }

  async getAllMentorsAvailability(): Promise<APIResponse<any>> {
    return this.request('/mentoring/mentors/availability');
  }

  async submitMentorMatchRequest(
    request: MentorMatchRequest
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request('/mentoring/mentors/match-request', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /* ---------- TIMETABLE & SCHEDULING ---------- */
  async getTimetable(): Promise<APIResponse<WeeklyTimetable>> {
    return this.request('/mentoring/timetable');
  }

  async getWeeklyTimetable(weekStart: string): Promise<APIResponse<WeeklyTimetable>> {
    return this.request(`/mentoring/timetable/week/${weekStart}`);
  }

  async getAvailableSlots(
    mentorId?: string,
    date?: string
  ): Promise<APIResponse<AvailableSlot[]>> {
    const params = new URLSearchParams();
    if (mentorId) params.append('mentorId', mentorId);
    if (date) params.append('date', date);
    return this.request(`/mentoring/schedule/available-slots?${params.toString()}`);
  }

  async bookSession(bookingData: BookSession): Promise<APIResponse<Session>> {
    return this.request('/mentoring/schedule/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  /* ---------- WHATSAPP GROUPS ---------- */
  async getWhatsAppGroups(): Promise<APIResponse<WhatsAppGroup[]>> {
    return this.request('/mentoring/whatsapp-groups');
  }

  async joinWhatsAppGroup(groupId: string): Promise<APIResponse<{ 
    success: boolean; 
    whatsappLink: string; 
  }>> {
    return this.request(`/mentoring/whatsapp-groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async leaveWhatsAppGroup(groupId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/whatsapp-groups/${groupId}/leave`, {
      method: 'DELETE',
    });
  }

  async getWhatsAppQuestions(): Promise<APIResponse<WhatsAppQuestion[]>> {
    return this.request('/mentoring/whatsapp-groups/questions');
  }

  async submitWhatsAppQuestion(
    question: CreateQuestion
  ): Promise<APIResponse<WhatsAppQuestion>> {
    return this.request('/mentoring/whatsapp-groups/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  /* ---------- CHAT SYSTEM ---------- */
  async getChatRooms(): Promise<APIResponse<ChatRoom[]>> {
    return this.request('/mentoring/chat/rooms');
  }

  async getChatMessages(
    roomId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<APIResponse<{ messages: ChatMessage[]; pagination: PaginationMeta }>> {
    return this.request(`/mentoring/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(roomId: string, message: SendMessage): Promise<APIResponse<ChatMessage>> {
    return this.request(`/mentoring/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async createChatRoom(roomData: CreateChatRoom): Promise<APIResponse<ChatRoom>> {
    return this.request('/mentoring/chat/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async addReaction(
    roomId: string,
    messageId: string,
    emoji: string
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/chat/rooms/${roomId}/messages/${messageId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ emoji, action: 'add' }),
    });
  }

  async removeReaction(
    roomId: string,
    messageId: string,
    emoji: string
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/chat/rooms/${roomId}/messages/${messageId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ emoji, action: 'remove' }),
    });
  }

  /* ---------- GOOGLE MEET INTEGRATION ---------- */
  async createGoogleMeet(sessionId: string): Promise<APIResponse<{
    meetLink: string;
    calendarEventId: string;
  }>> {
    return this.request(`/mentoring/google-meet/create/${sessionId}`, {
      method: 'POST',
    });
  }

  async updateGoogleMeet(
    sessionId: string,
    updateData: any
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/google-meet/update/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteGoogleMeet(sessionId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/google-meet/delete/${sessionId}`, {
      method: 'DELETE',
    });
  }

  /* ---------- VIDEO SESSIONS ---------- */
  async startVideoSession(sessionId: string): Promise<APIResponse<{
    roomId: string;
    token: string;
    meetingLink: string;
  }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/start`, {
      method: 'POST',
    });
  }

  async joinVideoSession(sessionId: string): Promise<APIResponse<{
    roomId: string;
    token: string;
  }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/join`, {
      method: 'POST',
    });
  }

  async endVideoSession(sessionId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/end`, {
      method: 'POST',
    });
  }

  async getVideoSessionStatus(sessionId: string): Promise<APIResponse<{
    isActive: boolean;
    participants: number;
    startTime?: string;
  }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/status`);
  }

  async recordVideoSession(sessionId: string): Promise<APIResponse<{ 
    recordingId: string;
    recordingUrl: string;
  }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/record`, {
      method: 'POST',
    });
  }

  async stopRecording(sessionId: string): Promise<APIResponse<{
    recordingUrl: string;
  }>> {
    return this.request(`/mentoring/video-sessions/${sessionId}/stop-recording`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const mentoringAPI = new MentoringAPIClient();
export default mentoringAPI;
