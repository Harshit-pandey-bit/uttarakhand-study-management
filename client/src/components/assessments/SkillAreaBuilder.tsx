'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DiagnosticSkillArea, Question } from '@/types/assessments';
import { 
  Plus, 
  X, 
  GripVertical, 
  Brain,
  Target,
  Book,
  Lightbulb
} from 'lucide-react';

interface SkillAreaBuilderProps {
  skillArea: DiagnosticSkillArea;
  onUpdate: (skillArea: DiagnosticSkillArea) => void;
  onDelete: () => void;
  index: number;
}

export default function SkillAreaBuilder({ skillArea, onUpdate, onDelete, index }: SkillAreaBuilderProps) {
  const updateSkillArea = (field: string, value: any) => {
    onUpdate({ ...skillArea, [field]: value });
  };

  const addPrerequisite = () => {
    onUpdate({ 
      ...skillArea, 
      prerequisites: [...skillArea.prerequisites, ''] 
    });
  };

  const updatePrerequisite = (prereqIndex: number, value: string) => {
    const newPrerequisites = [...skillArea.prerequisites];
    newPrerequisites[prereqIndex] = value;
    onUpdate({ 
      ...skillArea, 
      prerequisites: newPrerequisites 
    });
  };

  const removePrerequisite = (prereqIndex: number) => {
    onUpdate({ 
      ...skillArea, 
      prerequisites: skillArea.prerequisites.filter((_, i) => i !== prereqIndex) 
    });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      points: 1
    };
    onUpdate({ 
      ...skillArea, 
      questions: [...skillArea.questions, newQuestion] 
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="border-teal-200 hover:border-teal-300 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <Badge className="bg-teal-100 text-teal-700 border-teal-200 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>Skill Area {index + 1}</span>
            </Badge>
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
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Skill Area Name *
            </label>
            <Input
              placeholder="e.g., Linear Equations"
              value={skillArea.name}
              onChange={(e) => updateSkillArea('name', e.target.value)}
              className="border-teal-200 focus:border-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Difficulty Level
            </label>
            <Select 
              value={skillArea.difficultyLevel} 
              onValueChange={(value) => updateSkillArea('difficultyLevel', value)}
            >
              <SelectTrigger className="border-teal-200 focus:border-teal-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Description
          </label>
          <Textarea
            placeholder="Describe what this skill area covers and why it's important..."
            value={skillArea.description}
            onChange={(e) => updateSkillArea('description', e.target.value)}
            rows={3}
            className="border-teal-200 focus:border-teal-400"
          />
        </div>

        {/* Prerequisites */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Prerequisites
            </label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addPrerequisite}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {skillArea.prerequisites.map((prereq, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Enter prerequisite skill..."
                  value={prereq}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 border-teal-200 focus:border-teal-400"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removePrerequisite(index)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Area Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700">{skillArea.questions.length}</div>
            <div className="text-xs text-teal-600">Questions</div>
          </div>
          <div className="text-center">
            <Badge className={getDifficultyColor(skillArea.difficultyLevel)}>
              {skillArea.difficultyLevel}
            </Badge>
            <div className="text-xs text-teal-600 mt-1">Difficulty</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700">{skillArea.prerequisites.length}</div>
            <div className="text-xs text-teal-600">Prerequisites</div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Target className="h-4 w-4 mr-2 text-teal-500" />
              Diagnostic Questions
            </h4>
            <Button 
              size="sm" 
              onClick={addQuestion}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>

          {skillArea.questions.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-teal-200 rounded-lg">
              <Lightbulb className="h-8 w-8 text-teal-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">No diagnostic questions added yet</p>
              <Button size="sm" onClick={addQuestion} variant="outline" className="border-teal-200 text-teal-700">
                <Plus className="h-4 w-4 mr-1" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {skillArea.questions.map((question, questionIndex) => (
                <div key={question.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Q{questionIndex + 1}
                      </Badge>
                      <span className="text-sm text-gray-600 capitalize">
                        {question.type.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.points} pts
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Edit
                    </Button>
                  </div>
                  {question.question && (
                    <p className="text-sm text-gray-700 mt-2 truncate">
                      {question.question}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Book className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-800">Diagnostic Tips</h5>
              <p className="text-xs text-blue-700 mt-1">
                Focus on identifying specific knowledge gaps rather than general ability. 
                Include prerequisite skills to understand learning progression.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
