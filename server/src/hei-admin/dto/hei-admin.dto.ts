// server/src/hei-admin/dto/hei-admin.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsEnum, IsOptional, IsBoolean, IsDate, IsUUID, IsNotEmpty } from 'class-validator';

/* ---------- ENUMS ---------- */

export enum MentorStatus {
  ACTIVE = 'active',
  AWAY = 'away',
  INACTIVE = 'inactive'
}

export enum PartnershipStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum AssignmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REASSIGNED = 'reassigned'
}

export enum AnnouncementPriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum AnnouncementTarget {
  HEI_MENTORS = 'hei_mentors',
  SCHOOLS = 'schools',
  TEACHERS = 'teachers',
  STUDENTS = 'students'
}

/* ---------- DASHBOARD DTOs ---------- */

export class DashboardStatsDto {
  @ApiProperty()
  totalMentors: number;

  @ApiProperty()
  activeMentors: number;

  @ApiProperty()
  inactiveMentors: number;

  @ApiProperty()
  totalSchools: number;

  @ApiProperty()
  partnerSchools: number;

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  totalTeachers: number;

  @ApiProperty()
  pendingAssignments: number;

  @ApiProperty()
  activeAssignments: number;

  @ApiProperty()
  recentAnnouncementsCount: number;
}

export class TrendDataPointDto {
  @ApiProperty()
  month?: string;

  @ApiProperty()
  region?: string;

  @ApiProperty()
  range?: string;

  @ApiProperty()
  count: number;
}

export class TrendsDataDto {
  @ApiProperty({ type: [TrendDataPointDto] })
  mentorAssignmentTrend: TrendDataPointDto[];

  @ApiProperty({ type: [TrendDataPointDto] })
  schoolPartnershipsByRegion: TrendDataPointDto[];

  @ApiProperty({ type: [TrendDataPointDto] })
  mentorWorkloadDistribution: TrendDataPointDto[];
}

export class MentorAssignmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mentorId: string;

  @ApiProperty()
  mentorName: string;

  @ApiProperty()
  mentorEmail: string;

  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  schoolLocation: string;

  @ApiProperty()
  assignedBy: string;

  @ApiProperty()
  assignedByName: string;

  @ApiProperty()
  assignmentDate: string;

  @ApiProperty({ enum: AssignmentStatus })
  status: AssignmentStatus;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  lastVisitDate?: string;
}

export class AnnouncementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  badgeType: string;

  @ApiProperty()
  badgeColor: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  authorRole: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  isPinned: boolean;

  @ApiProperty()
  isNew: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  metadata: any;
}

export class HEIAdminDashboardDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [MentorAssignmentDto] })
  recentAssignments: MentorAssignmentDto[];

  @ApiProperty({ type: [AnnouncementDto] })
  recentAnnouncements: AnnouncementDto[];

  @ApiProperty({ type: TrendsDataDto })
  trendsData: TrendsDataDto;
}

/* ---------- MENTOR DTOs ---------- */

export class HEIMentorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  employeeId?: string;

  @ApiProperty()
  designation: string;

  @ApiProperty()
  department: string;

  @ApiProperty({ type: [String] })
  expertise: string[];

  @ApiProperty()
  qualification: string;

  @ApiProperty()
  experienceYears: number;

  @ApiProperty({ type: [String] })
  researchInterests: string[];

  @ApiProperty()
  maxStudents: number;

  @ApiProperty({ enum: MentorStatus })
  status: MentorStatus;

  @ApiProperty()
  assignedSchoolsCount: number;

  @ApiProperty()
  totalStudentsSupervised: number;

  @ApiPropertyOptional()
  lastActive?: string;

  @ApiProperty()
  joinDate: string;

  @ApiProperty()
  heiId: string;

  @ApiPropertyOptional()
  heiName?: string;
}

export class SchoolAssignmentSummaryDto {
  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  location: string;
}

export class MentorListItemDto extends HEIMentorDto {
  @ApiProperty({ enum: ['under-assigned', 'optimal', 'over-assigned'] })
  workloadStatus: 'under-assigned' | 'optimal' | 'over-assigned';

  @ApiProperty({ type: [SchoolAssignmentSummaryDto] })
  assignedSchools: SchoolAssignmentSummaryDto[];
}

export class SchoolAssignmentDetailsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  schoolName: string;

  @ApiPropertyOptional()
  schoolLogo?: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  studentsCount: number;

  @ApiProperty()
  teachersCount: number;

  @ApiProperty()
  assignmentDate: string;

  @ApiPropertyOptional()
  lastVisitDate?: string;

  @ApiProperty({ enum: AssignmentStatus })
  status: AssignmentStatus;

  @ApiPropertyOptional()
  notes?: string;
}

export class MentorDetailsDto extends HEIMentorDto {
  @ApiProperty({ type: [SchoolAssignmentDetailsDto] })
  assignedSchools: SchoolAssignmentDetailsDto[];

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  contactNumber?: string;
}

export class MentorCapacityDto {
  @ApiProperty()
  mentorId: string;

  @ApiProperty()
  mentorName: string;

  @ApiProperty()
  currentSchoolsCount: number;

  @ApiProperty()
  maxCapacity: number;

  @ApiProperty()
  availableCapacity: number;

  @ApiProperty()
  workloadPercentage: number;

  @ApiProperty({ type: [SchoolAssignmentSummaryDto] })
  assignedSchools: SchoolAssignmentSummaryDto[];
}

export class PaginatedMentorListDto {
  @ApiProperty({ type: [MentorListItemDto] })
  data: MentorListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}

/* ---------- ASSIGNMENT DTOs ---------- */

export class UnassignedSchoolDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  studentsCount: number;

  @ApiProperty()
  teachersCount: number;

  @ApiPropertyOptional()
  principalName?: string;

  @ApiPropertyOptional()
  principalContact?: string;

  @ApiPropertyOptional()
  requestDate?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'] })
  urgency: 'low' | 'medium' | 'high';
}

export class CreateAssignmentDto {
  @ApiProperty()
  @IsUUID()
  mentorId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  schoolIds: string[];

  @ApiProperty()
  @IsString()
  assignmentDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsBoolean()
  sendNotification: boolean;
}

export class ReassignMentorDto {
  @ApiProperty()
  @IsUUID()
  assignmentId: string;

  @ApiProperty()
  @IsUUID()
  newMentorId: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  effectiveDate: string;
}

export class UpdateMentorStatusDto {
  @ApiProperty({ enum: MentorStatus })
  @IsEnum(MentorStatus)
  status: MentorStatus;
}

/* ---------- PARTNERSHIP DTOs ---------- */

export class SchoolPartnershipDto {
  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  schoolName: string;

  @ApiPropertyOptional()
  schoolLogo?: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  state: string;

  @ApiPropertyOptional()
  principalName?: string;

  @ApiPropertyOptional()
  principalContact?: string;

  @ApiPropertyOptional()
  mentorId?: string;

  @ApiPropertyOptional()
  mentorName?: string;

  @ApiPropertyOptional()
  mentorAvatar?: string;

  @ApiPropertyOptional()
  mentorEmail?: string;

  @ApiProperty()
  studentsCount: number;

  @ApiProperty()
  teachersCount: number;

  @ApiPropertyOptional()
  partnershipDate?: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  lastContactDate?: string;

  @ApiProperty({ type: [String] })
  programsEnrolled?: string[];
}

export class PaginatedPartnershipListDto {
  @ApiProperty({ type: [SchoolPartnershipDto] })
  partnerships: SchoolPartnershipDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}

export class PartnershipDetailsDto {
  @ApiProperty()
  school: {
    id: string;
    name: string;
    logo?: string;
    location: string;
    district: string;
    state: string;
    principalName?: string;
    principalContact?: string;
    principalEmail?: string;
    establishedYear?: string;
    schoolType?: string;
    infrastructure?: any;
    partnershipStatus: PartnershipStatus;
    partnershipStartDate?: string;
  };

  @ApiPropertyOptional()
  assignedMentor?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    designation: string;
    department: string;
    contactNumber?: string;
    assignmentDate: string;
  };

  @ApiProperty({ type: [Object] })
  mentorHistory: Array<{
    mentorId: string;
    mentorName: string;
    assignedDate: string;
    endDate?: string;
    reason?: string;
  }>;

  @ApiProperty()
  students: {
    total: number;
    gradeDistribution: Array<{ grade: string; count: number }>;
  };

  @ApiProperty()
  teachers: {
    total: number;
    subjectDistribution: Array<{ subject: string; count: number }>;
  };

  @ApiProperty()
  statistics: {
    totalMentoringSessions: number;
    totalAssignmentsCreated: number;
    studentEngagementRate: number;
    teacherParticipationRate: number;
  };
}

export class PartnershipOverviewStatsDto {
  @ApiProperty()
  totalMentors: number;

  @ApiProperty()
  totalSchools: number;

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  totalTeachers: number;

  @ApiProperty()
  activePartnerships: number;

  @ApiProperty()
  pendingRequests: number;

  @ApiProperty()
  inactivePartnerships: number;

  @ApiProperty()
  growthRate: number;
}

export class UpdatePartnershipStatusDto {
  @ApiProperty({ enum: PartnershipStatus })
  @IsEnum(PartnershipStatus)
  status: PartnershipStatus;
}

/* ---------- ANNOUNCEMENT DTOs ---------- */

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  badgeType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badgeColor?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  targetAudience: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  priority: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: any;
}

export class AnnouncementRecipientSummaryDto {
  @ApiProperty()
  totalRecipients: number;

  @ApiProperty()
  breakdown: {
    mentors: number;
    schools: number;
    teachers: number;
    students: number;
  };
}

export class PaginatedAnnouncementListDto {
  @ApiProperty({ type: [AnnouncementDto] })
  data: AnnouncementDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}
