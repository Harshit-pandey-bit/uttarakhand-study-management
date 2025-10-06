// src/app/dashboard/hei-mentor/assignments/[id]/submissions/[submissionId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Save,
  Download,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Eye,
  Paperclip,
  BookOpen,
  Award,
  AlertTriangle
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';

// Define interfaces for submission data
interface ObjectiveAnswer {
  question_id: string;
  question: string;
  selected_answer: number;
  correct_answer: number;
  options: string[];
  marks: number;
  is_correct: boolean;
}

interface SubjectiveAnswer {
  question_id: string;
  question: string;
  answer: string;
  expected_answer?: string;
  marks: number;
  awarded_marks?: number;
  feedback?: string;
}

interface SubmissionFile {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploaded_at: string;
}

interface StudentSubmission {
  id: string;
  assignment_id: string;
  assignment_title: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_class: string;
  submitted_at: string;
  status: 'submitted' | 'late' | 'graded';
  auto_score: number;
  manual_score?: number;
  total_score?: number;
  total_marks: number;
  time_taken?: number;
  attempt_number: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
  files: SubmissionFile[];
  answers: {
    objective: ObjectiveAnswer[];
    subjective: SubjectiveAnswer[];
  };
}

interface GradingForm {
  subjective_scores: Record<string, number>;
  feedback: string;
  bonus_marks: number;
}

export default function SubmissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const submissionId = params.submissionId as string;
  
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [gradingForm, setGradingForm] = useState<GradingForm>({
    subjective_scores: {},
    feedback: '',
    bonus_marks: 0
  });

  useEffect(() => {
    fetchSubmissionDetails();
  }, [assignmentId, submissionId]);

  const fetchSubmissionDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock submission data
      const mockSubmission: StudentSubmission = {
        id: submissionId,
        assignment_id: assignmentId,
        assignment_title: 'Introduction to Programming Concepts',
        student_id: 'std_001',
        student_name: 'Rahul Kumar',
        student_email: 'rahul.kumar@example.com',
        student_class: 'Class 11-B',
        submitted_at: '2025-10-14T15:30:00Z',
        status: 'submitted',
        auto_score: 24, // Objective questions auto-graded
        total_marks: 50,
        time_taken: 45,
        attempt_number: 1,
        files: [
          {
            id: 'file_1',
            filename: 'programming_assignment.pdf',
            size: 2048576,
            type: 'application/pdf',
            url: '/uploads/programming_assignment.pdf',
            uploaded_at: '2025-10-14T15:30:00Z'
          },
          {
            id: 'file_2',
            filename: 'code_examples.py',
            size: 4096,
            type: 'text/python',
            url: '/uploads/code_examples.py',
            uploaded_at: '2025-10-14T15:30:00Z'
          }
        ],
        answers: {
          objective: [
            {
              question_id: 'obj_1',
              question: 'What is a variable in programming?',
              selected_answer: 0,
              correct_answer: 0,
              options: ['A storage location', 'A function', 'A loop', 'A condition'],
              marks: 2,
              is_correct: true
            },
            {
              question_id: 'obj_2',
              question: 'Which of the following is a loop structure?',
              selected_answer: 1,
              correct_answer: 1,
              options: ['if-else', 'for', 'switch', 'return'],
              marks: 2,
              is_correct: true
            }
          ],
          subjective: [
            {
              question_id: 'subj_1',
              question: 'Explain the concept of loops with an example.',
              answer: 'Loops are programming constructs that allow code to be executed repeatedly. For example, a for loop can iterate through a list of numbers and print each one. Here\'s a Python example:\n\nfor i in range(5):\n    print(i)\n\nThis will print numbers 0 through 4.',
              expected_answer: 'Loops are control structures that repeat a block of code until a condition is met...',
              marks: 23,
              awarded_marks: 20,
              feedback: 'Good explanation with practical example. Could elaborate more on different loop types.'
            },
            {
              question_id: 'subj_2',
              question: 'What is the difference between a variable and a constant?',
              answer: 'A variable is a storage location that can change its value during program execution. A constant is a value that remains fixed throughout the program. Variables use memory that can be modified, while constants are typically stored in read-only memory sections.',
              expected_answer: 'A variable can change its value during execution while a constant cannot...',
              marks: 23,
              awarded_marks: 18,
              feedback: 'Correct understanding but lacks specific examples. Consider adding code examples to illustrate the concept.'
            }
          ]
        }
      };

      setSubmission(mockSubmission);
      
      // Initialize grading form with existing scores
      const subjectiveScores: Record<string, number> = {};
      mockSubmission.answers.subjective.forEach((answer: SubjectiveAnswer) => {
        subjectiveScores[answer.question_id] = answer.awarded_marks || 0;
      });
      
      setGradingForm({
        subjective_scores: subjectiveScores,
        feedback: mockSubmission.feedback || '',
        bonus_marks: 0
      });

    } catch (err) {
      setError('Failed to load submission details');
      console.error('Submission fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectiveScoreChange = (questionId: string, score: number): void => {
    setGradingForm(prev => ({
      ...prev,
      subjective_scores: {
        ...prev.subjective_scores,
        [questionId]: score
      }
    }));
  };

  const calculateTotalScore = (): number => {
    if (!submission) return 0;
    
    const objectiveScore = submission.auto_score;
    const subjectiveScore = Object.values(gradingForm.subjective_scores)
      .reduce((sum, score) => sum + score, 0);
    
    return objectiveScore + subjectiveScore + gradingForm.bonus_marks;
  };

  const handleSaveGrading = async (): Promise<void> => {
    if (!submission) return;
    
    try {
      setSaving(true);
      
      const totalScore = calculateTotalScore();
      
      const gradingData = {
        submission_id: submissionId,
        subjective_scores: gradingForm.subjective_scores,
        feedback: gradingForm.feedback,
        bonus_marks: gradingForm.bonus_marks,
        total_score: totalScore,
        status: 'graded'
      };

      // Mock API call
      console.log('Saving grading:', gradingData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSubmission(prev => prev ? {
        ...prev,
        status: 'graded',
        total_score: totalScore,
        feedback: gradingForm.feedback,
        graded_at: new Date().toISOString(),
        answers: {
          ...prev.answers,
          subjective: prev.answers.subjective.map((answer: SubjectiveAnswer) => ({
            ...answer,
            awarded_marks: gradingForm.subjective_scores[answer.question_id] || 0
          }))
        }
      } : null);

    } catch (error) {
      console.error('Failed to save grading:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      late: 'bg-red-100 text-red-800',
      graded: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getScorePercentage = (score: number, total: number): number => {
    return total > 0 ? (score / total) * 100 : 0;
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

  if (error || !submission) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Submission not found'}</div>
        <Link href={`/dashboard/hei-mentor/assignments/${assignmentId}`}>
          <Button>Back to Assignment</Button>
        </Link>
      </div>
    );
  }

  const totalScore = calculateTotalScore();
  const scorePercentage = getScorePercentage(totalScore, submission.total_marks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/hei-mentor/assignments/${assignmentId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignment
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Student Submission</h1>
          <p className="text-gray-600">{submission.assignment_title}</p>
        </div>
        <Badge className={getStatusColor(submission.status)}>
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{submission.student_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{submission.student_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-medium text-gray-900">{submission.student_class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submission Date</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(submission.submitted_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {submission.time_taken && (
                  <div>
                    <p className="text-sm text-gray-600">Time Taken</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {submission.time_taken} minutes
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Attempt Number</p>
                  <p className="font-medium text-gray-900">#{submission.attempt_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Files */}
          {submission.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="h-5 w-5 mr-2" />
                  Submitted Files ({submission.files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submission.files.map((file: SubmissionFile) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{file.filename}</p>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • Uploaded {new Date(file.uploaded_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Objective Questions */}
          {submission.answers.objective.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Objective Questions
                  </span>
                  <Badge variant="outline">
                    {submission.answers.objective.filter((q: ObjectiveAnswer) => q.is_correct).length}/{submission.answers.objective.length} Correct
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.answers.objective.map((answer: ObjectiveAnswer, index: number) => (
                  <div key={answer.question_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={answer.is_correct ? 'default' : 'destructive'}>
                          {answer.is_correct ? 'Correct' : 'Wrong'}
                        </Badge>
                        <span className="text-sm font-medium">
                          {answer.is_correct ? answer.marks : 0}/{answer.marks}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{answer.question}</p>
                    
                    <div className="space-y-2">
                      {answer.options.map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === answer.correct_answer
                              ? 'bg-green-100 text-green-800 font-medium'
                              : optionIndex === answer.selected_answer
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}. {option}
                          {optionIndex === answer.correct_answer && (
                            <span className="ml-2">✓ (Correct)</span>
                          )}
                          {optionIndex === answer.selected_answer && optionIndex !== answer.correct_answer && (
                            <span className="ml-2">✗ (Selected)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Subjective Questions */}
          {submission.answers.subjective.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Subjective Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {submission.answers.subjective.map((answer: SubjectiveAnswer, index: number) => (
                  <div key={answer.question_id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <span className="text-sm text-gray-600">Max: {answer.marks} marks</span>
                    </div>
                    
                    <p className="text-gray-700">{answer.question}</p>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Student Answer:</Label>
                      <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{answer.answer}</p>
                      </div>
                    </div>

                    {answer.expected_answer && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Expected Answer:</Label>
                        <div className="mt-1 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-700">{answer.expected_answer}</p>
                        </div>
                      </div>
                    )}

                    {/* Grading Section */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Label htmlFor={`score_${answer.question_id}`}>Award Marks:</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              id={`score_${answer.question_id}`}
                              type="number"
                              min="0"
                              max={answer.marks}
                              value={gradingForm.subjective_scores[answer.question_id] || 0}
                              onChange={(e) => handleSubjectiveScoreChange(
                                answer.question_id, 
                                parseInt(e.target.value) || 0
                              )}
                              className="w-20"
                            />
                            <span className="text-sm text-gray-600">/ {answer.marks}</span>
                          </div>
                        </div>
                        <div className="w-32">
                          <Label>Progress:</Label>
                          <Progress 
                            value={getScorePercentage(
                              gradingForm.subjective_scores[answer.question_id] || 0, 
                              answer.marks
                            )} 
                            className="mt-1" 
                          />
                        </div>
                      </div>

                      {answer.feedback && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Previous Feedback:</Label>
                          <p className="text-sm text-gray-600 mt-1 italic">{answer.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Score Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {totalScore}/{submission.total_marks}
                </div>
                <p className="text-sm text-gray-600">Total Score</p>
                <Progress value={scorePercentage} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">{scorePercentage.toFixed(1)}%</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Objective (Auto-graded):</span>
                  <span className="font-medium">{submission.auto_score}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subjective (Manual):</span>
                  <span className="font-medium">
                    {Object.values(gradingForm.subjective_scores).reduce((sum, score) => sum + score, 0)}
                  </span>
                </div>
                
                {gradingForm.bonus_marks > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bonus:</span>
                    <span className="font-medium text-green-600">+{gradingForm.bonus_marks}</span>
                  </div>
                )}
              </div>

              <Separator />

              {scorePercentage >= 80 && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Star className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-green-800">Excellent Performance!</p>
                </div>
              )}
              
              {scorePercentage < 50 && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-red-800">Needs Improvement</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grading Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Grading & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bonus_marks">Bonus Marks (Optional)</Label>
                <Input
                  id="bonus_marks"
                  type="number"
                  min="0"
                  max="10"
                  value={gradingForm.bonus_marks}
                  onChange={(e) => setGradingForm(prev => ({
                    ...prev,
                    bonus_marks: parseInt(e.target.value) || 0
                  }))}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Extra credit for exceptional work</p>
              </div>

              <div>
                <Label htmlFor="feedback">Overall Feedback</Label>
                <Textarea
                  id="feedback"
                  value={gradingForm.feedback}
                  onChange={(e) => setGradingForm(prev => ({
                    ...prev,
                    feedback: e.target.value
                  }))}
                  placeholder="Provide constructive feedback to help the student improve..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleSaveGrading}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Grading'}
              </Button>

              {submission.status === 'graded' && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-green-800">Grading Complete!</p>
                  {submission.graded_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Graded on {new Date(submission.graded_at).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Student
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
