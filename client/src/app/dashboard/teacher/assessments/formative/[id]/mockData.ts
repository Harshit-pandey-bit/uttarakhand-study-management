export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  submittedAt: string;
  status: 'submitted' | 'not_submitted';
  grade: number | null;
  responses: { [key: string]: string };
}

export interface Assessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  questions: string[];
}

export const mockAssessment: Assessment = {
  id: 1,
  title: 'Daily Quiz – Quadratics',
  subject: 'Mathematics',
  class: '10A',
  questions: [
    'What is the quadratic formula?',
    'How would you solve x² + 5x + 6 = 0?',
    'What are the solutions to the equation above?',
    'Explain the discriminant and its significance.',
    'Graph the parabola y = x² - 4x + 3 and identify its vertex.'
  ]
};

export const mockStudentResponses: StudentResponse[] = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@school.edu',
    avatar: 'AS',
    submittedAt: '2025-09-26T14:30:00',
    status: 'submitted',
    grade: null,
    responses: {
      q1: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a',
      q2: 'To solve x² + 5x + 6 = 0, I would factor it as (x+2)(x+3) = 0',
      q3: 'The solutions are x = -2 and x = -3',
      q4: 'The discriminant is b²-4ac. If positive, there are two real solutions.',
      q5: 'The vertex is at (2, -1). The parabola opens upward.'
    }
  },
  {
    id: 2,
    name: 'Diya Patel',
    email: 'diya.patel@school.edu',
    avatar: 'DP',
    submittedAt: '2025-09-26T14:25:00',
    status: 'submitted',
    grade: 85,
    responses: {
      q1: 'x = (-b ± √(b²-4ac)) / 2a where a, b, c are coefficients',
      q2: 'Factor: (x+2)(x+3) = 0',
      q3: 'x = -2 or x = -3',
      q4: 'Discriminant determines the nature of roots: positive = 2 real, zero = 1 real, negative = complex',
      q5: 'Vertex at (2, -1), axis of symmetry at x = 2, y-intercept at (0, 3)'
    }
  },
  // ... more students
];
