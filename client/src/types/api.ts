// src/types/api.ts
// Strictly typed interfaces matching the backend database schema.

// ── Enums ──────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'TEACHER' | 'HEI_MENTOR' | 'SCHOOL_ADMIN' | 'HEI_ADMIN';
export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

// ── User ───────────────────────────────────────────────

export interface UserProfile {
  sub: string;           // auth.users UUID
  email?: string;
  role?: string;         // 'authenticated'
  user_metadata?: {
    role?: UserRole;     // Our custom role
    full_name?: string;
    [key: string]: any;
  };
  app_metadata?: Record<string, any>;
}

// ── Assessment ─────────────────────────────────────────

export interface QuestionResponse {
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  score: number; // 1-5
}

export interface SubmitAssessmentRequest {
  responses: QuestionResponse[];
}

export interface DimensionResult {
  code: string;
  label: string;
  score: number;
}

export interface AssessmentResult {
  id: string;
  riasecCode: string;
  scores: Record<string, number>;
  topDimensions: DimensionResult[];
  matchedCareers: string[];
  completedAt: string;
}

// ── Mentoring ──────────────────────────────────────────

export interface ScheduleSessionRequest {
  student_id: string;
  scheduled_time: string; // ISO 8601
}

export interface MentoringSession {
  id: string;
  mentor_id: string;
  student_id: string;
  scheduled_time: string;
  google_meet_link: string | null;
  status: SessionStatus;
  created_at: string;
}

// ── Assignments ────────────────────────────────────────

export interface CreateAssignmentRequest {
  title: string;
  ncert_reference?: string;
  marking_criteria?: string;
  due_date?: string; // ISO 8601
}

export interface Assignment {
  id: string;
  creator_id: string;
  title: string;
  ncert_reference: string | null;
  marking_criteria: string | null;
  due_date: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_path: string;
  grade: string | null;
  percentage: number | null;
  submitted_at: string;
}

// ── Auth ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  school_id?: string;
}

export interface AuthResponse {
  access_token?: string;
  user?: UserProfile;
}

// ── API Response Wrapper ───────────────────────────────

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}