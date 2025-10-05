// src/hooks/useSocket.ts
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  autoConnect?: boolean;
  namespace?: string;
}

interface SocketState {
  connected: boolean;
  error: string | null;
  connecting: boolean;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, namespace = '/mentoring-chat' } = options;
  
  const [state, setState] = useState<SocketState>({
    connected: false,
    error: null,
    connecting: false
  });

  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(async () => {
    if (socketRef.current?.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      const socket = io(`http://localhost:3001${namespace}`, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: false,
        // For development - remove in production
        auth: {
          token: 'dev-test'
        }
      });

      socketRef.current = socket;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('✅ Connected to chat server');
        setState({ connected: true, error: null, connecting: false });
      });

      socket.on('connected', (data) => {
        console.log('📱 Chat system ready:', data);
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from chat server:', reason);
        setState(prev => ({ ...prev, connected: false, connecting: false }));
      });

      socket.on('connect_error', (error) => {
        console.error('💥 Connection error:', error);
        let errorMessage = 'Failed to connect to chat server';
        
        if (error.message) {
          if (error.message.includes('Authentication failed') || 
              error.message.includes('Unauthorized')) {
            errorMessage = 'Authentication required. Please log in again.';
          } else if (error.message.includes('jwt') || error.message.includes('token')) {
            errorMessage = 'Session expired. Please log in again.';
          } else {
            errorMessage = error.message;
          }
        }
        
        setState({
          connected: false,
          error: errorMessage,
          connecting: false
        });
      });

      // ✅ IMPROVED ERROR HANDLING
      socket.on('error', (error) => {
        console.error('🚫 Socket error:', error);
        
        // Handle different types of error objects
        let errorMessage = 'Socket error occurred';
        
        if (error && typeof error === 'object') {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.details) {
            errorMessage = error.details;
          } else if (error.error) {
            errorMessage = error.error;
          } else {
            errorMessage = 'Unknown socket error';
          }
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        setState(prev => ({ ...prev, error: errorMessage }));
      });

      // Connect
      socket.connect();

    } catch (error) {
      console.error('Failed to establish socket connection:', error);
      setState({
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        connecting: false
      });
    }
  }, [namespace]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({ connected: false, error: null, connecting: false });
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }, []);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners(event);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    emit,
    on,
    off,
    socket: socketRef.current
  };
};

// Rest of useChat hook remains the same...
export const useChat = () => {
  const socket = useSocket({ namespace: '/mentoring-chat' });
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<any>(null);

  // Message handlers
  useEffect(() => {
    if (!socket.connected) return;

    socket.on('new_message', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('typing_indicator', (data: any) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.username);
        } else {
          newSet.delete(data.username);
        }
        return newSet;
      });

      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.username);
            return newSet;
          });
        }, 3000);
      }
    });

    socket.on('joined_room', (data: any) => {
      setRoomInfo(data);
      setCurrentRoom(data.roomId);
      setMessages([]);
    });

    socket.on('user_joined', (data: any) => {
      console.log('👤 User joined:', data.username);
    });

    socket.on('user_left', (data: any) => {
      console.log('👋 User left:', data.username);
    });

    return () => {
      socket.off('new_message');
      socket.off('typing_indicator');
      socket.off('joined_room');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket.connected) {
      socket.emit('join_room', { roomId });
    }
  }, [socket]);

  const sendMessage = useCallback((content: string) => {
    if (socket.connected && currentRoom && content.trim()) {
      socket.emit('send_message', { 
        roomId: currentRoom, 
        content: content.trim() 
      });
    }
  }, [socket, currentRoom]);

  const startTyping = useCallback(() => {
    if (socket.connected && currentRoom) {
      socket.emit('typing_start', { roomId: currentRoom });
    }
  }, [socket, currentRoom]);

  const stopTyping = useCallback(() => {
    if (socket.connected && currentRoom) {
      socket.emit('typing_stop', { roomId: currentRoom });
    }
  }, [socket, currentRoom]);

  return {
    ...socket,
    messages,
    typingUsers: Array.from(typingUsers),
    currentRoom,
    roomInfo,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping
  };
};
