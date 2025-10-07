// server/src/teacher/teacher.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TeacherService } from './teacher.service';
import {
  TeacherDashboardResponseDto,
  TeacherProfileDto,
  UpdateSubjectsClassesDto,
  AssignmentDto,
  CreateAssignmentDto,
  GradeSubmissionDto,
  GradebookDataDto,
  MentoringSessionDto,
  ScheduleSessionDto,
  AnnouncementDto,
} from './dto/teacher-dashboard.dto';

@ApiTags('Teacher')
@Controller('teacher')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  // ===== DASHBOARD ENDPOINTS =====

  @Get('dashboard')
  @ApiOperation({ summary: 'Get teacher dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: TeacherDashboardResponseDto,
  })
  async getDashboard(@Request() req): Promise<TeacherDashboardResponseDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getTeacherDashboard(teacherUserId);
  }

  // ===== PROFILE ENDPOINTS =====

  @Get('profile')
  @ApiOperation({ summary: 'Get teacher profile' })
  @ApiResponse({
    status: 200,
    description: 'Teacher profile retrieved successfully',
    type: TeacherProfileDto,
  })
  async getProfile(@Request() req): Promise<TeacherProfileDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getTeacherProfile(teacherUserId);
  }

  @Patch('profile/subjects-classes')
  @ApiOperation({ summary: 'Update teacher subjects and classes' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: TeacherProfileDto,
  })
  async updateSubjectsAndClasses(
    @Body() updateDto: UpdateSubjectsClassesDto,
    @Request() req,
  ): Promise<TeacherProfileDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.updateSubjectsAndClasses(teacherUserId, updateDto);
  }

  // ===== ASSIGNMENT ENDPOINTS =====

  @Get('assignments')
  @ApiOperation({ summary: 'Get teacher assignments' })
  @ApiQuery({ name: 'subject', required: false, description: 'Filter by subject' })
  @ApiQuery({ name: 'class_level', required: false, description: 'Filter by class level' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: [AssignmentDto],
  })
  async getAssignments(
    @Request() req,
    @Query('subject') subject?: string,
    @Query('class_level') class_level?: string,
  ): Promise<AssignmentDto[]> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getAssignments(teacherUserId, { subject, class_level });
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Create new assignment' })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: AssignmentDto,
  })
  async createAssignment(
    @Body() createDto: CreateAssignmentDto,
    @Request() req,
  ): Promise<AssignmentDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.createAssignment(teacherUserId, createDto);
  }

  @Patch('assignments/submissions/:submissionId/grade')
  @ApiOperation({ summary: 'Grade student submission' })
  @ApiResponse({
    status: 200,
    description: 'Submission graded successfully',
  })
  async gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Body() gradeDto: GradeSubmissionDto,
    @Request() req,
  ) {
    return this.teacherService.gradeSubmission(submissionId, gradeDto);
  }

  // ===== GRADEBOOK ENDPOINTS =====

  @Get('gradebook')
  @ApiOperation({ summary: 'Get gradebook data' })
  @ApiQuery({ name: 'classLevel', required: true, description: 'Class level' })
  @ApiQuery({ name: 'subject', required: true, description: 'Subject' })
  @ApiResponse({
    status: 200,
    description: 'Gradebook data retrieved successfully',
    type: GradebookDataDto,
  })
  async getGradebook(
    @Request() req,
    @Query('classLevel') classLevel: string,
    @Query('subject') subject: string,
  ): Promise<GradebookDataDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getGradebookData(teacherUserId, classLevel, subject);
  }

  // ===== HEI SESSION ENDPOINTS =====

  @Get('hei/sessions')
  @ApiOperation({ summary: 'Get HEI mentoring sessions' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: [MentoringSessionDto],
  })
  async getHEISessions(@Request() req): Promise<MentoringSessionDto[]> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getHEISessions(teacherUserId);
  }

  @Post('hei/sessions')
  @ApiOperation({ summary: 'Schedule new HEI session' })
  @ApiResponse({
    status: 201,
    description: 'Session scheduled successfully',
    type: MentoringSessionDto,
  })
  async scheduleHEISession(
    @Body() scheduleDto: ScheduleSessionDto,
    @Request() req,
  ): Promise<MentoringSessionDto> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.scheduleHEISession(teacherUserId, scheduleDto);
  }

  // ===== ANNOUNCEMENT ENDPOINTS =====

  @Get('announcements')
  @ApiOperation({ summary: 'Get announcements for teacher' })
  @ApiQuery({ name: 'badge_type', required: false, description: 'Filter by badge type' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  @ApiQuery({ name: 'unread_only', required: false, description: 'Show only unread' })
  @ApiResponse({
    status: 200,
    description: 'Announcements retrieved successfully',
    type: [AnnouncementDto],
  })
  async getAnnouncements(
    @Request() req,
    @Query('badge_type') badge_type?: string,
    @Query('priority') priority?: string,
    @Query('unread_only') unread_only?: boolean,
  ): Promise<AnnouncementDto[]> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.getAnnouncements(teacherUserId, {
      badge_type,
      priority,
      unread_only,
    });
  }

  @Patch('announcements/:announcementId/read')
  @ApiOperation({ summary: 'Mark announcement as read' })
  @ApiResponse({
    status: 200,
    description: 'Announcement marked as read',
  })
  async markAnnouncementAsRead(
    @Param('announcementId') announcementId: string,
    @Request() req,
  ): Promise<void> {
    const teacherUserId = req.user?.sub || req.user?.id;
    return this.teacherService.markAnnouncementAsRead(teacherUserId, announcementId);
  }
}
