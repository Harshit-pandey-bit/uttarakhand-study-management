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
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard/student/mentoring">
            <Button variant="outline" className="border-gray-300 hover:border-gray-400">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mentoring
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Mentoring Session</h1>
            <p className="text-gray-600 text-lg">Book a session with your mentor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduling Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
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
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedMentorData.avatar} />
                      <AvatarFallback>
                        {selectedMentorData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMentorData.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMentorData.designation}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{selectedMentorData.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedMentorData.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Type */}
          <Card>
            <CardHeader>
              <CardTitle>Session Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    sessionType === 'individual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSessionType('individual')}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Individual Session</h3>
                      <p className="text-sm text-gray-600">One-on-one mentoring</p>
                    </div>
                  </div>
                </div>
                
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    sessionType === 'group'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSessionType('group')}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Group Session</h3>
                      <p className="text-sm text-gray-600">Learn with peers</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Date</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
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
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availableSlotsForDate.slots.map((slot) => (
                      <button
                        key={slot}
                        className={`p-3 text-sm border rounded-lg transition-colors ${
                          selectedTime === slot
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Topic/Subject</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
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
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Describe what you'd like to discuss or any specific questions you have..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMentorData && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Mentor</p>
                  <p className="text-lg font-semibold">{selectedMentorData.name}</p>
                </div>
              )}

              {selectedDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-lg font-semibold">
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
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-lg font-semibold">{selectedTime}</p>
                </div>
              )}

              {sessionType && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <div className="flex items-center space-x-2">
                    {sessionType === 'individual' ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    <p className="text-lg font-semibold capitalize">{sessionType}</p>
                  </div>
                </div>
              )}

              {topic && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Topic</p>
                  <p className="text-lg font-semibold">{topic}</p>
                </div>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleScheduleSession}
                disabled={!selectedMentor || !selectedDate || !selectedTime || !topic || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Schedule Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
