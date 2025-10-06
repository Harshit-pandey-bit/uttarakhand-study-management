
'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  BookOpen, 
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
  Monitor,
  Calculator,
  Microscope,
  Languages,
  UserCheck,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Play,
  Palette
} from 'lucide-react';

export default function NISTHTHAInfoPage() {
  const handleAccessNISHTHA = () => {
    // Official NISHTHA portal on DIKSHA
    window.open('https://diksha.gov.in/nishtha', '_blank');
  };

  const handleStartDIKSHA = () => {
    window.open('https://diksha.gov.in', '_blank');
  };

  const handleViewModules = () => {
    window.open('https://itpd.ncert.gov.in', '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">NISHTHA Training Program</h1>
              <p className="text-sm sm:text-base lg:text-lg text-emerald-600 font-medium">National Initiative for School Heads' and Teachers' Holistic Advancement</p>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-2">
            World's largest teachers' training program designed to build competencies among 4.2+ million teachers 
            and school principals, fulfilling NEP 2020's 50-hour CPD mandate through comprehensive online modules
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              onClick={handleAccessNISHTHA}
            >
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Access NISHTHA Portal
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              onClick={handleStartDIKSHA}
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start on DIKSHA
            </Button>
          </div>
        </div>

        {/* What is NISHTHA */}
        <Card className="border-emerald-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 sm:mr-3" />
              What is NISHTHA?
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 md:space-y-6">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              NISHTHA (National Initiative for School Heads' and Teachers' Holistic Advancement) is the world's 
              largest integrated teacher training program launched by the Ministry of Education under Samagra Shiksha. 
              It's designed to build competencies among teachers and school principals at all education levels, 
              covering 4.2+ million educators across India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-lg">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">4.2+ Million Teachers</h3>
                <p className="text-xs sm:text-sm text-gray-600">Largest capacity building program globally</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg">
                <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">11+ Languages</h3>
                <p className="text-xs sm:text-sm text-gray-600">Accessible in regional languages</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">4 Training Phases</h3>
                <p className="text-xs sm:text-sm text-gray-600">Elementary, Secondary, FLN, and ECCE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEP 2020 Mandate */}
        <Card className="border-yellow-100 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 sm:mr-3" />
              NEP 2020 Compliance & CPD Requirements
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg border border-yellow-200">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full mx-auto sm:mx-0">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Mandatory 50 Hours Professional Development</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                    NEP 2020 mandates that every teacher and head teacher must participate in at least 50 hours 
                    of Continuous Professional Development annually. NISHTHA directly fulfills this requirement 
                    through structured online modules on DIKSHA platform.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center justify-center sm:justify-start">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Latest pedagogical approaches</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Competency-based learning methods</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">ICT integration in teaching</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Inclusive education practices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Needs NISHTHA Training */}
        <Card className="border-green-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 sm:mr-3" />
              Who Must Complete NISHTHA Training?
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-emerald-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Elementary Teachers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Classes 1-8 (NISHTHA 1.0)</p>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 text-xs">18 Modules</Badge>
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Secondary Teachers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Classes 9-12 (NISHTHA 2.0)</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">13 Modules</Badge>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">FLN Teachers</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Foundational Literacy & Numeracy (3.0)</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700 text-xs">12 Modules</Badge>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow sm:col-span-2 xl:col-span-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">ECCE Educators</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Early Childhood Care & Education (4.0)</p>
                  <Badge className="mt-2 bg-orange-100 text-orange-700 text-xs">6 Modules</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-3 text-sm sm:text-base">School Leadership</h3>
                <ul className="space-y-2 text-emerald-800">
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    Head Teachers & Principals
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    Block Resource Coordinators (BRC)
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    Cluster Resource Coordinators (CRC)
                  </li>
                </ul>
              </div>

              <div className="p-4 sm:p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">Educational Bodies</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    SCERT & DIET Faculty
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    CBSE, KVS, NVS Teachers
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    State Board Educators
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career & Classification Benefits */}
        <Card className="border-purple-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 sm:mr-3" />
              Career Advancement & Classification Benefits
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
                    <span className="text-sm sm:text-base"><strong>NCERT Certificates:</strong> Nationally recognized credentials for each completed module</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>CPD Hour Credits:</strong> Automatic fulfillment of NEP 2020's 50-hour requirement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Digital Portfolio:</strong> Comprehensive professional development record</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Leadership Training:</strong> Specialized modules for administrative roles</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 sm:mr-2" />
                  Career Progression
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Promotion Eligibility:</strong> Enhanced qualifications for senior positions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Performance Appraisals:</strong> Higher ratings in teacher evaluation systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Salary Benefits:</strong> Improved pay scales and professional allowances</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Inter-State Mobility:</strong> Recognized qualifications across all states</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 text-sm sm:text-base">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 sm:mr-2" />
                Special Recognition Programs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="p-3 bg-white rounded border border-purple-100">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-purple-800">Master Trainer Status</p>
                </div>
                <div className="p-3 bg-white rounded border border-purple-100">
                  <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-purple-800">Resource Person Role</p>
                </div>
                <div className="p-3 bg-white rounded border border-purple-100 sm:col-span-1">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-purple-800">Excellence Awards</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Advantages */}
        <Card className="border-blue-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 sm:mr-3" />
              Key Advantages of NISHTHA Training
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Pedagogical Excellence */}
              <Card className="border-emerald-200">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-emerald-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    Modern Pedagogies
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Competency-based learning approaches</span>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Arts-integrated and experiential learning</span>
                  </div>
                  <div className="flex items-start">
                    <Palette className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Joyful and activity-based teaching methods</span>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Formative and adaptive assessment</span>
                  </div>
                </CardContent>
              </Card>

              {/* Technology Integration */}
              <Card className="border-blue-200">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-blue-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    Digital Literacy
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">ICT integration in teaching-learning</span>
                  </div>
                  <div className="flex items-start">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Digital content creation and curation</span>
                  </div>
                  <div className="flex items-start">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Online learning platforms proficiency</span>
                  </div>
                  <div className="flex items-start">
                    <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Virtual classroom management</span>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Skills */}
              <Card className="border-purple-200 lg:col-span-1">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <h3 className="font-semibold text-purple-700 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 text-sm sm:text-base">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    Professional Skills
                  </h3>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Inclusive education and diversity management</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">School safety and security protocols</span>
                  </div>
                  <div className="flex items-start">
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Critical thinking and problem-solving</span>
                  </div>
                  <div className="flex items-start">
                    <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">First-level counseling capabilities</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* NISHTHA Program Phases */}
        <Card className="border-orange-100">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 sm:mr-3" />
              NISHTHA Training Phases & Coverage
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Phase Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">1.0</div>
                    <div className="text-xs sm:text-sm font-medium text-emerald-800">Elementary</div>
                    <div className="text-xs text-emerald-600 mt-1">Classes 1-8</div>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-700 text-xs">18 Modules</Badge>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">2.0</div>
                    <div className="text-xs sm:text-sm font-medium text-blue-800">Secondary</div>
                    <div className="text-xs text-blue-600 mt-1">Classes 9-12</div>
                    <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">13 Modules</Badge>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">3.0</div>
                    <div className="text-xs sm:text-sm font-medium text-purple-800">FLN Mission</div>
                    <div className="text-xs text-purple-600 mt-1">NIPUN Bharat</div>
                    <Badge className="mt-2 bg-purple-100 text-purple-700 text-xs">12 Modules</Badge>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">4.0</div>
                    <div className="text-xs sm:text-sm font-medium text-orange-800">ECCE</div>
                    <div className="text-xs text-orange-600 mt-1">Early Childhood</div>
                    <Badge className="mt-2 bg-orange-100 text-orange-700 text-xs">6 Modules</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Coverage Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">4.2M+</div>
                  <div className="text-xs sm:text-sm text-emerald-700">Teachers Covered</div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">36</div>
                  <div className="text-xs sm:text-sm text-blue-700">States & UTs</div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">11</div>
                  <div className="text-xs sm:text-sm text-purple-700">Languages</div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">49</div>
                  <div className="text-xs sm:text-sm text-orange-700">Total Modules</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Ready to Begin Your NISHTHA Journey?
            </h2>
            <p className="text-gray-600 mb-6 text-base sm:text-lg max-w-3xl mx-auto px-2">
              Join 4.2+ million educators across India who have enhanced their teaching capabilities through NISHTHA. 
              Access world-class training modules, earn recognized certificates, and fulfill your NEP 2020 CPD requirements 
              while advancing your career.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={handleAccessNISHTHA}
              >
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start NISHTHA Training
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={handleViewModules}
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                View Training Modules
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-emerald-200 text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Training Platform:</p>
                <p className="font-mono text-emerald-600 text-xs sm:text-sm">DIKSHA Portal</p>
              </div>
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-emerald-200 text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Duration:</p>
                <p className="font-mono text-emerald-600 text-xs sm:text-sm">Self-Paced Learning</p>
              </div>
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-emerald-200 text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Certification:</p>
                <p className="font-mono text-emerald-600 text-xs sm:text-sm">NCERT Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">✓</div>
              <div className="text-xs sm:text-sm text-gray-600">NEP 2020</div>
              <div className="text-xs text-gray-500 mt-1">Compliant Training</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600">Online Access</div>
              <div className="text-xs text-gray-500 mt-1">DIKSHA Platform</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-gray-600">Training Cost</div>
              <div className="text-xs text-gray-500 mt-1">Government Funded</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">∞</div>
              <div className="text-xs sm:text-sm text-gray-600">Career Growth</div>
              <div className="text-xs text-gray-500 mt-1">Professional Development</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
