'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Presentation, Plus, Search, Filter, Calendar, Clock, 
  Users, BookOpen, CheckCircle2, AlertCircle, Edit,
  Eye, Trash2, Download, BarChart3, TrendingUp,
  FileText, Target, Lightbulb, Activity, X
} from 'lucide-react';

// Assessment data with comprehensive dummy data
const assessmentsData = {
  formative: [
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
    }
  ],
  summative: [
    {
      id: 4,
      title: "Mathematics Unit Test - Algebra",
      subject: "Mathematics", 
      class: "10th A",
      type: "Unit Test",
      duration: 90,
      totalMarks: 80,
      questions: 25,
      createdDate: "2025-09-15",
      dueDate: "2025-10-05",
      status: "scheduled",
      studentsCompleted: 0,
      totalStudents: 25,
      averageScore: null,
      purpose: "Comprehensive evaluation of algebra concepts"
    },
    {
      id: 5,
      title: "English Mid-Term Examination",
      subject: "English",
      class: "9th B", 
      type: "Mid-Term",
      duration: 180,
      totalMarks: 100,
      questions: 35,
      createdDate: "2025-09-10",
      dueDate: "2025-10-15",
      status: "draft",
      studentsCompleted: 0,
      totalStudents: 22,
      averageScore: null,
      purpose: "Evaluate reading, writing, and comprehension skills"
    },
    {
      id: 6,
      title: "Science Final Term - Physics and Chemistry",
      subject: "Science",
      class: "11th A",
      type: "Final Exam",
      duration: 200,
      totalMarks: 120,
      questions: 40,
      createdDate: "2025-09-12",
      dueDate: "2025-11-15",
      status: "scheduled",
      studentsCompleted: 0,
      totalStudents: 28,
      averageScore: null,
      purpose: "Comprehensive evaluation of physics and chemistry concepts"
    }
  ],
  diagnostic: [
    {
      id: 7,
      title: "Learning Gaps Assessment - Basic Math",
      subject: "Mathematics",
      class: "8th C",
      type: "Diagnostic",
      duration: 60,
      totalMarks: 50,
      questions: 20,
      createdDate: "2025-09-18",
      dueDate: "2025-09-25",
      status: "completed",
      studentsCompleted: 20,
      totalStudents: 20,
      averageScore: 32.5,
      purpose: "Identify learning gaps in foundational math concepts"
    },
    {
      id: 8,
      title: "Reading Comprehension Skills Check",
      subject: "English",
      class: "7th A",
      type: "Diagnostic",
      duration: 45,
      totalMarks: 40,
      questions: 15,
      createdDate: "2025-09-22",
      dueDate: "2025-09-29",
      status: "active",
      studentsCompleted: 12,
      totalStudents: 18,
      averageScore: 28.3,
      purpose: "Assess reading comprehension level and identify support needs"
    },
    {
      id: 9,
      title: "Science Concepts Foundation Check",
      subject: "Science",
      class: "9th A",
      type: "Pre-Test",
      duration: 40,
      totalMarks: 35,
      questions: 18,
      createdDate: "2025-09-26",
      dueDate: "2025-10-03",
      status: "active",
      studentsCompleted: 16,
      totalStudents: 24,
      averageScore: 24.7,
      purpose: "Evaluate understanding of basic science concepts before advanced topics"
    }
  ]
};

const AssessmentCard: React.FC<{ assessment: any; onEdit: (assessment: any) => void }> = ({ 
  assessment, 
  onEdit 
}) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
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
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(assessment)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            View Results
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateAssessmentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  assessmentType: string;
}> = ({ isOpen, onClose, assessmentType }) => {
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

  if (!isOpen) return null;

  const getTypeOptions = (type: string) => {
    switch (type) {
      case 'formative':
        return ['Quiz', 'Practical', 'Assignment', 'Class Activity', 'Observation'];
      case 'summative':
        return ['Unit Test', 'Mid-Term', 'Final Exam', 'Project Assessment'];
      case 'diagnostic':
        return ['Diagnostic', 'Pre-Test', 'Skill Check', 'Learning Gap Assessment'];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            Create {assessmentType} Assessment
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
                Assessment Title
              </label>
              <Input
                placeholder="Enter assessment title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="social-science">Social Science</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6th">Class 6</SelectItem>
                  <SelectItem value="7th">Class 7</SelectItem>
                  <SelectItem value="8th">Class 8</SelectItem>
                  <SelectItem value="9th">Class 9</SelectItem>
                  <SelectItem value="10th">Class 10</SelectItem>
                  <SelectItem value="11th">Class 11</SelectItem>
                  <SelectItem value="12th">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Type
              </label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {getTypeOptions(assessmentType).map(option => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <Input
                type="number"
                placeholder="Duration in minutes"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks
              </label>
              <Input
                type="number"
                placeholder="Total marks"
                value={formData.totalMarks}
                onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <Input
                type="number"
                placeholder="Number of questions"
                value={formData.questions}
                onChange={(e) => setFormData({...formData, questions: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose/Objective
              </label>
              <Textarea
                placeholder="Describe the purpose and learning objectives of this assessment"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button className="flex-1">
              Create Assessment
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

export default function AssessmentsPage() {
  const [assessments] = useState(assessmentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createAssessmentType, setCreateAssessmentType] = useState('');

  const handleCreateAssessment = (type: string) => {
    setCreateAssessmentType(type);
    setIsCreateModalOpen(true);
  };

  const handleEditAssessment = (assessment: any) => {
    console.log('Editing assessment:', assessment);
  };

  const filterAssessments = (assessmentList: any[]) => {
    return assessmentList.filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || assessment.subject.toLowerCase() === selectedSubject;
      const matchesClass = selectedClass === 'all' || assessment.class === selectedClass;
      
      return matchesSearch && matchesSubject && matchesClass;
    });
  };

  const totalAssessments = assessments.formative.length + assessments.summative.length + assessments.diagnostic.length;
  const activeAssessments = [...assessments.formative, ...assessments.summative, ...assessments.diagnostic]
    .filter(a => a.status === 'active').length;
  const completedAssessments = [...assessments.formative, ...assessments.summative, ...assessments.diagnostic]
    .filter(a => a.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Presentation className="h-8 w-8 mr-3 text-blue-500" />
            Assessment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and analyze formative, summative, and diagnostic assessments
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
              {Math.round((activeAssessments / totalAssessments) * 100)}%
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
                <SelectItem value="social-science">Social Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="7th A">7th A</SelectItem>
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

      {/* Assessment Tabs */}
      <Tabs defaultValue="formative" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="formative">
            <Lightbulb className="h-4 w-4 mr-2" />
            Formative ({assessments.formative.length})
          </TabsTrigger>
          <TabsTrigger value="summative">
            <Target className="h-4 w-4 mr-2" />
            Summative ({assessments.summative.length})
          </TabsTrigger>
          <TabsTrigger value="diagnostic">
            <Activity className="h-4 w-4 mr-2" />
            Diagnostic ({assessments.diagnostic.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formative" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Formative Assessments</h3>
              <p className="text-sm text-gray-600">Ongoing assessments to monitor student learning</p>
            </div>
            <Button onClick={() => handleCreateAssessment('formative')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Formative Assessment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterAssessments(assessments.formative).map(assessment => (
              <AssessmentCard 
                key={assessment.id} 
                assessment={assessment} 
                onEdit={handleEditAssessment}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summative" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Summative Assessments</h3>
              <p className="text-sm text-gray-600">Comprehensive assessments to evaluate student achievement</p>
            </div>
            <Button onClick={() => handleCreateAssessment('summative')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Summative Assessment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterAssessments(assessments.summative).map(assessment => (
              <AssessmentCard 
                key={assessment.id} 
                assessment={assessment} 
                onEdit={handleEditAssessment}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diagnostic" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Diagnostic Assessments</h3>
              <p className="text-sm text-gray-600">Assessments to identify learning gaps and support needs</p>
            </div>
            <Button onClick={() => handleCreateAssessment('diagnostic')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Diagnostic Assessment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterAssessments(assessments.diagnostic).map(assessment => (
              <AssessmentCard 
                key={assessment.id} 
                assessment={assessment} 
                onEdit={handleEditAssessment}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Assessment Modal */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        assessmentType={createAssessmentType}
      />
    </div>
  );
}
