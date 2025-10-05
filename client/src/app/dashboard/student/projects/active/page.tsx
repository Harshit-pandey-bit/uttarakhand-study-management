// app/dashboard/student/projects/active/page.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarDays, Users, Clock, CheckCircle2, AlertCircle, Play,
  Plus, FileText, MessageSquare, Calendar, Filter 
} from 'lucide-react';
import Link from 'next/link';

// Active projects data from architecture document
const activeProjects = [
  {
    id: "PROJ001",
    title: "Water Conservation in Rural Schools",
    description: "Research and propose solutions for reducing water wastage in our school",
    duration: "3 weeks",
    startDate: "2025-09-15",
    endDate: "2025-10-06",
    mentor: { name: "Dr. Environmental Science Prof", avatar: "/mentors/env-prof.jpg" },
    team: ["Rahul Sharma", "Priya Singh", "Amit Kumar"],
    milestones: [
      { week: 1, task: "Problem Identification & Survey", status: "completed" },
      { week: 2, task: "Data Collection & Analysis", status: "in-progress" },
      { week: 3, task: "Solution Design & Presentation", status: "pending" }
    ],
    nextCheckin: "2025-09-28",
    priority: "high"
  },
  {
    id: "PROJ002", 
    title: "Smart Irrigation System for School Garden",
    description: "Design an automated watering system using IoT sensors",
    duration: "4 weeks",
    startDate: "2025-09-20",
    endDate: "2025-10-18",
    mentor: { name: "Prof. Tech Innovation", avatar: "/mentors/tech-prof.jpg" },
    team: ["Rahul Sharma", "Ankit Verma"],
    milestones: [
      { week: 1, task: "Research & Planning", status: "completed" },
      { week: 2, task: "Sensor Setup & Testing", status: "completed" },
      { week: 3, task: "System Integration", status: "in-progress" },
      { week: 4, task: "Final Testing & Documentation", status: "pending" }
    ],
    nextCheckin: "2025-09-30",
    priority: "medium"
  },
  {
    id: "PROJ003",
    title: "Renewable Energy Assessment",
    description: "Study solar and wind energy potential for school campus",
    duration: "5 weeks",
    startDate: "2025-09-10",
    endDate: "2025-10-15",
    mentor: { name: "Dr. Renewable Energy Specialist", avatar: "/mentors/renewable-prof.jpg" },
    team: ["Rahul Sharma", "Sneha Patel", "Vikash Kumar", "Pooja Singh"],
    milestones: [
      { week: 1, task: "Site Assessment", status: "completed" },
      { week: 2, task: "Data Collection Setup", status: "completed" },
      { week: 3, task: "Energy Measurement", status: "completed" },
      { week: 4, task: "Analysis & Calculations", status: "in-progress" },
      { week: 5, task: "Report & Recommendations", status: "pending" }
    ],
    nextCheckin: "2025-10-01",
    priority: "medium"
  }
];

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const completedMilestones = project.milestones.filter((m: any) => m.status === 'completed').length;
  const progress = (completedMilestones / project.milestones.length) * 100;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Play className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 border-l-4 ${getPriorityColor(project.priority)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary">{project.duration}</Badge>
            <Badge variant="outline" className="capitalize">
              {project.priority} priority
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.team.length} members</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Current Milestone */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Current Milestone</h4>
            {project.milestones.map((milestone: any, index: number) => {
              if (milestone.status === 'in-progress') {
                return (
                  <div key={index} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-md">
                    {getStatusIcon(milestone.status)}
                    <span className="font-medium text-blue-700">
                      Week {milestone.week}: {milestone.task}
                    </span>
                  </div>
                );
              }
            })}
          </div>
          
          {/* Next Check-in */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <Clock className="h-4 w-4" />
            <span>Next check-in: {new Date(project.nextCheckin).toLocaleDateString()}</span>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-sm">
              <span className="text-gray-500">Mentor: </span>
              <span className="font-medium">{project.mentor.name}</span>
            </div>
            <Link href={`/dashboard/student/projects/${project.id}`}>
              <Button size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ActiveProjectsPage() {
  const totalMilestones = activeProjects.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = activeProjects.reduce((acc, p) => 
    acc + p.milestones.filter(m => m.status === 'completed').length, 0
  );
  const upcomingCheckins = activeProjects.filter(p => 
    new Date(p.nextCheckin) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;
  const totalTeamMembers = [...new Set(activeProjects.flatMap(p => p.team))].length;
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-600 mt-1">
            Track your ongoing project work and collaborate with mentors
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
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{activeProjects.length}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedMilestones}</div>
            <div className="text-sm text-gray-600">Completed Milestones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{upcomingCheckins}</div>
            <div className="text-sm text-gray-600">Upcoming Check-ins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalTeamMembers}</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className="flex gap-2">
                <Badge variant="outline">All Projects</Badge>
                <Badge variant="outline">High Priority</Badge>
                <Badge variant="outline">Due This Week</Badge>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {activeProjects.length} projects
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Projects Grid */}
      <div className="grid gap-6">
        {activeProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-12">
              <FileText className="h-5 w-5 mr-2" />
              Submit Progress Report
            </Button>
            <Button variant="outline" className="h-12">
              <MessageSquare className="h-5 w-5 mr-2" />
              Message Mentor
            </Button>
            <Button variant="outline" className="h-12">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Check-in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
