// assesment/page.tsx - Formative Only
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Presentation, Plus, Search, Calendar, Clock, 
  CheckCircle2, AlertCircle, Edit,
  Eye, Trash2, BarChart3, TrendingUp,
  FileText, Target, Lightbulb, Activity, X,
  PieChart, TrendingDown, AlertTriangle
} from 'lucide-react';

// Types
interface Assessment {
  id: number;
  title: string;
  subject: string;
  class: string;
  type: string;
  duration: number;
  totalMarks: number;
  questions: number;
  createdDate: string;
  dueDate: string;
  status: 'active' | 'completed' | 'scheduled' | 'draft';
  studentsCompleted: number;
  totalStudents: number;
  averageScore: number | null;
  purpose: string;
}

interface StudentResult {
  studentId: number;
  studentName: string;
  score: number;
  percentage: number;
  timeSpent: number;
  submissionTime: string;
  answers: any[];
}

// Formative Assessment data only - Extended with more examples
const initialFormativeAssessments: Assessment[] = [
  {
    id: 1,
    title: "Daily Math Quiz - Quadratic Equations",
    subject: "Mathematics",
    class: "10th A",
    type: "Quiz",
    duration: 15,
    totalMarks: 20,
    questions: 10,
    createdDate: "2025-09-25",
    dueDate: "2025-10-02",
    status: "active",
    studentsCompleted: 18,
    totalStudents: 25,
    averageScore: 16.2,
    purpose: "Check understanding of quadratic formula application"
  },
  {
    id: 2,
    title: "Science Lab Observation - Chemical Reactions",
    subject: "Science",
    class: "9th B",
    type: "Practical",
    duration: 45,
    totalMarks: 30,
    questions: 5,
    createdDate: "2025-09-20",
    dueDate: "2025-09-28",
    status: "completed",
    studentsCompleted: 22,
    totalStudents: 22,
    averageScore: 24.5,
    purpose: "Assess practical skills and observation abilities"
  },
  {
    id: 3,
    title: "English Reading Comprehension - Daily Practice",
    subject: "English",
    class: "9th A",
    type: "Assignment",
    duration: 30,
    totalMarks: 25,
    questions: 8,
    createdDate: "2025-09-28",
    dueDate: "2025-10-05",
    status: "active",
    studentsCompleted: 14,
    totalStudents: 24,
    averageScore: 19.8,
    purpose: "Improve reading comprehension and vocabulary"
  },
  {
    id: 4,
    title: "Weekly Math Problem Solving",
    subject: "Mathematics",
    class: "8th A",
    type: "Class Activity",
    duration: 25,
    totalMarks: 15,
    questions: 6,
    createdDate: "2025-09-30",
    dueDate: "2025-10-07",
    status: "draft",
    studentsCompleted: 0,
    totalStudents: 20,
    averageScore: null,
    purpose: "Develop problem-solving strategies and mathematical reasoning"
  },
  {
    id: 5,
    title: "Science Concept Quick Check",
    subject: "Science",
    class: "7th B",
    type: "Observation",
    duration: 20,
    totalMarks: 12,
    questions: 8,
    createdDate: "2025-09-26",
    dueDate: "2025-10-03",
    status: "scheduled",
    studentsCompleted: 0,
    totalStudents: 18,
    averageScore: null,
    purpose: "Quick assessment of understanding before moving to next topic"
  }
];

// Mock student results data - Extended
const mockStudentResults: { [key: number]: StudentResult[] } = {
  1: [
    { studentId: 1, studentName: "Aarav Sharma", score: 18, percentage: 90, timeSpent: 12, submissionTime: "2025-09-27 10:30", answers: [] },
    { studentId: 2, studentName: "Diya Patel", score: 16, percentage: 80, timeSpent: 14, submissionTime: "2025-09-27 11:15", answers: [] },
    { studentId: 3, studentName: "Arjun Singh", score: 15, percentage: 75, timeSpent: 13, submissionTime: "2025-09-27 09:45", answers: [] },
    { studentId: 4, studentName: "Priya Kumar", score: 17, percentage: 85, timeSpent: 11, submissionTime: "2025-09-27 14:20", answers: [] },
    { studentId: 5, studentName: "Rohit Gupta", score: 14, percentage: 70, timeSpent: 15, submissionTime: "2025-09-27 16:10", answers: [] },
  ],
  2: [
    { studentId: 6, studentName: "Ananya Reddy", score: 27, percentage: 90, timeSpent: 42, submissionTime: "2025-09-25 14:30", answers: [] },
    { studentId: 7, studentName: "Vikash Yadav", score: 25, percentage: 83, timeSpent: 44, submissionTime: "2025-09-25 15:15", answers: [] },
    { studentId: 8, studentName: "Kavya Mehta", score: 22, percentage: 73, timeSpent: 43, submissionTime: "2025-09-25 16:45", answers: [] },
  ],
  3: [
    { studentId: 9, studentName: "Rahul Singh", score: 22, percentage: 88, timeSpent: 28, submissionTime: "2025-09-30 09:15", answers: [] },
    { studentId: 10, studentName: "Sneha Patel", score: 20, percentage: 80, timeSpent: 30, submissionTime: "2025-09-30 10:45", answers: [] },
    { studentId: 11, studentName: "Kiran Kumar", score: 18, percentage: 72, timeSpent: 29, submissionTime: "2025-09-30 11:30", answers: [] },
  ]
};

// Results Modal Component
const ResultsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  assessment: Assessment;
}> = ({ isOpen, onClose, assessment }) => {
  const results = mockStudentResults[assessment.id] || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Results</h2>
            <p className="text-gray-600">{assessment.title}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.length}</div>
                    <div className="text-sm text-gray-600">Students Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Time (mins)</div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Score</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Percentage</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Time Spent</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Submission Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.studentId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{result.studentName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {result.score}/{assessment.totalMarks}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge className={result.percentage >= 80 ? 'bg-green-100 text-green-800' : 
                                          result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}>
                            {result.percentage}%
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{result.timeSpent} mins</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {new Date(result.submissionTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No results available yet. Students haven't completed this assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Modal Component
const AnalyticsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  assessment: Assessment;
}> = ({ isOpen, onClose, assessment }) => {
  const results = mockStudentResults[assessment.id] || [];

  if (!isOpen) return null;

  const getGradeDistribution = () => {
    if (results.length === 0) return { A: 0, B: 0, C: 0, D: 0, F: 0 };

    return results.reduce((acc, result) => {
      if (result.percentage >= 90) acc.A++;
      else if (result.percentage >= 80) acc.B++;
      else if (result.percentage >= 70) acc.C++;
      else if (result.percentage >= 60) acc.D++;
      else acc.F++;
      return acc;
    }, { A: 0, B: 0, C: 0, D: 0, F: 0 });
  };

  const gradeDistribution = getGradeDistribution();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assessment Analytics</h2>
            <p className="text-gray-600">{assessment.title}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {results.length > 0 ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length * 10) / 10}
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{Math.max(...results.map(r => r.score))}</div>
                    <div className="text-sm text-gray-600">Highest Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{Math.min(...results.map(r => r.score))}</div>
                    <div className="text-sm text-gray-600">Lowest Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Time (mins)</div>
                  </CardContent>
                </Card>
              </div>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Grade Distribution
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="text-center">
                        <div className="text-3xl font-bold text-gray-800">{count}</div>
                        <div className="text-sm text-gray-600">Grade {grade}</div>
                        <div className="text-xs text-gray-500">
                          {results.length > 0 ? Math.round((count / results.length) * 100) : 0}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Performance Insights
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Class Performance</h4>
                      <p className="text-sm text-blue-700">
                        The class average of {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}% 
                        {results.reduce((acc, r) => acc + r.percentage, 0) / results.length >= 75 
                          ? " indicates good understanding of the concepts." 
                          : " suggests some concepts may need reinforcement."}
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Time Management</h4>
                      <p className="text-sm text-yellow-700">
                        Students took an average of {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length)} minutes
                        {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length) < assessment.duration * 0.8
                          ? " - faster completion might indicate easier content."
                          : " - good utilization of allocated time."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No analytics available yet. Complete assessments will show detailed insights here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssessmentCard: React.FC<{ 
  assessment: Assessment; 
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: number) => void;
  onViewResults: (assessment: Assessment) => void;
  onViewAnalytics: (assessment: Assessment) => void;
}> = ({ 
  assessment, 
  onEdit, 
  onDelete, 
  onViewResults, 
  onViewAnalytics 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-orange-100 text-orange-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const completionPercentage = Math.round((assessment.studentsCompleted / assessment.totalStudents) * 100);

  const handleDeleteClick = () => {
    onDelete(assessment.id);
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    onEdit(assessment);
  };

  const handleViewResultsClick = () => {
    onViewResults(assessment);
  };

  const handleViewAnalyticsClick = () => {
    onViewAnalytics(assessment);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 relative">
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4 text-gray-800">Are you sure you want to delete this assessment?</p>
            <div className="flex space-x-2">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{assessment.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{assessment.subject}</span>
              <span>•</span>
              <span>{assessment.class}</span>
              <span>•</span>
              <span>{assessment.type}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{assessment.purpose}</p>
          </div>
          <Badge className={`${getStatusColor(assessment.status)} flex items-center space-x-1`}>
            {getStatusIcon(assessment.status)}
            <span className="capitalize">{assessment.status}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assessment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{assessment.duration} minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-400" />
            <span>{assessment.totalMarks} marks</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span>{assessment.questions} questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Student Completion</span>
            <span className="font-medium">
              {assessment.studentsCompleted}/{assessment.totalStudents} ({completionPercentage}%)
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Average Score */}
        {assessment.averageScore && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">Average Score</span>
              <span className="text-lg font-bold text-blue-800">
                {assessment.averageScore}/{assessment.totalMarks}
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {Math.round((assessment.averageScore / assessment.totalMarks) * 100)}% class average
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={handleViewResultsClick}>
            <Eye className="h-4 w-4 mr-1" />
            View Results
          </Button>
          <Button size="sm" variant="outline" onClick={handleViewAnalyticsClick}>
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateAssessmentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (assessmentData: Assessment) => void;
  editingAssessment?: Assessment | null;
}> = ({ isOpen, onClose, onSave, editingAssessment }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    type: '',
    duration: '',
    totalMarks: '',
    questions: '',
    dueDate: '',
    purpose: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  React.useEffect(() => {
    if (editingAssessment) {
      setFormData({
        title: editingAssessment.title,
        subject: editingAssessment.subject,
        class: editingAssessment.class,
        type: editingAssessment.type,
        duration: editingAssessment.duration.toString(),
        totalMarks: editingAssessment.totalMarks.toString(),
        questions: editingAssessment.questions.toString(),
        dueDate: editingAssessment.dueDate,
        purpose: editingAssessment.purpose
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        class: '',
        type: '',
        duration: '',
        totalMarks: '',
        questions: '',
        dueDate: '',
        purpose: ''
      });
    }
    setErrors({});
  }, [editingAssessment, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.totalMarks || parseInt(formData.totalMarks) <= 0) newErrors.totalMarks = 'Valid total marks is required';
    if (!formData.questions || parseInt(formData.questions) <= 0) newErrors.questions = 'Valid number of questions is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const assessmentData: Assessment = {
      id: editingAssessment?.id || Date.now(),
      title: formData.title,
      subject: formData.subject,
      class: formData.class,
      type: formData.type,
      duration: parseInt(formData.duration),
      totalMarks: parseInt(formData.totalMarks),
      questions: parseInt(formData.questions),
      createdDate: editingAssessment?.createdDate || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      status: editingAssessment?.status || 'draft',
      studentsCompleted: editingAssessment?.studentsCompleted || 0,
      totalStudents: editingAssessment?.totalStudents || 25,
      averageScore: editingAssessment?.averageScore || null,
      purpose: formData.purpose
    };

    onSave(assessmentData);
    onClose();
  };

  const formativeTypeOptions = ['Quiz', 'Practical', 'Assignment', 'Class Activity', 'Observation'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingAssessment ? 'Edit' : 'Create'} Formative Assessment
          </h2>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Title *
              </label>
              <Input
                placeholder="Enter assessment title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Social Science">Social Science</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger className={errors.class ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6th A">Class 6th A</SelectItem>
                  <SelectItem value="7th A">Class 7th A</SelectItem>
                  <SelectItem value="7th B">Class 7th B</SelectItem>
                  <SelectItem value="8th A">Class 8th A</SelectItem>
                  <SelectItem value="8th C">Class 8th C</SelectItem>
                  <SelectItem value="9th A">Class 9th A</SelectItem>
                  <SelectItem value="9th B">Class 9th B</SelectItem>
                  <SelectItem value="10th A">Class 10th A</SelectItem>
                  <SelectItem value="11th A">Class 11th A</SelectItem>
                  <SelectItem value="12th A">Class 12th A</SelectItem>
                </SelectContent>
              </Select>
              {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Type *
              </label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {formativeTypeOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <Input
                type="number"
                placeholder="Duration in minutes"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks *
              </label>
              <Input
                type="number"
                placeholder="Total marks"
                value={formData.totalMarks}
                onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                className={errors.totalMarks ? 'border-red-500' : ''}
              />
              {errors.totalMarks && <p className="text-red-500 text-xs mt-1">{errors.totalMarks}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions *
              </label>
              <Input
                type="number"
                placeholder="Number of questions"
                value={formData.questions}
                onChange={(e) => setFormData({...formData, questions: e.target.value})}
                className={errors.questions ? 'border-red-500' : ''}
              />
              {errors.questions && <p className="text-red-500 text-xs mt-1">{errors.questions}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose/Objective *
              </label>
              <Textarea
                placeholder="Describe the purpose and learning objectives of this assessment"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                rows={3}
                className={errors.purpose ? 'border-red-500' : ''}
              />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button className="flex-1" onClick={handleSave}>
              {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FormativeAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(initialFormativeAssessments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const handleCreateAssessment = () => {
    setEditingAssessment(null);
    setIsCreateModalOpen(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsCreateModalOpen(true);
  };

  const handleDeleteAssessment = (id: number) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  const handleViewResults = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setResultsModalOpen(true);
  };

  const handleViewAnalytics = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setAnalyticsModalOpen(true);
  };

  const handleSaveAssessment = (assessmentData: Assessment) => {
    if (editingAssessment) {
      // Update existing assessment
      setAssessments(prev => prev.map(a => a.id === assessmentData.id ? assessmentData : a));
    } else {
      // Create new assessment
      setAssessments(prev => [...prev, assessmentData]);
    }
  };

  const filterAssessments = (assessmentList: Assessment[]) => {
    return assessmentList.filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || assessment.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesClass = selectedClass === 'all' || assessment.class === selectedClass;

      return matchesSearch && matchesSubject && matchesClass;
    });
  };

  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === 'active').length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="h-8 w-8 mr-3 text-blue-500" />
            Formative Assessment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and analyze formative assessments for ongoing student learning
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{totalAssessments}</div>
            <div className="text-sm text-gray-600 mt-1">Total Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{activeAssessments}</div>
            <div className="text-sm text-gray-600 mt-1">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{completedAssessments}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalAssessments > 0 ? Math.round((activeAssessments / totalAssessments) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assessments by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="social science">Social Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="7th A">7th A</SelectItem>
                <SelectItem value="7th B">7th B</SelectItem>
                <SelectItem value="8th A">8th A</SelectItem>
                <SelectItem value="8th C">8th C</SelectItem>
                <SelectItem value="9th A">9th A</SelectItem>
                <SelectItem value="9th B">9th B</SelectItem>
                <SelectItem value="10th A">10th A</SelectItem>
                <SelectItem value="11th A">11th A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formative Assessments Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Formative Assessments</h3>
            <p className="text-sm text-gray-600">Ongoing assessments to monitor student learning progress</p>
          </div>
          <Button onClick={handleCreateAssessment}>
            <Plus className="h-4 w-4 mr-2" />
            Create Formative Assessment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filterAssessments(assessments).map(assessment => (
            <AssessmentCard 
              key={assessment.id} 
              assessment={assessment} 
              onEdit={handleEditAssessment}
              onDelete={handleDeleteAssessment}
              onViewResults={handleViewResults}
              onViewAnalytics={handleViewAnalytics}
            />
          ))}
        </div>

        {filterAssessments(assessments).length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSubject !== 'all' || selectedClass !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first formative assessment.'}
            </p>
            {!searchTerm && selectedSubject === 'all' && selectedClass === 'all' && (
              <Button onClick={handleCreateAssessment}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assessment
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Assessment Modal */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAssessment(null);
        }}
        onSave={handleSaveAssessment}
        editingAssessment={editingAssessment}
      />

      {/* Results Modal */}
      {selectedAssessment && (
        <ResultsModal
          isOpen={resultsModalOpen}
          onClose={() => {
            setResultsModalOpen(false);
            setSelectedAssessment(null);
          }}
          assessment={selectedAssessment}
        />
      )}

      {/* Analytics Modal */}
      {selectedAssessment && (
        <AnalyticsModal
          isOpen={analyticsModalOpen}
          onClose={() => {
            setAnalyticsModalOpen(false);
            setSelectedAssessment(null);
          }}
          assessment={selectedAssessment}
        />
      )}
    </div>
  );
}