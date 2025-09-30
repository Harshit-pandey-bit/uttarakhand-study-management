"use client";

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, Users, TrendingUp, BookOpen, 
  Plus, ArrowRight, CheckCircle2, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

// Student project overview data
const studentProjectsData = {
  student: {
    name: "Rahul Sharma",
    class: "Class 10",
    totalProjects: 5,
    activeProjects: 2,
    completedProjects: 3,
    totalMilestones: 15,
    completedMilestones: 12
  },
  activeProjects: [
    {
      id: "PROJ001",
      title: "Water Conservation in Rural Schools",
      description: "Research and propose solutions for reducing water wastage",
      progress: 67,
      dueDate: "2025-10-06",
      status: "on-track",
      mentor: "Dr. Environmental Science Prof",
      nextMilestone: "Data Collection & Analysis",
      team: ["Rahul Sharma", "Priya Singh", "Amit Kumar"]
    },
    {
      id: "PROJ002",
      title: "Smart Irrigation System for School Garden",
      description: "Design an automated watering system using IoT sensors",
      progress: 50,
      dueDate: "2025-10-18",
      status: "on-track",
      mentor: "Prof. Tech Innovation",
      nextMilestone: "System Integration",
      team: ["Rahul Sharma", "Ankit Verma"]
    }
  ],
  recentCompletedProjects: [
    {
      id: "PROJ_COMPLETED_01",
      title: "Soil pH Analysis of School Farm",
      completedDate: "2025-09-15",
      rating: 4.8,
      mentor: "Dr. Agricultural Science",
      skills: ["Data Analysis", "Chemistry", "Research Methods"]
    }
  ],
  recommendations: [
    {
      id: "PROJ_REC_01",
      title: "Solar Panel Efficiency Study",
      category: "Physics",
      difficulty: "Medium",
      duration: "4 weeks",
      match: 92
    },
    {
      id: "PROJ_REC_02",
      title: "Biodiversity Assessment in School Grounds", 
      category: "Biology",
      difficulty: "Easy",
      duration: "3 weeks",
      match: 88
    }
  ]
};

const ProjectCard: React.FC<{ project: any, type: 'active' | 'completed' }> = ({ project, type }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
          </div>
          {type === 'active' && (
            <Badge variant={project.status === 'on-track' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'active' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Next: {project.nextMilestone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{project.team.length} team members</span>
              </div>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-500 mb-3">Mentor: {project.mentor}</p>
              <Link href={`/dashboard/student/projects/${project.id}`}>
                <Button className="w-full">
                  View Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed on {new Date(project.completedDate).toLocaleDateString()}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{project.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.skills.slice(0, 3).map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Certificate
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const RecommendationCard: React.FC<{ project: any }> = ({ project }) => (
  <Card className="hover:shadow-md transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-gray-900 line-clamp-1">{project.title}</h4>
          <Badge variant="secondary">{project.match}% match</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="outline" className="text-xs">{project.category}</Badge>
          <span>•</span>
          <span>{project.difficulty}</span>
          <span>•</span>
          <span>{project.duration}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Learn More
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function StudentProjectsPage() {
  const { student, activeProjects, recentCompletedProjects, recommendations } = studentProjectsData;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Track your research projects and collaborate with mentors
          </p>
        </div>
        <Link href="/dashboard/student/projects/browse">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Browse New Projects
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{student.activeProjects}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{student.completedProjects}</div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.round((student.completedMilestones / student.totalMilestones) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Milestone Success</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{student.totalProjects}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
            <Link href="/dashboard/student/projects/active">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4">
            {activeProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} type="active" />
            ))}
          </div>
          {/* Recent Completed Projects */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
            {recentCompletedProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} type="completed" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/student/projects/browse">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse New Projects
                </Button>
              </Link>
              <Link href="/dashboard/student/projects/active">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Deadlines
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recommended for You</h3>
              <p className="text-sm text-gray-600">Based on your interests and skills</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((project: any) => (
                <RecommendationCard key={project.id} project={project} />
              ))}
              <Link href="/dashboard/student/projects/browse">
                <Button variant="ghost" className="w-full">
                  View All Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
