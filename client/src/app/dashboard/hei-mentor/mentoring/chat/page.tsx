// src/app/dashboard/hei-mentor/mentoring/chat/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle,
  Send,
  Search,
  Users,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { 
  ChatRoom, 
  ChatMessage, 
  ChatRoomParticipant, 
  User,
  ChatRoomListResponse 
} from '@/types/hei-mentor';

interface ChatRoomWithDetails extends ChatRoom {
  participants: (ChatRoomParticipant & { user: User })[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [chatRooms, setChatRooms] = useState<ChatRoomWithDetails[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomWithDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if we need to open a specific student chat from URL params
  const studentId = searchParams?.get('student');

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (studentId && chatRooms.length > 0) {
      const studentRoom = chatRooms.find(room => 
        room.participants.some(p => p.user.id === studentId)
      );
      if (studentRoom) {
        setSelectedRoom(studentRoom);
      }
    }
  }, [studentId, chatRooms]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      
      // Mock chat rooms data matching the exact schema
      const mockChatRooms: ChatRoomWithDetails[] = [
        {
          id: 'room_001',
          name: 'Computer Science Study Group',
          description: 'Discussion group for computer science topics',
          room_type: 'group',
          created_by: 'mentor_001',
          is_active: true,
          created_at: '2025-10-01T10:00:00Z',
          updated_at: '2025-10-05T16:30:00Z',
          participants: [
            {
              id: 'participant_001',
              room_id: 'room_001',
              user_id: 'student_001',
              joined_at: '2025-10-01T10:00:00Z',
              last_seen: '2025-10-05T16:00:00Z',
              unread_count: 2,
              is_admin: false,
              is_active: true,
              user: {
                id: 'student_001',
                email: 'priya.sharma@student.gov.in',
                name: 'Priya Sharma',
                phone_number: '+91-98765-11111',
                user_type: 'student',
                profile_picture: undefined,
                is_active: true,
                onboarding_completed: true,
                created_at: '2025-08-01T10:00:00Z',
                updated_at: '2025-10-01T12:00:00Z'
              }
            },
            {
              id: 'participant_002',
              room_id: 'room_001',
              user_id: 'student_002',
              joined_at: '2025-10-01T10:30:00Z',
              last_seen: '2025-10-05T15:45:00Z',
              unread_count: 1,
              is_admin: false,
              is_active: true,
              user: {
                id: 'student_002',
                email: 'rahul.kumar@student.gov.in',
                name: 'Rahul Kumar',
                phone_number: '+91-98765-22222',
                user_type: 'student',
                profile_picture: undefined,
                is_active: true,
                onboarding_completed: true,
                created_at: '2025-08-01T11:00:00Z',
                updated_at: '2025-10-01T13:00:00Z'
              }
            }
          ],
          unreadCount: 2,
          lastMessage: {
            id: 'msg_001',
            room_id: 'room_001',
            sender_id: 'student_001',
            content: 'Hi sir, I have a question about the assignment',
            message_type: 'text',
            file_url: undefined,
            reply_to_id: undefined,
            is_edited: false,
            is_deleted: false,
            created_at: '2025-10-05T16:30:00Z',
            updated_at: '2025-10-05T16:30:00Z'
          }
        },
        {
          id: 'room_002',
          name: 'Mathematics Help',
          description: 'One-on-one math tutoring',
          room_type: 'direct',
          created_by: 'mentor_001',
          is_active: true,
          created_at: '2025-10-02T14:00:00Z',
          updated_at: '2025-10-05T10:15:00Z',
          participants: [
            {
              id: 'participant_003',
              room_id: 'room_002',
              user_id: 'student_003',
              joined_at: '2025-10-02T14:00:00Z',
              last_seen: '2025-10-05T10:15:00Z',
              unread_count: 0,
              is_admin: false,
              is_active: true,
              user: {
                id: 'student_003',
                email: 'anjali.singh@student.gov.in',
                name: 'Anjali Singh',
                phone_number: '+91-98765-33333',
                user_type: 'student',
                profile_picture: undefined,
                is_active: true,
                onboarding_completed: true,
                created_at: '2025-08-01T12:00:00Z',
                updated_at: '2025-10-02T14:00:00Z'
              }
            }
          ],
          unreadCount: 0,
          lastMessage: {
            id: 'msg_002',
            room_id: 'room_002',
            sender_id: 'mentor_001',
            content: 'Great work on the calculus problems!',
            message_type: 'text',
            file_url: undefined,
            reply_to_id: undefined,
            is_edited: false,
            is_deleted: false,
            created_at: '2025-10-05T10:15:00Z',
            updated_at: '2025-10-05T10:15:00Z'
          }
        }
      ];
      
      setChatRooms(mockChatRooms);
      
      if (!selectedRoom && mockChatRooms.length > 0) {
        setSelectedRoom(mockChatRooms[0]);
      }
    } catch (err) {
      console.error('Failed to fetch chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      // Mock messages data matching the exact schema
      const mockMessages: ChatMessage[] = [
        {
          id: 'msg_001',
          room_id: roomId,
          sender_id: 'student_001',
          content: 'Hi sir, I have a question about the assignment',
          message_type: 'text',
          file_url: undefined,
          reply_to_id: undefined,
          is_edited: false,
          is_deleted: false,
          created_at: '2025-10-05T16:30:00Z',
          updated_at: '2025-10-05T16:30:00Z'
        },
        {
          id: 'msg_002',
          room_id: roomId,
          sender_id: 'mentor_001',
          content: 'Sure! What would you like to know?',
          message_type: 'text',
          file_url: undefined,
          reply_to_id: undefined,
          is_edited: false,
          is_deleted: false,
          created_at: '2025-10-05T16:32:00Z',
          updated_at: '2025-10-05T16:32:00Z'
        },
        {
          id: 'msg_003',
          room_id: roomId,
          sender_id: 'student_001',
          content: 'I am struggling with the algorithm implementation part.',
          message_type: 'text',
          file_url: undefined,
          reply_to_id: undefined,
          is_edited: false,
          is_deleted: false,
          created_at: '2025-10-05T16:35:00Z',
          updated_at: '2025-10-05T16:35:00Z'
        }
      ];
      
      setMessages(mockMessages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || sending) return;

    try {
      setSending(true);
      
      const message: ChatMessage = {
        id: `msg_${Date.now()}`,
        room_id: selectedRoom.id,
        sender_id: 'mentor_001', // Current mentor
        content: newMessage.trim(),
        message_type: 'text',
        file_url: undefined,
        reply_to_id: undefined,
        is_edited: false,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Here you would call the actual API
      // await heiMentorAPI.sendMessage(selectedRoom.id, { 
      //   content: message.content, 
      //   message_type: message.message_type 
      // });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  const getOtherParticipantName = (room: ChatRoomWithDetails) => {
    if (room.room_type === 'direct') {
      const otherParticipant = room.participants.find(p => p.user_id !== 'mentor_001');
      return otherParticipant?.user.name || 'Unknown User';
    }
    return room.name;
  };

  const getOtherParticipantInitials = (room: ChatRoomWithDetails) => {
    if (room.room_type === 'direct') {
      const otherParticipant = room.participants.find(p => p.user_id !== 'mentor_001');
      return otherParticipant?.user.name.split(' ').map(n => n[0]).join('') || 'U';
    }
    return room.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-lg border overflow-hidden">
      {/* Chat Sidebar */}
      <div className={`w-80 border-r flex flex-col ${selectedRoom ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat Rooms List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedRoom?.id === room.id 
                    ? 'bg-blue-50 border-blue-200 border' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {room.room_type === 'group' ? (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    ) : (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {getOtherParticipantInitials(room)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {room.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{room.unreadCount}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">
                        {getOtherParticipantName(room)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {room.lastMessage && formatTime(room.lastMessage.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {room.lastMessage?.content || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {room.participants.length} member{room.participants.length !== 1 ? 's' : ''}
                      </Badge>
                      {room.room_type === 'direct' && (
                        <Badge variant="outline" className="text-xs">
                          Direct
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${selectedRoom ? 'flex' : 'hidden md:flex'}`}>
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSelectedRoom(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  {selectedRoom.room_type === 'group' ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  ) : (
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {getOtherParticipantInitials(selectedRoom)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getOtherParticipantName(selectedRoom)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedRoom.participants.length} member{selectedRoom.participants.length !== 1 ? 's' : ''}
                      {selectedRoom.description && ` • ${selectedRoom.description}`}
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
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.sender_id === 'mentor_001';
                  const showDateDivider = index === 0 || 
                    formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);
                  
                  return (
                    <div key={message.id}>
                      {showDateDivider && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{formatTime(message.created_at)}</span>
                            {isOwnMessage && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                            {message.is_edited && (
                              <span className="text-xs opacity-70">(edited)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex items-center space-x-3">
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  disabled={sending}
                />
                
                <Button type="button" variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                
                <Button type="submit" size="sm" disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 mb-4">Choose from your existing conversations or start a new one</p>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
