'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Users,
  Hash,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Settings,
  Bell,
  Pin,
  Smartphone,
  Calendar
} from 'lucide-react';
import WhatsAppGroups from '@/components/shared/communication/whatsapp-groups';
import { useAuth } from '@/hooks/use-auth';

interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  participants: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: 'student' | 'mentor';
  };
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export default function MentoringChatPage() {
  const { user } = useAuth();

  // State management
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedRoomData = chatRooms.find(room => room.id === selectedRoom);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      const mockRooms: ChatRoom[] = [
        {
          id: 'room1',
          name: 'Physics Study Group',
          type: 'group',
          participants: 12,
          lastMessage: 'Great explanation about optics!',
          lastMessageTime: '2 min ago',
          unreadCount: 3
        },
        {
          id: 'room2',
          name: 'Chemistry Lab Discussion',
          type: 'group',
          participants: 8,
          lastMessage: 'When is our next lab session?',
          lastMessageTime: '10 min ago',
          unreadCount: 0
        },
        {
          id: 'room3',
          name: 'Dr. Rajesh Kumar',
          type: 'direct',
          participants: 2,
          lastMessage: 'I\'ll send you the study material',
          lastMessageTime: '1 hour ago',
          unreadCount: 1,
          isOnline: true,
          avatar: '/mentors/dr-rajesh.jpg'
        },
        {
          id: 'room4',
          name: 'Career Guidance Group',
          type: 'group',
          participants: 15,
          lastMessage: 'Thanks for the advice on engineering careers',
          lastMessageTime: '3 hours ago',
          unreadCount: 0
        }
      ];

      const mockMessages: Message[] = [
        {
          id: 'msg1',
          sender: {
            name: 'Dr. Rajesh Kumar',
            avatar: '/mentors/dr-rajesh.jpg',
            role: 'mentor'
          },
          content: 'Good morning everyone! Today we\'ll discuss the principles of light and optics.',
          timestamp: '9:00 AM',
          type: 'text'
        },
        {
          id: 'msg2',
          sender: {
            name: 'Priya Singh',
            avatar: '/students/priya.jpg',
            role: 'student'
          },
          content: 'Sir, I have a doubt about total internal reflection.',
          timestamp: '9:15 AM',
          type: 'text'
        },
        {
          id: 'msg3',
          sender: {
            name: 'Dr. Rajesh Kumar',
            avatar: '/mentors/dr-rajesh.jpg',
            role: 'mentor'
          },
          content: 'Excellent question, Priya! Total internal reflection occurs when light travels from a denser medium to a rarer medium at an angle greater than the critical angle.',
          timestamp: '9:16 AM',
          type: 'text',
          reactions: [{ emoji: '👍', count: 5, users: ['Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Rohit Sharma', 'Kavya Patel'] }]
        },
        {
          id: 'msg4',
          sender: {
            name: 'Rahul Sharma',
            avatar: '/students/rahul.jpg',
            role: 'student'
          },
          content: 'That makes sense! Can you explain with a practical example?',
          timestamp: '9:18 AM',
          type: 'text'
        }
      ];

      setChatRooms(mockRooms);
      setMessages(mockMessages);
      setSelectedRoom('room1'); // Default to first room
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: Message = {
      id: `msg${Date.now()}`,
      sender: {
        name: 'You',
        avatar: '/students/current-user.jpg',
        role: 'student'
      },
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }),
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWhatsAppQuestion = (question: string, subject: string) => {
    console.log('WhatsApp question submitted:', { question, subject });
    // Handle question submission to WhatsApp groups
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
            <div className="bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-3 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Communication Hub</h1>
            <p className="text-gray-600 text-lg">Chat with mentors and join study groups</p>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs with WhatsApp Integration */}
      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>WhatsApp Groups</span>
          </TabsTrigger>
          <TabsTrigger value="direct-chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Direct Chat</span>
          </TabsTrigger>
          <TabsTrigger value="video-call" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>Video Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
        </TabsList>

        {/* WhatsApp Groups Tab */}
        <TabsContent value="whatsapp">
          <WhatsAppGroups 
            studentId={user?.id || ''} 
            onQuestionSubmit={handleWhatsAppQuestion}
          />
        </TabsContent>

        {/* Direct Chat Tab - Your existing chat interface */}
        <TabsContent value="direct-chat">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
            {/* Chat Rooms Sidebar */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Chats</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4">
                    {chatRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRoom === room.id 
                            ? 'bg-blue-100 border border-blue-200' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {room.type === 'direct' ? (
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={room.avatar} />
                                <AvatarFallback>
                                  {room.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Hash className="h-6 w-6 text-white" />
                              </div>
                            )}
                            {room.isOnline && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">{room.name}</h3>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">{room.lastMessageTime}</span>
                                {room.unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5">
                                    {room.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                            {room.type === 'group' && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">{room.participants} members</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Messages Area */}
            <div className="lg:col-span-3">
              {selectedRoomData ? (
                <Card className="bg-white border-0 shadow-sm h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                    <div className="flex items-center space-x-3">
                      {selectedRoomData.type === 'direct' ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedRoomData.avatar} />
                          <AvatarFallback>
                            {selectedRoomData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Hash className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedRoomData.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedRoomData.type === 'group' 
                            ? `${selectedRoomData.participants} members`
                            : selectedRoomData.isOnline ? 'Online' : 'Last seen recently'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full px-4 py-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex space-x-3 ${
                              message.sender.name === 'You' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}
                          >
                            {message.sender.name !== 'You' && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.sender.avatar} />
                                <AvatarFallback className="text-xs">
                                  {message.sender.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`flex-1 max-w-lg ${
                              message.sender.name === 'You' ? 'text-right' : ''
                            }`}>
                              <div className={`inline-block p-3 rounded-lg ${
                                message.sender.name === 'You'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                {message.sender.name !== 'You' && (
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-medium">
                                      {message.sender.name}
                                    </span>
                                    {message.sender.role === 'mentor' && (
                                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                                        Mentor
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <div className={`text-xs text-gray-500 mt-1 ${
                                message.sender.name === 'You' ? 'text-right' : 'text-left'
                              }`}>
                                {message.timestamp}
                              </div>
                              {/* Reactions */}
                              {message.reactions && (
                                <div className="flex space-x-1 mt-2">
                                  {message.reactions.map((reaction, idx) => (
                                    <button
                                      key={idx}
                                      className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 text-xs"
                                    >
                                      <span>{reaction.emoji}</span>
                                      <span>{reaction.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="border-0 focus:ring-0 focus:border-0"
                        />
                      </div>
                      <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white border-0 shadow-sm h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Select a chat to start messaging
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to begin chatting
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Video Sessions Tab */}
        <TabsContent value="video-call">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Video Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Join live video sessions with mentors and peers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Scheduled Sessions</h3>
                  <p className="text-sm text-gray-600">View and join your upcoming video sessions</p>
                  <Link href="/dashboard/student/mentoring/sessions">
                    <Button className="mt-3" variant="outline">
                      View Sessions
                    </Button>
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Live Sessions</h3>
                  <p className="text-sm text-gray-600">Join ongoing group sessions</p>
                  <Button className="mt-3" disabled>
                    <Video className="mr-2 h-4 w-4" />
                    No Live Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Schedule new mentoring sessions and manage your timetable
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Book Individual Session</h3>
                  <p className="text-sm text-gray-600">One-on-one mentoring with your assigned mentor</p>
                  <Link href="/dashboard/student/mentoring/sessions/schedule">
                    <Button className="mt-3">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Session
                    </Button>
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">View Timetable</h3>
                  <p className="text-sm text-gray-600">Check your weekly mentoring schedule</p>
                  <Link href="/dashboard/student/mentoring/timetable">
                    <Button className="mt-3" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Timetable
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
