// server/src/mentoring/dto/schedule-session.dto.ts

import { IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleSessionDto {
  @ApiProperty({
    description: 'UUID of the student to mentor',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  student_id: string;

  @ApiProperty({
    description: 'Scheduled date/time in ISO 8601 format',
    example: '2026-06-15T10:00:00+05:30',
  })
  @IsDateString()
  scheduled_time: string;
}
