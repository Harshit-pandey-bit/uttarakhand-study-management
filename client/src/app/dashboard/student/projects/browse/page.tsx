// app/dashboard/student/projects/browse/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, Filter, Clock, Users, BookOpen, Star, 
  Beaker, Leaf, Zap, Globe, Calculator, Microscope 
} from 'lucide-react';

// Available projects data based on the architecture
const availableProjects = [
  {
    id: "PROJ_BROWSE_001",
    title: "Solar Panel Efficiency Study",
    description: "Research how different angles and weather conditions affect solar panel energy output in rural schools.",
    category: "Physics",
    difficulty: "Medium",
    duration: "4 weeks",
    mentor: { name: "Dr. Renewable Energy Specialist", avatar: "/mentors/solar-expert.jpg" },
    skills: ["Data Collection", "Mathematics", "Environmental Science"],
    objectives: [
      "Understanding solar energy principles",
      "Data analysis and statistical methods",
      "Environmental impact assessment"
    ],
    maxTeamSize: 4,
    currentEnrollments: 12,
    rating: 4.8,
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    tags: ["Renewable Energy", "Physics", "STEM"]
  },
  {
    id: "PROJ_BROWSE_002", 
    title: "Biodiversity Assessment in School Grounds",
    description: "Document and study the plant and animal species found around the school campus using scientific methods.",
    category: "Biology",
    difficulty: "Easy",
    duration: "3 weeks", 
    mentor: { name: "Prof. Environmental Biology", avatar: "/mentors/bio-expert.jpg" },
    skills: ["Observation", "Classification", "Photography"],
    objectives: [
      "Learn species identification techniques",
      "Understanding ecosystem relationships",
      "Creating scientific documentation"
    ],
    maxTeamSize: 3,
    currentEnrollments: 8,
    rating: 4.6,
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    tags: ["Biodiversity", "Biology", "Environment"]
  },
  {
    id: "PROJ_BROWSE_003",
    title: "Mathematical Modeling of Population Growth",
    description: "Use mathematical equations to model and predict population changes in your local community.",
    category: "Mathematics",
    difficulty: "Hard",
    duration: "5 weeks",
    mentor: { name: "Dr. Applied Mathematics", avatar: "/mentors/math-expert.jpg" },
    skills: ["Statistics", "Algebra", "Data Analysis"],
    objectives: [
      "Master exponential and logistic functions",
      "Apply calculus to real-world problems",
      "Develop predictive models"
    ],
    maxTeamSize: 2,
    currentEnrollments: 6,
    rating: 4.9,
    icon: <Calculator className="h-6 w-6 text-blue-500" />,
    tags: ["Mathematics", "Statistics", "Modeling"]
  },
  {
    id: "PROJ_BROWSE_004",
    title: "Chemistry of Natural Dyes",
    description: "Extract dyes from local plants and flowers, then test their chemical properties and colorfastness.",
    category: "Chemistry",
    difficulty: "Medium",
    duration: "3 weeks",
    mentor: { name: "Prof. Organic Chemistry", avatar: "/mentors/chem-expert.jpg" },
    skills: ["Laboratory Techniques", "Chemical Analysis", "Safety Protocols"],
    objectives: [
      "Understanding molecular structure of dyes",
      "Learn extraction and purification methods",
      "Explore chemical bonding and reactions"
    ],
    maxTeamSize: 3,
    currentEnrollments: 15,
    rating: 4.7,
    icon: <Beaker className="h-6 w-6 text-purple-500" />,
    tags: ["Chemistry", "Natural Sciences", "Laboratory"]
  },
  {
    id: "PROJ_BROWSE_005",
    title: "Climate Data Analysis for Local Weather Patterns",
    description: "Collect and analyze local weather data to understand climate patterns and predict seasonal changes.",
    category: "Earth Science", 
    difficulty: "Medium",
    duration: "4 weeks",
    mentor: { name: "Dr. Climatology", avatar: "/mentors/climate-expert.jpg" },
    skills: ["Data Collection", "Statistical Analysis", "Geographic Information"],
    objectives: [
      "Understanding climate vs weather",
      "Data visualization techniques", 
      "Climate change impact assessment"
    ],
    maxTeamSize: 4,
    currentEnrollments: 10,
    rating: 4.5,
    icon: <Globe className="h-6 w-6 text-cyan-500" />,
    tags: ["Climate", "Data Science", "Geography"]
  },
  {
    id: "PROJ_BROWSE_006",
    title: "Microscopic World Investigation", 
    description: "Explore microorganisms in different environments using microscopy and learn about their roles in ecosystems.",
    category: "Biology",
    difficulty: "Easy",
    duration: "2 weeks",
    mentor: { name: "Prof. Microbiology", avatar: "/mentors/micro-expert.jpg" },
    skills: ["Microscopy", "Sample Preparation", "Scientific Drawing"],
    objectives: [
      "Master microscope operation",
      "Identify common microorganisms",
      "Understand microbial ecology"
    ],
    maxTeamSize: 2,
    currentEnrollments: 20,
    rating: 4.8,
    icon: <Microscope className="h-6 w-6 text-indigo-500" />,
    tags: ["Microbiology", "Laboratory", "Research"]
  }
];

const categories = ["All", "Physics", "Biology", "Chemistry", "Mathematics", "Earth Science"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const durations = ["All", "2 weeks", "3 weeks", "4 weeks", "5+ weeks"];

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{project.icon}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {project.title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                <span>{project.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className={getDifficultyColor(project.difficulty)}>
            {project.difficulty}
          </Badge>
          <Badge variant="secondary">{project.duration}</Badge>
          <Badge variant="outline">{project.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mentor Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.mentor.avatar} />
            <AvatarFallback className="text-xs">
              {project.mentor.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {project.mentor.name}
            </p>
            <p className="text-xs text-gray-500">Project Mentor</p>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">You'll Learn:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {project.objectives.slice(0, 2).map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <BookOpen className="h-3 w-3 mt-1 flex-shrink-0 text-blue-500" />
                <span className="line-clamp-1">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills & Tags */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {project.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {project.maxTeamSize}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {project.currentEnrollments} enrolled
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full mt-4">
          Join Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default function ProjectBrowserPage() {
  const [projects] = useState(availableProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');

  // Filter projects based on current filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty;
    const matchesDuration = selectedDuration === 'All' || project.duration === selectedDuration;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Browse Projects</h1>
        <p className="text-gray-600">
          Discover exciting research projects led by expert mentors from partner institutions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map(duration => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No projects found</h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or browse all available projects
                </p>
              </div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setSelectedDuration('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
