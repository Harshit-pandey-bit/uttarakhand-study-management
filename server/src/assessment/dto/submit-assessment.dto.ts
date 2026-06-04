// server/src/assessment/dto/submit-assessment.dto.ts

import {
  IsArray,
  ValidateNested,
  IsIn,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const VALID_DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

export class QuestionResponseDto {
  @ApiProperty({
    description: 'Holland dimension code',
    enum: VALID_DIMENSIONS,
    example: 'R',
  })
  @IsIn(VALID_DIMENSIONS)
  dimension: string;

  @ApiProperty({
    description: 'Score for this question (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}

export class SubmitAssessmentDto {
  @ApiProperty({
    description: 'Array of question responses with dimension and score',
    type: [QuestionResponseDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  responses: QuestionResponseDto[];
}
