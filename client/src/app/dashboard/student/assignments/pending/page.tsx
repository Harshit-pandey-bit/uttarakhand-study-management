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
  Plus
} from 'lucide-react';
import { mockAssignments, Assignment } from '@/lib/assignments-data';

export default function PendingAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    let filtered = mockAssignments.filter(assignment => assignment.status === 'pending');

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by due date (urgent first)
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    setPendingAssignments(filtered);
  }, [searchTerm]);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const urgentAssignments = pendingAssignments.filter(a => getDaysUntilDue(a.dueDate) <= 3);
  const overdueAssignments = pendingAssignments.filter(a => getDaysUntilDue(a.dueDate) < 0);

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
                {pendingAssignments.length} assignments need your attention
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Start Working
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
              placeholder="Search pending assignments by title or subject..."
              className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assignments List */}
      <div className="space-y-6">
        {pendingAssignments.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">All caught up!</h3>
              <p className="text-gray-500 text-lg">No pending assignments found</p>
            </CardContent>
          </Card>
        ) : (
          pendingAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

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
                            <Badge className={`${getPriorityColor(assignment.priority)} border font-medium px-3 py-1`}>
                              {assignment.priority.toUpperCase()}
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
                            <p className="text-sm font-medium text-gray-600">Max Score</p>
                            <p className="text-lg font-bold text-gray-900">{assignment.maxScore} points</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 ml-6">
                        <div className="flex space-x-3">
                          <Button 
                            className={`${
                              isOverdue 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-orange-600 hover:bg-orange-700 text-white'
                            }`}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isOverdue ? 'Submit Now' : 'Submit Assignment'}
                          </Button>
                          <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" className="border-gray-300 hover:border-gray-400">
                            <FileText className="mr-2 h-4 w-4" />
                            Instructions
                          </Button>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Assigned {formatDate(assignment.assignedDate)}
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
