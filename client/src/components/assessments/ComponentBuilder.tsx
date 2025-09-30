'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import SummativeQuestionBuilder from './SummativeQuestionBuilder';
import { AssessmentComponent, Question } from '@/types/assessments';
import { 
  Plus, 
  X, 
  GripVertical, 
  FileText,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';

interface ComponentBuilderProps {
  component: AssessmentComponent;
  onUpdate: (component: AssessmentComponent) => void;
  onDelete: () => void;
  index: number;
  totalMarks: number;
}

export default function ComponentBuilder({ 
  component, 
  onUpdate, 
  onDelete, 
  index, 
  totalMarks 
}: ComponentBuilderProps) {
  const updateComponent = (field: string, value: any) => {
    onUpdate({ ...component, [field]: value });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      points: 5
    };
    onUpdate({ 
      ...component, 
      questions: [...component.questions, newQuestion] 
    });
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    onUpdate({
      ...component,
      questions: component.questions.map(q => q.id === questionId ? updatedQuestion : q)
    });
  };

  const deleteQuestion = (questionId: string) => {
    onUpdate({
      ...component,
      questions: component.questions.filter(q => q.id !== questionId)
    });
  };

  const getComponentTypeColor = (type: string) => {
    switch (type) {
      case 'written-work': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'performance-task': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'quarterly-assessment': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalQuestionMarks = component.questions.reduce((sum, q) => sum + q.points, 0);
  const isMarksBalanced = totalQuestionMarks === component.maxMarks;

  return (
    <Card className={`border-2 transition-all duration-200 ${
      isMarksBalanced ? 'border-emerald-200 hover:border-emerald-300' : 'border-orange-200 hover:border-orange-300'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <Badge className={`${getComponentTypeColor(component.type)} flex items-center space-x-1`}>
              <FileText className="h-3 w-3" />
              <span>Component {index + 1}</span>
            </Badge>
            {!isMarksBalanced && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Marks Mismatch
              </Badge>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onDelete}
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Component Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Component Name
            </label>
            <Input
              placeholder="e.g., Written Work"
              value={component.name}
              onChange={(e) => updateComponent('name', e.target.value)}
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Type
            </label>
            <Select value={component.type} onValueChange={(value) => updateComponent('type', value)}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="written-work">Written Work</SelectItem>
                <SelectItem value="performance-task">Performance Task</SelectItem>
                <SelectItem value="quarterly-assessment">Quarterly Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Weightage (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={component.weightage}
              onChange={(e) => updateComponent('weightage', parseInt(e.target.value) || 0)}
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Max Marks
            </label>
            <Input
              type="number"
              min="1"
              max={totalMarks}
              value={component.maxMarks}
              onChange={(e) => updateComponent('maxMarks', parseInt(e.target.value) || 0)}
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Marks Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-700">{component.questions.length}</div>
            <div className="text-xs text-emerald-600">Questions</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${isMarksBalanced ? 'text-emerald-700' : 'text-orange-600'}`}>
              {totalQuestionMarks}/{component.maxMarks}
            </div>
            <div className="text-xs text-emerald-600">Question Marks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-700">{component.weightage}%</div>
            <div className="text-xs text-emerald-600">Weightage</div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Questions</h4>
            <Button 
              size="sm" 
              onClick={addQuestion}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>

          {component.questions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-emerald-200 rounded-lg">
              <Lightbulb className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">No questions in this component yet</p>
              <Button size="sm" onClick={addQuestion} variant="outline" className="border-emerald-200 text-emerald-700">
                <Plus className="h-4 w-4 mr-1" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {component.questions.map((question, questionIndex) => (
                <SummativeQuestionBuilder
                  key={question.id}
                  question={question}
                  onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                  onDelete={() => deleteQuestion(question.id)}
                  index={questionIndex}
                  componentName={component.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Marks Warning */}
        {!isMarksBalanced && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Target className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-orange-800">Marks Allocation Issue</h5>
                <p className="text-xs text-orange-700 mt-1">
                  Question marks ({totalQuestionMarks}) don't match component max marks ({component.maxMarks}). 
                  Please adjust question points or component max marks.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
