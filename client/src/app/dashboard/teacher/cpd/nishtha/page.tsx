'use client';

import { ExternalLink, BookOpen, Award, Users, TrendingUp, Sparkles, Globe, Target, Brain, Heart, Shield, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function NishthaPage() {
  const handleVisitPortal = () => {
    window.open('https://itpd.ncert.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Hero Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="space-y-3 sm:space-y-4">
              <Badge variant="secondary" className="text-xs sm:text-sm bg-purple-100 text-purple-700 border-purple-200 w-fit">
                World's Largest Teacher Training Programme
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                NISHTHA Programme
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
                National Initiative for School Heads' and Teachers' Holistic Advancement
              </p>
            </div>
            <Button 
              onClick={handleVisitPortal} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
            >
              Visit NISHTHA Portal
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">42 Lakh+</div>
              <div className="text-xs sm:text-sm opacity-90">Teachers Trained</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">11+</div>
              <div className="text-xs sm:text-sm opacity-90">Languages</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">4 Versions</div>
              <div className="text-xs sm:text-sm opacity-90">NISHTHA 1.0-4.0</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-90" />
              <div className="text-xl sm:text-2xl font-bold">18+</div>
              <div className="text-xs sm:text-sm opacity-90">Training Modules</div>
            </div>
          </div>
        </div>

        {/* What is NISHTHA Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-orange-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">What is NISHTHA?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              NISHTHA (National Initiative for School Heads' and Teachers' Holistic Advancement) is the world's largest teacher training programme launched in 2019 by the Ministry of Education under the Samagra Shiksha scheme[web:37][web:40]. It is a comprehensive capacity-building programme designed to improve the quality of school education through integrated teacher training[web:33].
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The programme aims to build the capacities of around 42 lakh participants, covering all teachers and heads of schools at the elementary level in all Government schools, faculty members of SCERTs and DIETs, and Block and Cluster Resource Coordinators across all States and UTs[web:40][web:35]. The training focuses on learner-centered pedagogy, learning outcomes, ICT integration, and holistic development of students[web:37].
            </p>
          </CardContent>
        </Card>

        {/* NISHTHA Versions */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">NISHTHA Versions</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Four specialized versions addressing different educational levels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold">1.0</div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Elementary Level</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Target:</span> Grades 1-8</p>
                  <p><span className="font-medium">Languages:</span> 11 Languages</p>
                  <p><span className="font-medium">Reach:</span> 24 Lakh+ Teachers Trained</p>
                  <p><span className="font-medium">Focus:</span> Foundational Teaching Skills[web:37]</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">2.0</div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Secondary Level</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Target:</span> Grades 9-12</p>
                  <p><span className="font-medium">Languages:</span> 10 Languages</p>
                  <p><span className="font-medium">Reach:</span> 10 Lakh Teachers Targeted</p>
                  <p><span className="font-medium">Focus:</span> Subject Mastery & Pedagogy[web:37]</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-2 border-pink-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-semibold">3.0</div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">NIPUN Bharat</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Target:</span> Pre-primary to Grade 5</p>
                  <p><span className="font-medium">Theme:</span> FLN (Foundational Literacy/Numeracy)</p>
                  <p><span className="font-medium">Reach:</span> 25 Lakh Teachers Targeted</p>
                  <p><span className="font-medium">Focus:</span> Play-based Learning Modules[web:37]</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm font-semibold">4.0</div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">ECCE</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p><span className="font-medium">Target:</span> Newest Initiative</p>
                  <p><span className="font-medium">Theme:</span> Early Childhood Care & Education</p>
                  <p><span className="font-medium">Audience:</span> Anganwadi + Pre-primary Teachers</p>
                  <p><span className="font-medium">Focus:</span> Holistic Development[web:37]</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Objectives Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Key Objectives of NISHTHA</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Critical Thinking</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Motivate and equip teachers to encourage and foster critical thinking in students[web:40]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-orange-200 rounded-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Learning Outcomes</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Improve learning outcomes at elementary level through integrated training programs[web:35]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-pink-200 rounded-xl bg-gradient-to-br from-white to-pink-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">ICT Integration</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Use technology including AI in teaching to improve educational methods and outcomes[web:38]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-white to-indigo-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Inclusive Education</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Ensure inclusive education with focus on health, well-being, and equal opportunities for all[web:35]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-green-200 rounded-xl bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Competency-Based Learning</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Focus on competency-based learning and testing over rote memorization[web:38]
                </p>
              </div>

              <div className="p-4 sm:p-5 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-800">Safe Environment</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Promote a healthy and safe school environment where students can learn freely[web:38]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Coverage Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Who Benefits from NISHTHA?</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Primary Participants</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Teachers at elementary and secondary levels across all government schools[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>School Heads and Principals managing educational institutions[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Block Resource Coordinators and Cluster Resource Coordinators[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>Anganwadi workers for early childhood education (NISHTHA 4.0)[web:37]</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">Institutional Faculty</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>Faculty members of State Councils of Educational Research and Training (SCERTs)[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>Faculty members of District Institutes of Education and Training (DIETs)[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>National Resource Persons from NCERT and NIEPA institutions[web:40]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">●</span>
                    <span>State and Key Resource Persons conducting training sessions[web:37]</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Features Section */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Training Features & Modules</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  "Learning Outcomes",
                  "School Based Assessment",
                  "ICT in Education",
                  "Art Integrated Learning",
                  "Inclusive Education",
                  "Environmental Studies",
                  "Mathematics Pedagogy",
                  "Science Teaching",
                  "Social Sciences",
                  "School Leadership",
                  "Pre-School Education",
                  "Health & Physical Education",
                  "Gender Issues",
                  "School Safety & Security",
                  "Pre-Vocational Education",
                  "Indian Languages",
                  "School Environment",
                  "Initiatives in School Education"
                ].map((module, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-all">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">{module}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-4">
                18+ activity-based training modules covering comprehensive teacher development areas[web:39][web:40]
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Programme Features */}
        <Card className="mb-6 sm:mb-8 border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Programme Highlights</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "Activity-Based Modules",
                  description: "Hands-on learning with motivational interactions, educational games, quizzes, and team building exercises",
                  icon: Sparkles,
                  color: "purple"
                },
                {
                  title: "Structured Training Model",
                  description: "National Resource Persons train State and Key Resource Persons who conduct sessions for teachers across the country",
                  icon: TrendingUp,
                  color: "orange"
                },
                {
                  title: "Online & Offline Access",
                  description: "Training modules available through DIKSHA and SWAYAM platforms for flexible learning",
                  icon: Globe,
                  color: "blue"
                },
                {
                  title: "Continuous Feedback Mechanism",
                  description: "In-built feedback system with training need and impact analysis through pre and post-training assessments",
                  icon: Target,
                  color: "green"
                },
                {
                  title: "Mobile App & LMS",
                  description: "MOODLE-based Learning Management System for registration, resources, monitoring, and measuring progress online",
                  icon: BookOpen,
                  color: "pink"
                },
                {
                  title: "State Customization",
                  description: "States and UTs can contextualize training modules using their own material while maintaining core topics",
                  icon: Lightbulb,
                  color: "indigo"
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
                      <p className="text-xs sm:text-sm text-gray-600">{item.description}[web:37][web:40]</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Impact & Benefits */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Impact on Teaching</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1 text-lg">✓</span>
                  <span>Shift from rote learning to competency-based teaching methods for engaging classrooms[web:41]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1 text-lg">✓</span>
                  <span>Enhanced pedagogical practices improving student learning outcomes and academic performance[web:41]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1 text-lg">✓</span>
                  <span>Teachers equipped with problem-solving approaches and critical thinking development skills[web:41]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1 text-lg">✓</span>
                  <span>First-level counseling skills to address academic, social, and emotional needs of students[web:41]</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Teacher Empowerment</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1 text-lg">✓</span>
                  <span>Better learning modules based on activities, motivational interaction, and use of technology[web:38]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1 text-lg">✓</span>
                  <span>Creative tools and motivation to use Art as a pedagogical tool in teaching[web:38]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1 text-lg">✓</span>
                  <span>Student-centered teaching methods catering to individual needs and learning capacity[web:38]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1 text-lg">✓</span>
                  <span>Improved social-personal skills for handling students with patience and understanding[web:38]</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Platform Access Section */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Access NISHTHA Platform</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Available online through multiple platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-purple-200 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-base sm:text-lg text-gray-800">NISHTHA Training Portal</h4>
                <p className="text-xs sm:text-sm text-gray-600">Access comprehensive training modules and resources at itpd.ncert.gov.in</p>
              </div>
              <Button 
                onClick={handleVisitPortal} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
              >
                Visit Portal
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 sm:p-6 border-2 border-orange-200 rounded-xl bg-white">
              <h4 className="font-semibold mb-3 text-base sm:text-lg text-gray-800">Additional Platforms</h4>
              <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">●</span>
                  <span>Access NISHTHA courses through DIKSHA portal at diksha.gov.in for mobile and web learning[web:37]</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">●</span>
                  <span>SWAYAM platform for additional online courses and training materials[web:37]</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">●</span>
                  <span>Mobile apps for on-the-go learning and training access across all versions[web:40]</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">DIKSHA Integration</Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">SWAYAM Platform</Badge>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-300">Mobile Apps</Badge>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">11+ Languages</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
