// src/app/dashboard/student/assignments/page.tsx (Updated version)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  Award,
  TrendingUp,
  Target,
  Timer,
  ArrowRight,
  RefreshCw,
  Bot,
  Paperclip,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentListResponseDto,
  AssignmentDashboardSummaryDto,
  SubjectProgressDto,
  AssignmentStatus,
  DifficultyLevel,
  SearchAssignmentsDto
} from '@/types/api';

export default function AllAssignmentsPage() {
  const { user } = useAuth();

  // Data states
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentDto[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<AssignmentDashboardSummaryDto | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgressDto[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load data on component mount
  useEffect(() => {
    loadAssignmentsData();
  }, [user]);

  const loadAssignmentsData = async (): Promise<void> => {
    if (!user || user.role !== 'student') return;

    try {
      setLoading(!assignments.length);
      setError(null);

      const [assignmentsResponse, summaryResponse, subjectsResponse] = await Promise.all([
        apiClient.getMyAssignments(),
        apiClient.getAssignmentDashboardSummary(),
        apiClient.getMySubjectProgress()
      ]);

      if (assignmentsResponse.error) {
        throw new Error(assignmentsResponse.error);
      }
      if (assignmentsResponse.data) {
        setAssignments(assignmentsResponse.data.assignments);
        setFilteredAssignments(assignmentsResponse.data.assignments);
      }

      if (summaryResponse.data && !summaryResponse.error) {
        setDashboardSummary(summaryResponse.data);
      }

      if (subjectsResponse.data && !subjectsResponse.error) {
        setSubjectProgress(subjectsResponse.data);
      }

    } catch (err: unknown) {
      console.error('Error loading assignments data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assignments data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAssignmentsData();
  };

  // Filter assignments based on search and filters
  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.ncertChapter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === subjectFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.difficulty === difficultyFilter);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, subjectFilter, difficultyFilter]);

  // Helper functions
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
      case DifficultyLevel.HARD: return 'bg-red-100 text-red-800 border-red-300';
      case DifficultyLevel.MEDIUM: return 'bg-orange-100 text-orange-800 border-orange-300';
      case DifficultyLevel.EASY: return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: AssignmentStatus) => {
    switch (status) {
      case AssignmentStatus.PENDING: return <Clock className="h-4 w-4" />;
      case AssignmentStatus.SUBMITTED: return <Upload className="h-4 w-4" />;
      case AssignmentStatus.GRADED: return <CheckCircle className="h-4 w-4" />;
      case AssignmentStatus.OVERDUE: return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Determine assignment type (Online vs File-based)
  const getAssignmentType = (assignment: AssignmentDto): 'online' | 'file' => {
    // If it has questions, it's an online assignment
    if (assignment.questions && assignment.questions.length > 0) {
      return 'online';
    }
    // If it supports file submission, it's file-based
    return 'file';
  };

  const getAssignmentTypeIcon = (type: 'online' | 'file') => {
    return type === 'online' 
      ? <PlayCircle className="h-4 w-4 text-blue-500" />
      : <FileText className="h-4 w-4 text-green-500" />;
  };

  const getAssignmentTypeLabel = (type: 'online' | 'file') => {
    return type === 'online' ? 'Online Test' : 'File Submission';
  };

  const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];

  // Loading and error states remain the same...
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={handleRefresh} className="w-full" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Loading...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Assignments</h1>
          <p className="text-gray-600 mt-1">Complete your assignments and track your progress</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards - Same as before */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/student/assignments/pending">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {dashboardSummary?.pendingAssignments || 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Need attention</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="h-12 w-12 text-orange-500" />
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/assignments/completed">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardSummary?.completedAssignments || 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Well done!</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardSummary?.dueThisWeek || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">Don't miss!</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Same as before */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assignments, subjects, or chapters..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' || difficultyFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters'
                  : 'No assignments available at the moment'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0 && assignment.status === AssignmentStatus.PENDING;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && assignment.status === AssignmentStatus.PENDING;
            const assignmentType = getAssignmentType(assignment);

            return (
              <Card 
                key={assignment.id} 
                className={`hover:shadow-lg transition-shadow ${
                  isOverdue ? 'border-red-300 bg-red-50' : 
                  isDueSoon ? 'border-orange-300 bg-orange-50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                        
                        {/* Assignment Type Badge */}
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          <span className="flex items-center space-x-1">
                            {getAssignmentTypeIcon(assignmentType)}
                            <span>{getAssignmentTypeLabel(assignmentType)}</span>
                          </span>
                        </Badge>
                        
                        <Badge className={getDifficultyColor(assignment.difficulty)}>
                          {assignment.difficulty.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(assignment.status)}
                            <span>{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                          </span>
                        </Badge>
                        {assignment.aiGenerated && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Bot className="mr-1 h-3 w-3" />
                            AI Generated
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{assignment.subject}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Class {assignment.class}</span>
                        </span>
                        {assignmentType === 'online' && (
                          <span className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{assignment.questions.length} questions</span>
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{assignment.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className={`text-sm font-medium ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
                              {isOverdue && <span className="ml-1 text-red-600">(Overdue)</span>}
                              {isDueSoon && <span className="ml-1 text-orange-600">({Math.abs(daysUntilDue)} days left)</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Total Marks</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.totalMarks} points</p>
                          </div>
                        </div>

                        {assignment.score !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Your Score</p>
                              <p className="text-sm font-medium text-green-600">
                                {assignment.score}/{assignment.totalMarks}
                                {assignment.grade && <span className="ml-1">({assignment.grade})</span>}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Simplified Button Layout */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {assignment.status === AssignmentStatus.PENDING && (
                            <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                              <Button 
                                size="sm" 
                                className={isOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                              >
                                {assignmentType === 'online' ? (
                                  <>
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    Start Assignment
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {isOverdue ? 'Submit Now' : 'Submit Assignment'}
                                  </>
                                )}
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {assignment.submittedAt && (
                            <span>Submitted on {formatDate(assignment.submittedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Subject Progress Cards - Same as before */}
      {subjectProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <span>Subject-wise Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectProgress.map((subject) => (
                <Card key={subject.subject} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                        <p className="text-xs text-gray-500">Grade: {subject.gradeInSubject}</p>
                      </div>
                      {subject.improvementTrend > 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          +{subject.improvementTrend}%
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{subject.completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={subject.completionRate} className="h-2" />
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <span>{subject.completedAssignments} completed</span>
                        <span>{subject.pendingAssignments} pending</span>
                      </div>
                      {subject.averageScore > 0 && (
                        <div className="text-center pt-2 border-t">
                          <span className="text-sm font-medium text-green-600">
                            {subject.averageScore.toFixed(1)}% Average
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
