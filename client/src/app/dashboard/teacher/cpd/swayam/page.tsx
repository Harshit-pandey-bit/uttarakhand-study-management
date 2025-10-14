'use client';

import { ExternalLink, BookOpen, Award, Users, TrendingUp, Sparkles, Globe, GraduationCap, Video, FileText, MessageSquare, CheckCircle, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SwayamPage() {
  const handleVisitPortal = () => {
    window.open('https://swayam.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="space-y-3 sm:space-y-4">
              <Badge variant="secondary" className="text-xs sm:text-sm bg-cyan-100 text-cyan-700 border-cyan-200 w-fit">
                Study Webs of Active-Learning for Young Aspiring Minds
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                SWAYAM Portal
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
                India's National MOOCs Platform for Quality Education
              </p>
            </div>
            <Button 
              onClick={handleVisitPortal} 
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
            >
              Visit SWAYAM Portal
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">2000+</div>
              <div className="text-xs sm:text-sm opacity-90">MOOCs Available</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">30M+</div>
              <div className="text-xs sm:text-sm opacity-90">Target Learners</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">1000+</div>
              <div className="text-xs sm:text-sm opacity-90">Expert Faculty</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">Free</div>
              <div className="text-xs sm:text-sm opacity-90">All Courses</div>
            </div>
          </div>
        </div>

        {/* What is SWAYAM Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">What is SWAYAM?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              SWAYAM (Study Webs of Active-Learning for Young Aspiring Minds) is a programme initiated by the Government of India and designed to achieve the three cardinal principles of Education Policy: access, equity, and quality[web:60][web:62]. It is India's national platform for Massive Open Online Courses (MOOCs), developed by the Ministry of Education in collaboration with NPTEL and IIT Madras[web:60].
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The platform facilitates hosting of all courses taught in classrooms from Class 9 till post-graduation, accessible by anyone, anywhere, at any time[web:60]. All courses are interactive, prepared by the best teachers in the country, and available free of cost to any learner[web:57]. SWAYAM seeks to bridge the digital divide for students who have remained untouched by the digital revolution and enable them to join the mainstream of the knowledge economy[web:57][web:58].
            </p>
          </CardContent>
        </Card>

        {/* Four Quadrants Approach */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Four-Quadrant Learning Model</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Comprehensive approach to online education
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border-2 border-cyan-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-500 rounded-lg">
                    <Video className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Video Lectures</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Engaging high-quality video presentations by expert mentors from top universities and institutions, facilitating effective interactive learning experiences[web:59][web:60]
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Reading Material</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Specially prepared e-materials like PDFs and PPTs that can be easily downloaded and printed for offline learning and revision through self-reading[web:58][web:59]
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Self-Assessment Tests</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Regular tests and quizzes to gauge understanding comprehensively, evaluate performance effectively, and track learning progress throughout the course[web:58][web:59]
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border-2 border-teal-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-teal-500 rounded-lg">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Discussion Forum</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Online platform for learners to actively engage, clear subject-related doubts with mentors and peers, fostering interactive collaborative learning[web:58][web:59]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Objectives Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Key Objectives of SWAYAM</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 border-2 border-cyan-200 rounded-xl bg-gradient-to-br from-white to-cyan-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Bridge Digital Divide</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Enable students untouched by digital revolution to join the mainstream knowledge economy[web:58]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Access & Equity</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Take best teaching-learning resources to all, including the most disadvantaged learners[web:57]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-white to-indigo-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Quality Education</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Provide superior learning experience with multimedia content accessible anytime, anywhere[web:58]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-teal-200 rounded-xl bg-gradient-to-br from-white to-teal-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Employability Focus</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Make students employable in industry or well-prepared for higher education pursuits[web:58]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Advanced System</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Establish seamless access, progress monitoring, and certification facilitation system[web:58]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-pink-200 rounded-xl bg-gradient-to-br from-white to-pink-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Peer Interaction</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Foster opportunities for peer engagement through discussion forums to address queries[web:58]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* National Coordinators */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">National Coordinators</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Ten appointed coordinators ensuring best quality content
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { category: "School Education", orgs: ["NIOS", "NCERT"], color: "cyan" },
                { category: "Out-of-School Education", orgs: ["IGNOU", "NITTTR"], color: "blue" },
                { category: "Under-Graduate Education", orgs: ["NPTEL", "AICTE", "CEC", "IIMB"], color: "indigo" },
                { category: "Post-Graduate Education", orgs: ["NPTEL", "AICTE", "IIMB", "UGC"], color: "teal" },
                { category: "Non-Technical Education", orgs: ["INI", "UGC"], color: "purple" }
              ].map((item, index) => (
                <div key={index} className={`p-4 sm:p-5 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-xl border border-${item.color}-200`}>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base text-gray-800">{item.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.orgs.map((org, idx) => (
                      <Badge key={idx} variant="outline" className={`bg-white text-${item.color}-700 border-${item.color}-300 text-xs`}>
                        {org}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-4">
              More than 1,000 specially chosen faculty and teachers from across the country participate in preparing SWAYAM courses[web:60][web:69]
            </p>
          </CardContent>
        </Card>

        {/* Key Features Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Key Features of SWAYAM</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "Accessible Mobile Learning",
                  description: "Learning easily accessible from any location through internet-connected devices, serving as a hub for interactive e-content with flexibility",
                  icon: Smartphone,
                  color: "cyan"
                },
                {
                  title: "Audio-Visual Multimedia Content",
                  description: "Courses presented in audio-visual multimedia format using state-of-the-art pedagogy and technology, enhancing accessibility and enriching learning experience",
                  icon: Video,
                  color: "blue"
                },
                {
                  title: "Certificate Courses",
                  description: "Platform monitors student progress and issues certificates upon successful completion of online proctored exams, providing tangible achievement recognition",
                  icon: Award,
                  color: "indigo"
                },
                {
                  title: "Quality Assurance",
                  description: "Courses designed by renowned professors and faculties from top universities, maintaining high-quality standards of traditional classroom teaching",
                  icon: CheckCircle,
                  color: "teal"
                },
                {
                  title: "Free of Cost Education",
                  description: "All courses available without any charges, fostering inclusive access to education with no hidden fees or subscription requirements",
                  icon: Sparkles,
                  color: "purple"
                },
                {
                  title: "Credit Transfer Recognition",
                  description: "UGC regulations permit transfer of credits earned from SWAYAM courses to students' academic records in their respective institutions (up to 20%)",
                  icon: TrendingUp,
                  color: "pink"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all">
                    <div className={`p-2 bg-${item.color}-500 rounded-lg flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 text-sm sm:text-base text-gray-800">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{item.description}[web:58][web:60]</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-cyan-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">For Teachers & Educators</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1 text-lg">✓</span>
                  <span>Access NCERT courses on SWAYAM for professional development from Class IX to XII school education[web:59]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1 text-lg">✓</span>
                  <span>Free interactive courses prepared by nation's most esteemed educators available at no cost[web:59]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1 text-lg">✓</span>
                  <span>Enhance teaching methodologies through advanced pedagogy and technology integration courses[web:57]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1 text-lg">✓</span>
                  <span>Upskill with specialized courses to stay updated with modern educational practices and methodologies[web:61]</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">For Students & Learners</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Learn from Class 9 to post-graduation with access to courses from top universities and institutions[web:57]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Self-paced learning anytime, anywhere with downloadable materials for offline study convenience[web:61]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Earn certificates from recognized institutions after completing courses and passing proctored exams[web:58]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-lg">✓</span>
                  <span>Transfer credits to your academic record with UGC and AICTE recognition (up to 20% online courses)[web:62]</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Course Categories */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Available Course Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                "Engineering",
                "Science",
                "Humanities",
                "Social Sciences",
                "Management",
                "Law",
                "School Education (9-12)",
                "Languages",
                "Mathematics",
                "Computer Science",
                "Agriculture",
                "Environmental Studies",
                "Commerce",
                "Interdisciplinary",
                "Skill Development",
                "Teacher Training"
              ].map((category, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gradient-to-r from-cyan-50 to-white rounded-lg border border-cyan-200 hover:shadow-md transition-all">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">{category}</span>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-4">
              Over 2,000 MOOCs covering diverse subjects from school to post-graduation levels[web:62][web:64]
            </p>
          </CardContent>
        </Card>

        {/* Platform Access Section */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Access SWAYAM Platform</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Multiple ways to access quality education
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-cyan-200 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-base sm:text-lg text-gray-800 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-cyan-600" />
                  SWAYAM Web Portal
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">Access from any browser with over 2,000 courses from Class 9 to post-graduation</p>
              </div>
              <Button 
                onClick={handleVisitPortal} 
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 flex items-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
              >
                Visit Portal
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 sm:p-6 border-2 border-blue-200 rounded-xl bg-white">
              <h4 className="font-semibold mb-3 text-base sm:text-lg text-gray-800 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Mobile & Additional Platforms
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Download SWAYAM mobile app from Google Play Store for Android devices for learning on-the-go[web:66]</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Access specialized courses through SWAYAM Plus portal for industry-aligned skill development[web:61]</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>NPTEL courses available at onlinecourses.nptel.ac.in for engineering and science subjects[web:63]</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Integration with DIKSHA platform for seamless access across school and higher education spectrum[web:57]</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-300">Free Courses</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Mobile App</Badge>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">Credit Transfer</Badge>
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-300">Certificates</Badge>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-2 border-indigo-200 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
              <h4 className="font-semibold mb-3 text-base sm:text-lg text-gray-800">How to Get Started</h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 bg-cyan-500 text-white rounded-full text-xs font-semibold flex-shrink-0">1</div>
                  <span>Register for free at swayam.gov.in - no eligibility requirements[web:58]</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold flex-shrink-0">2</div>
                  <span>Browse 2,000+ courses and enroll in courses that match your learning goals[web:62]</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold flex-shrink-0">3</div>
                  <span>Access all course materials free of cost and learn at your own pace[web:60]</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 bg-teal-500 text-white rounded-full text-xs font-semibold flex-shrink-0">4</div>
                  <span>Complete courses and register for optional proctored exams for certification[web:60]</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
