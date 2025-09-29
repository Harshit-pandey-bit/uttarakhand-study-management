// src/app/dashboard/student/assignments/page.tsx (Updated design)
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
      case AssignmentStatus.PENDING: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case AssignmentStatus.SUBMITTED: return 'bg-blue-50 text-blue-700 border-blue-200';
      case AssignmentStatus.GRADED: return 'bg-green-50 text-green-700 border-green-200';
      case AssignmentStatus.OVERDUE: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.HARD: return 'bg-red-50 text-red-700 border-red-200';
      case DifficultyLevel.MEDIUM: return 'bg-orange-50 text-orange-700 border-orange-200';
      case DifficultyLevel.EASY: return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-10 w-80 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="bg-white border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-10 w-16 mb-2" />
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md w-full bg-white border-0 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600 text-lg">{error}</p>
            <Button onClick={handleRefresh} className="w-full h-12" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Loading...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Symmetric Header - REMOVED NEW ASSIGNMENT BUTTON */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">All Assignments</h1>
            <p className="text-gray-600 text-lg">Complete your assignments and track your progress</p>
          </div>
          <div>
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="border-gray-300 hover:border-gray-400">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Symmetric Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/dashboard/student/assignments/pending">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-orange-50 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-16 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</p>
                    </div>
                    <p className="text-4xl font-bold text-orange-600 mb-2">
                      {dashboardSummary?.pendingAssignments || 0}
                    </p>
                    <p className="text-sm text-gray-500">Need attention</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Timer className="h-14 w-14 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/assignments/completed">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-green-50 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-16 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                    </div>
                    <p className="text-4xl font-bold text-green-600 mb-2">
                      {dashboardSummary?.completedAssignments || 0}
                    </p>
                    <p className="text-sm text-gray-500">Well done!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-14 w-14 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-0 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-red-50 group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-16 bg-red-500 rounded-full"></div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Due This Week</p>
                  </div>
                  <p className="text-4xl font-bold text-red-600 mb-2">
                    {dashboardSummary?.dueThisWeek || 0}
                  </p>
                  <p className="text-sm text-gray-500">Don't miss!</p>
                </div>
              </div>
              <AlertCircle className="h-14 w-14 text-red-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Symmetric Search and Filters */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search assignments, subjects, or chapters..."
                  className="pl-12 h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-14 border-gray-300">
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
                <SelectTrigger className="w-[160px] h-14 border-gray-300">
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
                <SelectTrigger className="w-[160px] h-14 border-gray-300">
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

      {/* Enhanced Symmetric Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-8" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No assignments found</h3>
              <p className="text-gray-500 text-lg">
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
                className={`hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer group ${
                  isOverdue ? 'ring-2 ring-red-200 bg-red-50' : 
                  isDueSoon ? 'ring-2 ring-orange-200 bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-4 h-20 rounded-full ${
                          isOverdue ? 'bg-red-500' : 
                          isDueSoon ? 'bg-orange-500' : 
                          assignment.status === AssignmentStatus.GRADED ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-3 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              {assignment.title}
                            </h3>
                            
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium">
                              <span className="flex items-center space-x-2">
                                {getAssignmentTypeIcon(assignmentType)}
                                <span>{getAssignmentTypeLabel(assignmentType)}</span>
                              </span>
                            </Badge>
                            
                            <Badge className={`${getDifficultyColor(assignment.difficulty)} border font-medium px-3 py-1`}>
                              {assignment.difficulty.toUpperCase()}
                            </Badge>
                            
                            <Badge className={`${getStatusColor(assignment.status)} border font-medium px-3 py-1`}>
                              <span className="flex items-center space-x-2">
                                {getStatusIcon(assignment.status)}
                                <span>{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                              </span>
                            </Badge>
                            
                            {assignment.aiGenerated && (
                              <Badge className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 font-medium">
                                <Bot className="mr-2 h-4 w-4" />
                                AI Generated
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <BookOpen className="h-4 w-4" />
                              <span className="font-medium">{assignment.subject}</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Class {assignment.class}</span>
                            </span>
                            {assignmentType === 'online' && (
                              <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">{assignment.questions.length} questions</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6 text-lg leading-relaxed ml-6">{assignment.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ml-6">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Due Date</p>
                            <p className={`text-lg font-bold ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
                            </p>
                            {isOverdue && <span className="text-sm text-red-600 font-medium">(Overdue)</span>}
                            {isDueSoon && <span className="text-sm text-orange-600 font-medium">({Math.abs(daysUntilDue)} days left)</span>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                          <Target className="h-6 w-6 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Marks</p>
                            <p className="text-lg font-bold text-gray-900">{assignment.totalMarks} points</p>
                          </div>
                        </div>

                        {assignment.score !== undefined && (
                          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                            <Award className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">Your Score</p>
                              <p className="text-lg font-bold text-green-600">
                                {assignment.score}/{assignment.totalMarks}
                                {assignment.grade && <span className="ml-1">({assignment.grade})</span>}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Button Layout */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 ml-6">
                        <div className="flex space-x-3">
                          {assignment.status === AssignmentStatus.PENDING && (
                            <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                              <Button 
                                className={`h-12 px-6 ${
                                  isOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                              >
                                {assignmentType === 'online' ? (
                                  <>
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Start Assignment
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-5 w-5" />
                                    {isOverdue ? 'Submit Now' : 'Submit Assignment'}
                                  </>
                                )}
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                            <Button variant="outline" className="h-12 px-6 border-gray-300 hover:border-gray-400">
                              <Eye className="mr-2 h-5 w-5" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                          {assignment.submittedAt ? (
                            <span>Submitted on {formatDate(assignment.submittedAt)}</span>
                          ) : (
                            <span>Assigned on {formatDate(assignment.dueDate)}</span>
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

      {/* Enhanced Symmetric Subject Progress Cards */}
      {subjectProgress.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="p-8 border-b">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <span>Subject-wise Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectProgress.map((subject) => (
                <Card key={subject.subject} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-3 h-12 bg-blue-500 rounded-full"></div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{subject.subject}</h4>
                          <p className="text-sm text-gray-500">Grade: {subject.gradeInSubject}</p>
                        </div>
                      </div>
                      {subject.improvementTrend > 0 && (
                        <Badge className="bg-green-100 text-green-800 ml-auto">
                          +{subject.improvementTrend}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span>Progress</span>
                          <span>{subject.completionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={subject.completionRate} className="h-3 rounded-full" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <p className="font-bold text-green-700">{subject.completedAssignments}</p>
                          <p className="text-xs">Completed</p>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded-lg">
                          <p className="font-bold text-orange-700">{subject.pendingAssignments}</p>
                          <p className="text-xs">Pending</p>
                        </div>
                      </div>
                      
                      {subject.averageScore > 0 && (
                        <div className="text-center pt-4 border-t">
                          <span className="text-lg font-bold text-green-600">
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
