// server/src/careers/careers.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CareerDto,
  FeaturedCareerDto,
  SuccessStoryDto,
  CareerPathwayDto,
  PathwayStageDto,
  AlternativeRouteDto,
  LocalOpportunityDto,
  InspirationalQuoteDto,
  CareerProgressDto,
  StudentActivityDto,
  DayInLifeDto,
  PathwayRouteDto,
  DemandLevel,
  DifficultyLevel,
} from './dto/careers.dto';

@Injectable()
export class CareersService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // =============================================
  // CAREER DISCOVERY ENDPOINTS
  // =============================================

  async getFeaturedCareers(limit: number = 6): Promise<FeaturedCareerDto[]> {
    console.log('⭐ Getting featured careers');

    try {
      const { data: careers, error } = await this.supabase
        .from('careers')
        .select('*')
        .eq('is_featured', true)
        .limit(limit);

      if (error) {
        throw new Error('Failed to fetch featured careers: ' + error.message);
      }

      const featuredCareers = careers?.map(career => ({
        title: career.title,
        description: career.description,
        icon: career.emoji,
        category: career.category,
        demandLevel: career.demand_level as DemandLevel,
        education: career.education_level,
        famousPersons: career.famous_persons || [],
        pathway: career.pathway,
        inspiringFact: career.inspiring_fact,
        skills: career.skills || []
      })) || [];

      console.log('✅ Retrieved', featuredCareers.length, 'featured careers');
      return featuredCareers;

    } catch (error) {
      console.log('❌ Error getting featured careers:', error.message);
      throw error;
    }
  }

  async searchCareers(
    query?: string,
    category?: string,
    demandLevel?: DemandLevel,
    hollandCodes?: string[],
    limit: number = 20,
    offset: number = 0
  ): Promise<{ careers: CareerDto[], total: number }> {
    console.log('🔍 Searching careers with filters');

    try {
      let dbQuery = this.supabase
        .from('careers')
        .select(`
          *,
          success_stories!left(
            id, person_name, location, background, journey, 
            inspiration, role_title, achievement, quote, is_featured
          )
        `);

      // Apply filters
      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`);
      }

      if (category) {
        dbQuery = dbQuery.eq('category', category);
      }

      if (demandLevel) {
        dbQuery = dbQuery.eq('demand_level', demandLevel);
      }

      if (hollandCodes && hollandCodes.length > 0) {
        dbQuery = dbQuery.overlaps('holland_codes', hollandCodes);
      }

      const { data: careers, error, count } = await dbQuery
        .range(offset, offset + limit - 1)
        .order('is_featured', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        throw new Error('Failed to search careers: ' + error.message);
      }

      const formattedCareers = careers?.map(career => this.formatCareerDto(career)) || [];

      console.log('✅ Found', formattedCareers.length, 'careers');
      return { careers: formattedCareers, total: count || 0 };

    } catch (error) {
      console.log('❌ Error searching careers:', error.message);
      throw error;
    }
  }

  async getCareerBySlug(slug: string, studentId?: string): Promise<CareerDto> {
    console.log('📖 Getting career details for slug:', slug);

    try {
      const { data: career, error } = await this.supabase
        .from('careers')
        .select(`
          *,
          success_stories!left(
            id, person_name, location, background, journey, 
            inspiration, role_title, achievement, quote, is_featured
          )
        `)
        .eq('slug', slug)
        .single();

      if (error || !career) {
        throw new NotFoundException('Career not found');
      }

      // Track activity if student is viewing
      if (studentId) {
        await this.trackStudentActivity(studentId, 'career_explored', slug);
      }

      const careerDto = this.formatCareerDto(career);

      console.log('✅ Retrieved career details for:', career.title);
      return careerDto;

    } catch (error) {
      console.log('❌ Error getting career details:', error.message);
      throw error;
    }
  }

  async getCareerPathway(careerSlug: string, studentId?: string): Promise<CareerPathwayDto> {
    console.log('🛣️ Getting career pathway for:', careerSlug);

    try {
      // Get career
      const { data: career } = await this.supabase
        .from('careers')
        .select('id, title, category')
        .eq('slug', careerSlug)
        .single();

      if (!career) {
        throw new NotFoundException('Career not found');
      }

      // Get pathway
      const { data: pathway } = await this.supabase
        .from('career_pathways')
        .select(`
          *,
          pathway_stages!left(
            id, stage_number, title, duration, description,
            requirements, key_subjects, examinations, skills_to_gain, next_options
          ),
          alternative_routes!left(
            id, route_name, description, duration, advantages, challenges
          )
        `)
        .eq('career_id', career.id)
        .single();

      // Get local opportunities
      const { data: opportunities } = await this.supabase
        .from('local_opportunities')
        .select('*')
        .eq('career_id', career.id)
        .eq('is_active', true);

      // Track activity
      if (studentId) {
        await this.trackStudentActivity(studentId, 'pathway_viewed', careerSlug);
      }

      const pathwayDto: CareerPathwayDto = {
        id: pathway?.id || '',
        careerTitle: career.title,
        category: career.category,
        estimatedDuration: pathway?.estimated_duration || '4-6 years',
        difficultyLevel: (pathway?.difficulty_level as DifficultyLevel) || DifficultyLevel.INTERMEDIATE,
        stages: this.formatPathwayStages(pathway?.pathway_stages || []),
        alternativeRoutes: this.formatAlternativeRoutes(pathway?.alternative_routes || []),
        localOpportunities: this.formatLocalOpportunities(opportunities || []),
        milestones: this.generatePathwayMilestones(career.title)
      };

      console.log('✅ Retrieved pathway for:', career.title);
      return pathwayDto;

    } catch (error) {
      console.log('❌ Error getting career pathway:', error.message);
      throw error;
    }
  }

  // =============================================
  // SUCCESS STORIES & INSPIRATION
  // =============================================

  async getSuccessStories(
    careerSlug?: string,
    featured: boolean = false,
    limit: number = 10
  ): Promise<SuccessStoryDto[]> {
    console.log('📚 Getting success stories');

    try {
      let query = this.supabase
        .from('success_stories')
        .select(`
          *,
          careers!inner(title, slug)
        `);

      if (careerSlug) {
        query = query.eq('careers.slug', careerSlug);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      const { data: stories, error } = await query
        .limit(limit)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch success stories: ' + error.message);
      }

      const formattedStories = stories?.map(story => ({
        id: story.id,
        name: story.person_name,
        location: story.location,
        background: story.background,
        journey: story.journey,
        inspiration: story.inspiration,
        currentRole: story.role_title,
        achievement: story.achievement,
        quote: story.quote
      })) || [];

      console.log('✅ Retrieved', formattedStories.length, 'success stories');
      return formattedStories;

    } catch (error) {
      console.log('❌ Error getting success stories:', error.message);
      throw error;
    }
  }

  async getInspirationalQuotes(category?: string, limit: number = 5): Promise<InspirationalQuoteDto[]> {
    console.log('💡 Getting inspirational quotes');

    try {
      let query = this.supabase
        .from('inspirational_quotes')
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data: quotes, error } = await query
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch quotes: ' + error.message);
      }

      const formattedQuotes = quotes?.map(quote => ({
        id: quote.id,
        text: quote.quote_text,
        author: quote.author,
        category: quote.category
      })) || [];

      console.log('✅ Retrieved', formattedQuotes.length, 'inspirational quotes');
      return formattedQuotes;

    } catch (error) {
      console.log('❌ Error getting quotes:', error.message);
      throw error;
    }
  }

  // =============================================
  // STUDENT PROGRESS & FAVORITES
  // =============================================

  async getStudentCareerProgress(studentId: string): Promise<CareerProgressDto> {
    console.log('📊 Getting career progress for student:', studentId);

    try {
      // Get Holland Code results
      const { data: hollandResults } = await this.supabase
        .from('holland_results')
        .select('*')
        .eq('student_id', studentId)
        .single();

      // Get or create progress record
      let { data: progress } = await this.supabase
        .from('student_career_progress')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (!progress) {
        // Create initial progress record
        const { data: newProgress } = await this.supabase
          .from('student_career_progress')
          .insert({ student_id: studentId })
          .select('*')
          .single();
        progress = newProgress;
      }

      // Get recommended careers from Holland results
      const recommendedCareers = hollandResults?.matched_careers || [];

      const progressDto: CareerProgressDto = {
        hollandCodeResults: {
          hasCompletedTest: !!hollandResults,
          recommendedCareers,
          personalityType: hollandResults?.personality_code,
          completionDate: hollandResults?.completed_at
        },
        progressStats: {
          assessmentCompleted: !!hollandResults,
          careersExplored: progress?.careers_explored || 0,
          pathwaysViewed: progress?.pathways_viewed || 0,
          totalProgress: progress?.total_progress || 0
        }
      };

      console.log('✅ Retrieved career progress');
      return progressDto;

    } catch (error) {
      console.log('❌ Error getting career progress:', error.message);
      throw error;
    }
  }

  async addToFavorites(studentId: string, careerSlug: string): Promise<{ success: boolean; message: string }> {
    console.log('⭐ Adding career to favorites:', careerSlug);

    try {
      // Get career ID
      const { data: career } = await this.supabase
        .from('careers')
        .select('id')
        .eq('slug', careerSlug)
        .single();

      if (!career) {
        throw new NotFoundException('Career not found');
      }

      // Add to favorites
      const { error } = await this.supabase
        .from('student_favorites')
        .insert({
          student_id: studentId,
          career_id: career.id
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new BadRequestException('Career already in favorites');
        }
        throw new Error('Failed to add to favorites: ' + error.message);
      }

      console.log('✅ Added to favorites successfully');
      return { success: true, message: 'Career added to favorites' };

    } catch (error) {
      console.log('❌ Error adding to favorites:', error.message);
      throw error;
    }
  }

  async removeFromFavorites(studentId: string, careerSlug: string): Promise<{ success: boolean; message: string }> {
    console.log('❌ Removing career from favorites:', careerSlug);

    try {
      // Get career ID
      const { data: career } = await this.supabase
        .from('careers')
        .select('id')
        .eq('slug', careerSlug)
        .single();

      if (!career) {
        throw new NotFoundException('Career not found');
      }

      // Remove from favorites
      const { error } = await this.supabase
        .from('student_favorites')
        .delete()
        .eq('student_id', studentId)
        .eq('career_id', career.id);

      if (error) {
        throw new Error('Failed to remove from favorites: ' + error.message);
      }

      console.log('✅ Removed from favorites successfully');
      return { success: true, message: 'Career removed from favorites' };

    } catch (error) {
      console.log('❌ Error removing from favorites:', error.message);
      throw error;
    }
  }

  async getStudentFavorites(studentId: string): Promise<CareerDto[]> {
    console.log('⭐ Getting student favorites');

    try {
      const { data: favorites, error } = await this.supabase
        .from('student_favorites')
        .select(`
          careers!inner(*)
        `)
        .eq('student_id', studentId);

      if (error) {
        throw new Error('Failed to fetch favorites: ' + error.message);
      }

      const favoriteCareers = favorites?.map(fav => this.formatCareerDto(fav.careers)) || [];

      console.log('✅ Retrieved', favoriteCareers.length, 'favorite careers');
      return favoriteCareers;

    } catch (error) {
      console.log('❌ Error getting favorites:', error.message);
      throw error;
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async getCareerCategories(): Promise<string[]> {
    console.log('📂 Getting career categories');

    try {
      const { data: categories, error } = await this.supabase
        .from('careers')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        throw new Error('Failed to fetch categories: ' + error.message);
      }

      const uniqueCategories = [...new Set(categories?.map(c => c.category))] as string[];

      console.log('✅ Retrieved', uniqueCategories.length, 'categories');
      return uniqueCategories;

    } catch (error) {
      console.log('❌ Error getting categories:', error.message);
      throw error;
    }
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private formatCareerDto(career: any): CareerDto {
    const successStories = career.success_stories?.map(story => ({
      id: story.id,
      name: story.person_name,
      location: story.location,
      background: story.background,
      journey: story.journey,
      inspiration: story.inspiration,
      currentRole: story.role_title,
      achievement: story.achievement,
      quote: story.quote
    })) || [];

    return {
      id: career.id,
      title: career.title,
      slug: career.slug,
      emoji: career.emoji,
      description: career.description,
      category: career.category,
      salaryRange: career.salary_range,
      demandLevel: career.demand_level,
      educationLevel: career.education_level,
      skills: career.skills || [],
      workEnvironment: career.work_environment,
      typicalDay: career.typical_day,
      pros: career.pros || [],
      cons: career.cons || [],
      famousPersons: career.famous_persons || [],
      pathway: career.pathway,
      inspiringFact: career.inspiring_fact,
      localConnection: career.local_connection,
      nextSteps: career.next_steps || [],
      successStories,
      dayInLife: this.generateDayInLife(career.typical_day),
      pathways: this.generatePathwayRoutes(career.pathway),
      isFeatured: career.is_featured
    };
  }

  private formatPathwayStages(stages: any[]): PathwayStageDto[] {
    return stages
      .sort((a, b) => a.stage_number - b.stage_number)
      .map(stage => ({
        id: stage.id,
        title: stage.title,
        duration: stage.duration,
        description: stage.description,
        requirements: stage.requirements || [],
        keySubjects: stage.key_subjects || [],
        examinations: stage.examinations || [],
        skillsToGain: stage.skills_to_gain || [],
        nextOptions: stage.next_options || []
      }));
  }

  private formatAlternativeRoutes(routes: any[]): AlternativeRouteDto[] {
    return routes.map(route => ({
      id: route.id,
      routeName: route.route_name,
      description: route.description,
      duration: route.duration,
      advantages: route.advantages || [],
      challenges: route.challenges || []
    }));
  }

  private formatLocalOpportunities(opportunities: any[]): LocalOpportunityDto[] {
    return opportunities.map(opp => ({
      type: opp.opportunity_type,
      institution: opp.institution,
      location: opp.location,
      programs: opp.programs || [],
      admissionCriteria: opp.admission_criteria,
      website: opp.website,
      contact: opp.contact
    }));
  }

  private generateDayInLife(typicalDay: string): DayInLifeDto {
    // Simple implementation - in production, this could be more sophisticated
    return {
      morning: 'Start day with planning and priority setting',
      afternoon: typicalDay || 'Core work activities and collaboration',
      evening: 'Wrap up tasks and prepare for next day',
      challenges: 'Managing deadlines and solving complex problems'
    };
  }

  private generatePathwayRoutes(pathway: string): PathwayRouteDto[] {
    if (!pathway) return [];

    const steps = pathway.split('→').map(step => step.trim());
    
    return [{
      route: 'Traditional Route',
      steps,
      duration: '4-6 years',
      difficulty: 'Intermediate'
    }];
  }

  private generatePathwayMilestones(careerTitle: string): any[] {
    // Generate default milestones - customize based on career
    return [
      {
        stage: 'Foundation',
        achievement: 'Complete basic education requirements',
        timeframe: '2 years',
        importance: 'Building blocks for career entry'
      },
      {
        stage: 'Specialization',
        achievement: 'Gain domain expertise and practical skills',
        timeframe: '2-4 years',
        importance: 'Core competency development'
      },
      {
        stage: 'Professional Entry',
        achievement: `Start career as ${careerTitle}`,
        timeframe: '1 year',
        importance: 'Real-world application of skills'
      }
    ];
  }

  private async trackStudentActivity(studentId: string, activityType: string, resourceId: string): Promise<void> {
    try {
      await this.supabase
        .from('student_activities')
        .insert({
          student_id: studentId,
          activity_type: activityType,
          resource_id: resourceId
        });

      // Update progress counters
      if (activityType === 'career_explored') {
        await this.supabase.rpc('increment_careers_explored', { student_id_param: studentId });
      } else if (activityType === 'pathway_viewed') {
        await this.supabase.rpc('increment_pathways_viewed', { student_id_param: studentId });
      }

    } catch (error) {
      // Log error but don't fail the main request
      console.log('Warning: Failed to track activity:', error.message);
    }
  }
}
