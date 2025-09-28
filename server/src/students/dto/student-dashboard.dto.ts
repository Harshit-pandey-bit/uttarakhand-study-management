// server/src/students/dto/student-dashboard.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class StudentProfileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  class: string;

  @ApiProperty()
  school: string;

  @ApiProperty({ required: false })
  profileImage?: string;
}

export class ProfileStatsDto {
  @ApiProperty()
  completedAssignments: number;

  @ApiProperty()
  totalAssignments: number;

  @ApiProperty()
  upcomingTests: number;

  @ApiProperty()
  mentoringSessionsAttended: number;
}

export class RecentActivityDto {
  @ApiProperty({ enum: ['assignment', 'session', 'test', 'project'] })
  type: 'assignment' | 'session' | 'test' | 'project';

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: ['completed', 'upcoming', 'pending', 'in-progress'] })
  status: 'completed' | 'upcoming' | 'pending' | 'in-progress';

  @ApiProperty()
  date: string;
}

export class UpcomingSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  time: string;

  @ApiProperty()
  mentor: string;

  @ApiProperty()
  subject: string;

  @ApiProperty({ enum: ['Individual', 'Group'] })
  type: 'Individual' | 'Group';
}

export class StudentDashboardResponseDto {
  @ApiProperty({ type: StudentProfileDto })
  student: StudentProfileDto;

  @ApiProperty({ type: ProfileStatsDto })
  profileStats: ProfileStatsDto;

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivities: RecentActivityDto[];

  @ApiProperty({ type: [UpcomingSessionDto] })
  upcomingSessions: UpcomingSessionDto[];
}
