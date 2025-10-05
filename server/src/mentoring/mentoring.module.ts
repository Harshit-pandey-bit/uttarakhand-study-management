// server/src/mentoring/mentoring.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controllers & Gateways
import { MentoringController } from './mentoring.controller';
import { ChatGateway } from './gateways/chat.gateway';

// Services
import { MentoringService } from './mentoring.service';
import { GoogleMeetService } from '../integrations/google-meet/google-meet.service';
import { WhatsAppService } from '../integrations/whatsapp/whatsapp.service';

@Module({
  imports: [
    ConfigModule, // For Supabase and integration configurations
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { 
          expiresIn: '24h',
          issuer: 'mentoring-platform',
        },
      }),
      inject: [ConfigService],
    }), // Required for ChatGateway JWT authentication
  ],
  controllers: [
    MentoringController, // Main API controller with 45+ endpoints
  ],
  providers: [
    // Core Services
    MentoringService, // Database operations and business logic
    
    // WebSocket Gateway
    ChatGateway, // Real-time chat functionality
    
    // Integration Services
    GoogleMeetService, // Google Meet & Calendar integration
    WhatsAppService, // WhatsApp group management
  ],
  exports: [
    MentoringService, // Export for use in other modules
    GoogleMeetService, // Export for dashboard/other modules that need meeting creation
    WhatsAppService, // Export for other modules that need WhatsApp integration
  ],
})
export class MentoringModule {}
