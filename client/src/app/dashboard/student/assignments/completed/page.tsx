'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Filter
} from 'lucide-react';
import { mockAssignments, Assignment } from '@/lib/assignments-data';

export default function CompletedAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    let filtered = mockAssignments.filter(assignment => 
      assignment.status === 'completed' || assignment.status === 'reviewed'
    );

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.gradeDate ? new Date(a.gradeDate).getTime() : new Date(a.assignedDate).getTime();
      const dateB = b.gradeDate ? new Date(b.gradeDate).getTime() : new Date(b.assignedDate).getTime();
      return dateB - dateA;
    });

    setCompletedAssignments(filtered);
  }, [searchTerm]);

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
    return 'C';
  };

  // Statistics
  const averageScore = completedAssignments
    .filter(a => a.score !== undefined)
    .reduce((acc, a) => acc + ((a.score || 0) / a.maxScore * 100), 0) / 
    completedAssignments.filter(a => a.score !== undefined).length;

  const aGrades = completedAssignments.filter(a => a.score && (a.score / a.maxScore * 100) >= 90).length;
  const totalGraded = completedAssignments.filter(a => a.score !== undefined).length;

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Completed Assignments</h1>
              <p className="text-gray-600 text-lg">{completedAssignments.length} assignments successfully completed</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 hover:border-gray-400">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-8 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Average Score</p>
                </div>
                <p className="text-4xl font-bold text-green-600 mb-1">
                  {averageScore ? averageScore.toFixed(1) : 'N/A'}%
                </p>
                <p className="text-sm text-gray-500">Overall performance</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">A+ Grades</p>
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-1">{aGrades}</p>
                <p className="text-sm text-gray-500">Excellent work!</p>
              </div>
              <Star className="h-12 w-12 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Completed</p>
                </div>
                <p className="text-4xl font-bold text-purple-600 mb-1">{completedAssignments.length}</p>
                <p className="text-sm text-gray-500">Assignments done</p>
              </div>
              <CheckCircle className="h-12 w-12 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search completed assignments by title or subject..."
              className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assignments List */}
      <div className="space-y-6">
        {completedAssignments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No completed assignments found</h3>
              <p className="text-gray-500 text-lg">Complete some assignments to see them here</p>
            </CardContent>
          </Card>
        ) : (
          completedAssignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              className="hover:shadow-lg transition-all duration-200 border-0 bg-white cursor-pointer group hover:bg-green-50"
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-4 h-16 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                            {assignment.title}
                          </h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 font-medium">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {assignment.status === 'completed' ? 'Completed' : 'Reviewed'}
                          </Badge>
                          {assignment.score && (
                            <Badge className={`${getGradeBgColor(assignment.score, assignment.maxScore)} border font-bold px-3 py-1 text-lg`}>
                              {getGradeLetter(assignment.score, assignment.maxScore)}
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
                            <span className="font-medium">{assignment.teacher}</span>
                          </span>
                          <span className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{assignment.estimatedTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 text-lg leading-relaxed ml-6">{assignment.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ml-6">
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completed On</p>
                          <p className="text-lg font-bold text-gray-900">
                            {assignment.gradeDate ? formatDate(assignment.gradeDate) : formatDate(assignment.dueDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Max Score</p>
                          <p className="text-lg font-bold text-gray-900">{assignment.maxScore} points</p>
                        </div>
                      </div>

                      {assignment.score !== undefined && (
                        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Your Score</p>
                            <p className={`text-lg font-bold ${getGradeColor(assignment.score, assignment.maxScore)}`}>
                              {assignment.score}/{assignment.maxScore} 
                              <span className="ml-1 text-sm">({Math.round((assignment.score / assignment.maxScore) * 100)}%)</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {assignment.feedback && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6 ml-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <p className="font-semibold text-blue-800">Teacher Feedback</p>
                        </div>
                        <p className="text-blue-700 leading-relaxed">{assignment.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 ml-6">
                      <div className="flex space-x-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        {assignment.submissionFile && (
                          <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                            <FileText className="mr-2 h-4 w-4" />
                            View Submission
                          </Button>
                        )}
                        <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Submitted on {formatDate(assignment.dueDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
