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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* DESIGN ONLY: Enhanced Header Skeleton - INCREASED CONTAINER HEIGHT */}
          <div className="bg-white rounded-2xl shadow-lg border p-10">
            <div className="flex flex-col space-y-6">
              {/* Back Button Row */}
              <div className="flex justify-start">
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
              
              {/* Main Title and Refresh Button Row */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-12 w-96 mb-3" />
                  <Skeleton className="h-6 w-64" />
                </div>
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </div>
          </div>

          {/* DESIGN ONLY: Enhanced Assignments Skeleton */}
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <Skeleton className="w-5 h-20 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-2/3 mb-6" />
                    <div className="grid grid-cols-2 gap-6">
                      <Skeleton className="h-20 w-full rounded-xl" />
                      <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* DESIGN ONLY: Enhanced Symmetric Error Header - INCREASED CONTAINER HEIGHT */}
          <div className="bg-white rounded-2xl shadow-lg border p-10">
            <div className="flex flex-col space-y-6">
              {/* Back Button Row */}
              <div className="flex justify-start">
                <Link href="/dashboard/student/assignments">
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to All Assignments
                  </Button>
                </Link>
              </div>
              
              {/* Main Title Row */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-relaxed py-2">Pending Assignments</h1>
                  <p className="text-gray-600 text-lg">Unable to load assignments</p>
                </div>
              </div>
            </div>
          </div>

          {/* DESIGN ONLY: Enhanced Error Card */}
          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-16 text-center">
              <div className="bg-red-100 rounded-full p-6 w-fit mx-auto mb-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h3>
              <p className="text-gray-600 mb-6 text-lg">{error}</p>
              <Button 
                onClick={handleRefresh} 
                disabled={refreshing}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Loading...' : 'Try Again'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Symmetric Header - INCREASED CONTAINER HEIGHT */}
        <div className="bg-white rounded-2xl shadow-lg border p-10">
          <div className="flex flex-col space-y-6">
            {/* Back Button Row */}
            <div className="flex justify-start">
              <Link href="/dashboard/student/assignments">
                <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3 hover:shadow-md transition-all">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to All Assignments
                </Button>
              </Link>
            </div>
            
            {/* Main Title and Refresh Button Row */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 leading-tight">
                  Pending Assignments
                </h1>
                <p className="text-gray-600 text-lg">
                  ⏰ {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} need{filteredAssignments.length === 1 ? 's' : ''} your attention
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3 hover:shadow-md transition-all"
                >
                  <RefreshCw className={`mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* DESIGN ONLY: Enhanced Alert Cards */}
        {(overdueAssignments.length > 0 || urgentAssignments.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {overdueAssignments.length > 0 && (
              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className="bg-red-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                      <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-800 mb-2">🚨 Overdue Assignments</p>
                      <p className="text-red-700 font-semibold text-lg">
                        {overdueAssignments.length} assignment{overdueAssignments.length > 1 ? 's are' : ' is'} overdue
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {urgentAssignments.length > 0 && (
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className="bg-orange-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                      <Timer className="h-10 w-10 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-800 mb-2">⚡ Due Soon</p>
                      <p className="text-orange-700 font-semibold text-lg">
                        {urgentAssignments.length} assignment{urgentAssignments.length > 1 ? 's' : ''} due within 3 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* DESIGN ONLY: Enhanced Search */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input
                placeholder="🔍 Search pending assignments by title, subject, or chapter..."
                className="pl-12 h-14 border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl text-lg bg-gray-50 hover:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* DESIGN ONLY: Enhanced Assignments List */}
        <div className="space-y-8">
          {filteredAssignments.length === 0 ? (
            <Card className="bg-white border-0 shadow-lg rounded-2xl">
              <CardContent className="p-20 text-center">
                <div className="bg-green-100 rounded-full p-8 w-fit mx-auto mb-8">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">🎉 All caught up!</h3>
                <p className="text-gray-500 text-xl mb-6">
                  {searchTerm 
                    ? 'No pending assignments found matching your search'
                    : 'No pending assignments found'
                  }
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-8 py-3"
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
                  className={`hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer group rounded-2xl overflow-hidden ${
                    isOverdue ? 'ring-4 ring-red-200 bg-gradient-to-r from-red-50 to-white' : 
                    isDueSoon ? 'ring-4 ring-orange-200 bg-gradient-to-r from-orange-50 to-white' : 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-white'
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-6 mb-6">
                          <div className={`w-5 h-20 rounded-full shadow-lg ${
                            isOverdue ? 'bg-gradient-to-b from-red-400 to-red-600' : 
                            isDueSoon ? 'bg-gradient-to-b from-orange-400 to-orange-600' : 'bg-gradient-to-b from-yellow-400 to-yellow-600'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-4 mb-4">
                              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                                {assignment.title}
                              </h3>
                              
                              {/* DESIGN ONLY: Enhanced Assignment Type Badge */}
                              <Badge className="bg-blue-50 text-blue-700 border-2 border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                                <span className="flex items-center space-x-2">
                                  {getAssignmentTypeIcon(assignmentType)}
                                  <span className="font-semibold">{assignmentType === 'online' ? 'Online Test' : 'File Submission'}</span>
                                </span>
                              </Badge>

                              <Badge className={`${getDifficultyColor(assignment.difficulty)} border-2 font-semibold px-4 py-2 rounded-xl`}>
                                {assignment.difficulty.toUpperCase()}
                              </Badge>
                              
                              {isOverdue && (
                                <Badge className="bg-red-600 text-white px-4 py-2 font-bold rounded-xl animate-pulse">
                                  🚨 OVERDUE
                                </Badge>
                              )}
                              {isDueSoon && !isOverdue && (
                                <Badge className="bg-orange-600 text-white px-4 py-2 font-bold rounded-xl">
                                  ⚡ DUE SOON
                                </Badge>
                              )}
                              {assignment.aiGenerated && (
                                <Badge className="bg-purple-50 text-purple-700 border-2 border-purple-200 px-4 py-2 rounded-xl">
                                  <Bot className="mr-2 h-4 w-4" />
                                  🤖 AI Generated
                                </Badge>
                              )}
                            </div>

                            {/* DESIGN ONLY: Enhanced Meta Info */}
                            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                <BookOpen className="h-4 w-4" />
                                <span className="font-semibold">{assignment.subject}</span>
                              </span>
                              <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                <Users className="h-4 w-4" />
                                <span className="font-semibold">Class {assignment.class}</span>
                              </span>
                              <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{assignment.timeEstimate}</span>
                              </span>
                              {assignmentType === 'online' && (
                                <span className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-semibold">{assignment.questions.length} questions</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 text-lg leading-relaxed ml-11">{assignment.description}</p>

                        {assignment.ncertChapter && (
                          <div className="mb-6 ml-11">
                            <Badge variant="outline" className="text-indigo-600 border-2 border-indigo-300 bg-indigo-50 px-4 py-2 rounded-xl">
                              📚 NCERT: {assignment.ncertChapter}
                            </Badge>
                          </div>
                        )}

                        {/* DESIGN ONLY: Enhanced Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 ml-11">
                          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="bg-blue-200 p-3 rounded-xl">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue-800 mb-1">Due Date</p>
                              <p className={`text-xl font-bold ${
                                isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-blue-900'
                              }`}>
                                {formatDate(assignment.dueDate)}
                              </p>
                              {isOverdue && (
                                <p className="text-sm text-red-600 font-semibold">
                                  🚨 {Math.abs(daysUntilDue)} days overdue
                                </p>
                              )}
                              {isDueSoon && !isOverdue && (
                                <p className="text-sm text-orange-600 font-semibold">
                                  ⚡ {daysUntilDue} days remaining
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="bg-purple-200 p-3 rounded-xl">
                              <Target className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-purple-800 mb-1">Total Marks</p>
                              <p className="text-xl font-bold text-purple-900">{assignment.totalMarks} points</p>
                            </div>
                          </div>
                        </div>

                        {/* DESIGN ONLY: Enhanced Action Section */}
                        <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 ml-11">
                          <div className="flex space-x-4">
                            <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                              <Button 
                                className={`px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                                  isOverdue 
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                                }`}
                              >
                                {assignmentType === 'online' ? (
                                  <>
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {isOverdue ? '🚨 Start Now' : '▶️ Start Assignment'}
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-5 w-5" />
                                    {isOverdue ? '🚨 Submit Now' : '📤 Submit Assignment'}
                                  </>
                                )}
                              </Button>
                            </Link>
                            
                            <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                              <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl">
                                <Eye className="mr-2 h-5 w-5" />
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
    </div>
  );
}
