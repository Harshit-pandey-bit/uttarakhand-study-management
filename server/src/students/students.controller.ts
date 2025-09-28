// server/src/students/students.controller.ts

import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StudentsService } from './students.service';
import { StudentDashboardResponseDto } from './dto/student-dashboard.dto';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get(':studentId/dashboard')
  @ApiOperation({ summary: 'Get student dashboard data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard data retrieved successfully',
    type: StudentDashboardResponseDto 
  })
  async getStudentDashboard(
    @Param('studentId') studentId: string,
    @Request() req
  ): Promise<StudentDashboardResponseDto> {
    // Ensure students can only access their own dashboard
    const currentUserId = req.user?.sub || req.user?.id;
    if (studentId !== currentUserId) {
      // Admin/teacher access can be added later
      if (req.user?.role !== 'teacher' && req.user?.role !== 'hei_mentor') {
        throw new Error('Access denied');
      }
    }

    return this.studentsService.getStudentDashboard(studentId);
  }

  @Get('my-dashboard')
  @ApiOperation({ summary: 'Get current student dashboard data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard data retrieved successfully',
    type: StudentDashboardResponseDto 
  })
  async getMyDashboard(@Request() req): Promise<StudentDashboardResponseDto> {
    const studentId = req.user?.sub || req.user?.id;
    return this.studentsService.getStudentDashboard(studentId);
  }
}
