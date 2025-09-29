'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  PlayCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  BookOpen,
  FileText,
  Award,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentQuestionDto,
  AssignmentStatus,
  SubmitAssignmentDto
} from '@/types/api';

interface OnlineAssignmentViewProps {
  assignment: AssignmentDto;
  onSubmissionComplete: () => void;
}

interface Answer {
  questionNumber: number;
  selectedOption?: string;
  textAnswer?: string;
}

export default function OnlineAssignmentView({ 
  assignment, 
  onSubmissionComplete 
}: OnlineAssignmentViewProps) {
  const { user } = useAuth();

  // Assignment state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [assignmentStarted, setAssignmentStarted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Initialize answers array
  useEffect(() => {
    if (assignment.questions) {
      const initialAnswers = assignment.questions.map(q => ({
        questionNumber: q.questionNumber,
        selectedOption: undefined,
        textAnswer: undefined
      }));
      setAnswers(initialAnswers);
    }
  }, [assignment.questions]);

  const handleStartAssignment = () => {
    setAssignmentStarted(true);
  };

  const handleAnswerChange = (questionNumber: number, selectedOption?: string, textAnswer?: string) => {
    setAnswers(prev => prev.map(answer => 
      answer.questionNumber === questionNumber 
        ? { ...answer, selectedOption, textAnswer }
        : answer
    ));
  };

  const getCurrentAnswer = (questionNumber: number) => {
    return answers.find(a => a.questionNumber === questionNumber);
  };

  const getAnsweredCount = () => {
    return answers.filter(a => a.selectedOption || a.textAnswer).length;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitAssignment = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      // Prepare submission text with answers
      const submissionText = answers
        .filter(a => a.selectedOption || a.textAnswer)
        .map(a => {
          const question = assignment.questions.find(q => q.questionNumber === a.questionNumber);
          return `Question ${a.questionNumber}: ${question?.question}\nAnswer: ${a.selectedOption || a.textAnswer}`;
        })
        .join('\n\n');

      const submitData: SubmitAssignmentDto = {
        assignmentId: assignment.id,
        submissionText
      };

      const response = await apiClient.submitAssignment(submitData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      onSubmissionComplete();
      alert('Assignment submitted successfully!');

    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if assignment is already submitted
  if (assignment.status === AssignmentStatus.SUBMITTED || assignment.status === AssignmentStatus.GRADED) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Completed</h2>
          <p className="text-gray-600 mb-4">
            You have already submitted this assignment.
          </p>
          {assignment.score !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {assignment.score}/{assignment.totalMarks}
                </p>
                <p className="text-sm text-green-600">
                  {((assignment.score / assignment.totalMarks) * 100).toFixed(1)}%
                </p>
                {assignment.grade && (
                  <p className="text-lg font-medium text-green-700 mt-1">
                    Grade: {assignment.grade}
                  </p>
                )}
              </div>
              {assignment.feedback && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Teacher Feedback</h4>
                  <p className="text-sm text-green-700">{assignment.feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Pre-start screen
  if (!assignmentStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlayCircle className="h-6 w-6 text-blue-600" />
            <span>Ready to Start Assignment?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Assignment Details</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Total Questions: {assignment.questions.length}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Total Marks: {assignment.totalMarks}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Estimated Time: {assignment.timeEstimate}</span>
              </li>
              <li className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>You can navigate between questions and review your answers</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleStartAssignment}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = assignment.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion.questionNumber);
  const progressPercentage = ((currentQuestionIndex + 1) / assignment.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {assignment.questions.length}
                </span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  {getAnsweredCount()}/{assignment.questions.length} Answered
                </span>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
          <div className="mt-3">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Question {currentQuestion.questionNumber}</Badge>
              <Badge className="bg-purple-100 text-purple-800">{currentQuestion.marks} marks</Badge>
              {currentQuestion.type && (
                <Badge variant="outline">{currentQuestion.type}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>

            {/* Multiple Choice Question */}
            {currentQuestion.options && currentQuestion.options.length > 0 && (
              <RadioGroup
                value={currentAnswer?.selectedOption || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.questionNumber, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      <span className="inline-block w-6 h-6 text-center text-xs font-bold bg-gray-200 rounded-full mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Text Answer Question */}
            {(!currentQuestion.options || currentQuestion.options.length === 0) && (
              <div className="space-y-2">
                <Label htmlFor="text-answer" className="text-sm font-medium text-gray-700">
                  Your Answer:
                </Label>
                <Textarea
                  id="text-answer"
                  placeholder="Type your answer here..."
                  value={currentAnswer?.textAnswer || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.questionNumber, undefined, e.target.value)}
                  rows={6}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Navigation and Submit */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              {/* Submit Button - Show on last question or when all answered */}
              {(currentQuestionIndex === assignment.questions.length - 1 || getAnsweredCount() === assignment.questions.length) && (
                <Button 
                  onClick={handleSubmitAssignment}
                  disabled={submitting || getAnsweredCount() === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              )}

              {/* Next Button */}
              {currentQuestionIndex < assignment.questions.length - 1 && (
                <Button onClick={handleNextQuestion}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {assignment.questions.map((question, index) => {
              const isCurrentQuestion = index === currentQuestionIndex;
              const isAnswered = answers.find(a => a.questionNumber === question.questionNumber)?.selectedOption || 
                               answers.find(a => a.questionNumber === question.questionNumber)?.textAnswer;
              
              return (
                <Button
                  key={question.questionNumber}
                  variant={isCurrentQuestion ? "default" : "outline"}
                  size="sm"
                  className={`
                    ${isCurrentQuestion ? 'bg-blue-600 text-white' : ''}
                    ${isAnswered && !isCurrentQuestion ? 'bg-green-100 text-green-800 border-green-300' : ''}
                    ${!isAnswered && !isCurrentQuestion ? 'text-gray-600' : ''}
                  `}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {question.questionNumber}
                  {isAnswered && !isCurrentQuestion && (
                    <CheckCircle className="ml-1 h-3 w-3" />
                  )}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-4 h-4 border border-gray-300 rounded"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Current</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
