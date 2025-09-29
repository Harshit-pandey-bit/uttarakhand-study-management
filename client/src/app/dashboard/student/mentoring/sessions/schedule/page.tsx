'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  User,
  Users,
  Video,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  expertise: string[];
  avatar: string;
  rating: number;
  availability: string[];
}

interface AvailableSlot {
  date: string;
  slots: string[];
}

export default function SessionSchedulePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preSelectedMentorId = searchParams.get('mentor');

  // State management
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual');
  const [topic, setTopic] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data
  useEffect(() => {
    const mockMentors: MentorProfile[] = [
      {
        id: 'MENTOR001',
        name: 'Dr. Rajesh Kumar',
        designation: 'Assistant Professor',
        department: 'Physics Department',
        expertise: ['Physics', 'Career Guidance', 'Research Methods'],
        avatar: '/mentors/dr-rajesh.jpg',
        rating: 4.8,
        availability: ['Monday 10-12', 'Wednesday 14-16', 'Friday 10-12']
      },
      {
        id: 'MENTOR002',
        name: 'Prof. Sunita Sharma',
        designation: 'Professor',
        department: 'Chemistry Department',
        expertise: ['Chemistry', 'Research Methods', 'Lab Techniques'],
        avatar: '/mentors/prof-sunita.jpg',
        rating: 4.6,
        availability: ['Tuesday 9-11', 'Thursday 14-16', 'Friday 9-11']
      }
    ];

    const mockSlots: AvailableSlot[] = [
      { date: '2025-09-30', slots: ['10:00-11:00', '14:00-15:00', '16:00-17:00'] },
      { date: '2025-10-01', slots: ['09:00-10:00', '11:00-12:00', '15:00-16:00'] },
      { date: '2025-10-02', slots: ['10:00-11:00', '14:00-15:00'] },
    ];

    setMentors(mockMentors);
    setAvailableSlots(mockSlots);

    if (preSelectedMentorId) {
      setSelectedMentor(preSelectedMentorId);
    }
  }, [preSelectedMentorId]);

  const handleScheduleSession = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would make an actual API call to schedule the session
    console.log('Scheduling session:', {
      mentor: selectedMentor,
      date: selectedDate,
      time: selectedTime,
      type: sessionType,
      topic,
      description
    });

    // Redirect to success page or sessions list
    router.push('/dashboard/student/mentoring/sessions?scheduled=true');
    setLoading(false);
  };

  const selectedMentorData = mentors.find(m => m.id === selectedMentor);
  const availableSlotsForDate = availableSlots.find(slot => slot.date === selectedDate);

  const getTopicSuggestions = () => {
    if (!selectedMentorData) return [];
    
    const suggestions = [
      'Career Guidance',
      'Subject Doubt Clearing',
      'Study Strategies',
      'Research Methodology',
      'Exam Preparation'
    ];

    // Add mentor-specific suggestions
    if (selectedMentorData.expertise.includes('Physics')) {
      suggestions.push('Physics Concepts', 'Light & Optics', 'Mechanics');
    }
    if (selectedMentorData.expertise.includes('Chemistry')) {
      suggestions.push('Chemical Bonding', 'Organic Chemistry', 'Lab Techniques');
    }

    return suggestions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Header */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/dashboard/student/mentoring">
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3 hover:shadow-md transition-all">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Mentoring
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    📅 Schedule Mentoring Session
                  </h1>
                  <p className="text-gray-600 text-lg">Book a session with your mentor</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DESIGN ONLY: Enhanced Scheduling Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* DESIGN ONLY: Enhanced Mentor Selection */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  <span>👨‍🏫 Select Mentor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12">
                    <SelectValue placeholder="Choose your mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        <div className="flex items-center space-x-2">
                          <span>{mentor.name}</span>
                          <span className="text-sm text-gray-500">- {mentor.department}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMentorData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center space-x-6 mb-4">
                      <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                        <AvatarImage src={selectedMentorData.avatar} />
                        <AvatarFallback className="bg-blue-200 text-blue-700 font-bold text-lg">
                          {selectedMentorData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-900">{selectedMentorData.name}</h3>
                        <p className="text-blue-700 font-medium">{selectedMentorData.designation}</p>
                        <p className="text-blue-600">{selectedMentorData.department}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="text-blue-700 font-semibold">{selectedMentorData.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-800 mb-3">🎯 Expertise Areas:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentorData.expertise.map((skill) => (
                          <Badge key={skill} className="bg-white text-blue-700 border-blue-300 px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DESIGN ONLY: Enhanced Session Type */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <span>🎯 Session Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={`p-6 border-3 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      sessionType === 'individual'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSessionType('individual')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${sessionType === 'individual' ? 'bg-blue-200' : 'bg-gray-100'}`}>
                        <User className={`h-8 w-8 ${sessionType === 'individual' ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">👤 Individual Session</h3>
                        <p className="text-gray-600">One-on-one mentoring</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`p-6 border-3 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      sessionType === 'group'
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSessionType('group')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${sessionType === 'group' ? 'bg-green-200' : 'bg-gray-100'}`}>
                        <Users className={`h-8 w-8 ${sessionType === 'group' ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">👥 Group Session</h3>
                        <p className="text-gray-600">Learn with peers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DESIGN ONLY: Enhanced Date & Time Selection */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span>📅 Select Date & Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-lg font-semibold text-gray-800 mb-3 block">📅 Date</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12">
                      <SelectValue placeholder="Choose date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot.date} value={slot.date}>
                          {new Date(slot.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDate && availableSlotsForDate && (
                  <div>
                    <Label className="text-lg font-semibold text-gray-800 mb-3 block">⏰ Available Time Slots</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlotsForDate.slots.map((slot) => (
                        <button
                          key={slot}
                          className={`p-4 text-sm font-semibold border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
                            selectedTime === slot
                              ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                          }`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          🕒 {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DESIGN ONLY: Enhanced Session Details */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <span>📝 Session Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-lg font-semibold text-gray-800 mb-3 block">🎯 Topic/Subject</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl h-12">
                      <SelectValue placeholder="Select or type topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTopicSuggestions().map((suggestion) => (
                        <SelectItem key={suggestion} value={suggestion}>
                          {suggestion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-gray-800 mb-3 block">📄 Description (Optional)</Label>
                  <Textarea
                    placeholder="Describe what you'd like to discuss or any specific questions you have..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="border-2 border-gray-200 rounded-xl resize-none focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DESIGN ONLY: Enhanced Session Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6 bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span>📋 Session Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {selectedMentorData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-sm font-bold text-blue-800 mb-2">👨‍🏫 Mentor</p>
                    <p className="text-lg font-bold text-blue-900">{selectedMentorData.name}</p>
                  </div>
                )}

                {selectedDate && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
                    <p className="text-sm font-bold text-orange-800 mb-2">📅 Date</p>
                    <p className="text-lg font-bold text-orange-900">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {selectedTime && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                    <p className="text-sm font-bold text-purple-800 mb-2">⏰ Time</p>
                    <p className="text-lg font-bold text-purple-900">{selectedTime}</p>
                  </div>
                )}

                {sessionType && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-bold text-green-800 mb-2">🎯 Type</p>
                    <div className="flex items-center space-x-3">
                      {sessionType === 'individual' ? (
                        <User className="h-5 w-5 text-green-700" />
                      ) : (
                        <Users className="h-5 w-5 text-green-700" />
                      )}
                      <p className="text-lg font-bold text-green-900 capitalize">
                        {sessionType === 'individual' ? '👤 Individual' : '👥 Group'}
                      </p>
                    </div>
                  </div>
                )}

                {topic && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
                    <p className="text-sm font-bold text-yellow-800 mb-2">📚 Topic</p>
                    <p className="text-lg font-bold text-yellow-900">{topic}</p>
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-lg font-bold"
                  onClick={handleScheduleSession}
                  disabled={!selectedMentor || !selectedDate || !selectedTime || !topic || loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      ⏳ Scheduling...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-3 h-6 w-6" />
                      ✅ Schedule Session
                    </>
                  )}
                </Button>

                {/* DESIGN ONLY: Enhanced Tips Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-2 border-gray-200 mt-6">
                  <h4 className="font-bold text-gray-800 mb-3">💡 Tips for a great session:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>📝 Prepare your questions in advance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>📚 Bring relevant study materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>🔔 Join 5 minutes early</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>💻 Test your internet connection</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
