// src/app/dashboard/hei-mentor/mentoring/chat/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  MessageCircle,
  Search
} from 'lucide-react';

import { mentoringAPI } from '@/lib/api/mentoringClient';
import type { ChatRoom, ChatMessage, SendMessage, MessageType } from '@/types/mentoring';

interface RoomInfo {
  onlineUsers: string[];
  typingUsers: string[];
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('student');
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({ onlineUsers: [], typingUsers: [] });
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  // Socket event listeners for selected room
  useEffect(() => {
    if (!socket || !selectedRoom) return;

    socket.emit('join_room', { roomId: selectedRoom.id });

    socket.on('new_message', (message: ChatMessage) => {
      if (message.id === selectedRoom.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('room_info', (info: RoomInfo) => {
      setRoomInfo(info);
    });

    socket.on('user_typing', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      if (isTyping) {
        setRoomInfo(prev => ({
          ...prev,
          typingUsers: [...new Set([...prev.typingUsers, userId])]
        }));
      } else {
        setRoomInfo(prev => ({
          ...prev,
          typingUsers: prev.typingUsers.filter(id => id !== userId)
        }));
      }
    });

    return () => {
      socket.emit('leave_room', { roomId: selectedRoom.id });
      socket.off('new_message');
      socket.off('room_info');
      socket.off('user_typing');
    };
  }, [socket, selectedRoom]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await mentoringAPI.getChatRooms();
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to load chat rooms');
      }
      
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = async (room: ChatRoom) => {
    setSelectedRoom(room);
    setMessages([]);
    
    try {
      const response = await mentoringAPI.getChatMessages(room.id);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to load messages');
      }
      
      // Extract messages array from paginated response
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedRoom || sending) return;

    setSending(true);
    
    try {
      const messagePayload: SendMessage = {
        content: messageText.trim(),
        messageType: 'text' as MessageType
      };

      const response = await mentoringAPI.sendMessage(selectedRoom.id, messagePayload);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to send message');
      }
      
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedRoom) return;

    socket.emit('typing', { roomId: selectedRoom.id, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { roomId: selectedRoom.id, isTyping: false });
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Student Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredRooms.length > 0 ? (
            <div className="divide-y">
              {filteredRooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                
                return (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {room.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">{room.name}</p>
                          {room.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(room.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <Badge className="bg-blue-600">{room.unreadCount}</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No conversations found</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedRoom.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedRoom.name}</h3>
                <p className="text-sm text-gray-600">
                  {roomInfo.onlineUsers.length > 0 ? (
                    <span className="text-green-600">● Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.sender?.role === 'mentor';
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {roomInfo.typingUsers.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Student is typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTyping();
                }}
                className="flex-1"
                disabled={sending}
              />
              <Button type="submit" disabled={!messageText.trim() || sending}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500">
              Choose a student from the sidebar to begin messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
