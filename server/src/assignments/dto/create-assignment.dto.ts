// server/src/assignments/dto/create-assignment.dto.ts

import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'Chapter 5 - Light Reflection & Refraction',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'NCERT textbook reference',
    example: 'NCERT Class 10 Science, Chapter 5, Pages 78-92',
  })
  @IsOptional()
  @IsString()
  ncert_reference?: string;

  @ApiPropertyOptional({
    description: 'Marking criteria and rubric',
    example: 'Diagrams: 5 marks, Derivations: 10 marks, MCQs: 5 marks',
  })
  @IsOptional()
  @IsString()
  marking_criteria?: string;

  @ApiPropertyOptional({
    description: 'Due date in ISO 8601 format',
    example: '2026-06-20T23:59:00+05:30',
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}
