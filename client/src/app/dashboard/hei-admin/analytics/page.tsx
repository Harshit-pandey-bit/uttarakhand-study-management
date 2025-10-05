'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  School,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Activity,
  Building2,
  BookOpen,
  Download
} from 'lucide-react';

// Dummy data from PDF specifications
const analyticsData = {
  overallImpact: {
    partneredSchools: 25,
    activeMentors: 12,
    studentsReached: 450,
    totalSessions: 1250,
    averageImprovement: "18%"
  },
  monthlyMetrics: [
    { month: "July", sessions: 120, studentsReached: 340, improvement: "15%" },
    { month: "August", sessions: 135, studentsReached: 380, improvement: "17%" },
    { month: "September", sessions: 142, studentsReached: 420, improvement: "19%" }
  ],
  mentorPerformance: [
    { 
      name: "Dr. Rajesh Kumar", 
      sessions: 45, 
      rating: 4.8, 
      studentsHelped: 32, 
      improvement: "24%",
      subjects: ["Physics", "Career Guidance"],
      efficiency: 95,
      feedback: "Excellent communication and subject expertise"
    },
    { 
      name: "Prof. Sunita Sharma", 
      sessions: 38, 
      rating: 4.6, 
      studentsHelped: 28, 
      improvement: "21%",
      subjects: ["Chemistry", "Research Methods"],
      efficiency: 88,
      feedback: "Great at explaining complex concepts"
    },
    {
      name: "Dr. Amit Verma",
      sessions: 52,
      rating: 4.7,
      studentsHelped: 35,
      improvement: "23%",
      subjects: ["Mathematics", "Data Science"],
      efficiency: 92,
      feedback: "Innovative teaching methods and good rapport"
    }
  ],
  schoolPartnershipHealth: [
    { 
      school: "Govt School Dehradun", 
      engagement: "High", 
      sessions: 65, 
      satisfaction: "4.7",
      studentsActive: 45,
      completionRate: "89%",
      growthRate: "+12%"
    },
    { 
      school: "Govt School Rishikesh", 
      engagement: "Medium", 
      sessions: 45, 
      satisfaction: "4.3",
      studentsActive: 32,
      completionRate: "76%",
      growthRate: "+8%"
    },
    {
      school: "Govt School Haridwar",
      engagement: "High",
      sessions: 58,
      satisfaction: "4.5",
      studentsActive: 38,
      completionRate: "83%",
      growthRate: "+15%"
    }
  ],
  complianceMetrics: {
    sessionCompletionRate: "92%",
    mentorCertificationStatus: "100%",
    safeguardingCompliance: "98%",
    dataPrivacyCompliance: "100%",
    reportingAccuracy: "96%"
  },
  regionalDistribution: [
    { region: "Dehradun", schools: 12, mentors: 5, students: 180 },
    { region: "Haridwar", schools: 8, mentors: 4, students: 150 },
    { region: "Rishikesh", schools: 5, mentors: 3, students: 120 }
  ],
  performanceTrends: {
    studentEngagement: [
      { period: "Q1", value: 75 },
      { period: "Q2", value: 82 },
      { period: "Q3", value: 87 }
    ],
    sessionQuality: [
      { period: "Q1", value: 4.2 },
      { period: "Q2", value: 4.5 },
      { period: "Q3", value: 4.6 }
    ]
  }
};

export default function HEIAdminAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const getEngagementColor = (engagement: string) => {
    switch (engagement.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (rate: string) => {
    const numRate = parseInt(rate);
    if (numRate >= 95) return 'text-green-600';
    if (numRate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Institution-wide Impact Analytics</h1>
          <p className="text-gray-600">Comprehensive metrics and performance tracking</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Impact</p>
                <p className="text-2xl font-bold">{analyticsData.overallImpact.averageImprovement}</p>
                <p className="text-xs text-green-600">+3% from last period</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Partnerships</p>
                <p className="text-2xl font-bold">{analyticsData.overallImpact.partneredSchools}</p>
                <p className="text-xs text-blue-600">3 new this quarter</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentor Efficiency</p>
                <p className="text-2xl font-bold">91%</p>
                <p className="text-xs text-purple-600">Above target</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Student Reach</p>
                <p className="text-2xl font-bold">{analyticsData.overallImpact.studentsReached}</p>
                <p className="text-xs text-orange-600">+45 this month</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Session Quality</p>
                <p className="text-2xl font-bold">4.6</p>
                <p className="text-xs text-yellow-600">Excellent rating</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="partnership" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="partnership">Partnership Health</TabsTrigger>
          <TabsTrigger value="mentor">Mentor Effectiveness</TabsTrigger>
          <TabsTrigger value="outcomes">Student Outcomes</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Partnership Health Tab */}
        <TabsContent value="partnership" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Performance Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.schoolPartnershipHealth.map((school, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{school.school}</h4>
                        <Badge className={getEngagementColor(school.engagement)}>
                          {school.engagement}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">{school.sessions}</p>
                          <p className="text-xs text-gray-600">Sessions</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">{school.studentsActive}</p>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium">Satisfaction</p>
                          <p className="text-green-600">{school.satisfaction}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Completion</p>
                          <p className="text-blue-600">{school.completionRate}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Growth</p>
                          <p className="text-purple-600">{school.growthRate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regionalDistribution.map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{region.region} District</h4>
                        <Badge variant="secondary">{region.schools} schools</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <School className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                          <p className="text-sm font-bold text-orange-600">{region.schools}</p>
                          <p className="text-xs text-gray-600">Schools</p>
                        </div>
                        <div className="text-center p-2 bg-teal-50 rounded">
                          <Users className="h-4 w-4 text-teal-600 mx-auto mb-1" />
                          <p className="text-sm font-bold text-teal-600">{region.mentors}</p>
                          <p className="text-xs text-gray-600">Mentors</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                          <p className="text-sm font-bold text-purple-600">{region.students}</p>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mentor Effectiveness Tab */}
        <TabsContent value="mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Performance Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.mentorPerformance.map((mentor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{mentor.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                {mentor.rating}
                              </span>
                              <span>{mentor.sessions} sessions</span>
                              <span>{mentor.studentsHelped} students</span>
                            </div>
                          </div>
                          <Badge variant="secondary">{mentor.improvement} impact</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Subject Expertise</p>
                            <div className="flex space-x-1">
                              {mentor.subjects.map((subject) => (
                                <Badge key={subject} className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Efficiency Score</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={mentor.efficiency} className="flex-1" />
                              <span className="text-sm font-medium">{mentor.efficiency}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Recent Feedback</p>
                          <p className="text-sm text-gray-600">{mentor.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Outcomes Tab */}
        <TabsContent value="outcomes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{metric.month} 2025</p>
                          <p className="text-sm text-gray-600">
                            {metric.sessions} sessions • {metric.studentsReached} students
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{metric.improvement}</p>
                        <p className="text-xs text-gray-500">improvement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Student Engagement Rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="w-full" />
                    <p className="text-xs text-gray-500 mt-1">Above industry standard (75%)</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Session Completion Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="w-full" />
                    <p className="text-xs text-gray-500 mt-1">Excellent retention</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Academic Improvement</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <Progress value={76} className="w-full" />
                    <p className="text-xs text-gray-500 mt-1">Students showing measurable gains</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Career Guidance Effectiveness</span>
                      <span className="font-medium">83%</span>
                    </div>
                    <Progress value={83} className="w-full" />
                    <p className="text-xs text-gray-500 mt-1">Clarity in career planning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Session Completion Rate</p>
                        <p className="text-sm text-gray-600">On-time session delivery</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getComplianceColor(analyticsData.complianceMetrics.sessionCompletionRate)}`}>
                      {analyticsData.complianceMetrics.sessionCompletionRate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Mentor Certification</p>
                        <p className="text-sm text-gray-600">All mentors certified</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getComplianceColor(analyticsData.complianceMetrics.mentorCertificationStatus)}`}>
                      {analyticsData.complianceMetrics.mentorCertificationStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                      <div>
                        <p className="font-medium">Safeguarding Compliance</p>
                        <p className="text-sm text-gray-600">Child protection standards</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getComplianceColor(analyticsData.complianceMetrics.safeguardingCompliance)}`}>
                      {analyticsData.complianceMetrics.safeguardingCompliance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="font-medium">Data Privacy Compliance</p>
                        <p className="text-sm text-gray-600">GDPR/Data protection</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getComplianceColor(analyticsData.complianceMetrics.dataPrivacyCompliance)}`}>
                      {analyticsData.complianceMetrics.dataPrivacyCompliance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Reporting Accuracy</p>
                        <p className="text-sm text-gray-600">Data quality metrics</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getComplianceColor(analyticsData.complianceMetrics.reportingAccuracy)}`}>
                      {analyticsData.complianceMetrics.reportingAccuracy}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Actions Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Mentor Certification Renewal</p>
                      <p className="text-sm text-yellow-700">2 mentors require certification renewal within 30 days</p>
                      <Button size="sm" className="mt-2" variant="outline">
                        Schedule Renewals
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Session Documentation</p>
                      <p className="text-sm text-blue-700">Update session reports for 5 recent mentoring sessions</p>
                      <Button size="sm" className="mt-2" variant="outline">
                        Update Reports
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">All Systems Operational</p>
                      <p className="text-sm text-green-700">No critical compliance issues detected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
