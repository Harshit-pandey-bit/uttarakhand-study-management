'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ArrowRight
} from 'lucide-react';
import { mockAssignments, mockSubjects, Assignment, Subject } from '@/lib/assignments-data';

export default function AllAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === subjectFilter);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, subjectFilter]);

  // Statistics
  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed' || a.status === 'reviewed').length;
  const dueSoonAssignments = assignments.filter(a => {
    const daysUntilDue = Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3 && daysUntilDue >= 0 && a.status === 'pending';
  }).length;

  const completionRate = Math.round((completedAssignments / totalAssignments) * 100);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Assignments</h1>
          <p className="text-gray-600 mt-1">Manage and track all your academic assignments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Assignment
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/student/assignments/pending">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingAssignments}</p>
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
                  <p className="text-3xl font-bold text-green-600">{completedAssignments}</p>
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

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-3xl font-bold text-red-600">{dueSoonAssignments}</p>
                <p className="text-sm text-gray-500 mt-1">Next 3 days</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalAssignments}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{completedAssignments}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {assignments.filter(a => a.category === 'project').length}
                  </p>
                  <p className="text-xs text-gray-600">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {assignments.filter(a => a.priority === 'high').length}
                  </p>
                  <p className="text-xs text-gray-600">High Priority</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {assignments.filter(a => a.score && a.score >= 90).length} A+ Grades
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assignments..."
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
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
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
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && assignment.status === 'pending';

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
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </Badge>
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
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className={`text-sm font-medium ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
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
                              <p className="text-sm font-medium text-green-600">
                                {assignment.score}/{assignment.maxScore}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {assignment.status === 'pending' && (
                            <Button size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Submit
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {isOverdue && <span className="text-red-600 font-medium">OVERDUE</span>}
                          {isDueSoon && !isOverdue && (
                            <span className="text-orange-600 font-medium">DUE IN {Math.abs(daysUntilDue)} DAYS</span>
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
    </div>
  );
}
