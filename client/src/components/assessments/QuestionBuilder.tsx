'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/assessments';
import { 
  Plus, 
  X, 
  GripVertical, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Star,
  BarChart3
} from 'lucide-react';

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  index: number;
}

export default function QuestionBuilder({ question, onUpdate, onDelete, index }: QuestionBuilderProps) {
  const updateQuestion = (field: string, value: any) => {
    onUpdate({ ...question, [field]: value });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ ...question, options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
    onUpdate({ ...question, options: newOptions });
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return <CheckCircle2 className="h-4 w-4" />;
      case 'true-false': return <HelpCircle className="h-4 w-4" />;
      case 'short-answer': return <AlertCircle className="h-4 w-4" />;
      case 'rating': return <Star className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'true-false': return 'bg-green-100 text-green-700 border-green-200';
      case 'short-answer': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'rating': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isQuestionComplete = () => {
    if (!question.question.trim()) return false;
    if (question.type === 'multiple-choice') {
      return (question.options || []).some(opt => opt.trim()) && question.correctAnswer !== undefined;
    }
    if (question.type === 'true-false') {
      return question.correctAnswer !== undefined;
    }
    return true;
  };

  return (
    <Card className={`border-2 transition-all duration-200 ${
      isQuestionComplete() ? 'border-indigo-200 hover:border-indigo-300' : 'border-red-200 hover:border-red-300'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <Badge className={`${getQuestionTypeColor(question.type)} flex items-center space-x-1`}>
                {getQuestionTypeIcon(question.type)}
                <span>Question {index + 1}</span>
              </Badge>
            </div>
            {!isQuestionComplete() && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Incomplete
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Select value={question.type} onValueChange={(value) => updateQuestion('type', value)}>
              <SelectTrigger className="w-44 border-indigo-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Multiple Choice</span>
                  </div>
                </SelectItem>
                <SelectItem value="true-false">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>True/False</span>
                  </div>
                </SelectItem>
                <SelectItem value="short-answer">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Short Answer</span>
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Rating Scale</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50 border-red-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Question Text *
          </label>
          <Textarea
            placeholder="Enter your question here..."
            value={question.question}
            onChange={(e) => updateQuestion('question', e.target.value)}
            rows={3}
            className={`border-2 transition-colors ${
              question.question.trim() ? 'border-indigo-200 focus:border-indigo-400' : 'border-red-200 focus:border-red-400'
            }`}
          />
        </div>

        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options *
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={addOption}
                disabled={(question.options || []).length >= 6}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-3">
              {(question.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === optionIndex.toString()}
                      onChange={() => updateQuestion('correctAnswer', optionIndex.toString())}
                      className="w-4 h-4 text-indigo-600"
                    />
                  </div>
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    className="flex-1 border-indigo-200 focus:border-indigo-400"
                  />
                  {(question.options || []).length > 2 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeOption(optionIndex)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {question.correctAnswer === undefined && (question.options || []).some(opt => opt.trim()) && (
              <p className="text-sm text-red-600 mt-2">Please select the correct answer</p>
            )}
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true-false' && (
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Correct Answer *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateQuestion('correctAnswer', 'true')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  question.correctAnswer === 'true'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">True</span>
              </button>
              <button
                type="button"
                onClick={() => updateQuestion('correctAnswer', 'false')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  question.correctAnswer === 'false'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <X className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">False</span>
              </button>
            </div>
          </div>
        )}

        {/* Short Answer */}
        {question.type === 'short-answer' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Open-ended Question</h4>
                <p className="text-sm text-blue-700">
                  Students will provide written responses. You'll need to review and grade these manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rating Scale */}
        {question.type === 'rating' && (
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Rating Scale Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: '1-5', label: '1 to 5 Scale', desc: 'Traditional 5-point scale' },
                { value: '1-10', label: '1 to 10 Scale', desc: 'Extended 10-point scale' },
                { value: 'emoji', label: 'Emoji Scale', desc: '😞 😐 😊 emotional scale' }
              ].map((scale) => (
                <button
                  key={scale.value}
                  type="button"
                  onClick={() => updateQuestion('correctAnswer', scale.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    question.correctAnswer === scale.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{scale.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{scale.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Points */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Points
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={question.points}
                onChange={(e) => updateQuestion('points', parseInt(e.target.value) || 1)}
                className="w-20 border-indigo-200 focus:border-indigo-400"
              />
            </div>
          </div>
          
          {/* Question Status */}
          <div className="flex items-center space-x-2">
            {isQuestionComplete() ? (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Needs attention
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
