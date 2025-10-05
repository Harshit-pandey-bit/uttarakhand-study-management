'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calender';

import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Star,
  User,
  BookOpen,
  CheckCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Import API client and types
import { mentoringAPI } from '@/lib/api/mentoringClient';
import { 
  Mentor, 
  AvailableSlot,
  TimeSlot,
  BookSession,
  SessionType,
  Session
} from '@/types/mentoring';

export default function ScheduleSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMentorId = searchParams?.get('mentorId');

  // State management
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'mentor' | 'datetime' | 'details' | 'confirmation'>('mentor');

  // Form data
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState<SessionType>(SessionType.ONE_ON_ONE);
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);

  // Created session
  const [createdSession, setCreatedSession] = useState<Session | null>(null);

  // Load initial data
  useEffect(() => {
    loadMentors();
  }, []);

  // Load mentor if pre-selected
  useEffect(() => {
    if (selectedMentorId && mentors.length > 0) {
      const mentor = mentors.find(m => m.id === selectedMentorId);
      if (mentor) {
        setSelectedMentor(mentor);
        setStep('datetime');
      }
    }
  }, [selectedMentorId, mentors]);

  // Load available slots when mentor and date change
  useEffect(() => {
    if (selectedMentor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedMentor, selectedDate]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await mentoringAPI.getMentors();
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setMentors(response.data.filter(mentor => mentor.isAvailable));
      }
    } catch (err) {
      console.error('Failed to load mentors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedMentor || !selectedDate) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await mentoringAPI.getAvailableSlots(selectedMentor.id, dateStr);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setAvailableSlots(response.data);
      }
    } catch (err) {
      console.error('Failed to load available slots:', err);
    }
  };

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime || !topic.trim()) return;

    try {
      setSubmitting(true);

      const bookingData: BookSession = {
        mentorId: selectedMentor.id,
        sessionDate: `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`,
        duration,
        subject,
        description,
        sessionType,
        topic
      };

      const response = await mentoringAPI.bookSession(bookingData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setCreatedSession(response.data);
        setStep('confirmation');
      }
    } catch (err) {
      console.error('Failed to book session:', err);
      setError(err instanceof Error ? err.message : 'Failed to book session');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = availableSlots.find(slot => 
      slot.date && slot.date.startsWith(dateStr)
    );
    return slot?.timeSlots || [];
  };

  // Render different steps
  const renderMentorSelection = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Choose Your Mentor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No mentors available</h3>
            <p className="text-gray-500">Please check back later for available mentors</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className={cn(
                  "bg-gray-50 rounded-lg p-6 border-2 cursor-pointer transition-all hover:border-blue-300",
                  selectedMentor?.id === mentor.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                )}
                onClick={() => {
                  setSelectedMentor(mentor);
                  setStep('datetime');
                }}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{mentor.designation}</p>
                    <p className="text-xs text-gray-500 mb-3">{mentor.department}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{mentor.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{mentor.currentStudents}/{mentor.maxStudents}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDateTimeSelection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Selected Mentor Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Selected Mentor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMentor && (
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedMentor.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                  {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedMentor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedMentor.designation}</p>
                <p className="text-xs text-gray-500 mb-3">{selectedMentor.department}</p>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMentor.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date & Time Selection */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-green-600" />
            <span>Select Date & Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date: Date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Available Times</Label>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableTimeSlotsForDate(selectedDate).map((timeSlot) => (
                  <Button
                    key={timeSlot.time}
                    variant={selectedTime === timeSlot.time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(timeSlot.time)}
                    disabled={!timeSlot.available}
                    className="text-xs"
                  >
                    {timeSlot.time}
                  </Button>
                ))}
              </div>
              {getAvailableTimeSlotsForDate(selectedDate).length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No available time slots for this date
                </p>
              )}
            </div>
          )}

          {selectedDate && selectedTime && (
            <Button 
              onClick={() => setStep('details')}
              className="w-full mt-4"
            >
              Continue to Details
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSessionDetails = () => (
    <Card className="border-0 shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <span>Session Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session Type */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Session Type</Label>
            <Select value={sessionType} onValueChange={(value) => setSessionType(value as SessionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_on_one">One-on-one mentoring</SelectItem>
                <SelectItem value="group">Learn with peers</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="doubt_session">Doubt Session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Subject</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Career Guidance">Career Guidance</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Topic *</Label>
          <Input
            placeholder="What would you like to discuss?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Additional Notes</Label>
          <Textarea
            placeholder="Any specific questions or areas you'd like to focus on..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={() => setStep('confirmation')}
          disabled={!topic.trim()}
          className="w-full"
        >
          Review & Book Session
        </Button>
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => {
    if (createdSession) {
      return (
        <Card className="border-0 shadow-sm max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Booked Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your mentoring session has been scheduled and confirmation details have been sent.
              </p>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-4">Session Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session:</span>
                    <span className="font-medium">{createdSession.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor:</span>
                    <span className="font-medium">{createdSession.mentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(createdSession.sessionDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {new Date(createdSession.sessionDate).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{createdSession.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/student/mentoring/sessions" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View All Sessions
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    // Reset form
                    setSelectedMentor(null);
                    setSelectedDate(undefined);
                    setSelectedTime('');
                    setTopic('');
                    setDescription('');
                    setCreatedSession(null);
                    setStep('mentor');
                  }}
                  className="flex-1"
                >
                  Book Another Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-sm max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Review & Confirm</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Session Summary:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mentor:</span>
                <span className="font-medium">{selectedMentor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Designation:</span>
                <span className="font-medium">{selectedMentor?.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {selectedDate?.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{sessionType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium">{subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{topic}</span>
              </div>
              {description && (
                <div>
                  <span className="text-gray-600 block mb-1">Notes:</span>
                  <span className="font-medium">{description}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => setStep('details')}
              className="flex-1"
              disabled={submitting}
            >
              Back to Edit
            </Button>
            <Button 
              onClick={handleBookSession}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm & Book Session'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/student/mentoring">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
            <p className="text-gray-600 mt-1">Book a session with your mentor</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        <div className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
          step === 'mentor' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
        )}>
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            step === 'mentor' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          )}>
            1
          </div>
          <span>Choose Mentor</span>
        </div>
        
        <div className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
          step === 'datetime' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
        )}>
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            step === 'datetime' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          )}>
            2
          </div>
          <span>Date & Time</span>
        </div>

        <div className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
          step === 'details' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
        )}>
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            step === 'details' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          )}>
            3
          </div>
          <span>Details</span>
        </div>

        <div className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
          step === 'confirmation' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
        )}>
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            step === 'confirmation' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          )}>
            4
          </div>
          <span>Confirm</span>
        </div>
      </div>

      {/* Error Display */}
      {error && step !== 'confirmation' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      {step === 'mentor' && renderMentorSelection()}
      {step === 'datetime' && renderDateTimeSelection()}
      {step === 'details' && renderSessionDetails()}
      {step === 'confirmation' && renderConfirmation()}
    </div>
  );
}
