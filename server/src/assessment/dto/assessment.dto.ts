// server/src/assessment/dto/assessment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsArray, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class HollandQuestionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'I enjoy building things with my hands' })
  text: string;

  @ApiProperty({ 
    enum: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
    example: 'Realistic'
  })
  category: 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional';

  @ApiProperty({ 
    type: [String],
    example: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
  })
  options: string[];
}

export class HollandQuestionsResponseDto {
  @ApiProperty({ type: [HollandQuestionDto] })
  questions: HollandQuestionDto[];

  @ApiProperty({ example: 60 })
  totalQuestions: number;

  @ApiProperty({ example: 'Successfully retrieved Holland Code assessment questions' })
  message: string;
}

export class SubmitAssessmentDto {
  @ApiProperty({ 
    example: '8b85d0eb-7174-426f-836d-8e676de8f344',
    description: 'Student ID who is taking the assessment'
  })
  @IsString()
  studentId: string;

  @ApiProperty({ 
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    },
    description: 'Answers where key is question ID and value is answer index (0-4)'
  })
  @IsObject()
  answers: { [questionId: string]: number };

  @ApiProperty({ 
    example: 300,
    description: 'Time taken to complete assessment in seconds',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(3600)
  completionTime?: number;
}

export class AssessmentScoresDto {
  @ApiProperty({ example: 35 })
  Realistic: number;

  @ApiProperty({ example: 42 })
  Investigative: number;

  @ApiProperty({ example: 28 })
  Artistic: number;

  @ApiProperty({ example: 38 })
  Social: number;

  @ApiProperty({ example: 25 })
  Enterprising: number;

  @ApiProperty({ example: 32 })
  Conventional: number;
}

// Fix for the topCategories array type issue
export class CategoryScoreTuple {
  @ApiProperty({ example: 'Investigative' })
  category: string;

  @ApiProperty({ example: 42 })
  score: number;
}

export class AssessmentResultsDto {
  @ApiProperty({ 
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      "Realistic": 35,
      "Investigative": 42,
      "Artistic": 28,
      "Social": 38,
      "Enterprising": 25,
      "Conventional": 32
    }
  })
  scores: Record<string, number>;

  @ApiProperty({ 
    type: [CategoryScoreTuple],
    example: [
      { category: 'Investigative', score: 42 },
      { category: 'Social', score: 38 },
      { category: 'Realistic', score: 35 }
    ]
  })
  topCategories: [string, number][];

  @ApiProperty({ 
    example: 'ISR',
    description: 'Three-letter Holland personality code'
  })
  personalityCode: string;

  @ApiProperty({ 
    type: [String],
    example: ['Data Scientist', 'Medical Researcher', 'AI Researcher', 'Biomedical Engineer']
  })
  matchedCareers: string[];

  @ApiProperty({ example: 300 })
  completionTime: number;

  @ApiProperty({ 
    example: 'Your strongest areas are Investigative, Social, and Realistic. You enjoy solving problems, helping others, and working with practical solutions.',
    required: false
  })
  personalityDescription?: string;
}

export class SubmitAssessmentResponseDto {
  @ApiProperty({ type: AssessmentResultsDto })
  results: AssessmentResultsDto;

  @ApiProperty({ example: 'Assessment completed successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;
}

export class AssessmentStatusDto {
  @ApiProperty({ example: true })
  hasCompleted: boolean;

  @ApiProperty({ type: AssessmentResultsDto, required: false })
  results?: AssessmentResultsDto;

  @ApiProperty({ 
    example: '2025-09-28T12:30:45.123Z',
    required: false
  })
  completionDate?: string;

  @ApiProperty({ 
    example: 'Assessment found',
    required: false
  })
  message?: string;
}

export class CareerMatchDto {
  @ApiProperty({ 
    type: [String],
    example: ['Data Scientist', 'Medical Researcher', 'AI Researcher', 'Biomedical Engineer']
  })
  careers: string[];

  @ApiProperty({ example: 'IR' })
  personalityCode: string;

  @ApiProperty({ example: 'Career matches found successfully' })
  message: string;
}

export class PersonalityInsightDto {
  @ApiProperty({ example: 'ISR' })
  code: string;

  @ApiProperty({ example: 'Investigative-Social-Realistic' })
  fullName: string;

  @ApiProperty({ 
    example: 'You are analytical and curious, enjoy helping others, and prefer practical solutions to abstract theories.'
  })
  description: string;

  @ApiProperty({ 
    type: [String],
    example: ['Problem-solving', 'Research', 'Helping others', 'Practical work']
  })
  strengths: string[];

  @ApiProperty({ 
    type: [String],
    example: ['Healthcare', 'Research', 'Technology', 'Education']
  })
  preferredWorkEnvironments: string[];
}

// Validation DTOs for better error handling
export class QuestionAnswerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  @Max(60)
  questionId: number;

  @ApiProperty({ example: 2, description: 'Answer index from 0-4' })
  @IsNumber()
  @Min(0)
  @Max(4)
  answerIndex: number;
}

export class AssessmentProgressDto {
  @ApiProperty({ example: 45 })
  answeredQuestions: number;

  @ApiProperty({ example: 60 })
  totalQuestions: number;

  @ApiProperty({ example: 75 })
  progressPercentage: number;

  @ApiProperty({ example: 180 })
  timeElapsedSeconds: number;
}

// Error response DTOs
export class AssessmentErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Assessment validation failed' })
  message: string;

  @ApiProperty({ 
    type: [String],
    example: ['Question 5 answer is required', 'Invalid answer value for question 12'],
    required: false
  })
  errors?: string[];
}

// Statistics DTO for proper typing
export class AssessmentStatsDto {
  @ApiProperty({ example: 150 })
  totalAssessments: number;

  @ApiProperty({ 
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { 'RI': 25, 'IS': 30, 'AS': 20, 'SE': 15 }
  })
  assessmentsByCode: Record<string, number>;

  @ApiProperty({ example: 285 })
  averageCompletionTime: number;

  @ApiProperty({ example: 0.87 })
  completionRate: number;
}
