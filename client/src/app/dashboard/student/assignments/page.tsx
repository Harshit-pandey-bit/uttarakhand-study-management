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
  ArrowRight,
  Plus
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Assignments</h1>
            <p className="text-gray-600 text-lg">Manage and track all your academic assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 hover:border-gray-400">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/student/assignments/pending">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white hover:bg-orange-50 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-8 bg-orange-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</p>
                  </div>
                  <p className="text-4xl font-bold text-orange-600 mb-1">{pendingAssignments}</p>
                  <p className="text-sm text-gray-500">Need your attention</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Timer className="h-12 w-12 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/assignments/completed">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white hover:bg-green-50 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-8 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-1">{completedAssignments}</p>
                  <p className="text-sm text-gray-500">Well done!</p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-12 w-12 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-0 bg-white hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-red-50 group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-8 bg-red-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Due Soon</p>
                </div>
                <p className="text-4xl font-bold text-red-600 mb-1">{dueSoonAssignments}</p>
                <p className="text-sm text-gray-500">Next 3 days</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-500 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xl text-gray-900">Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Completion Rate</span>
                  <span className="font-bold text-blue-600">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 mb-1">{totalAssignments}</p>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-1">{completedAssignments}</p>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xl text-gray-900">Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    {assignments.filter(a => a.category === 'project').length}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600 mb-1">
                    {assignments.filter(a => a.priority === 'high').length}
                  </p>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {assignments.filter(a => a.score && a.score >= 90).length} A+ Grades
                  </p>
                  <p className="text-sm font-medium text-gray-600">Excellent Performance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by title, subject, or description..."
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-12 border-gray-300">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Status" />
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
                <SelectTrigger className="w-[160px] h-12 border-gray-300">
                  <SelectValue placeholder="All Subjects" />
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

      {/* Enhanced Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No assignments found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search criteria or filters</p>
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
                className={`hover:shadow-lg transition-all duration-200 border-0 bg-white cursor-pointer group ${
                  isOverdue ? 'ring-2 ring-red-200 bg-red-50' : 
                  isDueSoon ? 'ring-2 ring-orange-200 bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {assignment.title}
                        </h3>
                        <Badge className={`${getPriorityColor(assignment.priority)} border font-medium px-3 py-1`}>
                          {assignment.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getStatusColor(assignment.status)} border font-medium px-3 py-1`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </Badge>
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

                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">{assignment.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Due Date</p>
                            <p className={`text-lg font-bold ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
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
                              <p className="text-lg font-bold text-green-600">
                                {assignment.score}/{assignment.maxScore}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-3">
                          {assignment.status === 'pending' && (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Upload className="mr-2 h-4 w-4" />
                              Submit Assignment
                            </Button>
                          )}
                          <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                        
                        <div className="text-sm font-medium">
                          {isOverdue && (
                            <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">
                              OVERDUE
                            </span>
                          )}
                          {isDueSoon && !isOverdue && (
                            <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                              DUE IN {Math.abs(daysUntilDue)} DAYS
                            </span>
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
