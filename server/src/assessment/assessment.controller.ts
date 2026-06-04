// server/src/assessment/assessment.controller.ts

import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AssessmentService } from './assessment.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@ApiTags('Assessment')
@Controller('assessment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  /** Get the latest assessment result for the current student */
  @Get('results')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get my latest RIASEC assessment result' })
  @ApiResponse({ status: 200, description: 'Assessment result or null' })
  async getResults(@Req() req: Request) {
    const user = req.user as any;
    return this.assessmentService.getResults(user.sub);
  }

  @Post('submit')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Submit Holland RIASEC assessment' })
  @ApiResponse({ status: 201, description: 'Assessment saved, RIASEC code and matched careers returned' })
  @ApiResponse({ status: 403, description: 'Only STUDENT role can submit assessments' })
  async submitAssessment(
    @Body() dto: SubmitAssessmentDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.assessmentService.submitAssessment(user.sub, dto);
  }
}
