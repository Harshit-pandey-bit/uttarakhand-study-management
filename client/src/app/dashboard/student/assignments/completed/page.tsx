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
  TrendingUp
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/student/assignments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Assignments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Completed Assignments</h1>
            <p className="text-gray-600 mt-1">{completedAssignments.length} assignments completed</p>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {averageScore ? averageScore.toFixed(1) : 'N/A'}%
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">A+ Grades</p>
                <p className="text-3xl font-bold text-blue-600">{aGrades}</p>
              </div>
              <Star className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-3xl font-bold text-purple-600">{completedAssignments.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search completed assignments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {completedAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No completed assignments</h3>
              <p className="text-gray-500">Complete some assignments to see them here</p>
            </CardContent>
          </Card>
        ) : (
          completedAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {assignment.status === 'completed' ? 'Completed' : 'Reviewed'}
                      </Badge>
                      {assignment.score && (
                        <Badge className={`${getGradeColor(assignment.score, assignment.maxScore)} bg-white border-2`}>
                          {getGradeLetter(assignment.score, assignment.maxScore)}
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
                        <span>{assignment.teacher}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{assignment.estimatedTime}</span>
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{assignment.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Completed On</p>
                          <p className="text-sm font-medium text-gray-900">
                            {assignment.gradeDate ? formatDate(assignment.gradeDate) : formatDate(assignment.dueDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Max Score</p>
                          <p className="text-sm font-medium text-gray-900">{assignment.maxScore} points</p>
                        </div>
                      </div>

                      {assignment.score !== undefined && (
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Your Score</p>
                            <p className={`text-sm font-medium ${getGradeColor(assignment.score, assignment.maxScore)}`}>
                              {assignment.score}/{assignment.maxScore} 
                              <span className="ml-1">({Math.round((assignment.score / assignment.maxScore) * 100)}%)</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {assignment.feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-xs font-medium text-blue-800 mb-1">Teacher Feedback</p>
                        <p className="text-sm text-blue-700">{assignment.feedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        {assignment.submissionFile && (
                          <Button size="sm" variant="outline">
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Submission
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
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
