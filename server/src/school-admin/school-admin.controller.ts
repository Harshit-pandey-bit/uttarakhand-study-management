// server/src/school-admin/school-admin.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SchoolAdminService } from './school-admin.service';
import { 
  SchoolAdminDashboardResponseDto,
  TeachersResponseDto,
  StudentsResponseDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementDto,
  AnalyticsOverviewDto,
  StudentActivitiesAnalyticsDto
} from './dto/school-admin-dashboard.dto';

@ApiTags('School Admin')
@Controller('school-admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SchoolAdminController {
  constructor(private readonly schoolAdminService: SchoolAdminService) {}

  // Dashboard Endpoints
  @Get('dashboard')
  @ApiOperation({ summary: 'Get school admin dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: SchoolAdminDashboardResponseDto
  })
  async getDashboard(@Request() req): Promise<SchoolAdminDashboardResponseDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getSchoolAdminDashboard(adminUserId);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get school analytics overview' })
  @ApiResponse({
    status: 200,
    description: 'Analytics overview retrieved successfully',
    type: AnalyticsOverviewDto
  })
  async getAnalyticsOverview(@Request() req): Promise<AnalyticsOverviewDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getAnalyticsOverview(adminUserId);
  }

  @Get('stats/students-count')
  @ApiOperation({ summary: 'Get student count by class' })
  @ApiResponse({
    status: 200,
    description: 'Student count statistics retrieved successfully'
  })
  async getStudentsCount(@Request() req) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentsCountByClass(adminUserId);
  }

  @Get('stats/teachers-count')
  @ApiOperation({ summary: 'Get teacher statistics' })
  @ApiResponse({
    status: 200,
    description: 'Teacher statistics retrieved successfully'
  })
  async getTeachersCount(@Request() req) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getTeachersStats(adminUserId);
  }

  // Teacher Management Endpoints
  @Get('teachers')
  @ApiOperation({ summary: 'Get all teachers data for school' })
  @ApiResponse({
    status: 200,
    description: 'Teachers data retrieved successfully',
    type: TeachersResponseDto
  })
  async getTeachers(@Request() req): Promise<TeachersResponseDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getTeachersData(adminUserId);
  }

  @Get('teachers/:teacherId/details')
  @ApiOperation({ summary: 'Get detailed teacher information' })
  @ApiResponse({
    status: 200,
    description: 'Teacher details retrieved successfully'
  })
  async getTeacherDetails(
    @Param('teacherId') teacherId: string,
    @Request() req
  ) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getTeacherDetails(adminUserId, teacherId);
  }

  @Get('teachers/stats')
  @ApiOperation({ summary: 'Get teaching staff summary' })
  @ApiResponse({
    status: 200,
    description: 'Teaching staff statistics retrieved successfully'
  })
  async getTeachersStatsSummary(@Request() req) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getTeachersStatsSummary(adminUserId);
  }

  // Student Management Endpoints
  @Get('students')
  @ApiOperation({ summary: 'Get all students data for school' })
  @ApiQuery({ name: 'classLevel', required: false, description: 'Filter by class level' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Students data retrieved successfully',
    type: StudentsResponseDto
  })
  async getStudents(
    @Request() req,
    @Query('classLevel') classLevel?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<StudentsResponseDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentsData(adminUserId, classLevel, limit, offset);
  }

  @Get('students/:studentId/details')
  @ApiOperation({ summary: 'Get detailed student information' })
  @ApiResponse({
    status: 200,
    description: 'Student details retrieved successfully'
  })
  async getStudentDetails(
    @Param('studentId') studentId: string,
    @Request() req
  ) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentDetails(adminUserId, studentId);
  }

  @Get('students/by-class/:classLevel')
  @ApiOperation({ summary: 'Get students filtered by class level' })
  @ApiResponse({
    status: 200,
    description: 'Class students retrieved successfully',
    type: StudentsResponseDto
  })
  async getStudentsByClass(
    @Param('classLevel') classLevel: string,
    @Request() req
  ): Promise<StudentsResponseDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentsData(adminUserId, classLevel);
  }

  @Get('students/performance-summary')
  @ApiOperation({ summary: 'Get academic performance summary' })
  @ApiResponse({
    status: 200,
    description: 'Performance summary retrieved successfully'
  })
  async getStudentsPerformanceSummary(@Request() req) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentsPerformanceSummary(adminUserId);
  }

  // Announcement Endpoints
  @Get('announcements')
  @ApiOperation({ summary: 'Get school announcements' })
  @ApiQuery({ name: 'badgeType', required: false, description: 'Filter by badge type' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  @ApiQuery({ name: 'pinnedOnly', required: false, description: 'Show only pinned announcements' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'School announcements retrieved successfully',
    type: [AnnouncementDto]
  })
  async getAnnouncements(
    @Request() req,
    @Query('badgeType') badgeType?: string,
    @Query('priority') priority?: string,
    @Query('pinnedOnly') pinnedOnly?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<AnnouncementDto[]> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getAnnouncements(adminUserId, badgeType, priority, pinnedOnly, limit, offset);
  }

  @Post('announcements')
  @ApiOperation({ summary: 'Create new announcement' })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully',
    type: AnnouncementDto
  })
  async createAnnouncement(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Request() req
  ): Promise<AnnouncementDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.createAnnouncement(adminUserId, createAnnouncementDto);
  }

  @Put('announcements/:announcementId')
  @ApiOperation({ summary: 'Update announcement' })
  @ApiResponse({
    status: 200,
    description: 'Announcement updated successfully',
    type: AnnouncementDto
  })
  async updateAnnouncement(
    @Param('announcementId') announcementId: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Request() req
  ): Promise<AnnouncementDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.updateAnnouncement(adminUserId, announcementId, updateAnnouncementDto);
  }

  @Delete('announcements/:announcementId')
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully'
  })
  async deleteAnnouncement(
    @Param('announcementId') announcementId: string,
    @Request() req
  ) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.deleteAnnouncement(adminUserId, announcementId);
  }

  @Get('announcements/hei-partnership')
  @ApiOperation({ summary: 'Get HEI partnership announcements' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'HEI partnership announcements retrieved successfully',
    type: [AnnouncementDto]
  })
  async getHEIAnnouncements(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<AnnouncementDto[]> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getHEIAnnouncements(adminUserId, limit, offset);
  }

  // Analytics Endpoints
  @Get('analytics/class-performance')
  @ApiOperation({ summary: 'Get class-wise performance analytics' })
  @ApiResponse({
    status: 200,
    description: 'Class performance analytics retrieved successfully'
  })
  async getClassPerformanceAnalytics(@Request() req) {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getClassPerformanceAnalytics(adminUserId);
  }

  @Get('analytics/student-activities')
  @ApiOperation({ summary: 'Get student activity participation analytics' })
  @ApiResponse({
    status: 200,
    description: 'Student activities analytics retrieved successfully',
    type: StudentActivitiesAnalyticsDto
  })
  async getStudentActivitiesAnalytics(@Request() req): Promise<StudentActivitiesAnalyticsDto> {
    const adminUserId = req.user?.sub || req.user?.id;
    return this.schoolAdminService.getStudentActivitiesAnalytics(adminUserId);
  }
}
