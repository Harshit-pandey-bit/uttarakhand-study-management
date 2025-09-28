'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Brain, 
  Users, 
  Hammer, 
  Lightbulb, 
  Heart, 
  Briefcase, 
  RotateCcw,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { 
  HollandQuestion, 
  HollandResults, 
  CategoryName,
  HollandSubmission,
  HollandQuestionsResponse, 
  HollandSubmissionResponse
} from '@/types/api';

const categoryInfo: Record<CategoryName, { icon: any; color: string; description: string }> = {
  'Realistic': { 
    icon: Hammer, 
    color: 'bg-orange-500', 
    description: 'Hands-on, practical, love building and creating' 
  },
  'Investigative': { 
    icon: Brain, 
    color: 'bg-purple-500', 
    description: 'Analytical, curious, love solving problems' 
  },
  'Artistic': { 
    icon: Lightbulb, 
    color: 'bg-pink-500', 
    description: 'Creative, expressive, love art and innovation' 
  },
  'Social': { 
    icon: Heart, 
    color: 'bg-red-500', 
    description: 'Caring, helpful, love working with people' 
  },
  'Enterprising': { 
    icon: Users, 
    color: 'bg-blue-500', 
    description: 'Leadership, business-minded, love leading teams' 
  },
  'Conventional': { 
    icon: Briefcase, 
    color: 'bg-green-500', 
    description: 'Organized, detail-oriented, love structured work' 
  }
};

export default function HollandAssessmentTest() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Assessment state
  const [questions, setQuestions] = useState<HollandQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<HollandResults | null>(null);
  const [completionDate, setCompletionDate] = useState<string | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing results first
  useEffect(() => {
    const checkExistingResults = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Check if user already has results
        const resultResponse = await apiClient.getHollandResults(user.id);
        
        if (resultResponse.data && resultResponse.data.hasCompleted) {
          // User has already taken the test
          setResults(resultResponse.data.results);
          setCompletionDate(resultResponse.data.completionDate);
          setIsCompleted(true);
          setLoading(false);
          return;
        }
        
        // If no existing results, load questions for new test
        await loadQuestions();
        
      } catch (err) {
        console.error('Error checking existing results:', err);
        // If checking fails, still try to load questions
        await loadQuestions();
      }
    };

    checkExistingResults();
  }, [user?.id]);

  // Load questions from API
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getHollandQuestions();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        // Extract questions from the wrapper response
        setQuestions(response.data.questions);
        setTotalQuestions(response.data.totalQuestions);
        setTimeStarted(new Date());
        console.log(response.data.message); // Log success message
      } else {
        throw new Error('No questions received');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (responseIndex: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: responseIndex };
    setAnswers(newAnswers);

    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Submit results to API
      submitResults(newAnswers);
    }
  };

  const submitResults = async (finalAnswers: { [key: number]: number }) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setSubmitting(true);
      
      const submission: HollandSubmission = {
        studentId: user.id,
        answers: finalAnswers
      };

      const response = await apiClient.submitHollandAssessment(submission);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.results) {
        setResults(response.data.results);
        setCompletionDate(response.data.completionDate);
        setIsCompleted(true);
      } else {
        throw new Error('No results received');
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setRetaking(true);
      setError(null);

      // Call the retake endpoint to allow the user to retake
      const response = await apiClient.allowHollandRetake(user.id);

      if (response.error) {
        throw new Error(response.error);
      }

      // Reset state to start fresh
      setIsCompleted(false);
      setResults(null);
      setCompletionDate(null);
      setCurrentQuestion(0);
      setAnswers({});
      
      // Load questions for retake
      await loadQuestions();
      
    } catch (err) {
      console.error('Error setting up retake:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up retake');
    } finally {
      setRetaking(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    const currentQuestionId = questions[currentQuestion]?.id;
    if (currentQuestion < questions.length - 1 && answers[currentQuestionId] !== undefined) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progressPercentage = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 bg-white/20" />
              <Skeleton className="h-6 w-48 bg-white/20" />
              <Skeleton className="h-2 w-full bg-white/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-w-2xl mx-auto">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results view (for both completed and existing results)
  if (isCompleted && results) {
    // Convert completion time from seconds to minutes
    const completionMinutes = Math.round(results.completionTime / 60);
    
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-xl font-bold">Assessment Complete!</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Your Personality Code: {results.personalityCode}</h1>
                <p className="text-green-100 mb-4">
                  Completed in {completionMinutes} minutes by {user?.full_name}
                </p>
                {completionDate && (
                  <p className="text-green-200 text-sm">
                    Completed on {new Date(completionDate).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="hidden md:block text-6xl opacity-20">🎯</div>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span>Your Personality Profile</span>
            </CardTitle>
            <CardDescription>
              Your top 3 personality types based on the Holland Code assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.topCategories.map(([category, score], index) => {
                const categoryData = categoryInfo[category as CategoryName];
                const IconComponent = categoryData.icon;
                const percentage = (score / 50) * 100; // Using 50 as max based on your response

                return (
                  <Card 
                    key={category} 
                    className={index === 0 ? 'ring-2 ring-blue-500 relative' : ''}
                  >
                    <CardContent className="p-6">
                      {index === 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white">
                          Primary
                        </Badge>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full ${categoryData.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
                          <div className="text-sm text-gray-500">Score: {score}/50</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{category}</h3>
                      <p className="text-sm text-gray-600 mb-3">{categoryData.description}</p>
                      <Progress value={percentage} className="h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Career Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-purple-600" />
              <span>Perfect Career Matches</span>
            </CardTitle>
            <CardDescription>
              Careers that align with your {results.personalityCode} personality type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.matchedCareers.map((career: string, index: number) => (
                <Card 
                  key={index} 
                  className="bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{career}</h4>
                        <p className="text-sm text-gray-600">Perfect match for {results.personalityCode} type</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/dashboard/student/career-guidance')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Explore These Careers
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/student/mentoring/career-guidance')}
                variant="outline"
                size="lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Talk to Career Mentor
              </Button>
              <Button 
                onClick={handleRetake} 
                variant="outline" 
                size="lg"
                disabled={retaking}
              >
                {retaking ? (
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <RotateCcw className="mr-2 h-5 w-5" />
                )}
                {retaking ? 'Setting up...' : 'Retake Test'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment view
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <Brain className="h-16 w-16 text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">No questions available</h2>
            <p className="text-gray-600">Unable to load assessment questions.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const currentQuestionId = currentQuestionData?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-8 w-8" />
                <span className="text-xl font-bold">Holland Code Assessment</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Discover Your Perfect Career Match!</h1>
              <p className="text-indigo-100">
                Question {currentQuestion + 1} of {totalQuestions || questions.length} • {Math.round(progressPercentage)}% Complete
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-indigo-200">
                <Clock className="h-5 w-5" />
                <span>~15 minutes</span>
              </div>
            </div>
          </div>
          <div className="relative w-full h-3 bg-indigo-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-indigo-400 transition-all"
                style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              {currentQuestionData?.category} Type
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                {timeStarted ? Math.round((new Date().getTime() - timeStarted.getTime()) / 60000) : 0} min
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestionData?.text}
            </h2>
            <p className="text-gray-600">How much do you agree with this statement?</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 max-w-2xl mx-auto">
            {currentQuestionData?.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                variant={answers[currentQuestionId] === index ? 'default' : 'outline'}
                className={`w-full py-4 text-left justify-start transition-all duration-200 ${
                  answers[currentQuestionId] === index
                    ? 'bg-gray-900 text-white border-gray-900' // selected = black/near-black
                    : 'hover:bg-gray-100 hover:border-gray-400' // hover = neutral grays
                }`}
                disabled={submitting}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestionId] === index
                        ? 'bg-white border-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestionId] === index && (
                      <CheckCircle className="h-4 w-4 text-gray-900" />
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button 
              onClick={goToPrevious} 
              disabled={currentQuestion === 0 || submitting} 
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions || questions.length}
            </div>
            
            <Button 
              onClick={goToNext} 
              disabled={currentQuestion === questions.length - 1 || answers[currentQuestionId] === undefined || submitting} 
              variant="outline"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Info */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Answer honestly based on your true preferences. 
          There are no right or wrong answers - this test helps find careers that match your personality!
        </AlertDescription>
      </Alert>
      
      {submitting && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Processing your results...</span>
          </div>
        </div>
      )}
    </div>
  );
}
