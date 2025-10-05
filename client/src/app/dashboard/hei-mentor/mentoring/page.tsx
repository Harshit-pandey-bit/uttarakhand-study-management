'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Calendar,
  Clock,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  School,
  BookOpen,
  Video,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

// Dummy data from PDF specifications
const schedulingData = {
  availableSlots: [
    {
      date: "2025-09-28",
      slots: ["10:00-11:00", "14:00-15:00", "16:00-17:00"]
    },
    {
      date: "2025-09-29", 
      slots: ["09:00-10:00", "11:00-12:00", "15:00-16:00"]
    },
    {
      date: "2025-09-30",
      slots: ["10:00-11:00", "13:00-14:00", "15:00-16:00"]
    },
    {
      date: "2025-10-01",
      slots: ["09:00-10:00", "14:00-15:00", "16:00-17:00"]
    },
    {
      date: "2025-10-02",
      slots: ["10:00-11:00", "11:00-12:00", "14:00-15:00"]
    }
  ],
  students: [
    {
      id: "STU001",
      name: "Rahul Sharma",
      class: "10th",
      school: "Govt School Dehradun",
      preferences: ["Physics", "Career Guidance"],
      avatar: "/students/rahul.jpg",
      availability: ["10:00-11:00", "14:00-15:00", "16:00-17:00"]
    },
    {
      id: "STU002", 
      name: "Priya Singh",
      class: "9th",
      school: "Govt School Rishikesh",
      preferences: ["Mathematics", "Science Projects"],
      avatar: "/students/priya.jpg", 
      availability: ["09:00-10:00", "11:00-12:00", "15:00-16:00"]
    },
    {
      id: "STU003",
      name: "Amit Kumar",
      class: "10th", 
      school: "Govt School Dehradun",
      preferences: ["Chemistry", "Career Guidance"],
      avatar: "/students/amit.jpg",
      availability: ["10:00-11:00", "13:00-14:00", "16:00-17:00"]
    },
    {
      id: "STU004",
      name: "Neha Gupta",
      class: "9th",
      school: "Govt School Rishikesh", 
      preferences: ["Biology", "Research Methods"],
      avatar: "/students/neha.jpg",
      availability: ["09:00-10:00", "14:00-15:00", "15:00-16:00"]
    }
  ],
  sessionTypes: [
    "Individual Career Guidance",
    "Group Subject Teaching", 
    "Doubt Clearing Session",
    "Project Mentoring",
    "Exam Preparation",
    "Research Guidance"
  ]
};

interface ScheduleFormData {
  date: string;
  timeSlot: string;
  sessionType: string;
  topic: string;
  description: string;
  selectedStudents: string[];
  duration: string;
  isRecurring: boolean;
  recurringPattern?: string;
}

export default function SessionSchedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    date: '',
    timeSlot: '',
    sessionType: '',
    topic: '',
    description: '',
    selectedStudents: [],
    duration: '60',
    isRecurring: false
  });
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([]);

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getAvailableSlotsForDate = (date: string) => {
    const slot = schedulingData.availableSlots.find(s => s.date === date);
    return slot ? slot.slots : [];
  };

  const getAvailableStudentsForSlot = (timeSlot: string) => {
    return schedulingData.students.filter(student => 
      student.availability.includes(timeSlot)
    );
  };

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    setScheduleForm(prev => ({
      ...prev,
      selectedStudents: checked 
        ? [...prev.selectedStudents, studentId]
        : prev.selectedStudents.filter(id => id !== studentId)
    }));
  };

  const handleScheduleSession = () => {
    const newSession = {
      id: `SES${Date.now()}`,
      ...scheduleForm,
      students: scheduleForm.selectedStudents.map(id => 
        schedulingData.students.find(s => s.id === id)
      ),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setScheduledSessions(prev => [...prev, newSession]);
    setIsScheduleDialogOpen(false);
    setScheduleForm({
      date: '',
      timeSlot: '',
      sessionType: '',
      topic: '',
      description: '',
      selectedStudents: [],
      duration: '60',
      isRecurring: false
    });
  };

  const weekDates = getWeekDates(currentWeek);
  const availableStudentsForSlot = scheduleForm.timeSlot ? 
    getAvailableStudentsForSlot(scheduleForm.timeSlot) : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Session Scheduling</h1>
          <p className="text-gray-600">Schedule mentoring sessions with students</p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>
                Create a new mentoring session with students
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Date and Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Select 
                    value={scheduleForm.date} 
                    onValueChange={(value) => setScheduleForm(prev => ({ ...prev, date: value, timeSlot: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedulingData.availableSlots.map((slot) => (
                        <SelectItem key={slot.date} value={slot.date}>
                          {new Date(slot.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot</Label>
                  <Select 
                    value={scheduleForm.timeSlot}
                    onValueChange={(value) => setScheduleForm(prev => ({ ...prev, timeSlot: value }))}
                    disabled={!scheduleForm.date}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSlotsForDate(scheduleForm.date).map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Session Type and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select 
                    value={scheduleForm.sessionType}
                    onValueChange={(value) => setScheduleForm(prev => ({ ...prev, sessionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedulingData.sessionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={scheduleForm.duration}
                    onValueChange={(value) => setScheduleForm(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Topic and Description */}
              <div className="space-y-2">
                <Label htmlFor="topic">Session Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter session topic"
                  value={scheduleForm.topic}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter session description"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Student Selection */}
              {scheduleForm.timeSlot && (
                <div className="space-y-3">
                  <Label>Available Students for {scheduleForm.timeSlot}</Label>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableStudentsForSlot.map((student) => (
                      <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={student.id}
                          checked={scheduleForm.selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentSelection(student.id, checked as boolean)}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.class} • {student.school}</p>
                          <div className="flex space-x-1 mt-1">
                            {student.preferences.map((pref) => (
                              <Badge key={pref} variant="secondary" className="text-xs">
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {availableStudentsForSlot.length === 0 && (
                    <p className="text-sm text-gray-500">No students available for this time slot</p>
                  )}
                </div>
              )}

              {/* Recurring Sessions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={scheduleForm.isRecurring}
                  onCheckedChange={(checked) => setScheduleForm(prev => ({ ...prev, isRecurring: checked as boolean }))}
                />
                <Label htmlFor="recurring">Make this a recurring session</Label>
              </div>

              {scheduleForm.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                  <Select 
                    value={scheduleForm.recurringPattern}
                    onValueChange={(value) => setScheduleForm(prev => ({ ...prev, recurringPattern: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleSession}
                disabled={!scheduleForm.date || !scheduleForm.timeSlot || !scheduleForm.sessionType || !scheduleForm.topic || scheduleForm.selectedStudents.length === 0}
              >
                Schedule Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Calendar View
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(prev => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">
                {weekDates[0].toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(prev => prev + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dateStr = formatDate(date);
              const availableSlots = getAvailableSlotsForDate(dateStr);
              const sessionsForDate = scheduledSessions.filter(session => session.date === dateStr);
              
              return (
                <div key={index} className="border rounded-lg p-3 min-h-[120px]">
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium">{formatDisplayDate(date)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    {availableSlots.map((slot, slotIndex) => {
                      const sessionForSlot = sessionsForDate.find(session => session.timeSlot === slot);
                      
                      return (
                        <div 
                          key={slotIndex}
                          className={`p-2 rounded text-xs ${
                            sessionForSlot 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot}</span>
                            {sessionForSlot && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </div>
                          {sessionForSlot && (
                            <p className="truncate mt-1 font-medium">
                              {sessionForSlot.topic}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Student Availability Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {schedulingData.students.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.class} • {student.school}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Preferences:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.preferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Available Times:</p>
                    <div className="space-y-1">
                      {student.availability.map((time) => (
                        <div key={time} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Sessions */}
      {scheduledSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recently Scheduled Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{session.topic}</p>
                        <p className="text-sm text-gray-600">
                          {session.date} at {session.timeSlot} • {session.duration} mins
                        </p>
                        <p className="text-sm text-gray-500">{session.sessionType}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {session.selectedStudents.length} student{session.selectedStudents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
