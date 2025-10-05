'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionBuilder from './QuestionBuilder';
import { FormativeAssessmentForm, Question } from '@/types/assessments';
import {
  Settings,
  FileText,
  Target,
  Plus,
  Save,
  Eye,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info
} from 'lucide-react';

interface CreateFormativeFormProps {
  onSave: (formData: FormativeAssessmentForm) => void;
  onCancel: () => void;
}

export default function CreateFormativeForm({ onSave, onCancel }: CreateFormativeFormProps) {
  const [currentTab, setCurrentTab] = useState('setup');
  const [formData, setFormData] = useState<FormativeAssessmentForm>({
    title: '',
    subject: '',
    class: '',
    type: 'quiz',
    duration: 15,
    instructions: '',
    description: '',
    dueDate: '',
    allowMultipleAttempts: false,
    showResultsImmediately: true,
    questions: []
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      points: 1
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === questionId ? updatedQuestion : q)
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.title || !formData.subject || !formData.class) {
      alert('Please fill in all required fields.');
      setCurrentTab('setup');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question.');
      setCurrentTab('questions');
      return;
    }

    onSave(formData);
  };

  const totalPoints = formData.questions.reduce((sum, q) => sum + q.points, 0);
  const hasIncompleteQuestions = formData.questions.some(q => !q.question.trim());

  // Get default due date (tomorrow)
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 1);
  const defaultDueDateString = defaultDueDate.toISOString().slice(0, 16);

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="bg-white border border-indigo-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Creation Progress</span>
          <span className="text-sm text-gray-500">
            {currentTab === 'setup' ? 'Step 1 of 3' : 
             currentTab === 'questions' ? 'Step 2 of 3' : 'Step 3 of 3'}
          </span>
        </div>
        <div className="flex space-x-1">
          <div className={`h-2 flex-1 rounded ${currentTab === 'setup' ? 'bg-indigo-500' : 'bg-indigo-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'questions' ? 'bg-indigo-500' : currentTab === 'review' ? 'bg-indigo-200' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'review' ? 'bg-indigo-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 bg-indigo-50 border border-indigo-200">
          <TabsTrigger 
            value="setup" 
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger 
            value="questions" 
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Questions ({formData.questions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            <Target className="h-4 w-4 mr-2" />
            Review
          </TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card className="border-indigo-100">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-indigo-500" />
                Basic Information
              </h3>
              <p className="text-sm text-gray-600">Set up the fundamental details of your assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Assessment Title *
                  </label>
                  <Input
                    placeholder="e.g., Daily Math Check-in"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="border-indigo-200 focus:border-indigo-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Subject *
                  </label>
                  <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Science">Social Science</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Physical Education">Physical Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class, Type, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Class *
                  </label>
                  <Select value={formData.class} onValueChange={(value) => updateFormData('class', value)}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                      <SelectValue placeholder="Select class" />
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Assessment Type
                  </label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quick Quiz</SelectItem>
                      <SelectItem value="exit-ticket">Exit Ticket</SelectItem>
                      <SelectItem value="poll">Opinion Poll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.duration}
                    onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 15)}
                    className="border-indigo-200 focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Brief description of what this assessment covers..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Instructions for Students
                </label>
                <Textarea
                  placeholder="Instructions that students will see before starting..."
                  value={formData.instructions}
                  onChange={(e) => updateFormData('instructions', e.target.value)}
                  rows={3}
                  className="border-indigo-200 focus:border-indigo-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These instructions will be displayed to students before they begin the assessment
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setCurrentTab('questions')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next: Add Questions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Build Your Questions</h3>
              <p className="text-sm text-gray-600">
                Total: {formData.questions.length} questions • {totalPoints} points
              </p>
            </div>
            <Button 
              onClick={addQuestion} 
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>

          {/* Validation Alert */}
          {hasIncompleteQuestions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Incomplete Questions</h4>
                <p className="text-sm text-yellow-700">
                  Some questions are missing text or options. Please complete all questions before proceeding.
                </p>
              </div>
            </div>
          )}

          {formData.questions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-6">
                  Start building your formative assessment by adding questions.
                </p>
                <Button onClick={addQuestion} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                  onDelete={() => deleteQuestion(question.id)}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTab('setup')}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
            <Button 
              onClick={() => setCurrentTab('review')}
              disabled={formData.questions.length === 0 || hasIncompleteQuestions}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300"
            >
              Next: Review
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assessment Summary */}
            <Card className="border-indigo-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-indigo-500" />
                  Assessment Summary
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <p className="font-medium text-gray-900">{formData.title || 'Untitled Assessment'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Subject:</span>
                    <p className="font-medium text-gray-900">{formData.subject || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Class:</span>
                    <p className="font-medium text-gray-900">{formData.class || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium text-gray-900 capitalize">{formData.type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium text-gray-900">{formData.duration} minutes</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Questions:</span>
                    <p className="font-medium text-gray-900">{formData.questions.length} questions ({totalPoints} points)</p>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <span className="text-gray-600 text-sm">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{formData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-indigo-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-indigo-500" />
                  Assessment Settings
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Due Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.dueDate || defaultDueDateString}
                    onChange={(e) => updateFormData('dueDate', e.target.value)}
                    className="border-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Allow Multiple Attempts</span>
                      <p className="text-xs text-gray-600">Students can retake the assessment</p>
                    </div>
                    <Button
                      size="sm"
                      variant={formData.allowMultipleAttempts ? "default" : "outline"}
                      onClick={() => updateFormData('allowMultipleAttempts', !formData.allowMultipleAttempts)}
                    >
                      {formData.allowMultipleAttempts ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Show Results Immediately</span>
                      <p className="text-xs text-gray-600">Display scores right after submission</p>
                    </div>
                    <Button
                      size="sm"
                      variant={formData.showResultsImmediately ? "default" : "outline"}
                      onClick={() => updateFormData('showResultsImmediately', !formData.showResultsImmediately)}
                    >
                      {formData.showResultsImmediately ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTab('questions')}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSave}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Create Assessment
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
