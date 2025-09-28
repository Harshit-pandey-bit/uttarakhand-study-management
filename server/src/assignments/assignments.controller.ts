// server/src/assignments/assignments.controller.ts

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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import {
  AssignmentDto,
  AssignmentListResponseDto,
  CreateAssignmentDto,
  AIGenerateAssignmentDto,
  SubmitAssignmentDto,
  AssignmentSubmissionDto,
  NCERTChapterDto,
  AssignmentStatsDto,
  AssignmentStatus,
} from './dto/assignments.dto';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AssignmentsController {
  private readonly logger = new Logger(AssignmentsController.name);

  constructor(private readonly assignmentsService: AssignmentsService) {}

  // =============================================
  // STUDENT ASSIGNMENT ENDPOINTS
  // =============================================

  @Get('my-assignments')
  @ApiOperation({
    summary: 'Get current student assignments',
    description: 'Retrieve all assignments for the authenticated student'
  })
  @ApiQuery({ name: 'status', enum: AssignmentStatus, required: false })
  @ApiQuery({ name: 'subject', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: AssignmentListResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getMyAssignments(
    @Request() req,
    @Query('status') status?: AssignmentStatus,
    @Query('subject') subject?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0
  ): Promise<AssignmentListResponseDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting assignments for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.assignmentsService.getStudentAssignments(studentId, status, subject, limit, offset);
  }

  @Get(':assignmentId')
  @ApiOperation({
    summary: 'Get assignment details',
    description: 'Get detailed information about a specific assignment'
  })
  @ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment details retrieved successfully',
    type: AssignmentDto
  })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  async getAssignmentDetails(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Request() req
  ): Promise<AssignmentDto> {
    const userId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting assignment details: ${assignmentId}`);

    if (req.user?.role === 'student') {
      return this.assignmentsService.getAssignmentById(assignmentId, userId);
    } else {
      // Teachers can view any assignment
      return this.assignmentsService.getAssignmentById(assignmentId, "");
    }
  }

  @Post(':assignmentId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit assignment',
    description: 'Submit completed assignment with files or text'
  })
  @ApiParam({ name: 'assignmentId', type: 'string', description: 'Assignment UUID' })
  @ApiBody({ type: SubmitAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Assignment submitted successfully',
    type: AssignmentSubmissionDto
  })
  @ApiBadRequestResponse({ description: 'Invalid submission or assignment already submitted' })
  async submitAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body(ValidationPipe) submitData: Omit<SubmitAssignmentDto, 'assignmentId'>,
    @Request() req
  ): Promise<AssignmentSubmissionDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Submitting assignment: ${assignmentId} for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can submit assignments');
    }

    const fullSubmitData: SubmitAssignmentDto = {
      assignmentId,
      ...submitData
    };

    return this.assignmentsService.submitAssignment(studentId, fullSubmitData);
  }

  @Get('my-submissions/history')
  @ApiOperation({
    summary: 'Get student submission history',
    description: 'Retrieve all submissions made by the authenticated student'
  })
  @ApiResponse({
    status: 200,
    description: 'Submission history retrieved successfully',
    type: [AssignmentSubmissionDto]
  })
  async getMySubmissions(@Request() req): Promise<AssignmentSubmissionDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting submission history for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.assignmentsService.getStudentSubmissions(studentId);
  }

  @Get('my-stats')
  @ApiOperation({
    summary: 'Get student assignment statistics',
    description: 'Get comprehensive statistics about student assignment performance'
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment statistics retrieved successfully',
    type: AssignmentStatsDto
  })
  async getMyAssignmentStats(@Request() req): Promise<AssignmentStatsDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting assignment stats for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.assignmentsService.getStudentAssignmentStats(studentId);
  }

  // =============================================
  // TEACHER ASSIGNMENT ENDPOINTS
  // =============================================

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new assignment',
    description: 'Create a new assignment manually (teachers only)'
  })
  @ApiBody({ type: CreateAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: AssignmentDto
  })
  @ApiBadRequestResponse({ description: 'Invalid assignment data' })
  async createAssignment(
    @Body(ValidationPipe) createData: CreateAssignmentDto,
    @Request() req
  ): Promise<AssignmentDto> {
    const teacherId = req.user?.sub || req.user?.id;
    this.logger.log(`Creating assignment for teacher: ${teacherId}`);

    if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
      throw new BadRequestException('Only teachers can create assignments');
    }

    return this.assignmentsService.createAssignment(teacherId, createData);
  }

  @Post('generate-ai')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate AI assignment',
    description: 'Generate assignment using AI based on NCERT chapter and requirements'
  })
  @ApiBody({ type: AIGenerateAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'AI assignment generated successfully',
    type: AssignmentDto
  })
  @ApiBadRequestResponse({ description: 'Invalid generation parameters' })
  async generateAIAssignment(
    @Body(ValidationPipe) aiData: AIGenerateAssignmentDto,
    @Request() req
  ): Promise<AssignmentDto> {
    const teacherId = req.user?.sub || req.user?.id;
    this.logger.log(`Generating AI assignment for teacher: ${teacherId}`);

    if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
      throw new BadRequestException('Only teachers can generate AI assignments');
    }

    return this.assignmentsService.generateAIAssignment(teacherId, aiData);
  }

  @Get('my-created')
  @ApiOperation({
    summary: 'Get teacher created assignments',
    description: 'Retrieve all assignments created by the authenticated teacher'
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher assignments retrieved successfully',
    type: AssignmentListResponseDto
  })
  async getMyCreatedAssignments(@Request() req): Promise<AssignmentListResponseDto> {
    const teacherId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting created assignments for teacher: ${teacherId}`);

    if (!['teacher', 'hei_mentor', 'school_admin'].includes(req.user?.role)) {
      throw new BadRequestException('Only teachers can view created assignments');
    }

    return this.assignmentsService.getTeacherAssignments(teacherId);
  }

  // =============================================
  // UTILITY ENDPOINTS
  // =============================================

  @Get('ncert/chapters')
  @ApiOperation({
    summary: 'Get NCERT chapters',
    description: 'Retrieve NCERT chapters for assignment creation'
  })
  @ApiQuery({ name: 'subject', type: 'string', required: false })
  @ApiQuery({ name: 'classLevel', type: 'string', required: false })
  @ApiResponse({
    status: 200,
    description: 'NCERT chapters retrieved successfully',
    type: [NCERTChapterDto]
  })
  async getNCERTChapters(
    @Query('subject') subject?: string,
    @Query('classLevel') classLevel?: string
  ): Promise<NCERTChapterDto[]> {
    this.logger.log('Getting NCERT chapters');

    return this.assignmentsService.getNCERTChapters(subject, classLevel);
  }

  @Get('subjects/list')
  @ApiOperation({
    summary: 'Get available subjects',
    description: 'Get list of available subjects for assignments'
  })
  @ApiResponse({
    status: 200,
    description: 'Subjects retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        subjects: {
          type: 'array',
          items: { type: 'string' },
          example: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies']
        }
      }
    }
  })
  async getAvailableSubjects(): Promise<{ subjects: string[] }> {
    this.logger.log('Getting available subjects');

    // This could be dynamic from database or config
    const subjects = [
      'Mathematics',
      'Science',
      'Physics',
      'Chemistry',
      'Biology',
      'English',
      'Hindi',
      'Social Studies',
      'History',
      'Geography',
      'Economics',
      'Political Science'
    ];

    return { subjects };
  }

  @Get('classes/list')
  @ApiOperation({
    summary: 'Get available class levels',
    description: 'Get list of available class levels for assignments'
  })
  @ApiResponse({
    status: 200,
    description: 'Class levels retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        classes: {
          type: 'array',
          items: { type: 'string' },
          example: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
        }
      }
    }
  })
  async getAvailableClasses(): Promise<{ classes: string[] }> {
    this.logger.log('Getting available classes');

    const classes = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    return { classes };
  }

  // =============================================
  // ADMIN/ANALYTICS ENDPOINTS
  // =============================================

  @Get('analytics/overview')
  @ApiOperation({
    summary: 'Get assignment analytics overview',
    description: 'Get system-wide assignment analytics (admin/teacher only)'
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalAssignments: { type: 'number', example: 1250 },
        aiGeneratedCount: { type: 'number', example: 450 },
        totalSubmissions: { type: 'number', example: 8500 },
        averageScore: { type: 'number', example: 78.5 },
        subjectDistribution: {
          type: 'object',
          additionalProperties: { type: 'number' },
          example: { 'Mathematics': 350, 'Science': 280, 'English': 200 }
        }
      }
    }
  })
  async getAssignmentAnalytics(@Request() req): Promise<any> {
    this.logger.log('Getting assignment analytics');

    if (!['teacher', 'hei_mentor', 'hei_admin', 'school_admin'].includes(req.user?.role)) {
      throw new BadRequestException('Insufficient permissions to view analytics');
    }

    // Mock analytics data - implement actual analytics logic
    return {
      totalAssignments: 1250,
      aiGeneratedCount: 450,
      totalSubmissions: 8500,
      averageScore: 78.5,
      subjectDistribution: {
        'Mathematics': 350,
        'Science': 280,
        'English': 200,
        'Social Studies': 180,
        'Hindi': 240
      },
      difficultyDistribution: {
        'easy': 400,
        'medium': 650,
        'hard': 200
      },
      submissionTrends: {
        onTime: 6800,
        late: 1200,
        notSubmitted: 500
      }
    };
  }
}
