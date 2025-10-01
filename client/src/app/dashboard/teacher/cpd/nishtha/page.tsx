'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Users, 
  Search, 
  CheckCircle2,
  Star,
  Calendar,
  Download,
  Eye,
  Target,
  TrendingUp,
  Globe,
  Video,
  FileText,
  Brain,
  Shield,
  Heart,
  Palette,
  Monitor,
  Calculator,
  Microscope,
  Languages,
  UserCheck,
  Plus,
  X,
  GripVertical,
  Lightbulb,
  Filter
} from 'lucide-react';

// NISHTHA Types
interface NISTHTHAModule {
  id: string;
  title: string;
  description: string;
  category: 'generic' | 'subject-pedagogy' | 'leadership';
  duration: number;
  level: 'elementary' | 'secondary' | 'fln' | 'ecce';
  language: string[];
  completed: boolean;
  progress: number;
  certificate: boolean;
  activities: number;
  resources: number;
  assessments: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface NISTHTHAProgram {
  id: string;
  name: string;
  version: '1.0' | '2.0' | '3.0' | '4.0';
  description: string;
  level: 'elementary' | 'secondary' | 'fln' | 'ecce';
  totalModules: number;
  completedModules: number;
  totalHours: number;
  completedHours: number;
  participants: number;
  languages: number;
  status: 'active' | 'completed' | 'upcoming';
  launchDate: string;
}

interface NISTHTHAStats {
  totalHours: number;
  completedModules: number;
  certificatesEarned: number;
  currentProgram: string;
  overallProgress: number;
  streak: number;
}

// Sample NISHTHA data
const nishthaStats: NISTHTHAStats = {
  totalHours: 156,
  completedModules: 24,
  certificatesEarned: 12,
  currentProgram: 'NISHTHA 3.0 (FLN)',
  overallProgress: 75,
  streak: 8
};

const nishthaPrograms: NISTHTHAProgram[] = [
  {
    id: '1',
    name: 'NISHTHA 1.0 - Elementary Level',
    version: '1.0',
    description: 'Foundational training for primary and upper-primary teachers (Grades 1-8)',
    level: 'elementary',
    totalModules: 18,
    completedModules: 18,
    totalHours: 72,
    completedHours: 72,
    participants: 2400000,
    languages: 11,
    status: 'completed',
    launchDate: '2019-08-21'
  },
  {
    id: '2',
    name: 'NISHTHA 2.0 - Secondary Level',
    version: '2.0',
    description: 'Advanced training for secondary and senior secondary teachers (Grades 9-12)',
    level: 'secondary',
    totalModules: 13,
    completedModules: 8,
    totalHours: 52,
    completedHours: 32,
    participants: 1000000,
    languages: 10,
    status: 'active',
    launchDate: '2021-07-29'
  },
  {
    id: '3',
    name: 'NISHTHA 3.0 - FLN Mission',
    version: '3.0',
    description: 'Foundational Literacy and Numeracy for Pre-primary to Grade 5 teachers',
    level: 'fln',
    totalModules: 12,
    completedModules: 12,
    totalHours: 48,
    completedHours: 48,
    participants: 2500000,
    languages: 11,
    status: 'completed',
    launchDate: '2021-09-07'
  },
  {
    id: '4',
    name: 'NISHTHA 4.0 - ECCE',
    version: '4.0',
    description: 'Early Childhood Care and Education for Anganwadi and pre-primary teachers',
    level: 'ecce',
    totalModules: 6,
    completedModules: 0,
    totalHours: 24,
    completedHours: 0,
    participants: 500000,
    languages: 2,
    status: 'upcoming',
    launchDate: '2025-01-15'
  }
];

const nishthaModules: NISTHTHAModule[] = [
  {
    id: '1',
    title: 'Learning Outcomes and Curriculum',
    description: 'Understanding learning outcomes and implementing competency-based curriculum',
    category: 'generic',
    duration: 4,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: true,
    progress: 100,
    certificate: true,
    activities: 8,
    resources: 15,
    assessments: 3,
    icon: Target,
    color: 'blue'
  },
  {
    id: '2',
    title: 'Learner-Centered Pedagogy',
    description: 'Implementing student-centered teaching approaches and methodologies',
    category: 'generic',
    duration: 4,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: true,
    progress: 100,
    certificate: true,
    activities: 10,
    resources: 12,
    assessments: 4,
    icon: Users,
    color: 'green'
  },
  {
    id: '3',
    title: 'Inclusive Education',
    description: 'Creating inclusive classrooms for diverse learners and special needs children',
    category: 'generic',
    duration: 4,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: true,
    progress: 100,
    certificate: true,
    activities: 12,
    resources: 18,
    assessments: 3,
    icon: Heart,
    color: 'purple'
  },
  {
    id: '4',
    title: 'ICT in Teaching-Learning',
    description: 'Integrating Information and Communication Technology in education',
    category: 'generic',
    duration: 4,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: false,
    progress: 60,
    certificate: false,
    activities: 15,
    resources: 20,
    assessments: 5,
    icon: Monitor,
    color: 'teal'
  },
  {
    id: '5',
    title: 'Art Integrated Learning',
    description: 'Incorporating arts and creativity in teaching across subjects',
    category: 'generic',
    duration: 4,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: true,
    progress: 100,
    certificate: true,
    activities: 20,
    resources: 25,
    assessments: 4,
    icon: Palette,
    color: 'orange'
  },
  {
    id: '6',
    title: 'School Safety and Security',
    description: 'Creating safe and secure learning environments for children',
    category: 'generic',
    duration: 3,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: true,
    progress: 100,
    certificate: true,
    activities: 8,
    resources: 10,
    assessments: 2,
    icon: Shield,
    color: 'red'
  },
  {
    id: '7',
    title: 'Pedagogy of Mathematics',
    description: 'Effective teaching strategies for mathematics at elementary level',
    category: 'subject-pedagogy',
    duration: 5,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: false,
    progress: 40,
    certificate: false,
    activities: 18,
    resources: 30,
    assessments: 6,
    icon: Calculator,
    color: 'blue'
  },
  {
    id: '8',
    title: 'Pedagogy of Science',
    description: 'Inquiry-based science teaching methods and experimentation',
    category: 'subject-pedagogy',
    duration: 5,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: false,
    progress: 25,
    certificate: false,
    activities: 16,
    resources: 28,
    assessments: 5,
    icon: Microscope,
    color: 'green'
  },
  {
    id: '9',
    title: 'School Leadership',
    description: 'Developing leadership qualities and school management skills',
    category: 'leadership',
    duration: 6,
    level: 'elementary',
    language: ['English', 'Hindi', 'Regional'],
    completed: false,
    progress: 0,
    certificate: false,
    activities: 14,
    resources: 22,
    assessments: 4,
    icon: UserCheck,
    color: 'indigo'
  }
];

// Program Card Component
interface ProgramCardProps {
  program: NISTHTHAProgram;
  onView: (program: NISTHTHAProgram) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onView }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completionRate = Math.round((program.completedModules / program.totalModules) * 100);
  const hourCompletionRate = Math.round((program.completedHours / program.totalHours) * 100);

  return (
    <Card className="border-emerald-100 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                {program.version}
              </Badge>
              <Badge className={getStatusStyle(program.status)}>
                {program.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{program.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{program.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Program Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{program.totalModules} modules</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{program.totalHours} hours</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{(program.participants / 1000000).toFixed(1)}M participants</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Globe className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{program.languages} languages</span>
          </div>
        </div>

        {/* Progress */}
        {program.status !== 'upcoming' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modules Completed</span>
                <span className="font-medium">{program.completedModules}/{program.totalModules}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hours Completed</span>
                <span className="font-medium">{program.completedHours}/{program.totalHours}h</span>
              </div>
              <Progress value={hourCompletionRate} className="h-2" />
            </div>
          </div>
        )}

        {/* Launch Date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Launched: {new Date(program.launchDate).toLocaleDateString()}</span>
        </div>

        {/* Action Button */}
        <Button 
          size="sm" 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={() => onView(program)}
          disabled={program.status === 'upcoming'}
        >
          {program.status === 'upcoming' ? 'Coming Soon' : 'View Modules'}
        </Button>
      </CardContent>
    </Card>
  );
};

// Module Card Component
interface ModuleCardProps {
  module: NISTHTHAModule;
  onStart: (module: NISTHTHAModule) => void;
  onContinue: (module: NISTHTHAModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onStart, onContinue }) => {
  const IconComponent = module.icon;

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'generic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'subject-pedagogy': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'leadership': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="border-emerald-100 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-lg bg-${module.color}-50 flex items-center justify-center`}>
            <IconComponent className={`h-6 w-6 text-${module.color}-500`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getCategoryStyle(module.category)}`}>
                {module.category.replace('-', ' ')}
              </Badge>
              {module.completed && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {module.title}
            </h3>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Module Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">{module.activities}</div>
            <div className="text-gray-500">Activities</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">{module.resources}</div>
            <div className="text-gray-500">Resources</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">{module.assessments}</div>
            <div className="text-gray-500">Tests</div>
          </div>
        </div>

        {/* Duration and Languages */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{module.duration} hours</span>
          </div>
          <div className="flex items-center">
            <Languages className="h-4 w-4 mr-1" />
            <span>{module.language.length} languages</span>
          </div>
        </div>

        {/* Progress */}
        {module.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="h-2" />
          </div>
        )}

        {/* Certificate Badge */}
        {module.certificate && (
          <div className="flex items-center justify-center text-xs text-emerald-600 bg-emerald-50 rounded-lg py-2">
            <Award className="h-3 w-3 mr-1" />
            Certificate Earned
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {module.progress === 0 ? (
            <Button 
              size="sm" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onStart(module)}
            >
              <Play className="h-4 w-4 mr-1" />
              Start Module
            </Button>
          ) : module.completed ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Completed
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onContinue(module)}
            >
              <Play className="h-4 w-4 mr-1" />
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main NISHTHA Page Component
export default function NISTHTHAPage() {
  const [selectedProgram, setSelectedProgram] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter modules based on selected program and filters
  const filteredModules = nishthaModules.filter(module => {
    const matchesProgram = selectedProgram === 'all' || 
      (selectedProgram === '1' && module.level === 'elementary') ||
      (selectedProgram === '2' && module.level === 'secondary') ||
      (selectedProgram === '3' && module.level === 'fln') ||
      (selectedProgram === '4' && module.level === 'ecce');

    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;

    return matchesProgram && matchesSearch && matchesCategory;
  });

  // Handler Functions
  const handleStartModule = (module: NISTHTHAModule) => {
    console.log('Starting module:', module.title);
    
    if (confirm(`Start "${module.title}"?\n\nDuration: ${module.duration} hours\nCategory: ${module.category}`)) {
      alert('Module started! You can now access the learning materials.');
    }
  };

  const handleContinueModule = (module: NISTHTHAModule) => {
    console.log('Continuing module:', module.title);
    alert(`Resuming "${module.title}" from ${module.progress}% completion`);
  };

  const handleViewProgram = (program: NISTHTHAProgram) => {
    console.log('Viewing program:', program.name);
    setSelectedProgram(program.id);
    
    alert(`Viewing "${program.name}"\n\n${program.description}\n\nModules: ${program.totalModules}\nDuration: ${program.totalHours} hours\nParticipants: ${(program.participants / 1000000).toFixed(1)}M`);
  };

  const handleDownloadCertificate = () => {
    console.log('Downloading NISHTHA certificates');
    
    if (confirm('Download all earned NISHTHA certificates?')) {
      alert('Preparing certificate bundle for download...');
      setTimeout(() => {
        alert('Certificates downloaded successfully!');
      }, 2000);
    }
  };

  // FIXED: Changed to proper NISHTHA portal URL
  const handleVisitNISHTHAPortal = () => {
    console.log('Visiting NISHTHA portal');
    
    if (confirm('Visit NISHTHA Training Portal?\n\nThis will open the official NISHTHA training platform on DIKSHA.')) {
      // NISHTHA courses are available on DIKSHA platform
      window.open('https://www.india.gov.in/spotlight/nishtha', '_blank');
    }
  };

  const handleWatchVideos = () => {
    console.log('Opening video lectures');
    alert('Opening NISHTHA video lecture library...');
  };

  const handleDownloadMaterials = () => {
    console.log('Downloading study materials');
    alert('Preparing study materials for download...');
    setTimeout(() => {
      alert('Study materials downloaded successfully!');
    }, 1500);
  };

  const handleViewAllCertificates = () => {
    console.log('Viewing all NISHTHA certificates');
    alert('Opening certificates page filtered for NISHTHA...');
  };

  const handleJoinCommunity = () => {
    console.log('Joining NISHTHA community');
    
    if (confirm('Join the NISHTHA teacher community forum?')) {
      alert('Redirecting to community forum...');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            NISHTHA Training Programs
          </h1>
          <p className="text-gray-600 mt-2">
            National Initiative for School Heads' and Teachers' Holistic Advancement
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleDownloadCertificate}>
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
          {/* FIXED: Changed handler name and button text */}
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleVisitNISHTHAPortal}>
            <Globe className="h-4 w-4 mr-2" />
            NISHTHA Portal
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="lg:col-span-2 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Learning Hours</p>
                <p className="text-3xl font-bold text-emerald-600">{nishthaStats.totalHours}</p>
                <p className="text-xs text-gray-500 mt-1">Across all programs</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{nishthaStats.completedModules}</div>
            <div className="text-sm text-gray-600 mt-1">Modules</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{nishthaStats.certificatesEarned}</div>
            <div className="text-sm text-gray-600 mt-1">Certificates</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{nishthaStats.overallProgress}%</div>
            <div className="text-sm text-gray-600 mt-1">Progress</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{nishthaStats.streak}</div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Program Highlight */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-1">Current Program</h3>
              <p className="text-emerald-700 font-medium">{nishthaStats.currentProgram}</p>
              <p className="text-sm text-emerald-600 mt-2">
                Continue your professional development journey
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-700">{nishthaStats.overallProgress}%</div>
              <div className="text-sm text-emerald-600">Overall Progress</div>
              <Button 
                size="sm" 
                className="mt-2 bg-emerald-600 hover:bg-emerald-700" 
                onClick={() => handleContinueModule(nishthaModules.find(m => m.progress > 0 && !m.completed) || nishthaModules[0])}
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-emerald-50 border border-emerald-200">
          <TabsTrigger 
            value="programs" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Training Programs
          </TabsTrigger>
          <TabsTrigger 
            value="modules" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Learning Modules
          </TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">NISHTHA Training Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nishthaPrograms.map(program => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onView={handleViewProgram}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          {/* Filters */}
          <Card className="border-emerald-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="1">NISHTHA 1.0 - Elementary</SelectItem>
                    <SelectItem value="2">NISHTHA 2.0 - Secondary</SelectItem>
                    <SelectItem value="3">NISHTHA 3.0 - FLN</SelectItem>
                    <SelectItem value="4">NISHTHA 4.0 - ECCE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="generic">Generic Modules</SelectItem>
                    <SelectItem value="subject-pedagogy">Subject Pedagogy</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Modules Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Learning Modules ({filteredModules.length})
              </h2>
            </div>
            
            {filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(module => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onStart={handleStartModule}
                    onContinue={handleContinueModule}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or select a different program
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Resources */}
      <Card className="border-emerald-100">
        <CardHeader>
          <h3 className="text-lg font-semibold">NISHTHA Resources</h3>
          <p className="text-sm text-gray-600">Additional materials to support your learning journey</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <Video className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Video Lectures</h4>
              <p className="text-xs text-gray-600 mb-3">Expert-led training videos</p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleWatchVideos}>
                Watch Now
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Study Materials</h4>
              <p className="text-xs text-gray-600 mb-3">Comprehensive guides & PDFs</p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleDownloadMaterials}>
                Download
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Certificates</h4>
              <p className="text-xs text-gray-600 mb-3">Download earned certificates</p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleViewAllCertificates}>
                View All
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Community</h4>
              <p className="text-xs text-gray-600 mb-3">Connect with fellow teachers</p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleJoinCommunity}>
                Join Discussion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
