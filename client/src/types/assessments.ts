// Existing formative types...
export interface FormativeAssessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: 'quiz' | 'exit-ticket' | 'poll';
  questions: number;
  duration: number;
  created: string;
  due: string;
  status: 'active' | 'closed' | 'draft';
  completed: number;
  total: number;
  avg: number | null;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'rating' | 'essay' | 'problem-solving';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  rubric?: string;
}

export interface FormativeAssessmentForm {
  title: string;
  subject: string;
  class: string;
  type: 'quiz' | 'exit-ticket' | 'poll';
  duration: number;
  instructions: string;
  description: string;
  dueDate: string;
  allowMultipleAttempts: boolean;
  showResultsImmediately: boolean;
  questions: Question[];
}

// NEW: Summative Assessment Types
export interface SummativeAssessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: 'mid-term' | 'final-exam' | 'project' | 'research-paper' | 'presentation' | 'portfolio';
  totalMarks: number;
  duration: number; // in minutes
  created: string;
  dueDate: string;
  status: 'active' | 'closed' | 'draft' | 'scheduled';
  components: AssessmentComponent[];
  submitted: number;
  total: number;
  averageScore: number | null;
  passingMarks: number;
  instructions: string;
  weightage: number; // percentage of total grade
}

export interface AssessmentComponent {
  id: string;
  name: string;
  type: 'written-work' | 'performance-task' | 'quarterly-assessment';
  weightage: number; // percentage of total assessment
  maxMarks: number;
  questions: Question[];
}

export interface SummativeAssessmentForm {
  title: string;
  subject: string;
  class: string;
  type: 'mid-term' | 'final-exam' | 'project' | 'research-paper' | 'presentation' | 'portfolio';
  totalMarks: number;
  duration: number;
  instructions: string;
  description: string;
  dueDate: string;
  passingMarks: number;
  weightage: number;
  allowLateSubmission: boolean;
  requireProctoring: boolean;
  components: AssessmentComponent[];
}

export interface StudentSubmission {
  id: string;
  assessmentId: number;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  totalScore: number;
  maxScore: number;
  componentScores: {
    componentId: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
  overallFeedback: string;
  grade: string;
}
// Existing types...

// NEW: Diagnostic Assessment Types
export interface DiagnosticAssessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: 'pre-assessment' | 'skill-gap' | 'learning-difficulty' | 'readiness-check';
  totalQuestions: number;
  duration: number; // in minutes
  created: string;
  status: 'active' | 'completed' | 'draft' | 'scheduled';
  participants: number;
  completed: number;
  averageScore: number | null;
  skillAreas: DiagnosticSkillArea[];
  insights: DiagnosticInsight[];
  remediationSuggestions: string[];
}

export interface DiagnosticSkillArea {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  averagePerformance: number;
  difficultyLevel: 'basic' | 'intermediate' | 'advanced';
  prerequisites: string[];
}

export interface DiagnosticInsight {
  id: string;
  type: 'strength' | 'weakness' | 'learning-gap' | 'misconception';
  skillArea: string;
  description: string;
  affectedStudents: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface DiagnosticResult {
  id: string;
  assessmentId: number;
  studentId: string;
  studentName: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  skillAreaResults: SkillAreaResult[];
  identifiedGaps: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface SkillAreaResult {
  skillAreaId: string;
  skillAreaName: string;
  score: number;
  maxScore: number;
  performanceLevel: 'below-basic' | 'basic' | 'proficient' | 'advanced';
  gaps: string[];
}

export interface DiagnosticForm {
  title: string;
  subject: string;
  class: string;
  type: 'pre-assessment' | 'skill-gap' | 'learning-difficulty' | 'readiness-check';
  duration: number;
  description: string;
  objectives: string[];
  skillAreas: DiagnosticSkillArea[];
  adaptiveLogic: boolean;
  immediateResults: boolean;
  remediationEnabled: boolean;
}
