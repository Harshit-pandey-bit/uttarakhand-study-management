// server/src/dashboard/dto/dashboard.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';

export enum ActivityType {
  ASSIGNMENT = 'assignment',
  SESSION = 'session',
  TEST = 'test',
  PROJECT = 'project',
  CAREER_EXPLORED = 'career_explored'
}

export enum ActivityStatus {
  COMPLETED = 'completed',
  UPCOMING = 'upcoming',
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress'
}

export enum SessionType {
  INDIVIDUAL = 'Individual',
  GROUP = 'Group'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold'
}

export class StudentBasicInfoDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  name: string;

  @ApiProperty({ example: '10th' })
  class: string;

  @ApiProperty({ example: 'Government Senior Secondary School, Dehradun' })
  school: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profileImage?: string;

  @ApiProperty({ example: 'Dehradun' })
  location: string;

  @ApiProperty({ example: 'Science' })
  stream?: string;
}

export class ProfileStatsDto {
  @ApiProperty({ example: 8 })
  completedAssignments: number;

  @ApiProperty({ example: 12 })
  totalAssignments: number;

  @ApiProperty({ example: 2 })
  upcomingTests: number;

  @ApiProperty({ example: 5 })
  mentoringSessionsAttended: number;

  @ApiProperty({ example: 85.5 })
  averageScore: number;

  @ApiProperty({ example: 75 })
  careerExplorationProgress: number;
}

export class RecentActivityDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ enum: ActivityType })
  type: ActivityType;

  @ApiProperty({ example: 'Mathematics Assignment - Quadratic Equations' })
  title: string;

  @ApiProperty({ enum: ActivityStatus })
  status: ActivityStatus;

  @ApiProperty({ example: '2025-09-28T10:30:00.000Z' })
  date: string;

  @ApiProperty({ example: 'Mathematics assignment on quadratic equations', required: false })
  description?: string;

  @ApiProperty({ required: false })
  metadata?: {
    score?: number;
    totalMarks?: number;
    grade?: string;
    subject?: string;
  };
}

export class UpcomingSessionDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: '2025-10-01' })
  date: string;

  @ApiProperty({ example: '14:00' })
  time: string;

  @ApiProperty({ example: 'Dr. Priya Sharma' })
  mentor: string;

  @ApiProperty({ example: 'Career Guidance' })
  subject: string;

  @ApiProperty({ enum: SessionType })
  type: SessionType;

  @ApiProperty({ example: 'Career options after 12th science' })
  description: string;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ example: 'https://meet.google.com/xyz-abc-def', required: false })
  meetingLink?: string;

  @ApiProperty({ example: false })
  isRegistered: boolean;
}

export class StudentDashboardDto {
  @ApiProperty({ type: StudentBasicInfoDto })
  student: StudentBasicInfoDto;

  @ApiProperty({ type: ProfileStatsDto })
  profileStats: ProfileStatsDto;

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivities: RecentActivityDto[];

  @ApiProperty({ type: [UpcomingSessionDto] })
  upcomingSessions: UpcomingSessionDto[];

  @ApiProperty({ type: [String], example: ['Complete Holland Code test', 'Submit pending assignments'] })
  quickActions: string[];
}

export class NotificationDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'New Assignment Available' })
  title: string;

  @ApiProperty({ example: 'Mathematics assignment on Quadratic Equations has been assigned' })
  message: string;

  @ApiProperty({ example: 'assignment' })
  type: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: 'medium', enum: ['low', 'medium', 'high'] })
  priority: string;

  @ApiProperty({ example: '2025-09-28T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ required: false })
  actionUrl?: string;
}

export class MentoringSessionDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Career Guidance for Science Students' })
  title: string;

  @ApiProperty({ example: 'Discussion on career options after 12th science' })
  description: string;

  @ApiProperty({ example: 'Dr. Priya Sharma' })
  mentorName: string;

  @ApiProperty({ example: '2025-10-01T14:00:00.000Z' })
  sessionDate: string;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ enum: SessionType })
  type: SessionType;

  @ApiProperty({ example: 'Career Guidance' })
  subject: string;

  @ApiProperty({ example: 10 })
  maxParticipants: number;

  @ApiProperty({ example: 5 })
  currentParticipants: number;

  @ApiProperty({ example: 'https://meet.google.com/xyz-abc-def' })
  meetingLink: string;

  @ApiProperty({ example: 'scheduled' })
  status: string;

  @ApiProperty({ example: false })
  isRegistered: boolean;
}

export class RegisterSessionDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  sessionId: string;
}

export class ProjectDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Science Fair Project: Water Purification System' })
  title: string;

  @ApiProperty({ example: 'Designing a cost-effective water purification system' })
  description: string;

  @ApiProperty({ example: 'academic' })
  projectType: string;

  @ApiProperty({ example: 'Science' })
  subject: string;

  @ApiProperty({ example: '2025-09-15' })
  startDate: string;

  @ApiProperty({ example: '2025-10-30', required: false })
  endDate?: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ type: [String] })
  skillsUsed: string[];

  @ApiProperty({ type: [String] })
  technologies: string[];

  @ApiProperty({ example: 75 })
  progressPercentage: number;
}

export class TestDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Mathematics Monthly Test' })
  title: string;

  @ApiProperty({ example: 'Algebra and Geometry assessment' })
  description: string;

  @ApiProperty({ example: 'Mathematics' })
  subject: string;

  @ApiProperty({ example: '2025-10-05T10:00:00.000Z' })
  testDate: string;

  @ApiProperty({ example: 120 })
  duration: number;

  @ApiProperty({ example: 100 })
  totalMarks: number;

  @ApiProperty({ example: 'exam' })
  testType: string;

  @ApiProperty({ example: false })
  hasCompleted: boolean;

  @ApiProperty({ required: false })
  result?: {
    score: number;
    percentage: number;
    grade: string;
    completedAt: string;
  };
}

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty({ example: 'Mathematics Assignment Completed' })
  @IsString()
  activityTitle: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  activityDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({ enum: ActivityStatus })
  @IsEnum(ActivityStatus)
  status: ActivityStatus;

  @ApiProperty({ example: '2025-09-28T10:30:00.000Z' })
  @IsDateString()
  activityDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
