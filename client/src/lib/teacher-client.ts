// src/lib/teacher-client.ts

import {
  TeacherDashboardData,
  TeacherProfile,
  NCERTChapter,
  LessonPlanTemplate,
  LessonPlan,
  TeacherAssignment,
  Question,
  Assignment,
  AssignmentSubmission,
  Announcement,
  MentoringSession,
  CPDCourse,
  FormativeTool,
  GradebookData,
  CreateLessonPlanRequest,
  CreateAssignmentRequest,
  GradingData,
  ScheduleSessionRequest,
  SubjectClassSelection,
  LessonPlanFilters,
  AssignmentFilters,
  AnnouncementFilters,
} from '@/types/teacher-types';

// API Base URL - update this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from cookies
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('access_token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
};

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// ===== STATIC DATA (remains in frontend) =====

// NCERT Curriculum Data (Static for MVP)
const NCERT_CURRICULUM: Record<string, Record<string, NCERTChapter[]>> = {
  mathematics: {
    '6': [
      {
        id: 'math_6_1',
        subject: 'mathematics',
        class_level: '6',
        chapter_number: 1,
        chapter_title: 'Knowing Our Numbers',
        learning_objectives: [
          'Compare and order large numbers',
          'Use place value system effectively',
          'Estimate sums and differences',
          'Apply number system in real-life situations',
        ],
        keywords: ['Place value', 'Estimation', 'Roman numerals', 'Large numbers'],
        estimated_duration: 12,
      },
    ],
    '10': [
      {
        id: 'math_10_4',
        subject: 'mathematics',
        class_level: '10',
        chapter_number: 4,
        chapter_title: 'Quadratic Equations',
        learning_objectives: [
          'Solve quadratic equations by factorization',
          'Solve using quadratic formula',
          'Apply quadratic equations in real problems',
          'Understand nature of roots',
        ],
        keywords: ['Factorization', 'Quadratic formula', 'Discriminant', 'Roots'],
        estimated_duration: 18,
      },
    ],
  },
  computer_science: {
    '11': [
      {
        id: 'cs_11_6',
        subject: 'computer_science',
        class_level: '11',
        chapter_number: 6,
        chapter_title: 'Functions',
        learning_objectives: [
          'Define and call functions',
          'Use parameters and return values',
          'Understand scope of variables',
          'Create reusable code modules',
        ],
        keywords: ['Functions', 'Parameters', 'Return', 'Scope', 'Modules'],
        estimated_duration: 20,
      },
    ],
  },
};

// Question Bank (Static for MVP)
const QUESTION_BANK: Record<string, Record<string, Record<string, Record<string, Question[]>>>> = {
  mathematics: {
    '10': {
      'Quadratic Equations': {
        easy: [
          {
            id: 'q_math_10_qe_easy_1',
            question_text: 'Solve: x² - 5x + 6 = 0',
            question_type: 'short_answer',
            difficulty: 'easy',
            subject: 'mathematics',
            class_level: '10',
            chapter: 'Quadratic Equations',
            marks: 2,
            correct_answer: 'x = 2 or x = 3',
            sample_answer: 'x² - 5x + 6 = 0\\n(x - 2)(x - 3) = 0\\nTherefore, x = 2 or x = 3',
            learning_objective: 'Solve quadratic equations by factorization',
          },
        ],
        medium: [],
      },
    },
  },
};

// Lesson Plan Templates (Static for MVP)
const LESSON_PLAN_TEMPLATES: LessonPlanTemplate[] = [
  {
    id: 'template_5e',
    template_type: '5E',
    name: '5E Instructional Model',
    description: 'Inquiry-based learning approach with five phases',
    structure: ['Engage', 'Explore', 'Explain', 'Elaborate', 'Evaluate'],
    subject_compatibility: ['science', 'mathematics', 'computer_science'],
  },
  {
    id: 'template_direct',
    template_type: 'direct_instruction',
    name: 'Direct Instruction',
    description: 'Teacher-centered systematic approach',
    structure: ['Learning Objective', 'Introduction', 'Demonstration', 'Guided Practice', 'Independent Practice'],
    subject_compatibility: ['mathematics', 'computer_science', 'languages'],
  },
];

// Formative Tools (Static for MVP)
const FORMATIVE_TOOLS: FormativeTool[] = [
  {
    id: 'tool_quiz',
    name: 'Quick Quiz Creator',
    type: 'quiz',
    description: 'Create multiple choice quizzes for quick assessment',
    subject_compatibility: ['mathematics', 'science', 'computer_science'],
  },
];

// CPD Courses (Static for MVP)
const CPD_COURSES_DATA: Record<string, CPDCourse[]> = {
  diksha: [
    {
      id: 'course_diksha_1',
      title: 'DIKSHA Professional Development Course',
      description: 'Enhance your teaching skills with this comprehensive course',
      platform: 'diksha',
      duration: '40 hours',
      level: 'intermediate',
      certificate_available: true,
      enrollment_status: 'not_enrolled',
    },
  ],
  nishtha: [
    {
      id: 'course_nishtha_1',
      title: 'NISHTHA Teacher Training Program',
      description: 'Comprehensive teacher training aligned with NEP 2020',
      platform: 'nishtha',
      duration: '50 hours',
      level: 'beginner',
      certificate_available: true,
      enrollment_status: 'in_progress',
    },
  ],
  swayam: [
    {
      id: 'course_swayam_1',
      title: 'SWAYAM Higher Education Course',
      description: 'Advanced pedagogy and subject expertise development',
      platform: 'swayam',
      duration: '60 hours',
      level: 'advanced',
      certificate_available: true,
      enrollment_status: 'completed',
    },
  ],
};

// ===== API FUNCTIONS (Connected to Real Backend) =====

export const teacherAPI = {
  // ===== DASHBOARD =====
  getDashboard: async (): Promise<TeacherDashboardData> => {
    return apiCall<TeacherDashboardData>('/teacher/dashboard');
  },

  // ===== PROFILE & SUBJECTS =====
  getTeacherProfile: async (): Promise<TeacherProfile> => {
    return apiCall<TeacherProfile>('/teacher/profile');
  },

  updateSubjectsAndClasses: async (data: SubjectClassSelection): Promise<TeacherProfile> => {
    return apiCall<TeacherProfile>('/teacher/profile/subjects-classes', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // ===== NCERT CURRICULUM (Static) =====
  getNCERTChapters: async (subject: string, classLevel: string): Promise<NCERTChapter[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chapters = NCERT_CURRICULUM[subject]?.[classLevel] || [];
        resolve(chapters);
      }, 400);
    });
  },

  getLessonPlanTemplates: async (): Promise<LessonPlanTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(LESSON_PLAN_TEMPLATES), 300);
    });
  },

  // ===== LESSON PLANS (Static for MVP) =====
  createLessonPlan: async (data: CreateLessonPlanRequest): Promise<LessonPlan> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = LESSON_PLAN_TEMPLATES.find((t) => t.template_type === data.template_type);
        resolve({
          id: `lesson_plan_${Date.now()}`,
          teacher_id: 'current_teacher',
          subject: data.subject,
          class_level: data.class_level,
          chapter: data.chapter,
          title: data.title,
          objectives: data.objectives,
          template_type: data.template_type,
          content: {
            sections:
              template?.structure.map((section) => ({
                name: section,
                duration: 10,
                activities: [`Activity for ${section}`],
                resources: [`Resource for ${section}`],
              })) || [],
          },
          estimated_duration: data.estimated_duration || 50,
          resources: ['Textbook', 'Whiteboard', 'Projector'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }, 1000);
    });
  },

  getLessonPlans: async (filters: LessonPlanFilters): Promise<LessonPlan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  },

  // ===== ASSIGNMENTS (Backend Connected) =====
  getAssignments: async (filters: AssignmentFilters): Promise<TeacherAssignment[]> => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.class_level) params.append('class_level', filters.class_level);

    return apiCall<TeacherAssignment[]>(`/teacher/assignments?${params.toString()}`);
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<Assignment> => {
    return apiCall<Assignment>('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getQuestionBank: async (subject: string, chapter: string, difficulty: string): Promise<Question[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjectQuestions = QUESTION_BANK[subject];
        if (!subjectQuestions) {
          resolve([]);
          return;
        }

        let questions: Question[] = [];
        Object.keys(subjectQuestions).forEach((classLevel) => {
          const chapterQuestions = subjectQuestions[classLevel][chapter];
          if (chapterQuestions && chapterQuestions[difficulty]) {
            questions.push(...chapterQuestions[difficulty]);
          }
        });
        resolve(questions);
      }, 600);
    });
  },

  gradeSubmission: async (submissionId: string, data: GradingData): Promise<AssignmentSubmission> => {
    return apiCall<AssignmentSubmission>(`/teacher/assignments/submissions/${submissionId}/grade`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // ===== GRADEBOOK (Backend Connected) =====
  getGradebookData: async (classLevel: string, subject: string): Promise<GradebookData> => {
    const params = new URLSearchParams({ classLevel, subject });
    return apiCall<GradebookData>(`/teacher/gradebook?${params.toString()}`);
  },

  // ===== HEI COORDINATION (Backend Connected) =====
  getAnnouncements: async (filters: AnnouncementFilters): Promise<Announcement[]> => {
    const params = new URLSearchParams();
    if (filters.badge_type) params.append('badge_type', filters.badge_type);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.unread_only) params.append('unread_only', 'true');

    return apiCall<Announcement[]>(`/teacher/announcements?${params.toString()}`);
  },

  markAnnouncementAsRead: async (announcementId: string): Promise<void> => {
    return apiCall<void>(`/teacher/announcements/${announcementId}/read`, {
      method: 'PATCH',
    });
  },

  getHEISessions: async (): Promise<MentoringSession[]> => {
    return apiCall<MentoringSession[]>('/teacher/hei/sessions');
  },

  scheduleHEISession: async (data: ScheduleSessionRequest): Promise<MentoringSession> => {
    return apiCall<MentoringSession>('/teacher/hei/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ===== CPD & FORMATIVE TOOLS (Static for MVP) =====
  getCPDCourses: async (platform: 'diksha' | 'nishtha' | 'swayam'): Promise<CPDCourse[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CPD_COURSES_DATA[platform] || []);
      }, 500);
    });
  },

  getFormativeTools: async (): Promise<FormativeTool[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(FORMATIVE_TOOLS), 400);
    });
  },
};
