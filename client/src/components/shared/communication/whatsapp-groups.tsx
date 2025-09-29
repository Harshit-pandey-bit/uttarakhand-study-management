'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageCircle,
  Users,
  Search,
  Send,
  ExternalLink,
  WifiOff,
  CheckCircle,
  Clock,
  AlertCircle,
  Bot,
  Star,
  BookOpen,
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for WhatsApp Groups
interface WhatsAppGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  class: string;
  memberCount: number;
  mentor: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
  };
  guidelines: string[];
  isActive: boolean;
  lastActivity: string;
  whatsappLink: string;
}

interface DoubtsQA {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  answeredBy?: string;
  timestamp: string;
  subject: string;
  isAnswered: boolean;
}

interface WhatsAppGroupsProps {
  userRole: 'student' | 'mentor';
  studentClass?: string;
  subjects?: string[];
}

export default function WhatsAppGroups({
  userRole,
  studentClass,
  subjects = []
}: WhatsAppGroupsProps) {
  // State management
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [recentQA, setRecentQA] = useState<DoubtsQA[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load mock data
    setTimeout(() => {
      const mockGroups: WhatsAppGroup[] = [
        {
          id: 'GRP001',
          name: 'Physics Doubts - Class 12',
          description: 'Get your physics doubts cleared by expert mentors',
          subject: 'Physics',
          class: '12',
          memberCount: 45,
          mentor: {
            id: 'M001',
            name: 'Dr. Rajesh Kumar',
            avatar: '/mentors/dr-rajesh.jpg',
            phone: '+91-9876543210'
          },
          guidelines: [
            'Ask specific questions with proper context',
            'Be respectful to mentors and peers',
            'Search previous messages before asking'
          ],
          isActive: true,
          lastActivity: '2025-09-29T10:30:00Z',
          whatsappLink: 'https://chat.whatsapp.com/physics-12th'
        },
        {
          id: 'GRP002',
          name: 'Chemistry Group - Class 11',
          description: 'Chemistry concepts and problem-solving sessions',
          subject: 'Chemistry',
          class: '11',
          memberCount: 38,
          mentor: {
            id: 'M002',
            name: 'Prof. Sunita Sharma',
            avatar: '/mentors/prof-sunita.jpg',
            phone: '+91-9876543211'
          },
          guidelines: [
            'Share clear photos of problems',
            'Use proper chemical nomenclature',
            'Participate in group discussions'
          ],
          isActive: true,
          lastActivity: '2025-09-29T11:45:00Z',
          whatsappLink: 'https://chat.whatsapp.com/chemistry-11th'
        },
        {
          id: 'GRP003',
          name: 'Mathematics Help - Class 10',
          description: 'Math problem solving and concept clearing',
          subject: 'Mathematics',
          class: '10',
          memberCount: 52,
          mentor: {
            id: 'M003',
            name: 'Dr. Anjali Mehta',
            avatar: '/mentors/dr-anjali.jpg',
            phone: '+91-9876543212'
          },
          guidelines: [
            'Show your working steps',
            'Ask one question at a time',
            'Help your classmates when possible'
          ],
          isActive: true,
          lastActivity: '2025-09-29T09:15:00Z',
          whatsappLink: 'https://chat.whatsapp.com/math-10th'
        }
      ];

      const mockQA: DoubtsQA[] = [
        {
          id: 'QA001',
          question: 'How do I solve quadratic equations using the quadratic formula?',
          answer: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. First identify a, b, and c from your equation ax² + bx + c = 0, then substitute these values.',
          askedBy: 'Rahul S.',
          answeredBy: 'Dr. Anjali Mehta',
          timestamp: '2025-09-29T10:30:00Z',
          subject: 'Mathematics',
          isAnswered: true
        },
        {
          id: 'QA002',
          question: 'What is the difference between ionic and covalent bonds?',
          answer: 'Ionic bonds form between metals and non-metals through electron transfer, while covalent bonds form between non-metals through electron sharing.',
          askedBy: 'Priya K.',
          answeredBy: 'Prof. Sunita Sharma',
          timestamp: '2025-09-29T11:15:00Z',
          subject: 'Chemistry',
          isAnswered: true
        },
        {
          id: 'QA003',
          question: 'Can someone explain Newton\'s third law with examples?',
          askedBy: 'Amit R.',
          timestamp: '2025-09-29T12:00:00Z',
          subject: 'Physics',
          isAnswered: false
        }
      ];

      setGroups(mockGroups);
      setRecentQA(mockQA);
      setLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.class.includes(searchTerm)
  );

  const handleJoinGroup = (whatsappLink: string) => {
    if (isOnline) {
      window.open(whatsappLink, '_blank');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Offline state
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-0 shadow-xl rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="bg-gray-100 rounded-full p-8 w-fit mx-auto mb-6">
                <WifiOff className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">📱 You're offline</h3>
              <p className="text-gray-500 text-lg mb-6">
                WhatsApp features require internet connection
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🔄 Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Loading Header */}
          <Card className="bg-white border-0 shadow-xl rounded-2xl">
            <CardHeader className="p-8">
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
              </div>
            </CardHeader>
          </Card>

          {/* Loading Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* DESIGN ONLY: Enhanced Header */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  💬 WhatsApp Study Groups
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Get instant help from mentors and peers
                </p>
              </div>

              {/* DESIGN ONLY: Enhanced Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="🔍 Search groups by subject or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DESIGN ONLY: Enhanced Groups List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredGroups.length === 0 ? (
              <Card className="bg-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="bg-gray-100 rounded-full p-8 w-fit mx-auto mb-6">
                    <MessageCircle className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No groups found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'No WhatsApp groups available'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                >
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* DESIGN ONLY: Enhanced Group Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <MessageCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                            {group.isActive && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-semibold">Active</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{group.description}</p>
                        </div>
                      </div>

                      {/* DESIGN ONLY: Enhanced Group Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-center">
                          <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-sm font-semibold text-blue-700">{group.subject}</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl text-center">
                          <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                          <div className="text-sm font-semibold text-purple-700">Class {group.class}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl text-center">
                          <User className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-sm font-semibold text-green-700">{group.memberCount} members</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl text-center">
                          <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <div className="text-sm font-semibold text-orange-700">{formatTimeAgo(group.lastActivity)}</div>
                        </div>
                      </div>

                      {/* DESIGN ONLY: Enhanced Mentor Info */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={group.mentor.avatar} />
                            <AvatarFallback className="bg-blue-200 text-blue-700 font-bold">
                              {group.mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-bold text-blue-800">👨‍🏫 {group.mentor.name}</h4>
                            <p className="text-sm text-blue-600">Subject Mentor</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* DESIGN ONLY: Enhanced Group Guidelines */}
                      <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
                        <h4 className="font-semibold text-yellow-800 mb-3">📋 Group Guidelines:</h4>
                        <ul className="space-y-2">
                          {group.guidelines.map((guideline, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-yellow-700">
                              <CheckCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{guideline}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* DESIGN ONLY: Enhanced Join Button */}
                      <div className="flex items-center justify-center pt-2">
                        <Button
                          onClick={() => handleJoinGroup(group.whatsappLink)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          💬 Join WhatsApp Group
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* DESIGN ONLY: Enhanced Sidebar */}
          <div className="space-y-6">
            {/* DESIGN ONLY: Enhanced Recent Q&A */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <span>🤔 Latest doubts solved by mentors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recentQA.map((qa) => (
                    <div
                      key={qa.id}
                      className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">❓ {qa.question}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <User className="h-4 w-4" />
                            <span>Asked by {qa.askedBy}</span>
                            <span>•</span>
                            <Badge className="bg-blue-100 text-blue-700">{qa.subject}</Badge>
                          </div>
                        </div>

                        {qa.answer && (
                          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                            <div className="flex items-start space-x-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-sm font-semibold text-green-700">
                                Answer by {qa.answeredBy}:
                              </span>
                            </div>
                            <p className="text-sm text-green-800">{qa.answer}</p>
                          </div>
                        )}

                        {!qa.isAnswered && (
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600 font-medium">⏳ Waiting for answer...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DESIGN ONLY: Enhanced Help Tips */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center space-x-2">
                  <Star className="h-6 w-6 text-purple-600" />
                  <span>💡 Tips for better answers:</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-3 text-sm">
                  {[
                    '📸 Share clear photos of your problem',
                    '📝 Explain what you\'ve already tried',
                    '🎯 Be specific about what confuses you',
                    '⏰ Ask questions during mentor hours',
                    '🤝 Help others when you can'
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-purple-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* DESIGN ONLY: Enhanced Contact Support */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-blue-800 mb-3">🆘 Need Help?</h4>
                <p className="text-sm text-blue-600 mb-4">
                  Get help from mentors and peers in WhatsApp groups
                </p>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  📧 Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
