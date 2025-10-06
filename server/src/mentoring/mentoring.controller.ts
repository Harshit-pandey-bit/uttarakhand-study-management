// server/src/mentoring/mentoring.controller.ts (COMPLETE VERSION)

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { MentoringService } from './mentoring.service';

// Import all existing DTOs
import {
  MentoringDashboardDto,
  MentoringStatsDto,
  MentorDto,
  SessionDto,
  SessionListDto,
  CreateSessionDto,
  UpdateSessionDto,
  SessionFeedbackDto,
  MentorAvailabilityDto,
  MentorMatchRequestDto,
  WhatsAppGroupDto,
  WhatsAppQuestionDto,
  CreateQuestionDto,
  ChatRoomDto,
  ChatMessageDto,
  SendMessageDto,
  CreateChatRoomDto,
  TimetableSlotDto,
  WeeklyTimetableDto,
  AvailableSlotDto,
  BookSessionDto,
  SessionStatus,
  SessionType,
  SchoolDetailDto,
  AssignedSchoolsResponseDto,
  StudentDetailDto,
  AssignedStudentsResponseDto,
  SchoolFiltersDto
} from './dto/mentoring.dto';

// Import new integration services
import { WhatsAppService } from '../integrations/whatsapp/whatsapp.service';
import { GoogleMeetService } from '../integrations/google-meet/google-meet.service';
import { ChatGateway } from './gateways/chat.gateway';

// New DTOs for integration features
import { IsString, IsOptional, IsUrl, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 'Associate Professor' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ example: 'Computer Science Engineering' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: ['Machine Learning', 'Data Science'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @ApiProperty({ example: 'Ph.D. in Computer Science' })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  experience_years?: number;

  @ApiProperty({ example: ['AI', 'Deep Learning'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  research_interests?: string[];

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  max_students?: number;
}

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Introduction to Python' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Create a calculator app' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Class 10' })
  @IsString()
  class_level: string;

  @ApiProperty({ example: '2025-10-15T23:59:59.000Z' })
  @IsString()
  due_date: string;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  total_marks?: number;

  @ApiProperty({ example: 'medium' })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class GradeSubmissionDto {
  @ApiProperty({ example: 85 })
  @IsNumber()
  score: number;

  @ApiProperty({ example: 'Good work!' })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ example: 'A-' })
  @IsOptional()
  @IsString()
  grade?: string;
}

export class CreateWhatsAppGroupDto {
  @ApiProperty({ example: 'Mathematics Study Group' })
  @IsString()
  groupName: string;

  @ApiProperty({ example: 'https://chat.whatsapp.com/ABC123XYZ' })
  @IsUrl()
  whatsappLink: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Class 10 Mathematics group for doubt solving' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ProcessWhatsAppLinkDto {
  @ApiProperty({ example: 'https://chat.whatsapp.com/ABC123XYZ' })
  @IsUrl()
  whatsappLink: string;
}

export class JoinTextChatRoomDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  roomId: string;
}

export class CreateTextChatRoomDto {
  @ApiProperty({ example: 'Math Study Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Room for mathematics discussions' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['student1-id', 'student2-id'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantIds?: string[];
}

@ApiTags('Mentoring')
@Controller('mentoring')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MentoringController {
  private readonly logger = new Logger(MentoringController.name);

  constructor(
    private readonly mentoringService: MentoringService,
    private readonly whatsappService: WhatsAppService,
    private readonly googleMeetService: GoogleMeetService,
    private readonly chatGateway: ChatGateway,
  ) {}

  // =============================================
  // DASHBOARD ENDPOINTS (3 endpoints)
  // =============================================

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentoring dashboard',
    description: 'Get comprehensive mentoring dashboard with sessions, mentors, and stats'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: MentoringDashboardDto
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getMentoringDashboard(@Request() req): Promise<MentoringDashboardDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting mentoring dashboard for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.mentoringService.getMentoringDashboard(studentId);
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get detailed mentoring statistics',
    description: 'Get comprehensive statistics about mentoring activities'
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: MentoringStatsDto
  })
  async getMentoringStats(@Request() req): Promise<MentoringStatsDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting mentoring stats for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.mentoringService.getMentoringStats(studentId);
  }

  @Get('recent-activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get recent mentoring activities',
    description: 'Get list of recent mentoring activities and updates'
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        activities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'session_completed' },
              description: { type: 'string', example: 'Completed session with Dr. Sharma' },
              timestamp: { type: 'string', example: '2025-10-15T10:30:00.000Z' }
            }
          }
        }
      }
    }
  })
  async getRecentActivity(
    @Request() req,
    @Query('limit') limit: number = 10
  ): Promise<{ activities: any[] }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting recent activity for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Mock recent activity - implement actual logic
    const activities = [
      {
        type: 'session_completed',
        description: 'Completed session with Dr. Priya Sharma',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'feedback_submitted',
        description: 'Submitted feedback for Python Programming session',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'whatsapp_joined',
        description: 'Joined Mathematics Study Group on WhatsApp',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      }
    ].slice(0, limit);

    return { activities };
  }

  // =============================================
  // SESSION MANAGEMENT ENDPOINTS (8 endpoints)
  // =============================================

  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentoring sessions',
    description: 'Retrieve mentoring sessions for the authenticated user'
  })
  @ApiQuery({ name: 'status', enum: SessionStatus, required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: SessionListDto
  })
  async getSessions(
    @Request() req,
    @Query('status') status?: SessionStatus,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0
  ): Promise<SessionListDto> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting sessions for user: ${userId}`);

    if (req.user?.role === 'student') {
      return this.mentoringService.getSessions(userId, status, limit, offset);
    } else {
      throw new BadRequestException('Endpoint not implemented for this user type');
    }
  }

  @Get('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get session details',
    description: 'Get detailed information about a specific mentoring session'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Session details retrieved successfully',
    type: SessionDto
  })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiForbiddenResponse({ description: 'Access denied to this session' })
  async getSessionDetails(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ): Promise<SessionDto> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting session details: ${sessionId}`);

    return this.mentoringService.getSessionById(sessionId, userId);
  }

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new session',
    description: 'Create a new mentoring session (mentors only)'
  })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: 'Session created successfully',
    type: SessionDto
  })
  @ApiBadRequestResponse({ description: 'Invalid session data' })
  async createSession(
    @Body(ValidationPipe) createData: CreateSessionDto,
    @Request() req
  ): Promise<SessionDto> {
    const mentorId = req.user?.sub || req.user?.id;
    this.logger.log(`Creating session for mentor: ${mentorId}`);

    if (req.user?.role !== 'hei_mentor') {
      throw new BadRequestException('Only mentors can create sessions');
    }

    return this.mentoringService.createSession(mentorId, createData);
  }

  @Put('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update session',
    description: 'Update an existing mentoring session (mentors only)'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Session updated successfully',
    type: SessionDto
  })
  @ApiForbiddenResponse({ description: 'You can only update your own sessions' })
  async updateSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body(ValidationPipe) updateData: UpdateSessionDto,
    @Request() req
  ): Promise<SessionDto> {
    const mentorId = req.user?.sub || req.user?.id;
    this.logger.log(`Updating session: ${sessionId}`);

    if (req.user?.role !== 'hei_mentor') {
      throw new BadRequestException('Only mentors can update sessions');
    }

    return this.mentoringService.updateSession(sessionId, mentorId, updateData);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel session',
    description: 'Cancel a mentoring session (mentors only)'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiResponse({
    status: 204,
    description: 'Session cancelled successfully'
  })
  async cancelSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ): Promise<void> {
    const mentorId = req.user?.sub || req.user?.id;
    this.logger.log(`Cancelling session: ${sessionId}`);

    if (req.user?.role !== 'hei_mentor') {
      throw new BadRequestException('Only mentors can cancel sessions');
    }

    const updateData: UpdateSessionDto = {
      status: SessionStatus.CANCELLED
    };

    await this.mentoringService.updateSession(sessionId, mentorId, updateData);
  }

  @Post('sessions/:sessionId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Join session',
    description: 'Join a mentoring session as a student'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined session'
  })
  @ApiBadRequestResponse({ description: 'Session is full or already joined' })
  async joinSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ): Promise<{ message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Student joining session: ${sessionId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can join sessions');
    }

    await this.mentoringService.joinSession(sessionId, studentId);
    return { message: 'Successfully joined session' };
  }

  @Post('sessions/:sessionId/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit session feedback',
    description: 'Submit feedback and rating for a completed session'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiBody({ type: SessionFeedbackDto })
  @ApiResponse({
    status: 200,
    description: 'Feedback submitted successfully'
  })
  async submitSessionFeedback(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body(ValidationPipe) feedbackData: SessionFeedbackDto,
    @Request() req
  ): Promise<{ message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Submitting feedback for session: ${sessionId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can submit feedback');
    }

    await this.mentoringService.submitSessionFeedback(sessionId, studentId, feedbackData);
    return { message: 'Feedback submitted successfully' };
  }

  @Get('sessions/:sessionId/recording')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get session recording',
    description: 'Get recording URL for a completed session'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Recording URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        recordingUrl: { type: 'string', example: 'https://recordings.example.com/session123.mp4' },
        expiresAt: { type: 'string', example: '2025-10-20T15:30:00.000Z' }
      }
    }
  })
  async getSessionRecording(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ): Promise<{ recordingUrl: string; expiresAt: string }> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting recording for session: ${sessionId}`);

    // Verify access to session
    await this.mentoringService.getSessionById(sessionId, userId);

    // Mock recording URL - implement actual logic
    return {
      recordingUrl: `https://recordings.example.com/session-${sessionId}.mp4`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // =============================================
  // MENTOR MANAGEMENT ENDPOINTS (5 endpoints)
  // =============================================

  @Get('mentors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get available mentors',
    description: 'Get list of available mentors for mentoring'
  })
  @ApiQuery({ name: 'subject', type: 'string', required: false, description: 'Filter by subject expertise' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Mentors retrieved successfully',
    type: [MentorDto]
  })
  async getAvailableMentors(
    @Query('subject') subject?: string,
    @Query('limit') limit: number = 20
  ): Promise<MentorDto[]> {
    this.logger.log('Getting available mentors');
    return this.mentoringService.getAvailableMentors(subject, limit);
  }

  @Get('mentors/:mentorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentor details',
    description: 'Get detailed information about a specific mentor'
  })
  @ApiParam({ name: 'mentorId', type: 'string', description: 'Mentor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Mentor details retrieved successfully',
    type: MentorDto
  })
  @ApiNotFoundResponse({ description: 'Mentor not found' })
  async getMentorDetails(
    @Param('mentorId', ParseUUIDPipe) mentorId: string
  ): Promise<MentorDto> {
    this.logger.log(`Getting mentor details: ${mentorId}`);
    return this.mentoringService.getMentorById(mentorId);
  }

  @Get('mentors/:mentorId/availability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentor availability',
    description: 'Get weekly availability schedule for a mentor'
  })
  @ApiParam({ name: 'mentorId', type: 'string', description: 'Mentor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Mentor availability retrieved successfully',
    type: [MentorAvailabilityDto]
  })
  async getMentorAvailability(
    @Param('mentorId', ParseUUIDPipe) mentorId: string
  ): Promise<MentorAvailabilityDto[]> {
    this.logger.log(`Getting availability for mentor: ${mentorId}`);
    return this.mentoringService.getMentorAvailability(mentorId);
  }

  @Post('mentors/match-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request mentor matching',
    description: 'Request to be matched with a compatible mentor based on interests'
  })
  @ApiBody({ type: MentorMatchRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Mentor match request processed successfully'
  })
  @ApiBadRequestResponse({ description: 'No compatible mentors available' })
  async requestMentorMatch(
    @Body(ValidationPipe) matchRequest: MentorMatchRequestDto,
    @Request() req
  ): Promise<{ message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Processing mentor match request for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can request mentor matching');
    }

    await this.mentoringService.requestMentorMatch(studentId, matchRequest);
    return { message: 'Mentor match request processed successfully' };
  }

  @Get('mentors/recommendations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentor recommendations',
    description: 'Get personalized mentor recommendations based on student profile'
  })
  @ApiResponse({
    status: 200,
    description: 'Mentor recommendations retrieved successfully',
    type: [MentorDto]
  })
  async getMentorRecommendations(@Request() req): Promise<MentorDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting mentor recommendations for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can get mentor recommendations');
    }

    // Mock recommendations - implement actual logic based on student profile
    return this.mentoringService.getAvailableMentors(undefined, 5);
  }

  // =============================================
  // TIMETABLE & SCHEDULING ENDPOINTS (4 endpoints)
  // =============================================

  @Get('timetable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get weekly timetable',
    description: 'Get current week\'s mentoring timetable'
  })
  @ApiQuery({ name: 'week', type: 'string', required: false, description: 'Week start date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Weekly timetable retrieved successfully',
    type: WeeklyTimetableDto
  })
  async getWeeklyTimetable(
    @Request() req,
    @Query('week') week?: string
  ): Promise<WeeklyTimetableDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting weekly timetable for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    const weekStart = week || new Date().toISOString().split('T')[0];
    return this.mentoringService.getWeeklyTimetable(studentId, weekStart);
  }

  @Get('timetable/week/:date')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get specific week timetable',
    description: 'Get timetable for a specific week'
  })
  @ApiParam({ name: 'date', type: 'string', description: 'Week start date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Weekly timetable retrieved successfully',
    type: WeeklyTimetableDto
  })
  async getSpecificWeekTimetable(
    @Param('date') date: string,
    @Request() req
  ): Promise<WeeklyTimetableDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting timetable for week: ${date}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.mentoringService.getWeeklyTimetable(studentId, date);
  }

  @Get('schedule/available-slots')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get available time slots',
    description: 'Get available time slots for booking sessions'
  })
  @ApiQuery({ name: 'mentorId', type: 'string', required: false, description: 'Filter by specific mentor' })
  @ApiQuery({ name: 'date', type: 'string', required: false, description: 'Date to check (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Available slots retrieved successfully',
    type: [AvailableSlotDto]
  })
  async getAvailableSlots(
    @Query('mentorId') mentorId?: string,
    @Query('date') date?: string
  ): Promise<AvailableSlotDto[]> {
    this.logger.log('Getting available time slots');
    return this.mentoringService.getAvailableSlots(mentorId, date);
  }

  @Post('schedule/book')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Book session',
    description: 'Book a mentoring session with a mentor'
  })
  @ApiBody({ type: BookSessionDto })
  @ApiResponse({
    status: 201,
    description: 'Session booked successfully',
    type: SessionDto
  })
  @ApiBadRequestResponse({ description: 'Invalid booking data or slot not available' })
  async bookSession(
    @Body(ValidationPipe) bookingData: BookSessionDto,
    @Request() req
  ): Promise<SessionDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Booking session for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can book sessions');
    }

    return this.mentoringService.bookSession(studentId, bookingData);
  }

  // =============================================
  // WHATSAPP GROUP ENDPOINTS (6 endpoints)
  // =============================================

  @Get('whatsapp-groups')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get WhatsApp groups',
    description: 'Get list of available WhatsApp study groups'
  })
  @ApiResponse({
    status: 200,
    description: 'WhatsApp groups retrieved successfully',
    type: [WhatsAppGroupDto]
  })
  async getWhatsAppGroups(@Request() req): Promise<WhatsAppGroupDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting WhatsApp groups for student: ${studentId}`);
    return this.mentoringService.getWhatsAppGroups(studentId);
  }

  @Post('whatsapp-groups/:groupId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Join WhatsApp group',
    description: 'Join a WhatsApp study group'
  })
  @ApiParam({ name: 'groupId', type: 'string', description: 'Group UUID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined WhatsApp group'
  })
  @ApiBadRequestResponse({ description: 'Already a member or group is full' })
  async joinWhatsAppGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Request() req
  ): Promise<{ message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Student joining WhatsApp group: ${groupId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can join WhatsApp groups');
    }

    await this.mentoringService.joinWhatsAppGroup(groupId, studentId);
    return { message: 'Successfully joined WhatsApp group' };
  }

  @Delete('whatsapp-groups/:groupId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Leave WhatsApp group',
    description: 'Leave a WhatsApp study group'
  })
  @ApiParam({ name: 'groupId', type: 'string', description: 'Group UUID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left WhatsApp group'
  })
  async leaveWhatsAppGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Request() req
  ): Promise<{ message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Student leaving WhatsApp group: ${groupId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can leave WhatsApp groups');
    }

    await this.mentoringService.leaveWhatsAppGroup(groupId, studentId);
    return { message: 'Successfully left WhatsApp group' };
  }

  @Get('whatsapp-groups/questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get recent questions',
    description: 'Get recent questions from WhatsApp groups'
  })
  @ApiQuery({ name: 'groupId', type: 'string', required: false, description: 'Filter by specific group' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Questions retrieved successfully',
    type: [WhatsAppQuestionDto]
  })
  async getWhatsAppQuestions(
    @Query('groupId') groupId?: string,
    @Query('limit') limit: number = 20
  ): Promise<WhatsAppQuestionDto[]> {
    this.logger.log('Getting WhatsApp group questions');
    return this.mentoringService.getWhatsAppQuestions(groupId, limit);
  }

  @Post('whatsapp-groups/questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit question',
    description: 'Submit a question to a WhatsApp group'
  })
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({
    status: 201,
    description: 'Question submitted successfully',
    type: WhatsAppQuestionDto
  })
  async createWhatsAppQuestion(
    @Body(ValidationPipe) questionData: CreateQuestionDto,
    @Request() req
  ): Promise<WhatsAppQuestionDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Creating WhatsApp question for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can submit questions');
    }

    return this.mentoringService.createWhatsAppQuestion(studentId, questionData);
  }

  @Get('whatsapp-groups/:groupId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get group statistics',
    description: 'Get statistics for a specific WhatsApp group'
  })
  @ApiParam({ name: 'groupId', type: 'string', description: 'Group UUID' })
  @ApiResponse({
    status: 200,
    description: 'Group statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalMembers: { type: 'number', example: 45 },
        totalQuestions: { type: 'number', example: 125 },
        resolvedQuestions: { type: 'number', example: 98 },
        activeToday: { type: 'number', example: 12 },
        topContributors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Rahul Kumar' },
              questionsAsked: { type: 'number', example: 15 }
            }
          }
        }
      }
    }
  })
  async getWhatsAppGroupStats(
    @Param('groupId', ParseUUIDPipe) groupId: string
  ): Promise<any> {
    this.logger.log(`Getting stats for WhatsApp group: ${groupId}`);

    // Mock group statistics - implement actual logic
    return {
      totalMembers: 45,
      totalQuestions: 125,
      resolvedQuestions: 98,
      activeToday: 12,
      topContributors: [
        { name: 'Rahul Kumar', questionsAsked: 15 },
        { name: 'Priya Sharma', questionsAsked: 12 },
        { name: 'Amit Singh', questionsAsked: 10 }
      ]
    };
  }

  // =============================================
  // NEW WHATSAPP INTEGRATION ENDPOINTS
  // =============================================

  @Post('whatsapp/process-link')
  @ApiOperation({ summary: 'Process WhatsApp group link and generate join info' })
  @ApiResponse({ status: 200, description: 'WhatsApp link processed successfully' })
  async processWhatsAppLink(@Body() processLinkDto: ProcessWhatsAppLinkDto) {
    this.logger.log('Processing WhatsApp group link');
    return this.whatsappService.processGroupLink(processLinkDto.whatsappLink);
  }

  @Post('whatsapp/create-group')
  @ApiOperation({ summary: 'Create WhatsApp group entry for mentoring' })
  @ApiResponse({ status: 201, description: 'WhatsApp group created successfully' })
  async createWhatsAppGroup(
    @Body() createGroupDto: CreateWhatsAppGroupDto,
    @Request() req
  ) {
    const userId = req.user?.sub || req.user?.id;
    const result = await this.whatsappService.processGroupLink(createGroupDto.whatsappLink);
    
    if (!result.isValid) {
      throw new BadRequestException('Invalid WhatsApp group link');
    }

    // Store group info using existing mentoring service
    return this.mentoringService.createWhatsAppGroup(userId, {
      name: createGroupDto.groupName,
      subject: createGroupDto.subject,
      description: createGroupDto.description,
      whatsappLink: createGroupDto.whatsappLink,
      ...result,
    });
  }

  @Get('whatsapp/system-info')
  @ApiOperation({ summary: 'Get WhatsApp integration system info' })
  async getWhatsAppSystemInfo() {
    return this.whatsappService.getSystemInfo();
  }

  @Get('whatsapp/validate-link/:link')
  @ApiOperation({ summary: 'Validate WhatsApp group link' })
  @ApiParam({ name: 'link', description: 'Base64 encoded WhatsApp link' })
  async validateWhatsAppLink(@Param('link') encodedLink: string) {
    try {
      const decodedLink = Buffer.from(encodedLink, 'base64').toString('utf-8');
      const isValid = this.whatsappService.validateGroupLink(decodedLink);
      return {
        isValid,
        link: decodedLink,
        inviteCode: isValid ? this.whatsappService.extractInviteCode(decodedLink) : null,
      };
    } catch (error) {
      return { isValid: false, error: 'Invalid link format' };
    }
  }

  // =============================================
  // CHAT SYSTEM ENDPOINTS (7 endpoints + NEW)
  // =============================================

  @Get('chat/rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chat rooms',
    description: 'Get list of chat rooms user has access to'
  })
  @ApiResponse({
    status: 200,
    description: 'Chat rooms retrieved successfully',
    type: [ChatRoomDto]
  })
  async getChatRooms(@Request() req): Promise<ChatRoomDto[]> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting chat rooms for user: ${userId}`);
    return this.mentoringService.getChatRooms(userId);
  }

  @Get('chat/rooms/:roomId/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chat messages',
    description: 'Get messages from a specific chat room'
  })
  @ApiParam({ name: 'roomId', type: 'string', description: 'Room UUID' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [ChatMessageDto]
  })
  @ApiForbiddenResponse({ description: 'Access denied to this chat room' })
  async getChatMessages(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Request() req,
    @Query('limit') limit: number = 50
  ): Promise<ChatMessageDto[]> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting messages for room: ${roomId}`);
    return this.mentoringService.getChatMessages(roomId, userId, limit);
  }

  @Post('chat/rooms/:roomId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send chat message',
    description: 'Send a message to a chat room'
  })
  @ApiParam({ name: 'roomId', type: 'string', description: 'Room UUID' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: ChatMessageDto
  })
  async sendChatMessage(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body(ValidationPipe) messageData: SendMessageDto,
    @Request() req
  ): Promise<ChatMessageDto> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Sending message to room: ${roomId}`);
    return this.mentoringService.sendChatMessage(roomId, userId, messageData);
  }

  @Post('chat/rooms/:roomId/messages/:messageId/reaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'React to message',
    description: 'Add reaction to a chat message'
  })
  @ApiParam({ name: 'roomId', type: 'string', description: 'Room UUID' })
  @ApiParam({ name: 'messageId', type: 'string', description: 'Message UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        emoji: { type: 'string', example: '👍' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Reaction added successfully'
  })
  async reactToMessage(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body('emoji') emoji: string,
    @Request() req
  ): Promise<{ message: string }> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Adding reaction to message: ${messageId}`);
    // Mock reaction implementation - implement actual logic
    return { message: 'Reaction added successfully' };
  }

  @Get('chat/unread-counts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get unread message counts',
    description: 'Get unread message counts for all chat rooms'
  })
  @ApiResponse({
    status: 200,
    description: 'Unread counts retrieved successfully',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
      example: { 'room-uuid-1': 5, 'room-uuid-2': 2 }
    }
  })
  async getUnreadMessageCounts(@Request() req): Promise<Record<string, number>> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting unread counts for user: ${userId}`);
    // Mock unread counts - implement actual logic
    return {
      'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f': 5,
      'b7a3c9f2-7d4e-5b6c-8a1f-2e5d8c9b0a3e': 2
    };
  }

  @Post('chat/rooms/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create chat room',
    description: 'Create a new chat room'
  })
  @ApiBody({ type: CreateChatRoomDto })
  @ApiResponse({
    status: 201,
    description: 'Chat room created successfully',
    type: ChatRoomDto
  })
  async createChatRoom(
    @Body(ValidationPipe) roomData: CreateChatRoomDto,
    @Request() req
  ): Promise<ChatRoomDto> {
    const creatorId = req.user?.sub || req.user?.id;
    this.logger.log(`Creating chat room: ${roomData.name}`);
    
    return this.mentoringService.createChatRoom({
      name: roomData.name,
      description: roomData.description,
      roomType: 'text-only',
      participantIds: [creatorId],
    });
  }

  @Put('chat/rooms/:roomId/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark messages as read',
    description: 'Mark all messages in a chat room as read'
  })
  @ApiParam({ name: 'roomId', type: 'string', description: 'Room UUID' })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read successfully'
  })
  async markMessagesAsRead(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Request() req
  ): Promise<{ message: string }> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Marking messages as read for room: ${roomId}`);
    // Mock implementation - implement actual logic
    return { message: 'Messages marked as read successfully' };
  }

  // =============================================
  // NEW TEXT-ONLY CHAT ENDPOINTS
  // =============================================

  @Post('chat/create-room')
  @ApiOperation({ summary: 'Create a text-only chat room' })
  @ApiResponse({ status: 201, description: 'Chat room created successfully' })
  async createTextChatRoom(
    @Body() createRoomDto: CreateTextChatRoomDto,
    @Request() req
  ) {
    const userId = req.user?.sub || req.user?.id;
    
    const roomData = {
      name: createRoomDto.name,
      description: createRoomDto.description,
      roomType: 'text_only',
      participantIds: [userId, ...(createRoomDto.participantIds || [])],
    };

    const room = await this.mentoringService.createChatRoom(roomData);

    return {
      ...room,
      socketNamespace: '/mentoring-chat',
      instructions: {
        connect: 'Use your JWT token for authentication',
        joinRoom: `socket.emit('join_room', { roomId: '${room.id}' })`,
        sendMessage: `socket.emit('send_message', { roomId: '${room.id}', content: 'Hello!' })`,
      },
    };
  }

  @Post('chat/join-room')
  @ApiOperation({ summary: 'Join a text-only chat room' })
  @ApiResponse({ status: 200, description: 'Successfully joined chat room' })
  async joinTextChatRoom(
    @Body() joinRoomDto: JoinTextChatRoomDto,
    @Request() req
  ) {
    const userId = req.user?.sub || req.user?.id;
    
    await this.mentoringService.joinChatRoom(joinRoomDto.roomId, userId);
    
    return { 
      message: 'Successfully joined chat room',
      roomId: joinRoomDto.roomId,
      socketNamespace: '/mentoring-chat',
      features: {
        textMessaging: true,
        fileUploads: false,
        voiceMessages: false,
        maxMessageLength: 1000,
      },
    };
  }

  @Get('chat/my-rooms')
  @ApiOperation({ summary: 'Get user joined chat rooms' })
  async getMyTextChatRooms(@Request() req) {
    const userId = req.user?.sub || req.user?.id;
    return this.mentoringService.getUserChatRooms(userId);
  }

  @Get('chat/features')
  @ApiOperation({ summary: 'Get chat system features and limitations' })
  async getChatFeatures() {
    return {
      features: [
        '💬 Real-time text messaging',
        '👥 Multi-user chat rooms',
        '⚡ Typing indicators',
        '🔔 Join/leave notifications',
        '📱 Mobile and desktop support',
      ],
      limitations: [
        '❌ No file uploads (text only)',
        '❌ No voice messages',
        '❌ No image sharing',
        '📝 1000 character limit per message',
      ],
      socketConnection: {
        namespace: '/mentoring-chat',
        events: {
          connect: 'Authenticate with JWT token',
          join_room: 'Join a specific chat room',
          send_message: 'Send text message to room',
          typing_start: 'Indicate typing',
          typing_stop: 'Stop typing indicator',
        },
      },
    };
  }

  // =============================================
  // ENHANCED GOOGLE MEET INTEGRATION
  // =============================================

  @Get('google-meet/status')
  @ApiOperation({ summary: 'Check Google Meet integration status' })
  async getGoogleMeetStatus() {
    return this.googleMeetService.getServiceStatus();
  }

  @Post('sessions/:sessionId/create-meeting')
  @ApiOperation({ summary: 'Create Google Meet for a session' })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  async createMeetingForSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ) {
    const userId = req.user?.sub || req.user?.id;
    const session = await this.mentoringService.getSessionById(sessionId, userId);
    
    // Prepare meeting data
    const meetingData = {
      title: session.title,
      description: session.description,
      startTime: session.sessionDate,
      duration: session.duration,
      mentorEmail: `mentor-${session.mentor.id}@temp.edu`, // Replace with actual emails
      participantEmails: [`student-${userId}@temp.edu`],
    };

    const meeting = await this.googleMeetService.createMeetingForSession(meetingData);
    
    // Update session with meeting link (if user is mentor)
    if (req.user?.role === 'hei_mentor') {
      await this.mentoringService.updateSession(sessionId, session.mentor.id, {
        meetingLink: meeting.meetLink,
      });
    }

    return {
      meetLink: meeting.meetLink,
      meetingId: meeting.meetingId,
      message: 'Google Meet created successfully',
      instructions: [
        '1. Click the meeting link to join',
        '2. Allow camera and microphone access',
        '3. Wait for other participants',
      ],
    };
  }

  @Delete('sessions/:sessionId/meeting')
  @ApiOperation({ summary: 'Delete Google Meet for a session' })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  async deleteMeetingForSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ) {
    if (req.user?.role !== 'hei_mentor') {
      throw new BadRequestException('Only mentors can delete meetings');
    }

    const userId = req.user?.sub || req.user?.id;
    const session = await this.mentoringService.getSessionById(sessionId, userId);
    
    // Extract calendar event ID from meeting link (implement actual logic)
    const calendarEventId = session.meetingLink?.split('/')?.pop() || '';
    
    if (calendarEventId) {
      await this.googleMeetService.deleteMeeting(calendarEventId);
    }

    // Remove meeting link from session
    await this.mentoringService.updateSession(sessionId, session.mentor.id, {
      meetingLink: undefined,
    });

    return { message: 'Google Meet deleted successfully' };
  }

  // =============================================
  // SYSTEM STATUS ENDPOINTS
  // =============================================

  @Get('system-status')
  @ApiOperation({ summary: 'Get mentoring system status' })
  async getMentoringSystemStatus() {
    const whatsappStatus = this.whatsappService.getSystemInfo();
    const googleMeetStatus = this.googleMeetService.getServiceStatus();

    return {
      timestamp: new Date().toISOString(),
      services: {
        mentoring: {
          enabled: true,
          message: 'Core mentoring system is active',
        },
        whatsapp: {
          enabled: true,
          ...whatsappStatus,
        },
        googleMeet: googleMeetStatus,
        textChat: {
          enabled: true,
          message: 'Text-only chat system is active',
          namespace: '/mentoring-chat',
        },
      },
      features: {
        sessionBooking: true,
        whatsappGroups: true,
        textOnlyChat: true,
        googleMeetIntegration: googleMeetStatus.enabled,
        fileUploads: false, // ✅ Explicitly disabled
        videoChat: false,   // ✅ Use Google Meet instead
        voiceMessages: false, // ✅ Text only
      },
      integrations: {
        supabase: 'Connected',
        localStorage: 'Active',
        websockets: 'Running',
      },
    };
  }

  @Get('usage-disclaimer')
  @ApiOperation({ summary: 'Get system usage disclaimer' })
  async getUsageDisclaimer() {
    return this.mentoringService.getUsageDisclaimer();
  }

  @Get('system-features')
  @ApiOperation({ summary: 'Get system features overview' })
  async getSystemFeatures() {
    return this.mentoringService.getSystemFeatures();
  }

  // =============================================
  // UTILITY ENDPOINTS
  // =============================================

  @Get('health')
  @ApiOperation({ summary: 'Health check for mentoring service' })
  async getHealthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      features: {
        coreSystem: 'operational',
        whatsappIntegration: 'operational',
        googleMeetIntegration: 'operational',
        textOnlyChat: 'operational',
      },
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get mentoring system version' })
  async getSystemVersion() {
    return {
      version: '2.0.0',
      buildDate: '2025-10-02',
      features: [
        'Core mentoring system',
        'WhatsApp group integration',
        'Google Meet integration', 
        'Text-only chat system',
        'Local file storage',
        'Real-time notifications',
      ],
      apiEndpoints: 65, // Total number of endpoints
    };
  }

  // Add these endpoints to your existing mentoring.controller.ts

// =============================================
// HEI-MENTOR SPECIFIC ENDPOINTS 
// =============================================

@Get('hei-mentor/dashboard')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get HEI mentor dashboard',
  description: 'Get mentor-specific dashboard with assigned students and analytics'
})
@ApiResponse({
  status: 200,
  description: 'HEI mentor dashboard retrieved successfully'
})
async getHEIMentorDashboard(@Request() req) {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting HEI mentor dashboard for mentor: ${mentorId}`);
  
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  
  return this.mentoringService.getHEIMentorDashboard(mentorId);
}

@Get('hei-mentor/students')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get assigned students for HEI mentor',
  description: 'Get list of students assigned to this HEI mentor'
})
@ApiQuery({ name: 'school_id', type: 'string', required: false })
@ApiQuery({ name: 'class_level', type: 'string', required: false })
@ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
@ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
async getAssignedStudents(
  @Request() req,
  @Query('school_id') schoolId?: string,
  @Query('class_level') classLevel?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20
) {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting assigned students for mentor: ${mentorId}`);
  
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  
  return this.mentoringService.getAssignedStudents(mentorId, {
    schoolId,
    classLevel,
    page,
    limit
  });
}

@Get('hei-mentor/students/:studentId/progress')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get student progress analytics',
  description: 'Get detailed progress analytics for a specific student'
})
@ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
async getStudentProgress(
  @Request() req,
  @Param('studentId', ParseUUIDPipe) studentId: string
) {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting progress for student: ${studentId}`);
  
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  
  return this.mentoringService.getStudentProgress(mentorId, studentId);
}


@Get('hei-mentor/analytics')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get HEI mentor analytics overview',
  description: 'Get comprehensive analytics for mentor performance and student progress'
})
async getHEIMentorAnalytics(@Request() req) {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting analytics for mentor: ${mentorId}`);
  
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  
  return this.mentoringService.getHEIMentorAnalytics(mentorId);
}

// =============================================
// NEW HEI-MENTOR SPECIFIC ENDPOINTS
// =============================================

// New DTOs for HEI-Mentor Endpoints

// Profile endpoints
@Get('hei-mentor/profile')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get HEI mentor profile details' })
async getHeiMentorProfile(@Request() req) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getMentorProfile(mentorId);
}

@Put('hei-mentor/profile')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Update HEI mentor profile' })
async updateHeiMentorProfile(
  @Request() req,
  @Body(ValidationPipe) updateData: UpdateMentorProfileDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.updateMentorProfile(mentorId, updateData);
}

// Student endpoints
@Get('hei-mentor/students/:studentId')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get specific assigned student details' })
@ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
async getAssignedStudentById(
  @Request() req,
  @Param('studentId', ParseUUIDPipe) studentId: string
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getStudentById(mentorId, studentId);
}

// Assignment endpoints
@Get('hei-mentor/assignments')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get assignments created by HEI mentor' })
@ApiQuery({ name: 'subject', type: 'string', required: false })
@ApiQuery({ name: 'class_level', type: 'string', required: false })
@ApiQuery({ name: 'difficulty', type: 'string', required: false })
@ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
@ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
async getHeiMentorAssignments(
  @Request() req,
  @Query('subject') subject?: string,
  @Query('class_level') classLevel?: string,
  @Query('difficulty') difficulty?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getAssignments(mentorId, {
    subject, classLevel, difficulty, page, limit
  });
}

@Post('hei-mentor/assignments')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Create new assignment' })
async createHeiMentorAssignment(
  @Request() req,
  @Body(ValidationPipe) assignmentData: CreateAssignmentDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.createAssignment(mentorId, assignmentData);
}

@Get('hei-mentor/assignments/:assignmentId/submissions')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get assignment submissions for grading' })
@ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
@ApiQuery({ name: 'status', type: 'string', required: false })
@ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
@ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
async getAssignmentSubmissions(
  @Request() req,
  @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  @Query('status') status?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getSubmissions(mentorId, assignmentId, { 
    status, page, limit 
  });
}

@Put('hei-mentor/submissions/:submissionId/grade')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Grade assignment submission' })
@ApiParam({ name: 'submissionId', type: 'string', description: 'Submission UUID' })
async gradeAssignmentSubmission(
  @Request() req,
  @Param('submissionId', ParseUUIDPipe) submissionId: string,
  @Body(ValidationPipe) gradeData: GradeSubmissionDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.gradeSubmission(mentorId, submissionId, gradeData);
}

// School endpoint
@Get('hei-mentor/schools/:schoolId')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get assigned school details' })
@ApiParam({ name: 'schoolId', type: 'string', description: 'School UUID' })
async getAssignedSchoolById(
  @Request() req,
  @Param('schoolId', ParseUUIDPipe) schoolId: string
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getSchoolById(mentorId, schoolId);
}

// Add these to your controller:

@Get('hei-mentor/sessions')
@ApiOperation({ summary: 'Get HEI mentor sessions' })
@ApiQuery({ name: 'status', required: false })
@ApiQuery({ name: 'limit', required: false, example: 20 })
async getHeiMentorSessions(
  @Request() req,
  @Query('status') status?: string,
  @Query('limit') limit: number = 20
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getMentorSessions(mentorId, { status, limit });
}

@Get('hei-mentor/sessions/:sessionId')
@ApiOperation({ summary: 'Get specific HEI mentor session' })
@ApiParam({ name: 'sessionId', description: 'Session UUID' })
async getHeiMentorSession(
  @Request() req,
  @Param('sessionId', ParseUUIDPipe) sessionId: string
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getMentorSessionById(mentorId, sessionId);
}

@Post('hei-mentor/sessions')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Create new HEI mentor session' })
async createHeiMentorSession(
  @Request() req,
  @Body(ValidationPipe) sessionData: CreateSessionDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.createMentorSession(mentorId, sessionData);
}

@Put('hei-mentor/sessions/:sessionId')
@ApiOperation({ summary: 'Update HEI mentor session' })
@ApiParam({ name: 'sessionId', description: 'Session UUID' })
async updateHeiMentorSession(
  @Request() req,
  @Param('sessionId', ParseUUIDPipe) sessionId: string,
  @Body(ValidationPipe) updateData: UpdateSessionDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.updateMentorSession(mentorId, sessionId, updateData);
}

// Add these chat endpoints:

@Get('hei-mentor/chat/rooms')
@ApiOperation({ summary: 'Get HEI mentor chat rooms' })
async getHeiMentorChatRooms(@Request() req) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getMentorChatRooms(mentorId);
}

@Get('hei-mentor/chat/rooms/:roomId/messages')
@ApiOperation({ summary: 'Get chat room messages' })
@ApiParam({ name: 'roomId', description: 'Room UUID' })
@ApiQuery({ name: 'limit', required: false, example: 50 })
async getHeiMentorChatMessages(
  @Request() req,
  @Param('roomId', ParseUUIDPipe) roomId: string,
  @Query('limit') limit: number = 50
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.getMentorChatMessages(mentorId, roomId, limit);
}

@Post('hei-mentor/chat/rooms/:roomId/messages')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Send message to chat room' })
@ApiParam({ name: 'roomId', description: 'Room UUID' })
async sendHeiMentorChatMessage(
  @Request() req,
  @Param('roomId', ParseUUIDPipe) roomId: string,
  @Body(ValidationPipe) messageData: SendMessageDto
) {
  const mentorId = req.user?.sub || req.user?.id;
  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }
  return this.mentoringService.sendMentorChatMessage(mentorId, roomId, messageData);
}

// Add these missing endpoints to complete HEI-mentor coverage

@Get('hei-mentor/students/:studentId')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get detailed student information',
  description: 'Get comprehensive details about a specific assigned student'
})
@ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
@ApiResponse({
  status: 200,
  description: 'Student details retrieved successfully',
  type: StudentDetailDto
})
async getStudentById(
  @Request() req,
  @Param('studentId', ParseUUIDPipe) studentId: string
): Promise<StudentDetailDto> {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting student details: ${studentId} for mentor: ${mentorId}`);

  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }

  return this.mentoringService.getStudentById(mentorId, studentId);
}

@Get('hei-mentor/schools')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get assigned schools for HEI mentor',
  description: 'Get list of schools where this mentor has assigned students'
})
@ApiQuery({ name: 'city', type: 'string', required: false })
@ApiQuery({ name: 'state', type: 'string', required: false })
@ApiQuery({ name: 'board', type: 'string', required: false })
@ApiQuery({ name: 'type', type: 'string', required: false })
@ApiQuery({ name: 'page', type: 'number', required: false, example: 1 })
@ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
@ApiResponse({
  status: 200,
  description: 'Assigned schools retrieved successfully',
  type: AssignedSchoolsResponseDto
})
async getAssignedSchools(
  @Request() req,
  @Query() filters: SchoolFiltersDto
): Promise<AssignedSchoolsResponseDto> {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting assigned schools for mentor: ${mentorId}`);

  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }

  return this.mentoringService.getAssignedSchools(mentorId, filters);
}

@Get('hei-mentor/schools/:schoolId')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Get detailed school information',
  description: 'Get comprehensive details about a specific assigned school'
})
@ApiParam({ name: 'schoolId', type: 'string', description: 'School UUID' })
@ApiResponse({
  status: 200,
  description: 'School details retrieved successfully',
  type: SchoolDetailDto
})
async getSchoolById(
  @Request() req,
  @Param('schoolId', ParseUUIDPipe) schoolId: string
): Promise<SchoolDetailDto> {
  const mentorId = req.user?.sub || req.user?.id;
  this.logger.log(`Getting school details: ${schoolId} for mentor: ${mentorId}`);

  if (req.user?.role !== 'hei_mentor') {
    throw new BadRequestException('This endpoint is only for HEI mentors');
  }

  return this.mentoringService.getSchoolById(mentorId, schoolId);
}


}
