'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  School,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Target,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';

// Dummy data from PDF specifications
const mentorAssignmentData = {
  availableMentors: [
    {
      id: "M001",
      name: "Dr. Rajesh Kumar",
      expertise: ["Physics", "Career Guidance"],
      capacity: 30,
      currentLoad: 18,
      rating: 4.8,
      experience: "5 years",
      avatar: "/mentors/dr-rajesh.jpg",
      location: "Roorkee",
      availability: ["Monday 10-12", "Wednesday 14-16", "Friday 10-12"],
      languages: ["Hindi", "English"],
      certifications: ["PhD Physics", "Career Counseling Certificate"]
    },
    {
      id: "M002",
      name: "Prof. Sunita Sharma",
      expertise: ["Chemistry", "Research Methods"],
      capacity: 25,
      currentLoad: 15,
      rating: 4.6,
      experience: "7 years",
      avatar: "/mentors/prof-sunita.jpg",
      location: "Roorkee",
      availability: ["Tuesday 9-11", "Thursday 14-16", "Friday 15-17"],
      languages: ["Hindi", "English"],
      certifications: ["MSc Chemistry", "Research Methodology Certificate"]
    },
    {
      id: "M003",
      name: "Dr. Amit Verma",
      expertise: ["Mathematics", "Data Science"],
      capacity: 32,
      currentLoad: 22,
      rating: 4.7,
      experience: "4 years",
      avatar: "/mentors/dr-amit.jpg",
      location: "Dehradun",
      availability: ["Monday 14-16", "Wednesday 10-12", "Thursday 16-18"],
      languages: ["Hindi", "English", "Punjabi"],
      certifications: ["PhD Mathematics", "Data Science Certification"]
    }
  ],
  schools: [
    {
      id: "S001",
      name: "Govt School Dehradun",
      requirements: ["Physics", "Mathematics"],
      studentCount: 450,
      priority: "High",
      location: "Dehradun, Uttarakhand",
      distance: "45 km",
      currentMentors: 2,
      principal: "Mrs. Sunita Sharma",
      infrastructure: "Good",
      languages: ["Hindi", "English"]
    },
    {
      id: "S002",
      name: "Govt School Rishikesh",
      requirements: ["Chemistry", "Biology"],
      studentCount: 320,
      priority: "Medium",
      location: "Rishikesh, Uttarakhand", 
      distance: "32 km",
      currentMentors: 1,
      principal: "Mr. Ramesh Chandra",
      infrastructure: "Fair",
      languages: ["Hindi", "English"]
    },
    {
      id: "S003",
      name: "Govt School Haridwar",
      requirements: ["Mathematics", "Physics"],
      studentCount: 380,
      priority: "High",
      location: "Haridwar, Uttarakhand",
      distance: "28 km",
      currentMentors: 1,
      principal: "Dr. Kavita Singh",
      infrastructure: "Excellent",
      languages: ["Hindi", "English"]
    }
  ],
  matchingSuggestions: [
    {
      mentor: "Dr. Rajesh Kumar",
      school: "Govt School Dehradun",
      matchScore: 95,
      reasons: ["Physics expertise match", "High capacity", "Good location proximity"],
      estimatedImpact: "High",
      workloadIncrease: "15%"
    },
    {
      mentor: "Prof. Sunita Sharma",
      school: "Govt School Rishikesh",
      matchScore: 88,
      reasons: ["Chemistry expertise match", "Available capacity", "Language compatibility"],
      estimatedImpact: "Medium-High",
      workloadIncrease: "20%"
    },
    {
      mentor: "Dr. Amit Verma",
      school: "Govt School Haridwar",
      matchScore: 92,
      reasons: ["Mathematics expertise match", "Excellent school infrastructure", "Optimal distance"],
      estimatedImpact: "High",
      workloadIncrease: "18%"
    }
  ]
};

interface AssignmentFormData {
  mentorId: string;
  schoolId: string;
  subjects: string[];
  sessionFrequency: string;
  startDate: string;
  specialRequirements: string;
}

export default function MentorAssignment() {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormData>({
    mentorId: '',
    schoolId: '',
    subjects: [],
    sessionFrequency: '',
    startDate: '',
    specialRequirements: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleAssignMentor = () => {
    // Simulate assignment process
    console.log('Assigning mentor:', assignmentForm);
    setIsAssignDialogOpen(false);
    setAssignmentForm({
      mentorId: '',
      schoolId: '',
      subjects: [],
      sessionFrequency: '',
      startDate: '',
      specialRequirements: ''
    });
  };

  const filteredMentors = mentorAssignmentData.availableMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === 'available') {
      return matchesSearch && mentor.currentLoad < mentor.capacity * 0.8;
    }
    if (filterBy === 'high-rated') {
      return matchesSearch && mentor.rating >= 4.5;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <div>
          <h1 className="text-2xl font-bold">Intelligent Mentor Assignment</h1>
          <p className="text-gray-600">Match mentors with schools based on expertise and requirements</p>
        </div> */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Mentor Assignment</DialogTitle>
              <DialogDescription>
                Assign a mentor to a school based on expertise and requirements
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mentor">Select Mentor</Label>
                  <Select 
                    value={assignmentForm.mentorId} 
                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, mentorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentorAssignmentData.availableMentors.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name} - {mentor.expertise.join(', ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Select School</Label>
                  <Select 
                    value={assignmentForm.schoolId}
                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, schoolId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose school" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentorAssignmentData.schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name} - {school.requirements.join(', ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Session Frequency</Label>
                  <Select 
                    value={assignmentForm.sessionFrequency}
                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, sessionFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={assignmentForm.startDate}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Input
                  id="requirements"
                  placeholder="Any special requirements or notes"
                  value={assignmentForm.specialRequirements}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignMentor}
                disabled={!assignmentForm.mentorId || !assignmentForm.schoolId || !assignmentForm.sessionFrequency}
              >
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search mentors by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mentors</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="high-rated">High Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Matching Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI-Powered Matching Suggestions
          </CardTitle>
          <CardDescription>
            Intelligent recommendations based on expertise, capacity, and distance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentorAssignmentData.matchingSuggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                      AI
                    </div>
                    <div>
                      <p className="font-medium">
                        {suggestion.mentor} → {suggestion.school}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estimated Impact: {suggestion.estimatedImpact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getMatchScoreColor(suggestion.matchScore)}>
                      {suggestion.matchScore}% match
                    </Badge>
                    <Button size="sm">
                      Assign Now
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Match Reasons:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {suggestion.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Workload Increase</p>
                      <p className="text-lg font-bold text-orange-600">{suggestion.workloadIncrease}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Mentors and Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Mentors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Available Mentors ({filteredMentors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMentors.map((mentor) => (
                <div 
                  key={mentor.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMentor === mentor.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMentor(mentor.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{mentor.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{mentor.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {mentor.location}
                        </span>
                        <span>{mentor.experience}</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Expertise:</p>
                          <div className="flex space-x-1">
                            {mentor.expertise.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-700">Capacity:</p>
                            <p className={`text-sm font-medium ${getCapacityColor(mentor.currentLoad, mentor.capacity)}`}>
                              {mentor.currentLoad}/{mentor.capacity} students
                            </p>
                          </div>
                          <div className="w-20">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(mentor.currentLoad / mentor.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Languages:</p>
                          <p className="text-xs text-gray-600">{mentor.languages.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schools Requiring Mentors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Schools Requiring Mentors ({mentorAssignmentData.schools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorAssignmentData.schools.map((school) => (
                <div 
                  key={school.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSchool === school.id ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSchool(school.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{school.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {school.location} • {school.distance}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(school.priority)}>
                      {school.priority} Priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-blue-600">{school.studentCount}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-green-600">{school.currentMentors}</p>
                      <p className="text-xs text-gray-600">Current Mentors</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Required Subjects:</p>
                      <div className="flex space-x-1">
                        {school.requirements.map((req) => (
                          <Badge key={req} className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-gray-700">Principal: {school.principal}</p>
                        <p className="text-gray-600">Infrastructure: {school.infrastructure}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Summary */}
      {selectedMentor && selectedSchool && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Assignment Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium">Mentor</p>
                  <p className="text-green-800 font-bold">
                    {mentorAssignmentData.availableMentors.find(m => m.id === selectedMentor)?.name}
                  </p>
                </div>
                <div className="text-2xl text-green-600">→</div>
                <div className="text-center">
                  <p className="text-sm font-medium">School</p>
                  <p className="text-green-800 font-bold">
                    {mentorAssignmentData.schools.find(s => s.id === selectedSchool)?.name}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setIsAssignDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
