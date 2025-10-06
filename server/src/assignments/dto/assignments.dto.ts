// server/src/assignments/dto/assignments.dto.ts
// ✅ REWORKED FOR HEI-MENTOR FUNCTIONALITY

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  IsEnum, 
  IsUUID, 
  IsDateString, 
  IsBoolean,
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

// ===============================================
// ENUMS & BASIC TYPES
// ===============================================

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium', 
  HARD = 'hard'
}

export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  RETURNED = 'returned'
}

export enum SubmissionFormat {
  PDF = 'pdf',
  DOC = 'doc', 
  IMAGE = 'image',
  TEXT = 'text'
}

// ===============================================
// ASSIGNMENT QUESTION STRUCTURE
// ===============================================

export class AssignmentQuestionDto {
  @ApiProperty({ example: 1 })
  questionNumber: number;

  @ApiProperty({ example: 'What is the square root of 144?' })
  question: string;

  @ApiProperty({ 
    example: 'short-answer', 
    enum: ['mcq', 'short-answer', 'long-answer', 'numerical'] 
  })
  type: string;

  @ApiProperty({ example: 5 })
  marks: number;

  @ApiProperty({ 
    type: [String], 
    required: false, 
    example: ['12', '14', '16', '18'] 
  })
  options?: string[];

  @ApiProperty({ required: false })
  correctAnswer?: string;
}

// ===============================================
// HEI-MENTOR ASSIGNMENT DTOs
// ===============================================

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Linear Equations Worksheet' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Solve the following linear equations in one variable.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  subject: string;

  @ApiProperty({ example: '10th' })
  @IsString()
  class_level: string;

  @ApiProperty({ example: '2025-10-20T23:59:59.000Z' })
  @IsDateString()
  due_date: string;

  @ApiProperty({ enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @ApiProperty({ example: 'Chapter 2: Linear Equations in One Variable' })
  @IsOptional()
  @IsString()
  ncert_chapter?: string;

  @ApiProperty({ example: 100, default: 100 })
  @IsOptional()
  @IsNumber()
  total_marks?: number;

  @ApiProperty({ example: 45, description: 'Time estimate in minutes' })
  @IsOptional()
  @IsNumber()
  time_estimate?: number;

  @ApiProperty({ type: [AssignmentQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions?: AssignmentQuestionDto[];

  @ApiProperty({ 
    type: [String], 
    enum: SubmissionFormat, 
    isArray: true,
    example: ['pdf', 'text']
  })
  @IsOptional()
  @IsArray()
  submission_format?: SubmissionFormat[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teacher_notes?: string;
}

export class UpdateAssignmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({ enum: DifficultyLevel, required: false })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ncert_chapter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  total_marks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  time_estimate?: number;

  @ApiProperty({ type: [AssignmentQuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions?: AssignmentQuestionDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teacher_notes?: string;

  @ApiProperty({ enum: AssignmentStatus, required: false })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}

// ===============================================
// ASSIGNMENT RESPONSE DTOs
// ===============================================

export class AssignmentDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Quadratic Equations Practice Set' })
  title: string;

  @ApiProperty({ example: 'Solve the given quadratic equations and show your working.' })
  description?: string;

  @ApiProperty({ example: 'Mathematics' })
  subject: string;

  @ApiProperty({ example: '10th' })
  class_level: string;

  @ApiProperty({ example: '2025-10-15T23:59:59.000Z' })
  due_date: string;

  @ApiProperty({ enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @ApiProperty({ example: 'Chapter 4: Quadratic Equations' })
  ncert_chapter?: string;

  @ApiProperty({ example: 100 })
  total_marks: number;

  @ApiProperty({ example: 60, description: 'Time estimate in minutes' })
  time_estimate?: number;

  @ApiProperty({ type: [AssignmentQuestionDto] })
  questions: AssignmentQuestionDto[];

  @ApiProperty({ type: [String], enum: SubmissionFormat, isArray: true })
  submission_format: SubmissionFormat[];

  @ApiProperty({ required: false })
  teacher_notes?: string;

  @ApiProperty({ example: false })
  ai_generated: boolean;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: 5, description: 'Number of submissions received' })
  submission_count?: number;

  @ApiProperty({ example: '2025-10-01T10:30:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-10-01T10:30:00.000Z' })
  updated_at: string;
}

export class AssignmentListResponseDto {
  @ApiProperty({ type: [AssignmentDto] })
  assignments: AssignmentDto[];

  @ApiProperty({ example: 15 })
  total: number;

  @ApiProperty({ example: 10 })
  published: number;

  @ApiProperty({ example: 3 })
  draft: number;

  @ApiProperty({ example: 2 })
  archived: number;
}

// ===============================================
// SUBMISSION MANAGEMENT DTOs
// ===============================================

export class SubmissionDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  assignment_id: string;

  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  student_id: string;

  @ApiProperty({ example: 'John Doe' })
  student_name: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  student_email: string;

  @ApiProperty({ type: [String], description: 'Array of submitted file URLs' })
  submission_files?: string[];

  @ApiProperty({ required: false })
  submission_text?: string;

  @ApiProperty({ example: '2025-10-10T15:30:00.000Z' })
  submitted_at: string;

  @ApiProperty({ required: false, example: 85 })
  score?: number;

  @ApiProperty({ required: false })
  feedback?: string;

  @ApiProperty({ required: false, example: 'B+' })
  grade?: string;

  @ApiProperty({ enum: SubmissionStatus, example: 'submitted' })
  status: SubmissionStatus;

  @ApiProperty({ example: '2025-10-10T15:30:00.000Z' })
  created_at: string;

  @ApiProperty({ required: false })
  graded_at?: string;
}

export class GradeSubmissionDto {
  @ApiProperty({ example: 85, minimum: 0 })
  @IsNumber()
  score: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ required: false, example: 'B+' })
  @IsOptional()
  @IsString()
  grade?: string;
}

export class SubmissionListResponseDto {
  @ApiProperty({ type: [SubmissionDto] })
  submissions: SubmissionDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 15 })
  graded: number;

  @ApiProperty({ example: 10 })
  pending: number;

  @ApiProperty({ example: 82.5 })
  average_score?: number;
}

// ===============================================
// FILTER & QUERY DTOs
// ===============================================

export class AssignmentFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()  
  @IsString()
  class_level?: string;

  @ApiProperty({ enum: DifficultyLevel, required: false })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiProperty({ enum: AssignmentStatus, required: false })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class SubmissionFiltersDto {
  @ApiProperty({ enum: SubmissionStatus, required: false })
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

// ===============================================
// STATISTICS DTOs
// ===============================================

export class AssignmentStatsDto {
  @ApiProperty({ example: 25 })
  total_assignments: number;

  @ApiProperty({ example: 15 })
  published_assignments: number;

  @ApiProperty({ example: 5 })
  draft_assignments: number;

  @ApiProperty({ example: 150 })
  total_submissions: number;

  @ApiProperty({ example: 120 })
  graded_submissions: number;

  @ApiProperty({ example: 30 })
  pending_submissions: number;

  @ApiProperty({ example: 78.5 })
  average_score: number;

  @ApiProperty({ 
    example: { 'Mathematics': 10, 'Science': 8, 'English': 7 },
    description: 'Subject-wise assignment counts'
  })
  subject_breakdown: Record<string, number>;
}
