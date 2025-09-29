'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Send,
  Users,
  Clock,
  Search,
  Hash,
  Pin,
  Star,
  ExternalLink,
  Bell,
  BellOff,
  MoreVertical,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

// Types based on PDF specifications
interface WhatsAppGroup {
  id: string;
  name: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Career Guidance' | 'General';
  description: string;
  memberCount: number;
  mentor: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  whatsappLink: string;
  isJoined: boolean;
  lastActivity: string;
  unreadCount: number;
  isPinned: boolean;
  activeHours: string;
  guidelines: string[];
}

interface WhatsAppQuestion {
  id: string;
  question: string;
  subject: string;
  askedBy: string;
  timestamp: string;
  status: 'pending' | 'answered' | 'resolved';
  answer?: string;
  answeredBy?: string;
  likes: number;
  isHelpful: boolean;
}

interface WhatsAppGroupsProps {
  studentId: string;
  onQuestionSubmit?: (question: string, subject: string) => void;
}

const SUBJECT_COLORS = {
  Physics: 'from-blue-500 to-blue-600',
  Chemistry: 'from-green-500 to-green-600',
  Mathematics: 'from-purple-500 to-purple-600',
  'Career Guidance': 'from-orange-500 to-orange-600',
  General: 'from-gray-500 to-gray-600'
};

const SUBJECT_ICONS = {
  Physics: '⚛️',
  Chemistry: '🧪',
  Mathematics: '📐',
  'Career Guidance': '🎯',
  General: '💬'
};

export default function WhatsAppGroups({ studentId, onQuestionSubmit }: WhatsAppGroupsProps) {
  // State management
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<WhatsAppQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data based on PDF specifications
  useEffect(() => {
    setTimeout(() => {
      const mockGroups: WhatsAppGroup[] = [
        {
          id: 'WG001',
          name: 'Physics Doubt Clearing - Class 10',
          subject: 'Physics',
          description: 'Ask your physics doubts and get answers from mentors and peers',
          memberCount: 245,
          mentor: {
            name: 'Dr. Rajesh Kumar',
            avatar: '/mentors/dr-rajesh.jpg',
            isOnline: true
          },
          whatsappLink: 'https://chat.whatsapp.com/physics-class-10',
          isJoined: true,
          lastActivity: '2 min ago',
          unreadCount: 3,
          isPinned: true,
          activeHours: '9 AM - 8 PM',
          guidelines: [
            'Ask clear and specific questions',
            'Use proper English/Hindi',
            'No spam or irrelevant messages',
            'Be respectful to everyone'
          ]
        },
        {
          id: 'WG002',
          name: 'Chemistry Lab & Theory - Classes 9-10',
          subject: 'Chemistry',
          description: 'Chemistry concepts, lab experiments, and practical doubts',
          memberCount: 189,
          mentor: {
            name: 'Prof. Sunita Sharma',
            avatar: '/mentors/prof-sunita.jpg',
            isOnline: false
          },
          whatsappLink: 'https://chat.whatsapp.com/chemistry-class-910',
          isJoined: true,
          lastActivity: '15 min ago',
          unreadCount: 0,
          isPinned: false,
          activeHours: '10 AM - 7 PM',
          guidelines: [
            'Share lab photos for better understanding',
            'Mention chemical formulas clearly',
            'Safety first in all discussions',
            'Help each other learn'
          ]
        },
        {
          id: 'WG003',
          name: 'Mathematics Problem Solving',
          subject: 'Mathematics',
          description: 'Step-by-step solutions for math problems',
          memberCount: 312,
          mentor: {
            name: 'Dr. Anjali Mehta',
            avatar: '/mentors/dr-anjali.jpg',
            isOnline: true
          },
          whatsappLink: 'https://chat.whatsapp.com/math-problem-solving',
          isJoined: false,
          lastActivity: '5 min ago',
          unreadCount: 0,
          isPinned: false,
          activeHours: '8 AM - 9 PM',
          guidelines: [
            'Show your work step by step',
            'Ask for specific help',
            'Share problem screenshots clearly',
            'Practice daily'
          ]
        },
        {
          id: 'WG004',
          name: 'Career Guidance & College Prep',
          subject: 'Career Guidance',
          description: 'Career advice, college admissions, and future planning',
          memberCount: 156,
          mentor: {
            name: 'Dr. Priya Agarwal',
            avatar: '/mentors/dr-priya.jpg',
            isOnline: true
          },
          whatsappLink: 'https://chat.whatsapp.com/career-guidance',
          isJoined: true,
          lastActivity: '30 min ago',
          unreadCount: 1,
          isPinned: true,
          activeHours: '4 PM - 8 PM',
          guidelines: [
            'Share your academic interests',
            'Ask specific career questions',
            'Respect privacy of others',
            'Share useful resources'
          ]
        }
      ];

      const mockQuestions: WhatsAppQuestion[] = [
        {
          id: 'Q001',
          question: 'What is the difference between convex and concave mirrors?',
          subject: 'Physics',
          askedBy: 'Rahul S.',
          timestamp: '10 min ago',
          status: 'answered',
          answer: 'Convex mirrors curve outward and always form virtual, diminished images. Concave mirrors curve inward and can form both real and virtual images depending on object position.',
          answeredBy: 'Dr. Rajesh Kumar',
          likes: 12,
          isHelpful: true
        },
        {
          id: 'Q002',
          question: 'How do I balance chemical equations step by step?',
          subject: 'Chemistry',
          askedBy: 'Priya M.',
          timestamp: '25 min ago',
          status: 'answered',
          answer: '1. Count atoms on both sides 2. Start with most complex molecule 3. Balance metals first, then non-metals 4. Balance oxygen and hydrogen last',
          answeredBy: 'Prof. Sunita Sharma',
          likes: 8,
          isHelpful: true
        },
        {
          id: 'Q003',
          question: 'What are the best engineering colleges in India?',
          subject: 'Career Guidance',
          askedBy: 'Amit K.',
          timestamp: '1 hour ago',
          status: 'answered',
          answer: 'Top engineering colleges include IITs, NITs, BITS Pilani, and various state government colleges. Consider factors like branch preference, location, and fees.',
          answeredBy: 'Dr. Priya Agarwal',
          likes: 15,
          isHelpful: true
        }
      ];

      setGroups(mockGroups);
      setRecentQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
        : group
    ));
  };

  const handleLeaveGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: false, memberCount: group.memberCount - 1, unreadCount: 0 }
        : group
    ));
  };

  const handleOpenWhatsApp = (whatsappLink: string) => {
    // For mobile devices, open WhatsApp directly
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.open(whatsappLink, '_blank');
    } else {
      // For desktop, show QR code or web.whatsapp.com
      window.open(`https://web.whatsapp.com/`, '_blank');
    }
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: WhatsAppQuestion = {
      id: `Q${Date.now()}`,
      question: newQuestion,
      subject: selectedSubject,
      askedBy: 'You',
      timestamp: 'Just now',
      status: 'pending',
      likes: 0,
      isHelpful: false
    };

    setRecentQuestions([question, ...recentQuestions]);
    onQuestionSubmit?.(newQuestion, selectedSubject);
    setNewQuestion('');
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Status Indicator */}
      {!isOnline && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <WifiOff className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-800">You're offline</p>
                <p className="text-sm text-orange-700">WhatsApp features require internet connection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">WhatsApp Study Groups</CardTitle>
                <p className="text-gray-600 mt-1">Get instant help from mentors and peers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700">
                <Wifi className="mr-1 h-3 w-3" />
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="questions">Recent Q&A</TabsTrigger>
          <TabsTrigger value="ask">Ask Question</TabsTrigger>
        </TabsList>

        {/* Study Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search groups by subject or name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Groups List */}
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Group Icon */}
                      <div className={`p-3 bg-gradient-to-br ${SUBJECT_COLORS[group.subject]} rounded-xl shadow-lg`}>
                        <span className="text-2xl">{SUBJECT_ICONS[group.subject]}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                          {group.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                          {group.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {group.unreadCount}
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{group.description}</p>

                        {/* Group Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{group.memberCount} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Active: {group.activeHours}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>Last activity: {group.lastActivity}</span>
                          </div>
                        </div>

                        {/* Mentor Info */}
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={group.mentor.avatar} />
                            <AvatarFallback>
                              {group.mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{group.mentor.name}</p>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                group.mentor.isOnline ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              <span className="text-xs text-gray-500">
                                {group.mentor.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Group Guidelines */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Group Guidelines:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {group.guidelines.slice(0, 2).map((guideline, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span>•</span>
                                <span>{guideline}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {group.isJoined ? (
                        <>
                          <Button
                            onClick={() => handleOpenWhatsApp(group.whatsappLink)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!isOnline}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleLeaveGroup(group.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Leave Group
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleJoinGroup(group.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!isOnline}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Join Group
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Questions & Answers</CardTitle>
              <p className="text-gray-600">Latest doubts solved by mentors</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuestions.map((qa) => (
                  <div key={qa.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={`bg-gradient-to-r ${SUBJECT_COLORS[qa.subject as keyof typeof SUBJECT_COLORS]} text-white`}>
                          {qa.subject}
                        </Badge>
                        <span className="text-sm text-gray-500">{qa.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {qa.status === 'answered' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {qa.status === 'pending' && (
                          <Clock className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{qa.question}</h4>
                    <p className="text-sm text-gray-600 mb-3">Asked by {qa.askedBy}</p>

                    {qa.answer && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-3">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          Answer by {qa.answeredBy}:
                        </p>
                        <p className="text-green-700">{qa.answer}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {qa.likes}
                        </Button>
                        {qa.isHelpful && (
                          <Badge variant="outline" className="text-green-600">
                            Helpful
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        View in WhatsApp
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ask Question Tab */}
        <TabsContent value="ask" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ask Your Question</CardTitle>
              <p className="text-gray-600">Get help from mentors and peers in WhatsApp groups</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Subject
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.keys(SUBJECT_COLORS).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedSubject === subject
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {SUBJECT_ICONS[subject as keyof typeof SUBJECT_ICONS]}
                      </div>
                      <div className="text-sm font-medium">{subject}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Question
                </label>
                <Textarea
                  placeholder="Type your question here... Be specific and clear for better answers."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Tips for better answers:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Be specific about your doubt</li>
                      <li>• Include relevant context or formulas</li>
                      <li>• Use proper grammar for clarity</li>
                      <li>• Attach images if needed (in WhatsApp)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmitQuestion}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!newQuestion.trim() || !isOnline}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit to WhatsApp Group
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
