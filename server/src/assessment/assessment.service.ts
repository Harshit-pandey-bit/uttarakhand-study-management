// server/src/assessment/assessment.service.ts - Fixed TypeScript errors

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  HollandQuestionsResponseDto,
  SubmitAssessmentDto,
  AssessmentResultsDto,
  AssessmentStatusDto,
  CareerMatchDto,
  PersonalityInsightDto,
  AssessmentStatsDto,
} from './dto/assessment.dto';

@Injectable()
export class AssessmentService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  async getHollandQuestions(): Promise<{ questions: any[] }> {
    console.log('📝 Getting Holland Code questions...');

    try {
      const { data: questions, error } = await this.supabase
        .from('holland_questions')
        .select('*')
        .order('id');

      if (error) {
        throw new Error('Failed to fetch questions: ' + error.message);
      }

      const formattedQuestions = questions?.map(q => ({
        id: q.id,
        text: q.text,
        category: q.category,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options) // Handle both JSONB and string
      })) || [];

      console.log('✅ Retrieved', formattedQuestions.length, 'questions');
      return { questions: formattedQuestions };

    } catch (error) {
      console.log('❌ Error fetching questions:', error.message);
      throw error;
    }
  }

  async submitAssessment(submitData: SubmitAssessmentDto): Promise<AssessmentResultsDto> {
    console.log('📊 Processing Holland Code assessment for student:', submitData.studentId);

    try {
      // Calculate scores for each category
      const scores = await this.calculateScores(submitData.answers);
      
      // Determine personality code and top categories
      const topCategories = this.getTopCategories(scores);
      const personalityCode = this.generatePersonalityCode(topCategories);
      
      // Find matching careers using your career_matches table
      const matchedCareers = await this.findMatchingCareers(personalityCode);
      
      // Calculate completion time (you can implement actual timing later)
      const completionTime = submitData.completionTime || 300; // 5 minutes default

      const results: AssessmentResultsDto = {
        scores,
        topCategories,
        personalityCode,
        matchedCareers,
        completionTime,
      };

      // Save results to database
      await this.saveResults(submitData.studentId, results);

      console.log('✅ Assessment completed for student:', submitData.studentId);
      return results;

    } catch (error) {
      console.log('❌ Error processing assessment:', error.message);
      throw error;
    }
  }

  async getAssessmentResults(studentId: string): Promise<AssessmentStatusDto> {
    console.log('🔍 Getting assessment results for student:', studentId);

    try {
      const { data: result, error } = await this.supabase
        .from('holland_results')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw new Error('Failed to fetch results: ' + error.message);
      }

      if (!result) {
        return { hasCompleted: false };
      }

      // Fix the topCategories mapping
      const scoreEntries = Object.entries(result.scores);
      const topCategoriesWithScores = result.top_categories?.map((category: string, index: number) => {
        const scoreEntry = scoreEntries.find(([key]) => key === category);
        const score = scoreEntry ? scoreEntry[1] : 0;
        return [category, score] as [string, number];
      }) || [];

      return {
        hasCompleted: true,
        results: {
          scores: result.scores,
          topCategories: topCategoriesWithScores,
          personalityCode: result.personality_code,
          matchedCareers: result.matched_careers,
          completionTime: result.completion_time,
        },
        completionDate: result.completed_at,
      };

    } catch (error) {
      console.log('❌ Error fetching assessment results:', error.message);
      throw error;
    }
  }

  async getCareerMatches(personalityCode: string): Promise<{ careers: string[] }> {
    console.log('🎯 Finding career matches for code:', personalityCode);

    try {
      // Get the first two characters for primary matching
      const primaryCode = personalityCode.substring(0, 2);
      
      const { data: matches, error } = await this.supabase
        .from('career_matches')
        .select('careers')
        .eq('personality_code', primaryCode)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to find career matches: ' + error.message);
      }

      let careers: string[] = [];
      
      if (matches && matches.careers) {
        // Parse the JSON array from your database
        careers = Array.isArray(matches.careers) ? matches.careers : JSON.parse(matches.careers);
      } else {
        // Fallback careers
        careers = ['Software Engineer', 'Teacher', 'Doctor', 'Engineer'];
      }

      console.log('✅ Found', careers.length, 'career matches');
      return { careers };

    } catch (error) {
      console.log('❌ Error finding career matches:', error.message);
      throw error;
    }
  }

  // ADD MISSING METHODS FROM CONTROLLER

  async getPersonalityInsight(personalityCode: string): Promise<PersonalityInsightDto> {
    const insights: Record<string, { name: string; description: string; strengths: string[]; environments: string[] }> = {
      'R': { name: 'Realistic', description: 'Practical, hands-on, mechanical', strengths: ['Problem-solving', 'Building', 'Technical skills'], environments: ['Workshop', 'Outdoors', 'Laboratory'] },
      'I': { name: 'Investigative', description: 'Analytical, scientific, curious', strengths: ['Research', 'Analysis', 'Critical thinking'], environments: ['Laboratory', 'Library', 'Research facility'] },
      'A': { name: 'Artistic', description: 'Creative, expressive, imaginative', strengths: ['Creativity', 'Innovation', 'Self-expression'], environments: ['Studio', 'Theater', 'Gallery'] },
      'S': { name: 'Social', description: 'Helpful, caring, teaching', strengths: ['Communication', 'Empathy', 'Teamwork'], environments: ['School', 'Hospital', 'Community center'] },
      'E': { name: 'Enterprising', description: 'Leadership, business, persuasive', strengths: ['Leadership', 'Negotiation', 'Management'], environments: ['Office', 'Boardroom', 'Sales floor'] },
      'C': { name: 'Conventional', description: 'Organized, detailed, systematic', strengths: ['Organization', 'Attention to detail', 'Data management'], environments: ['Office', 'Bank', 'Government'] }
    };

    const primaryCode = personalityCode.charAt(0);
    const primary = insights[primaryCode];
    
    if (!primary) {
      throw new Error('Invalid personality code');
    }

    const fullName = personalityCode.split('').map(code => insights[code]?.name).filter(Boolean).join('-');
    
    return {
      code: personalityCode,
      fullName,
      description: `You are ${primary.description} and enjoy ${primary.strengths.join(', ').toLowerCase()}.`,
      strengths: primary.strengths,
      preferredWorkEnvironments: primary.environments
    };
  }

  async clearAssessmentResults(studentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('holland_results')
      .delete()
      .eq('student_id', studentId);

    if (error) {
      throw new Error('Failed to clear assessment results: ' + error.message);
    }
  }

  async getAssessmentStatistics(): Promise<AssessmentStatsDto> {
    const { data: results } = await this.supabase
      .from('holland_results')
      .select('personality_code, completion_time');

    if (!results) {
      return { 
        totalAssessments: 0, 
        assessmentsByCode: {}, 
        averageCompletionTime: 0, 
        completionRate: 1.0 
      };
    }

    const assessmentsByCode: Record<string, number> = {};
    
    // Calculate statistics
    results.forEach(result => {
      const code = result.personality_code.substring(0, 2);
      assessmentsByCode[code] = (assessmentsByCode[code] || 0) + 1;
    });

    const totalTime = results.reduce((sum, r) => sum + (r.completion_time || 0), 0);
    const averageCompletionTime = results.length > 0 ? Math.round(totalTime / results.length) : 0;

    return {
      totalAssessments: results.length,
      assessmentsByCode,
      averageCompletionTime,
      completionRate: 1.0 // You can calculate this based on your requirements
    };
  }

  // PRIVATE HELPER METHODS

  private async calculateScores(answers: { [questionId: string]: number }): Promise<Record<string, number>> {
    // Get question categories from your database
    const { data: questions } = await this.supabase
      .from('holland_questions')
      .select('id, category');

    const categoryScores: Record<string, number> = {
      'Realistic': 0,
      'Investigative': 0,
      'Artistic': 0,
      'Social': 0,
      'Enterprising': 0,
      'Conventional': 0,
    };

    // Calculate scores based on answers 
    // Note: Your scale is "Strongly Agree" (index 0) to "Strongly Disagree" (index 4)
    for (const [questionId, answerIndex] of Object.entries(answers)) {
      const question = questions?.find(q => q.id === parseInt(questionId));
      if (question) {
        // Convert answer index to score (Strongly Agree = 5, Strongly Disagree = 1)
        const score = 5 - answerIndex; // Reverse the scale so higher is better (0->5, 1->4, 2->3, 3->2, 4->1)
        categoryScores[question.category] += score;
      }
    }

    return categoryScores;
  }

  private getTopCategories(scores: Record<string, number>): [string, number][] {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3) as [string, number][];
  }

  private generatePersonalityCode(topCategories: [string, number][]): string {
    const codeMap: Record<string, string> = {
      'Realistic': 'R',
      'Investigative': 'I', 
      'Artistic': 'A',
      'Social': 'S',
      'Enterprising': 'E',
      'Conventional': 'C',
    };

    return topCategories
      .map(([category]) => codeMap[category])
      .join('');
  }

  private async findMatchingCareers(personalityCode: string): Promise<string[]> {
    // Try to find exact match first
    const primaryCode = personalityCode.substring(0, 2);
    
    const { data: matches } = await this.supabase
      .from('career_matches')
      .select('careers')
      .eq('personality_code', primaryCode);

    if (matches && matches.length > 0) {
      const careersData = matches[0].careers;
      const careers = Array.isArray(careersData) ? careersData : JSON.parse(careersData);
      return careers;
    }

    // Fallback to default careers
    return ['Software Engineer', 'Teacher', 'Doctor', 'Engineer'];
  }

  private async saveResults(studentId: string, results: AssessmentResultsDto): Promise<void> {
    const { error } = await this.supabase
      .from('holland_results')
      .upsert({
        student_id: studentId,
        scores: results.scores,
        personality_code: results.personalityCode,
        top_categories: results.topCategories.map(([category]) => category),
        matched_careers: results.matchedCareers,
        completion_time: results.completionTime,
      });

    if (error) {
      throw new Error('Failed to save results: ' + error.message);
    }
  }
}
