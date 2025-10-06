// server/src/school-admin/dto/school-admin-dashboard.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class SchoolOverviewDto {
  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  totalTeachers: number;

  @ApiProperty()
  location: string;

  @ApiProperty()
  district: string;
}

export class ClassStatsDto {
  @ApiProperty()
  classLevel: string;

  @ApiProperty()
  studentCount: number;

  @ApiProperty()
  averageGrade: number;

  @ApiProperty()
  completionRate: number;
}

export class TeacherSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  subjects: string[];

  @ApiProperty()
  classes: string[];

  @ApiProperty()
  qualification: string;

  @ApiProperty()
  experienceYears: number;

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  joinedDate: string;

  @ApiProperty({ required: false })
  profileImage?: string;
}

export class StudentSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  classLevel: string;

  @ApiProperty()
  overallGrade: string;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  completedAssignments: number;

  @ApiProperty()
  totalAssignments: number;

  @ApiProperty()
  stemProjects: number;

  @ApiProperty()
  careerAspiration: string;

  @ApiProperty({ required: false })
  profileImage?: string;
}

export class AnnouncementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['general', 'scholarship', 'event', 'career', 'academic', 'deadline', 'achievement', 'workshop', 'internship', 'placement', 'exam', 'holiday', 'emergency', 'maintenance', 'partnership', 'competition', 'research', 'sports', 'cultural', 'technical'] })
  badgeType: string;

  @ApiProperty()
  badgeColor: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty({ enum: ['hei_admin', 'hei_mentor', 'school_admin', 'teacher', 'student'] })
  authorRole: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'urgent'] })
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

export class ActivityStatsDto {
  @ApiProperty()
  totalActivities: number;

  @ApiProperty()
  recentActivities: number;

  @ApiProperty()
  topActivityTypes: string[];

  @ApiProperty()
  studentParticipation: number;
}

export class CreateAnnouncementDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['general', 'scholarship', 'event', 'career', 'academic', 'deadline', 'achievement', 'workshop', 'internship', 'placement', 'exam', 'holiday', 'emergency', 'maintenance', 'partnership', 'competition', 'research', 'sports', 'cultural', 'technical'] })
  badgeType: string;

  @ApiProperty({ required: false })
  badgeColor?: string;

  @ApiProperty({ enum: ['hei_mentor', 'school_admin', 'teacher', 'student'] })
  targetAudience: string[];

  @ApiProperty({ enum: ['low', 'medium', 'high', 'urgent'] })
  priority: string;

  @ApiProperty({ required: false })
  isPinned?: boolean;

  @ApiProperty({ required: false })
  classLevel?: string;

  @ApiProperty({ required: false })
  startsAt?: string;

  @ApiProperty({ required: false })
  expiresAt?: string;

  @ApiProperty({ required: false })
  metadata?: any;
}

export class UpdateAnnouncementDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, enum: ['general', 'scholarship', 'event', 'career', 'academic', 'deadline', 'achievement', 'workshop', 'internship', 'placement', 'exam', 'holiday', 'emergency', 'maintenance', 'partnership', 'competition', 'research', 'sports', 'cultural', 'technical'] })
  badgeType?: string;

  @ApiProperty({ required: false })
  badgeColor?: string;

  @ApiProperty({ required: false, enum: ['hei_mentor', 'school_admin', 'teacher', 'student'] })
  targetAudience?: string[];

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high', 'urgent'] })
  priority?: string;

  @ApiProperty({ required: false })
  isPinned?: boolean;

  @ApiProperty({ required: false })
  classLevel?: string;

  @ApiProperty({ required: false })
  startsAt?: string;

  @ApiProperty({ required: false })
  expiresAt?: string;

  @ApiProperty({ required: false })
  metadata?: any;
}

export class SchoolAdminDashboardResponseDto {
  @ApiProperty({ type: SchoolOverviewDto })
  schoolOverview: SchoolOverviewDto;

  @ApiProperty({ type: [ClassStatsDto] })
  classStats: ClassStatsDto[];

  @ApiProperty({ type: ActivityStatsDto })
  activityStats: ActivityStatsDto;

  @ApiProperty({ type: [AnnouncementDto] })
  announcements: AnnouncementDto[];

  @ApiProperty({ type: [AnnouncementDto] })
  heiAnnouncements: AnnouncementDto[];
}

export class TeachersResponseDto {
  @ApiProperty({ type: [TeacherSummaryDto] })
  teachers: TeacherSummaryDto[];

  @ApiProperty()
  totalTeachers: number;

  @ApiProperty()
  averageExperience: number;

  @ApiProperty()
  totalStudentsAssigned: number;
}

export class StudentsResponseDto {
  @ApiProperty({ type: [StudentSummaryDto] })
  students: StudentSummaryDto[];

  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  averageGrade: number;

  @ApiProperty()
  completionRate: number;
}

export class AnalyticsOverviewDto {
  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  totalTeachers: number;

  @ApiProperty()
  averageAttendance: number;

  @ApiProperty()
  completionRate: number;

  @ApiProperty({ type: [ClassStatsDto] })
  classPerformance: ClassStatsDto[];
}

export class StudentActivitiesAnalyticsDto {
  @ApiProperty()
  totalActivities: number;

  @ApiProperty()
  participationRate: number;

  @ApiProperty()
  topActivities: string[];

  @ApiProperty()
  recentGrowth: number;
}
