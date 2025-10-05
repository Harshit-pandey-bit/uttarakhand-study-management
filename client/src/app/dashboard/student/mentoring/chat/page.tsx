'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MessageCircle,
  Send,
  Users,
  Video,
  Calendar,
  Settings,
  Search,
  MoreVertical,
  Phone,
  UserPlus,
  Loader2,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Import our custom hook
import { useChat } from '@/hooks/useSocket';
import { mentoringAPI } from '@/lib/api/mentoringClient';
import { ChatRoom, ChatMessage } from '@/types/mentoring';

export default function ChatPage() {
  // Socket connection and chat state
  const {
    connected,
    error,
    connecting,
    messages,
    typingUsers,
    currentRoom,
    roomInfo,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping,
    connect
  } = useChat();

  // UI state
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat rooms
  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await mentoringAPI.getChatRooms();
      if (response.data) {
        setChatRooms(response.data);
      }
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle room selection
  const handleRoomSelect = useCallback((roomId: string) => {
    setSelectedRoom(roomId);
    joinRoom(roomId);
  }, [joinRoom]);

  // Handle message sending
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && connected) {
      sendMessage(messageInput);
      setMessageInput('');
      stopTyping();
    }
  }, [messageInput, sendMessage, stopTyping, connected]);

  // Handle typing indicators
  const handleInputChange = (value: string) => {
    setMessageInput(value);

    if (value.trim() && connected) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter rooms based on search
  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd MMM HH:mm');
    }
  };

  // Connection status component
  const ConnectionStatus = () => {
    if (connecting) {
      return (
        <div className="flex items-center space-x-2 text-yellow-600 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <WifiOff className="h-4 w-4" />
          <span>Connection error</span>
          <Button onClick={connect} size="sm" variant="outline">
            Retry
          </Button>
        </div>
      );
    }

    if (!connected) {
      return (
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <WifiOff className="h-4 w-4" />
          <span>Disconnected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <Wifi className="h-4 w-4" />
        <span>Connected</span>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Mentoring Chat</h1>
            <ConnectionStatus />
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Room List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100",
                      selectedRoom === room.id && "bg-blue-50 border border-blue-200"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={room.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {room.type === 'group' ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              room.name.slice(0, 2).toUpperCase()
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {room.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
                          {room.lastMessageTime && (
                            <span className="text-xs text-gray-500">
                              {format(new Date(room.lastMessageTime), 'HH:mm')}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage?.content || 'No messages yet'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            {room.type === 'group' && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {room.participants}
                              </Badge>
                            )}
                          </div>
                          
                          {room.unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                              {room.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link href="/dashboard/student/mentoring/sessions">
            <Button variant="outline" className="w-full justify-start">
              <Video className="mr-2 h-4 w-4" />
              Video Sessions
            </Button>
          </Link>
          <Link href="/dashboard/student/mentoring/sessions/schedule">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom && currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <Users className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{roomInfo?.roomId || selectedRoom}</h2>
                    <p className="text-sm text-gray-600">
                      {roomInfo?.onlineUsers.length || 0} members online
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

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.messageType === 'system' 
                        ? "justify-center" 
                        : "justify-start"
                    )}
                  >
                    {message.messageType === 'system' ? (
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {message.content}
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 max-w-3xl">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                            {message.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{message.username}</span>
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <p className="text-gray-900">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicators */}
                {typingUsers.length > 0 && (
                  <div className="flex items-start space-x-3 opacity-60">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                        ...
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      connected 
                        ? `Message ${roomInfo?.roomId || 'room'}...`
                        : "Connecting to chat..."
                    }
                    disabled={!connected}
                    className="resize-none"
                    maxLength={roomInfo?.features.maxMessageLength || 1000}
                  />
                  {roomInfo?.features.maxMessageLength && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {messageInput.length}/{roomInfo.features.maxMessageLength}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!connected || !messageInput.trim()}
                  className="px-4 py-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No room selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Choose a conversation to start chatting
              </h3>
              <p className="text-gray-500 mb-6">
                Select a room from the sidebar to begin messaging with mentors and peers
              </p>
              <div className="space-y-2">
                <Link href="/dashboard/student/mentoring/sessions">
                  <Button className="mr-2">
                    <Video className="mr-2 h-4 w-4" />
                    Join Video Session
                  </Button>
                </Link>
                <Link href="/dashboard/student/mentoring/sessions/schedule">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
