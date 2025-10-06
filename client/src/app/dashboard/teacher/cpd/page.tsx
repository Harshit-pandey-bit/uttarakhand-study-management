
'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
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
  GraduationCap,
  Shield,
  Heart,
  Monitor,
  Calculator,
  Microscope,
  Map,
  Languages,
  UserCheck,
  Share2,
  BarChart3,
  Target,
  ArrowRight,
  Lightbulb,
  Zap,
  Phone,
  Laptop,
  BookOpen,
  Trophy,
  Clock,
  Bell
} from 'lucide-react';

export default function ProfessionalDevelopmentInfoPage() {

  const handleAccessPortal = () => {
    // Replace with your actual professional development portal URL
    window.open('/dashboard/teacher/professional-development', '_blank');
  };

  const handleStartDIKSHA = () => {
    window.open('https://diksha.gov.in', '_blank');
  };

  const handleStartNISHTHA = () => {
    window.open('https://itpd.ncert.gov.in', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">Professional Development</h1>
            <p className="text-lg text-indigo-600 font-medium">Continuous Learning for Educational Excellence</p>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Mandatory continuous professional development as per NEP 2020, empowering educators with modern pedagogies, 
          enhanced skills, and career advancement opportunities
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg"
            onClick={handleAccessPortal}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Access PD Portal
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-lg"
            onClick={handleStartDIKSHA}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Start DIKSHA Training
          </Button>
        </div>
      </div>

      {/* What is Professional Development */}
      <Card className="border-indigo-100">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="h-8 w-8 text-indigo-600 mr-3" />
            What is Professional Development?
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            Professional Development (PD) for teachers is a comprehensive, ongoing process of skill enhancement, 
            knowledge updating, and competency building that ensures educators remain effective, current, and 
            capable of delivering quality education. As mandated by NEP 2020, it's now a compulsory requirement 
            for all teaching professionals in India.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">50 Hours Annually</h3>
              <p className="text-sm text-gray-600">Mandatory as per NEP 2020 for all teachers</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Skill Enhancement</h3>
              <p className="text-sm text-gray-600">Latest pedagogies and teaching methodologies</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-sm text-gray-600">Promotions, salary hikes, and recognition</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEP 2020 Mandate */}
      <Card className="border-yellow-100 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-yellow-600 mr-3" />
            NEP 2020 Compliance Requirement
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-white rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Mandatory 50 Hours CPD</h3>
                <p className="text-gray-700 mb-3">
                  Para 5.15 of NEP 2020 mandates that <strong>every teacher must participate in at least 50 hours 
                  of Continuous Professional Development (CPD) opportunities annually</strong> for their professional growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">30 hours face-to-face training</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">20 hours online/distance mode</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Required for promotions & salary scales</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Monitored & verified by authorities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Who Needs Professional Development */}
      <Card className="border-green-100">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            Who Must Complete Professional Development?
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">All Teachers</h3>
                <p className="text-sm text-gray-600">Primary, Secondary, Senior Secondary</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700">Mandatory</Badge>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Head Teachers</h3>
                <p className="text-sm text-gray-600">Principals, Vice-Principals, HMs</p>
                <Badge className="mt-2 bg-green-100 text-green-700">Leadership CPD</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Educators</h3>
                <p className="text-sm text-gray-600">B.Ed, M.Ed Faculty & Trainers</p>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Advanced PD</Badge>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Monitor className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">All Education Boards</h3>
                <p className="text-sm text-gray-600">CBSE, ICSE, State Boards, KVS, NVS</p>
                <Badge className="mt-2 bg-orange-100 text-orange-700">Universal</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center">
              <Bell className="h-5 w-5 text-red-600 mr-2" />
              Important Notice
            </h3>
            <p className="text-red-800">
              <strong>Non-compliance with CPD requirements may affect:</strong> Teacher appraisals, promotion eligibility, 
              salary increments, performance evaluations, and career progression opportunities. All educational institutions 
              are required to maintain detailed records for verification.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Career & Classification Benefits */}
      <Card className="border-purple-100">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            Career Advancement & Classification Benefits
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Trophy className="h-6 w-6 text-purple-600 mr-2" />
                Direct Career Benefits
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Promotion Eligibility:</strong> CPD completion replaces 21-day in-service courses for senior scale/selection grade</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Salary Increments:</strong> Enhanced pay scales and allowances for skilled teachers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Performance Appraisals:</strong> Higher ratings in teacher evaluation systems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Leadership Roles:</strong> Access to administrative and supervisory positions</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-6 w-6 text-purple-600 mr-2" />
                Professional Recognition
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>NCERT Certificates:</strong> Nationally recognized credentials from premier education body</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Digital Badges:</strong> Verifiable micro-credentials for specific competencies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Portfolio Building:</strong> Comprehensive professional development record</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Career Mobility:</strong> Enhanced opportunities across institutions and states</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Advantages */}
      <Card className="border-blue-100">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 text-blue-600 mr-3" />
            Key Advantages of Professional Development
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pedagogical Excellence */}
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-green-700 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Pedagogical Excellence
                </h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <Video className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Latest teaching methodologies and best practices</span>
                </div>
                <div className="flex items-start">
                  <Target className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Competency-based learning and outcome-focused teaching</span>
                </div>
                <div className="flex items-start">
                  <Heart className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Arts-integrated and experiential learning approaches</span>
                </div>
                <div className="flex items-start">
                  <FileText className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Formative and adaptive assessment techniques</span>
                </div>
              </CardContent>
            </Card>

            {/* Technology Integration */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-blue-700 flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Technology Integration
                </h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <Laptop className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Digital literacy and ICT integration in teaching</span>
                </div>
                <div className="flex items-start">
                  <Globe className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Online learning platforms and virtual classroom management</span>
                </div>
                <div className="flex items-start">
                  <Brain className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>AI-powered educational tools and analytics</span>
                </div>
                <div className="flex items-start">
                  <Share2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Collaborative learning and peer networking</span>
                </div>
              </CardContent>
            </Card>

            {/* Personal Growth */}
            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-purple-700 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Personal & Professional Growth
                </h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <Trophy className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enhanced job satisfaction and reduced burnout</span>
                </div>
                <div className="flex items-start">
                  <Users className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Leadership skills and team management capabilities</span>
                </div>
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Improved classroom management and discipline</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Better work-life balance and stress management</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
              <Award className="h-6 w-6 text-indigo-600 mr-2" />
              Available Training Programs & Platforms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge className="bg-blue-100 text-blue-700 mb-2">DIKSHA</Badge>
                <p className="text-sm text-gray-600">National Digital Platform</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-700 mb-2">NISHTHA</Badge>
                <p className="text-sm text-gray-600">Integrated Teacher Training</p>
              </div>
              <div className="text-center">
                <Badge className="bg-purple-100 text-purple-700 mb-2">SWAYAM</Badge>
                <p className="text-sm text-gray-600">Massive Open Online Courses</p>
              </div>
              <div className="text-center">
                <Badge className="bg-orange-100 text-orange-700 mb-2">CBSE COE</Badge>
                <p className="text-sm text-gray-600">Center of Excellence Programs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Advance Your Teaching Career?
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-3xl mx-auto">
            Join millions of educators across India who are fulfilling their NEP 2020 CPD requirements while 
            enhancing their skills, earning certifications, and advancing their careers through structured 
            professional development programs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg"
              onClick={handleAccessPortal}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Start Your Professional Development
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-8 py-4 text-lg"
              onClick={handleStartNISHTHA}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Explore NISHTHA Programs
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <p className="text-sm text-gray-600 mb-1">Access Training Portal:</p>
              <p className="font-mono text-indigo-600 text-sm">Your Institution's PD Platform</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <p className="text-sm text-gray-600 mb-1">Complete 50 Hours CPD:</p>
              <p className="font-mono text-indigo-600 text-sm">As per NEP 2020 Mandate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">50</div>
            <div className="text-sm text-gray-600">Hours Annual CPD</div>
            <div className="text-xs text-gray-500 mt-1">NEP 2020 Mandate</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Teacher Coverage</div>
            <div className="text-xs text-gray-500 mt-1">All Education Boards</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
            <div className="text-sm text-gray-600">Training Platforms</div>
            <div className="text-xs text-gray-500 mt-1">Online & Offline</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
            <div className="text-sm text-gray-600">Career Growth</div>
            <div className="text-xs text-gray-500 mt-1">Lifelong Learning</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
