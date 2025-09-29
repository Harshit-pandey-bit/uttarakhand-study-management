import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Users, Clock, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export type MilestoneStatus = 'completed' | 'in-progress' | 'pending';

export interface Milestone {
  week: number;
  task: string;
  status: MilestoneStatus;
}

export interface Mentor {
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  mentor: Mentor;
  team: string[];
  milestones: Milestone[];
  nextCheckin: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
  const progress = (completedMilestones / project.milestones.length) * 100;

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Play className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
          <Badge variant="secondary">{project.duration}</Badge>
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Milestones</h4>
            {project.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {getStatusIcon(milestone.status)}
                <span className={milestone.status === 'completed' ? 'text-green-700' : 'text-gray-600'}>
                  Week {milestone.week}: {milestone.task}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-sm">
              <span className="text-gray-500">Mentor: </span>
              <span className="font-medium">{project.mentor.name}</span>
            </div>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-1" />
              Next Check-in
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
