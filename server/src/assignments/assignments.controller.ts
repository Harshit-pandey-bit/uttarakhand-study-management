// server/src/assignments/assignments.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { createSecureUploadOptions } from './upload-security';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  /** List assignments — teachers see their own, students see all */
  @Get()
  @ApiOperation({ summary: 'List assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  async listAssignments(@Req() req: Request) {
    const user = req.user as any;
    const role = user.user_metadata?.role;

    if (role === 'TEACHER' || role === 'HEI_MENTOR') {
      return this.assignmentsService.getMyAssignments(user.sub);
    }
    return this.assignmentsService.getAllAssignments();
  }

  /** List submissions by the current student */
  @Get('my-submissions')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'List my submissions (student)' })
  @ApiResponse({ status: 200, description: 'List of submissions' })
  async mySubmissions(@Req() req: Request) {
    const user = req.user as any;
    return this.assignmentsService.getMySubmissions(user.sub);
  }

  /** List submissions for a specific assignment (teacher view) */
  @Get(':id/submissions')
  @Roles('TEACHER', 'HEI_MENTOR')
  @ApiOperation({ summary: 'List submissions for an assignment' })
  @ApiResponse({ status: 200, description: 'List of submissions' })
  async getSubmissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.getSubmissionsByAssignment(id);
  }

  /** Create a new assignment (TEACHER or HEI_MENTOR). */
  @Post()
  @Roles('TEACHER', 'HEI_MENTOR')
  @ApiOperation({ summary: 'Create a new assignment with NCERT references' })
  @ApiResponse({ status: 201, description: 'Assignment created' })
  @ApiResponse({ status: 403, description: 'Only TEACHER or HEI_MENTOR roles allowed' })
  async createAssignment(
    @Body() dto: CreateAssignmentDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.assignmentsService.createAssignment(user.sub, dto);
  }

  /** Submit homework for an assignment (STUDENT). */
  @Post(':id/submit')
  @Roles('STUDENT')
  @UseInterceptors(FileInterceptor('file', createSecureUploadOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: 'Submit homework file for an assignment' })
  @ApiResponse({ status: 201, description: 'Submission saved' })
  async submitAssignment(
    @Param('id', ParseUUIDPipe) assignmentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const user = req.user as any;
    return this.assignmentsService.submitAssignment(assignmentId, user.sub, file.path);
  }
}
