// server/src/auth/auth.controller.ts

import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RegistrationResponseDto,
  StudentRegisterDto,
  TeacherRegisterDto,
  HeiMentorRegisterDto,
  HeiAdminRegisterDto,
  SchoolAdminRegisterDto,
  CreateSchoolDto
} from './dto/auth.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/student')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully', type: RegistrationResponseDto })
  async registerStudent(@Body() registerDto: StudentRegisterDto): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('register/teacher')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher registered successfully', type: RegistrationResponseDto })
  async registerTeacher(@Body() registerDto: TeacherRegisterDto): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('register/hei-mentor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new HEI mentor' })
  @ApiResponse({ status: 201, description: 'HEI mentor registered successfully', type: RegistrationResponseDto })
  async registerHeiMentor(@Body() registerDto: HeiMentorRegisterDto): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('register/hei-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new HEI admin' })
  @ApiResponse({ status: 201, description: 'HEI admin registered successfully', type: RegistrationResponseDto })
  async registerHeiAdmin(@Body() registerDto: HeiAdminRegisterDto): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('register/school-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new school admin' })
  @ApiResponse({ status: 201, description: 'School admin registered successfully', type: RegistrationResponseDto })
  async registerSchoolAdmin(@Body() registerDto: SchoolAdminRegisterDto): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<AuthResponseDto, 'access_token' | 'refresh_token'>> {
    const data = await this.authService.login(loginDto);

    // ✅ FIXED: Set cookie with correct cross-domain settings
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('access_token', data.access_token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: isProduction, // Must be true in production (HTTPS only)
      sameSite: isProduction ? 'none' : 'lax', // ✅ 'none' allows cross-domain cookies
      path: '/', // Cookie available on all paths
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ FIXED: Return user data without tokens (tokens are in cookie)
    return {
      user: data.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({ passthrough: true }) response: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Clear the cookie
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return { message: 'Logout successful' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.id);
  }

  @Get('schools')
  @ApiOperation({ summary: 'Get all active schools' })
  @ApiResponse({ status: 200, description: 'Schools retrieved successfully' })
  async getSchools() {
    return this.authService.getSchools();
  }

  @Post('schools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return this.authService.createSchool(createSchoolDto);
  }

  @Get('heis')
  @ApiOperation({ summary: 'Get all active HEIs' })
  @ApiResponse({ status: 200, description: 'HEIs retrieved successfully' })
  async getHeis() {
    return this.authService.getHeis();
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Get available subjects' })
  @ApiResponse({ status: 200, description: 'Subjects retrieved successfully' })
  async getSubjects() {
    return this.authService.getSubjects();
  }

  @Get('career-suggestions')
  @ApiOperation({ summary: 'Get career suggestions' })
  @ApiResponse({ status: 200, description: 'Career suggestions retrieved successfully' })
  async getCareerSuggestions() {
    return this.authService.getCareerSuggestions();
  }
}
