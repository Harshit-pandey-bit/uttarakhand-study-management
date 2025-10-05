// app/dashboard/student/projects/showcase/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Star, Award, Users, Clock, TrendingUp, 
  Download, Share2, Medal, Trophy, BookOpen, Target,
  CheckCircle2, ExternalLink, FileText, Zap
} from 'lucide-react';
import Link from 'next/link';

// Type definitions
interface Mentor {
  name: string;
  institution: string;
  avatar: string;
}

interface CompletedProject {
  id: string;
  title: string;
  description: string;
  completedDate: string;
  duration: string;
  category: string;
  rating: number;
  mentor: Mentor;
  team: string[];
  skillsGained: string[];
  outcomes: string[];
  certificate: string;
  presentation: string;
  images: string[];
  impact: string;
}

interface Skill {
  name: string;
  level: 'Advanced' | 'Intermediate' | 'Beginner';
  projects: number;
}

interface Student {
  name: string;
  class: string;
  school: string;
  avatar: string;
  joinedDate: string;
  totalProjects: number;
  completedProjects: number;
  avgRating: number;
  totalSkills: number;
  achievements: string[];
}

interface StudentShowcaseData {
  student: Student;
  completedProjects: CompletedProject[];
  skills: Skill[];
}

// Student showcase data
const studentShowcaseData: StudentShowcaseData = {
  student: {
    name: "Rahul Sharma",
    class: "Class 10",
    school: "Government Higher Secondary School, Dehradun",
    avatar: "/students/rahul.jpg",
    joinedDate: "2025-08-15",
    totalProjects: 5,
    completedProjects: 3,
    avgRating: 4.7,
    totalSkills: 12,
    achievements: ["Top Performer", "Research Excellence", "Team Leadership"]
  },
  completedProjects: [
    {
      id: "PROJ_COMPLETED_01",
      title: "Soil pH Analysis of School Farm",
      description: "Comprehensive study of soil chemistry and its impact on crop yield in the school's agricultural plot.",
      completedDate: "2025-09-15",
      duration: "3 weeks",
      category: "Environmental Science",
      rating: 4.8,
      mentor: {
        name: "Dr. Agricultural Science",
        institution: "GBPUAT, Pantnagar",
        avatar: "/mentors/agri-prof.jpg"
      },
      team: ["Rahul Sharma", "Priya Singh", "Ravi Kumar"],
      skillsGained: ["Data Analysis", "Chemistry", "Research Methods", "Scientific Writing"],
      outcomes: [
        "Identified optimal pH levels for different crops",
        "Recommended soil treatment methods",
        "Increased crop yield by 15% in test plots"
      ],
      certificate: "/certificates/soil-analysis-cert.pdf",
      presentation: "/presentations/soil-ph-presentation.pdf",
      images: ["/projects/soil-1.jpg", "/projects/soil-2.jpg", "/projects/soil-3.jpg"],
      impact: "Implemented across 5 government schools in the district"
    },
    {
      id: "PROJ_COMPLETED_02",
      title: "Waste Management System Design",
      description: "Designed and implemented a sustainable waste segregation and recycling system for the school campus.",
      completedDate: "2025-08-30",
      duration: "4 weeks",
      category: "Environmental Engineering",
      rating: 4.6,
      mentor: {
        name: "Prof. Environmental Engineering",
        institution: "IIT Roorkee",
        avatar: "/mentors/env-eng-prof.jpg"
      },
      team: ["Rahul Sharma", "Anita Rawat", "Suresh Patel", "Maya Singh"],
      skillsGained: ["System Design", "Project Management", "Sustainability", "CAD Design"],
      outcomes: [
        "Reduced waste disposal costs by 40%",
        "Achieved 80% waste segregation efficiency",
        "Created income stream through recycling"
      ],
      certificate: "/certificates/waste-mgmt-cert.pdf",
      presentation: "/presentations/waste-system-presentation.pdf",
      images: ["/projects/waste-1.jpg", "/projects/waste-2.jpg"],
      impact: "Model adopted by 3 neighboring schools"
    },
    {
      id: "PROJ_COMPLETED_03",
      title: "Rainwater Harvesting Optimization",
      description: "Mathematical modeling and optimization of rainwater harvesting system for maximum water conservation.",
      completedDate: "2025-08-10",
      duration: "5 weeks",
      category: "Applied Mathematics",
      rating: 4.9,
      mentor: {
        name: "Dr. Applied Mathematics",
        institution: "HNB Garhwal University",
        avatar: "/mentors/math-prof.jpg"
      },
      team: ["Rahul Sharma", "Deepak Bisht"],
      skillsGained: ["Mathematical Modeling", "Optimization", "Statistical Analysis", "Excel Mastery"],
      outcomes: [
        "Optimized water collection efficiency by 35%",
        "Developed predictive models for rainfall patterns",
        "Created cost-benefit analysis framework"
      ],
      certificate: "/certificates/rainwater-cert.pdf",
      presentation: "/presentations/rainwater-optimization.pdf",
      images: ["/projects/rainwater-1.jpg", "/projects/rainwater-2.jpg", "/projects/rainwater-3.jpg", "/projects/rainwater-4.jpg"],
      impact: "Research published in district education newsletter"
    }
  ],
  skills: [
    { name: "Data Analysis", level: "Advanced", projects: 3 },
    { name: "Research Methods", level: "Advanced", projects: 3 },
    { name: "Scientific Writing", level: "Intermediate", projects: 2 },
    { name: "Mathematical Modeling", level: "Advanced", projects: 2 },
    { name: "Project Management", level: "Intermediate", projects: 2 },
    { name: "Chemistry", level: "Intermediate", projects: 1 },
    { name: "System Design", level: "Beginner", projects: 1 },
    { name: "Sustainability", level: "Intermediate", projects: 2 },
    { name: "Team Leadership", level: "Advanced", projects: 3 },
    { name: "CAD Design", level: "Beginner", projects: 1 },
    { name: "Statistical Analysis", level: "Advanced", projects: 2 },
    { name: "Excel Mastery", level: "Advanced", projects: 2 }
  ]
};

// Component prop interfaces
interface ProjectShowcaseCardProps {
  project: CompletedProject;
}

interface SkillCardProps {
  skill: Skill;
}

const ProjectShowcaseCard: React.FC<ProjectShowcaseCardProps> = ({ project }) => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{project.rating}</span>
              </div>
            </div>
            <Badge variant="outline" className="w-fit">{project.category}</Badge>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
            <span className="text-sm text-gray-500">
              {new Date(project.completedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">
          {showFullDescription ? project.description : `${project.description.slice(0, 120)}...`}
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
            type="button"
          >
            {showFullDescription ? 'Read less' : 'Read more'}
          </button>
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{project.team.length} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gray-400" />
            <span>{project.skillsGained.length} skills</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-400" />
            <span>{project.outcomes.length} outcomes</span>
          </div>
        </div>

        {/* Mentor Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={project.mentor.avatar} alt={project.mentor.name} />
            <AvatarFallback>{project.mentor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{project.mentor.name}</p>
            <p className="text-sm text-gray-600">{project.mentor.institution}</p>
          </div>
        </div>

        {/* Skills Gained */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Skills Gained</h4>
          <div className="flex flex-wrap gap-2">
            {project.skillsGained.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Outcomes */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Key Outcomes</h4>
          <ul className="space-y-2">
            {project.outcomes.map((outcome: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">Impact</span>
          </div>
          <p className="text-sm text-green-700">{project.impact}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-3 border-t">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Certificate
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Presentation
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const getLevelColor = (level: Skill['level']): string => {
    switch (level) {
      case 'Advanced': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
            <Badge variant="outline" className={getLevelColor(skill.level)}>
              {skill.level}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            Applied in {skill.projects} project{skill.projects > 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProjectShowcasePage(): React.JSX.Element {
  const { student, completedProjects, skills } = studentShowcaseData;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="text-2xl">{student.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-lg text-gray-600">{student.class} • {student.school}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(student.joinedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-center gap-3 pt-4">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Portfolio
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{student.completedProjects}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-yellow-600">{student.avgRating}</span>
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{student.totalSkills}</div>
            <div className="text-sm text-gray-600">Skills Mastered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {completedProjects.reduce((acc: number, p: CompletedProject) => acc + p.team.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Team Collaborations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{student.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Badges */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {student.achievements.map((achievement: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 px-3 py-1">
                <Medal className="h-3 w-3 mr-1" />
                {achievement}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Projects */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Completed Projects</h2>
          <Badge variant="secondary">{completedProjects.length} projects</Badge>
        </div>
        
        <div className="space-y-8">
          {completedProjects.map((project: CompletedProject) => (
            <ProjectShowcaseCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Skills Portfolio */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Skills Portfolio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill: Skill, index: number) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </div>
      </div>

      {/* Timeline Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project Timeline
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedProjects.map((project: CompletedProject) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600">
                    Completed on {new Date(project.completedDate).toLocaleDateString()} • {project.duration}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{project.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
