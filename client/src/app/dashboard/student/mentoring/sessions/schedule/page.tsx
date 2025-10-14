// src/app/dashboard/student/mentoring/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock,
  Video,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { mentoringAPI } from '@/lib/api/mentoringClient';
import type { Mentor, SessionType } from '@/types/mentoring';

export default function StudentMentoringPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('one_on_one' as SessionType);
  const [sessionSubject, setSessionSubject] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [bookedSession, setBookedSession] = useState<any>(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentoringAPI.getMentors();
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setMentors(Array.isArray(response.data) ? response.data : []);
      } else {
        setMentors([]);
      }
    } catch (err) {
      console.error('Failed to load mentors:', err);
      setError('Failed to load mentors. Please try again.');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateValid = (date: Date | null): boolean => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) return false;
    
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    if (checkDate > oneWeekFromNow) return false;
    
    return true;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date || !isDateValid(date)) return;
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedTimeSlot || !sessionTitle.trim() || !sessionDescription.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setBooking(true);
      setError(null);

      const [hours, minutes] = selectedTimeSlot.split(':');
      const sessionDate = new Date(selectedDate);
      sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const bookingPayload = {
        mentorId: selectedMentor.id,
        sessionDate: sessionDate.toISOString(),
        duration: 60,
        subject: sessionSubject || sessionTitle,
        description: sessionDescription,
      };

      const response = await mentoringAPI.bookSession(bookingPayload as any);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setBookedSession(response.data);
        setSuccessDialogOpen(true);
        
        // Reset form
        setSelectedMentor(null);
        setSelectedDate(null);
        setSelectedTimeSlot('');
        setSessionTitle('');
        setSessionDescription('');
        setSessionSubject('');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to book session');
    } finally {
      setBooking(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Book a Mentoring Session</h1>
        <p className="text-gray-600 mt-2">Follow the steps below to schedule your session</p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Select Mentor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMentor ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold`}>
              {selectedMentor ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <CardTitle>Select Your Mentor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {mentors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No mentors available at the moment.</p>
              <p className="text-sm mt-2">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedMentor?.id === mentor.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {mentor.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{mentor.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{mentor.designation || 'Mentor'}</p>
                      <p className="text-xs text-gray-500 truncate">{mentor.department || ''}</p>
                      {mentor.expertise && mentor.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.expertise.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Select Date */}
      {selectedMentor && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedDate ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold`}>
                {selectedDate ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <CardTitle>Select Date</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-10">
              You can book sessions up to 7 days in advance
            </p>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                disabled={currentMonth.getMonth() === new Date().getMonth()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-lg">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {generateCalendarDays().map((date, index) => {
                const isValid = isDateValid(date);
                const isSelected = isDateSelected(date);
                const isToday = date && date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => date && handleDateSelect(date)}
                    disabled={!date || !isValid}
                    className={`
                      aspect-square p-2 rounded-lg text-sm font-medium transition-all
                      ${!date ? 'invisible' : ''}
                      ${!isValid ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                      ${isSelected ? 'bg-blue-600 text-white shadow-lg' : ''}
                      ${isValid && !isSelected ? 'hover:bg-blue-50 text-gray-700 border border-transparent hover:border-blue-200' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    `}
                  >
                    {date?.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg ring-2 ring-blue-500 ring-inset"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-blue-600"></div>
                <span>Selected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Time */}
      {selectedMentor && selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTimeSlot ? 'bg-green-500' : 'bg-blue-500'} text-white font-semibold`}>
                {selectedTimeSlot ? <Check className="h-5 w-5" /> : '3'}
              </div>
              <CardTitle>Select Time</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-10">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {generateTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`
                    p-3 rounded-lg border-2 text-sm font-medium transition-all
                    ${selectedTimeSlot === time
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                  {time}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Session Details */}
      {selectedMentor && selectedDate && selectedTimeSlot && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                4
              </div>
              <CardTitle>Session Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Career Guidance Discussion"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <Select 
                value={sessionType} 
                onValueChange={(value: string) => setSessionType(value as SessionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_on_one">One-on-One (Private)</SelectItem>
                  <SelectItem value="group">Group Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics, Science"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="What would you like to discuss? Be specific about your questions or topics."
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              onClick={handleBookSession}
              disabled={!sessionTitle.trim() || !sessionDescription.trim() || booking}
              className="w-full"
              size="lg"
            >
              {booking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking Session...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">Session Booked Successfully!</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-base">Your mentoring session has been scheduled.</p>
              
              {bookedSession && (
                <div className="bg-gray-50 p-6 rounded-lg text-left space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Mentor:</span>
                    <p className="text-base font-semibold text-gray-900">{selectedMentor?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Title:</span>
                    <p className="text-base text-gray-900">{bookedSession.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Date & Time:</span>
                    <p className="text-base text-gray-900">
                      {selectedDate?.toLocaleDateString('en-IN', { 
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} at {selectedTimeSlot}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Duration:</span>
                    <p className="text-base text-gray-900">60 minutes</p>
                  </div>
                  {bookedSession.meeting_link && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Meeting Link:</p>
                      <a
                        href={bookedSession.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                      >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span>{bookedSession.meeting_link}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                onClick={() => setSuccessDialogOpen(false)}
                className="w-full mt-6"
                size="lg"
              >
                Done
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
