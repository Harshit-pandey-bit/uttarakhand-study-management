'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SkillAreaBuilder from './SkillAreaBuilder';
import { DiagnosticForm, DiagnosticSkillArea } from '@/types/assessments';
import {
  Settings,
  Brain,
  Target,
  Plus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

interface CreateDiagnosticFormProps {
  onSave: (formData: DiagnosticForm) => void;
  onCancel: () => void;
}

export default function CreateDiagnosticForm({ onSave, onCancel }: CreateDiagnosticFormProps) {
  const [currentTab, setCurrentTab] = useState('setup');
  const [formData, setFormData] = useState<DiagnosticForm>({
    title: '',
    subject: '',
    class: '',
    type: 'pre-assessment',
    duration: 30,
    description: '',
    objectives: [],
    skillAreas: [],
    adaptiveLogic: false,
    immediateResults: true,
    remediationEnabled: true
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addSkillArea = () => {
    const newSkillArea: DiagnosticSkillArea = {
      id: Date.now().toString(),
      name: '',
      description: '',
      questions: [],
      averagePerformance: 0,
      difficultyLevel: 'basic',
      prerequisites: []
    };
    setFormData(prev => ({
      ...prev,
      skillAreas: [...prev.skillAreas, newSkillArea]
    }));
  };

  const updateSkillArea = (skillAreaId: string, updatedSkillArea: DiagnosticSkillArea) => {
    setFormData(prev => ({
      ...prev,
      skillAreas: prev.skillAreas.map(area => 
        area.id === skillAreaId ? updatedSkillArea : area
      )
    }));
  };

  const deleteSkillArea = (skillAreaId: string) => {
    setFormData(prev => ({
      ...prev,
      skillAreas: prev.skillAreas.filter(area => area.id !== skillAreaId)
    }));
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.title || !formData.subject || !formData.class) {
      alert('Please fill in all required fields.');
      setCurrentTab('setup');
      return;
    }

    if (formData.skillAreas.length === 0) {
      alert('Please add at least one skill area.');
      setCurrentTab('skills');
      return;
    }

    onSave(formData);
  };

  const totalQuestions = formData.skillAreas.reduce((sum, area) => sum + area.questions.length, 0);

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="bg-white border border-teal-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Creation Progress</span>
          <span className="text-sm text-gray-500">
            {currentTab === 'setup' ? 'Step 1 of 3' : 
             currentTab === 'skills' ? 'Step 2 of 3' : 'Step 3 of 3'}
          </span>
        </div>
        <div className="flex space-x-1">
          <div className={`h-2 flex-1 rounded ${currentTab === 'setup' ? 'bg-teal-500' : 'bg-teal-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'skills' ? 'bg-teal-500' : currentTab === 'review' ? 'bg-teal-200' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded ${currentTab === 'review' ? 'bg-teal-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3 bg-teal-50 border border-teal-200">
          <TabsTrigger 
            value="setup" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            Skill Areas ({formData.skillAreas.length})
          </TabsTrigger>
          <TabsTrigger 
            value="review" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <Target className="h-4 w-4 mr-2" />
            Review
          </TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card className="border-teal-100">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-teal-500" />
                Diagnostic Assessment Setup
              </h3>
              <p className="text-sm text-gray-600">Configure the basic details of your diagnostic assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Assessment Title *
                  </label>
                  <Input
                    placeholder="e.g., Math Foundation Check"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    className="border-teal-200 focus:border-teal-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Subject *
                  </label>
                  <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Science">Social Science</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class and Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Class *
                  </label>
                  <Select value={formData.class} onValueChange={(value) => updateFormData('class', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6th">Class 6</SelectItem>
                      <SelectItem value="7th">Class 7</SelectItem>
                      <SelectItem value="8th">Class 8</SelectItem>
                      <SelectItem value="9th">Class 9</SelectItem>
                      <SelectItem value="10th">Class 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Diagnostic Type
                  </label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-assessment">Pre-Assessment</SelectItem>
                      <SelectItem value="skill-gap">Skill Gap Analysis</SelectItem>
                      <SelectItem value="learning-difficulty">Learning Difficulty</SelectItem>
                      <SelectItem value="readiness-check">Readiness Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="120"
                    value={formData.duration}
                    onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 30)}
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the purpose and scope of this diagnostic assessment..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Learning Objectives
                  </label>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={addObjective}
                    className="border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Objective
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter learning objective..."
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        className="flex-1 border-teal-200 focus:border-teal-400"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => setCurrentTab('skills')}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Next: Define Skill Areas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Skill Areas</h3>
              <p className="text-sm text-gray-600">
                Define the skill areas to assess • Total: {totalQuestions} questions
              </p>
            </div>
            <Button 
              onClick={addSkillArea} 
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill Area
            </Button>
          </div>

          {formData.skillAreas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-16 w-16 text-teal-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No skill areas yet</h3>
                <p className="text-gray-600 mb-6">
                  Start building your diagnostic by adding skill areas to assess.
                </p>
                <Button onClick={addSkillArea} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Skill Area
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {formData.skillAreas.map((skillArea, index) => (
                <SkillAreaBuilder
                  key={skillArea.id}
                  skillArea={skillArea}
                  onUpdate={(updatedSkillArea) => updateSkillArea(skillArea.id, updatedSkillArea)}
                  onDelete={() => deleteSkillArea(skillArea.id)}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTab('setup')}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
            <Button 
              onClick={() => setCurrentTab('review')}
              disabled={formData.skillAreas.length === 0}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300"
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
            <Card className="border-teal-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-teal-500" />
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
                    <span className="text-gray-600">Skill Areas:</span>
                    <p className="font-medium text-gray-900">{formData.skillAreas.length} areas</p>
                  </div>
                </div>

                {formData.objectives.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm">Objectives:</span>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                      {formData.objectives.slice(0, 3).map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                      {formData.objectives.length > 3 && (
                        <li className="text-gray-500">...and {formData.objectives.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-teal-100">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-teal-500" />
                  Assessment Settings
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Adaptive Logic</span>
                      <p className="text-xs text-gray-600">Adjust difficulty based on responses</p>
                    </div>
                    <Button
                      size="sm"
                      variant={formData.adaptiveLogic ? "default" : "outline"}
                      onClick={() => updateFormData('adaptiveLogic', !formData.adaptiveLogic)}
                    >
                      {formData.adaptiveLogic ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Immediate Results</span>
                      <p className="text-xs text-gray-600">Show results right after completion</p>
                    </div>
                    <Button
                      size="sm"
                      variant={formData.immediateResults ? "default" : "outline"}
                      onClick={() => updateFormData('immediateResults', !formData.immediateResults)}
                    >
                      {formData.immediateResults ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Remediation Enabled</span>
                      <p className="text-xs text-gray-600">Provide learning resources for gaps</p>
                    </div>
                    <Button
                      size="sm"
                      variant={formData.remediationEnabled ? "default" : "outline"}
                      onClick={() => updateFormData('remediationEnabled', !formData.remediationEnabled)}
                    >
                      {formData.remediationEnabled ? 'Enabled' : 'Disabled'}
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
              onClick={() => setCurrentTab('skills')}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Skill Areas
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleSave}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Create Diagnostic
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
