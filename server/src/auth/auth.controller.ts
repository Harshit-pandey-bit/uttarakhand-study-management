// server/src/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { SupabaseService } from '../supabase/supabase.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

// ── DTOs ───────────────────────────────────────────────

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  full_name: string;

  @IsString()
  @IsIn(['STUDENT', 'TEACHER', 'HEI_MENTOR', 'SCHOOL_ADMIN', 'HEI_ADMIN'])
  role: string;

  @IsOptional()
  @IsString()
  school_id?: string;
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly anonClient: SupabaseClient;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    // Create a separate anon-key client for user auth (login/signup)
    // The service-role client can't do signInWithPassword properly
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY')!;
    this.anonClient = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /** Cookie options for the access_token */
  private getCookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour
    };
  }

  /**
   * Public health check — confirms the auth module is loaded.
   */
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Auth module health check' })
  @ApiResponse({ status: 200, description: 'Auth module is operational' })
  health() {
    return {
      status: 'ok',
      module: 'auth',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Register a new user via Supabase Auth.
   * Stores role and full_name in user_metadata.
   * Also creates a row in ext_users.
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Registration failed' })
  async register(@Body() dto: RegisterDto) {
    // 1. Sign up via Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.client.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true, // Auto-confirm for dev
        user_metadata: {
          full_name: dto.full_name,
          role: dto.role,
        },
      });

    if (authError) {
      throw new BadRequestException(authError.message);
    }

    // 2. Create ext_users row
    const { error: dbError } = await this.supabase.client
      .from('ext_users')
      .insert({
        id: authData.user.id,
        role: dto.role,
        full_name: dto.full_name,
        school_id: dto.school_id ?? null,
      });

    if (dbError) {
      // Auth user was created but ext_users insert failed — log but don't block
      console.error('Failed to create ext_users row:', dbError.message);
    }

    return {
      message: 'Registration successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: dto.role,
      },
    };
  }

  /**
   * Login via Supabase Auth.
   * Sets the access_token as an httpOnly cookie.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and receive httpOnly access_token cookie' })
  @ApiResponse({ status: 200, description: 'Login successful, cookie set' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, error } =
      await this.anonClient.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    // Set access_token as httpOnly cookie
    res.cookie('access_token', data.session.access_token, this.getCookieOptions());

    return {
      access_token: data.session.access_token,
      user: {
        sub: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
    };
  }

  /**
   * Logout — clears the httpOnly access_token cookie.
   */
  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear access_token cookie' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  /**
   * Protected route — returns the authenticated user's JWT payload.
   * Requires a valid `access_token` cookie.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile from JWT' })
  @ApiResponse({ status: 200, description: 'JWT payload of the authenticated user' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access_token cookie' })
  getProfile(@Req() req: Request) {
    return {
      user: req.user,
    };
  }
}
