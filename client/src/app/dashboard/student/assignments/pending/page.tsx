'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Calendar,
  Clock,
  Upload,
  AlertCircle,
  Search,
  ArrowLeft,
  Timer,
  Users,
  Target,
  Eye,
  CheckCircle,
  FileText,
  Plus,
  RefreshCw,
  Bot,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentStatus,
  DifficultyLevel,
  AssignmentListResponseDto
} from '@/types/api';

export default function PendingAssignmentsPage() {
  const { user } = useAuth();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAssignments, setPendingAssignments] = useState<AssignmentDto[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      loadPendingAssignments();
    }
  }, [user]);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, pendingAssignments]);

  const loadPendingAssignments = async () => {
    try {
      setLoading(!pendingAssignments.length);
      setError(null);

      // Get pending assignments using the API client
      const response = await apiClient.getMyAssignments({
        status: AssignmentStatus.PENDING,
        limit: 50
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setPendingAssignments(response.data.assignments);
      }
    } catch (err: unknown) {
      console.error('Error loading pending assignments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assignments';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAssignments = () => {
    let filtered = pendingAssignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.ncertChapter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by due date (urgent first)
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    setFilteredAssignments(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPendingAssignments();
  };

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

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.HARD: 
        return 'bg-red-50 text-red-700 border-red-200';
      case DifficultyLevel.MEDIUM: 
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case DifficultyLevel.EASY: 
        return 'bg-green-50 text-green-700 border-green-200';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAssignmentType = (assignment: AssignmentDto): 'online' | 'file' => {
    return assignment.questions && assignment.questions.length > 0 ? 'online' : 'file';
  };

  const getAssignmentTypeIcon = (type: 'online' | 'file') => {
    return type === 'online' 
      ? <PlayCircle className="h-4 w-4 text-blue-500" />
      : <FileText className="h-4 w-4 text-green-500" />;
  };

  const urgentAssignments = filteredAssignments.filter(a => {
    const days = getDaysUntilDue(a.dueDate);
    return days <= 3 && days >= 0;
  });

  const overdueAssignments = filteredAssignments.filter(a => getDaysUntilDue(a.dueDate) < 0);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-10 w-32" />
              <div>
                <Skeleton className="h-10 w-96 mb-2" />
                <Skeleton className="h-6 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Assignments Skeleton */}
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="bg-white border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Skeleton className="w-4 h-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard/student/assignments">
                <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Assignments
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Assignments</h1>
                <p className="text-gray-600 text-lg">Unable to load assignments</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Loading...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard/student/assignments">
              <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Assignments
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Assignments</h1>
              <p className="text-gray-600 text-lg">
                {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} need{filteredAssignments.length === 1 ? 's' : ''} your attention
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Alert Cards */}
      {(overdueAssignments.length > 0 || urgentAssignments.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overdueAssignments.length > 0 && (
            <Card className="border-0 bg-red-50 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors duration-200">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-800 mb-1">Overdue Assignments</p>
                    <p className="text-red-700 font-medium">
                      {overdueAssignments.length} assignment{overdueAssignments.length > 1 ? 's are' : ' is'} overdue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {urgentAssignments.length > 0 && (
            <Card className="border-0 bg-orange-50 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors duration-200">
                    <Timer className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-800 mb-1">Due Soon</p>
                    <p className="text-orange-700 font-medium">
                      {urgentAssignments.length} assignment{urgentAssignments.length > 1 ? 's' : ''} due within 3 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Enhanced Search */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search pending assignments by title, subject, or chapter..."
              className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">All caught up!</h3>
              <p className="text-gray-500 text-lg">
                {searchTerm 
                  ? 'No pending assignments found matching your search'
                  : 'No pending assignments found'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
            const assignmentType = getAssignmentType(assignment);

            return (
              <Card 
                key={assignment.id} 
                className={`hover:shadow-lg transition-all duration-200 border-0 bg-white cursor-pointer group ${
                  isOverdue ? 'ring-2 ring-red-200 bg-red-50' : 
                  isDueSoon ? 'ring-2 ring-orange-200 bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-4 h-16 rounded-full ${
                          isOverdue ? 'bg-red-500' : 
                          isDueSoon ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                              {assignment.title}
                            </h3>
                            
                            {/* Assignment Type Badge */}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                              <span className="flex items-center space-x-1">
                                {getAssignmentTypeIcon(assignmentType)}
                                <span>{assignmentType === 'online' ? 'Online Test' : 'File Submission'}</span>
                              </span>
                            </Badge>

                            <Badge className={`${getDifficultyColor(assignment.difficulty)} border font-medium px-3 py-1`}>
                              {assignment.difficulty.toUpperCase()}
                            </Badge>
                            
                            {isOverdue && (
                              <Badge className="bg-red-600 text-white px-3 py-1 font-bold">
                                OVERDUE
                              </Badge>
                            )}
                            {isDueSoon && !isOverdue && (
                              <Badge className="bg-orange-600 text-white px-3 py-1 font-bold">
                                DUE SOON
                              </Badge>
                            )}
                            {assignment.aiGenerated && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Bot className="mr-1 h-3 w-3" />
                                AI Generated
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                              <BookOpen className="h-4 w-4" />
                              <span className="font-medium">{assignment.subject}</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Class {assignment.class}</span>
                            </span>
                            <span className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">{assignment.timeEstimate}</span>
                            </span>
                            {assignmentType === 'online' && (
                              <span className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">{assignment.questions.length} questions</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6 text-lg leading-relaxed ml-6">{assignment.description}</p>

                      {assignment.ncertChapter && (
                        <div className="mb-4 ml-6">
                          <Badge variant="outline" className="text-indigo-600 border-indigo-300">
                            NCERT: {assignment.ncertChapter}
                          </Badge>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ml-6">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Due Date</p>
                            <p className={`text-lg font-bold ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
                            </p>
                            {isOverdue && (
                              <p className="text-sm text-red-600 font-medium">
                                {Math.abs(daysUntilDue)} days overdue
                              </p>
                            )}
                            {isDueSoon && !isOverdue && (
                              <p className="text-sm text-orange-600 font-medium">
                                {daysUntilDue} days remaining
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                          <Target className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Marks</p>
                            <p className="text-lg font-bold text-gray-900">{assignment.totalMarks} points</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 ml-6">
                        <div className="flex space-x-3">
                          <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                            <Button 
                              className={`${
                                isOverdue 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                              }`}
                            >
                              {assignmentType === 'online' ? (
                                <>
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  {isOverdue ? 'Start Now' : 'Start Assignment'}
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {isOverdue ? 'Submit Now' : 'Submit Assignment'}
                                </>
                              )}
                            </Button>
                          </Link>
                          
                          <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                            <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
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
    </div>
  );
}
