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
  CheckCircle
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
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const urgentAssignments = pendingAssignments.filter(a => getDaysUntilDue(a.dueDate) <= 3);
  const overdueAssignments = pendingAssignments.filter(a => getDaysUntilDue(a.dueDate) < 0);

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
            <h1 className="text-3xl font-bold text-gray-900">Pending Assignments</h1>
            <p className="text-gray-600 mt-1">{pendingAssignments.length} assignments need your attention</p>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {(overdueAssignments.length > 0 || urgentAssignments.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overdueAssignments.length > 0 && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Overdue Assignments</p>
                    <p className="text-sm text-red-700">{overdueAssignments.length} assignments are overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {urgentAssignments.length > 0 && (
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-800">Due Soon</p>
                    <p className="text-sm text-orange-700">{urgentAssignments.length} assignments due in 3 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search pending assignments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {pendingAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
              <p className="text-gray-500">No pending assignments found</p>
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
                        {isOverdue && (
                          <Badge className="bg-red-600 text-white">
                            OVERDUE
                          </Badge>
                        )}
                        {isDueSoon && !isOverdue && (
                          <Badge className="bg-orange-600 text-white">
                            DUE SOON
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className={`text-sm font-medium ${
                              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-900'
                            }`}>
                              {formatDate(assignment.dueDate)}
                              {isOverdue && <span className="ml-2 text-red-600">({Math.abs(daysUntilDue)} days overdue)</span>}
                              {isDueSoon && !isOverdue && <span className="ml-2 text-orange-600">({daysUntilDue} days left)</span>}
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
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" className={isOverdue ? 'bg-red-600 hover:bg-red-700' : ''}>
                            <Upload className="mr-2 h-4 w-4" />
                            {isOverdue ? 'Submit Now' : 'Submit Assignment'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
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
