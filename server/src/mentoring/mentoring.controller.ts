// server/src/mentoring/mentoring.controller.ts

import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MentoringService } from './mentoring.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
import { IsString } from 'class-validator';

class ChooseMentorDto {
  @IsString()
  mentor_id: string;
}

@ApiTags('Mentoring')
@Controller('mentoring')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  // ── Mentor-Student Linking ──────────────────────────────

  /** List all available mentors (for students to choose from) */
  @Get('available-mentors')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'List available HEI mentors' })
  @ApiResponse({ status: 200, description: 'List of mentors' })
  async getAvailableMentors() {
    return this.mentoringService.getAvailableMentors();
  }

  /** Student chooses a mentor */
  @Post('choose-mentor')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Student selects a mentor' })
  @ApiResponse({ status: 201, description: 'Mentor linked' })
  async chooseMentor(@Body() dto: ChooseMentorDto, @Req() req: Request) {
    const user = req.user as any;
    return this.mentoringService.chooseMentor(user.sub, dto.mentor_id);
  }

  /** Get my current mentor (student) */
  @Get('my-mentor')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get my assigned mentor' })
  @ApiResponse({ status: 200, description: 'Current mentor or null' })
  async getMyMentor(@Req() req: Request) {
    const user = req.user as any;
    return this.mentoringService.getMyMentor(user.sub);
  }

  /** Get my mentees (mentor) */
  @Get('my-mentees')
  @Roles('HEI_MENTOR')
  @ApiOperation({ summary: 'Get my mentees' })
  @ApiResponse({ status: 200, description: 'List of mentees' })
  async getMyMentees(@Req() req: Request) {
    const user = req.user as any;
    return this.mentoringService.getMyMentees(user.sub);
  }

  // ── Sessions ───────────────────────────────────────────

  @Get('sessions')
  @ApiOperation({ summary: 'List mentoring sessions for the current user' })
  @ApiResponse({ status: 200, description: 'List of mentoring sessions' })
  async getSessions(@Req() req: Request) {
    const user = req.user as any;
    const role = user.user_metadata?.role;
    return this.mentoringService.getSessions(user.sub, role);
  }

  @Post('schedule')
  @Roles('HEI_MENTOR')
  @ApiOperation({ summary: 'Schedule a mentoring session with Google Meet link' })
  @ApiResponse({ status: 201, description: 'Session scheduled with Meet link' })
  @ApiResponse({ status: 403, description: 'Only HEI_MENTOR role can schedule sessions' })
  async scheduleSession(
    @Body() dto: ScheduleSessionDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.mentoringService.scheduleSession(user.sub, dto);
  }

  // ── Calendar Health ────────────────────────────────────

  @Get('calendar-health')
  @Roles('HEI_MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Check Google Calendar integration health' })
  @ApiResponse({ status: 200, description: 'Calendar health status' })
  getCalendarHealth() {
    return this.mentoringService.getCalendarHealth();
  }

  @Post('calendar-refresh')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Re-initialize Google Calendar client with current env' })
  @ApiResponse({ status: 200, description: 'Calendar client re-initialized' })
  refreshCalendar() {
    return this.mentoringService.refreshCalendarClient();
  }
}
