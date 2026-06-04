// server/src/app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Root health check' })
  getHealth() {
    return {
      status: 'ok',
      service: 'uk-gsmp-api',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
