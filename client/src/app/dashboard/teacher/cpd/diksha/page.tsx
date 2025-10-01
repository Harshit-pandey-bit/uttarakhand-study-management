'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
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
  Map,
  Languages,
  UserCheck,
  Share2,
  BarChart3,
  Target,
  Filter
} from 'lucide-react';

// DIKSHA Course Types
interface DIKSHACourse {
  id: string;
  title: string;
  description: string;
  category: 'nishtha' | 'cpd' | 'subject-specific' | 'leadership' | 'technology';
  duration: number;
  modules: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string[];
  instructor: string;
  organization: string;
  rating: number;
  enrolled: number;
  completed: boolean;
  progress: number;
  certificate: boolean;
  thumbnail: string;
  tags: string[];
  launchDate: string;
  endDate?: string;
}

interface DIKSHAStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
  certificatesEarned: number;
  currentStreak: number;
}

// Sample DIKSHA data
const dikshaStats: DIKSHAStats = {
  totalCourses: 15,
  completedCourses: 8,
  inProgressCourses: 3,
  totalHours: 127,
  certificatesEarned: 8,
  currentStreak: 12
};

const dikshaCourses: DIKSHACourse[] = [
  {
    id: '1',
    title: 'Teaching Strategies for Mathematics',
    description: 'Comprehensive course on effective mathematics teaching methodologies and student engagement techniques.',
    category: 'subject-specific',
    duration: 40,
    modules: 8,
    difficulty: 'intermediate',
    language: ['English', 'Hindi'],
    instructor: 'Dr. Rajesh Kumar',
    organization: 'NCERT',
    rating: 4.7,
    enrolled: 12450,
    completed: true,
    progress: 100,
    certificate: true,
    thumbnail: '/courses/math-strategies.jpg',
    tags: ['Mathematics', 'Pedagogy', 'Student Engagement'],
    launchDate: '2025-01-15'
  },
  {
    id: '2',
    title: 'Digital Tools for Classroom Management',
    description: 'Learn to integrate digital tools effectively in classroom management and teaching processes.',
    category: 'technology',
    duration: 25,
    modules: 5,
    difficulty: 'beginner',
    language: ['English', 'Hindi', 'Regional'],
    instructor: 'Prof. Anita Sharma',
    organization: 'CIET-NCERT',
    rating: 4.5,
    enrolled: 8760,
    completed: false,
    progress: 60,
    certificate: true,
    thumbnail: '/courses/digital-tools.jpg',
    tags: ['Technology', 'Digital Learning', 'Classroom Management'],
    launchDate: '2025-02-10'
  },
  {
    id: '3',
    title: 'NISHTHA - Foundational Literacy and Numeracy',
    description: 'Essential training for implementing FLN guidelines and improving basic learning outcomes.',
    category: 'nishtha',
    duration: 50,
    modules: 10,
    difficulty: 'intermediate',
    language: ['English', 'Hindi'],
    instructor: 'Ministry of Education Team',
    organization: 'NCERT',
    rating: 4.8,
    enrolled: 45000,
    completed: true,
    progress: 100,
    certificate: true,
    thumbnail: '/courses/fln.jpg',
    tags: ['FLN', 'NISHTHA', 'Primary Education'],
    launchDate: '2025-01-01'
  },
  {
    id: '4',
    title: 'Inclusive Education Practices',
    description: 'Strategies for creating inclusive classrooms and supporting diverse learners.',
    category: 'cpd',
    duration: 30,
    modules: 6,
    difficulty: 'intermediate',
    language: ['English', 'Hindi'],
    instructor: 'Dr. Priya Verma',
    organization: 'NIEPA',
    rating: 4.6,
    enrolled: 6540,
    completed: false,
    progress: 25,
    certificate: true,
    thumbnail: '/courses/inclusive.jpg',
    tags: ['Inclusion', 'Special Needs', 'Equity'],
    launchDate: '2025-02-20'
  },
  {
    id: '5',
    title: 'School Leadership and Management',
    description: 'Advanced training for school principals and leaders on effective school management.',
    category: 'leadership',
    duration: 60,
    modules: 12,
    difficulty: 'advanced',
    language: ['English', 'Hindi'],
    instructor: 'Dr. Vikram Gupta',
    organization: 'NIEPA',
    rating: 4.9,
    enrolled: 3200,
    completed: false,
    progress: 0,
    certificate: true,
    thumbnail: '/courses/leadership.jpg',
    tags: ['Leadership', 'Management', 'Administration'],
    launchDate: '2025-03-01'
  },
  {
    id: '6',
    title: 'Assessment and Evaluation Techniques',
    description: 'Modern assessment methods and evaluation strategies for better learning outcomes.',
    category: 'cpd',
    duration: 35,
    modules: 7,
    difficulty: 'intermediate',
    language: ['English', 'Hindi'],
    instructor: 'Dr. Sunita Patel',
    organization: 'CBSE',
    rating: 4.4,
    enrolled: 9800,
    completed: true,
    progress: 100,
    certificate: true,
    thumbnail: '/courses/assessment.jpg',
    tags: ['Assessment', 'Evaluation', 'Learning Outcomes'],
    launchDate: '2025-01-20'
  }
];

// Course Card Component
interface CourseCardProps {
  course: DIKSHACourse;
  onEnroll: (course: DIKSHACourse) => void;
  onContinue: (course: DIKSHACourse) => void;
  onView: (course: DIKSHACourse) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onContinue, onView }) => {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'nishtha': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cpd': return 'bg-green-100 text-green-700 border-green-200';
      case 'subject-specific': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'leadership': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'technology': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="border-indigo-100 hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            {course.completed && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <CheckCircle2 className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{course.instructor} • {course.organization}</p>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getCategoryStyle(course.category)}`}>
                {formatCategory(course.category)}
              </Badge>
              <Badge className={`text-xs ${getDifficultyStyle(course.difficulty)}`}>
                {course.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{course.duration} hours</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{course.enrolled.toLocaleString()} enrolled</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 mr-2 text-indigo-400" />
            <span>{course.modules} modules</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Progress Bar for Enrolled Courses */}
        {course.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Languages */}
        <div className="flex flex-wrap gap-1">
          {course.language.slice(0, 3).map((lang, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
          {course.language.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{course.language.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {course.progress === 0 ? (
            <Button 
              size="sm" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onEnroll(course)}
            >
              <Play className="h-4 w-4 mr-1" />
              Enroll Now
            </Button>
          ) : course.completed ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => onView(course)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              View Certificate
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onContinue(course)}
            >
              <Play className="h-4 w-4 mr-1" />
              Continue Learning
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={() => onView(course)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Certificate Badge */}
        {course.certificate && (
          <div className="flex items-center justify-center text-xs text-indigo-600 bg-indigo-50 rounded-lg py-2">
            <Award className="h-3 w-3 mr-1" />
            Certificate Available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main DIKSHA Page Component
export default function DIKSHAPage() {
  const [courses] = useState<DIKSHACourse[]>(dikshaCourses);
  const [filteredCourses, setFilteredCourses] = useState<DIKSHACourse[]>(dikshaCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter courses
  React.useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(course => course.difficulty === difficultyFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'completed') {
        filtered = filtered.filter(course => course.completed);
      } else if (statusFilter === 'in-progress') {
        filtered = filtered.filter(course => course.progress > 0 && !course.completed);
      } else if (statusFilter === 'not-started') {
        filtered = filtered.filter(course => course.progress === 0);
      }
    }

    setFilteredCourses(filtered);
  }, [searchTerm, categoryFilter, difficultyFilter, statusFilter, courses]);

  // Handler Functions
  const handleEnroll = (course: DIKSHACourse) => {
    console.log('Enrolling in course:', course.title);
    
    if (confirm(`Enroll in "${course.title}"?\n\nDuration: ${course.duration} hours\nInstructor: ${course.instructor}`)) {
      alert('Successfully enrolled! You can now start the course.');
    }
  };

  const handleContinue = (course: DIKSHACourse) => {
    console.log('Continuing course:', course.title);
    alert(`Continuing "${course.title}" from ${course.progress}% completion`);
  };

  const handleView = (course: DIKSHACourse) => {
    console.log('Viewing course:', course.title);
    
    if (course.completed && course.certificate) {
      alert(`Certificate for "${course.title}" is ready for download!`);
      handleDownloadCertificate(course);
    } else {
      alert(`Course Details:\n\n${course.title}\n${course.description}\n\nRating: ${course.rating}/5\nEnrolled: ${course.enrolled.toLocaleString()}\nDuration: ${course.duration} hours`);
    }
  };

  const handleDownloadCertificate = (course: DIKSHACourse) => {
    console.log('Downloading certificate for:', course.title);
    alert('Certificate download started!');
  };

  const handleDownloadApp = () => {
    console.log('Downloading DIKSHA app');
    
    if (confirm('Download DIKSHA mobile app?')) {
      const userAgent = navigator.userAgent;
      if (/android/i.test(userAgent)) {
        window.open('https://play.google.com/store/apps/details?id=in.gov.diksha.app', '_blank');
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        window.open('https://apps.apple.com/app/diksha/id1315319398', '_blank');
      } else {
        window.open('https://diksha.gov.in/app-download', '_blank');
      }
    }
  };

  const handleVisitPortal = () => {
    console.log('Visiting DIKSHA portal');
    window.open('https://diksha.gov.in', '_blank');
  };

  const handleQuickAction = (type: string) => {
    switch (type) {
      case 'nishtha':
        setCategoryFilter('nishtha');
        break;
      case 'cpd':
        setCategoryFilter('cpd');
        break;
      case 'subject-specific':
        setCategoryFilter('subject-specific');
        break;
      case 'leadership':
        setCategoryFilter('leadership');
        break;
    }
  };

  const classPerformanceAvg = Math.round(
    courses.reduce((acc, course) => acc + course.rating * 20, 0) / courses.length
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            DIKSHA Professional Development
          </h1>
          <p className="text-gray-600 mt-2">
            Access comprehensive training courses and professional development resources
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-3">
          {/* <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={handleDownloadApp}>
            <Download className="h-4 w-4 mr-2" />
            Download App
          </Button> */}
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleVisitPortal}>
            <Globe className="h-4 w-4 mr-2" />
            Visit DIKSHA Portal
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="lg:col-span-2 border-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Learning Hours</p>
                <p className="text-3xl font-bold text-indigo-600">{dikshaStats.totalHours}</p>
                <p className="text-xs text-gray-500 mt-1">Across all courses</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{dikshaStats.completedCourses}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{dikshaStats.inProgressCourses}</div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{dikshaStats.certificatesEarned}</div>
            <div className="text-sm text-gray-600 mt-1">Certificates</div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{dikshaStats.currentStreak}</div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('nishtha')}>
          <CardContent className="p-4 text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-700 mb-1">NISHTHA Courses</h3>
            <p className="text-xs text-gray-600">Foundational training programs</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('cpd')}>
          <CardContent className="p-4 text-center">
            <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-700 mb-1">CPD Programs</h3>
            <p className="text-xs text-gray-600">Continuous professional development</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('subject-specific')}>
          <CardContent className="p-4 text-center">
            <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-purple-700 mb-1">Subject Specific</h3>
            <p className="text-xs text-gray-600">Specialized subject training</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('leadership')}>
          <CardContent className="p-4 text-center">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-700 mb-1">Leadership</h3>
            <p className="text-xs text-gray-600">School leadership development</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-indigo-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900">Find Courses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-indigo-200 focus:border-indigo-400"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="nishtha">NISHTHA</SelectItem>
                <SelectItem value="cpd">CPD Programs</SelectItem>
                <SelectItem value="subject-specific">Subject Specific</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Courses ({filteredCourses.length})
          </h2>
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                onContinue={handleContinue}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or explore different categories
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Resources Section */}
      <Card className="border-indigo-100">
        <CardHeader>
          <h3 className="text-lg font-semibold">Additional Learning Resources</h3>
          <p className="text-sm text-gray-600">Explore more resources to enhance your professional development</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <Video className="h-8 w-8 text-indigo-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Video Lectures</h4>
                  <p className="text-xs text-gray-600">Interactive video content</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => alert('Opening video library...')}>
                Browse Videos
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Reading Materials</h4>
                  <p className="text-xs text-gray-600">Comprehensive study guides</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => alert('Downloading study materials...')}>
                Download PDFs
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Community Forum</h4>
                  <p className="text-xs text-gray-600">Connect with educators</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => alert('Opening community forum...')}>
                Join Discussion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
