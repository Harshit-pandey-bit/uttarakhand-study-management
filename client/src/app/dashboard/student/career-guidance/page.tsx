'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Career data based on your specifications [file:1]
const careerExplorationData = {
  featuredCareers: [
    {
      title: 'Astronaut',
      description: 'Explore space, conduct scientific research, and push the boundaries of human exploration',
      icon: '🚀',
      category: 'Science & Technology',
      demandLevel: 'High',
      education: '12th → Engineering/Science → ISRO Selection',
      famousPersons: ['Rakesh Sharma', 'Kalpana Chawla', 'Sunita Williams'],
      pathway: 'Focus on Physics, Math → Aerospace Engineering → Test Pilot Training → Astronaut Program',
      inspiringFact: 'India plans to send its own astronauts to space by 2025!',
      skills: ['Physics', 'Mathematics', 'Physical Fitness', 'Problem Solving']
    },
    {
      title: 'Doctor',
      description: 'Save lives, heal people, and make a direct impact on human health and wellbeing',
      icon: '👩‍⚕️',
      category: 'Healthcare',
      demandLevel: 'Very High',
      education: '12th → NEET → Medical College → Specialization',
      famousPersons: ['Dr. APJ Abdul Kalam', 'Dr. Devi Shetty', 'Dr. Naresh Trehan'],
      pathway: 'Biology, Chemistry focus → NEET preparation → MBBS → Practice or Specialization',
      inspiringFact: 'India needs 2.3 million more doctors - huge opportunity!',
      skills: ['Biology', 'Chemistry', 'Empathy', 'Critical Thinking']
    },
    {
      title: 'AI Researcher',
      description: 'Build intelligent machines that can think, learn, and solve complex problems',
      icon: '🤖',
      category: 'Technology',
      demandLevel: 'Extremely High',
      education: '12th → Engineering/Science → Masters → PhD/Research',
      famousPersons: ['Geoffrey Hinton', 'Yann LeCun', 'Demis Hassabis'],
      pathway: 'Math, Computer Science → Engineering → AI Specialization → Research/Industry',
      inspiringFact: 'AI jobs in India are growing by 60% annually!',
      skills: ['Mathematics', 'Programming', 'Statistics', 'Creativity']
    },
    {
      title: 'Environmental Scientist',
      description: 'Protect our planet, solve climate challenges, and ensure a sustainable future',
      icon: '🌱',
      category: 'Environment',
      demandLevel: 'High',
      education: '12th → Environmental Science/Biology → Research/Field Work',
      famousPersons: ['Vandana Shiva', 'Sunita Narain', 'Raghunath Anant Mashelkar'],
      pathway: 'Science subjects → Environmental Studies → Field Research → Conservation Work',
      inspiringFact: 'Climate action creates 65 million new jobs globally!',
      skills: ['Biology', 'Chemistry', 'Research', 'Communication']
    }
  ],
  hollandCodeResults: {
    hasCompletedTest: false,
    recommendedCareers: [],
    personalityType: null,
    completionDate: null
  },
  progressStats: {
    assessmentCompleted: false,
    careersExplored: 0,
    pathwaysViewed: 0,
    totalProgress: 0
  }
};

const inspirationalQuotes = [
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
];

export default function CareerGuidancePage() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [currentQuote] = useState(0);

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
              {inspirationalQuotes[currentQuote].quote}
            </p>
            <p className="text-purple-200 text-sm mb-6">
              — {inspirationalQuotes[currentQuote].author}
            </p>
            
            {!careerExplorationData.hollandCodeResults.hasCompletedTest && (
              <Link href="/dashboard/student/career-guidance/holland-assessment/take-test">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-6 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Discover Your Perfect Career Match!
                </Button>
              </Link>
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
                  {careerExplorationData.hollandCodeResults.hasCompletedTest ? 'Completed' : 'Pending'}
                </p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            {!careerExplorationData.hollandCodeResults.hasCompletedTest && (
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
                  {careerExplorationData.progressStats.careersExplored}/20
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <Progress 
              value={(careerExplorationData.progressStats.careersExplored / 20) * 100} 
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
                  {careerExplorationData.progressStats.totalProgress}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <Progress 
              value={careerExplorationData.progressStats.totalProgress} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Mentor Sessions</p>
                <p className="text-xl font-bold text-purple-700">3 Booked</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <Link href="/dashboard/student/mentoring/sessions/schedule">
              <Button variant="ghost" size="sm" className="mt-2 text-purple-600 hover:bg-purple-50">
                Book More <ArrowRight className="ml-1 h-3 w-3" />
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
            {careerExplorationData.featuredCareers.map((career, index) => (
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
            ))}
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
                Start Assessment
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
            <Award className="h-6 w-6 text-gold-500" />
            <span>Success Stories from Rural Students</span>
          </CardTitle>
          <CardDescription>
            Students just like you who dared to dream big and achieved amazing things!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
