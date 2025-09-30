'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, BookOpen, Clock, Download, Play, 
  CheckCircle2, Calendar, Target, TrendingUp,
  Star, FileText, ExternalLink
} from 'lucide-react';

const cpdData = {
  overview: {
    totalCourses: 12,
    completedCourses: 7,
    inProgressCourses: 3,
    cpdPoints: 350,
    targetPoints: 500,
    certificatesEarned: 5
  },
  courses: [
    {
      id: 1,
      title: "DIKSHA: Effective Teaching Methods",
      provider: "DIKSHA",
      duration: "40 hours",
      progress: 100,
      status: "completed",
      points: 40,
      certificate: "diksha-teaching-methods.pdf",
      completedDate: "2025-09-15",
      modules: 8
    },
    {
      id: 2,
      title: "NISHTHA: Inclusive Education",
      provider: "NISHTHA", 
      duration: "30 hours",
      progress: 65,
      status: "in-progress",
      points: 0,
      certificate: null,
      modules: 6,
      currentModule: "Understanding Learning Disabilities"
    },
    {
      id: 3,
      title: "Digital Assessment Strategies",
      provider: "DIKSHA",
      duration: "25 hours", 
      progress: 0,
      status: "available",
      points: 0,
      certificate: null,
      modules: 5,
      deadline: "2025-10-30"
    }
  ],
  certificates: [
    { name: "Effective Teaching Methods", date: "2025-09-15", points: 40 },
    { name: "Child Psychology", date: "2025-08-22", points: 35 },
    { name: "Classroom Management", date: "2025-07-18", points: 30 },
    { name: "ICT Integration", date: "2025-06-25", points: 25 },
    { name: "Assessment Techniques", date: "2025-05-20", points: 20 }
  ]
};

export default function CPDPage() {
  const [data] = useState(cpdData);
  
  const progressPercentage = (data.overview.cpdPoints / data.overview.targetPoints) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="h-8 w-8 mr-3 text-purple-500" />
            Professional Development
          </h1>
          <p className="text-gray-600 mt-2">
            Enhance your teaching skills with DIKSHA and NISHTHA courses
          </p>
        </div>
      </div>

      {/* CPD Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{data.overview.completedCourses}</div>
            <div className="text-sm text-gray-600 mt-1">Courses Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{data.overview.inProgressCourses}</div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{data.overview.cpdPoints}</div>
            <div className="text-sm text-gray-600 mt-1">CPD Points Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{data.overview.certificatesEarned}</div>
            <div className="text-sm text-gray-600 mt-1">Certificates</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                CPD Progress
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Annual CPD Target Progress</span>
                  <span className="font-medium">{data.overview.cpdPoints}/{data.overview.targetPoints} points</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-gray-600">
                  {Math.round(progressPercentage)}% complete • {data.overview.targetPoints - data.overview.cpdPoints} points remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Available Courses */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Available Courses</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>{course.provider}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.modules} modules</span>
                      </div>
                      {course.currentModule && (
                        <p className="text-sm text-blue-600 mt-1">
                          Current: {course.currentModule}
                        </p>
                      )}
                      {course.deadline && (
                        <p className="text-sm text-red-600 mt-1">
                          Deadline: {new Date(course.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={
                          course.status === 'completed' ? 'bg-green-100 text-green-700' :
                          course.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {course.status.replace('-', ' ')}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {course.status === 'completed' ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            View Certificate
                          </>
                        ) : course.status === 'in-progress' ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-1" />
                            Start Course
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {course.progress > 0 && (
                    <div className="mt-3">
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">{course.progress}% complete</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certificates */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Recent Certificates
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                      <p className="text-xs text-gray-600">{new Date(cert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {cert.points} pts
                    </Badge>
                    <Button size="sm" variant="ghost" className="ml-2">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Links</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                DIKSHA Portal
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                NISHTHA Platform
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download All Certificates
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                CPD Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
