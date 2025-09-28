'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Dream careers data based on specifications [file:1]
const dreamCareers = [
  {
    id: 'astronaut',
    title: 'Astronaut',
    emoji: '🚀',
    description: 'Explore the mysteries of space, conduct groundbreaking research, and push the boundaries of human exploration',
    category: 'Space & Exploration',
    salaryRange: '₹15-50 Lakhs/year',
    demandLevel: 'Growing',
    realityCheck: {
      pros: ['Travel to space', 'Cutting-edge research', 'Global recognition', 'Making history'],
      cons: ['Intense training (5+ years)', 'Physical demands', 'Limited positions', 'High risk'],
      workEnvironment: 'Space stations, research facilities, training centers',
      typicalDay: 'Physical training, mission planning, scientific experiments, public outreach'
    },
    successStories: [
      {
        name: 'Rakesh Sharma',
        background: 'Air Force pilot from Punjab',
        journey: 'Indian Air Force → Test Pilot → Cosmonaut → First Indian in Space (1984)',
        inspiration: '"The Earth looked so beautiful from space - no borders, just one blue planet."',
        currentRole: 'Aerospace consultant and inspirational speaker'
      },
      {
        name: 'Kalpana Chawla',
        background: 'Small town girl from Karnal, Haryana',
        journey: 'Engineering → USA → NASA → Space Shuttle Mission Specialist',
        inspiration: '"The path from dreams to success does exist. May you have the vision to find it."',
        currentRole: 'Forever remembered as a pioneer who opened doors for Indian women in space'
      }
    ],
    dayInLife: {
      morning: 'Physical fitness training and medical checks',
      afternoon: 'Mission simulation and technical studies',
      evening: 'Scientific research and public education',
      challenges: 'Zero gravity training, isolation exercises, emergency procedures'
    },
    pathways: [
      {
        route: 'Indian Air Force Route',
        steps: ['Physics/Math focus in 12th', 'Engineering (Aerospace preferred)', 'Join Indian Air Force', 'Become test pilot', 'Apply to ISRO Human Spaceflight Program'],
        duration: '10-15 years',
        difficulty: 'Extremely Hard'
      },
      {
        route: 'NASA Route', 
        steps: ['Excel in Science/Engineering', 'Study abroad (USA)', 'PhD in relevant field', 'Apply to NASA Astronaut Program', 'Complete training'],
        duration: '12-18 years',
        difficulty: 'Extremely Hard'
      }
    ],
    localConnection: 'ISRO is actively working on Gaganyaan mission - India will send its own astronauts to space soon!',
    nextSteps: ['Focus on Physics and Mathematics', 'Stay physically fit', 'Learn about space missions', 'Connect with ISRO scientists']
  },
  {
    id: 'doctor',
    title: 'Doctor',
    emoji: '👩‍⚕️',
    description: 'Save lives, heal people, and make a direct positive impact on human health and wellbeing every single day',
    category: 'Healthcare & Medicine',
    salaryRange: '₹8-100+ Lakhs/year',
    demandLevel: 'Very High',
    realityCheck: {
      pros: ['Save lives daily', 'Respected profession', 'Good income', 'Job security'],
      cons: ['Long study period (10+ years)', 'High stress', 'Irregular hours', 'Emotional challenges'],
      workEnvironment: 'Hospitals, clinics, emergency rooms, operation theaters',
      typicalDay: 'Patient consultations, surgeries, medical rounds, case studies'
    },
    successStories: [
      {
        name: 'Dr. Devi Shetty',
        background: 'Son of a teacher from Karnataka village',
        journey: 'Government school → Medical college → Heart surgeon → Narayana Health founder',
        inspiration: '"Healthcare should be affordable and accessible to all, regardless of economic status."',
        currentRole: 'Pioneering affordable heart surgery for rural India'
      },
      {
        name: 'Dr. APJ Abdul Kalam',
        background: 'Fisherman\'s son from Tamil Nadu',
        journey: 'Science student → Aerospace engineer → Scientist → President of India',
        inspiration: '"Dream is not that which you see while sleeping, it is something that does not let you sleep."',
        currentRole: 'Forever remembered as the People\'s President and Missile Man of India'
      }
    ],
    dayInLife: {
      morning: 'Morning rounds, patient check-ups, emergency cases',
      afternoon: 'Surgeries, consultations, diagnostic reviews',
      evening: 'Medical research, case documentation, family consultations',
      challenges: 'Life-or-death decisions, emotional situations, continuous learning'
    },
    pathways: [
      {
        route: 'NEET Route',
        steps: ['Biology, Physics, Chemistry in 12th', 'Crack NEET exam', 'MBBS (5.5 years)', 'Internship', 'Specialization (optional)'],
        duration: '6-12 years',
        difficulty: 'Hard'
      },
      {
        route: 'AIIMS Route',
        steps: ['Top NEET score', 'AIIMS admission', 'Excellence in studies', 'Research opportunities', 'International exposure'],
        duration: '6-10 years', 
        difficulty: 'Extremely Hard'
      }
    ],
    localConnection: 'India needs 2.3 million more doctors - massive opportunities in both cities and villages!',
    nextSteps: ['Focus on Biology and Chemistry', 'Start NEET preparation', 'Volunteer at local health centers', 'Meet practicing doctors']
  },
  {
    id: 'ai-researcher',
    title: 'AI Researcher',
    emoji: '🤖',
    description: 'Create intelligent machines that can think, learn, and solve complex problems to make life better for everyone',
    category: 'Technology & Innovation',
    salaryRange: '₹15-200+ Lakhs/year',
    demandLevel: 'Extremely High',
    realityCheck: {
      pros: ['Cutting-edge technology', 'High salaries', 'Global opportunities', 'Shape the future'],
      cons: ['Continuous learning required', 'High competition', 'Abstract thinking needed', 'Rapid field changes'],
      workEnvironment: 'Tech companies, research labs, universities, startups',
      typicalDay: 'Coding algorithms, data analysis, research papers, team meetings'
    },
    successStories: [
      {
        name: 'Radhika Nagpal',
        background: 'Indian origin researcher at Harvard',
        journey: 'Engineering in India → PhD in USA → Harvard Professor → Robotics pioneer',
        inspiration: '"I want to build robots that work together like ants to solve big problems."',
        currentRole: 'Leading swarm robotics research and inspiring young scientists'
      },
      {
        name: 'Satya Nadella',
        background: 'Middle-class family from Hyderabad',
        journey: 'Engineering in India → Microsoft → AI leadership → CEO Microsoft',
        inspiration: '"AI will amplify human ingenuity and help us achieve more."',
        currentRole: 'CEO of Microsoft, driving AI revolution globally'
      }
    ],
    dayInLife: {
      morning: 'Code reviews, algorithm development, data preprocessing',
      afternoon: 'Model training, research meetings, paper writing',
      evening: 'Reading latest research, online courses, side projects',
      challenges: 'Complex mathematics, debugging AI models, staying updated'
    },
    pathways: [
      {
        route: 'Computer Science Route',
        steps: ['Math and Computer Science in 12th', 'B.Tech Computer Science', 'Specialize in AI/ML', 'Masters/PhD', 'Industry/Research role'],
        duration: '6-10 years',
        difficulty: 'Hard'
      },
      {
        route: 'IIT Route',
        steps: ['JEE preparation', 'IIT Computer Science', 'AI specialization', 'Internships at big tech', 'Top company placement'],
        duration: '4-6 years',
        difficulty: 'Extremely Hard'
      }
    ],
    localConnection: 'AI jobs in India growing by 60% annually - companies like Google, Microsoft, Amazon hiring heavily!',
    nextSteps: ['Learn programming (Python)', 'Strong math foundation', 'Online AI courses', 'Build small projects']
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    emoji: '🌱',
    description: 'Protect our planet, solve climate challenges, and ensure a sustainable future for all living beings',
    category: 'Environment & Sustainability',
    salaryRange: '₹5-40 Lakhs/year',
    demandLevel: 'Growing Fast',
    realityCheck: {
      pros: ['Save the planet', 'Meaningful work', 'Field work variety', 'Growing importance'],
      cons: ['Lower initial pay', 'Fieldwork challenges', 'Policy frustrations', 'Long-term impact'],
      workEnvironment: 'Field sites, laboratories, government offices, NGOs',
      typicalDay: 'Field data collection, sample analysis, report writing, policy meetings'
    },
    successStories: [
      {
        name: 'Vandana Shiva',
        background: 'Daughter of forest conservator from Uttarakhand',
        journey: 'Physics PhD → Environmental activism → Global recognition → Seed preservation',
        inspiration: '"We are either going to have a future where women lead the way to make peace with the Earth or we are not going to have a human future at all."',
        currentRole: 'World-renowned environmental activist and author'
      },
      {
        name: 'Sunita Narain',
        background: 'Middle-class Delhi family',
        journey: 'Environmental studies → Centre for Science and Environment → Policy influence → Climate leadership',
        inspiration: '"We have to find a different model of growth, one that respects planetary boundaries."',
        currentRole: 'Leading India\'s environmental policy and climate action'
      }
    ],
    dayInLife: {
      morning: 'Field surveys, sample collection, wildlife monitoring',
      afternoon: 'Lab analysis, data interpretation, report preparation',
      evening: 'Community meetings, policy discussions, awareness programs',
      challenges: 'Remote fieldwork, complex data analysis, convincing stakeholders'
    },
    pathways: [
      {
        route: 'Environmental Science Route',
        steps: ['Science stream in 12th', 'B.Sc Environmental Science', 'Field experience', 'M.Sc specialization', 'Government/NGO role'],
        duration: '5-7 years',
        difficulty: 'Medium'
      },
      {
        route: 'Forest Service Route',
        steps: ['Science graduation', 'Clear UPSC Forest Service', 'Training period', 'Field posting', 'Conservation leadership'],
        duration: '4-6 years',
        difficulty: 'Hard'
      }
    ],
    localConnection: 'Uttarakhand needs environmental experts for climate change, forest conservation, and sustainable development!',
    nextSteps: ['Nature observation skills', 'Environmental science focus', 'Join local conservation groups', 'Study climate change']
  }
];

const inspirationalQuotes = [
  "Your background doesn't determine your future - your determination does!",
  "Every expert was once a beginner. Every pro was once an amateur.",
  "The only impossible journey is the one you never begin.",
  "Dreams don't work unless you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

export default function DreamExplorer() {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedCareerData = dreamCareers.find(career => career.id === selectedCareer);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Space & Exploration': return <Rocket className="h-5 w-5" />;
      case 'Healthcare & Medicine': return <Heart className="h-5 w-5" />;
      case 'Technology & Innovation': return <Brain className="h-5 w-5" />;
      case 'Environment & Sustainability': return <Microscope className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'Extremely High': return 'bg-purple-500';
      case 'Very High': return 'bg-green-500';
      case 'Growing Fast': return 'bg-blue-500';
      case 'Growing': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Extremely Hard': return 'bg-red-100 text-red-800';
      case 'Hard': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (selectedCareer && selectedCareerData) {
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
              <div className="text-6xl">{selectedCareerData.emoji}</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedCareerData.title}</h1>
                <p className="text-purple-100 mb-4">{selectedCareerData.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white">
                    {getCategoryIcon(selectedCareerData.category)}
                    <span className="ml-2">{selectedCareerData.category}</span>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Reality Check</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="dayinlife">Day in Life</TabsTrigger>
            <TabsTrigger value="pathways">How to Get There</TabsTrigger>
          </TabsList>

          {/* Reality Check */}
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
                    {selectedCareerData.realityCheck.pros.map((pro, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">{pro}</span>
                      </li>
                    ))}
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
                    {selectedCareerData.realityCheck.cons.map((con, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-orange-700">{con}</span>
                      </li>
                    ))}
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
                  <p className="text-gray-700">{selectedCareerData.realityCheck.workEnvironment}</p>
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
                  <p className="text-gray-700">{selectedCareerData.realityCheck.typicalDay}</p>
                </CardContent>
              </Card>
            </div>

            {/* Local Connection */}
            <Alert className="bg-blue-50 border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Local Connection:</strong> {selectedCareerData.localConnection}
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="space-y-6">
            {selectedCareerData.successStories.map((story, index) => (
              <Card key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                      <p className="text-gray-600 mb-3">{story.background}</p>
                      
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Journey:</h4>
                        <p className="text-gray-700">{story.journey}</p>
                      </div>

                      <blockquote className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 mb-4">
                        <p className="text-purple-700 italic">"{story.inspiration}"</p>
                      </blockquote>

                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-semibold text-green-800 mb-1">Current Impact:</h4>
                        <p className="text-green-700 text-sm">{story.currentRole}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Day in Life */}
          <TabsContent value="dayinlife" className="space-y-6">
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
          </TabsContent>

          {/* Pathways */}
          <TabsContent value="pathways" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedCareerData.pathways.map((pathway, index) => (
                <Card key={index} className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
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
                      {pathway.steps.map((step, stepIndex) => (
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

            {/* Next Steps */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <ArrowRight className="h-5 w-5" />
                  <span>Your Next Steps (Start Today!)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCareerData.nextSteps.map((step, index) => (
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
              {inspirationalQuotes[currentQuote]}
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
            <div className="text-2xl font-bold text-green-600">500+</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">₹15-200L</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dreamCareers.map((career) => (
            <Card 
              key={career.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
              onClick={() => setSelectedCareer(career.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-5xl">{career.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                      <Badge className={`${getDemandColor(career.demandLevel)} text-white`}>
                        {career.demandLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {getCategoryIcon(career.category)}
                      <span className="text-sm text-gray-600">{career.category}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm font-medium text-green-600">{career.salaryRange}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{career.description}</p>
                    
                    {/* Success Story Preview */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Success Story</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        <strong>{career.successStories[0].name}:</strong> {career.successStories[0].background}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{career.successStories.length} success stories</span>
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
          ))}
        </div>
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
