'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GraduationCap,
  Rocket,
  Brain,
  Target,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Play,
  BookOpen,
  Award,
  Lightbulb,
  Microscope,
  Heart,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { 
  FeaturedCareer, 
  HollandSubmissionResponse, 
  InspirationalQuote,
  SuccessStory,
  CareerProgress 
} from '@/types/api';

export default function CareerGuidancePage() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Data states
  const [featuredCareers, setFeaturedCareers] = useState<FeaturedCareer[]>([]);
  const [hollandResults, setHollandResults] = useState<HollandSubmissionResponse | null>(null);
  const [careerProgress, setCareerProgress] = useState<CareerProgress | null>(null);
  const [inspirationalQuotes, setInspirationalQuotes] = useState<InspirationalQuote[]>([
    {
      quote: "The sky is not the limit, your mind is.",
      author: "Dr. APJ Abdul Kalam"
    },
    {
      quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
      author: "Dr. APJ Abdul Kalam"
    },
    {
      quote: "Science is a way of thinking much more than it is a body of knowledge.",
      author: "Carl Sagan"
    }
  ]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadCareerGuidanceData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          featuredCareersResponse,
          hollandResultsResponse,
          careerProgressResponse,
          quotesResponse,
          successStoriesResponse
        ] = await Promise.all([
          apiClient.getFeaturedCareers(4), // Get 4 featured careers
          apiClient.getHollandResults(user.id).catch(() => ({ data: null, error: null })), // Don't fail if no results
          apiClient.getCareerProgress().catch(() => ({ data: null, error: null })), // Don't fail if no progress
          apiClient.getInspirationalQuotes().catch(() => ({ data: null, error: null })), // Don't fail if no quotes
          apiClient.getSuccessStories().catch(() => ({ data: null, error: null })) // Don't fail if no stories
        ]);

        // Set featured careers
        if (featuredCareersResponse.data) {
          setFeaturedCareers(featuredCareersResponse.data);
        }

        // Set Holland results if available
        if (hollandResultsResponse.data && hollandResultsResponse.data.hasCompleted) {
          setHollandResults(hollandResultsResponse.data);
        }

        // Set career progress if available
        if (careerProgressResponse.data) {
          setCareerProgress(careerProgressResponse.data);
        }

        // Set inspirational quotes if available (otherwise keep default)
        if (quotesResponse.data && quotesResponse.data.length > 0) {
          setInspirationalQuotes(quotesResponse.data);
        }

        // Set success stories if available
        if (successStoriesResponse.data) {
          setSuccessStories(successStoriesResponse.data.slice(0, 3)); // Take first 3
        }

      } catch (err) {
        console.error('Error loading career guidance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load career data');
      } finally {
        setLoading(false);
      }
    };

    loadCareerGuidanceData();
  }, [user?.id]);

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [inspirationalQuotes.length]);

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'bg-emerald-500';
      case 'Extremely High': return 'bg-purple-500';
      case 'High': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Science & Technology': return <Rocket className="h-5 w-5" />;
      case 'Healthcare': return <Heart className="h-5 w-5" />;
      case 'Technology': return <Brain className="h-5 w-5" />;
      case 'Environment': return <Microscope className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-lg p-6 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64 bg-white/20" />
            <Skeleton className="h-10 w-96 bg-white/20" />
            <Skeleton className="h-6 w-full bg-white/20" />
            <Skeleton className="h-12 w-48 bg-white/20" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Careers Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
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

  // Calculate progress stats
  const hasCompletedAssessment = hollandResults?.hasCompleted || false;
  const careersExplored = careerProgress?.progressStats?.careersExplored || 0;
  const totalProgress = careerProgress?.progressStats?.totalProgress || 0;
  const pathwaysViewed = careerProgress?.progressStats?.pathwaysViewed || 0;

  return (
    <div className="space-y-6">
      {/* Hero Section with Inspiration */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-lg p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold">Career Exploration Hub</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Dream Big, {user?.full_name?.split(' ')[0] || 'Champion'}! ✨
            </h1>
            <p className="text-purple-100 mb-4 text-lg">
              {inspirationalQuotes[currentQuote]?.quote || "Your dreams are the blueprint of your future success."}
            </p>
            <p className="text-purple-200 text-sm mb-6">
              — {inspirationalQuotes[currentQuote]?.author || "Unknown"}
            </p>
            
            {!hasCompletedAssessment && (
              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-6 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Discover Your Perfect Career Match!
                </Button>
              </Link>
            )}

            {hollandResults && hasCompletedAssessment && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Your Holland Code: {hollandResults.results.personalityCode}</h3>
                <p className="text-purple-100 text-sm mb-3">
                  {hollandResults.results.matchedCareers.length} careers match your personality!
                </p>
                <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                  <Button className="bg-white/20 hover:bg-white/30 text-white text-sm">
                    View Results
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="text-8xl opacity-20">🚀</div>
          </div>
        </div>
      </div>

      {/* Assessment Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Holland Assessment</p>
                <p className="text-xl font-bold text-indigo-700">
                  {hasCompletedAssessment ? 'Completed' : 'Pending'}
                </p>
                {hollandResults && (
                  <p className="text-xs text-indigo-500">Code: {hollandResults.results.personalityCode}</p>
                )}
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            {!hasCompletedAssessment && (
              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button variant="ghost" size="sm" className="mt-2 text-indigo-600 hover:bg-indigo-50">
                  Take Test <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Careers Explored</p>
                <p className="text-xl font-bold text-emerald-700">
                  {careersExplored}/20
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <Progress 
              value={(careersExplored / 20) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Dream Progress</p>
                <p className="text-xl font-bold text-orange-700">
                  {totalProgress}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <Progress 
              value={totalProgress} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Pathways Viewed</p>
                <p className="text-xl font-bold text-purple-700">{pathwaysViewed}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button variant="ghost" size="sm" className="mt-2 text-purple-600 hover:bg-purple-50">
                View More <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Featured Dream Careers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <span>Dream Careers to Explore</span>
              </CardTitle>
              <CardDescription>
                Discover amazing career paths that can change the world - and your life! 🌟
              </CardDescription>
            </div>
            <Link href="/dashboard/student/career-guidance/career-explorer">
              <Button variant="outline">
                Explore All Careers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCareers.length > 0 ? (
              featuredCareers.map((career, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedCareer === index ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => setSelectedCareer(selectedCareer === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{career.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                          <Badge className={`${getProgressColor(career.demandLevel)} text-white`}>
                            {career.demandLevel}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {getCategoryIcon(career.category)}
                          <span className="text-sm text-gray-600">{career.category}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{career.description}</p>
                        
                        {selectedCareer === index && (
                          <div className="space-y-4 border-t pt-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">🎯 Career Path:</h4>
                              <p className="text-sm text-gray-600">{career.pathway}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">🌟 Famous People:</h4>
                              <div className="flex flex-wrap gap-2">
                                {career.famousPersons.map((person, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {person}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">💡 Did you know?</h4>
                              <p className="text-sm text-emerald-600 font-medium">{career.inspiringFact}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">🛠️ Key Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {career.skills.map((skill, i) => (
                                  <Badge key={i} className="bg-blue-100 text-blue-800">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-3 pt-2">
                              <Link href={`/dashboard/student/career-guidance/career-details/${career.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                  <BookOpen className="mr-1 h-3 w-3" />
                                  Learn More
                                </Button>
                              </Link>
                              <Button size="sm" variant="outline">
                                <Users className="mr-1 h-3 w-3" />
                                Talk to Mentor
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback when no featured careers from API
              <div className="col-span-2 text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Featured Careers Available</h3>
                <p className="text-gray-500">Check back later for exciting career opportunities!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Holland Code Assessment */}
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <Target className="h-12 w-12 mb-4 text-indigo-200" />
            <h3 className="text-xl font-bold mb-2">Holland Code Assessment</h3>
            <p className="text-indigo-100 mb-4">
              Discover careers that match your personality with our scientific RIASEC test
            </p>
            <Badge className="bg-white/20 text-white mb-4">60 Questions • 15 Minutes</Badge>
            <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 w-full">
                <Play className="mr-2 h-4 w-4" />
                {hasCompletedAssessment ? 'View Results' : 'Start Assessment'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Career Pathways */}
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-6">
            <TrendingUp className="h-12 w-12 mb-4 text-emerald-200" />
            <h3 className="text-xl font-bold mb-2">Career Pathways</h3>
            <p className="text-emerald-100 mb-4">
              Step-by-step roadmaps from 10th grade to your dream career
            </p>
            <Badge className="bg-white/20 text-white mb-4">50+ Pathways Available</Badge>
            <Link href="/dashboard/student/career-guidance/pathways">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Pathways
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mentor Guidance */}
        <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white">
          <CardContent className="p-6">
            <Users className="h-12 w-12 mb-4 text-orange-200" />
            <h3 className="text-xl font-bold mb-2">Expert Mentorship</h3>
            <p className="text-orange-100 mb-4">
              Get personalized career guidance from industry professionals
            </p>
            <Badge className="bg-white/20 text-white mb-4">1-on-1 Sessions</Badge>
            <Link href="/dashboard/student/mentoring/career-guidance">
              <Button className="bg-white text-orange-600 hover:bg-orange-50 w-full">
                <Award className="mr-2 h-4 w-4" />
                Book Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <span>Success Stories from Rural Students</span>
          </CardTitle>
          <CardDescription>
            Students just like you who dared to dream big and achieved amazing things!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.length > 0 ? (
              successStories.map((story, index) => (
                <div key={story.id} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-bold text-gray-900 mb-2">{story.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{story.location}</p>
                  <p className="text-sm text-gray-700 mb-3 italic">"{story.quote}"</p>
                  <Badge className="bg-blue-100 text-blue-800">{story.currentRole}</Badge>
                </div>
              ))
            ) : (
              // Fallback success stories
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-bold text-gray-900 mb-2">Priya from Uttarakhand</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    From a government school to ISRO scientist. "The career guidance helped me see beyond my village."
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">ISRO Scientist</Badge>
                </div>
                
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="text-3xl mb-3">👩‍⚕️</div>
                  <h4 className="font-bold text-gray-900 mb-2">Rahul from Himachal</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    "I never knew I could become a doctor. The Holland test showed me my potential."
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800">AIIMS Doctor</Badge>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-3">🤖</div>
                  <h4 className="font-bold text-gray-900 mb-2">Anita from Rajasthan</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    "Rural background became my strength in AI research. Mentorship changed everything."
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">AI Researcher</Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
