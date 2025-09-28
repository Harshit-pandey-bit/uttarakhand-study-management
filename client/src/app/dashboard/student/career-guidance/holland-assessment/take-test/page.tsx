'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type CategoryName = 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional';

interface CategoryScore {
  category: CategoryName;
  score: number;
}

interface AssessmentResults {
  scores: Record<CategoryName, number>;
  topCategories: [CategoryName, number][];
  personalityCode: string;
  matchedCareers: string[];
  completionTime: number;
}

type CareerMatchKey = 'RI' | 'IR' | 'SI' | 'IS' | 'AI' | 'IA' | 'SE' | 'ES' | 'EC' | 'CE' | 'RC' | 'CR';

interface HollandQuestion {
  id: number;
  text: string;
  category: CategoryName;
  options: string[];
}

// Holland Code RIASEC Questions based on specifications [file:1]
const hollandQuestions: HollandQuestion[] = [
  // Realistic (R) - Hands-on, practical, mechanical
  { id: 1, text: "I enjoy building things with my hands", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 2, text: "I like working with tools and machinery", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 3, text: "I prefer outdoor activities over indoor activities", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 4, text: "I enjoy repairing electronic equipment", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 5, text: "I like to work with my hands rather than my mind", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 6, text: "I enjoy physical activities and sports", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 7, text: "I like working with plants and animals", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 8, text: "I prefer practical solutions to theoretical ones", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 9, text: "I like to see immediate results from my work", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 10, text: "I enjoy working in a workshop or laboratory", category: "Realistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },

  // Investigative (I) - Research, analysis, scientific
  { id: 11, text: "I love solving complex math problems", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 12, text: "I enjoy conducting scientific experiments", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 13, text: "I like to analyze data and find patterns", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 14, text: "I enjoy reading scientific articles and journals", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 15, text: "I like to understand how things work", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 16, text: "I enjoy working independently on research projects", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 17, text: "I like to question everything and think critically", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 18, text: "I enjoy learning about new scientific discoveries", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 19, text: "I like to solve puzzles and brain teasers", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 20, text: "I prefer working with ideas rather than people", category: "Investigative", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },

  // Artistic (A) - Creative, expressive, innovative
  { id: 21, text: "I enjoy creative writing and storytelling", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 22, text: "I like to draw, paint, or design things", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 23, text: "I enjoy music and performing arts", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 24, text: "I like to express myself through art", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 25, text: "I enjoy decorating spaces and rooms", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 26, text: "I like to think of new and better ways to do things", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 27, text: "I enjoy photography and videography", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 28, text: "I like to attend cultural events and art exhibitions", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 29, text: "I enjoy reading fiction and poetry", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 30, text: "I like to work in unstructured environments", category: "Artistic", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },

  // Social (S) - Helping, teaching, caring
  { id: 31, text: "I enjoy helping people with their problems", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 32, text: "I like to teach and explain things to others", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 33, text: "I enjoy working as part of a team", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 34, text: "I like to counsel and guide people", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 35, text: "I enjoy organizing community events", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 36, text: "I like to work with children and young people", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 37, text: "I enjoy providing support to people in need", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 38, text: "I like to participate in group discussions", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 39, text: "I enjoy volunteering for social causes", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 40, text: "I prefer cooperative work over competitive work", category: "Social", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },

  // Enterprising (E) - Leadership, business, persuasion
  { id: 41, text: "I enjoy leading a team or group", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 42, text: "I like to start new projects and ventures", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 43, text: "I enjoy selling products or ideas to people", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 44, text: "I like to take risks and face challenges", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 45, text: "I enjoy public speaking and presentations", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 46, text: "I like to persuade and influence others", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 47, text: "I enjoy managing and supervising others", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 48, text: "I like to make important decisions", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 49, text: "I enjoy networking and meeting new people", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 50, text: "I like to organize and plan events", category: "Enterprising", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },

  // Conventional (C) - Organizing, detail-oriented, structured
  { id: 51, text: "I enjoy organizing files and keeping records", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 52, text: "I like to follow established procedures and rules", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 53, text: "I enjoy working with numbers and calculations", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 54, text: "I like to keep my workspace neat and organized", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 55, text: "I enjoy proofreading and checking for errors", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 56, text: "I like to work on detailed projects", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 57, text: "I enjoy using computers and office equipment", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 58, text: "I like to collect and classify information", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 59, text: "I prefer structured work environments", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
  { id: 60, text: "I enjoy creating schedules and timelines", category: "Conventional", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] }
];

// Career matches based on RIASEC combinations [file:1]
const careerMatches: Record<CareerMatchKey, string[]> = {
  'RI': ['ISRO Scientist', 'Aerospace Engineer', 'Research Engineer', 'Mechanical Engineer'],
  'IR': ['Data Scientist', 'Medical Researcher', 'AI Researcher', 'Biomedical Engineer'],
  'SI': ['Doctor', 'Teacher', 'Social Worker', 'Counselor'],
  'IS': ['Psychologist', 'Research Professor', 'Clinical Researcher', 'Therapist'],
  'AI': ['Artist', 'Designer', 'Musician', 'Writer'],
  'IA': ['Architect', 'Game Designer', 'Creative Director', 'Innovation Manager'],
  'SE': ['HR Manager', 'Training Specialist', 'Event Manager', 'Team Leader'],
  'ES': ['Sales Manager', 'Marketing Director', 'Business Development', 'Entrepreneur'],
  'EC': ['Business Analyst', 'Project Manager', 'Operations Manager', 'CEO'],
  'CE': ['Financial Analyst', 'Bank Manager', 'Accounting Manager', 'Investment Advisor'],
  'RC': ['Quality Controller', 'Lab Technician', 'Production Manager', 'Engineer'],
  'CR': ['Computer Programmer', 'Database Administrator', 'System Analyst', 'IT Support']
};

const categoryInfo: Record<CategoryName, { icon: any; color: string; description: string }> = {
  Realistic: { icon: Hammer, color: 'bg-orange-500', description: 'Hands-on, practical, love building and creating' },
  Investigative: { icon: Brain, color: 'bg-purple-500', description: 'Analytical, curious, love solving problems' },
  Artistic: { icon: Lightbulb, color: 'bg-pink-500', description: 'Creative, expressive, love art and innovation' },
  Social: { icon: Heart, color: 'bg-red-500', description: 'Caring, helpful, love working with people' },
  Enterprising: { icon: Users, color: 'bg-blue-500', description: 'Leadership, business-minded, love leading teams' },
  Conventional: { icon: Briefcase, color: 'bg-green-500', description: 'Organized, detail-oriented, love structured work' }
};

export default function HollandAssessmentTest() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  useEffect(() => {
    setTimeStarted(new Date());
  }, []);

  const getScoreValue = (responseIndex: number) => {
    // Convert response to score: Strongly Agree=4, Agree=3, Neutral=2, Disagree=1, Strongly Disagree=0
    return [4, 3, 2, 1, 0][responseIndex] || 0;
  };

  const handleAnswer = (responseIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: responseIndex };
    setAnswers(newAnswers);

    // Auto-advance to next question
    if (currentQuestion < hollandQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Calculate results
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: { [key: number]: number }) => {
    const categoryScores: Record<CategoryName, number> = {
      Realistic: 0,
      Investigative: 0,
      Artistic: 0,
      Social: 0,
      Enterprising: 0,
      Conventional: 0
    };

    // Calculate scores for each category
    hollandQuestions.forEach((question, index) => {
      const answer = finalAnswers[index];
      if (answer !== undefined) {
        const score = getScoreValue(answer);
        categoryScores[question.category] += score;
      }
    });

    // Sort categories by score with proper typing
    const sortedCategories = (Object.entries(categoryScores) as [CategoryName, number][])
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Get top 2 letters for career matching
    const topTwoLetters = sortedCategories.slice(0, 2)
      .map(([category]) => category[0])
      .join('') as CareerMatchKey;

    // Helper function to get careers safely
    const getMatchedCareers = (code: string): string[] => {
      const primaryMatch = careerMatches[code as CareerMatchKey];
      if (primaryMatch) return primaryMatch;
      
      // Try reversed combination
      const reversedCode = code.split('').reverse().join('') as CareerMatchKey;
      const reversedMatch = careerMatches[reversedCode];
      if (reversedMatch) return reversedMatch;
      
      // Fallback based on primary letter
      const fallbackCareers: Record<string, string[]> = {
        'R': ['Engineer', 'Technician', 'Mechanic', 'Scientist'],
        'I': ['Researcher', 'Analyst', 'Scientist', 'Doctor'],
        'A': ['Artist', 'Designer', 'Writer', 'Creative Director'],
        'S': ['Teacher', 'Counselor', 'Social Worker', 'Therapist'],
        'E': ['Manager', 'Entrepreneur', 'Sales Person', 'Leader'],
        'C': ['Accountant', 'Administrator', 'Analyst', 'Coordinator']
      };
      
      return fallbackCareers[code[0]] || ['Explore various career options based on your interests'];
    };

    const results: AssessmentResults = {
      scores: categoryScores,
      topCategories: sortedCategories,
      personalityCode: topTwoLetters,
      matchedCareers: getMatchedCareers(topTwoLetters),
      completionTime: timeStarted ? Math.round((new Date().getTime() - timeStarted.getTime()) / 60000) : 0
    };

    setResults(results);
    setIsCompleted(true);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < hollandQuestions.length - 1 && answers[currentQuestion] !== undefined) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeStarted(new Date());
    setIsCompleted(false);
    setResults(null);
  };

  const progressPercentage = ((currentQuestion + 1) / hollandQuestions.length) * 100;

  if (isCompleted && results) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-xl font-bold">Assessment Complete! 🎉</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  Your Personality Code: {results.personalityCode}
                </h1>
                <p className="text-green-100 mb-4">
                  Completed in {results.completionTime} minutes by {user?.full_name}
                </p>
              </div>
              <div className="hidden md:block text-6xl opacity-20">
                🎯
              </div>
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
              {results.topCategories.map(([category, score]: [CategoryName, number], index: number) => {
                const categoryData = categoryInfo[category];
                const IconComponent = categoryData.icon;
                const percentage = (score / 40) * 100; // Max score per category is 40
                
                return (
                  <Card key={category} className={`${index === 0 ? 'ring-2 ring-blue-500' : ''} relative`}>
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
                          <div className="text-sm text-gray-500">Score: {score}/40</div>
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
                <Card key={index} className="bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors">
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
                onClick={restartTest}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Question {currentQuestion + 1} of {hollandQuestions.length} • {Math.round(progressPercentage)}% Complete
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-indigo-200">
                <Clock className="h-5 w-5" />
                <span>~15 minutes</span>
              </div>
            </div>
          </div>
          
          {/* FIXED: Progress bar with white fill color for visibility */}
          <Progress value={progressPercentage} className="mt-4 h-3 bg-indigo-800 [&>div]:bg-white" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              {hollandQuestions[currentQuestion].category} Type
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{timeStarted ? Math.round((new Date().getTime() - timeStarted.getTime()) / 60000) : 0} min</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {hollandQuestions[currentQuestion].text}
            </h2>
            <p className="text-gray-600">
              How much do you agree with this statement?
            </p>
          </div>

          {/* FIXED: Answer Options with black borders */}
          <div className="space-y-3 max-w-2xl mx-auto">
            {hollandQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                variant={answers[currentQuestion] === index ? "default" : "outline"}
                className={`w-full py-4 text-left justify-start transition-all duration-200 ${
                  answers[currentQuestion] === index 
                    ? 'bg-blue-600 text-white border-black' 
                    : 'hover:bg-blue-50 border-black hover:border-black'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index 
                      ? 'bg-white border-white' 
                      : 'border-black'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
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
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {hollandQuestions.length}
            </div>
            
            <Button 
              onClick={goToNext}
              disabled={currentQuestion === hollandQuestions.length - 1 || answers[currentQuestion] === undefined}
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
          <strong>Tip:</strong> Answer honestly based on your true preferences. There are no right or wrong answers - this test helps find careers that match your personality!
        </AlertDescription>
      </Alert>
    </div>
  );
}
