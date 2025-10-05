'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/assessments';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Star,
  FileText,
  Edit,
  Award,
  Clock,
  Target
} from 'lucide-react';

interface SummativeQuestionBuilderProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  index: number;
  componentName: string;
}

export default function SummativeQuestionBuilder({ 
  question, 
  onUpdate, 
  onDelete, 
  index, 
  componentName 
}: SummativeQuestionBuilderProps) {
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
      case 'essay': return <FileText className="h-4 w-4" />;
      case 'problem-solving': return <Star className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'true-false': return 'bg-green-100 text-green-700 border-green-200';
      case 'short-answer': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'essay': return 'bg-red-100 text-red-700 border-red-200';
      case 'problem-solving': return 'bg-orange-100 text-orange-700 border-orange-200';
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

  const getDifficultyColor = (points: number) => {
    if (points <= 2) return 'bg-green-100 text-green-700';
    if (points <= 5) return 'bg-yellow-100 text-yellow-700';
    if (points <= 10) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyLabel = (points: number) => {
    if (points <= 2) return 'Easy';
    if (points <= 5) return 'Medium';
    if (points <= 10) return 'Hard';
    return 'Expert';
  };

  return (
    <Card className="border border-emerald-200 hover:border-emerald-300 transition-colors">
      <CardContent className="p-4">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Badge className={`${getQuestionTypeColor(question.type)} flex items-center space-x-1`}>
              {getQuestionTypeIcon(question.type)}
              <span>Q{index + 1}</span>
            </Badge>
            <span className="text-sm text-gray-600">{componentName}</span>
            {!isQuestionComplete() && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                Incomplete
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Select value={question.type} onValueChange={(value) => updateQuestion('type', value)}>
              <SelectTrigger className="w-40 border-emerald-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
                <SelectItem value="essay">Essay Question</SelectItem>
                <SelectItem value="problem-solving">Problem Solving</SelectItem>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Question Content */}
          <div className="lg:col-span-2 space-y-4">
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
                  question.question.trim() ? 'border-emerald-200 focus:border-emerald-400' : 'border-red-200 focus:border-red-400'
                }`}
              />
            </div>

            {/* Multiple Choice Options */}
            {question.type === 'multiple-choice' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Answer Options *</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addOption}
                    disabled={(question.options || []).length >= 6}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optionIndex.toString()}
                          onChange={() => updateQuestion('correctAnswer', optionIndex.toString())}
                          className="w-4 h-4 text-emerald-600"
                        />
                      </div>
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        className="flex-1 border-emerald-200 focus:border-emerald-400"
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
                <label className="block text-sm font-medium mb-3 text-gray-700">Correct Answer *</label>
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

            {/* Essay Question Rubric */}
            {(question.type === 'essay' || question.type === 'problem-solving') && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Grading Rubric (Optional)
                </label>
                <Textarea
                  placeholder="Define grading criteria and expected answer components..."
                  value={question.rubric || ''}
                  onChange={(e) => updateQuestion('rubric', e.target.value)}
                  rows={3}
                  className="border-emerald-200 focus:border-emerald-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will help with consistent grading across all student responses
                </p>
              </div>
            )}

            {/* Short Answer */}
            {question.type === 'short-answer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Short Answer Question</h4>
                    <p className="text-sm text-blue-700">
                      Students will provide brief written responses. Manual grading required.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Essay Question Info */}
            {question.type === 'essay' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Essay Question</h4>
                    <p className="text-sm text-red-700">
                      Extended written response expected. Consider providing a detailed rubric for consistent evaluation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Problem Solving Info */}
            {question.type === 'problem-solving' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-800">Problem Solving Question</h4>
                    <p className="text-sm text-orange-700">
                      Multi-step problem requiring analytical thinking. Students should show their work.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question Settings */}
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Question Settings
              </h4>
              
              {/* Points */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-emerald-700">
                    Points/Marks
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={question.points}
                      onChange={(e) => updateQuestion('points', parseInt(e.target.value) || 1)}
                      className="w-16 border-emerald-200 focus:border-emerald-400 text-center"
                    />
                    <Badge className={getDifficultyColor(question.points)}>
                      {getDifficultyLabel(question.points)}
                    </Badge>
                  </div>
                </div>

                {/* Question Stats */}
                <div className="text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Weight</span>
                    <span className="font-medium text-emerald-800">
                      {question.points} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Type</span>
                    <span className="font-medium text-emerald-800 capitalize">
                      {question.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Status</span>
                    <div className="flex items-center">
                      {isQuestionComplete() ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        isQuestionComplete() ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isQuestionComplete() ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Help */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                <HelpCircle className="h-3 w-3 mr-1" />
                Tips
              </h5>
              <div className="text-xs text-gray-600 space-y-1">
                {question.type === 'multiple-choice' && (
                  <>
                    <p>• Make distractors plausible but clearly incorrect</p>
                    <p>• Avoid "all of the above" or "none of the above"</p>
                    <p>• Keep options similar in length</p>
                  </>
                )}
                {question.type === 'essay' && (
                  <>
                    <p>• Provide clear expectations in rubric</p>
                    <p>• Consider word count guidelines</p>
                    <p>• Include evaluation criteria</p>
                  </>
                )}
                {question.type === 'problem-solving' && (
                  <>
                    <p>• Break complex problems into steps</p>
                    <p>• Award partial credit for methodology</p>
                    <p>• Provide clear problem statement</p>
                  </>
                )}
                {(question.type === 'true-false') && (
                  <>
                    <p>• Avoid absolute terms like "always" or "never"</p>
                    <p>• Make statements clearly true or false</p>
                    <p>• Keep statements concise</p>
                  </>
                )}
                {question.type === 'short-answer' && (
                  <>
                    <p>• Specify expected response length</p>
                    <p>• Be clear about what constitutes correct answer</p>
                    <p>• Consider multiple acceptable answers</p>
                  </>
                )}
              </div>
            </div>

            {/* Question Actions */}
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Preview Question
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Award className="h-4 w-4 mr-2" />
                Question Bank
              </Button>
            </div>
          </div>
        </div>

        {/* Question Completion Status */}
        <div className="mt-4 pt-4 border-t border-emerald-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {isQuestionComplete() ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Question Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="font-medium">Needs Attention</span>
                </div>
              )}
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{question.points} points</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Question {index + 1} of {componentName}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
