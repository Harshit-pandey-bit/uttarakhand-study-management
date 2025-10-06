// src/app/dashboard/hei-mentor/assignments/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  CheckSquare,
  Clock,
  BookOpen,
  Eye,
  Info
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { CreateAssignmentRequest } from '@/types/hei-mentor';

// Simplified question types
interface ObjectiveQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  marks: number;
}

interface SubjectiveQuestion {
  id: string;
  question: string;
  marks: number;
  expected_answer?: string;
}

interface FormData {
  title: string;
  description: string;
  subject: string;
  class_level: string;
  due_date: string;
  total_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ncert_chapter: string;
  time_estimate: number;
  submission_format: string[];
  teacher_notes: string;
  questions: {
    objective: ObjectiveQuestion[];
    subjective: SubjectiveQuestion[];
  };
}

const SUBJECTS = [
  'Computer Science',
  'Mathematics', 
  'Physics',
  'Chemistry',
  'Biology',
  'Career Guidance',
  'English',
  'Hindi'
] as const;

const SUBMISSION_FORMATS = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'docx', label: 'Word Document' },
  { value: 'txt', label: 'Text File' },
  { value: 'zip', label: 'ZIP Archive' },
  { value: 'github_link', label: 'GitHub Link' },
  { value: 'ppt', label: 'PowerPoint' },
  { value: 'video', label: 'Video File' },
  { value: 'image', label: 'Image File' }
] as const;

type QuestionType = 'objective' | 'subjective';

interface QuestionTab {
  key: QuestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<QuestionType>('objective');
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subject: '',
    class_level: '',
    due_date: '',
    total_marks: 0,
    difficulty: 'medium',
    ncert_chapter: '',
    time_estimate: 60,
    submission_format: ['pdf'],
    teacher_notes: '',
    questions: {
      objective: [],
      subjective: []
    }
  });

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmissionFormatChange = (format: string, checked: boolean): void => {
    setFormData(prev => ({
      ...prev,
      submission_format: checked
        ? [...prev.submission_format, format]
        : prev.submission_format.filter(f => f !== format)
    }));
  };

  // Objective Question Functions
  const addObjectiveQuestion = (): void => {
    const newQuestion: ObjectiveQuestion = {
      id: `obj_${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      marks: 1
    };
    
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        objective: [...prev.questions.objective, newQuestion]
      }
    }));
  };

  const updateObjectiveQuestion = <K extends keyof ObjectiveQuestion>(
    index: number, 
    field: K, 
    value: ObjectiveQuestion[K]
  ): void => {
    setFormData(prev => {
      const updatedObjective = [...prev.questions.objective];
      updatedObjective[index] = { ...updatedObjective[index], [field]: value };
      return {
        ...prev,
        questions: { ...prev.questions, objective: updatedObjective }
      };
    });
  };

  const updateObjectiveOption = (questionIndex: number, optionIndex: number, value: string): void => {
    setFormData(prev => {
      const updatedObjective = [...prev.questions.objective];
      const updatedOptions = [...updatedObjective[questionIndex].options];
      updatedOptions[optionIndex] = value;
      updatedObjective[questionIndex] = { ...updatedObjective[questionIndex], options: updatedOptions };
      return {
        ...prev,
        questions: { ...prev.questions, objective: updatedObjective }
      };
    });
  };

  const removeObjectiveQuestion = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        objective: prev.questions.objective.filter((_, i) => i !== index)
      }
    }));
  };

  // Subjective Question Functions
  const addSubjectiveQuestion = (): void => {
    const newQuestion: SubjectiveQuestion = {
      id: `subj_${Date.now()}`,
      question: '',
      marks: 5,
      expected_answer: ''
    };
    
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        subjective: [...prev.questions.subjective, newQuestion]
      }
    }));
  };

  const updateSubjectiveQuestion = <K extends keyof SubjectiveQuestion>(
    index: number, 
    field: K, 
    value: SubjectiveQuestion[K]
  ): void => {
    setFormData(prev => {
      const updatedSubjective = [...prev.questions.subjective];
      updatedSubjective[index] = { ...updatedSubjective[index], [field]: value };
      return {
        ...prev,
        questions: { ...prev.questions, subjective: updatedSubjective }
      };
    });
  };

  const removeSubjectiveQuestion = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        subjective: prev.questions.subjective.filter((_, i) => i !== index)
      }
    }));
  };

  const calculateTotalMarks = (): number => {
    const { objective, subjective } = formData.questions;
    return (
      objective.reduce((sum, q) => sum + q.marks, 0) +
      subjective.reduce((sum, q) => sum + q.marks, 0)
    );
  };

  const handleSubmit = async (isDraft: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      
      const totalMarks = calculateTotalMarks();
      
      const assignmentData: CreateAssignmentRequest & { is_active: boolean } = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        class_level: formData.class_level,
        due_date: formData.due_date,
        total_marks: totalMarks,
        difficulty: formData.difficulty,
        ncert_chapter: formData.ncert_chapter,
        time_estimate: formData.time_estimate,
        submission_format: formData.submission_format,
        questions: formData.questions,
        teacher_notes: formData.teacher_notes,
        is_active: !isDraft
      };

      // In real implementation, this would call the API
      console.log('Creating assignment:', assignmentData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard/hei-mentor/assignments');
    } catch (error) {
      console.error('Failed to create assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (value: string): void => {
    if (value === 'easy' || value === 'medium' || value === 'hard') {
      handleInputChange('difficulty', value);
    }
  };

  const questionTabs: QuestionTab[] = [
    { key: 'objective', label: 'Objective (MCQ)', icon: CheckSquare, count: formData.questions.objective.length },
    { key: 'subjective', label: 'Subjective', icon: FileText, count: formData.questions.subjective.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/hei-mentor/assignments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
          <p className="text-gray-600">Build comprehensive assignments with objective and subjective questions</p>
        </div>
      </div>

      {/* Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter assignment title"
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what students will learn and accomplish"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value: string) => handleInputChange('subject', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class_level">Class Level *</Label>
                  <Select value={formData.class_level} onValueChange={(value: string) => handleInputChange('class_level', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={handleDifficultyChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="time_estimate">Time Estimate (minutes)</Label>
                  <Input
                    id="time_estimate"
                    type="number"
                    value={formData.time_estimate}
                    onChange={(e) => handleInputChange('time_estimate', parseInt(e.target.value) || 0)}
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="ncert_chapter">NCERT Chapter (Optional)</Label>
                  <Input
                    id="ncert_chapter"
                    value={formData.ncert_chapter}
                    onChange={(e) => handleInputChange('ncert_chapter', e.target.value)}
                    placeholder="e.g., Chapter 5: Data Structures"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Submission Format *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {SUBMISSION_FORMATS.map(format => (
                      <div key={format.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={format.value}
                          checked={formData.submission_format.includes(format.value)}
                          onCheckedChange={(checked: boolean) => 
                            handleSubmissionFormatChange(format.value, checked)
                          }
                        />
                        <Label htmlFor={format.value} className="text-sm">{format.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="teacher_notes">Teacher Notes (Optional)</Label>
                  <Textarea
                    id="teacher_notes"
                    value={formData.teacher_notes}
                    onChange={(e) => handleInputChange('teacher_notes', e.target.value)}
                    placeholder="Add notes for grading or additional instructions"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <div className="flex flex-wrap gap-2">
                {questionTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.key}
                      variant={activeTab === tab.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab(tab.key)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {tab.count > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {tab.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent>
              {/* Objective Questions */}
              {activeTab === 'objective' && (
                <div className="space-y-4">
                  {formData.questions.objective.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjectiveQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateObjectiveQuestion(index, 'question', e.target.value)}
                          placeholder="Enter your question"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct_${index}`}
                              checked={question.correct_answer === optionIndex}
                              onChange={() => updateObjectiveQuestion(index, 'correct_answer', optionIndex)}
                              className="text-blue-600"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateObjectiveOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="w-24">
                        <Label>Marks *</Label>
                        <Input
                          type="number"
                          value={question.marks}
                          onChange={(e) => updateObjectiveQuestion(index, 'marks', parseInt(e.target.value) || 0)}
                          min="1"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addObjectiveQuestion} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective Question
                  </Button>
                </div>
              )}

              {/* Subjective Questions */}
              {activeTab === 'subjective' && (
                <div className="space-y-4">
                  {formData.questions.subjective.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubjectiveQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateSubjectiveQuestion(index, 'question', e.target.value)}
                          placeholder="Enter your subjective question"
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Expected Answer (Optional)</Label>
                        <Textarea
                          value={question.expected_answer || ''}
                          onChange={(e) => updateSubjectiveQuestion(index, 'expected_answer', e.target.value)}
                          placeholder="Provide a sample/expected answer for reference"
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      <div className="w-24">
                        <Label>Marks *</Label>
                        <Input
                          type="number"
                          value={question.marks}
                          onChange={(e) => updateSubjectiveQuestion(index, 'marks', parseInt(e.target.value) || 0)}
                          min="1"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addSubjectiveQuestion} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subjective Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Questions:</span>
                <span className="font-medium">
                  {Object.values(formData.questions).reduce((sum, questions) => sum + questions.length, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Marks:</span>
                <span className="font-bold text-lg text-blue-600">{calculateTotalMarks()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Time:</span>
                <span className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formData.time_estimate}min
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">Question Breakdown:</div>
                {questionTabs.map(tab => (
                  <div key={tab.key} className="flex justify-between text-sm">
                    <span>{tab.label}:</span>
                    <span>{tab.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading || !formData.title || !formData.subject}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Publish Assignment'}
              </Button>
              
              <Button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Save as Draft
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {/* Preview functionality */}}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Assignment
              </Button>

              <div className="pt-2 border-t">
                <div className="flex items-start space-x-2 text-sm text-amber-600">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Tips for better assignments:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Use clear, specific questions</li>
                      <li>• Provide adequate time estimates</li>
                      <li>• Include NCERT chapter references</li>
                      <li>• Mix objective and subjective questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
