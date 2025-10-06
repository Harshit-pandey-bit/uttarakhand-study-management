// src/common/controllers/system.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor() {}

  @Get('status')
  @ApiOperation({ summary: 'Get system status' })
  async getSystemStatus() {
    // For now, let's make it simple without dependencies
    return {
      timestamp: new Date().toISOString(),
      server: {
        status: 'running',
        port: process.env.PORT || 3001,
        nodeEnv: process.env.NODE_ENV || 'development',
        uptime: Math.floor(process.uptime()),
      },
      services: {
        googleMeet: {
          enabled: !!process.env.GOOGLE_CREDENTIALS_JSON,
          message: process.env.GOOGLE_CREDENTIALS_JSON 
            ? 'Google Meet integration is active' 
            : 'Google Meet integration is disabled - add GOOGLE_CREDENTIALS_JSON to enable',
        },
        localStorage: {
          enabled: true,
          message: 'Local storage is active',
        },
        whatsapp: {
          enabled: true,
          message: 'WhatsApp link processing is active',
        },
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
