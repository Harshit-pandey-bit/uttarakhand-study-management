'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Search, Eye, MessageSquare, BarChart3,
  Trophy, Star, Award, Target, CheckCircle2,
  X
} from 'lucide-react';

// Student data with comprehensive dummy information
const studentsData = [
  {
    id: 1,
    name: "Rahul Sharma",
    class: "10th A",
    rollNo: "2024001",
    avatar: "/students/rahul.jpg",
    email: "rahul.sharma@school.edu",
    performance: {
      overall: 85,
      mathematics: 92,
      science: 88,
      english: 78,
      socialScience: 85,
      hindi: 80
    },
    attendance: 94,
    assignmentsCompleted: 23,
    totalAssignments: 25,
    careerAspiration: "Aerospace Engineer",
    lastActivity: "2 hours ago",
    strengths: ["Problem Solving", "Mathematical Reasoning", "Scientific Inquiry"],
    improvements: ["English Communication", "Time Management"],
    recentAchievements: [
      "Completed Water Conservation Project",
      "Scored 95% in Quadratic Equations Test", 
      "Selected for State Science Fair"
    ],
    mentorFeedback: "Excellent analytical skills. Shows great potential in STEM subjects.",
    projectsActive: 2,
    certificatesEarned: 4
  },
  {
    id: 2,
    name: "Priya Singh",
    class: "9th B",
    rollNo: "2024002",
    avatar: "/students/priya.jpg",
    email: "priya.singh@school.edu",
    performance: {
      overall: 91,
      mathematics: 89,
      science: 95,
      english: 88,
      socialScience: 92,
      hindi: 91
    },
    attendance: 98,
    assignmentsCompleted: 28,
    totalAssignments: 28,
    careerAspiration: "Environmental Scientist",
    lastActivity: "1 day ago",
    strengths: ["Research Skills", "Environmental Awareness", "Leadership"],
    improvements: ["Public Speaking", "Digital Literacy"],
    recentAchievements: [
      "Led Biodiversity Assessment Project",
      "Won Inter-School Environment Quiz",
      "Published article in School Magazine"
    ],
    mentorFeedback: "Outstanding research capabilities and environmental consciousness.",
    projectsActive: 3,
    certificatesEarned: 6
  },
  {
    id: 3,
    name: "Amit Kumar",
    class: "8th C",
    rollNo: "2024003",
    avatar: "/students/amit.jpg",
    email: "amit.kumar@school.edu",
    performance: {
      overall: 73,
      mathematics: 70,
      science: 78,
      english: 68,
      socialScience: 75,
      hindi: 74
    },
    attendance: 87,
    assignmentsCompleted: 18,
    totalAssignments: 22,
    careerAspiration: "Software Developer",
    lastActivity: "5 hours ago",
    strengths: ["Creative Thinking", "Technology Interest", "Collaboration"],
    improvements: ["Mathematical Concepts", "Study Consistency"],
    recentAchievements: [
      "Created School Website Mock-up",
      "Participated in Coding Club",
      "Improved Math Score by 15%"
    ],
    mentorFeedback: "Shows great interest in technology. Needs support in foundational concepts.",
    projectsActive: 1,
    certificatesEarned: 2
  },
  {
    id: 4,
    name: "Anita Verma",
    class: "11th A",
    rollNo: "2024004",
    avatar: "/students/anita.jpg",
    email: "anita.verma@school.edu",
    performance: {
      overall: 88,
      mathematics: 85,
      science: 92,
      english: 86,
      socialScience: 90,
      hindi: 87
    },
    attendance: 96,
    assignmentsCompleted: 31,
    totalAssignments: 32,
    careerAspiration: "Medical Doctor",
    lastActivity: "30 minutes ago",
    strengths: ["Dedication", "Medical Sciences", "Helping Others"],
    improvements: ["Work-Life Balance", "Stress Management"],
    recentAchievements: [
      "Top performer in Biology Olympiad",
      "Volunteered at Health Camp",
      "Mentored Junior Students"
    ],
    mentorFeedback: "Exceptional dedication to medical sciences. Future leader in healthcare.",
    projectsActive: 2,
    certificatesEarned: 8
  },
  {
    id: 5,
    name: "Vikram Gupta",
    class: "9th A",
    rollNo: "2024005",
    avatar: "/students/vikram.jpg",
    email: "vikram.gupta@school.edu",
    performance: {
      overall: 79,
      mathematics: 82,
      science: 84,
      english: 72,
      socialScience: 78,
      hindi: 79
    },
    attendance: 91,
    assignmentsCompleted: 21,
    totalAssignments: 24,
    careerAspiration: "Mechanical Engineer",
    lastActivity: "3 hours ago",
    strengths: ["Engineering Mindset", "Practical Skills", "Innovation"],
    improvements: ["Language Skills", "Presentation Skills"],
    recentAchievements: [
      "Built Solar Powered Model Car",
      "Won District Science Exhibition",
      "Completed Robotics Workshop"
    ],
    mentorFeedback: "Natural engineering aptitude. Excels in hands-on projects.",
    projectsActive: 2,
    certificatesEarned: 3
  },
  {
    id: 6,
    name: "Sneha Patel",
    class: "10th B",
    rollNo: "2024006",
    avatar: "/students/sneha.jpg",
    email: "sneha.patel@school.edu",
    performance: {
      overall: 87,
      mathematics: 90,
      science: 89,
      english: 85,
      socialScience: 86,
      hindi: 85
    },
    attendance: 95,
    assignmentsCompleted: 24,
    totalAssignments: 25,
    careerAspiration: "Data Scientist",
    lastActivity: "1 hour ago",
    strengths: ["Analytical Thinking", "Data Analysis", "Programming"],
    improvements: ["Team Leadership", "Communication"],
    recentAchievements: [
      "Created COVID Data Visualization",
      "Won Mathematics Olympiad",
      "Completed Python Programming Course"
    ],
    mentorFeedback: "Exceptional analytical mind. Perfect for data science career.",
    projectsActive: 3,
    certificatesEarned: 5
  }
];

const StudentCard: React.FC<{ student: any; onViewProfile: (student: any) => void }> = ({ 
  student, 
  onViewProfile 
}) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const completionPercentage = Math.round((student.assignmentsCompleted / student.totalAssignments) * 100);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-gray-200">
            <AvatarImage src={student.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.class} • Roll No: {student.rollNo}</p>
            <div className="flex items-center space-x-3 mt-2">
              <Badge variant="outline" className="text-xs">
                {student.careerAspiration}
              </Badge>
              <span className="text-xs text-gray-500">Active {student.lastActivity}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceColor(student.performance.overall)}`}>
            {student.performance.overall}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{student.attendance}%</div>
            <div className="text-xs text-gray-600">Attendance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-xs text-gray-600">Assignments</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{student.projectsActive}</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Subject Performance</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Mathematics</span>
              <span className="font-medium">{student.performance.mathematics}%</span>
            </div>
            <div className="flex justify-between">
              <span>Science</span>
              <span className="font-medium">{student.performance.science}%</span>
            </div>
            <div className="flex justify-between">
              <span>English</span>
              <span className="font-medium">{student.performance.english}%</span>
            </div>
            <div className="flex justify-between">
              <span>Social Science</span>
              <span className="font-medium">{student.performance.socialScience}%</span>
            </div>
          </div>
        </div>

        {/* Recent Achievement */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-green-600 mr-2" />
            <p className="text-sm text-green-800 font-medium">Latest Achievement</p>
          </div>
          <p className="text-xs text-green-700 mt-1">
            {student.recentAchievements[0]}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewProfile(student)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Profile
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentProfileModal: React.FC<{ 
  student: any; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Student Portfolio</h2>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 ring-4 ring-blue-200">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
              <p className="text-gray-600">{student.class} • {student.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  Dreams of becoming: {student.careerAspiration}
                </Badge>
                <Badge variant="outline">
                  {student.certificatesEarned} Certificates
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{student.performance.overall}%</div>
              <div className="text-sm text-gray-600">Overall Performance</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Subject Performance
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(student.performance).filter(([key]) => key !== 'overall').map(([subject, score]) => (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{subject.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold">{score}%</span>
                        </div>
                        <Progress value={score as number} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Academic Stats</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Attendance</span>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{student.attendance}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <div className="text-right">
                      <div className="font-bold">{student.assignmentsCompleted}/{student.totalAssignments}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Projects</span>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{student.projectsActive}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certificates</span>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{student.certificatesEarned}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths & Improvements */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Strengths & Areas for Improvement
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.improvements.map((improvement, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Achievements
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mentor Feedback */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Mentor Feedback
              </h3>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 italic">"{student.mentorFeedback}"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function StudentsPage() {
  const [students] = useState(studentsData);
  const [filteredStudents, setFilteredStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter students based on search and class
  React.useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.careerAspiration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, selectedClass, students]);

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const classPerformanceAvg = Math.round(
    students.reduce((acc, student) => acc + student.performance.overall, 0) / students.length
  );

  const totalAssignmentsCompleted = students.reduce((acc, student) => acc + student.assignmentsCompleted, 0);
  const totalAssignments = students.reduce((acc, student) => acc + student.totalAssignments, 0);
  const avgAttendance = Math.round(
    students.reduce((acc, student) => acc + student.attendance, 0) / students.length
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-500" />
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track student progress, view portfolios, and monitor academic performance
          </p>
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{classPerformanceAvg}%</div>
            <div className="text-sm text-gray-600 mt-1">Class Average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{Math.round((totalAssignmentsCompleted/totalAssignments)*100)}%</div>
            <div className="text-sm text-gray-600 mt-1">Assignment Completion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{avgAttendance}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Attendance</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, roll no, or career aspiration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="8th C">8th C</SelectItem>
                <SelectItem value="9th A">9th A</SelectItem>
                <SelectItem value="9th B">9th B</SelectItem>
                <SelectItem value="10th A">10th A</SelectItem>
                <SelectItem value="10th B">10th B</SelectItem>
                <SelectItem value="11th A">11th A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard 
            key={student.id} 
            student={student} 
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or class filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
