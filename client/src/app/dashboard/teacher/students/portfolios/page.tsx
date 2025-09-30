'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  Eye, 
  Download, 
  Share, 
  Edit,
  Plus,
  Star,
  Award,
  Target,
  BookOpen,
  FileText,
  Image,
  Video,
  Link,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  X,
  Upload
} from 'lucide-react';

// Student Portfolio Data Interface
interface StudentPortfolio {
  id: number;
  name: string;
  class: string;
  rollNo: string;
  avatar: string;
  portfolioItems: number;
  lastUpdated: string;
  overallProgress: number;
  subjects: {
    mathematics: number;
    science: number;
    english: number;
    socialScience: number;
    hindi: number;
  };
  achievements: string[];
  projects: PortfolioProject[];
  skills: string[];
  careerGoals: string;
}

interface PortfolioProject {
  id: number;
  title: string;
  subject: string;
  type: 'project' | 'assignment' | 'artwork' | 'presentation' | 'research';
  description: string;
  submittedDate: string;
  grade: string;
  feedback: string;
  attachments: string[];
}

// Comprehensive student portfolio data
const studentPortfolios: StudentPortfolio[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    class: "10th A",
    rollNo: "2024001",
    avatar: "/students/rahul.jpg",
    portfolioItems: 24,
    lastUpdated: "2 days ago",
    overallProgress: 88,
    subjects: {
      mathematics: 92,
      science: 89,
      english: 82,
      socialScience: 85,
      hindi: 88
    },
    achievements: [
      "Math Olympiad - State Level Winner",
      "Science Project - Best Innovation Award",
      "Class Topper - Q1 2025"
    ],
    projects: [
      {
        id: 1,
        title: "Water Conservation System Design",
        subject: "Science",
        type: 'project',
        description: "Designed an automated rainwater harvesting system for school campus",
        submittedDate: "2025-09-20",
        grade: "A+",
        feedback: "Excellent innovative approach with practical implementation potential.",
        attachments: ["design_blueprint.pdf", "presentation.pptx", "demo_video.mp4"]
      },
      {
        id: 2,
        title: "Quadratic Equations in Real Life",
        subject: "Mathematics",
        type: 'research',
        description: "Research paper on applications of quadratic equations in architecture and engineering",
        submittedDate: "2025-09-15",
        grade: "A",
        feedback: "Well-researched with good real-world connections. Excellent mathematical understanding.",
        attachments: ["research_paper.pdf", "graphs.xlsx"]
      }
    ],
    skills: ["Problem Solving", "Critical Thinking", "Mathematical Modeling", "Scientific Research", "Presentation"],
    careerGoals: "Aerospace Engineer"
  },
  {
    id: 2,
    name: "Priya Singh",
    class: "9th B",
    rollNo: "2024002",
    avatar: "/students/priya.jpg",
    portfolioItems: 31,
    lastUpdated: "1 day ago",
    overallProgress: 94,
    subjects: {
      mathematics: 90,
      science: 96,
      english: 91,
      socialScience: 93,
      hindi: 92
    },
    achievements: [
      "Environmental Science Fair - First Prize",
      "Best Student Leader Award",
      "Perfect Attendance - Academic Year 2024-25"
    ],
    projects: [
      {
        id: 3,
        title: "Biodiversity Assessment of School Garden",
        subject: "Biology",
        type: 'research',
        description: "Comprehensive study of plant and animal species in school premises",
        submittedDate: "2025-09-25",
        grade: "A+",
        feedback: "Outstanding field research with detailed documentation. Shows strong scientific methodology.",
        attachments: ["field_report.pdf", "species_photos.zip", "data_analysis.xlsx"]
      }
    ],
    skills: ["Research Skills", "Environmental Awareness", "Leadership", "Data Analysis", "Field Work"],
    careerGoals: "Environmental Scientist"
  },
  {
    id: 3,
    name: "Amit Kumar",
    class: "8th C",
    rollNo: "2024003",
    avatar: "/students/amit.jpg",
    portfolioItems: 18,
    lastUpdated: "5 days ago",
    overallProgress: 76,
    subjects: {
      mathematics: 74,
      science: 79,
      english: 71,
      socialScience: 78,
      hindi: 76
    },
    achievements: [
      "Coding Club - Best App Design",
      "Sports Day - Long Jump Bronze Medal",
      "Most Improved Student - Q2 2025"
    ],
    projects: [
      {
        id: 4,
        title: "School Management App Prototype",
        subject: "Computer Science",
        type: 'project',
        description: "Mobile app prototype for managing school activities and announcements",
        submittedDate: "2025-09-10",
        grade: "B+",
        feedback: "Creative idea with good UI design. Needs improvement in functionality implementation.",
        attachments: ["app_screenshots.pdf", "design_mockup.figma", "code_documentation.pdf"]
      }
    ],
    skills: ["App Development", "UI/UX Design", "Creative Thinking", "Problem Solving", "Technology"],
    careerGoals: "Software Developer"
  }
];

// Portfolio Item Card Component
const PortfolioItemCard: React.FC<{ project: PortfolioProject }> = ({ project }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Target className="h-4 w-4 text-blue-500" />;
      case 'assignment': return <FileText className="h-4 w-4 text-green-500" />;
      case 'artwork': return <Image className="h-4 w-4 text-purple-500" />;
      case 'presentation': return <Video className="h-4 w-4 text-orange-500" />;
      case 'research': return <BookOpen className="h-4 w-4 text-indigo-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'bg-green-100 text-green-800';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-800';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="border-blue-100 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-1">{getTypeIcon(project.type)}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{project.title}</h4>
              <p className="text-sm text-gray-600">{project.subject} • {project.type}</p>
              <p className="text-xs text-gray-500 mt-1">{project.description}</p>
            </div>
          </div>
          <Badge className={`${getGradeColor(project.grade)}`}>
            {project.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <strong>Teacher Feedback:</strong> {project.feedback}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Submitted: {new Date(project.submittedDate).toLocaleDateString()}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">{project.attachments.length} attachments</span>
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Student Portfolio Modal
const StudentPortfolioModal: React.FC<{ 
  student: StudentPortfolio | null; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}'s Portfolio</h2>
              <p className="text-gray-600">{student.class} • {student.rollNo}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b px-6">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'projects', label: 'Projects & Work' },
              { key: 'achievements', label: 'Achievements' },
              { key: 'progress', label: 'Progress Tracking' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-blue-100">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">Portfolio Summary</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-semibold">{student.portfolioItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold text-blue-600">{student.overallProgress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-semibold">{student.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Career Goal</span>
                      <span className="font-semibold text-purple-600">{student.careerGoals}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 lg:col-span-2">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">Subject Performance</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(student.subjects).map(([subject, score]) => (
                        <div key={subject} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">
                              {subject.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-bold">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills & Competencies */}
              <Card className="border-blue-100">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Skills & Competencies</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Projects & Work Samples</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {student.projects.map((project) => (
                  <PortfolioItemCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievements & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.achievements.map((achievement, index) => (
                  <Card key={index} className="border-yellow-100 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{achievement}</p>
                          <p className="text-xs text-gray-600 mt-1">Academic Year 2024-25</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Progress Tracking Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Learning Progress & Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-100">
                  <CardHeader>
                    <h4 className="font-semibold">Monthly Progress Trend</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">September 2025</span>
                        <span className="font-semibold text-green-600">+5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">August 2025</span>
                        <span className="font-semibold text-green-600">+3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">July 2025</span>
                        <span className="font-semibold text-blue-600">+2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100">
                  <CardHeader>
                    <h4 className="font-semibold">Learning Goals Status</h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Math Problem Solving</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Science Project Skills</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">English Communication</span>
                        <Clock className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Portfolios Page Component
export default function StudentPortfoliosPage() {
  const [portfolios] = useState(studentPortfolios);
  const [filteredPortfolios, setFilteredPortfolios] = useState(studentPortfolios);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentPortfolio | null>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  // Filter portfolios based on search and class
  React.useEffect(() => {
    let filtered = portfolios;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.careerGoals.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    setFilteredPortfolios(filtered);
  }, [searchTerm, selectedClass, portfolios]);

  const handleViewPortfolio = (student: StudentPortfolio) => {
    setSelectedStudent(student);
    setIsPortfolioOpen(true);
  };

  const totalPortfolioItems = portfolios.reduce((acc, student) => acc + student.portfolioItems, 0);
  const avgProgress = Math.round(
    portfolios.reduce((acc, student) => acc + student.overallProgress, 0) / portfolios.length
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-500" />
            Student Portfolios
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage comprehensive student portfolios, track progress, and celebrate achievements
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{portfolios.length}</div>
            <div className="text-sm text-gray-600 mt-1">Active Portfolios</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{totalPortfolioItems}</div>
            <div className="text-sm text-gray-600 mt-1">Portfolio Items</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{avgProgress}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Progress</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">24</div>
            <div className="text-sm text-gray-600 mt-1">New This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, roll number, or career goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="8th C">8th C</SelectItem>
                <SelectItem value="9th A">9th A</SelectItem>
                <SelectItem value="9th B">9th B</SelectItem>
                <SelectItem value="10th A">10th A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPortfolios.map(student => (
          <Card key={student.id} className="border-blue-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 ring-2 ring-blue-200">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.class} • {student.rollNo}</p>
                  <Badge variant="outline" className="text-xs mt-1 border-purple-200 text-purple-700">
                    {student.careerGoals}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{student.overallProgress}%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Portfolio Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{student.portfolioItems}</div>
                  <div className="text-xs text-gray-600">Items</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{student.projects.length}</div>
                  <div className="text-xs text-gray-600">Projects</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{student.achievements.length}</div>
                  <div className="text-xs text-gray-600">Awards</div>
                </div>
              </div>

              {/* Recent Achievement */}
              {student.achievements.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800 font-medium">Latest Achievement</p>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">{student.achievements[0]}</p>
                </div>
              )}

              {/* Last Updated */}
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span>Last updated: {student.lastUpdated}</span>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleViewPortfolio(student)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Portfolio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPortfolios.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No portfolios found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or class filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Portfolio Modal */}
      <StudentPortfolioModal
        student={selectedStudent}
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />
    </div>
  );
}
