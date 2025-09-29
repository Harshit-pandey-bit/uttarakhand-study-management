'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays, Users, Clock, CheckCircle2, AlertCircle, Play, FileText, MessageSquare, Upload, Download, Video, Link } from 'lucide-react';

const projectDetailData = {
  id: "PROJ001",
  title: "Water Conservation in Rural Schools",
  description: "Research and propose solutions for reducing water wastage in our school community through innovative techniques and community engagement.",
  duration: "3 weeks",
  startDate: "2025-09-15",
  endDate: "2025-10-06",
  status: "in-progress",
  mentor: {
    name: "Dr. Environmental Science Prof",
    avatar: "/mentors/env-prof.jpg",
    email: "env.prof@hei.edu",
    expertise: ["Environmental Science", "Water Management", "Rural Development"]
  },
  team: [
    { name: "Rahul Sharma", role: "Team Lead", avatar: "/students/rahul.jpg" },
    { name: "Priya Singh", role: "Data Collector", avatar: "/students/priya.jpg" },
    { name: "Amit Kumar", role: "Researcher", avatar: "/students/amit.jpg" }
  ],
  milestones: [
    {
      week: 1,
      task: "Problem Identification & Survey",
      status: "completed",
      dueDate: "2025-09-21",
      completedDate: "2025-09-20",
      description: "Conduct school-wide survey to identify water wastage patterns and interview stakeholders."
    },
    {
      week: 2,
      task: "Data Collection & Analysis",
      status: "in-progress",
      dueDate: "2025-09-28",
      description: "Analyze survey data, measure water usage, and identify key problem areas.",
      progress: 60
    },
    {
      week: 3,
      task: "Solution Design & Presentation",
      status: "pending",
      dueDate: "2025-10-05",
      description: "Develop practical solutions and create presentation for school administration."
    }
  ],
  resources: [
    { name: "Water Survey Template", type: "document", url: "/resources/water-survey.pdf" },
    { name: "Data Analysis Spreadsheet", type: "spreadsheet", url: "/resources/analysis.xlsx" },
    { name: "Research Guidelines", type: "document", url: "/resources/research-guide.pdf" }
  ],
  submissions: [
    {
      title: "Week 1 Progress Report",
      submittedDate: "2025-09-21",
      status: "approved",
      feedback: "Excellent survey methodology and comprehensive data collection."
    }
  ],
  upcomingEvents: [
    {
      title: "Mentor Check-in",
      date: "2025-09-28",
      time: "10:00 AM",
      type: "video-call",
      description: "Review data analysis progress and discuss solution approaches"
    }
  ]
};

const MilestoneCard: React.FC<{ milestone: any }> = ({ milestone }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Play className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(milestone.status)}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Week {milestone.week}: {milestone.task}
              </h4>
              <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                {milestone.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{milestone.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
              {milestone.completedDate && (
                <span className="text-green-600">
                  Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                </span>
              )}
            </div>
            {milestone.status === 'in-progress' && milestone.progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectDetailPage: React.FC = () => {
  const [project] = useState(projectDetailData);
  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
  const overallProgress = (completedMilestones / project.milestones.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 max-w-2xl">{project.description}</p>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{project.duration}</Badge>
            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Mentor
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Submit Work
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{completedMilestones}</div>
              <div className="text-sm text-gray-600">Milestones Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Days Remaining</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">{project.team.length}</div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          {project.milestones.map((milestone, index) => (
            <MilestoneCard key={index} milestone={milestone} />
          ))}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Project Mentor</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={project.mentor.avatar} />
                  <AvatarFallback>{project.mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="font-semibold">{project.mentor.name}</h4>
                  <p className="text-sm text-gray-600">{project.mentor.email}</p>
                  <div className="flex gap-2">
                    {project.mentor.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Team Members</h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {project.team.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Project Resources</h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {project.resources.map((resource, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Submitted Work</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.submissions.map((submission, idx) => (
                  <div key={idx} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{submission.title}</h4>
                      <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                      <strong>Feedback:</strong> {submission.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.upcomingEvents.map((event, idx) => (
                  <div key={idx} className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <CalendarDays className="h-4 w-4 inline mr-1" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <p className="text-sm text-gray-700">{event.description}</p>
                    <Button size="sm" className="mt-3">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
