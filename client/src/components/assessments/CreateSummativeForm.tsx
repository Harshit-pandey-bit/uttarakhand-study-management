'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummativeQuestionBuilder from './SummativeQuestionBuilder';
import ComponentBuilder from './ComponentBuilder';
import { SummativeAssessmentForm, AssessmentComponent } from '@/types/assessments';
import {
  Settings,
  FileText,
  Target,
  Plus,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info,
  Award,
  Calendar
} from 'lucide-react';

interface CreateSummativeFormProps {
  onSave: (formData: SummativeAssessmentForm) => void;
  onCancel: () => void;
}

export default function CreateSummativeForm({ onSave, onCancel }: CreateSummativeFormProps) {
  const [currentTab, setCurrentTab] = useState('setup');
  const [formData, setFormData] = useState<SummativeAssessmentForm>({
    title: '',
    subject: '',
    class: '',
    type: 'mid-term',
    totalMarks: 100,
    duration: 180, // 3 hours
    instructions: '',
    description: '',
    dueDate: '',
    passingMarks: 40,
    weightage: 30,
    allowLateSubmission: false,
    requireProctoring: false,
    components: [
      {
        id: '1',
        name: 'Written Work',
        type: 'written-work',
        weightage: 40,
        maxMarks: 40,
        questions: []
      },
      {
        id: '2',
        name: 'Performance Task',
        type: 'performance-task',
        weightage: 35,
        maxMarks: 35,
        questions: []
      },
      {
        id: '3',
        name: 'Quarterly Assessment',
        type: 'quarterly-assessment',
        weightage: 25,
        maxMarks: 25,
        questions: []
      }
    ]
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateComponent = (componentId: string, updatedComponent: AssessmentComponent) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === componentId ? updatedComponent : comp
      )
    }));
  };

  const addComponent = () => {
    const newComponent: AssessmentComponent = {
      id: Date.now().toString(),
      name: 'New Component',
      type: 'written-work',
      weightage: 0,
      maxMarks: 0,
      questions: []
    };
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  const deleteComponent = (componentId: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId)
    }));
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.title || !formData.subject || !formData.class) {
      alert('Please fill in all required fields.');
      setCurrentTab('setup');
      return;
    }

    if (formData.components.length === 0) {
      alert('Please add at least one component.');
      setCurrentTab('components');
      return;
    }

    const totalWeightage = formData.components.reduce((sum, comp) => sum + comp.weightage, 0);
    if (Math.abs(totalWeightage - 100) > 0.1) {
      alert('Component weightages must total 100%.');
      setCurrentTab('components');
      return;
    }

    onSave(formData);
  };

  const totalWeightage = formData.components.reduce((sum, comp) => sum + comp.weightage, 0);
  const totalComponentMarks = formData.components.reduce((sum, comp) => sum + comp.maxMarks, 0);

  // Get default due date (1 month from now)
  const defaultDueDate = new Date();
  defaultDueDate.setMonth(defaultDueDate.getMonth() + 1);
  const defaultDueDateString = defaultDueDate.toISOString().slice(0, 16);

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="bg-white border border-emerald-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Creation Progress</span>
          <span className="text-sm text-gray-500">
            {currentTab === 'setup' ? 'Step 1 of 3' : 
             currentTab === 'components' ? 'Step 2 of 3' : 'Step 3 of 3'}
          </span>
        </div>
        <div className="flex space-x-1">
          <div className={`h-2 flex-1 rounded ${currentTab === 'setup' ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'components' ? 'bg-emerald-500' : currentTab === 'review' ? 'bg-emerald-200' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'review' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 bg-emerald-50 border border-emerald-200">
          <TabsTrigger 
            value="setup" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger 
            value="components" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Components ({formData.components.length})
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            <Target className="h-4 w-4 mr-2" />
            Review
          </TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card className="border-emerald-100">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-emerald-500" />
                Assessment Information
              </h3>
              <p className="text-sm text-gray-600">Configure the basic details of your summative assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Assessment Title *
                  </label>
                  <Input
                    placeholder="e.g., Mathematics Mid-Term Exam"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Subject *
                  </label>
                  <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
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

              {/* Class and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Class *
                  </label>
                  <Select value={formData.class} onValueChange={(value) => updateFormData('class', value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
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
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mid-term">Mid-term Exam</SelectItem>
                      <SelectItem value="final-exam">Final Exam</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="research-paper">Research Paper</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Marks, Duration, Passing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Total Marks
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.totalMarks}
                    onChange={(e) => updateFormData('totalMarks', parseInt(e.target.value) || 100)}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="720"
                    value={formData.duration}
                    onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 180)}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for untimed assessments</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Passing Marks
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={formData.totalMarks}
                    value={formData.passingMarks}
                    onChange={(e) => updateFormData('passingMarks', parseInt(e.target.value) || 40)}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Weightage and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Grade Weightage (%)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.weightage}
                    onChange={(e) => updateFormData('weightage', parseInt(e.target.value) || 30)}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of total course grade</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Due Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.dueDate || defaultDueDateString}
                    onChange={(e) => updateFormData('dueDate', e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the scope and objectives of this assessment..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Instructions for Students
                </label>
                <Textarea
                  placeholder="Detailed instructions for students taking this assessment..."
                  value={formData.instructions}
                  onChange={(e) => updateFormData('instructions', e.target.value)}
                  rows={4}
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setCurrentTab('components')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Next: Build Components
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Assessment Components</h3>
              <p className="text-sm text-gray-600">
                Build the different parts of your assessment • Total: {totalWeightage}% • {totalComponentMarks} marks
              </p>
            </div>
            <Button 
              onClick={addComponent} 
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Component
            </Button>
          </div>

          {/* Weightage Warning */}
          {Math.abs(totalWeightage - 100) > 0.1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Weightage Mismatch</h4>
                <p className="text-sm text-yellow-700">
                  Component weightages total {totalWeightage}%. They should total 100%.
                </p>
              </div>
            </div>
          )}

          {formData.components.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No components yet</h3>
                <p className="text-gray-600 mb-6">
                  Start building your summative assessment by adding components.
                </p>
                <Button onClick={addComponent} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Component
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {formData.components.map((component, index) => (
                <ComponentBuilder
                  key={component.id}
                  component={component}
                  onUpdate={(updatedComponent) => updateComponent(component.id, updatedComponent)}
                  onDelete={() => deleteComponent(component.id)}
                  index={index}
                  totalMarks={formData.totalMarks}
                />
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTab('setup')}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
            <Button 
              onClick={() => setCurrentTab('review')}
              disabled={formData.components.length === 0 || Math.abs(totalWeightage - 100) > 0.1}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300"
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
            <Card className="border-emerald-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-emerald-500" />
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
                    <span className="text-gray-600">Total Marks:</span>
                    <p className="font-medium text-gray-900">{formData.totalMarks} marks</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium text-gray-900">
                      {formData.duration === 0 ? 'Untimed' : `${Math.round(formData.duration / 60)}h ${formData.duration % 60}m`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Passing Marks:</span>
                    <p className="font-medium text-gray-900">{formData.passingMarks} ({Math.round((formData.passingMarks / formData.totalMarks) * 100)}%)</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade Weightage:</span>
                    <p className="font-medium text-gray-900">{formData.weightage}%</p>
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

            {/* Components Summary */}
            <Card className="border-emerald-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-emerald-500" />
                  Components Overview
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.components.map((component, index) => (
                  <div key={component.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-emerald-900">{component.name}</h4>
                      <span className="text-sm font-medium text-emerald-700">{component.weightage}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-emerald-700">
                      <span className="capitalize">{component.type.replace('-', ' ')}</span>
                      <span>{component.maxMarks} marks • {component.questions.length} questions</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-emerald-100 lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
                  Assessment Settings
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Allow Late Submission</span>
                        <p className="text-xs text-gray-600">Accept submissions after due date</p>
                      </div>
                      <Button
                        size="sm"
                        variant={formData.allowLateSubmission ? "default" : "outline"}
                        onClick={() => updateFormData('allowLateSubmission', !formData.allowLateSubmission)}
                      >
                        {formData.allowLateSubmission ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Require Proctoring</span>
                        <p className="text-xs text-gray-600">Supervised examination mode</p>
                      </div>
                      <Button
                        size="sm"
                        variant={formData.requireProctoring ? "default" : "outline"}
                        onClick={() => updateFormData('requireProctoring', !formData.requireProctoring)}
                      >
                        {formData.requireProctoring ? 'Required' : 'Optional'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="text-sm font-medium text-emerald-800 mb-1">Due Date</div>
                      <div className="text-sm text-emerald-700">
                        {formData.dueDate ? new Date(formData.dueDate).toLocaleString() : 'Not set'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Note:</strong> Students will be notified about this assessment and its requirements via the system.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTab('components')}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Components
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
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
