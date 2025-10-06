// src/app/dashboard/hei-mentor/assignments/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Edit,
  Share2,
  Download,
  Users,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  AlertTriangle,
  GraduationCap,
  Star
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { Assignment } from '@/types/hei-mentor';

// Define submission interfaces with proper typing
interface ObjectiveAnswer {
  question_id: string;
  selected_answer: number;
}

interface SubjectiveAnswer {
  question_id: string;
  answer: string;
}

interface StudentSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  status: 'submitted' | 'late' | 'pending';
  score?: number;
  feedback?: string;
  submission_files: string[];
  answers: {
    objective: ObjectiveAnswer[];
    subjective: SubjectiveAnswer[];
  };
}

interface AssignmentStats {
  total_students: number;
  submitted: number;
  pending: number;
  late: number;
  average_score: number;
  completion_rate: number;
}

// Define question interfaces to match our simplified structure
interface ObjectiveQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  marks: number;
}

interface SubjectiveQuestion {
  id: string;
  question: string;
  marks: number;
  expected_answer?: string;
}

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock assignment data
      const mockAssignment: Assignment = {
        id: assignmentId,
        title: 'Introduction to Programming Concepts',
        description: 'Learn the fundamental concepts of programming including variables, loops, and functions. This assignment will test your understanding of basic programming principles.',
        subject: 'Computer Science',
        class_level: '11',
        teacher_id: 'mentor_001',
        due_date: '2025-10-15T23:59:59Z',
        total_marks: 50,
        difficulty: 'easy',
        ai_generated: false,
        ncert_chapter: 'Chapter 1: Introduction to Programming',
        time_estimate: 60,
        submission_format: ['pdf', 'docx'],
        questions: {
          objective: [
            {
              id: 'obj_1',
              question: 'What is a variable in programming?',
              options: ['A storage location', 'A function', 'A loop', 'A condition'],
              correct_answer: 0,
              marks: 2
            },
            {
              id: 'obj_2',
              question: 'Which of the following is a loop structure?',
              options: ['if-else', 'for', 'switch', 'return'],
              correct_answer: 1,
              marks: 2
            }
          ],
          subjective: [
            {
              id: 'subj_1',
              question: 'Explain the concept of loops with an example.',
              marks: 8,
              expected_answer: 'Loops are control structures that repeat a block of code...'
            },
            {
              id: 'subj_2',
              question: 'What is the difference between a variable and a constant?',
              marks: 8,
              expected_answer: 'A variable can change its value during execution...'
            }
          ]
        },
        teacher_notes: 'Focus on fundamental concepts. Encourage practical examples.',
        ai_insights: 'Students typically struggle with variable scope concepts.',
        is_active: true,
        created_at: '2025-10-01T10:00:00Z',
        updated_at: '2025-10-05T14:30:00Z'
      };

      // Mock submissions data
      const mockSubmissions: StudentSubmission[] = [
        {
          id: 'sub_001',
          student_id: 'std_001',
          student_name: 'Rahul Kumar',
          student_email: 'rahul@example.com',
          submitted_at: '2025-10-14T15:30:00Z',
          status: 'submitted',
          score: 42,
          feedback: 'Good understanding of basic concepts. Work on loop examples.',
          submission_files: ['rahul_assignment.pdf'],
          answers: {
            objective: [
              { question_id: 'obj_1', selected_answer: 0 },
              { question_id: 'obj_2', selected_answer: 1 }
            ],
            subjective: [
              { question_id: 'subj_1', answer: 'Loops are programming constructs that repeat code...' },
              { question_id: 'subj_2', answer: 'Variables can change while constants cannot...' }
            ]
          }
        },
        {
          id: 'sub_002',
          student_id: 'std_002',
          student_name: 'Priya Sharma',
          student_email: 'priya@example.com',
          submitted_at: '2025-10-16T10:15:00Z',
          status: 'late',
          score: 38,
          submission_files: ['priya_assignment.docx'],
          answers: {
            objective: [
              { question_id: 'obj_1', selected_answer: 0 },
              { question_id: 'obj_2', selected_answer: 2 }
            ],
            subjective: [
              { question_id: 'subj_1', answer: 'Loops help in repeating tasks...' },
              { question_id: 'subj_2', answer: 'Variables store data that can change...' }
            ]
          }
        },
        {
          id: 'sub_003',
          student_id: 'std_003',
          student_name: 'Arjun Patel',
          student_email: 'arjun@example.com',
          submitted_at: '',
          status: 'pending',
          submission_files: [],
          answers: { objective: [], subjective: [] }
        }
      ];

      // Mock stats
      const mockStats: AssignmentStats = {
        total_students: 25,
        submitted: 15,
        pending: 8,
        late: 2,
        average_score: 40.2,
        completion_rate: 68
      };

      setAssignment(mockAssignment);
      setSubmissions(mockSubmissions);
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load assignment details');
      console.error('Assignment details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (): Promise<void> => {
    if (!assignment) return;
    
    try {
      // Mock API call to toggle assignment status
      setAssignment(prev => prev ? { ...prev, is_active: !prev.is_active } : null);
    } catch (error) {
      console.error('Failed to toggle assignment status:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      submitted: 'bg-green-100 text-green-800',
      late: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !assignment || !stats) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Assignment not found'}</div>
        <Link href="/dashboard/hei-mentor/assignments">
          <Button>Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  const dueDate = new Date(assignment.due_date);
  const isOverdue = new Date() > dueDate;
  const totalQuestions = assignment.questions.objective.length + assignment.questions.subjective.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/hei-mentor/assignments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-600">{assignment.subject} • Class {assignment.class_level}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(assignment.difficulty)}>
            {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
          </Badge>
          <Badge className={assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {assignment.is_active ? 'Active' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/hei-mentor/assignments/${assignmentId}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Assignment
          </Button>
        </Link>
        <Button variant="outline" onClick={handleToggleStatus}>
          {assignment.is_active ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
            <p className="text-sm text-gray-600">Submitted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.average_score.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.completion_rate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{assignment.description}</p>
                  </div>
                  
                  {assignment.ncert_chapter && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">NCERT Chapter</h4>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {assignment.ncert_chapter}
                      </div>
                    </div>
                  )}

                  {assignment.teacher_notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Teacher Notes</h4>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{assignment.teacher_notes}</p>
                    </div>
                  )}

                  {assignment.ai_insights && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
                      <p className="text-gray-600 bg-purple-50 p-3 rounded-lg flex items-start">
                        <Star className="h-4 w-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                        {assignment.ai_insights}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completion Progress</span>
                      <span className="text-sm text-gray-600">{stats.submitted}/{stats.total_students} students</span>
                    </div>
                    <Progress value={stats.completion_rate} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{stats.submitted}</p>
                        <p className="text-xs text-gray-600">Submitted</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{stats.late}</p>
                        <p className="text-xs text-gray-600">Late</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Marks:</span>
                    <span className="font-semibold text-blue-600">{assignment.total_marks}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Questions:</span>
                    <span className="font-medium">{totalQuestions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Estimate:</span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {assignment.time_estimate}min
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {dueDate.toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Format:</span>
                    <div className="flex gap-1">
                      {assignment.submission_format.map((format: string) => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isOverdue && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center text-red-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Assignment Overdue</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      This assignment is past its due date. Consider extending the deadline or contacting pending students.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objective Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Objective Questions ({assignment.questions.objective.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.questions.objective.map((question: ObjectiveQuestion, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant="outline">{question.marks} marks</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    <div className="space-y-1">
                      {question.options.map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correct_answer 
                              ? 'bg-green-100 text-green-800 font-medium' 
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}. {option}
                          {optionIndex === question.correct_answer && (
                            <span className="ml-2">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subjective Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Subjective Questions ({assignment.questions.subjective.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.questions.subjective.map((question: SubjectiveQuestion, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant="outline">{question.marks} marks</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    {question.expected_answer && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Expected Answer:</p>
                        <p className="text-sm text-blue-800">{question.expected_answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission: StudentSubmission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{submission.student_name}</h4>
                          <p className="text-sm text-gray-600">{submission.student_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.score !== undefined && (
                          <span className="text-sm font-medium text-blue-600">
                            {submission.score}/{assignment.total_marks}
                          </span>
                        )}
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    {submission.submitted_at && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        Submitted: {new Date(submission.submitted_at).toLocaleString('en-IN')}
                      </div>
                    )}
                    
                    {submission.submission_files.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {submission.submission_files.length} file(s) submitted
                        </span>
                      </div>
                    )}
                    
                    {submission.feedback && (
                      <div className="bg-yellow-50 p-3 rounded-lg mt-2">
                        <p className="text-sm text-yellow-800">{submission.feedback}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {submission.status !== 'pending' && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Provide Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {submissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Excellent (40-50)</span>
                    <span>8 students</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Good (30-39)</span>
                    <span>5 students</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Average (20-29)</span>
                    <span>2 students</span>
                  </div>
                  <Progress value={8} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Below Average (0-19)</span>
                    <span>0 students</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Early (before due date)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">13</span>
                      <div className="w-16 bg-green-100 h-2 rounded">
                        <div className="w-4/5 bg-green-600 h-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>On time (due date)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">0</span>
                      <div className="w-16 bg-blue-100 h-2 rounded">
                        <div className="w-0 bg-blue-600 h-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Late (after due date)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">2</span>
                      <div className="w-16 bg-red-100 h-2 rounded">
                        <div className="w-1/4 bg-red-600 h-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Pending</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">10</span>
                      <div className="w-16 bg-gray-100 h-2 rounded">
                        <div className="w-3/5 bg-gray-600 h-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Question-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignment.questions.objective.map((question: ObjectiveQuestion, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Q{index + 1}: Objective</h4>
                      <Badge variant="outline">87% correct</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                    <Progress value={87} className="h-2" />
                  </div>
                ))}
                
                {assignment.questions.subjective.map((question: SubjectiveQuestion, index: number) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Q{assignment.questions.objective.length + index + 1}: Subjective</h4>
                      <Badge variant="outline">6.2/8 avg</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                    <Progress value={77.5} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
