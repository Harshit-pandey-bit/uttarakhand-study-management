// server/src/careers/careers.controller.ts

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CareersService } from './careers.service';
import {
  CareerDto,
  FeaturedCareerDto,
  SuccessStoryDto,
  CareerPathwayDto,
  InspirationalQuoteDto,
  CareerProgressDto,
  DemandLevel,
} from './dto/careers.dto';

@ApiTags('Career Explorer')
@Controller('careers')
export class CareersController {
  private readonly logger = new Logger(CareersController.name);

  constructor(private readonly careersService: CareersService) {}

  // =============================================
  // PUBLIC CAREER DISCOVERY ENDPOINTS
  // =============================================

  @Get('featured')
  @ApiOperation({
    summary: 'Get featured careers',
    description: 'Retrieve highlighted careers for the homepage and career explorer'
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 6 })
  @ApiResponse({
    status: 200,
    description: 'Featured careers retrieved successfully',
    type: [FeaturedCareerDto]
  })
  async getFeaturedCareers(@Query('limit') limit: number = 6): Promise<FeaturedCareerDto[]> {
    this.logger.log('Getting featured careers');
    return this.careersService.getFeaturedCareers(limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search and filter careers',
    description: 'Search careers with various filters including Holland codes, category, demand level'
  })
  @ApiQuery({ name: 'q', type: 'string', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', type: 'string', required: false, description: 'Career category' })
  @ApiQuery({ name: 'demand', enum: DemandLevel, required: false, description: 'Demand level' })
  @ApiQuery({ name: 'holland', type: [String], required: false, description: 'Holland personality codes' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiQuery({ name: 'offset', type: 'number', required: false, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'Careers found successfully',
    schema: {
      type: 'object',
      properties: {
        careers: { type: 'array', items: { $ref: '#/components/schemas/CareerDto' } },
        total: { type: 'number', example: 50 },
        hasMore: { type: 'boolean', example: true }
      }
    }
  })
  async searchCareers(
    @Query('q') query?: string,
    @Query('category') category?: string,
    @Query('demand') demandLevel?: DemandLevel,
    @Query('holland') hollandCodes?: string | string[],
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0
  ): Promise<{ careers: CareerDto[]; total: number; hasMore: boolean }> {
    this.logger.log(`Searching careers with query: ${query}`);

    // Handle holland codes as array
    const hollandCodesArray = Array.isArray(hollandCodes) ? hollandCodes : 
                            (hollandCodes ? [hollandCodes] : undefined);

    const result = await this.careersService.searchCareers(
      query, category, demandLevel, hollandCodesArray, limit, offset
    );

    return {
      careers: result.careers,
      total: result.total,
      hasMore: (offset + limit) < result.total
    };
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Get career categories',
    description: 'Retrieve all available career categories for filtering'
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string' },
          example: ['Technology', 'Healthcare', 'Education', 'Business', 'Arts']
        }
      }
    }
  })
  async getCareerCategories(): Promise<{ categories: string[] }> {
    this.logger.log('Getting career categories');
    const categories = await this.careersService.getCareerCategories();
    return { categories };
  }

  @Get('quotes')
  @ApiOperation({
    summary: 'Get inspirational quotes',
    description: 'Retrieve motivational quotes for career inspiration'
  })
  @ApiQuery({ name: 'category', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Inspirational quotes retrieved successfully',
    type: [InspirationalQuoteDto]
  })
  async getInspirationalQuotes(
    @Query('category') category?: string,
    @Query('limit') limit: number = 5
  ): Promise<InspirationalQuoteDto[]> {
    this.logger.log('Getting inspirational quotes');
    return this.careersService.getInspirationalQuotes(category, limit);
  }

  // =============================================
  // CAREER DETAILS ENDPOINTS
  // =============================================

  @Get(':slug')
  @ApiOperation({
    summary: 'Get career details',
    description: 'Get comprehensive information about a specific career'
  })
  @ApiParam({ name: 'slug', type: 'string', example: 'software-engineer' })
  @ApiResponse({
    status: 200,
    description: 'Career details retrieved successfully',
    type: CareerDto
  })
  @ApiNotFoundResponse({ description: 'Career not found' })
  async getCareerBySlug(
    @Param('slug') slug: string,
    @Request() req?
  ): Promise<CareerDto> {
    this.logger.log(`Getting career details for slug: ${slug}`);
    
    // If user is authenticated, track the activity
    const studentId = req?.user?.sub || req?.user?.id;
    
    return this.careersService.getCareerBySlug(slug, studentId);
  }

  @Get(':slug/pathway')
  @ApiOperation({
    summary: 'Get career pathway',
    description: 'Get detailed career pathway with stages, alternatives, and local opportunities'
  })
  @ApiParam({ name: 'slug', type: 'string', example: 'software-engineer' })
  @ApiResponse({
    status: 200,
    description: 'Career pathway retrieved successfully',
    type: CareerPathwayDto
  })
  @ApiNotFoundResponse({ description: 'Career or pathway not found' })
  async getCareerPathway(
    @Param('slug') slug: string,
    @Request() req?
  ): Promise<CareerPathwayDto> {
    this.logger.log(`Getting career pathway for: ${slug}`);
    
    const studentId = req?.user?.sub || req?.user?.id;
    
    return this.careersService.getCareerPathway(slug, studentId);
  }

  // =============================================
  // SUCCESS STORIES ENDPOINTS
  // =============================================

  @Get('stories/featured')
  @ApiOperation({
    summary: 'Get featured success stories',
    description: 'Retrieve inspiring success stories from various careers'
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Success stories retrieved successfully',
    type: [SuccessStoryDto]
  })
  async getFeaturedSuccessStories(
    @Query('limit') limit: number = 10
  ): Promise<SuccessStoryDto[]> {
    this.logger.log('Getting featured success stories');
    return this.careersService.getSuccessStories(undefined, true, limit);
  }

  @Get(':slug/stories')
  @ApiOperation({
    summary: 'Get career-specific success stories',
    description: 'Retrieve success stories for a specific career'
  })
  @ApiParam({ name: 'slug', type: 'string', example: 'software-engineer' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Career success stories retrieved successfully',
    type: [SuccessStoryDto]
  })
  async getCareerSuccessStories(
    @Param('slug') slug: string,
    @Query('limit') limit: number = 5
  ): Promise<SuccessStoryDto[]> {
    this.logger.log(`Getting success stories for career: ${slug}`);
    return this.careersService.getSuccessStories(slug, false, limit);
  }

  // =============================================
  // AUTHENTICATED USER ENDPOINTS
  // =============================================

  @Get('my/progress')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get personal career progress',
    description: 'Retrieve student career exploration progress and Holland test results'
  })
  @ApiResponse({
    status: 200,
    description: 'Career progress retrieved successfully',
    type: CareerProgressDto
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getMyCareerProgress(@Request() req): Promise<CareerProgressDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting career progress for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.careersService.getStudentCareerProgress(studentId);
  }

  @Get('my/favorites')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get favorite careers',
    description: 'Retrieve student favorite/bookmarked careers'
  })
  @ApiResponse({
    status: 200,
    description: 'Favorite careers retrieved successfully',
    type: [CareerDto]
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getMyFavorites(@Request() req): Promise<CareerDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting favorites for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.careersService.getStudentFavorites(studentId);
  }

  @Post(':slug/favorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add career to favorites',
    description: 'Bookmark a career for easy access later'
  })
  @ApiParam({ name: 'slug', type: 'string', example: 'software-engineer' })
  @ApiResponse({
    status: 200,
    description: 'Career added to favorites successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Career added to favorites' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async addToFavorites(
    @Param('slug') slug: string,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Adding career to favorites: ${slug} for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can add favorites');
    }

    return this.careersService.addToFavorites(studentId, slug);
  }

  @Delete(':slug/favorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove career from favorites',
    description: 'Remove a bookmarked career from favorites'
  })
  @ApiParam({ name: 'slug', type: 'string', example: 'software-engineer' })
  @ApiResponse({
    status: 200,
    description: 'Career removed from favorites successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Career removed from favorites' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async removeFromFavorites(
    @Param('slug') slug: string,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Removing career from favorites: ${slug} for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can manage favorites');
    }

    return this.careersService.removeFromFavorites(studentId, slug);
  }

  // =============================================
  // ANALYTICS ENDPOINTS (Optional)
  // =============================================

  @Get('analytics/popular')
  @ApiOperation({
    summary: 'Get popular careers',
    description: 'Get most viewed/explored careers (public analytics)'
  })
  @ApiResponse({
    status: 200,
    description: 'Popular careers retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        popularCareers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Software Engineer' },
              slug: { type: 'string', example: 'software-engineer' },
              viewCount: { type: 'number', example: 1250 },
              category: { type: 'string', example: 'Technology' }
            }
          }
        }
      }
    }
  })
  async getPopularCareers(): Promise<{ popularCareers: any[] }> {
    this.logger.log('Getting popular careers analytics');

    // Mock implementation - in production, implement real analytics
    const popularCareers = [
      { title: 'Software Engineer', slug: 'software-engineer', viewCount: 1250, category: 'Technology' },
      { title: 'Doctor', slug: 'doctor', viewCount: 980, category: 'Healthcare' },
      { title: 'Teacher', slug: 'teacher', viewCount: 750, category: 'Education' }
    ];

    return { popularCareers };
  }
}
