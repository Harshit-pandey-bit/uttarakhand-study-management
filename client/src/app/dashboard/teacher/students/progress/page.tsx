'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Users, 
  Search, 
  Eye, 
  Download, 
  Filter,
  BarChart3,
  LineChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  BookOpen,
  FileText,
  Activity,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

// Student Progress Data Interface
interface StudentProgress {
  id: number;
  name: string;
  class: string;
  rollNo: string;
  avatar: string;
  overallGrade: string;
  overallProgress: number;
  attendanceRate: number;
  subjects: {
    [key: string]: SubjectProgress;
  };
  monthlyTrends: MonthlyTrend[];
  strengths: string[];
  improvementAreas: string[];
  recentAssignments: Assignment[];
  learningGoals: LearningGoal[];
  parentEngagement: number;
}

interface SubjectProgress {
  currentGrade: number;
  previousGrade: number;
  trend: 'up' | 'down' | 'stable';
  assignmentsCompleted: number;
  totalAssignments: number;
  lastAssessment: {
    score: number;
    date: string;
    feedback: string;
  };
}

interface MonthlyTrend {
  month: string;
  overall: number;
  mathematics: number;
  science: number;
  english: number;
  socialScience: number;
  hindi: number;
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  submittedDate: string;
  score: number;
  maxScore: number;
  status: 'completed' | 'pending' | 'late';
}

interface LearningGoal {
  id: number;
  title: string;
  subject: string;
  targetDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed' | 'overdue';
}

// Comprehensive student progress data
const studentProgressData: StudentProgress[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    class: "10th A",
    rollNo: "2024001",
    avatar: "/students/rahul.jpg",
    overallGrade: "A",
    overallProgress: 88,
    attendanceRate: 94,
    subjects: {
      mathematics: {
        currentGrade: 92,
        previousGrade: 89,
        trend: 'up',
        assignmentsCompleted: 23,
        totalAssignments: 25,
        lastAssessment: {
          score: 45,
          date: "2025-09-25",
          feedback: "Excellent understanding of quadratic equations. Shows strong analytical thinking."
        }
      },
      science: {
        currentGrade: 89,
        previousGrade: 91,
        trend: 'down',
        assignmentsCompleted: 21,
        totalAssignments: 24,
        lastAssessment: {
          score: 42,
          date: "2025-09-20",
          feedback: "Good grasp of concepts but needs to focus more on practical applications."
        }
      },
      english: {
        currentGrade: 78,
        previousGrade: 78,
        trend: 'stable',
        assignmentsCompleted: 19,
        totalAssignments: 22,
        lastAssessment: {
          score: 35,
          date: "2025-09-22",
          feedback: "Writing skills are improving. Work on vocabulary expansion."
        }
      },
      socialScience: {
        currentGrade: 85,
        previousGrade: 82,
        trend: 'up',
        assignmentsCompleted: 20,
        totalAssignments: 23,
        lastAssessment: {
          score: 40,
          date: "2025-09-18",
          feedback: "Shows good understanding of historical concepts and timeline."
        }
      },
      hindi: {
        currentGrade: 88,
        previousGrade: 86,
        trend: 'up',
        assignmentsCompleted: 22,
        totalAssignments: 24,
        lastAssessment: {
          score: 44,
          date: "2025-09-15",
          feedback: "Excellent comprehension and expression. Creative writing is particularly strong."
        }
      }
    },
    monthlyTrends: [
      { month: "May 2025", overall: 82, mathematics: 87, science: 85, english: 74, socialScience: 79, hindi: 84 },
      { month: "Jun 2025", overall: 84, mathematics: 88, science: 87, english: 76, socialScience: 81, hindi: 85 },
      { month: "Jul 2025", overall: 86, mathematics: 90, science: 89, english: 77, socialScience: 83, hindi: 87 },
      { month: "Aug 2025", overall: 87, mathematics: 91, science: 90, english: 78, socialScience: 84, hindi: 88 },
      { month: "Sep 2025", overall: 88, mathematics: 92, science: 89, english: 78, socialScience: 85, hindi: 88 }
    ],
    strengths: ["Mathematical Problem Solving", "Analytical Thinking", "Creative Expression", "Leadership"],
    improvementAreas: ["English Grammar", "Science Practicals", "Time Management"],
    recentAssignments: [
      { id: 1, title: "Quadratic Equations Test", subject: "Mathematics", submittedDate: "2025-09-25", score: 45, maxScore: 50, status: 'completed' },
      { id: 2, title: "Chemical Reactions Lab Report", subject: "Science", submittedDate: "2025-09-20", score: 42, maxScore: 50, status: 'completed' },
      { id: 3, title: "Essay: My Dreams", subject: "English", submittedDate: "2025-09-22", score: 35, maxScore: 45, status: 'completed' }
    ],
    learningGoals: [
      { id: 1, title: "Master Trigonometry Concepts", subject: "Mathematics", targetDate: "2025-10-15", progress: 75, status: 'on-track' },
      { id: 2, title: "Improve English Writing Skills", subject: "English", targetDate: "2025-11-01", progress: 45, status: 'at-risk' },
      { id: 3, title: "Complete Science Project", subject: "Science", targetDate: "2025-10-05", progress: 90, status: 'on-track' }
    ],
    parentEngagement: 85
  },
  {
    id: 2,
    name: "Priya Singh",
    class: "9th B",
    rollNo: "2024002",
    avatar: "/students/priya.jpg",
    overallGrade: "A+",
    overallProgress: 94,
    attendanceRate: 98,
    subjects: {
      mathematics: {
        currentGrade: 90,
        previousGrade: 88,
        trend: 'up',
        assignmentsCompleted: 28,
        totalAssignments: 28,
        lastAssessment: {
          score: 48,
          date: "2025-09-24",
          feedback: "Outstanding problem-solving approach. Excellent mathematical reasoning."
        }
      },
      science: {
        currentGrade: 96,
        previousGrade: 94,
        trend: 'up',
        assignmentsCompleted: 26,
        totalAssignments: 26,
        lastAssessment: {
          score: 49,
          date: "2025-09-21",
          feedback: "Exceptional understanding of scientific concepts. Great practical skills."
        }
      },
      english: {
        currentGrade: 91,
        previousGrade: 89,
        trend: 'up',
        assignmentsCompleted: 24,
        totalAssignments: 25,
        lastAssessment: {
          score: 43,
          date: "2025-09-19",
          feedback: "Excellent writing skills and vocabulary. Creative expression is remarkable."
        }
      },
      socialScience: {
        currentGrade: 93,
        previousGrade: 92,
        trend: 'up',
        assignmentsCompleted: 25,
        totalAssignments: 25,
        lastAssessment: {
          score: 47,
          date: "2025-09-17",
          feedback: "Shows deep understanding of social concepts and current affairs."
        }
      },
      hindi: {
        currentGrade: 92,
        previousGrade: 90,
        trend: 'up',
        assignmentsCompleted: 23,
        totalAssignments: 24,
        lastAssessment: {
          score: 46,
          date: "2025-09-16",
          feedback: "Excellent command over language. Poetry writing is particularly impressive."
        }
      }
    },
    monthlyTrends: [
      { month: "May 2025", overall: 89, mathematics: 86, science: 92, english: 88, socialScience: 90, hindi: 89 },
      { month: "Jun 2025", overall: 91, mathematics: 87, science: 93, english: 89, socialScience: 91, hindi: 90 },
      { month: "Jul 2025", overall: 92, mathematics: 88, science: 94, english: 90, socialScience: 92, hindi: 91 },
      { month: "Aug 2025", overall: 93, mathematics: 89, science: 95, english: 90, socialScience: 92, hindi: 91 },
      { month: "Sep 2025", overall: 94, mathematics: 90, science: 96, english: 91, socialScience: 93, hindi: 92 }
    ],
    strengths: ["Research Skills", "Scientific Inquiry", "Environmental Awareness", "Communication"],
    improvementAreas: ["Mathematics Speed", "Public Speaking"],
    recentAssignments: [
      { id: 4, title: "Ecosystem Research Project", subject: "Science", submittedDate: "2025-09-21", score: 49, maxScore: 50, status: 'completed' },
      { id: 5, title: "Mathematical Patterns", subject: "Mathematics", submittedDate: "2025-09-24", score: 48, maxScore: 50, status: 'completed' }
    ],
    learningGoals: [
      { id: 4, title: "Environmental Science Project", subject: "Science", targetDate: "2025-10-10", progress: 85, status: 'on-track' },
      { id: 5, title: "Advanced Math Problem Solving", subject: "Mathematics", targetDate: "2025-10-20", progress: 70, status: 'on-track' }
    ],
    parentEngagement: 92
  },
  {
    id: 3,
    name: "Amit Kumar",
    class: "8th C",
    rollNo: "2024003",
    avatar: "/students/amit.jpg",
    overallGrade: "B+",
    overallProgress: 76,
    attendanceRate: 87,
    subjects: {
      mathematics: {
        currentGrade: 74,
        previousGrade: 71,
        trend: 'up',
        assignmentsCompleted: 18,
        totalAssignments: 22,
        lastAssessment: {
          score: 32,
          date: "2025-09-23",
          feedback: "Shows improvement in basic concepts. Needs more practice with word problems."
        }
      },
      science: {
        currentGrade: 79,
        previousGrade: 77,
        trend: 'up',
        assignmentsCompleted: 19,
        totalAssignments: 23,
        lastAssessment: {
          score: 35,
          date: "2025-09-18",
          feedback: "Good understanding of theoretical concepts. Lab work needs attention."
        }
      },
      english: {
        currentGrade: 71,
        previousGrade: 73,
        trend: 'down',
        assignmentsCompleted: 16,
        totalAssignments: 21,
        lastAssessment: {
          score: 28,
          date: "2025-09-20",
          feedback: "Creative ideas but grammar needs improvement. Focus on sentence structure."
        }
      },
      socialScience: {
        currentGrade: 78,
        previousGrade: 76,
        trend: 'up',
        assignmentsCompleted: 17,
        totalAssignments: 21,
        lastAssessment: {
          score: 33,
          date: "2025-09-15",
          feedback: "Shows interest in current affairs. Map work is improving."
        }
      },
      hindi: {
        currentGrade: 76,
        previousGrade: 75,
        trend: 'up',
        assignmentsCompleted: 18,
        totalAssignments: 22,
        lastAssessment: {
          score: 34,
          date: "2025-09-12",
          feedback: "Good comprehension skills. Handwriting and presentation can be better."
        }
      }
    },
    monthlyTrends: [
      { month: "May 2025", overall: 70, mathematics: 68, science: 74, english: 69, socialScience: 72, hindi: 71 },
      { month: "Jun 2025", overall: 72, mathematics: 69, science: 75, english: 70, socialScience: 74, hindi: 72 },
      { month: "Jul 2025", overall: 74, mathematics: 71, science: 76, english: 72, socialScience: 75, hindi: 74 },
      { month: "Aug 2025", overall: 75, mathematics: 72, science: 77, english: 72, socialScience: 76, hindi: 75 },
      { month: "Sep 2025", overall: 76, mathematics: 74, science: 79, english: 71, socialScience: 78, hindi: 76 }
    ],
    strengths: ["Technology Interest", "Creative Thinking", "Collaboration"],
    improvementAreas: ["English Grammar", "Mathematical Concepts", "Study Habits"],
    recentAssignments: [
      { id: 6, title: "Algebra Basics Test", subject: "Mathematics", submittedDate: "2025-09-23", score: 32, maxScore: 45, status: 'completed' },
      { id: 7, title: "Computer Project", subject: "Science", submittedDate: "2025-09-18", score: 35, maxScore: 40, status: 'completed' },
      { id: 8, title: "Story Writing", subject: "English", submittedDate: "", score: 0, maxScore: 30, status: 'pending' }
    ],
    learningGoals: [
      { id: 6, title: "Improve Math Fundamentals", subject: "Mathematics", targetDate: "2025-10-30", progress: 35, status: 'at-risk' },
      { id: 7, title: "Complete Pending Assignments", subject: "English", targetDate: "2025-10-05", progress: 20, status: 'overdue' }
    ],
    parentEngagement: 68
  }
];

// Progress Card Component
const ProgressCard: React.FC<{ 
  student: StudentProgress; 
  onViewDetails: (student: StudentProgress) => void;
}> = ({ student, onViewDetails }) => {
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'B+': return 'bg-blue-100 text-blue-700';
      case 'B': return 'bg-blue-100 text-blue-600';
      case 'C+': return 'bg-yellow-100 text-yellow-700';
      case 'C': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-blue-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-indigo-100 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 ring-2 ring-indigo-200">
            <AvatarImage src={student.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.class} • {student.rollNo}</p>
          </div>
          <div className="text-center">
            <Badge className={`${getGradeColor(student.overallGrade)}`}>
              {student.overallGrade}
            </Badge>
            <div className="text-xs text-gray-600 mt-1">{student.overallProgress}%</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{student.overallProgress}%</span>
          </div>
          <Progress value={student.overallProgress} className="h-2" />
        </div>

        {/* Subject Performance Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(student.subjects).slice(0, 4).map(([subject, data]) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="capitalize text-gray-600">
                {subject === 'socialScience' ? 'Social Sci.' : subject}
              </span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{data.currentGrade}%</span>
                {getTrendIcon(data.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className={`text-lg font-bold ${getAttendanceColor(student.attendanceRate)}`}>
              {student.attendanceRate}%
            </div>
            <div className="text-xs text-gray-600">Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{student.learningGoals.length}</div>
            <div className="text-xs text-gray-600">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{student.parentEngagement}%</div>
            <div className="text-xs text-gray-600">Parent Engage</div>
          </div>
        </div>

        {/* Alerts */}
        {student.learningGoals.some(goal => goal.status === 'at-risk' || goal.status === 'overdue') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                {student.learningGoals.filter(g => g.status === 'at-risk' || g.status === 'overdue').length} goals need attention
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewDetails(student)}
            className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Detailed Progress Modal
const StudentProgressModal: React.FC<{ 
  student: StudentProgress | null; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-indigo-200">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}'s Progress</h2>
              <p className="text-gray-600">{student.class} • Overall Grade: {student.overallGrade}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b px-6">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'subjects', label: 'Subject Performance' },
              { key: 'trends', label: 'Progress Trends' },
              { key: 'goals', label: 'Learning Goals' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-indigo-100">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">Academic Summary</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overall Grade</span>
                      <Badge className={`${student.overallGrade === 'A+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {student.overallGrade}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-indigo-600">{student.overallProgress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance</span>
                      <span className="font-semibold text-green-600">{student.attendanceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parent Engagement</span>
                      <span className="font-semibold text-purple-600">{student.parentEngagement}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-indigo-100 lg:col-span-2">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">Strengths & Areas for Improvement</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.improvementAreas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assignments */}
              <Card className="border-indigo-100">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Recent Assignments</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-600">{assignment.subject}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {assignment.status === 'completed' ? `${assignment.score}/${assignment.maxScore}` : 'Pending'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {assignment.submittedDate ? new Date(assignment.submittedDate).toLocaleDateString() : 'Not submitted'}
                          </div>
                        </div>
                        <Badge 
                          variant={assignment.status === 'completed' ? 'secondary' : assignment.status === 'pending' ? 'outline' : 'destructive'}
                          className="ml-3"
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subject-wise Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(student.subjects).map(([subject, data]) => (
                  <Card key={subject} className="border-indigo-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">
                          {subject === 'socialScience' ? 'Social Science' : subject}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{data.currentGrade}%</span>
                          {data.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                          {data.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                          {data.trend === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Previous Grade</span>
                        <span className="font-medium">{data.previousGrade}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Assignments</span>
                        <span className="font-medium">{data.assignmentsCompleted}/{data.totalAssignments}</span>
                      </div>
                      <Progress value={(data.assignmentsCompleted / data.totalAssignments) * 100} className="h-2" />
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Latest Assessment</div>
                        <div className="text-xs text-gray-600 mb-2">
                          Score: {data.lastAssessment.score}/50 • {new Date(data.lastAssessment.date).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-gray-700">{data.lastAssessment.feedback}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Progress Trends (Last 5 Months)</h3>
              <Card className="border-indigo-100">
                <CardHeader>
                  <h4 className="font-semibold">Monthly Performance Overview</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {student.monthlyTrends.reverse().map((trend, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{trend.month}</h5>
                          <div className="text-lg font-bold text-indigo-600">{trend.overall}%</div>
                        </div>
                        <div className="grid grid-cols-5 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Math: </span>
                            <span className="font-medium">{trend.mathematics}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Science: </span>
                            <span className="font-medium">{trend.science}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">English: </span>
                            <span className="font-medium">{trend.english}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Social: </span>
                            <span className="font-medium">{trend.socialScience}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Hindi: </span>
                            <span className="font-medium">{trend.hindi}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Goals & Targets</h3>
              <div className="space-y-4">
                {student.learningGoals.map((goal) => (
                  <Card key={goal.id} className="border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <p className="text-sm text-gray-600">{goal.subject} • Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>
                        <Badge 
                          variant={
                            goal.status === 'completed' ? 'default' : 
                            goal.status === 'on-track' ? 'secondary' : 
                            goal.status === 'at-risk' ? 'outline' : 'destructive'
                          }
                          className={
                            goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                            goal.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                            goal.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }
                        >
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Progress Page Component
export default function StudentProgressPage() {
  const [progressData] = useState(studentProgressData);
  const [filteredData, setFilteredData] = useState(studentProgressData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Filter students based on search and class
  React.useEffect(() => {
    let filtered = progressData;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
      );
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedClass, progressData]);

  const handleViewDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    setIsProgressOpen(true);
  };

  const avgProgress = Math.round(
    progressData.reduce((acc, student) => acc + student.overallProgress, 0) / progressData.length
  );

  const avgAttendance = Math.round(
    progressData.reduce((acc, student) => acc + student.attendanceRate, 0) / progressData.length
  );

  const studentsAtRisk = progressData.filter(student => 
    student.overallProgress < 75 || 
    student.attendanceRate < 85 ||
    student.learningGoals.some(goal => goal.status === 'at-risk' || goal.status === 'overdue')
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-indigo-500" />
            Student Progress Tracking
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor student academic progress, identify trends, and support individual learning journeys
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-indigo-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{progressData.length}</div>
            <div className="text-sm text-gray-600 mt-1">Students Tracked</div>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{avgProgress}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Progress</div>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{avgAttendance}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Attendance</div>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{studentsAtRisk}</div>
            <div className="text-sm text-gray-600 mt-1">Students At Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-indigo-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-indigo-200 focus:border-indigo-400"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48 border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="8th C">8th C</SelectItem>
                <SelectItem value="9th B">9th B</SelectItem>
                <SelectItem value="10th A">10th A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map(student => (
          <ProgressCard 
            key={student.id} 
            student={student} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or class filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Progress Modal */}
      <StudentProgressModal
        student={selectedStudent}
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
      />
    </div>
  );
}
