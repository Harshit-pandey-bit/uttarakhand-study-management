// server/src/hei-admin/hei-admin.controller.ts

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
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HeiAdminService } from './hei-admin.service';
import {
  HEIAdminDashboardDto,
  PaginatedMentorListDto,
  MentorDetailsDto,
  MentorCapacityDto,
  UnassignedSchoolDto,
  MentorAssignmentDto,
  CreateAssignmentDto,
  ReassignMentorDto,
  PaginatedPartnershipListDto,
  PartnershipDetailsDto,
  PartnershipOverviewStatsDto,
  PaginatedAnnouncementListDto,
  AnnouncementDto,
  CreateAnnouncementDto,
  AnnouncementRecipientSummaryDto,
  UpdateMentorStatusDto,
  UpdatePartnershipStatusDto,
  MentorStatus,
  PartnershipStatus,
} from './dto/hei-admin.dto';

@ApiTags('HEI Admin')
@Controller('hei-admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class HeiAdminController {
  constructor(private readonly heiAdminService: HeiAdminService) {}

  /* ---------- DASHBOARD ---------- */

@Get('dashboard')
@ApiOperation({ summary: 'Get HEI Admin dashboard data' })
@ApiResponse({
  status: 200,
  description: 'Dashboard data retrieved successfully',
  type: HEIAdminDashboardDto,
})
async getDashboard(@Request() req): Promise<HEIAdminDashboardDto> {
  const userId = req.user?.sub || req.user?.id;
  return this.heiAdminService.getDashboard(userId);
}


  /* ---------- MENTORS ---------- */

  @Get('mentors')
  @ApiOperation({ summary: 'Get paginated list of mentors' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: MentorStatus })
  @ApiQuery({ name: 'workload', required: false, type: String })
  @ApiQuery({ name: 'expertise', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Mentors list retrieved successfully',
    type: PaginatedMentorListDto,
  })
  async getMentors(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: MentorStatus,
    @Query('workload') workload?: string,
    @Query('expertise') expertise?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedMentorListDto> {
    const userId = req.user?.sub || req.user?.id;

    const { data: adminProfile } = await this.heiAdminService['supabase']
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', userId)
      .single();

    const heiId = adminProfile?.hei_id;

    return this.heiAdminService.getMentors(
      heiId,
      { status, workload, expertise, search },
      { page: Number(page), limit: Number(limit) }
    );
  }

  // ✅ FIXED: Moved BEFORE :mentorId route to fix 404 error
  @Get('mentors/available')
  @ApiOperation({ summary: 'Get list of available mentors' })
  @ApiResponse({
    status: 200,
    description: 'Available mentors retrieved successfully',
  })
  async getAvailableMentors(@Request() req) {
    const userId = req.user?.sub || req.user?.id;
    const { data: adminProfile } = await this.heiAdminService['supabase']
      .from('hei_admin_profiles')
      .select('hei_id')
      .eq('user_id', userId)
      .single();

    const heiId = adminProfile?.hei_id;
    return this.heiAdminService.getAvailableMentors(heiId);
  }

  @Get('mentors/:mentorId')
  @ApiOperation({ summary: 'Get mentor details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Mentor details retrieved successfully',
    type: MentorDetailsDto,
  })
  async getMentor(@Param('mentorId') mentorId: string): Promise<MentorDetailsDto> {
    return this.heiAdminService.getMentor(mentorId);
  }

  @Put('mentors/:mentorId/status')
  @ApiOperation({ summary: 'Update mentor status' })
  @ApiResponse({
    status: 200,
    description: 'Mentor status updated successfully',
  })
  async updateMentorStatus(
    @Param('mentorId') mentorId: string,
    @Body() statusDto: UpdateMentorStatusDto,
  ): Promise<{ message: string }> {
    await this.heiAdminService.updateMentorStatus(mentorId, statusDto);
    return { message: 'Mentor status updated successfully' };
  }

  @Get('mentors/:mentorId/capacity')
  @ApiOperation({ summary: 'Get mentor capacity and workload' })
  @ApiResponse({
    status: 200,
    description: 'Mentor capacity retrieved successfully',
    type: MentorCapacityDto,
  })
  async getMentorCapacity(@Param('mentorId') mentorId: string): Promise<MentorCapacityDto> {
    return this.heiAdminService.getMentorCapacity(mentorId);
  }

  /* ---------- ASSIGNMENTS ---------- */

  @Get('assignments/unassigned-schools')
  @ApiOperation({ summary: 'Get list of unassigned schools' })
  @ApiResponse({
    status: 200,
    description: 'Unassigned schools retrieved successfully',
    type: [UnassignedSchoolDto],
  })
  async getUnassignedSchools(): Promise<UnassignedSchoolDto[]> {
    return this.heiAdminService.getUnassignedSchools();
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Create new mentor-school assignment' })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: [MentorAssignmentDto],
  })
  @HttpCode(HttpStatus.CREATED)
  async createAssignment(
    @Request() req,
    @Body() createDto: CreateAssignmentDto,
  ): Promise<MentorAssignmentDto[]> {
    const userId = req.user?.sub || req.user?.id;
    return this.heiAdminService.createAssignment(createDto, userId);
  }

  @Put('assignments/reassign')
  @ApiOperation({ summary: 'Reassign mentor to different school' })
  @ApiResponse({
    status: 200,
    description: 'Mentor reassigned successfully',
    type: MentorAssignmentDto,
  })
  async reassignMentor(
    @Request() req,
    @Body() reassignDto: ReassignMentorDto,
  ): Promise<MentorAssignmentDto> {
    const userId = req.user?.sub || req.user?.id;
    return this.heiAdminService.reassignMentor(reassignDto, userId);
  }

  @Delete('assignments/:assignmentId')
  @ApiOperation({ summary: 'Remove mentor assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment removed successfully',
  })
  @HttpCode(HttpStatus.OK)
  async removeAssignment(@Param('assignmentId') assignmentId: string): Promise<{ message: string }> {
    await this.heiAdminService.removeAssignment(assignmentId);
    return { message: 'Assignment removed successfully' };
  }

  /* ---------- PARTNERSHIPS ---------- */

  @Get('partnerships')
  @ApiOperation({ summary: 'Get paginated list of school partnerships' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PartnershipStatus })
  @ApiQuery({ name: 'mentorId', required: false, type: String })
  @ApiQuery({ name: 'district', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Partnerships list retrieved successfully',
    type: PaginatedPartnershipListDto,
  })
  async getPartnerships(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: PartnershipStatus,
    @Query('mentorId') mentorId?: string,
    @Query('district') district?: string,
    @Query('state') state?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedPartnershipListDto> {
    return this.heiAdminService.getPartnerships(
      { status, mentorId, district, state, search },
      { page: Number(page), limit: Number(limit) }
    );
  }

  @Get('partnerships/overview-stats')
  @ApiOperation({ summary: 'Get partnership overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Partnership stats retrieved successfully',
    type: PartnershipOverviewStatsDto,
  })
  async getPartnershipOverviewStats(): Promise<PartnershipOverviewStatsDto> {
    return this.heiAdminService.getPartnershipOverviewStats();
  }

  @Get('partnerships/:schoolId')
  @ApiOperation({ summary: 'Get partnership details by school ID' })
  @ApiResponse({
    status: 200,
    description: 'Partnership details retrieved successfully',
    type: PartnershipDetailsDto,
  })
  async getPartnership(@Param('schoolId') schoolId: string): Promise<PartnershipDetailsDto> {
    return this.heiAdminService.getPartnership(schoolId);
  }

  @Put('partnerships/:schoolId/status')
  @ApiOperation({ summary: 'Update partnership status' })
  @ApiResponse({
    status: 200,
    description: 'Partnership status updated successfully',
  })
  async updatePartnershipStatus(
    @Param('schoolId') schoolId: string,
    @Body() statusDto: UpdatePartnershipStatusDto,
  ): Promise<{ message: string }> {
    await this.heiAdminService.updatePartnershipStatus(schoolId, statusDto);
    return { message: 'Partnership status updated successfully' };
  }

  /* ---------- ANNOUNCEMENTS ---------- */

  @Get('announcements')
  @ApiOperation({ summary: 'Get paginated list of announcements' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Announcements list retrieved successfully',
    type: PaginatedAnnouncementListDto,
  })
  async getAnnouncements(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedAnnouncementListDto> {
    const userId = req.user?.sub || req.user?.id;
    return this.heiAdminService.getAnnouncements(userId, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Post('announcements')
  @ApiOperation({ summary: 'Create new announcement' })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully',
    type: AnnouncementDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createAnnouncement(
    @Request() req,
    @Body() createDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDto> {
    const userId = req.user?.sub || req.user?.id;
    return this.heiAdminService.createAnnouncement(createDto, userId);
  }

  @Post('announcements/recipient-count')
  @ApiOperation({ summary: 'Get recipient count for announcement' })
  @ApiResponse({
    status: 200,
    description: 'Recipient count calculated successfully',
    type: AnnouncementRecipientSummaryDto,
  })
  async getAnnouncementRecipientCount(
    @Body() createDto: Partial<CreateAnnouncementDto>,
  ): Promise<AnnouncementRecipientSummaryDto> {
    return this.heiAdminService.getAnnouncementRecipientCount(createDto);
  }

  @Delete('announcements/:announcementId')
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deleteAnnouncement(@Param('announcementId') announcementId: string): Promise<{ message: string }> {
    await this.heiAdminService.deleteAnnouncement(announcementId);
    return { message: 'Announcement deleted successfully' };
  }
}
