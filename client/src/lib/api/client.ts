// src/lib/api/client.ts
//
// Lean API client for the UK-GSMP backend.
// All requests include credentials: 'include' to send httpOnly cookies.

import {
  APIResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
  SubmitAssessmentRequest,
  AssessmentResult,
  ScheduleSessionRequest,
  MentoringSession,
  CreateAssignmentRequest,
  Assignment,
  Submission,
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000/api';

/**
 * Core fetch wrapper — every request sends cookies automatically.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<APIResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include', // Critical: sends httpOnly access_token cookie
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        error: errorBody.message || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

/**
 * Multipart fetch wrapper for file uploads — no Content-Type header
 * (browser sets it with boundary automatically).
 */
async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
): Promise<APIResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // No Content-Type header — browser adds multipart boundary
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        error: errorBody.message || `Upload failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (err: any) {
    return { error: err.message || 'Upload error' };
  }
}

// ── Auth ───────────────────────────────────────────────

export const apiClient = {
  /** Login via Supabase (backend sets httpOnly cookie) */
  login: (body: LoginRequest) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Register a new user */
  register: (body: RegisterRequest) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Logout (backend clears httpOnly cookie) */
  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),

  /** Get authenticated user's profile from JWT cookie */
  getProfile: () =>
    request<{ user: UserProfile }>('/auth/profile'),

  /** Public health check */
  healthCheck: () =>
    request<{ status: string }>('/auth/health'),

  // ── Assessment ─────────────────────────────────────────

  /** Submit Holland RIASEC assessment (STUDENT) */
  submitAssessment: (body: SubmitAssessmentRequest) =>
    request<AssessmentResult>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // ── Mentoring ──────────────────────────────────────────

  /** Schedule a mentoring session (HEI_MENTOR) */
  scheduleSession: (body: ScheduleSessionRequest) =>
    request<MentoringSession>('/mentoring/schedule', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // ── Assignments ────────────────────────────────────────

  /** Create a new assignment (TEACHER / HEI_MENTOR) */
  createAssignment: (body: CreateAssignmentRequest) =>
    request<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Submit homework file for an assignment (STUDENT) */
  submitHomework: (assignmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadRequest<Submission>(`/assignments/${assignmentId}/submit`, formData);
  },

  // ── GET endpoints ──────────────────────────────────────

  /** List assignments (teacher sees own, student sees all) */
  getAssignments: () =>
    request<Assignment[]>('/assignments'),

  /** List my submissions (student) */
  getMySubmissions: () =>
    request<Submission[]>('/assignments/my-submissions'),

  /** List submissions for a specific assignment (teacher) */
  getAssignmentSubmissions: (assignmentId: string) =>
    request<Submission[]>(`/assignments/${assignmentId}/submissions`),

  /** List mentoring sessions for current user */
  getMentoringSessions: () =>
    request<any[]>('/mentoring/sessions'),

  /** Get latest assessment results (student) */
  getAssessmentResults: () =>
    request<any>('/assessment/results'),

  // ── Mentor-Student Linking ─────────────────────────────

  /** List available mentors (student) */
  getAvailableMentors: () =>
    request<any[]>('/mentoring/available-mentors'),

  /** Choose a mentor (student) */
  chooseMentor: (mentorId: string) =>
    request<any>('/mentoring/choose-mentor', {
      method: 'POST',
      body: JSON.stringify({ mentor_id: mentorId }),
    }),

  /** Get my current mentor (student) */
  getMyMentor: () =>
    request<any>('/mentoring/my-mentor'),

  /** Get my mentees (mentor) */
  getMyMentees: () =>
    request<any[]>('/mentoring/my-mentees'),
};