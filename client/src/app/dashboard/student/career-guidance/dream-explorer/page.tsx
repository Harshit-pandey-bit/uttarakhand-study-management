'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Rocket,
  Heart,
  Brain,
  Microscope,
  Globe,
  Star,
  Play,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  ArrowRight,
  Eye,
  BookOpen,
  Target,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  DreamCareer,
  SuccessStory,
  CareerPathway,
  InspirationalQuote,
  DayInLife,
  CareerCategory,
  DemandLevel,
  DifficultyLevel,
  IconComponent
} from '@/types/api';

type TabValue = 'overview' | 'stories' | 'dayinlife' | 'pathways';

interface CategoryIconMap {
  [key: string]: IconComponent;
}

interface DemandColorMap {
  [key: string]: string;
}

interface DifficultyColorMap {
  [key: string]: string;
}

export default function DreamExplorer() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  const [currentQuote, setCurrentQuote] = useState<number>(0);

  // Data states
  const [dreamCareers, setDreamCareers] = useState<DreamCareer[]>([]);
  const [inspirationalQuotes, setInspirationalQuotes] = useState<InspirationalQuote[]>([
    { quote: "Your background doesn't determine your future - your determination does!", author: "Unknown" },
    { quote: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
    { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { quote: "Dreams don't work unless you do.", author: "John C. Maxwell" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
  ]);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadDreamCareersData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Load dream careers and quotes in parallel
        const [careersResponse, quotesResponse] = await Promise.all([
          apiClient.getDreamCareers(),
          apiClient.getInspirationalQuotes().catch(() => ({ data: null, error: null }))
        ]);

        console.log("Career Response: ", careersResponse);
        console.log("Quotes Response: ", quotesResponse);

        // Set dream careers
        if (careersResponse.error) {
          throw new Error(careersResponse.error);
        }
        
        if (careersResponse.data) {
          setDreamCareers(careersResponse.data);
        }

        // Set inspirational quotes if available (otherwise keep default)
        if (quotesResponse.data && quotesResponse.data.length > 0) {
          setInspirationalQuotes(quotesResponse.data);
        }

      } catch (err: unknown) {
        console.error('Error loading dream careers data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load career data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadDreamCareersData();
  }, []);

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev: number) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [inspirationalQuotes.length]);

  const selectedCareerData: DreamCareer | undefined = dreamCareers.find(
    (career: DreamCareer) => career.id === selectedCareer
  );

  const categoryIconMap: CategoryIconMap = {
    'Space & Exploration': Rocket,
    'Healthcare & Medicine': Heart,
    'Technology & Innovation': Brain,
    'Environment & Sustainability': Microscope,
    'Engineering': Target,
    'Arts & Entertainment': Star,
    'Business & Finance': TrendingUp,
    'Education': BookOpen,
    'Sports': Award,
    'Technology': Brain,
    'Healthcare': Heart,
    'Science': Microscope,
    'Business': TrendingUp,
    'Arts': Star
  };

  const getCategoryIcon = (category: string): IconComponent => {
    return categoryIconMap[category] || Star;
  };

  const demandColorMap: DemandColorMap = {
    'Extremely High': 'bg-purple-500',
    'Very High': 'bg-green-500',
    'Growing Fast': 'bg-blue-500',
    'Growing': 'bg-orange-500',
    'High': 'bg-emerald-500',
    'Medium': 'bg-yellow-500',
    'Low': 'bg-gray-500'
  };

  const getDemandColor = (level: string): string => {
    return demandColorMap[level] || 'bg-gray-500';
  };

  const difficultyColorMap: DifficultyColorMap = {
    'Extremely Hard': 'bg-red-100 text-red-800',
    'Hard': 'bg-orange-100 text-orange-800',
    'Advanced': 'bg-red-100 text-red-800',
    'Intermediate': 'bg-orange-100 text-orange-800',
    'Beginner': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Easy': 'bg-green-100 text-green-800'
  };

  const getDifficultyColor = (difficulty: string): string => {
    return difficultyColorMap[difficulty] || 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <CardContent className="p-6 lg:p-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto bg-white/20" />
              <Skeleton className="h-10 w-64 mx-auto bg-white/20" />
              <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i: number) => (
            <Card key={i} className="text-center">
              <CardContent className="p-4">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Careers Grid Skeleton */}
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }, (_, i: number) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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

  // Detailed Career View
  if (selectedCareer && selectedCareerData) {
    const IconComponent = getCategoryIcon(selectedCareerData.category);
    
    return (
      <div className="space-y-6">
        {/* Career Header */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCareer(null)}
                className="text-white hover:bg-white/20 mb-4"
              >
                ← Back to Dream Careers
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{selectedCareerData.emoji || '💼'}</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedCareerData.title}</h1>
                <p className="text-purple-100 mb-4">{selectedCareerData.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white">
                    <IconComponent className="h-3 w-3 mr-2" />
                    <span>{selectedCareerData.category}</span>
                  </Badge>
                  <Badge className={`${getDemandColor(selectedCareerData.demandLevel)} text-white`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {selectedCareerData.demandLevel} Demand
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    💰 {selectedCareerData.salaryRange}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Details Tabs */}
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Reality Check</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="dayinlife">Day in Life</TabsTrigger>
            <TabsTrigger value="pathways">How to Get There</TabsTrigger>
          </TabsList>

          {/* Reality Check - FIXED: Using direct properties instead of realityCheck object */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Award className="h-5 w-5" />
                    <span>The Amazing Parts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedCareerData.pros && selectedCareerData.pros.length > 0 ? (
                      selectedCareerData.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">{pro}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">Information coming soon...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-700">
                    <Target className="h-5 w-5" />
                    <span>The Challenges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedCareerData.cons && selectedCareerData.cons.length > 0 ? (
                      selectedCareerData.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-700">{con}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">Information coming soon...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Where You'll Work</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {selectedCareerData.workEnvironment || "Work environment information coming soon..."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>What You'll Do Daily</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {selectedCareerData.typicalDay || "Daily routine information coming soon..."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Local Connection */}
            <Alert className="bg-blue-50 border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Local Connection:</strong> {selectedCareerData.localConnection || "Local opportunities information coming soon..."}
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="space-y-6">
            {selectedCareerData.successStories && selectedCareerData.successStories.length > 0 ? (
              selectedCareerData.successStories.map((story: SuccessStory, index: number) => (
                <Card key={story.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {story.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                        <p className="text-gray-600 mb-3">{story.location}</p>
                        
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Journey:</h4>
                          <p className="text-gray-700">{story.journey}</p>
                        </div>

                        <blockquote className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 mb-4">
                          <p className="text-purple-700 italic">"{story.quote}"</p>
                        </blockquote>

                        <div className="bg-green-50 rounded-lg p-3">
                          <h4 className="font-semibold text-green-800 mb-1">Current Impact:</h4>
                          <p className="text-green-700 text-sm">{story.currentRole}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Success Stories Yet</h3>
                <p className="text-gray-500">Success stories will be added soon!</p>
              </div>
            )}
          </TabsContent>

          {/* Day in Life */}
          <TabsContent value="dayinlife" className="space-y-6">
            {selectedCareerData.dayInLife ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AM</span>
                      </div>
                      <h3 className="font-semibold text-yellow-800">Morning</h3>
                    </div>
                    <p className="text-yellow-700 text-sm">{selectedCareerData.dayInLife.morning}</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">PM</span>
                      </div>
                      <h3 className="font-semibold text-blue-800">Afternoon</h3>
                    </div>
                    <p className="text-blue-700 text-sm">{selectedCareerData.dayInLife.afternoon}</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">EVE</span>
                      </div>
                      <h3 className="font-semibold text-purple-800">Evening</h3>
                    </div>
                    <p className="text-purple-700 text-sm">{selectedCareerData.dayInLife.evening}</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-red-800">Challenges</h3>
                    </div>
                    <p className="text-red-700 text-sm">{selectedCareerData.dayInLife.challenges}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Day-in-Life Coming Soon</h3>
                <p className="text-gray-500">Detailed daily routine information will be available soon!</p>
              </div>
            )}
          </TabsContent>

          {/* Pathways */}
          <TabsContent value="pathways" className="space-y-6">
            {selectedCareerData.pathways && selectedCareerData.pathways.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedCareerData.pathways.map((pathway: CareerPathway, index: number) => (
                  <Card key={pathway.id || index} className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <span>{pathway.route}</span>
                        </CardTitle>
                        <Badge className={getDifficultyColor(pathway.difficulty)}>
                          {pathway.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>
                        Duration: {pathway.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pathway.steps.map((step: string, stepIndex: number) => (
                          <div key={stepIndex} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                              {stepIndex + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Career Pathways Coming Soon</h3>
                <p className="text-gray-500">Detailed career roadmaps will be available soon!</p>
              </div>
            )}

            {/* Next Steps */}
            {selectedCareerData.nextSteps && selectedCareerData.nextSteps.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <ArrowRight className="h-5 w-5" />
                    <span>Your Next Steps (Start Today!)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCareerData.nextSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="text-green-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/dashboard/student/career-guidance/career-map">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Detailed Career Map
                </Button>
              </Link>
              <Link href="/dashboard/student/mentoring/career-guidance">
                <Button variant="outline" size="lg">
                  <Users className="mr-2 h-5 w-5" />
                  Talk to a Mentor
                </Button>
              </Link>
              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button variant="outline" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Take Personality Test
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Calculate success stories count
  const totalSuccessStories: number = dreamCareers.reduce(
    (acc: number, career: DreamCareer) => acc + (career.successStories?.length || 0), 
    0
  );

  // Main Explorer View
  return (
    <div className="space-y-6">
      {/* Inspirational Header */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Dream Explorer
            </h1>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              {inspirationalQuotes[currentQuote]?.quote || "Your dreams are the blueprint of your future success."}
            </p>
            <p className="text-purple-200">
              Discover amazing careers that can change the world - and your life! 
              Your village background is your strength, not your limitation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{dreamCareers.length}</div>
            <div className="text-sm text-gray-600">Dream Careers</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{totalSuccessStories}</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {dreamCareers.length > 0 ? '₹15-200L' : '₹0'}
            </div>
            <div className="text-sm text-gray-600">Salary Range</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">Growing</div>
            <div className="text-sm text-gray-600">Job Demand</div>
          </CardContent>
        </Card>
      </div>

      {/* Dream Careers Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Dream Careers</h2>
        {dreamCareers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dreamCareers.map((career: DreamCareer) => {
              const IconComponent = getCategoryIcon(career.category);
              
              return (
                <Card 
                  key={career.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedCareer(career.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-5xl">{career.emoji || '💼'}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                          <Badge className={`${getDemandColor(career.demandLevel)} text-white`}>
                            {career.demandLevel}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <IconComponent className="h-5 w-5" />
                          <span className="text-sm text-gray-600">{career.category}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm font-medium text-green-600">{career.salaryRange}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">{career.description}</p>
                        
                        {/* Success Story Preview */}
                        {career.successStories && career.successStories.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <Star className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Success Story</span>
                            </div>
                            <p className="text-sm text-blue-700">
                              <strong>{career.successStories[0].name}:</strong> {career.successStories[0].location}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{career.successStories?.length || 0} success stories</span>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Play className="mr-1 h-3 w-3" />
                            Explore Career
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Dream Careers Available</h3>
            <p className="text-gray-500">Check back later for exciting career opportunities!</p>
          </div>
        )}
      </div>

      {/* Motivation Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Remember</h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Every person in these success stories started exactly where you are now. 
            They didn't have special powers or unlimited resources - they had dreams, 
            determination, and the courage to begin. Your journey starts with a single step!
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Brain className="mr-2 h-5 w-5" />
            Find My Perfect Career Match
          </Button>
        </Link>
        <Link href="/dashboard/student/career-guidance/career-map">
          <Button variant="outline" size="lg">
            <MapPin className="mr-2 h-5 w-5" />
            View Career Pathways
          </Button>
        </Link>
        <Link href="/dashboard/student/mentoring/career-guidance">
          <Button variant="outline" size="lg">
            <Users className="mr-2 h-5 w-5" />
            Talk to Career Mentor
          </Button>
        </Link>
      </div>
    </div>
  );
}
