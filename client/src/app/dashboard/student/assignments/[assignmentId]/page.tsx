'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  PlayCircle,
  Download,
  Timer,
  Award,
  Bot
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentStatus,
  DifficultyLevel
} from '@/types/api';

// Import the specific assignment components
import OnlineAssignmentView from '@/components/assignments/OnlineAssignmentView';
import FileAssignmentView from '@/components/assignments/FileAssignmentView';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<AssignmentDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId || !user) return;
    loadAssignment();
  }, [assignmentId, user]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getAssignmentDetails(assignmentId);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setAssignment(response.data);
      }
    } catch (err: unknown) {
      console.error('Error loading assignment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assignment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case AssignmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case AssignmentStatus.SUBMITTED: return 'bg-blue-100 text-blue-800';
      case AssignmentStatus.GRADED: return 'bg-green-100 text-green-800';
      case AssignmentStatus.OVERDUE: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.HARD: return 'bg-red-100 text-red-800';
      case DifficultyLevel.MEDIUM: return 'bg-orange-100 text-orange-800';
      case DifficultyLevel.EASY: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine assignment type
  const getAssignmentType = (assignment: AssignmentDto): 'online' | 'file' => {
    return assignment.questions && assignment.questions.length > 0 ? 'online' : 'file';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div>
              <Skeleton className="h-8 w-96 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Content Skeleton */}
        <Card>
          <CardContent className="p-8">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Assignment Not Found</h2>
            <p className="text-gray-600">{error || 'This assignment does not exist or you do not have access to it.'}</p>
            <Button onClick={() => router.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0 && assignment.status === AssignmentStatus.PENDING;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && assignment.status === AssignmentStatus.PENDING;
  const assignmentType = getAssignmentType(assignment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
            <p className="text-gray-600 mt-1">{assignment.subject} • Class {assignment.class}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(assignment.difficulty)}>
            {assignment.difficulty.toUpperCase()}
          </Badge>
          <Badge className={getStatusColor(assignment.status)}>
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Assignment Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${
                  isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                }`}>
                  {formatDate(assignment.dueDate)}
                  {isOverdue && <span className="ml-1 text-red-600">(Overdue)</span>}
                  {isDueSoon && <span className="ml-1 text-orange-600">({Math.abs(daysUntilDue)} days left)</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total Marks</p>
                <p className="font-medium text-gray-900">{assignment.totalMarks} points</p>
              </div>
            </div>

            {assignmentType === 'online' && (
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="font-medium text-gray-900">{assignment.questions.length}</p>
                </div>
              </div>
            )}
          </div>

          {assignment.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{assignment.description}</p>
            </div>
          )}

          {assignment.aiGenerated && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">AI Generated Assignment</span>
              </div>
              {assignment.aiInsights && (
                <p className="text-sm text-purple-700">{assignment.aiInsights}</p>
              )}
            </div>
          )}

          {assignment.teacherNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">Teacher's Instructions</h4>
              <p className="text-sm text-yellow-700">{assignment.teacherNotes}</p>
            </div>
          )}

          {assignment.score !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-green-800">Your Score</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {assignment.score}/{assignment.totalMarks}
                    {assignment.grade && <span className="ml-2 text-lg">({assignment.grade})</span>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">
                    {((assignment.score / assignment.totalMarks) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              {assignment.feedback && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <h5 className="font-medium text-green-800 mb-1">Teacher Feedback</h5>
                  <p className="text-sm text-green-700">{assignment.feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Content - Render based on type */}
      {assignmentType === 'online' ? (
        <OnlineAssignmentView 
          assignment={assignment} 
          onSubmissionComplete={() => loadAssignment()} 
        />
      ) : (
        <FileAssignmentView 
          assignment={assignment} 
          onSubmissionComplete={() => loadAssignment()} 
        />
      )}
    </div>
  );
}
