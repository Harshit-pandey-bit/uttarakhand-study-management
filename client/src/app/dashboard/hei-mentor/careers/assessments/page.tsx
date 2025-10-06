// src/app/dashboard/hei-mentor/careers/assessments/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  Filter,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  BrainCircuit,
  Target,
  Calendar,
  MessageSquare,
  Eye,
  Download,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';

// Career assessment interfaces
interface StudentAssessment {
  student_id: string;
  student_name: string;
  student_email: string;
  class_level: string;
  assessment_date: string;
  holland_code: string;
  primary_interests: string[];
  personality_type: string;
  recommended_careers: CareerRecommendation[];
  aptitude_scores: AptitudeScore[];
  completion_status: 'pending' | 'completed' | 'in_progress';
  counseling_status: 'not_scheduled' | 'scheduled' | 'completed';
  next_session_date?: string;
}

interface CareerRecommendation {
  career_title: string;
  match_percentage: number;
  industry: string;
  avg_salary: number;
  growth_outlook: 'high' | 'medium' | 'low';
  education_requirement: string;
  key_skills: string[];
}

interface AptitudeScore {
  category: string;
  score: number;
  percentile: number;
  description: string;
}

interface AssessmentFilters {
  class_level: string;
  completion_status: string;
  holland_code: string;
  counseling_status: string;
  search_query: string;
}

interface AssessmentStats {
  total_students: number;
  completed_assessments: number;
  pending_assessments: number;
  counseling_sessions_completed: number;
  avg_completion_time: number;
  top_holland_codes: { code: string; count: number; percentage: number }[];
  top_career_interests: { career: string; count: number; percentage: number }[];
}

export default function CareerAssessmentsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [activeTab, setActiveTab] = useState<'assessments' | 'insights'>('assessments');
  
  const [filters, setFilters] = useState<AssessmentFilters>({
    class_level: 'all',
    completion_status: 'all',
    holland_code: 'all',
    counseling_status: 'all',
    search_query: ''
  });

  useEffect(() => {
    fetchAssessmentData();
  }, [filters]);

  const fetchAssessmentData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock assessment data
      const mockAssessments: StudentAssessment[] = [
        {
          student_id: 'std_001',
          student_name: 'Arjun Sharma',
          student_email: 'arjun.sharma@school.edu',
          class_level: '12',
          assessment_date: '2025-09-15T10:30:00Z',
          holland_code: 'RIE',
          primary_interests: ['Technology', 'Engineering', 'Problem Solving'],
          personality_type: 'INTJ',
          recommended_careers: [
            {
              career_title: 'Software Engineer',
              match_percentage: 92,
              industry: 'Technology',
              avg_salary: 1200000,
              growth_outlook: 'high',
              education_requirement: 'Bachelor\'s in Computer Science',
              key_skills: ['Programming', 'Problem Solving', 'System Design']
            },
            {
              career_title: 'Data Scientist',
              match_percentage: 88,
              industry: 'Technology',
              avg_salary: 1400000,
              growth_outlook: 'high',
              education_requirement: 'Bachelor\'s in CS/Statistics',
              key_skills: ['Statistics', 'Machine Learning', 'Python']
            }
          ],
          aptitude_scores: [
            { category: 'Logical Reasoning', score: 89, percentile: 85, description: 'Strong analytical thinking' },
            { category: 'Quantitative Ability', score: 82, percentile: 78, description: 'Good mathematical skills' },
            { category: 'Verbal Ability', score: 74, percentile: 65, description: 'Average communication skills' }
          ],
          completion_status: 'completed',
          counseling_status: 'scheduled',
          next_session_date: '2025-10-20T14:00:00Z'
        },
        {
          student_id: 'std_002',
          student_name: 'Priya Patel',
          student_email: 'priya.patel@school.edu',
          class_level: '11',
          assessment_date: '2025-09-20T09:15:00Z',
          holland_code: 'ASE',
          primary_interests: ['Arts', 'Social Work', 'Communication'],
          personality_type: 'ENFP',
          recommended_careers: [
            {
              career_title: 'Marketing Manager',
              match_percentage: 90,
              industry: 'Marketing',
              avg_salary: 900000,
              growth_outlook: 'high',
              education_requirement: 'Bachelor\'s in Marketing/Business',
              key_skills: ['Creativity', 'Communication', 'Strategy']
            },
            {
              career_title: 'Content Creator',
              match_percentage: 85,
              industry: 'Media',
              avg_salary: 600000,
              growth_outlook: 'medium',
              education_requirement: 'Bachelor\'s in Mass Communication',
              key_skills: ['Writing', 'Social Media', 'Video Editing']
            }
          ],
          aptitude_scores: [
            { category: 'Creative Thinking', score: 91, percentile: 88, description: 'Exceptional creative abilities' },
            { category: 'Verbal Ability', score: 87, percentile: 82, description: 'Excellent communication skills' },
            { category: 'Logical Reasoning', score: 69, percentile: 58, description: 'Moderate analytical thinking' }
          ],
          completion_status: 'completed',
          counseling_status: 'not_scheduled'
        },
        {
          student_id: 'std_003',
          student_name: 'Rahul Singh',
          student_email: 'rahul.singh@school.edu',
          class_level: '12',
          assessment_date: '2025-09-25T11:45:00Z',
          holland_code: 'IRC',
          primary_interests: ['Research', 'Analysis', 'Innovation'],
          personality_type: 'INTP',
          recommended_careers: [
            {
              career_title: 'Research Scientist',
              match_percentage: 94,
              industry: 'Research',
              avg_salary: 1100000,
              growth_outlook: 'medium',
              education_requirement: 'PhD in relevant field',
              key_skills: ['Research', 'Analysis', 'Critical Thinking']
            }
          ],
          aptitude_scores: [
            { category: 'Logical Reasoning', score: 95, percentile: 92, description: 'Outstanding analytical abilities' },
            { category: 'Quantitative Ability', score: 88, percentile: 85, description: 'Strong mathematical skills' }
          ],
          completion_status: 'in_progress',
          counseling_status: 'not_scheduled'
        }
      ];

      const mockStats: AssessmentStats = {
        total_students: 45,
        completed_assessments: 32,
        pending_assessments: 13,
        counseling_sessions_completed: 18,
        avg_completion_time: 35,
        top_holland_codes: [
          { code: 'RIE', count: 12, percentage: 37.5 },
          { code: 'ASE', count: 8, percentage: 25.0 },
          { code: 'IRC', count: 6, percentage: 18.8 },
          { code: 'SEA', count: 4, percentage: 12.5 },
          { code: 'ECS', count: 2, percentage: 6.2 }
        ],
        top_career_interests: [
          { career: 'Software Engineer', count: 15, percentage: 33.3 },
          { career: 'Marketing Manager', count: 8, percentage: 17.8 },
          { career: 'Data Scientist', count: 7, percentage: 15.6 },
          { career: 'Research Scientist', count: 5, percentage: 11.1 }
        ]
      };

      setAssessments(mockAssessments);
      setStats(mockStats);
      
    } catch (error) {
      console.error('Failed to fetch assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCounselingStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      not_scheduled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getGrowthOutlookColor = (outlook: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return colors[outlook] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = (salary: number): string => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}L`;
    } else if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(0)}K`;
    }
    return `₹${salary}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Assessments</h1>
          <p className="text-gray-600">Track student career assessments and provide personalized guidance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => fetchAssessmentData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.total_students}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed_assessments}</p>
                  <p className="text-xs text-green-600">
                    {((stats.completed_assessments / stats.total_students) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending_assessments}</p>
                  <p className="text-xs text-yellow-600">Need follow-up</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Counseling Sessions</p>
                  <p className="text-2xl font-bold">{stats.counseling_sessions_completed}</p>
                  <p className="text-xs text-purple-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'assessments' | 'insights')}>
        <TabsList>
          <TabsTrigger value="assessments">Student Assessments</TabsTrigger>
          <TabsTrigger value="insights">Career Insights</TabsTrigger>
        </TabsList>

        {/* Student Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search students..."
                      value={filters.search_query}
                      onChange={(e) => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filters.class_level} onValueChange={(value) => setFilters(prev => ({ ...prev, class_level: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.completion_status} onValueChange={(value) => setFilters(prev => ({ ...prev, completion_status: value }))}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.counseling_status} onValueChange={(value) => setFilters(prev => ({ ...prev, counseling_status: value }))}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counseling</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="not_scheduled">Not Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assessments List */}
          <div className="space-y-4">
            {assessments.map((assessment: StudentAssessment) => (
              <Card key={assessment.student_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assessment.student_name}</h3>
                      <p className="text-sm text-gray-600">{assessment.student_email} • Class {assessment.class_level}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Assessment Date: {new Date(assessment.assessment_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assessment.completion_status)}>
                        {assessment.completion_status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getCounselingStatusColor(assessment.counseling_status)}>
                        {assessment.counseling_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {assessment.completion_status === 'completed' && (
                    <div className="space-y-4">
                      {/* Holland Code & Personality */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Holland Code</p>
                          <p className="text-lg font-bold text-blue-900">{assessment.holland_code}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-purple-800">Personality Type</p>
                          <p className="text-lg font-bold text-purple-900">{assessment.personality_type}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Top Match</p>
                          <p className="text-sm font-bold text-green-900">
                            {assessment.recommended_careers[0]?.career_title}
                          </p>
                          <p className="text-xs text-green-700">
                            {assessment.recommended_careers[0]?.match_percentage}% match
                          </p>
                        </div>
                      </div>

                      {/* Interest Areas */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Primary Interests:</p>
                        <div className="flex flex-wrap gap-2">
                          {assessment.primary_interests.map((interest: string) => (
                            <Badge key={interest} variant="outline">{interest}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Top Career Recommendations */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Top Career Recommendations:</p>
                        <div className="space-y-2">
                          {assessment.recommended_careers.slice(0, 2).map((career: CareerRecommendation) => (
                            <div key={career.career_title} className="border rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{career.career_title}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge className={getGrowthOutlookColor(career.growth_outlook)}>
                                    {career.growth_outlook} growth
                                  </Badge>
                                  <span className="text-sm font-medium text-green-600">
                                    {formatSalary(career.avg_salary)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Progress value={career.match_percentage} className="w-20 h-2" />
                                  <span className="text-xs text-gray-600">{career.match_percentage}% match</span>
                                </div>
                                <p className="text-xs text-gray-600">{career.education_requirement}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Session Info */}
                      {assessment.counseling_status === 'scheduled' && assessment.next_session_date && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm text-blue-800">
                              Next counseling session: {new Date(assessment.next_session_date).toLocaleDateString('en-IN')} at {new Date(assessment.next_session_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    <Link href={`/dashboard/hei-mentor/careers/assessments/${assessment.student_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {assessment.counseling_status === 'not_scheduled' && (
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Career Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Holland Code Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Holland Code Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.top_holland_codes.map((item) => (
                      <div key={item.code} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-800">{item.code}</span>
                          </div>
                          <span className="font-medium">{item.code}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.percentage} className="w-20 h-2" />
                          <span className="text-sm text-gray-600 w-16">{item.count} students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Career Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Popular Career Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.top_career_interests.map((item, index) => (
                      <div key={item.career} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.career}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.percentage} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
