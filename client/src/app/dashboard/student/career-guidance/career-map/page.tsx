'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Target,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowDown,
  ArrowRight,
  Calendar,
  Brain,
  Rocket,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Add proper type definitions
type StageStatus = 'completed' | 'current' | 'upcoming';

interface UserProgress {
  currentStage: number;
  completedStages: number[];
  careerPathway: string;
}

// This would come from API: GET /api/career-pathways
interface CareerPathway {
  id: string;
  careerTitle: string;
  category: string;
  estimatedDuration: string;
  difficultyLevel: string;
  stages: PathwayStage[];
  alternativeRoutes: AlternativeRoute[];
  localOpportunities: LocalOpportunity[];
  milestones: Milestone[];
}

interface PathwayStage {
  id: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
  keySubjects: string[];
  examinations: string[];
  skillsToGain: string[];
  nextOptions: string[];
}

interface AlternativeRoute {
  id: string;
  routeName: string;
  description: string;
  duration: string;
  advantages: string[];
  challenges: string[];
}

interface LocalOpportunity {
  type: string;
  institution: string;
  location: string;
  programs: string[];
  admissionCriteria: string;
}

interface Milestone {
  stage: string;
  achievement: string;
  timeframe: string;
  importance: string;
}

// Mock data - would come from API endpoints
const careerPathways: CareerPathway[] = [
  {
    id: 'astronaut',
    careerTitle: 'Astronaut',
    category: 'Space & Exploration',
    estimatedDuration: '12-15 years',
    difficultyLevel: 'Extremely Challenging',
    stages: [
      {
        id: 'stage1',
        title: '10th-12th Grade Foundation',
        duration: '2 years',
        description: 'Build strong foundation in Physics, Chemistry, and Mathematics',
        requirements: ['Complete 10th with 80%+ marks', 'Choose Science stream with PCM'],
        keySubjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
        examinations: ['12th Board Exams', 'JEE Main preparation'],
        skillsToGain: ['Analytical thinking', 'Problem-solving', 'Mathematical skills'],
        nextOptions: ['Engineering entrance preparation', 'Direct admission to engineering colleges']
      },
      {
        id: 'stage2', 
        title: 'Engineering Degree',
        duration: '4 years',
        description: 'Pursue Aerospace Engineering or related engineering field',
        requirements: ['12th pass with 75%+ in PCM', 'Clear JEE/NEET for top colleges'],
        keySubjects: ['Aerospace Engineering', 'Mechanical Engineering', 'Electronics'],
        examinations: ['JEE Main', 'JEE Advanced', 'University entrance exams'],
        skillsToGain: ['Engineering fundamentals', 'Technical design', 'Project management'],
        nextOptions: ['Masters degree', 'Job in aerospace industry', 'Research programs']
      },
      {
        id: 'stage3',
        title: 'Pilot Training / Advanced Studies',
        duration: '3-5 years', 
        description: 'Become a test pilot through Air Force or pursue advanced aerospace studies',
        requirements: ['Engineering degree', 'Physical fitness standards', 'Clear defense exams'],
        keySubjects: ['Flight operations', 'Aircraft systems', 'Aerodynamics'],
        examinations: ['AFCAT', 'NDA', 'CDS'],
        skillsToGain: ['Pilot skills', 'Leadership', 'Decision-making under pressure'],
        nextOptions: ['Test pilot career', 'Air Force service', 'Commercial aviation']
      },
      {
        id: 'stage4',
        title: 'Astronaut Selection & Training',
        duration: '2-3 years',
        description: 'Apply to ISRO Human Spaceflight Program and complete astronaut training',
        requirements: ['Test pilot experience', 'Excellent physical/mental health', 'Leadership experience'],
        keySubjects: ['Space systems', 'Life support', 'Mission operations'],
        examinations: ['ISRO astronaut selection', 'Medical tests', 'Psychological evaluation'],
        skillsToGain: ['Space operations', 'Emergency procedures', 'Team coordination'],
        nextOptions: ['Space missions', 'Ground support', 'Training other astronauts']
      }
    ],
    alternativeRoutes: [
      {
        id: 'route1',
        routeName: 'NASA Route (Study Abroad)',
        description: 'Pursue higher education in USA and apply to NASA programs',
        duration: '15-20 years',
        advantages: ['Access to NASA programs', 'Advanced space technology', 'International experience'],
        challenges: ['Very expensive', 'Complex visa process', 'Extremely competitive']
      },
      {
        id: 'route2',
        routeName: 'Scientist-Astronaut Route',
        description: 'Focus on space science research and apply as mission specialist',
        duration: '10-12 years',
        advantages: ['Strong scientific background', 'Research experience', 'Multiple career options'],
        challenges: ['Requires PhD', 'Limited mission opportunities', 'Long research periods']
      }
    ],
    localOpportunities: [
      {
        type: 'Engineering Colleges',
        institution: 'IIT Roorkee',
        location: 'Roorkee, Uttarakhand',
        programs: ['Aerospace Engineering', 'Mechanical Engineering'],
        admissionCriteria: 'JEE Advanced qualification'
      },
      {
        type: 'Defense Training',
        institution: 'Indian Military Academy',
        location: 'Dehradun, Uttarakhand',
        programs: ['Officer Training', 'Leadership Development'],
        admissionCriteria: 'CDS examination'
      }
    ],
    milestones: [
      { stage: '12th Grade', achievement: 'Science stream completion with 80%+', timeframe: 'Age 17-18', importance: 'Foundation for engineering entrance' },
      { stage: 'Engineering', achievement: 'B.Tech degree from recognized college', timeframe: 'Age 21-22', importance: 'Technical qualification requirement' },
      { stage: 'Pilot Training', achievement: 'Test pilot certification', timeframe: 'Age 25-28', importance: 'Essential for astronaut selection' },
      { stage: 'Space Program', achievement: 'ISRO astronaut selection', timeframe: 'Age 30-35', importance: 'Achievement of dream career' }
    ]
  },
  {
    id: 'doctor',
    careerTitle: 'Doctor',
    category: 'Healthcare & Medicine',
    estimatedDuration: '11-15 years',
    difficultyLevel: 'Very Challenging',
    stages: [
      {
        id: 'stage1',
        title: '10th-12th Grade Foundation',
        duration: '2 years',
        description: 'Focus on Biology, Chemistry, and Physics for medical entrance',
        requirements: ['Complete 10th with 85%+ marks', 'Choose Science with PCB/PCMB'],
        keySubjects: ['Biology', 'Chemistry', 'Physics', 'English'],
        examinations: ['12th Board Exams', 'NEET preparation'],
        skillsToGain: ['Scientific thinking', 'Memorization techniques', 'Time management'],
        nextOptions: ['NEET preparation', 'Medical college applications', 'Alternative courses']
      },
      {
        id: 'stage2',
        title: 'MBBS Degree',
        duration: '5.5 years',
        description: 'Complete Bachelor of Medicine and Bachelor of Surgery',
        requirements: ['NEET qualification', 'Medical college admission', 'Good academic performance'],
        keySubjects: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Clinical Medicine'],
        examinations: ['University exams', 'MBBS final exams', 'Internship evaluations'],
        skillsToGain: ['Medical knowledge', 'Patient care', 'Diagnostic skills', 'Communication'],
        nextOptions: ['General practice', 'Specialization', 'Research', 'Public health']
      },
      {
        id: 'stage3',
        title: 'Internship & Practice',
        duration: '1-2 years',
        description: 'Gain practical experience in hospitals and clinics',
        requirements: ['MBBS completion', 'Medical registration', 'Hospital posting'],
        keySubjects: ['Clinical practice', 'Emergency medicine', 'Patient management'],
        examinations: ['Medical licensing exams', 'Specialization entrance (if pursuing)'],
        skillsToGain: ['Practical experience', 'Emergency handling', 'Team work'],
        nextOptions: ['Independent practice', 'Hospital job', 'Specialization courses']
      }
    ],
    alternativeRoutes: [
      {
        id: 'route1',
        routeName: 'AIIMS Route',
        description: 'Target top medical colleges like AIIMS for best opportunities',
        duration: '11-13 years',
        advantages: ['Best medical education', 'Research opportunities', 'Prestigious career'],
        challenges: ['Extremely competitive', 'High study pressure', 'Limited seats']
      },
      {
        id: 'route2',
        routeName: 'Alternative Medicine Route',
        description: 'Pursue AYUSH courses (Ayurveda, Homeopathy, Unani)',
        duration: '8-10 years',
        advantages: ['Lower competition', 'Growing demand', 'Holistic approach'],
        challenges: ['Limited modern medicine scope', 'Social perception', 'Lower initial income']
      }
    ],
    localOpportunities: [
      {
        type: 'Medical Colleges',
        institution: 'AIIMS Rishikesh',
        location: 'Rishikesh, Uttarakhand',
        programs: ['MBBS', 'Nursing', 'Allied Health Sciences'],
        admissionCriteria: 'NEET qualification with top ranks'
      },
      {
        type: 'Government Medical College',
        institution: 'Government Medical College, Haldwani',
        location: 'Haldwani, Uttarakhand',
        programs: ['MBBS', 'Post-graduate specializations'],
        admissionCriteria: 'NEET with state quota consideration'
      }
    ],
    milestones: [
      { stage: '12th Grade', achievement: 'PCB completion with 90%+', timeframe: 'Age 17-18', importance: 'NEET eligibility requirement' },
      { stage: 'NEET', achievement: 'Medical entrance qualification', timeframe: 'Age 18-19', importance: 'Gateway to medical colleges' },
      { stage: 'MBBS', achievement: 'Medical degree completion', timeframe: 'Age 24-25', importance: 'Licensed to practice medicine' },
      { stage: 'Specialization', achievement: 'Post-graduate medical degree', timeframe: 'Age 27-30', importance: 'Advanced medical expertise' }
    ]
  }
];

export default function CareerMap() {
  const { user } = useAuth();
  const [selectedPathway, setSelectedPathway] = useState<string>('astronaut');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentStage: 0, // 10th grade student
    completedStages: [], // No stages completed yet
    careerPathway: 'astronaut'
  });

  const pathway = careerPathways.find(p => p.id === selectedPathway);

  // Fixed function with proper type handling
  const getStageStatus = (stageIndex: number): StageStatus => {
    if (userProgress.completedStages.includes(stageIndex)) return 'completed';
    if (stageIndex === userProgress.currentStage) return 'current';
    return 'upcoming';
  };

  const getStageStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500'; 
      case 'upcoming': return 'bg-gray-400';
    }
  };

  const getStageIcon = (status: StageStatus, index: number) => {
    if (status === 'completed') return <CheckCircle className="h-6 w-6" />;
    return <span className="text-white font-bold">{index + 1}</span>;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Extremely Challenging': return 'bg-red-100 text-red-800';
      case 'Very Challenging': return 'bg-orange-100 text-orange-800';
      case 'Challenging': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Space & Exploration': return <Rocket className="h-5 w-5" />;
      case 'Healthcare & Medicine': return <Heart className="h-5 w-5" />;
      case 'Technology & Innovation': return <Brain className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  if (!pathway) return null;

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
                Step-by-step roadmap from 10th grade to your dream career
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
                onClick={() => setSelectedPathway(career.id)}
                className="flex items-center space-x-2"
              >
                {getCategoryIcon(career.category)}
                <span>{career.careerTitle}</span>
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
                        onClick={() => setActiveStage(index)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              getStageStatusColor(status)
                            }`}>
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
          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-gold-600" />
                <span>Key Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pathway.milestones.map((milestone, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-semibold text-gray-800">{milestone.stage}</div>
                    <div className="text-sm text-gray-600">{milestone.achievement}</div>
                    <div className="text-xs text-blue-600">{milestone.timeframe}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                {pathway.localOpportunities.map((opportunity, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3">
                    <div className="font-semibold text-green-800">{opportunity.institution}</div>
                    <div className="text-sm text-green-600">{opportunity.location}</div>
                    <div className="text-xs text-gray-600 mt-1">{opportunity.programs.join(', ')}</div>
                    <div className="text-xs text-blue-600 mt-1">{opportunity.admissionCriteria}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Routes */}
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
