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
  CheckCircle,
  Search,
  ArrowLeft,
  Users,
  Target,
  Eye,
  Star,
  Award,
  TrendingUp,
  Download,
  FileText,
  RefreshCw,
  AlertCircle,
  Bot,
  PlayCircle,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentStatus,
  DifficultyLevel,
  AssignmentListResponseDto
} from '@/types/api';

export default function CompletedAssignmentsPage() {
  const { user } = useAuth();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [completedAssignments, setCompletedAssignments] = useState<AssignmentDto[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      loadCompletedAssignments();
    }
  }, [user]);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, completedAssignments]);

  const loadCompletedAssignments = async () => {
    try {
      setLoading(!completedAssignments.length);
      setError(null);

      // Get completed assignments (both submitted and graded)
      const response = await apiClient.getMyCompletedAssignments();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setCompletedAssignments(response.data.assignments);
      }
    } catch (err: unknown) {
      console.error('Error loading completed assignments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assignments';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAssignments = () => {
    let filtered = completedAssignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.ncertChapter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCompletedAssignments();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getGradeBgColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'bg-green-50 text-green-700 border-green-200';
    if (percentage >= 80) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const getGradeLetter = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  const getAssignmentType = (assignment: AssignmentDto): 'online' | 'file' => {
    return assignment.questions && assignment.questions.length > 0 ? 'online' : 'file';
  };

  const getAssignmentTypeIcon = (type: 'online' | 'file') => {
    return type === 'online' 
      ? <PlayCircle className="h-4 w-4 text-blue-500" />
      : <FileText className="h-4 w-4 text-green-500" />;
  };

  // Statistics calculations
  const gradedAssignments = filteredAssignments.filter(a => a.score !== undefined);
  const averageScore = gradedAssignments.length > 0
    ? gradedAssignments.reduce((acc, a) => acc + ((a.score || 0) / a.totalMarks * 100), 0) / gradedAssignments.length
    : 0;
  const aGrades = gradedAssignments.filter(a => a.score && (a.score / a.totalMarks * 100) >= 90).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* DESIGN ONLY: Enhanced Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
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

          {/* DESIGN ONLY: Enhanced Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-3" />
                      <Skeleton className="h-12 w-20 mb-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <div className="grid grid-cols-3 gap-6">
                      <Skeleton className="h-20 w-full rounded-xl" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* DESIGN ONLY: Enhanced Symmetric Error Header */}
          <div className="bg-white rounded-2xl shadow-lg border p-8">
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
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">Completed Assignments</h1>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Symmetric Header */}
        <div className="bg-white rounded-2xl shadow-lg border p-8">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3 leading-tight">
                  Completed Assignments
                </h1>
                <p className="text-gray-600 text-lg">
                  🎉 {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} successfully completed
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

        {/* DESIGN ONLY: Enhanced Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-4 h-10 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-bold text-green-800 uppercase tracking-wide">Average Score</p>
                  </div>
                  <p className="text-5xl font-bold text-green-700 mb-2">
                    {averageScore ? averageScore.toFixed(1) : '0.0'}%
                  </p>
                  <p className="text-green-600 font-medium">Overall performance</p>
                </div>
                <div className="bg-green-200 p-4 rounded-2xl">
                  <TrendingUp className="h-12 w-12 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-4 h-10 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">A+ Grades</p>
                  </div>
                  <p className="text-5xl font-bold text-blue-700 mb-2">{aGrades}</p>
                  <p className="text-blue-600 font-medium">Excellent work!</p>
                </div>
                <div className="bg-blue-200 p-4 rounded-2xl">
                  <Star className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-4 h-10 bg-purple-500 rounded-full"></div>
                    <p className="text-sm font-bold text-purple-800 uppercase tracking-wide">Total Completed</p>
                  </div>
                  <p className="text-5xl font-bold text-purple-700 mb-2">{filteredAssignments.length}</p>
                  <p className="text-purple-600 font-medium">Assignments done</p>
                </div>
                <div className="bg-purple-200 p-4 rounded-2xl">
                  <CheckCircle className="h-12 w-12 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DESIGN ONLY: Enhanced Search */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input
                placeholder="🔍 Search completed assignments by title, subject, or chapter..."
                className="pl-12 h-14 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-xl text-lg bg-gray-50 hover:bg-white transition-colors"
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
                <div className="bg-gray-100 rounded-full p-8 w-fit mx-auto mb-8">
                  <BookOpen className="h-20 w-20 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                  {searchTerm ? '🔍 No completed assignments found' : '📚 No completed assignments yet'}
                </h3>
                <p className="text-gray-500 text-xl mb-6">
                  {searchTerm 
                    ? 'No completed assignments found matching your search'
                    : 'Complete some assignments to see them here'
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
              const assignmentType = getAssignmentType(assignment);

              return (
                <Card 
                  key={assignment.id} 
                  className="hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer group hover:bg-gradient-to-r hover:from-green-50 hover:to-white rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-6 mb-6">
                          <div className="w-5 h-20 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-lg"></div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-4 mb-4">
                              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                {assignment.title}
                              </h3>
                              
                              {/* DESIGN ONLY: Enhanced Assignment Type Badge */}
                              <Badge className="bg-blue-50 text-blue-700 border-2 border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                                <span className="flex items-center space-x-2">
                                  {getAssignmentTypeIcon(assignmentType)}
                                  <span className="font-semibold">{assignmentType === 'online' ? 'Online Test' : 'File Submission'}</span>
                                </span>
                              </Badge>

                              <Badge className="bg-green-50 text-green-700 border-2 border-green-200 px-4 py-2 rounded-xl font-semibold">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {assignment.status === AssignmentStatus.GRADED ? '✅ Graded' : '📤 Submitted'}
                              </Badge>
                              
                              {assignment.score !== undefined && (
                                <Badge className={`${getGradeBgColor(assignment.score, assignment.totalMarks)} border-2 font-bold px-4 py-2 text-xl rounded-xl`}>
                                  {getGradeLetter(assignment.score, assignment.totalMarks)}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ml-11">
                          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="bg-blue-200 p-3 rounded-xl">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue-800 mb-1">Completed On</p>
                              <p className="text-xl font-bold text-blue-900">
                                {assignment.submittedAt ? formatDate(assignment.submittedAt) : formatDate(assignment.dueDate)}
                              </p>
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

                          {assignment.score !== undefined && (
                            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:shadow-md transition-shadow">
                              <div className="bg-green-200 p-3 rounded-xl">
                                <Award className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-green-800 mb-1">Your Score</p>
                                <p className={`text-xl font-bold ${getGradeColor(assignment.score, assignment.totalMarks)}`}>
                                  {assignment.score}/{assignment.totalMarks} 
                                  <span className="ml-1 text-sm">({Math.round((assignment.score / assignment.totalMarks) * 100)}%)</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* DESIGN ONLY: Enhanced Feedback Section */}
                        {assignment.feedback && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-2xl p-8 mb-6 ml-11 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="bg-blue-200 p-2 rounded-xl">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <p className="text-xl font-bold text-blue-800">💬 Teacher Feedback</p>
                            </div>
                            <p className="text-blue-800 leading-relaxed text-lg">{assignment.feedback}</p>
                          </div>
                        )}

                        {/* DESIGN ONLY: Enhanced Action Section */}
                        <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 ml-11">
                          <div className="flex space-x-4">
                            <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                <Eye className="mr-2 h-5 w-5" />
                                View Details
                              </Button>
                            </Link>
                            
                            {assignment.grade && (
                              <Badge className="bg-gray-100 text-gray-700 px-6 py-3 text-base font-semibold rounded-xl border-2 border-gray-200">
                                🏆 Grade: {assignment.grade}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-6 py-3 rounded-full border-2 border-gray-200">
                            📅 Submitted on {assignment.submittedAt ? formatDate(assignment.submittedAt) : formatDate(assignment.dueDate)}
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
