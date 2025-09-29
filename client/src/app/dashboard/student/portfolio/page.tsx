import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Archive, Link, Award } from 'lucide-react';

// Dummy portfolio data for demonstration
const studentPortfolio = {
  studentName: "Rahul Sharma",
  class: "10th",
  school: "Govt School Dehradun",
  profileImage: "/students/rahul-profile.jpg",
  achievements: [
    { id: "A1", title: "State Level Science Fair Winner", date: "2024-11-15", description: "Won 1st place in State Science Exhibition with project on renewable energy." },
    { id: "A2", title: "INSPIRE Award 2023", date: "2023-12-05", description: "Recognized at national level for innovation in environmental conservation." }
  ],
  projects: [
    { id: "P1", title: "Water Conservation Project", status: "Completed", link: "/projects/PROJ001" },
    { id: "P2", title: "Solar Panel Efficiency Study", status: "Ongoing", link: "/projects/PROJ002" }
  ],
  skills: ["Data Analysis", "Research", "Presentation Skills", "Team Collaboration"]
};

const PortfolioCard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={studentPortfolio.profileImage} />
          <AvatarFallback>{studentPortfolio.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{studentPortfolio.studentName}</h1>
          <p className="text-gray-600">Class {studentPortfolio.class} at {studentPortfolio.school}</p>
        </div>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Achievements</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {studentPortfolio.achievements.map((achieve) => (
            <div key={achieve.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Award className="h-7 w-7 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900">{achieve.title}</h3>
                <p className="text-sm text-gray-600">{new Date(achieve.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">{achieve.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Projects</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {studentPortfolio.projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Archive className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <Badge variant={project.status === 'Completed' ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            <a href={project.link} className="text-blue-600 hover:underline flex items-center text-sm">
  <Link className="h-4 w-4 mr-1" />
  View Details
</a>

            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Skills</h2>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {studentPortfolio.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioCard;
