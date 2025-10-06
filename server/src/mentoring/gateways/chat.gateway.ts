// src/mentoring/gateways/chat.gateway.ts

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  messageType: 'text' | 'system';
}

interface TypingIndicator {
  roomId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

interface ConnectedUser {
  userId: string;
  username: string;
  rooms: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/mentoring-chat',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<string, ConnectedUser>();

  // ✅ NO AUTHENTICATION - Page is already protected
  async handleConnection(client: Socket) {
    // Generate a simple user for this session
    const userId = `user-${Date.now().toString().slice(-6)}`;
    const username = `Student${userId.slice(-4)}`;
    
    this.connectedUsers.set(client.id, {
      userId,
      username,
      rooms: new Set(),
    });

    // Send successful connection message
    client.emit('connected', {
      message: '💬 Connected to mentoring chat system',
      userId,
      username,
      onlineUsers: Array.from(this.connectedUsers.values()).map(user => ({
        userId: user.userId,
        username: user.username,
      })),
      features: {
        textMessaging: true,
        fileUploads: true,
        maxMessageLength: 1000,
      }
    });

    this.logger.log(`✅ User connected to chat: ${username} (${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      // Leave all rooms and notify others
      user.rooms.forEach(roomId => {
        client.leave(roomId);
        this.server.to(roomId).emit('user_left', {
          userId: user.userId,
          username: user.username,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        });
      });

      this.connectedUsers.delete(client.id);
      this.logger.log(`👋 User disconnected from chat: ${user.username} (${client.id})`);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: 'User session not found' });
      return;
    }

    const { roomId } = data;

    try {
      // Join the room
      client.join(roomId);
      user.rooms.add(roomId);

      // Notify room about new user (except the user who joined)
      client.to(roomId).emit('user_joined', {
        userId: user.userId,
        username: user.username,
        message: `${user.username} joined the chat`,
        timestamp: new Date().toISOString(),
      });

      // Send room info to the user
      client.emit('joined_room', {
        roomId,
        message: `✅ Joined room: ${roomId}`,
        onlineUsers: this.getRoomUsers(roomId),
        features: {
          textMessaging: true,
          fileUploads: false,
          maxMessageLength: 1000,
        },
      });

      this.logger.log(`👤 User ${user.username} joined chat room: ${roomId}`);
    } catch (error) {
      this.logger.error(`Failed to join room ${roomId}:`, error.message);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: 'User session not found' });
      return;
    }

    if (!user.rooms.has(data.roomId)) {
      client.emit('error', { message: 'You must join the room first' });
      return;
    }

    // Validate message content
    if (!data.content || data.content.trim().length === 0) {
      client.emit('error', { message: 'Message content cannot be empty' });
      return;
    }

    if (data.content.length > 1000) {
      client.emit('error', { message: 'Message too long (max 1000 characters)' });
      return;
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: data.roomId,
      userId: user.userId,
      username: user.username,
      content: data.content.trim(),
      timestamp: new Date().toISOString(),
      messageType: 'text',
    };

    // Broadcast message to all users in the room
    this.server.to(data.roomId).emit('new_message', message);

    this.logger.log(
      `💬 Message sent in ${data.roomId} by ${user.username}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`
    );
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user || !user.rooms.has(data.roomId)) return;

    const typingData: TypingIndicator = {
      roomId: data.roomId,
      userId: user.userId,
      username: user.username,
      isTyping: true,
    };

    client.to(data.roomId).emit('typing_indicator', typingData);
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user || !user.rooms.has(data.roomId)) return;

    const typingData: TypingIndicator = {
      roomId: data.roomId,
      userId: user.userId,
      username: user.username,
      isTyping: false,
    };

    client.to(data.roomId).emit('typing_indicator', typingData);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) return;

    if (user.rooms.has(data.roomId)) {
      client.leave(data.roomId);
      user.rooms.delete(data.roomId);

      client.to(data.roomId).emit('user_left', {
        userId: user.userId,
        username: user.username,
        message: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
      });

      client.emit('left_room', {
        roomId: data.roomId,
        message: `Left room: ${data.roomId}`,
      });

      this.logger.log(`👋 User ${user.username} left chat room: ${data.roomId}`);
    }
  }

  private getRoomUsers(roomId: string): Array<{ userId: string; username: string }> {
    const users: Array<{ userId: string; username: string }> = [];
    this.connectedUsers.forEach((user) => {
      if (user.rooms.has(roomId)) {
        users.push({
          userId: user.userId,
          username: user.username,
        });
      }
    });
    return users;
  }
}
