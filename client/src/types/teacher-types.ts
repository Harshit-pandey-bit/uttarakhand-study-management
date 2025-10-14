// src/types/teacher-types.ts
// Updated to match exact database schema and teacher dashboard requirements

// ===== CORE USER & PROFILE TYPES =====
export interface User {
  id: string; // uuid
  email: string;
  full_name: string;
  phone_number?: string;
  role: 'student' | 'teacher' | 'school_admin' | 'hei_mentor' | 'hei_admin';
  avatar_url?: string;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfile {
  id: string; // uuid
  user_id: string; // foreign key to users
  school_id: string; // foreign key to schools
  employee_id?: string;
  subjects: string[]; // ['mathematics', 'computer_science', 'science', 'social_studies', 'languages']
  classes: string[]; // ['6', '7', '8', '9', '10', '11', '12']
  qualification?: string;
  experience_years?: number;
  joined_date?: string;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  type?: string;
  location?: string;
  district?: string;
  contact_email?: string;
  contact_phone?: string;
  principal_name?: string;
  established_year?: number;
  affiliation?: string;
  created_at: string;
  updated_at: string;
}

// ===== NCERT & CURRICULUM TYPES =====
export interface NCERTChapter {
  id: string;
  subject: string;
  class_level: string;
  chapter_number: number;
  chapter_title: string;
  topics?: string[];
  learning_objectives: string[];
  keywords?: string[];
  estimated_duration?: number; // in hours
}

export interface LessonPlanTemplate {
  id: string;
  template_type: '5E' | 'direct_instruction' | 'activity_based' | 'problem_based';
  name: string;
  description: string;
  structure: string[];
  subject_compatibility: string[];
}

export interface LessonPlan {
  id: string;
  teacher_id: string;
  subject: string;
  class_level: string;
  chapter: string;
  title: string;
  objectives: string[];
  template_type: '5E' | 'direct_instruction' | 'activity_based' | 'problem_based';
  content: {
    sections: Array<{
      name: string;
      duration?: number;
      activities: string[];
      resources?: string[];
    }>;
    assessment?: string[];
    homework?: string;
  };
  estimated_duration?: number;
  resources?: string[];
  created_at: string;
  updated_at: string;
}

// ===== ASSIGNMENT TYPES =====
export interface Question {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'short_answer' | 'long_answer' | 'fill_blank' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  class_level: string;
  chapter: string;
  marks: number;
  options?: string[]; // for MCQ
  correct_answer?: string;
  sample_answer?: string;
  learning_objective?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  class_level: string;
  chapter?: string;
  teacher_id: string;
  questions: Question[];
  total_marks: number;
  due_date: string;
  instructions?: string;
  rubric?: {
    criteria: Array<{
      name: string;
      description: string;
      max_marks: number;
    }>;
  };
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  answers: Array<{
    question_id: string;
    answer: string;
    marks_awarded?: number;
  }>;
  total_score?: number;
  percentage?: number;
  feedback?: string;
  status: 'pending' | 'submitted' | 'graded' | 'returned';
  submitted_at: string;
  graded_at?: string;
}

export interface TeacherAssignment extends Assignment {
  submissions: AssignmentSubmission[];
  submission_stats: {
    total_students: number;
    submitted: number;
    graded: number;
    pending: number;
    average_score?: number;
  };
}

// ===== ANNOUNCEMENT TYPES =====
export interface Announcement {
  id: string;
  title: string;
  description: string;
  badge_type: 'general' | 'scholarship' | 'event' | 'career' | 'academic' | 'deadline' | 'achievement' | 'workshop' | 'internship' | 'placement' | 'exam' | 'holiday' | 'emergency' | 'maintenance' | 'partnership' | 'competition' | 'research' | 'sports' | 'cultural' | 'technical';
  badge_color: string;
  author_name: string;
  author_role: 'hei_admin' | 'hei_mentor' | 'school_admin' | 'teacher' | 'student';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_pinned: boolean;
  is_new: boolean;
  created_at: string;
  metadata?: any; // JSONB
  user_has_viewed: boolean;
}

// ===== SESSION TYPES (HEI Coordination) =====
export interface MentoringSession {
  id: string;
  title: string;
  description?: string;
  mentor_id: string;
  mentor_name: string;
  session_date: string;
  duration: number;
  session_type: 'individual' | 'group' | 'workshop' | 'training';
  subject?: string;
  max_participants: number;
  current_participants: number;
  meeting_link?: string;
  meeting_room?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  agenda?: string[];
  resources?: string[];
  created_at: string;
}

// ===== CPD TYPES =====
export interface CPDCourse {
  id: string;
  title: string;
  description?: string;
  platform: 'diksha' | 'nishtha' | 'swayam';
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  subjects?: string[];
  external_url?: string;
  certificate_available: boolean;
  enrollment_status?: 'not_enrolled' | 'enrolled' | 'in_progress' | 'completed';
  completion_date?: string;
}

// ===== ASSESSMENT TYPES =====
export interface FormativeTool {
  id: string;
  name: string;
  type: 'quiz' | 'poll' | 'exit_ticket' | 'kahoot' | 'discussion';
  description?: string;
  subject_compatibility: string[];
  template?: any;
}

export interface GradebookEntry {
  student_id: string;
  student_name: string;
  roll_number?: string;
  assignments: Array<{
    assignment_id: string;
    assignment_name: string;
    max_marks: number;
    scored_marks?: number;
    percentage?: number;
    status: 'pending' | 'submitted' | 'graded';
  }>;
  total_percentage: number;
  grade?: string;
}

export interface GradebookData {
  class_level: string;
  subject: string;
  students: GradebookEntry[];
  class_average: number;
  assignment_averages: Array<{
    assignment_id: string;
    assignment_name: string;
    average_score: number;
    completion_rate: number;
  }>;
}

// ===== ACTIVITY & STATS TYPES =====
export interface Activity {
  id: string;
  type: 'assignment_created' | 'assignment_graded' | 'lesson_plan_created' | 'session_attended' | 'announcement_posted';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: any;
}

export interface TeacherStats {
  total_students: number;
  active_assignments: number;
  pending_grading: number;
  upcoming_sessions: number;
  lesson_plans_created: number;
  this_month_activities: number;
  average_assignment_score: number;
  completion_rate: number;
}

// ===== DASHBOARD TYPES =====
export interface TeacherDashboardData {
  teacher: {
    user: User;
    profile: TeacherProfile;
    school: School;
  };
  stats: TeacherStats;
  recent_activity: Activity[];
  upcoming_deadlines: {
    assignments: TeacherAssignment[];
    sessions: MentoringSession[];
  };
  announcements: Announcement[];
  quick_actions: Array<{
    title: string;
    description: string;
    action: string;
    icon: string;
  }>;
}

// ===== REQUEST/RESPONSE TYPES =====
export interface SubjectClassSelection {
  subjects: string[];
  classes: string[];
}

export interface CreateLessonPlanRequest {
  subject: string;
  class_level: string;
  chapter: string;
  title: string;
  objectives: string[];
  template_type: '5E' | 'direct_instruction' | 'activity_based' | 'problem_based';
  estimated_duration?: number;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  subject: string;
  class_level: string;
  chapter?: string;
  question_ids: string[];
  due_date: string;
  instructions?: string;
  rubric?: Assignment['rubric'];
}

export interface GradingData {
  answers: Array<{
    question_id: string;
    marks_awarded: number;
  }>;
  total_score: number;
  feedback?: string;
}

export interface ScheduleSessionRequest {
  title: string;
  description?: string;
  session_date: string;
  duration: number;
  session_type: 'individual' | 'group' | 'workshop' | 'training';
  subject?: string;
  agenda?: string[];
}

// ===== FILTER TYPES =====
export interface LessonPlanFilters {
  subject?: string;
  class_level?: string;
  template_type?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface AssignmentFilters {
  subject?: string;
  class_level?: string;
  status?: 'draft' | 'published' | 'closed';
  date_range?: {
    start: string;
    end: string;
  };
}

export interface AnnouncementFilters {
  badge_type?: string;
  priority?: string;
  unread_only?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

// ===== SUBJECT ENUMS =====
export const SUBJECTS = {
  mathematics: 'Mathematics',
  computer_science: 'Computer Science',
  science: 'Science',
  social_studies: 'Social Studies',
  languages: 'Languages',
  hindi: 'Hindi',
  english: 'English'
} as const;

export const CLASS_LEVELS = ['6', '7', '8', '9', '10', '11', '12'] as const;

export type SubjectKey = keyof typeof SUBJECTS;
export type ClassLevel = typeof CLASS_LEVELS[number];
