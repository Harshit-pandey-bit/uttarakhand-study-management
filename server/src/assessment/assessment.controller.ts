// server/src/assessment/assessment.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssessmentService } from './assessment.service';
import {
  HollandQuestionsResponseDto,
  SubmitAssessmentDto,
  SubmitAssessmentResponseDto,
  AssessmentResultsDto,
  AssessmentStatusDto,
  CareerMatchDto,
  PersonalityInsightDto,
  AssessmentErrorDto,
  AssessmentStatsDto,
} from './dto/assessment.dto';

@ApiTags('Holland Code Assessment')
@Controller('assessment')
export class AssessmentController {
  private readonly logger = new Logger(AssessmentController.name);

  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('holland-questions')
  @ApiOperation({ 
    summary: 'Get Holland Code assessment questions',
    description: 'Retrieve all 60 RIASEC personality assessment questions with answer options'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Questions retrieved successfully', 
    type: HollandQuestionsResponseDto 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error',
    type: AssessmentErrorDto 
  })
  async getHollandQuestions(): Promise<HollandQuestionsResponseDto> {
    this.logger.log('Getting Holland Code assessment questions');
    
    try {
      const result = await this.assessmentService.getHollandQuestions();
      return {
        ...result,
        totalQuestions: result.questions.length,
        message: 'Successfully retrieved Holland Code assessment questions'
      };
    } catch (error) {
      this.logger.error('Failed to get Holland questions:', error.message);
      throw error;
    }
  }

  @Post('holland-submit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Submit Holland Code assessment',
    description: 'Submit completed Holland Code assessment answers and get personality results'
  })
  @ApiBody({ type: SubmitAssessmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Assessment submitted and processed successfully', 
    type: SubmitAssessmentResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    type: AssessmentErrorDto 
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async submitAssessment(
    @Body(ValidationPipe) submitData: SubmitAssessmentDto,
    @Request() req
  ): Promise<SubmitAssessmentResponseDto> {
    this.logger.log(`Processing Holland assessment for student: ${submitData.studentId}`);
    
    try {
      // Validate that user can only submit for themselves (unless admin/teacher)
      const currentUserId = req.user?.sub || req.user?.id;
      if (submitData.studentId !== currentUserId && req.user?.role !== 'teacher' && req.user?.role !== 'hei_mentor') {
        throw new BadRequestException('You can only submit assessment for yourself');
      }

      // Validate all 60 questions are answered
      const answerCount = Object.keys(submitData.answers).length;
      if (answerCount !== 60) {
        throw new BadRequestException(`All 60 questions must be answered. Received ${answerCount} answers.`);
      }

      // Validate answer values are in range 0-4
      for (const [questionId, answerValue] of Object.entries(submitData.answers)) {
        if (answerValue < 0 || answerValue > 4) {
          throw new BadRequestException(`Invalid answer value ${answerValue} for question ${questionId}. Must be 0-4.`);
        }
      }

      const results = await this.assessmentService.submitAssessment(submitData);
      
      return {
        results,
        message: 'Assessment completed successfully',
        success: true
      };
    } catch (error) {
      this.logger.error('Failed to submit assessment:', error.message);
      throw error;
    }
  }

  @Get('holland-results/:studentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get Holland Code assessment results',
    description: 'Retrieve stored assessment results for a specific student'
  })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Results retrieved successfully', 
    type: AssessmentStatusDto 
  })
  @ApiNotFoundResponse({ description: 'Assessment not found for this student' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getAssessmentResults(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req
  ): Promise<AssessmentStatusDto> {
    this.logger.log(`Getting assessment results for student: ${studentId}`);
    
    try {
      // Validate access permissions
      const currentUserId = req.user?.sub || req.user?.id;
      if (studentId !== currentUserId && req.user?.role !== 'teacher' && req.user?.role !== 'hei_mentor') {
        throw new BadRequestException('You can only view your own assessment results');
      }

      const result = await this.assessmentService.getAssessmentResults(studentId);
      
      return {
        ...result,
        message: result.hasCompleted ? 'Assessment found' : 'No assessment completed yet'
      };
    } catch (error) {
      this.logger.error('Failed to get assessment results:', error.message);
      throw error;
    }
  }

  @Get('my-results')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user assessment results',
    description: 'Retrieve assessment results for the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Results retrieved successfully', 
    type: AssessmentStatusDto 
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getMyAssessmentResults(@Request() req): Promise<AssessmentStatusDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting my assessment results for user: ${studentId}`);
    
    return this.getAssessmentResults(studentId, req);
  }

  @Get('career-matches/:personalityCode')
  @ApiOperation({ 
    summary: 'Get career matches for personality code',
    description: 'Find matching careers based on Holland personality code (e.g., RI, IS, etc.)'
  })
  @ApiParam({ 
    name: 'personalityCode', 
    type: 'string', 
    description: 'Holland personality code (2-3 characters: R, I, A, S, E, C)',
    example: 'RI'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Career matches retrieved successfully', 
    type: CareerMatchDto 
  })
  @ApiBadRequestResponse({ description: 'Invalid personality code format' })
  async getCareerMatches(
    @Param('personalityCode') personalityCode: string
  ): Promise<CareerMatchDto> {
    this.logger.log(`Finding career matches for personality code: ${personalityCode}`);
    
    try {
      // Validate personality code format
      const validCodes = ['R', 'I', 'A', 'S', 'E', 'C'];
      const codeChars = personalityCode.toUpperCase().split('');
      
      if (personalityCode.length < 1 || personalityCode.length > 3) {
        throw new BadRequestException('Personality code must be 1-3 characters long');
      }
      
      for (const char of codeChars) {
        if (!validCodes.includes(char)) {
          throw new BadRequestException(`Invalid character '${char}' in personality code. Valid: R,I,A,S,E,C`);
        }
      }

      const result = await this.assessmentService.getCareerMatches(personalityCode.toUpperCase());
      
      return {
        ...result,
        personalityCode: personalityCode.toUpperCase(),
        message: 'Career matches found successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get career matches:', error.message);
      throw error;
    }
  }

  @Get('personality-insight/:personalityCode')
  @ApiOperation({ 
    summary: 'Get detailed personality insights',
    description: 'Get comprehensive personality description and insights for a Holland code'
  })
  @ApiParam({ 
    name: 'personalityCode', 
    type: 'string', 
    description: 'Holland personality code',
    example: 'ISR'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Personality insights retrieved successfully', 
    type: PersonalityInsightDto 
  })
  async getPersonalityInsight(
    @Param('personalityCode') personalityCode: string
  ): Promise<PersonalityInsightDto> {
    this.logger.log(`Getting personality insight for code: ${personalityCode}`);
    
    try {
      const insight = await this.assessmentService.getPersonalityInsight(personalityCode.toUpperCase());
      return insight;
    } catch (error) {
      this.logger.error('Failed to get personality insight:', error.message);
      throw error;
    }
  }

  @Post('retake/:studentId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Allow student to retake assessment',
    description: 'Clear previous assessment results to allow retaking the test'
  })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Assessment cleared, student can retake',
    schema: { 
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Previous assessment cleared. You can now retake the test.' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async allowRetake(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Allowing assessment retake for student: ${studentId}`);
    
    try {
      // Validate access permissions
      const currentUserId = req.user?.sub || req.user?.id;
      if (studentId !== currentUserId && req.user?.role !== 'teacher' && req.user?.role !== 'hei_mentor') {
        throw new BadRequestException('You can only clear your own assessment');
      }

      await this.assessmentService.clearAssessmentResults(studentId);
      
      return {
        success: true,
        message: 'Previous assessment cleared. You can now retake the test.'
      };
    } catch (error) {
      this.logger.error('Failed to clear assessment:', error.message);
      throw error;
    }
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get assessment system statistics',
    description: 'Get overall statistics about assessments taken (admin/teacher only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    type: AssessmentStatsDto
  })
  async getAssessmentStats(@Request() req): Promise<AssessmentStatsDto> {
    this.logger.log('Getting assessment statistics');
    
    try {
      // Only allow teachers, mentors, and admins
      if (!['teacher', 'hei_mentor', 'hei_admin', 'school_admin'].includes(req.user?.role)) {
        throw new BadRequestException('Insufficient permissions to view statistics');
      }

      const stats = await this.assessmentService.getAssessmentStatistics();
      return stats;
    } catch (error) {
      this.logger.error('Failed to get assessment stats:', error.message);
      throw error;
    }
  }
}
