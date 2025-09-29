'use client'
import React, { useState } from 'react';
import ProjectCard,{ MilestoneStatus } from './ProjectCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Dummy data for active projects (can be replaced by API data later)
const activeProjects = [
  {
    id: "PROJ001",
    title: "Water Conservation in Rural Schools",
    description: "Research and propose solutions for reducing water wastage in our school",
    duration: "3 weeks",
    startDate: "2025-09-15",
    endDate: "2025-10-06",
    mentor: { name: "Dr. Environmental Science Prof" },
    team: ["Rahul Sharma", "Priya Singh", "Amit Kumar"],
    milestones: [
      { week: 1, task: "Problem Identification & Survey", status: "completed" as MilestoneStatus   },
      { week: 2, task: "Data Collection & Analysis", status: "in-progress" as MilestoneStatus },
      { week: 3, task: "Solution Design & Presentation", status: "pending"as MilestoneStatus }
    ],
    nextCheckin: "2025-09-28"
  },
  {
    id: "PROJ002",
    title: "Smart Irrigation System for School Garden",
    description: "Design an automated watering system using IoT sensors",
    duration: "4 weeks",
    startDate: "2025-09-20",
    endDate: "2025-10-18",
    mentor: { name: "Prof. Tech Innovation" },
    team: ["Rahul Sharma", "Ankit Verma"],
    milestones: [
      { week: 1, task: "Research & Planning", status: "completed"as MilestoneStatus },
      { week: 2, task: "Sensor Setup & Testing", status: "completed"as MilestoneStatus },
      { week: 3, task: "System Integration", status: "in-progress" as MilestoneStatus},
      { week: 4, task: "Final Testing & Documentation", status: "pending"as MilestoneStatus }
    ],
    nextCheckin: "2025-09-30"
  }
];

const ActiveProjectsPage: React.FC = () => {
  const [projects] = useState(activeProjects);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-600 mt-1">Track your ongoing project work and collaborate with mentors</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Browse New Projects
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'completed').length, 0)}
            </div>
            <div className="text-sm text-gray-600">Completed Milestones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Upcoming Check-ins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsPage;
