// src/types/hei-mentor.ts
// Production-ready types matching database schema

// ===== CORE USER & PROFILE TYPES =====
export interface User {
  id: string; // uuid
  email: string;
  full_name: string;
  phone_number?: string;
  user_type: 'student' | 'teacher' | 'school_admin' | 'hei_mentor' | 'hei_admin' | 'super_admin';
  profile_picture?: string;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HEIMentorProfile {
  id: string; // uuid
  user_id: string; // foreign key to users
  hei_id: string; // foreign key to heis
  employee_id?: string;
  designation?: string;
  department?: string;
  expertise: string[]; // ARRAY
  qualification?: string;
  experience_years?: number;
  research_interests: string[]; // ARRAY
  max_students: number; // default 30
  created_at: string;
  updated_at: string;
}

export interface HEI {
  id: string; // uuid
  name: string;
  type?: string;
  location?: string;
  district?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

// ===== MENTORING TYPES =====
export interface MentoringSession {
  id: string; // uuid
  title: string;
  description?: string;
  mentor_id: string; // foreign key to users
  session_date: string; // timestamp
  duration: number; // default 60 minutes
  session_type: string; // varchar(20)
  subject?: string;
  max_participants: number; // default 1
  meeting_link?: string;
  meeting_room?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  session_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionParticipant {
  id: string; // uuid
  session_id: string; // foreign key to mentoring_sessions
  student_id: string; // foreign key to users
  registration_date: string;
  attendance_status: 'registered' | 'attended' | 'absent';
  feedback?: string;
  rating?: number;
  student?: User; // populated when needed
}

export interface MentorStudentAssignment {
  id: string; // uuid
  mentor_id: string; // foreign key to users
  student_id: string; // foreign key to users
  assigned_by?: string; // foreign key to users
  status: 'active' | 'inactive' | 'completed';
  assigned_at: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ===== ASSIGNMENT TYPES =====
export interface Assignment {
  id: string; // uuid
  title: string;
  description?: string;
  subject: string;
  class_level: string; // varchar(10)
  teacher_id?: string; // foreign key to users
  due_date: string; // timestamp
  total_marks: number; // default 100
  difficulty: 'easy' | 'medium' | 'hard';
  ai_generated: boolean;
  ncert_chapter?: string;
  time_estimate?: number;
  submission_format: string[]; // ARRAY, default ['pdf']
  questions?: any; // jsonb
  teacher_notes?: string;
  ai_insights?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string; // uuid
  assignment_id: string; // foreign key to assignments
  student_id: string; // foreign key to users
  submission_files?: string[]; // ARRAY
  submission_text?: string;
  submitted_at: string;
  score?: number;
  feedback?: string;
  grade?: string; // varchar(5)
  graded_by?: string; // foreign key to users
  graded_at?: string;
  status: 'submitted' | 'graded' | 'returned';
  file_urls?: string[]; // ARRAY
  created_at: string;
  updated_at: string;
}

// ===== CHAT TYPES =====
export interface ChatRoom {
  id: string; // uuid
  name: string;
  description?: string;
  room_type: 'direct' | 'group' | 'broadcast';
  created_by: string; // foreign key to users
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatRoomParticipant {
  id: string; // uuid
  room_id: string; // foreign key to chat_rooms
  user_id: string; // foreign key to users
  joined_at: string;
  last_seen?: string;
  unread_count: number;
  is_admin: boolean;
  is_active: boolean;
}

export interface ChatMessage {
  id: string; // uuid
  room_id: string; // foreign key to chat_rooms
  sender_id: string; // foreign key to users
  content: string;
  message_type: 'text' | 'file' | 'image' | 'voice';
  file_url?: string;
  reply_to_id?: string; // foreign key to chat_messages
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ===== SCHOOL TYPES =====
export interface School {
  id: string; // uuid
  name: string;
  code?: string;
  type?: string;
  location?: string;
  district?: string;
  principal_name?: string;
  total_students: number; // default 0
  is_active: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: string; // uuid
  user_id: string; // foreign key to users
  school_id?: string; // foreign key to schools
  class_level?: string;
  section?: string;
  roll_number?: string;
  parent_name?: string;
  parent_contact?: string;
  parent_email?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  blood_group?: string;
  medical_conditions?: string;
  interests?: string[]; // ARRAY
  career_aspirations?: string[]; // ARRAY
  learning_style?: string;
  academic_performance?: any; // jsonb
  created_at: string;
  updated_at: string;
}

// ===== CAREER TYPES =====
export interface HollandResult {
  id: string; // uuid
  student_id: string; // foreign key to users
  scores: any; // jsonb
  personality_code: string; // varchar(6)
  top_categories: string[]; // ARRAY
  matched_careers: string[]; // ARRAY
  completion_time: number;
  completed_at: string;
}

// ===== DASHBOARD & STATS TYPES =====
export interface HEIMentorDashboardStats {
  // Student Progress Metrics (actionable)
  assignedStudents: number;
  studentsActiveThisWeek: number;
  studentsCompletedHollandTest: number;
  studentsNeedingAttention: number;

  // Assignment & Content Metrics (actionable)
  pendingSubmissions: number;
  ungradedAssignments: number;

  // Session Metrics (current/upcoming only)
  upcomingSessionsThisWeek: number;

  // Career Guidance Progress
  studentsWithCareerPlans: number;
  averageStudentProgress: number;
}

export interface HEIMentorDashboardData {
  mentor: {
    user: User;
    profile: HEIMentorProfile;
    hei: HEI;
  };
  stats: HEIMentorDashboardStats;
  upcomingSessions: (MentoringSession & {
    participants: (SessionParticipant & { student: User })[];
  })[];
  recentActivity: {
    id: string;
    type: 'assignment_submitted' | 'session_completed' | 'message_received' | 'student_joined';
    title: string;
    description: string;
    student_name?: string;
    timestamp: string;
    is_read: boolean;
  }[];
  assignedSchools: (School & {
    studentsAssigned: number;
    averageProgress: number;
  })[];
  pendingActions: {
    id: string;
    type: 'grade_assignment' | 'schedule_session' | 'respond_message';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    count?: number;
  }[];
}

export interface AssignedStudent {
  user: User;
  profile: StudentProfile;
  school: School;
  assignment: MentorStudentAssignment;
  stats: {
    assignmentProgress: number;
    completedAssignments: number;
    totalAssignments: number;
    sessionsAttended: number;
    averageGrade: number;
    lastActivity: string;
  };
  hollandResult?: HollandResult;
}

// ===== API REQUEST/RESPONSE TYPES =====
export interface CreateSessionRequest {
  title: string;
  description?: string;
  student_ids: string[];
  session_date: string;
  duration: number;
  session_type: string;
  subject?: string;
  max_participants?: number;
  meeting_room?: string;
}

export interface UpdateSessionRequest {
  title?: string;
  description?: string;
  session_date?: string;
  duration?: number;
  session_notes?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link?: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  subject: string;
  class_level: string;
  due_date: string;
  total_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ncert_chapter?: string;
  time_estimate?: number;
  submission_format: string[];
  questions?: any;
  teacher_notes?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
  grade?: string;
}

export interface SendMessageRequest {
  content: string;
  message_type: 'text' | 'file' | 'image' | 'voice';
  file_url?: string;
  reply_to_id?: string;
}

export interface UpdateMentorProfileRequest {
  designation?: string;
  department?: string;
  expertise?: string[];
  qualification?: string;
  research_interests?: string[];
  max_students?: number;
}

// ===== FILTER & SEARCH TYPES =====
export interface SessionFilters {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  session_type?: string;
  subject?: string;
  student_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface StudentFilters {
  school_id?: string;
  class_level?: string;
  subject?: string;
  status?: 'active' | 'inactive';
}

export interface AssignmentFilters {
  subject?: string;
  class_level?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'active' | 'inactive';
}

// ===== API RESPONSE WRAPPERS =====
export interface SessionListResponse {
  sessions: MentoringSession[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface StudentListResponse {
  students: AssignedStudent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AssignmentListResponse {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ChatRoomListResponse {
  rooms: (ChatRoom & {
    participants: ChatRoomParticipant[];
    lastMessage?: ChatMessage;
    unreadCount: number;
  })[];
  total: number;
}

// ===== UTILITY TYPES =====
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'registered' | 'attended' | 'absent';
export type SubmissionStatus = 'submitted' | 'graded' | 'returned';
export type AssignmentDifficulty = 'easy' | 'medium' | 'hard';
export type MessageType = 'text' | 'file' | 'image' | 'voice';
export type UserType = 'student' | 'teacher' | 'school_admin' | 'hei_mentor' | 'hei_admin' | 'super_admin';
export type Priority = 'low' | 'medium' | 'high';
export type RoomType = 'direct' | 'group' | 'broadcast';
