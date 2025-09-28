// Mock Data Types and Data
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'completed';
  priority: 'low' | 'medium' | 'high';
  maxScore: number;
  score?: number;
  submissionType: 'file' | 'text' | 'presentation' | 'project';
  teacher: string;
  estimatedTime: string;
  instructions?: string;
  attachments?: string[];
  submissionFile?: string;
  feedback?: string;
  gradeDate?: string;
  category: 'homework' | 'project' | 'test' | 'presentation';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  color: string;
  icon: string;
  totalAssignments: number;
  completedAssignments: number;
}

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    teacher: 'Dr. Priya Sharma',
    color: 'bg-blue-500',
    icon: '📊',
    totalAssignments: 12,
    completedAssignments: 8
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHY101',
    teacher: 'Prof. Rajesh Kumar',
    color: 'bg-purple-500',
    icon: '⚛️',
    totalAssignments: 10,
    completedAssignments: 6
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHEM101',
    teacher: 'Dr. Anita Singh',
    color: 'bg-green-500',
    icon: '🧪',
    totalAssignments: 8,
    completedAssignments: 7
  },
  {
    id: '4',
    name: 'English Literature',
    code: 'ENG101',
    teacher: 'Mrs. Kavya Patel',
    color: 'bg-orange-500',
    icon: '📚',
    totalAssignments: 6,
    completedAssignments: 4
  },
  {
    id: '5',
    name: 'Computer Science',
    code: 'CS101',
    teacher: 'Mr. Arjun Verma',
    color: 'bg-indigo-500',
    icon: '💻',
    totalAssignments: 9,
    completedAssignments: 5
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Quadratic Equations Problem Set',
    subject: 'Mathematics',
    description: 'Solve 20 quadratic equations using different methods including factoring, completing the square, and quadratic formula.',
    dueDate: '2025-10-05',
    assignedDate: '2025-09-25',
    status: 'pending',
    priority: 'high',
    maxScore: 100,
    submissionType: 'file',
    teacher: 'Dr. Priya Sharma',
    estimatedTime: '3-4 hours',
    instructions: 'Show all working steps clearly. Submit solutions in PDF format.',
    category: 'homework',
    attachments: ['quadratic_problems.pdf', 'formula_sheet.pdf']
  },
  {
    id: '2',
    title: 'Optics Lab Report',
    subject: 'Physics',
    description: 'Write a comprehensive lab report on the refraction of light experiment conducted in class.',
    dueDate: '2025-10-08',
    assignedDate: '2025-09-28',
    status: 'submitted',
    priority: 'medium',
    maxScore: 50,
    score: 42,
    submissionType: 'file',
    teacher: 'Prof. Rajesh Kumar',
    estimatedTime: '2-3 hours',
    category: 'project',
    submissionFile: 'optics_report.pdf',
    feedback: 'Good analysis, but graphs need better labeling.',
    gradeDate: '2025-09-30'
  },
  {
    id: '3',
    title: 'Organic Chemistry Mechanisms',
    subject: 'Chemistry',
    description: 'Draw and explain reaction mechanisms for 10 organic chemistry reactions.',
    dueDate: '2025-10-03',
    assignedDate: '2025-09-20',
    status: 'completed',
    priority: 'high',
    maxScore: 75,
    score: 68,
    submissionType: 'file',
    teacher: 'Dr. Anita Singh',
    estimatedTime: '4-5 hours',
    category: 'homework',
    submissionFile: 'mechanisms.pdf',
    feedback: 'Excellent work! Clear diagrams and explanations.',
    gradeDate: '2025-09-25'
  },
  {
    id: '4',
    title: 'Shakespeare Analysis Essay',
    subject: 'English Literature',
    description: 'Write a 1500-word analysis of themes in Hamlet, focusing on revenge, madness, and mortality.',
    dueDate: '2025-10-12',
    assignedDate: '2025-09-28',
    status: 'pending',
    priority: 'medium',
    maxScore: 100,
    submissionType: 'text',
    teacher: 'Mrs. Kavya Patel',
    estimatedTime: '5-6 hours',
    category: 'project',
    instructions: 'Include at least 5 scholarly references. Follow MLA citation format.'
  },
  {
    id: '5',
    title: 'Data Structures Implementation',
    subject: 'Computer Science',
    description: 'Implement linked lists, stacks, and queues in Python with complete documentation.',
    dueDate: '2025-10-15',
    assignedDate: '2025-09-29',
    status: 'pending',
    priority: 'high',
    maxScore: 150,
    submissionType: 'file',
    teacher: 'Mr. Arjun Verma',
    estimatedTime: '8-10 hours',
    category: 'project',
    instructions: 'Include unit tests and performance analysis.'
  },
  {
    id: '6',
    title: 'Calculus Problem Set 3',
    subject: 'Mathematics',
    description: 'Integration problems focusing on substitution and integration by parts.',
    dueDate: '2025-10-01',
    assignedDate: '2025-09-24',
    status: 'reviewed',
    priority: 'medium',
    maxScore: 80,
    score: 75,
    submissionType: 'file',
    teacher: 'Dr. Priya Sharma',
    estimatedTime: '2-3 hours',
    category: 'homework',
    submissionFile: 'calculus_solutions.pdf',
    feedback: 'Good work overall. Review integration by parts method.',
    gradeDate: '2025-09-28'
  }
];
