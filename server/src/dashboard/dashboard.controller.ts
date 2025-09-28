// server/src/dashboard/dashboard.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
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
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import {
  StudentDashboardDto,
  NotificationDto,
  MentoringSessionDto,
  ProjectDto,
  TestDto,
  RecentActivityDto,
  CreateActivityDto,
  ProfileStatsDto,
  UpcomingSessionDto,
} from './dto/dashboard.dto';

// Define interfaces for return types
interface QuickAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl: string;
  icon: string;
}

interface SessionRegistrationsResponse {
  registered: MentoringSessionDto[];
  attended: MentoringSessionDto[];
  upcoming: MentoringSessionDto[];
}

interface WeeklyAnalyticsResponse {
  weeklyStats: {
    assignmentsCompleted: number;
    sessionsAttended: number;
    careersExplored: number;
    studyTimeHours: number;
    progressTrend: string;
  };
  weeklyGoals: {
    assignments: number;
    sessions: number;
    careers: number;
    studyTime: number;
  };
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

@ApiTags('Student Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  // =============================================
  // MAIN DASHBOARD ENDPOINT
  // =============================================

  @Get()
  @ApiOperation({
    summary: 'Get student dashboard data',
    description: 'Retrieve comprehensive dashboard information including stats, activities, and upcoming sessions'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: StudentDashboardDto
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getStudentDashboard(@Request() req): Promise<StudentDashboardDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting dashboard data for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getStudentDashboard(studentId);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get student profile statistics',
    description: 'Get detailed statistics about assignments, tests, sessions, and career progress'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile statistics retrieved successfully',
    type: ProfileStatsDto
  })
  async getProfileStats(@Request() req): Promise<ProfileStatsDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting profile stats for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getProfileStats(studentId);
  }

  // =============================================
  // ACTIVITIES & TIMELINE
  // =============================================

  @Get('activities')
  @ApiOperation({
    summary: 'Get recent activities',
    description: 'Retrieve recent student activities including assignments, sessions, and achievements'
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    type: [RecentActivityDto]
  })
  async getRecentActivities(
    @Request() req,
    @Query('limit') limit: number = 20
  ): Promise<RecentActivityDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting recent activities for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getRecentActivities(studentId, limit);
  }

  @Post('activities')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add new activity',
    description: 'Log a new activity for the student (used by system or manual entry)'
  })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Activity added successfully',
    type: RecentActivityDto
  })
  @ApiBadRequestResponse({ description: 'Invalid activity data' })
  async addActivity(
    @Body(ValidationPipe) activityData: CreateActivityDto,
    @Request() req
  ): Promise<RecentActivityDto> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Adding activity for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.addActivity(studentId, activityData);
  }

  // =============================================
  // MENTORING SESSIONS
  // =============================================

  @Get('sessions/upcoming')
  @ApiOperation({
    summary: 'Get upcoming sessions',
    description: 'Retrieve upcoming mentoring sessions relevant to the student'
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Upcoming sessions retrieved successfully',
    type: [UpcomingSessionDto]
  })
  async getUpcomingSessions(
    @Request() req,
    @Query('limit') limit: number = 5
  ): Promise<UpcomingSessionDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting upcoming sessions for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getUpcomingSessions(studentId, limit);
  }

  @Get('sessions/all')
  @ApiOperation({
    summary: 'Get all available mentoring sessions',
    description: 'Retrieve all scheduled mentoring sessions for registration'
  })
  @ApiResponse({
    status: 200,
    description: 'All mentoring sessions retrieved successfully',
    type: [MentoringSessionDto]
  })
  async getAllMentoringSessions(@Request() req): Promise<MentoringSessionDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting all mentoring sessions for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getAllMentoringSessions(studentId);
  }

  @Post('sessions/:sessionId/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register for mentoring session',
    description: 'Register student for a specific mentoring session'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session UUID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully registered for session',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully registered for session' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Session full or already registered' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async registerForSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Registering student ${studentId} for session: ${sessionId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('Only students can register for sessions');
    }

    return this.dashboardService.registerForSession(studentId, sessionId);
  }

  @Get('sessions/my-registrations')
  @ApiOperation({
    summary: 'Get my session registrations',
    description: 'Retrieve all sessions the student has registered for'
  })
  @ApiResponse({
    status: 200,
    description: 'Session registrations retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        registered: {
          type: 'array',
          items: { $ref: '#/components/schemas/MentoringSessionDto' }
        },
        attended: {
          type: 'array',
          items: { $ref: '#/components/schemas/MentoringSessionDto' }
        },
        upcoming: {
          type: 'array',
          items: { $ref: '#/components/schemas/MentoringSessionDto' }
        }
      }
    }
  })
  async getMySessionRegistrations(@Request() req): Promise<SessionRegistrationsResponse> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting session registrations for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Use real service method instead of mock
    const allSessions = await this.dashboardService.getAllMentoringSessions(studentId);
    const registeredSessions = allSessions.filter(session => session.isRegistered);

    return {
      registered: registeredSessions,
      attended: registeredSessions.filter(session => session.status === 'completed'),
      upcoming: registeredSessions.filter(session => session.status === 'scheduled')
    };
  }

  // =============================================
  // NOTIFICATIONS
  // =============================================

  @Get('notifications')
  @ApiOperation({
    summary: 'Get student notifications',
    description: 'Retrieve notifications for assignments, tests, sessions, and announcements'
  })
  @ApiQuery({ name: 'unreadOnly', type: 'boolean', required: false, example: false })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: [NotificationDto]
  })
  async getNotifications(
    @Request() req,
    @Query('unreadOnly') unreadOnly: boolean = false
  ): Promise<NotificationDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting notifications for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getNotifications(studentId, unreadOnly);
  }

  @Put('notifications/:notificationId/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Mark a specific notification as read'
  })
  @ApiParam({ name: 'notificationId', type: 'string', description: 'Notification UUID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  async markNotificationAsRead(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
    @Request() req
  ): Promise<{ success: boolean }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Marking notification as read: ${notificationId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.markNotificationAsRead(notificationId);
  }

  @Get('notifications/unread-count')
  @ApiOperation({
    summary: 'Get unread notification count',
    description: 'Get the count of unread notifications for badge display'
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        unreadCount: { type: 'number', example: 3 }
      }
    }
  })
  async getUnreadNotificationCount(@Request() req): Promise<{ unreadCount: number }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting unread notification count for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    const unreadNotifications = await this.dashboardService.getNotifications(studentId, true);
    return { unreadCount: unreadNotifications.length };
  }

  // =============================================
  // PROJECTS & PORTFOLIO
  // =============================================

  @Get('projects')
  @ApiOperation({
    summary: 'Get student projects',
    description: 'Retrieve all projects created by the student'
  })
  @ApiResponse({
    status: 200,
    description: 'Student projects retrieved successfully',
    type: [ProjectDto]
  })
  async getStudentProjects(@Request() req): Promise<ProjectDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting projects for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getStudentProjects(studentId);
  }

  // =============================================
  // TESTS & ASSESSMENTS
  // =============================================

  @Get('tests/upcoming')
  @ApiOperation({
    summary: 'Get upcoming tests',
    description: 'Retrieve upcoming tests and exams for the student class'
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming tests retrieved successfully',
    type: [TestDto]
  })
  async getUpcomingTests(@Request() req): Promise<TestDto[]> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting upcoming tests for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    return this.dashboardService.getUpcomingTests(studentId);
  }

  // =============================================
  // QUICK ACTIONS - UPDATED TO USE SERVICE
  // =============================================

  @Get('quick-actions')
  @ApiOperation({
    summary: 'Get quick actions',
    description: 'Get personalized quick actions for the student dashboard based on real data'
  })
  @ApiResponse({
    status: 200,
    description: 'Quick actions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'complete-holland-test' },
              title: { type: 'string', example: 'Complete Holland Code Test' },
              description: { type: 'string', example: 'Discover your career personality type' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'], example: 'high' },
              actionUrl: { type: 'string', example: '/assessment/holland-test' },
              icon: { type: 'string', example: '🧠' }
            }
          }
        }
      }
    }
  })
  async getQuickActions(@Request() req): Promise<{ actions: QuickAction[] }> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting quick actions for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Get real quick actions from dashboard data - now using real service method
    const dashboardData = await this.dashboardService.getStudentDashboard(studentId);
    const basicActions = dashboardData.quickActions;

    const enhancedActions: QuickAction[] = basicActions.map((action, index) => {
      const actionMappings: Record<string, QuickAction> = {
        'Complete Holland Code personality test': {
          id: 'complete-holland-test',
          title: 'Complete Holland Code Test',
          description: 'Discover your career personality type',
          priority: 'high',
          actionUrl: '/assessment/holland-test',
          icon: '🧠'
        },
        'Submit pending assignments': {
          id: 'submit-assignments',
          title: 'Submit Pending Assignments',
          description: 'Complete and submit your assignments',
          priority: 'medium',
          actionUrl: '/assignments/my-assignments',
          icon: '📝'
        },
        'Register for upcoming mentoring sessions': {
          id: 'register-sessions',
          title: 'Register for Sessions',
          description: 'Join upcoming mentoring sessions',
          priority: 'medium',
          actionUrl: '/dashboard/sessions/all',
          icon: '👨‍🏫'
        },
        'Check important notifications': {
          id: 'check-notifications',
          title: 'Check Notifications',
          description: 'Review your important notifications',
          priority: 'medium',
          actionUrl: '/dashboard/notifications',
          icon: '🔔'
        },
        'Complete your profile setup': {
          id: 'complete-profile',
          title: 'Complete Profile',
          description: 'Finish setting up your student profile',
          priority: 'high',
          actionUrl: '/profile/edit',
          icon: '👤'
        }
      };

      return actionMappings[action] || {
        id: `action-${index}`,
        title: action,
        description: 'Complete this important task',
        priority: 'low',
        actionUrl: '/dashboard',
        icon: '⚡'
      };
    });

    return { actions: enhancedActions };
  }

  // =============================================
  // ANALYTICS & INSIGHTS - UPDATED TO USE SERVICE
  // =============================================

  @Get('analytics/weekly')
  @ApiOperation({
    summary: 'Get weekly analytics',
    description: 'Get weekly activity and progress analytics from real database data'
  })
  @ApiResponse({
    status: 200,
    description: 'Weekly analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        weeklyStats: {
          type: 'object',
          properties: {
            assignmentsCompleted: { type: 'number', example: 3 },
            sessionsAttended: { type: 'number', example: 2 },
            careersExplored: { type: 'number', example: 5 },
            studyTimeHours: { type: 'number', example: 12.5 },
            progressTrend: { type: 'string', example: 'up' }
          }
        },
        weeklyGoals: {
          type: 'object',
          properties: {
            assignments: { type: 'number', example: 5 },
            sessions: { type: 'number', example: 3 },
            careers: { type: 'number', example: 10 },
            studyTime: { type: 'number', example: 15 }
          }
        },
        achievements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              icon: { type: 'string' }
            }
          }
        }
      }
    }
  })
  async getWeeklyAnalytics(@Request() req): Promise<WeeklyAnalyticsResponse> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting real weekly analytics for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Now uses real database queries instead of mock data
    return this.dashboardService.getWeeklyAnalytics(studentId);
  }

  // =============================================
  // PROFILE MANAGEMENT - UPDATED TO USE SERVICE
  // =============================================

  @Get('profile/overview')
  @ApiOperation({
    summary: 'Get profile overview',
    description: 'Get comprehensive student profile overview with real academic data'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile overview retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        basicInfo: { $ref: '#/components/schemas/StudentBasicInfoDto' },
        academicStats: {
          type: 'object',
          properties: {
            currentGPA: { type: 'number', example: 8.5 },
            rank: { type: 'number', example: 15 },
            totalStudents: { type: 'number', example: 120 },
            subjects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Mathematics' },
                  grade: { type: 'string', example: 'A+' },
                  score: { type: 'number', example: 92 }
                }
              }
            }
          }
        },
        careerProgress: {
          type: 'object',
          properties: {
            testCompleted: { type: 'boolean', example: true },
            personalityType: { type: 'string', example: 'ISE' },
            careersExplored: { type: 'number', example: 12 },
            favoriteCareers: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
  async getProfileOverview(@Request() req): Promise<any> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting real profile overview for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Now uses real database queries instead of mock data
    return this.dashboardService.getProfileOverview(studentId);
  }

  // =============================================
  // ADDITIONAL REAL-TIME ENDPOINTS
  // =============================================

  @Get('summary/today')
  @ApiOperation({
    summary: 'Get today summary',
    description: 'Get summary of today activities and tasks'
  })
  @ApiResponse({
    status: 200,
    description: 'Today summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        todayActivities: { type: 'number' },
        upcomingDeadlines: { type: 'number' },
        sessionsToday: { type: 'number' },
        studyTimeToday: { type: 'number' },
        motivationalQuote: { type: 'string' }
      }
    }
  })
  async getTodaySummary(@Request() req): Promise<any> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting today summary for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's activities
    const recentActivities = await this.dashboardService.getRecentActivities(studentId, 50);
    const todayActivities = recentActivities.filter(activity => 
      activity.date.startsWith(today)
    ).length;

    // Get upcoming sessions today
    const upcomingSessions = await this.dashboardService.getUpcomingSessions(studentId, 20);
    const sessionsToday = upcomingSessions.filter(session => session.date === today).length;

    // Get assignments due soon (next 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const upcomingTests = await this.dashboardService.getUpcomingTests(studentId);
    const upcomingDeadlines = upcomingTests.filter(test => {
      const testDate = new Date(test.testDate);
      return testDate <= threeDaysFromNow;
    }).length;

    // Calculate study time from today's activities
    const studyTimeToday = recentActivities
      .filter(activity => activity.date.startsWith(today))
      .reduce((total, activity) => {
        const metadata = activity.metadata as any;
        return total + (metadata?.studyTimeMinutes || 0);
      }, 0) / 60;

    // Motivational quotes array
    const quotes = [
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "Your limitation—it's only your imagination.",
      "Dream it. Believe it. Achieve it.",
      "Great things never come from comfort zones."
    ];

    return {
      todayActivities,
      upcomingDeadlines,
      sessionsToday,
      studyTimeToday: Math.round(studyTimeToday * 10) / 10,
      motivationalQuote: quotes[Math.floor(Math.random() * quotes.length)]
    };
  }

  @Get('achievements/recent')
  @ApiOperation({
    summary: 'Get recent achievements',
    description: 'Get recent student achievements and milestones'
  })
  @ApiResponse({
    status: 200,
    description: 'Recent achievements retrieved successfully'
  })
  async getRecentAchievements(@Request() req): Promise<any> {
    const studentId = req.user?.sub || req.user?.id;
    this.logger.log(`Getting recent achievements for student: ${studentId}`);

    if (req.user?.role !== 'student') {
      throw new BadRequestException('This endpoint is only for students');
    }

    // Get weekly analytics to determine achievements
    const weeklyAnalytics = await this.dashboardService.getWeeklyAnalytics(studentId);
    const profileStats = await this.dashboardService.getProfileStats(studentId);

    const achievements = [
      ...weeklyAnalytics.achievements,
      // Add milestone achievements
      ...(profileStats.completedAssignments >= 10 ? [{
        title: 'Assignment Master',
        description: `Completed ${profileStats.completedAssignments} assignments!`,
        icon: '🎯',
        type: 'milestone'
      }] : []),
      ...(profileStats.averageScore >= 85 ? [{
        title: 'High Achiever',
        description: `Maintaining ${profileStats.averageScore}% average score`,
        icon: '🏆',
        type: 'academic'
      }] : []),
      ...(profileStats.careerExplorationProgress >= 50 ? [{
        title: 'Career Explorer',
        description: `${profileStats.careerExplorationProgress}% career exploration completed`,
        icon: '🚀',
        type: 'career'
      }] : [])
    ];

    return {
      achievements: achievements.slice(0, 5), // Return top 5 achievements
      totalAchievements: achievements.length
    };
  }
}
