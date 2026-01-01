// Base User Types
export type UserRole = 'student' | 'teacher' | 'hei_mentor' | 'hei_admin' | 'school_admin';

// Authentication Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  phone?: string;

  // Student fields
  school_id?: string;
  class_level?: string;
  career_aspiration?: string;
  parent_contact?: string;
  address?: string;

  // Teacher fields
  employee_id?: string;
  subjects?: string[];
  primary_subject?: string;
  additional_subjects?: string;
  classes?: string[];
  qualification?: string;
  experience_years?: number;
  joined_date?: string;

  // HEI Mentor fields
  hei_id?: string;
  designation?: string;
  department?: string;
  expertise?: string[];
  research_interests?: string[];
  max_students?: number;

  // Admin fields
  responsibilities?: string[];
}

// Basic user info from login response
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  onboarding_completed: boolean;
  profile?: any;
}

// Full user profile (from profile endpoint)
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  profile?: any;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser; // Different from UserProfile - only has basic info
}

export interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Institution Types
export interface School {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  type: 'Government' | 'Private' | 'Aided';
  classes_offered: string[];
  established_year?: number;
  principal_name?: string;
  contact_email?: string;
  contact_phone?: string;
  facilities?: string[];
  student_count?: number;
  teacher_count?: number;
}

export interface HEI {
  id: string;
  name: string;
  type: 'University' | 'Institute' | 'College';
  location: string;
  district: string;
  state: string;
  established_year?: number;
  accreditation?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  departments?: string[];
  programs_offered?: string[];
  ranking?: number;
}

// Generic API Response
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface StudentProfile {
  name: string;
  class: string;
  school: string;
  profileImage?: string;
}

export interface ProfileStats {
  completedAssignments: number;
  totalAssignments: number;
  upcomingTests: number;
  mentoringSessionsAttended: number;
}

export interface RecentActivity {
  type: 'assignment' | 'session' | 'test' | 'project';
  title: string;
  status: 'completed' | 'upcoming' | 'pending' | 'in-progress';
  date: string;
}

export interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  mentor: string;
  subject: string;
  type: 'Individual' | 'Group';
}

export interface StudentDashboardData {
  student: StudentProfile;
  profileStats: ProfileStats;
  recentActivities: RecentActivity[];
  upcomingSessions: UpcomingSession[];
}


// ===== HOLLAND CODE ASSESSMENT TYPES =====
export type CategoryName = 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional';

export interface HollandQuestion {
  id: number;
  text: string;
  category: CategoryName;
  options: string[];
}

// Response wrapper from your backend
export interface HollandQuestionsResponse {
  questions: HollandQuestion[];
  totalQuestions: number;
  message: string;
}

export interface HollandResults {
  scores: Record<CategoryName, number>;
  topCategories: [CategoryName, number][];
  personalityCode: string;
  matchedCareers: string[];
  completionTime: number;
}

export interface HollandSubmissionResponse {
  hasCompleted: boolean;
  results: HollandResults;
  completionDate: string;
  message: string;
}

export interface HollandSubmission {
  studentId: string;
  answers: { [questionId: number]: number };
}

export interface AssessmentStatus {
  hasCompleted: boolean;
  results?: HollandResults;
  completionDate?: string;
}


// ===== CAREER TYPES =====
// Add these to your existing types/api.ts file

// ===== DREAM EXPLORER TYPES =====
export type DemandLevel = 'Extremely High' | 'Very High' | 'Growing Fast' | 'Growing' | 'High' | 'Medium' | 'Low';
export type CareerCategory =
  | 'Space & Exploration'
  | 'Healthcare & Medicine'
  | 'Technology & Innovation'
  | 'Environment & Sustainability'
  | 'Engineering'
  | 'Arts & Entertainment'
  | 'Business & Finance'
  | 'Education'
  | 'Sports';

export interface RealityCheck {
  pros: string[];
  cons: string[];
  workEnvironment: string;
  typicalDay: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  location: string;
  journey: string;
  quote: string;
  currentRole: string;
}

export interface DayInLife {
  morning: string;
  afternoon: string;
  evening: string;
  challenges: string;
}

export interface CareerPathway {
  id: string;
  route: string;
  steps: string[];
  duration: string;
  difficulty: DifficultyLevel;
}

export interface DreamCareer {
  id: string;
  title: string;
  slug: string;
  emoji: string;
  description: string;
  category: string;
  salaryRange: string;
  demandLevel: string;
  educationLevel: string;
  skills: string[];

  // Direct properties (not nested in realityCheck)
  workEnvironment: string;
  typicalDay: string;
  pros: string[];
  cons: string[];

  famousPersons: string[];
  pathway: string;
  inspiringFact: string;
  localConnection: string;
  nextSteps: string[];

  successStories: SuccessStory[];
  dayInLife: DayInLife;
  pathways: CareerPathway[];
  isFeatured: boolean;
}

// Update SuccessStory to match backend
export interface SuccessStory {
  id: string;
  name: string;
  location: string;
  background: string;
  journey: string;
  inspiration: string;
  currentRole: string;
  achievement: string;
  quote: string;
}

// Keep the same DayInLife and CareerPathwayRoute interfaces
export interface DayInLife {
  morning: string;
  afternoon: string;
  evening: string;
  challenges: string;
}


export interface InspirationalQuote {
  id?: string;
  quote: string;
  author: string;
}

export interface FeaturedCareer {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: CareerCategory;
  demandLevel: DemandLevel;
  salaryRange: string;
  famousPersons: string[];
  pathway: string;
  inspiringFact: string;
  skills: string[];
}

export interface CareerProgress {
  progressStats: {
    careersExplored: number;
    pathwaysViewed: number;
    totalProgress: number;
    assessmentCompleted: boolean;
  };
}

export interface SearchCareersResponse {
  careers: DreamCareer[];
  total: number;
  hasMore: boolean;
}

// Icon component type for category icons
export type IconComponent = React.ComponentType<{ className?: string }>;

// ===== CAREER PATHWAYS =====
// ===== CAREER PATHWAY/MAP TYPES =====

export interface PathwayStage {
  id: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
  keySubjects: string[];
  examinations: string[];
  skillsToGain: string[];
  nextOptions: string[];
}

export interface AlternativeRoute {
  id: string;
  routeName: string;
  description: string;
  duration: string;
  advantages: string[];
  challenges: string[];
}

export interface LocalOpportunity {
  type: string;
  institution: string;
  location: string;
  programs: string[];
  admissionCriteria: string;
}

export interface Milestone {
  stage: string;
  achievement: string;
  timeframe: string;
  importance: string;
}

export interface CareerPathwayMap {
  id: string;
  careerTitle: string;
  category: string;
  estimatedDuration: string;
  difficultyLevel: string;
  stages: PathwayStage[];
  alternativeRoutes: AlternativeRoute[];
  localOpportunities: LocalOpportunity[];
  milestones: Milestone[];
}

export interface UserProgress {
  currentStage: number;
  completedStages: number[];
  careerPathway: string;
  studentId: string;
  lastUpdated: string;
}

export type StageStatus = 'completed' | 'current' | 'upcoming';


// ===== CAREER GUIDANCE HUB =====
export interface CareerProgress {
  hollandCodeResults: {
    hasCompletedTest: boolean;
    recommendedCareers: string[];
    personalityType?: string;
    completionDate?: string;
  };
  progressStats: {
    assessmentCompleted: boolean;
    careersExplored: number;
    pathwaysViewed: number;
    totalProgress: number;
  };
}

export interface InspirationalQuote {
  quote: string;
  author: string;
}

// ===== DASHBOARD DATA TYPES =====
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl: string;
  icon: string;
}

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface WeeklyAnalytics {
  weeklyStats: {
    assignments: { completed: number; total: number };
    sessions: { attended: number; scheduled: number };
    testsCompleted: number;
    studyHours: number;
  };
}

export interface CareerPathwayMapDto {
  id: string;
  careerTitle: string;
  category: string;
  estimatedDuration: string;
  difficultyLevel: string;
  stages: PathwayStageDto[];
  alternativeRoutes: AlternativeRouteDto[];
  localOpportunities: LocalOpportunityDto[];
  isRecommended: boolean;
  matchPercentage?: number;
}

export interface PathwayStageDto {
  id: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
  keySubjects: string[];
  examinations: string[];
  skillsToGain: string[];
  nextOptions: string[];
}

export interface AlternativeRouteDto {
  id: string;
  routeName: string;
  description: string;
  duration: string;
  advantages: string[];
  challenges: string[];
}

export interface LocalOpportunityDto {
  type: string;
  institution: string;
  location: string;
  programs: string[];
  admissionCriteria: string;
  website?: string;
  contact?: string;
  feesRange?: string;
  placementRate?: number;
}

export interface UpdateProgressDto {
  careerSlug: string;
  stageIndex: number;
  completed: boolean;
  notes?: string;
}

export interface CareerProgressDto {
  hollandCodeResults: {
    hasCompletedTest: boolean;
    recommendedCareers: string[];
    personalityType?: string;
    completionDate?: string;
  };
  progressStats: {
    assessmentCompleted: boolean;
    careersExplored: number;
    pathwaysViewed: number;
    totalProgress: number;
  };
}

export interface InspirationalQuoteDto {
  id: string;
  text: string;
  author: string;
  category?: string;
}

// Career Map Stage Status
export type CareerMapStageStatus = 'completed' | 'current' | 'upcoming';

export enum AssignmentStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  OVERDUE = 'overdue'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum SubmissionFormat {
  PDF = 'pdf',
  DOC = 'doc',
  IMAGE = 'image',
  TEXT = 'text'
}

export interface AssignmentQuestionDto {
  questionNumber: number;
  question: string;
  type: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export interface AssignmentDto {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: string;
  status: AssignmentStatus;
  aiGenerated: boolean;
  ncertChapter: string;
  difficulty: DifficultyLevel;
  totalMarks: number;
  timeEstimate: string;
  questions: AssignmentQuestionDto[];
  submissionFormat: SubmissionFormat[];
  teacherNotes?: string;
  aiInsights?: string;
  score?: number;
  feedback?: string;
  grade?: string;
  submittedAt?: string;
}

export interface AssignmentListResponseDto {
  assignments: AssignmentDto[];
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

export interface AssignmentDashboardSummaryDto {
  totalAssignments: number;
  pendingAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  dueToday: number;
  dueThisWeek: number;
  averageScore: number;
  overallGrade: string;
  subjectDistribution: Record<string, any>;
  recentActivity: Record<string, any>;
}

export interface SubjectProgressDto {
  subject: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  averageScore: number;
  gradeInSubject: string;
  completionRate: number;
  lastSubmission: string;
  improvementTrend: number;
}

export interface SubmitAssignmentDto {
  assignmentId: string;
  fileUrls?: string[];
  submissionText?: string;
}

export interface AssignmentAttachmentDto {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AssignmentSubmissionDto {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  fileUrls: string[];  // Updated field name
  submissionText?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  grade?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FileUploadResponseDto {
  fileId: string;
  filename: string;
  fileUrl: string;
  signedUrl?: string;
  uploadedAt: string;
}

export interface SearchAssignmentsDto {
  query?: string;
  subject?: string;
  status?: AssignmentStatus;
  difficulty?: DifficultyLevel;
  dueDateFrom?: string;
  dueDateTo?: string;
  aiGenerated?: boolean;
  ncertChapter?: string;
}