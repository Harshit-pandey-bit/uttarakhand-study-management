// server/src/assignments/dto/assignments.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum AssignmentStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  OVERDUE = 'overdue'
}

export enum SubmissionFormat {
  PDF = 'pdf',
  DOC = 'doc',
  IMAGE = 'image',
  TEXT = 'text'
}

export class AssignmentQuestionDto {
  @ApiProperty({ example: 1 })
  questionNumber: number;

  @ApiProperty({ example: 'What is the square root of 144?' })
  question: string;

  @ApiProperty({ example: 'short-answer', enum: ['mcq', 'short-answer', 'long-answer', 'numerical'] })
  type: string;

  @ApiProperty({ example: 5 })
  marks: number;

  @ApiProperty({ type: [String], required: false, example: ['12', '14', '16', '18'] })
  options?: string[];

  @ApiProperty({ required: false })
  correctAnswer?: string;
}

export class AssignmentDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Quadratic Equations Practice Set' })
  title: string;

  @ApiProperty({ example: 'Solve the given quadratic equations and show your working.' })
  description: string;

  @ApiProperty({ example: 'Mathematics' })
  subject: string;

  @ApiProperty({ example: '10th' })
  class: string;

  @ApiProperty({ example: '2025-10-15T23:59:59.000Z' })
  dueDate: string;

  @ApiProperty({ enum: AssignmentStatus })
  status: AssignmentStatus;

  @ApiProperty({ example: true })
  aiGenerated: boolean;

  @ApiProperty({ example: 'Chapter 4: Quadratic Equations' })
  ncertChapter: string;

  @ApiProperty({ enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @ApiProperty({ example: 50 })
  totalMarks: number;

  @ApiProperty({ example: '60 minutes' })
  timeEstimate: string;

  @ApiProperty({ type: [AssignmentQuestionDto] })
  questions: AssignmentQuestionDto[];

  @ApiProperty({ type: [String], enum: SubmissionFormat, isArray: true })
  submissionFormat: SubmissionFormat[];

  @ApiProperty({ required: false })
  teacherNotes?: string;

  @ApiProperty({ required: false })
  aiInsights?: string;

  // For submitted assignments
  @ApiProperty({ required: false })
  score?: number;

  @ApiProperty({ required: false })
  feedback?: string;

  @ApiProperty({ required: false })
  grade?: string;

  @ApiProperty({ required: false })
  submittedAt?: string;
}

export class AssignmentListResponseDto {
  @ApiProperty({ type: [AssignmentDto] })
  assignments: AssignmentDto[];

  @ApiProperty({ example: 15 })
  total: number;

  @ApiProperty({ example: 5 })
  pending: number;

  @ApiProperty({ example: 8 })
  completed: number;

  @ApiProperty({ example: 2 })
  overdue: number;
}

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Linear Equations Worksheet' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Solve the following linear equations in one variable.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  subject: string;

  @ApiProperty({ example: '8th' })
  @IsString()
  classLevel: string;

  @ApiProperty({ example: '2025-10-20T23:59:59.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @ApiProperty({ example: 'Chapter 2: Linear Equations in One Variable' })
  @IsString()
  ncertChapter: string;

  @ApiProperty({ example: 30, default: 100 })
  @IsNumber()
  totalMarks: number;

  @ApiProperty({ example: 45, description: 'Time estimate in minutes' })
  @IsNumber()
  timeEstimate: number;

  @ApiProperty({ type: [AssignmentQuestionDto] })
  @IsArray()
  questions: AssignmentQuestionDto[];

  @ApiProperty({ type: [String], enum: SubmissionFormat, isArray: true })
  @IsArray()
  submissionFormat: SubmissionFormat[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teacherNotes?: string;
}

export class AIGenerateAssignmentDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  subject: string;

  @ApiProperty({ example: '9th' })
  @IsString()
  classLevel: string;

  @ApiProperty({ example: 'Chapter 1: Number Systems' })
  @IsString()
  ncertChapter: string;

  @ApiProperty({ enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @ApiProperty({ example: 10, description: 'Number of questions' })
  @IsNumber()
  questionCount: number;

  @ApiProperty({ example: 50, description: 'Total marks' })
  @IsNumber()
  totalMarks: number;

  @ApiProperty({ type: [String], example: ['mcq', 'short-answer'], description: 'Types of questions to include' })
  @IsArray()
  questionTypes: string[];
}

export class SubmitAssignmentDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  @IsUUID()
  assignmentId: string;

  @ApiProperty({ type: [String], required: false, description: 'File URLs/paths' })
  @IsOptional()
  @IsArray()
  submissionFiles?: string[];

  @ApiProperty({ required: false, description: 'Text-based submission' })
  @IsOptional()
  @IsString()
  submissionText?: string;
}

export class AssignmentSubmissionDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  assignmentId: string;

  @ApiProperty({ example: 'Quadratic Equations Practice Set' })
  assignmentTitle: string;

  @ApiProperty({ type: [String] })
  submissionFiles: string[];

  @ApiProperty({ required: false })
  submissionText?: string;

  @ApiProperty({ example: '2025-10-10T15:30:00.000Z' })
  submittedAt: string;

  @ApiProperty({ required: false })
  score?: number;

  @ApiProperty({ required: false })
  feedback?: string;

  @ApiProperty({ required: false })
  grade?: string;

  @ApiProperty({ enum: ['submitted', 'graded', 'returned'] })
  status: string;
}

export class NCERTChapterDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  subject: string;

  @ApiProperty({ example: '10th' })
  classLevel: string;

  @ApiProperty({ example: 1 })
  chapterNumber: number;

  @ApiProperty({ example: 'Real Numbers' })
  chapterTitle: string;

  @ApiProperty({ type: [String] })
  topics: string[];

  @ApiProperty({ type: [String] })
  learningObjectives: string[];

  @ApiProperty({ type: [String] })
  keywords: string[];
}

export class AssignmentStatsDto {
  @ApiProperty({ example: 25 })
  totalAssignments: number;

  @ApiProperty({ example: 18 })
  completedAssignments: number;

  @ApiProperty({ example: 5 })
  pendingAssignments: number;

  @ApiProperty({ example: 2 })
  overdueAssignments: number;

  @ApiProperty({ example: 85.5 })
  averageScore: number;

  @ApiProperty({ example: 'B+' })
  overallGrade: string;
}
