// server/src/assessment/assessment.service.ts

import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import {
  HollandDimension,
  DIMENSION_LABELS,
  getCareersForCode,
} from './riasec-career.map';

export interface DimensionScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Process a Holland RIASEC assessment:
   * 1. Aggregate scores per dimension
   * 2. Determine top 3 dimensions
   * 3. Map to careers
   * 4. Save to database
   */
  async submitAssessment(studentId: string, dto: SubmitAssessmentDto) {
    // 1. Aggregate scores
    const scores: DimensionScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    for (const response of dto.responses) {
      const dim = response.dimension as HollandDimension;
      if (scores[dim] !== undefined) {
        scores[dim] += response.score;
      }
    }

    // 2. Determine top 3 dimensions
    const sorted = (Object.entries(scores) as [HollandDimension, number][])
      .sort((a, b) => b[1] - a[1]);

    const top3: HollandDimension[] = sorted.slice(0, 3).map(([dim]) => dim);
    const riasecCode = top3.join('');

    this.logger.log(
      `Student ${studentId} RIASEC code: ${riasecCode} ` +
      `(${top3.map(d => DIMENSION_LABELS[d]).join(', ')})`,
    );

    // 3. Map to careers
    const matchedCareers = getCareersForCode(top3);

    // 4. Save to database via Supabase
    const { data: assessment, error } = await this.supabase.client
      .from('holland_assessments')
      .insert({
        student_id: studentId,
        r_score: scores.R,
        i_score: scores.I,
        a_score: scores.A,
        s_score: scores.S,
        e_score: scores.E,
        c_score: scores.C,
        top_careers: matchedCareers,
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to save assessment: ${error.message}`);
      throw new InternalServerErrorException('Failed to save assessment');
    }

    return {
      id: assessment.id,
      riasecCode,
      scores,
      topDimensions: top3.map(d => ({
        code: d,
        label: DIMENSION_LABELS[d],
        score: scores[d],
      })),
      matchedCareers,
      completedAt: assessment.completed_at,
    };
  }

  /** Get the latest assessment result for a student */
  async getResults(studentId: string) {
    const { data, error } = await this.supabase.client
      .from('holland_assessments')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null; // No assessment found
    }

    const scores: DimensionScores = {
      R: data.r_score, I: data.i_score, A: data.a_score,
      S: data.s_score, E: data.e_score, C: data.c_score,
    };

    const sorted = (Object.entries(scores) as [HollandDimension, number][])
      .sort((a, b) => b[1] - a[1]);

    const top3: HollandDimension[] = sorted.slice(0, 3).map(([dim]) => dim);

    return {
      id: data.id,
      riasecCode: top3.join(''),
      scores,
      topDimensions: top3.map(d => ({
        code: d,
        label: DIMENSION_LABELS[d],
        score: scores[d],
      })),
      matchedCareers: data.top_careers,
      completedAt: data.completed_at,
    };
  }
}
