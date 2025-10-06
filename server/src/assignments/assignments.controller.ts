// server/src/assignments/assignments.controller.ts
// ✅ HEI-MENTOR FOCUSED CONTROLLER

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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';

@ApiTags('HEI-Mentor Assignments')
@Controller('assignments/hei-mentor')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AssignmentsController {
  private readonly logger = new Logger(AssignmentsController.name);

  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get mentor assignments' })
  async getMentorAssignments(@Request() req, @Query() filters) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.getMentorAssignments(mentorId, filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create new assignment' })
  async createAssignment(@Request() req, @Body() createData) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.createMentorAssignment(mentorId, createData);
  }

  @Get(':assignmentId/submissions')
  @ApiOperation({ summary: 'Get assignment submissions' })
  async getAssignmentSubmissions(@Request() req, @Param('assignmentId') assignmentId: string, @Query() filters) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.getAssignmentSubmissions(mentorId, assignmentId, filters);
  }

  @Put('submissions/:submissionId/grade')
  @ApiOperation({ summary: 'Grade assignment submission' })
  async gradeSubmission(@Request() req, @Param('submissionId') submissionId: string, @Body() gradeData) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.gradeSubmission(mentorId, submissionId, gradeData);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get mentor assignment statistics' })
  async getMentorStats(@Request() req) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.getMentorAssignmentStats(mentorId);
  }

  @Put(':assignmentId')
  @ApiOperation({ summary: 'Update assignment' })
  async updateAssignment(@Request() req, @Param('assignmentId') assignmentId: string, @Body() updateData) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.updateMentorAssignment(mentorId, assignmentId, updateData);
  }

  @Delete(':assignmentId')
  @ApiOperation({ summary: 'Delete assignment' })
  async deleteAssignment(@Request() req, @Param('assignmentId') assignmentId: string) {
    const mentorId = req.user?.sub || req.user?.id;
    return this.assignmentsService.deleteMentorAssignment(mentorId, assignmentId);
  }
}
