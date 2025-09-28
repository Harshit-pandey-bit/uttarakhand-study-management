'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Target,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Brain,
  Rocket,
  Heart,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  CareerPathwayMapDto,
  CareerProgressDto,
  CareerMapStageStatus,
  PathwayStageDto,
  AlternativeRouteDto,
  LocalOpportunityDto,
  UpdateProgressDto,
  InspirationalQuote
} from '@/types/api';

export default function CareerMap() {
  const { user } = useAuth();
  const [selectedPathway, setSelectedPathway] = useState<string>('');
  const [activeStage, setActiveStage] = useState<number>(0);
  
  // Data states
  const [careerPathways, setCareerPathways] = useState<CareerPathwayMapDto[]>([]);
  const [careerProgress, setCareerProgress] = useState<CareerProgressDto | null>(null);
  const [localOpportunities, setLocalOpportunities] = useState<LocalOpportunityDto[]>([]);
  const [inspirationalQuotes, setInspirationalQuotes] = useState<InspirationalQuote[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stageUpdateLoading, setStageUpdateLoading] = useState<boolean>(false);

  // Load data on component mount
  useEffect(() => {
    const loadCareerPathwayData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Load basic data first
        const pathwaysResponse = await apiClient.getCareerPathways();
        const opportunitiesResponse = await apiClient.getCareerLocalOpportunities('Uttarakhand');
        const quotesResponse = await apiClient.getInspirationalQuotes('career', 3);

        // Set pathways
        if (pathwaysResponse.error) {
          throw new Error(pathwaysResponse.error);
        }
        if (pathwaysResponse.data) {
          setCareerPathways(pathwaysResponse.data);
          // Set first pathway as default if none selected
          if (pathwaysResponse.data.length > 0 && !selectedPathway) {
            setSelectedPathway(pathwaysResponse.data[0].id);
          }
        }

        // Set local opportunities
        if (opportunitiesResponse.data && !opportunitiesResponse.error) {
          setLocalOpportunities(opportunitiesResponse.data);
        }

        // Set quotes
        if (quotesResponse.data && !quotesResponse.error) {
          setInspirationalQuotes(quotesResponse.data);
        }

        // Load user progress separately if authenticated
        if (user?.role === 'student') {
          try {
            const progressResponse = await apiClient.getMyCareerProgress();
            if (progressResponse.data && !progressResponse.error) {
              setCareerProgress(progressResponse.data);
            }
          } catch (progressError) {
            console.warn('Could not load user progress:', progressError);
            // Don't throw error for progress - it's optional
          }
        }

      } catch (err: unknown) {
        console.error('Error loading career pathway data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load career pathway data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCareerPathwayData();
  }, [user]); // Only depend on user, not selectedPathway to prevent infinite loops

  const pathway = careerPathways.find(p => p.id === selectedPathway);

  // Local progress management (for demo purposes or non-authenticated users)
  const [localProgress, setLocalProgress] = useState({
    currentStage: 0,
    completedStages: [] as number[]
  });

  const getStageStatus = (stageIndex: number): CareerMapStageStatus => {
    // Use local demo progress for now
    if (localProgress.completedStages.includes(stageIndex)) return 'completed';
    if (stageIndex === localProgress.currentStage) return 'current';
    return 'upcoming';
  };

  const getStageStatusColor = (status: CareerMapStageStatus): string => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500'; 
      case 'upcoming': return 'bg-gray-400';
    }
  };

  const getStageIcon = (status: CareerMapStageStatus, index: number) => {
    if (status === 'completed') return <CheckCircle className="h-6 w-6" />;
    return <span className="text-white font-bold">{index + 1}</span>;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'advanced': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-orange-100 text-orange-800';
      case 'beginner': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Space & Exploration': return <Rocket className="h-5 w-5" />;
      case 'Healthcare & Medicine': return <Heart className="h-5 w-5" />;
      case 'Technology & Innovation': return <Brain className="h-5 w-5" />;
      case 'Technology': return <Brain className="h-5 w-5" />;
      case 'Healthcare': return <Heart className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const handleStageUpdate = async (stageIndex: number) => {
    setActiveStage(stageIndex);
    
    // Update local progress for demo
    setLocalProgress(prev => ({
      ...prev,
      currentStage: stageIndex
    }));

    // If user is authenticated, optionally update progress in backend
    if (user?.role === 'student' && pathway) {
      try {
        setStageUpdateLoading(true);
        
        const progressData: UpdateProgressDto = {
          careerSlug: pathway.careerTitle.toLowerCase().replace(/\s+/g, '-'),
          stageIndex: stageIndex,
          completed: false
        };
        
        const response = await apiClient.updateMyCareerProgress(progressData);
        if (response.data) {
          setCareerProgress(response.data);
        }
      } catch (error) {
        console.warn('Failed to update backend progress:', error);
      } finally {
        setStageUpdateLoading(false);
      }
    }
  };

  const handlePathwayChange = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
    setActiveStage(0);
    setLocalProgress({
      currentStage: 0,
      completedStages: []
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64 bg-white/20" />
                <Skeleton className="h-12 w-80 bg-white/20" />
                <Skeleton className="h-6 w-96 bg-white/20" />
                <div className="flex space-x-4">
                  <Skeleton className="h-6 w-32 bg-white/20" />
                  <Skeleton className="h-6 w-32 bg-white/20" />
                  <Skeleton className="h-6 w-32 bg-white/20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Selection Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
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

  if (!pathway) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">No Career Pathways Available</h2>
            <p className="text-gray-600">Please check back later for career pathway information.</p>
            <Link href="/dashboard/student/career-guidance/dream-explorer">
              <Button>
                <Rocket className="mr-2 h-4 w-4" />
                Explore Careers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-8 w-8" />
                <span className="text-xl font-bold">Career Roadmap</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Path to Becoming a {pathway.careerTitle}</h1>
              <p className="text-blue-100 mb-4">
                Step-by-step roadmap from your current stage to your dream career
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-white/20 text-white">
                  {getCategoryIcon(pathway.category)}
                  <span className="ml-2">{pathway.category}</span>
                </Badge>
                <Badge className={`${getDifficultyColor(pathway.difficultyLevel)} border-white/20`}>
                  {pathway.difficultyLevel}
                </Badge>
                <Badge className="bg-white/20 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {pathway.estimatedDuration}
                </Badge>
                {pathway.matchPercentage && (
                  <Badge className="bg-green-500 text-white">
                    {pathway.matchPercentage}% Match
                  </Badge>
                )}
              </div>
            </div>
            <div className="hidden md:block text-6xl opacity-20">
              🗺️
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {careerPathways.map((career) => (
              <Button
                key={career.id}
                variant={selectedPathway === career.id ? "default" : "outline"}
                onClick={() => handlePathwayChange(career.id)}
                className="flex items-center space-x-2"
              >
                {getCategoryIcon(career.category)}
                <span>{career.careerTitle}</span>
                {career.isRecommended && (
                  <Badge className="ml-1 bg-green-500 text-xs">★</Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pathway Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Your Journey Stages</span>
              </CardTitle>
              <CardDescription>
                Click on each stage to explore detailed requirements and next steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pathway.stages.map((stage, index) => {
                  const status = getStageStatus(index);
                  const isActive = activeStage === index;
                  
                  return (
                    <div key={stage.id} className="relative">
                      {/* Connection Line */}
                      {index < pathway.stages.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-20 bg-gray-300"></div>
                      )}
                      
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                        } ${status === 'current' ? 'border-green-500' : 
                             status === 'completed' ? 'border-green-300' : ''}`}
                        onClick={() => handleStageUpdate(index)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              getStageStatusColor(status)
                            } ${stageUpdateLoading && isActive ? 'animate-pulse' : ''}`}>
                              {getStageIcon(status, index)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{stage.title}</h3>
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {stage.duration}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{stage.description}</p>
                              
                              {isActive && (
                                <div className="space-y-4 border-t pt-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">📚 Key Subjects:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {stage.keySubjects.map((subject, subIndex) => (
                                        <Badge key={subIndex} className="bg-blue-100 text-blue-800">
                                          {subject}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">✅ Requirements:</h4>
                                    <ul className="space-y-1">
                                      {stage.requirements.map((req, reqIndex) => (
                                        <li key={reqIndex} className="flex items-center space-x-2 text-sm">
                                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                          <span>{req}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">🎯 Skills to Gain:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {stage.skillsToGain.map((skill, skillIndex) => (
                                        <Badge key={skillIndex} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">📝 Important Exams:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {stage.examinations.map((exam, examIndex) => (
                                        <Badge key={examIndex} className="bg-red-100 text-red-800 text-xs">
                                          {exam}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">🚀 Next Options:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {stage.nextOptions.map((option, optionIndex) => (
                                        <Badge key={optionIndex} variant="secondary" className="text-xs">
                                          {option}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {status === 'current' && (
                              <Badge className="bg-green-100 text-green-800">
                                Current Stage
                              </Badge>
                            )}
                            {status === 'completed' && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Progress Summary */}
          {careerProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-gold-600" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{careerProgress.progressStats.totalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${careerProgress.progressStats.totalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {careerProgress.progressStats.careersExplored}
                      </div>
                      <div className="text-xs text-gray-600">Careers Explored</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {careerProgress.progressStats.pathwaysViewed}
                      </div>
                      <div className="text-xs text-gray-600">Pathways Viewed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Local Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-green-600" />
                <span>Near You in Uttarakhand</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(pathway.localOpportunities.length > 0 ? pathway.localOpportunities : localOpportunities.slice(0, 3)).map((opportunity, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3">
                    <div className="font-semibold text-green-800">{opportunity.institution}</div>
                    <div className="text-sm text-green-600">{opportunity.location}</div>
                    <div className="text-xs text-gray-600 mt-1">{opportunity.programs.join(', ')}</div>
                    <div className="text-xs text-blue-600 mt-1">{opportunity.admissionCriteria}</div>
                    {opportunity.feesRange && (
                      <div className="text-xs text-purple-600 mt-1">Fees: {opportunity.feesRange}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Routes */}
          {pathway.alternativeRoutes && pathway.alternativeRoutes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span>Alternative Paths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0">
                  <TabsList className="grid w-full grid-cols-2">
                    {pathway.alternativeRoutes.map((route, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        Route {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {pathway.alternativeRoutes.map((route, index) => (
                    <TabsContent key={index} value={index.toString()}>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-800">{route.routeName}</h4>
                        <p className="text-sm text-gray-600">{route.description}</p>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {route.duration}
                        </Badge>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs font-semibold text-green-800 mb-1">Advantages:</div>
                            <ul className="text-xs text-green-700 space-y-1">
                              {route.advantages.map((adv, advIndex) => (
                                <li key={advIndex} className="flex items-start space-x-1">
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div>
                                  <span>{adv}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-orange-50 p-2 rounded">
                            <div className="text-xs font-semibold text-orange-800 mb-1">Challenges:</div>
                            <ul className="text-xs text-orange-700 space-y-1">
                              {route.challenges.map((challenge, challengeIndex) => (
                                <li key={challengeIndex} className="flex items-start space-x-1">
                                  <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5"></div>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Inspirational Quote */}
          {inspirationalQuotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <span>Daily Inspiration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-700">
                  "{inspirationalQuotes[0].quote}"
                  <footer className="text-sm text-gray-500 mt-2">
                    — {inspirationalQuotes[0].author}
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/dashboard/student/career-guidance/dream-explorer">
          <Button size="lg" variant="outline">
            <Rocket className="mr-2 h-5 w-5" />
            Explore More Careers
          </Button>
        </Link>
        <Link href="/dashboard/student/mentoring/career-guidance">
          <Button size="lg">
            <Users className="mr-2 h-5 w-5" />
            Talk to Career Mentor
          </Button>
        </Link>
        <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
          <Button size="lg" variant="outline">
            <Brain className="mr-2 h-5 w-5" />
            Take Personality Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
