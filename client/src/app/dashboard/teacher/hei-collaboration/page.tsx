'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  School, Video, Calendar, Users, FileText, 
  ExternalLink, Clock, CheckCircle2, BookOpen,
  Microscope, FlaskConical, Lightbulb, Target
} from 'lucide-react';

const collaborationData = {
  upcomingSessions: [
    {
      id: 1,
      title: "Advanced Mathematics Teaching Methods",
      mentor: "Dr. Rajesh Kumar",
      institution: "IIT Roorkee",
      date: "2025-10-02",
      time: "10:00 AM",
      duration: "90 minutes",
      type: "planning",
      participants: 8,
      meetingLink: "https://meet.google.com/abc-def-ghi",
      agenda: "Discuss innovative approaches for teaching calculus concepts"
    },
    {
      id: 2,
      title: "Virtual Chemistry Lab Session",
      mentor: "Prof. Anita Sharma", 
      institution: "NIT Uttarakhand",
      date: "2025-10-05",
      time: "2:00 PM",
      duration: "120 minutes",
      type: "virtual-lab",
      participants: 15,
      meetingLink: "https://lab.nitu.ac.in/chemistry",
      agenda: "Acids and Bases - Interactive experiments and demonstrations"
    },
    {
      id: 3,
      title: "STEM Career Guidance Workshop",
      mentor: "Dr. Priya Patel",
      institution: "IIT Delhi",
      date: "2025-10-08",
      time: "4:00 PM", 
      duration: "60 minutes",
      type: "workshop",
      participants: 25,
      meetingLink: "https://meet.google.com/xyz-abc-def",
      agenda: "Inspiring students towards aerospace and engineering careers"
    }
  ],
  recentCollaborations: [
    {
      title: "Solar System Project Planning",
      mentor: "Dr. Vikram Singh",
      institution: "IIT Bombay",
      date: "2025-09-28",
      outcome: "Developed interactive 3D solar system model for Class 8",
      resources: ["3D Model Files", "Lesson Plan", "Assessment Rubric"]
    },
    {
      title: "Mathematical Modeling Workshop",
      mentor: "Prof. Sunita Gupta",
      institution: "IIT Kanpur", 
      date: "2025-09-25",
      outcome: "Created real-world problem sets for quadratic equations",
      resources: ["Problem Bank", "Solution Methods", "Teaching Guide"]
    }
  ],
  virtualLabs: [
    {
      name: "Physics Virtual Lab",
      institution: "IIT Delhi",
      subjects: ["Mechanics", "Optics", "Electricity"],
      accessLink: "https://vlab.iitd.ac.in/physics",
      lastUsed: "2025-09-26"
    },
    {
      name: "Chemistry Simulation Lab",
      institution: "NIT Uttarakhand",
      subjects: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"], 
      accessLink: "https://chemlab.nitu.ac.in",
      lastUsed: "2025-09-24"
    },
    {
      name: "Mathematics Visualization Tool",
      institution: "IIT Roorkee",
      subjects: ["Calculus", "Algebra", "Geometry"],
      accessLink: "https://mathtools.iitr.ac.in",
      lastUsed: "2025-09-22"
    }
  ]
};

const SessionCard: React.FC<{ session: any }> = ({ session }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planning': return <Users className="h-4 w-4 text-blue-500" />;
      case 'virtual-lab': return <Microscope className="h-4 w-4 text-green-500" />;
      case 'workshop': return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planning': return 'border-l-blue-500 bg-blue-50';
      case 'virtual-lab': return 'border-l-green-500 bg-green-50';
      case 'workshop': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Card className={`border-l-4 ${getTypeColor(session.type)} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="mt-1">{getTypeIcon(session.type)}</div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">{session.title}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{session.mentor} • {session.institution}</p>
                <p>{new Date(session.date).toLocaleDateString()} at {session.time}</p>
                <p>{session.duration} • {session.participants} participants</p>
              </div>
              <p className="text-sm text-gray-700">{session.agenda}</p>
            </div>
          </div>
          <Button size="sm">
            <Video className="h-4 w-4 mr-1" />
            Join Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function HEICollaborationPage() {
  const [data] = useState(collaborationData);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <School className="h-8 w-8 mr-3 text-green-500" />
            HEI Collaboration
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with IIT/NIT mentors and access virtual labs for enhanced teaching
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{data.upcomingSessions.length}</div>
            <div className="text-sm text-gray-600 mt-1">Upcoming Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{data.recentCollaborations.length}</div>
            <div className="text-sm text-gray-600 mt-1">Recent Collaborations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{data.virtualLabs.length}</div>
            <div className="text-sm text-gray-600 mt-1">Virtual Labs Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600 mt-1">Partner Institutions</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming Collaboration Sessions
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </CardContent>
          </Card>

          {/* Recent Collaborations */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                Recent Collaborations
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.recentCollaborations.map((collab, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{collab.title}</h4>
                      <p className="text-sm text-gray-600">
                        {collab.mentor} • {collab.institution} • {new Date(collab.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">{collab.outcome}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {collab.resources.map((resource, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Resources
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Virtual Labs */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <FlaskConical className="h-5 w-5 mr-2 text-green-500" />
                Virtual Labs
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.virtualLabs.map((lab, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{lab.name}</h4>
                    <p className="text-sm text-gray-600">{lab.institution}</p>
                    <div className="flex flex-wrap gap-1">
                      {lab.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Last used: {new Date(lab.lastUsed).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Access Lab
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Session
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Browse Mentors
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Microscope className="h-4 w-4 mr-2" />
                Explore Virtual Labs
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Resource Library
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
