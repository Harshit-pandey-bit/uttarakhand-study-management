// src/app/dashboard/hei-mentor/assignments/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Search, 
  Filter,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  MoreVertical,
  GraduationCap
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { Assignment, AssignmentFilters, AssignmentListResponse } from '@/types/hei-mentor';

const ASSIGNMENT_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800'
};

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AssignmentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const assignmentsPerPage = 12;

  useEffect(() => {
    fetchAssignments();
  }, [currentPage, filters]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      
      // Mock assignments data matching the exact schema
      const mockAssignments: Assignment[] = [
        {
          id: 'assignment_001',
          title: 'Introduction to Programming Concepts',
          description: 'Learn the fundamental concepts of programming including variables, loops, and functions.',
          subject: 'Computer Science',
          class_level: '11',
          teacher_id: 'mentor_001',
          due_date: '2025-10-15T23:59:59Z',
          total_marks: 50,
          difficulty: 'easy',
          ai_generated: false,
          ncert_chapter: 'Chapter 1: Introduction to Programming',
          time_estimate: 60,
          submission_format: ['pdf', 'docx'],
          questions: {
            mcq: [
              {
                id: 'q1',
                question: 'What is a variable in programming?',
                options: ['A storage location', 'A function', 'A loop', 'A condition'],
                correct_answer: 0,
                marks: 2
              }
            ],
            descriptive: [
              {
                id: 'q2',
                question: 'Explain the concept of loops with an example.',
                marks: 8
              }
            ]
          },
          teacher_notes: 'Focus on fundamental concepts. Encourage practical examples.',
          ai_insights: 'Students typically struggle with variable scope concepts.',
          is_active: true,
          created_at: '2025-10-01T10:00:00Z',
          updated_at: '2025-10-05T14:30:00Z'
        },
        {
          id: 'assignment_002', 
          title: 'Data Structures Implementation',
          description: 'Implement basic data structures like arrays, linked lists, and stacks using your preferred programming language.',
          subject: 'Computer Science',
          class_level: '12',
          teacher_id: 'mentor_001',
          due_date: '2025-10-20T23:59:59Z',
          total_marks: 100,
          difficulty: 'hard',
          ai_generated: true,
          ncert_chapter: 'Chapter 5: Data Structures',
          time_estimate: 120,
          submission_format: ['zip', 'github_link'],
          questions: {
            coding: [
              {
                id: 'c1',
                question: 'Implement a linked list with insert, delete, and search operations.',
                language: 'python',
                marks: 40,
                test_cases: [
                  { input: '[1,2,3], insert(0, 4)', output: '[4,1,2,3]' }
                ]
              }
            ]
          },
          teacher_notes: 'Emphasize clean code and proper documentation.',
          ai_insights: 'Focus on algorithm efficiency and memory management.',
          is_active: true,
          created_at: '2025-10-03T09:00:00Z',
          updated_at: '2025-10-03T09:00:00Z'
        },
        {
          id: 'assignment_003',
          title: 'Career Exploration Project',
          description: 'Research a career path that interests you and create a comprehensive presentation.',
          subject: 'Career Guidance',
          class_level: '10',
          teacher_id: 'mentor_001',
          due_date: '2025-10-25T23:59:59Z',
          total_marks: 75,
          difficulty: 'medium',
          ai_generated: false,
          ncert_chapter: undefined,
          time_estimate: 180,
          submission_format: ['pdf', 'ppt'],
          questions: {
            project: [
              {
                id: 'p1',
                question: 'Research and present on your chosen career including job description, required skills, education path, and salary expectations.',
                requirements: [
                  'Job description and responsibilities',
                  'Required skills and qualifications',
                  'Education pathway',
                  'Salary expectations',
                  'Growth prospects'
                ],
                marks: 75
              }
            ]
          },
          teacher_notes: 'Encourage students to interview professionals in their chosen field.',
          ai_insights: undefined,
          is_active: false, // Draft
          created_at: '2025-10-05T11:00:00Z',
          updated_at: '2025-10-05T11:00:00Z'
        }
      ];

      setAssignments(mockAssignments);
      setTotalAssignments(mockAssignments.length);
      setHasMore(false);
    } catch (err) {
      setError('Failed to load assignments');
      console.error('Assignments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof AssignmentFilters];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search would be handled by the API in real implementation
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.is_active) return 'inactive';
    
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    
    if (now > dueDate) return 'overdue';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    return ASSIGNMENT_STATUS_COLORS[status as keyof typeof ASSIGNMENT_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !filters.subject || assignment.subject === filters.subject;
    const matchesClass = !filters.class_level || assignment.class_level === filters.class_level;
    const matchesDifficulty = !filters.difficulty || assignment.difficulty === filters.difficulty;
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && assignment.is_active) ||
      (filters.status === 'inactive' && !assignment.is_active);
    
    return matchesSearch && matchesSubject && matchesClass && matchesDifficulty && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => fetchAssignments()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600">Create and manage assignments for your students</p>
        </div>
        <Link href="/dashboard/hei-mentor/assignments/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            <p className="text-sm text-gray-600">Total Assignments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-gray-900">
              {assignments.filter(a => a.is_active).length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-gray-900">
              {assignments.filter(a => !a.is_active).length}
            </p>
            <p className="text-sm text-gray-600">Drafts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(assignments.reduce((sum, a) => sum + a.total_marks, 0) / assignments.length || 0)}
            </p>
            <p className="text-sm text-gray-600">Avg. Total Marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assignments by title or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Subject Filter */}
              <Select 
                value={filters.subject || 'all'} 
                onValueChange={(value) => handleFilterChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Career Guidance">Career Guidance</SelectItem>
                </SelectContent>
              </Select>

              {/* Class Level Filter */}
              <Select 
                value={filters.class_level || 'all'} 
                onValueChange={(value) => handleFilterChange('class_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select 
                value={filters.difficulty || 'all'} 
                onValueChange={(value) => handleFilterChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <Button type="button" variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const dueDate = new Date(assignment.due_date);
            const isOverdue = new Date() > dueDate;
            
            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight mb-2">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {assignment.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status === 'inactive' ? 'Draft' : status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subject:</span>
                      <span className="font-medium">{assignment.subject}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Class:</span>
                      <div className="flex items-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        <span className="font-medium">{assignment.class_level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge className={DIFFICULTY_COLORS[assignment.difficulty]}>
                        {DIFFICULTY_LABELS[assignment.difficulty]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="font-semibold text-blue-600">{assignment.total_marks}</span>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className={`p-3 rounded-lg mb-4 ${isOverdue ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <div className="flex items-center">
                      <Calendar className={`h-4 w-4 mr-2 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                      <span className={`text-sm ${isOverdue ? 'text-red-800' : 'text-blue-800'}`}>
                        Due: {dueDate.toLocaleDateString('en-IN')} at {dueDate.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {assignment.time_estimate && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-gray-700">{assignment.time_estimate}min</span>
                        </div>
                      )}
                      {assignment.ai_generated && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                          <span className="text-purple-700">AI Generated</span>
                        </div>
                      )}
                      {assignment.ncert_chapter && (
                        <div className="col-span-2 text-gray-600 text-xs mt-1">
                          📖 {assignment.ncert_chapter}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      {assignment.submission_format.join(', ')} format
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/hei-mentor/assignments/${assignment.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      <Link href={`/dashboard/hei-mentor/assignments/${assignment.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? "No assignments match your current filters."
                : "You haven't created any assignments yet."}
            </p>
            <Link href="/dashboard/hei-mentor/assignments/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assignment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pagination - if needed */}
      {totalAssignments > assignmentsPerPage && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalAssignments / assignmentsPerPage)}
          </span>
          
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
