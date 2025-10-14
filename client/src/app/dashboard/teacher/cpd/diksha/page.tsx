'use client';

import { ExternalLink, BookOpen, Award, Users, TrendingUp, Sparkles, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DikshaPage() {
  const handleVisitPortal = () => {
    window.open('https://diksha.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="space-y-3 sm:space-y-4">
              <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-700 border-blue-200 w-fit">
                One Nation, One Digital Platform
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                DIKSHA Portal
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
                Digital Infrastructure for Knowledge Sharing
              </p>
            </div>
            <Button 
              onClick={handleVisitPortal} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
            >
              Visit DIKSHA Portal
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">36+</div>
              <div className="text-xs sm:text-sm opacity-90">Languages</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">All States</div>
              <div className="text-xs sm:text-sm opacity-90">& UTs Covered</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">Free</div>
              <div className="text-xs sm:text-sm opacity-90">Resources</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">NCERT</div>
              <div className="text-xs sm:text-sm opacity-90">Initiative</div>
            </div>
          </div>
        </div>

        {/* What is DIKSHA Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">What is DIKSHA?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              DIKSHA is India's national digital platform for school education, developed and maintained by NCERT under the Ministry of Education, Government of India[web:3]. Launched on September 5, 2017, by the Vice President of India, it serves as a comprehensive digital infrastructure designed to provide open educational resources, large-scale teacher professional development, and analytics in 36 Indian languages[web:3][web:21].
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The platform was declared India's "One Nation, One Digital Platform" for school education in May 2020 as part of the PM e-Vidya programme during the COVID-19 pandemic[web:3]. It has been adopted by almost all States, Union Territories, and central autonomous bodies including CBSE[web:3].
            </p>
          </CardContent>
        </Card>

        {/* Why DIKSHA is Important Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Why DIKSHA is Important for Teachers</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Professional Development</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">●</span>
                    <span>Access training courses and earn certificates from state or central educational bodies for continuous professional development[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">●</span>
                    <span>Digital credentialing supports career progression and ensures teachers stay updated with modern pedagogical practices[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">●</span>
                    <span>Built considering the whole teacher's life cycle from enrollment in Teacher Education Institutes to retirement[web:12]</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Teaching Resources</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">●</span>
                    <span>Find interactive and engaging teaching material including lesson plans, concept videos, and worksheets mapped to curriculum[web:3]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">●</span>
                    <span>Access teaching aids, assessment tools, and classroom content aligned with learning outcomes[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">●</span>
                    <span>Conduct digital assessments to check students' understanding of topics taught[web:3]</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Collaboration & Community</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Share best practices with other teachers to explain difficult concepts to students[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Create and contribute digital content based on classroom experiences to a rich repository of localized learning resources[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Receive official announcements from the state department and connect with the teacher community[web:12]</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Career Management</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>View teaching history across your entire career as a school teacher[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>Map out career progression and work on skills accordingly throughout your professional journey[web:12]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>Enables, accelerates and amplifies solutions in the realm of teacher education at national scale[web:12]</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Key Features of DIKSHA</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">QR Code Integration</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Access digital content by scanning QR codes provided in NCERT textbooks for instant suggestions and study topics[web:3]
                </p>
              </div>
              
              <div className="p-4 sm:p-5 border-2 border-green-200 rounded-xl bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Multi-Language Support</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Available in 36 Indian languages including English, Hindi, Marathi, Tamil, Telugu ensuring accessibility for all[web:3]
                </p>
              </div>
              
              <div className="p-4 sm:p-5 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Location-Based Content</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Provides region-specific courses and content based on location and local curriculum requirements[web:3]
                </p>
              </div>
              
              <div className="p-4 sm:p-5 border-2 border-orange-200 rounded-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Class-Based Resources</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Study material organized by class and subject, aligned with prescribed school curriculum[web:3]
                </p>
              </div>
              
              <div className="p-4 sm:p-5 border-2 border-pink-200 rounded-xl bg-gradient-to-br from-white to-pink-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Open Educational Resources</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  NCERT textbooks licensed under CC BY-NC-ND and all resources under CC BY-NC-SA for free access[web:3]
                </p>
              </div>
              
              <div className="p-4 sm:p-5 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-white to-indigo-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                  <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Cross-Platform Access</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Available as web platform and mobile apps for Android and iOS for learning anytime, anywhere[web:3]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Capabilities Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Platform Capabilities</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              What you can do on DIKSHA as an educator
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "Professional Training Courses",
                  description: "Training on learning outcomes, Continuous and Comprehensive Evaluation (CCE), and other pedagogical approaches",
                  color: "blue"
                },
                {
                  title: "Assessment Resources",
                  description: "Assessments for teachers to find out strengths and areas of improvement with immediate feedback",
                  color: "green"
                },
                {
                  title: "Content Creation & Sharing",
                  description: "Teachers can create and share their own content, fostering a collaborative learning environment",
                  color: "purple"
                },
                {
                  title: "Dashboards & Analytics",
                  description: "Track progress and assessment with comprehensive dashboards for data-driven decision making",
                  color: "orange"
                },
                {
                  title: "Communities & Collaboration",
                  description: "Join communities for collaboration, discussions, and sharing best practices with fellow educators",
                  color: "pink"
                },
                {
                  title: "Official Communications",
                  description: "Receive announcements, notifications, and circulars from education departments",
                  color: "indigo"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all">
                  <div className={`h-2 w-2 rounded-full bg-${item.color}-500 mt-2 flex-shrink-0`} />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-sm sm:text-base text-gray-800">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{item.description}[web:12]</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Benefits for Students</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Understand concepts in easy and interactive manner with engaging videos, worksheets, and quizzes[web:3]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Revise lessons learned in class and find additional material for difficult topics[web:3]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Practice solving problems with immediate feedback and self-assessment exercises[web:3]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Access NCERT and state board aligned content from primary to senior secondary levels[web:3]</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Benefits for Parents</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <span>Follow classroom activities and clear doubts outside school hours through one-to-one sessions[web:12]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <span>Access comprehensive platform for hassle-free interaction with teachers and tracking student progress[web:3]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-lg">✓</span>
                  <span>Support children's learning with engaging material relevant to prescribed curriculum[web:3]</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Platform Access Section */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Access DIKSHA Platform</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Available across multiple platforms for convenient access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-blue-200 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-base sm:text-lg text-gray-800">Web Portal</h4>
                <p className="text-xs sm:text-sm text-gray-600">Access from any browser on desktop or mobile</p>
              </div>
              <Button 
                onClick={handleVisitPortal} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
              >
                Visit Portal
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 sm:p-6 border-2 border-purple-200 rounded-xl bg-white">
              <h4 className="font-semibold mb-3 text-base sm:text-lg text-gray-800">Mobile Apps</h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Download the DIKSHA app from Google Play Store (Android) or Apple App Store (iOS) for on-the-go access[web:3]
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Android</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">iOS</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">36 Languages</Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Free Access</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
