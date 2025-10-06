
'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Users, 
  CheckCircle2,
  Star,
  Calendar,
  Download,
  Globe,
  Video,
  FileText,
  Brain,
  Shield,
  Heart,
  Palette,
  Monitor,
  Calculator,
  Microscope,
  Map,
  Languages,
  UserCheck,
  Share2,
  BarChart3,
  Target,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Zap,
  Phone,
  Laptop
} from 'lucide-react';

export default function DIKSHAInfoPage() {
  const handleVisitDIKSHA = () => {
    window.open('https://diksha.gov.in', '_blank');
  };

  const handleDownloadApp = () => {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=in.gov.diksha.app', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.open('https://apps.apple.com/app/diksha/id1315319398', '_blank');
    } else {
      window.open('https://diksha.gov.in', '_blank');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">DIKSHA Platform</h1>
              <p className="text-base sm:text-lg text-indigo-600 font-medium">Digital Infrastructure for Knowledge Sharing</p>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-2">
            National digital platform by NCERT under Ministry of Education, Government of India, revolutionizing education through technology and professional development
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              onClick={handleVisitDIKSHA}
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Access DIKSHA Portal
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              onClick={handleDownloadApp}
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Download App
            </Button>
          </div>
        </div>

        {/* What is DIKSHA */}
        <Card className="border-indigo-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 sm:mr-3" />
              What is DIKSHA?
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 md:space-y-6">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              DIKSHA (Digital Infrastructure for Knowledge Sharing) is India's national digital platform for school education, 
              launched on September 5, 2017. It serves as a comprehensive ecosystem that connects teachers, students, parents, 
              and education officials across the country through curriculum-aligned resources and professional development programs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg">
                <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">National Reach</h3>
                <p className="text-xs sm:text-sm text-gray-600">Adopted by 35+ states and UTs across India</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Massive Scale</h3>
                <p className="text-xs sm:text-sm text-gray-600">Serves crores of learners and teachers nationwide</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Rich Content</h3>
                <p className="text-xs sm:text-sm text-gray-600">2,91,000+ e-contents and 6,477 QR-coded textbooks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Needs DIKSHA */}
        <Card className="border-green-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 sm:mr-3" />
              Who Needs DIKSHA Training?
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">School Teachers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">All stages: pre-primary to senior secondary</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">Mandatory CPD</Badge>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">School Leaders</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Principals, headmasters, administrators</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Leadership Development</Badge>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Teacher Educators</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Faculty at Teacher Education Institutes</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700 text-xs">Professional Growth</Badge>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow sm:col-span-2 xl:col-span-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Monitor className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Student Teachers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">B.Ed, M.Ed, D.El.Ed students</p>
                  <Badge className="mt-2 bg-orange-100 text-orange-700 text-xs">Career Preparation</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 sm:mr-2" />
                NEP 2020 Requirement
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                National Education Policy 2020 mandates <strong>50 hours of Continuous Professional Development (CPD)</strong> 
                annually for all educators to stay updated with modern pedagogical practices and innovations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Career & Classification Benefits */}
        <Card className="border-purple-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 sm:mr-3" />
              What DIKSHA Adds to Your Career
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 sm:mr-2" />
                  Professional Recognition
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Official certificates from NCERT, CBSE, and State Education Boards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Digital credentials recognized nationwide for promotions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Professional portfolio tracking throughout career lifecycle</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Compliance with mandatory CPD requirements</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 sm:mr-2" />
                  Career Advancement
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Enhanced teaching methodology and classroom management skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Digital literacy and 21st-century teaching competencies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Leadership and administrative skills development</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Access to latest educational research and best practices</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-3 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 text-sm sm:text-base">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 sm:mr-2" />
                Professional Classification Benefits
              </h3>
              <p className="text-indigo-800 text-sm sm:text-base leading-relaxed">
                DIKSHA training is often considered for teacher appraisals, performance evaluations, and career progression. 
                Completed courses demonstrate commitment to professional growth and align with government initiatives like 
                NISHTHA, making educators eligible for advanced roles and recognition programs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advantages & Features */}
        <Card className="border-blue-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 sm:mr-3" />
              Key Advantages & Features
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* For Teachers */}
              <Card className="border-green-200">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-green-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    For Teachers
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Interactive teaching materials and best practices</span>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Professional development courses with certification</span>
                  </div>
                  <div className="flex items-start">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Career progression tracking and skill mapping</span>
                  </div>
                  <div className="flex items-start">
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Community engagement with fellow educators</span>
                  </div>
                </CardContent>
              </Card>

              {/* For Students */}
              <Card className="border-blue-200">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-blue-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    For Students
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Interactive lessons with 2D/3D visual content</span>
                  </div>
                  <div className="flex items-start">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Self-assessment exercises and practice quizzes</span>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Complete K-12 curriculum coverage</span>
                  </div>
                  <div className="flex items-start">
                    <Languages className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Content available in multiple Indian languages</span>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Features */}
              <Card className="border-purple-200 lg:col-span-1">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-purple-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    Platform Features
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Available on web and mobile (Android/iOS)</span>
                  </div>
                  <div className="flex items-start">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Offline content access and synchronization</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Secure, government-backed platform</span>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Completely free for all users</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 text-base sm:text-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 sm:mr-2" />
                Popular Training Programs
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-700 mb-2 text-xs sm:text-sm">NISHTHA</Badge>
                  <p className="text-xs sm:text-sm text-gray-600">Foundational Literacy & Numeracy</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-700 mb-2 text-xs sm:text-sm">CPD Programs</Badge>
                  <p className="text-xs sm:text-sm text-gray-600">Continuous Professional Development</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-purple-100 text-purple-700 mb-2 text-xs sm:text-sm">Subject Specific</Badge>
                  <p className="text-xs sm:text-sm text-gray-600">Mathematics, Science, Language</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-orange-100 text-orange-700 mb-2 text-xs sm:text-sm">Leadership</Badge>
                  <p className="text-xs sm:text-sm text-gray-600">School Management & Leadership</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Teaching Career?
            </h2>
            <p className="text-gray-600 mb-6 text-base sm:text-lg max-w-3xl mx-auto px-2">
              Join millions of educators across India who are enhancing their skills, earning certifications, 
              and advancing their careers through DIKSHA's comprehensive professional development programs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={handleVisitDIKSHA}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start Your Journey Today
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={handleDownloadApp}
              >
                <Laptop className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Get Mobile App
              </Button>
            </div>

            <div className="mt-6 p-3 sm:p-4 bg-white rounded-lg border border-indigo-200 inline-block">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Access DIKSHA Portal:</p>
              <p className="font-mono text-indigo-600 text-xs sm:text-sm break-all">https://diksha.gov.in</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1 sm:mb-2">35+</div>
              <div className="text-xs sm:text-sm text-gray-600">States & UTs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">3L+</div>
              <div className="text-xs sm:text-sm text-gray-600">Teachers Trained</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">2.9L+</div>
              <div className="text-xs sm:text-sm text-gray-600">Digital Contents</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">6K+</div>
              <div className="text-xs sm:text-sm text-gray-600">QR-Coded Books</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
