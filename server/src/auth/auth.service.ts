// server/src/auth/auth.service.ts

import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  LoginDto,
  RegisterDto,
  UserRole,
  AuthResponseDto,
  RegistrationResponseDto,
} from "./dto/auth.dto"

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private serviceSupabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Client for user operations
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_ANON_KEY')!,
    );

    // Service role client for admin operations
    this.serviceSupabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  async register(registerDto: RegisterDto): Promise<RegistrationResponseDto> {
    const { email, password, role, full_name, phone, ...profileData } = registerDto;

    try {
      // Validate role-specific required fields
      await this.validateRoleSpecificData(role, profileData);

      // Prepare metadata for database trigger
      const metadata = {
        role,
        full_name,
        phone,
        ...this.prepareProfileData(role, profileData),
      };

      // Create user in Supabase Auth (trigger will handle profile creation)
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new ConflictException('User with this email already exists');
        }
        throw new BadRequestException(error.message);
      }

      if (!data.user) {
        throw new BadRequestException('Registration failed');
      }

      return {
        message: 'Registration successful. Please check your email for verification.',
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: role,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Login failed');
      }

      // Get complete user profile
      const userProfile = await this.getUserProfile(data.user.id);

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: userProfile,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed: ' + error.message);
    }
  }

  async getUserProfile(userId: string) {
    try {
      // Get basic user info
      const { data: user, error: userError } = await this.serviceSupabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        throw new Error('User not found');
      }

      // Get role-specific profile
      let profile = null;
      const role = user.role;

      switch (role) {
        case UserRole.STUDENT:
          const { data: studentProfile } = await this.serviceSupabase
            .from('student_profiles')
            .select(`
              *, 
              schools:school_id (
                name, location, district, type
              )
            `)
            .eq('user_id', userId)
            .single();
          profile = studentProfile;
          break;

        case UserRole.TEACHER:
          const { data: teacherProfile } = await this.serviceSupabase
            .from('teacher_profiles')
            .select(`
              *, 
              schools:school_id (
                name, location, district, type, principal_name
              )
            `)
            .eq('user_id', userId)
            .single();
          profile = teacherProfile;
          break;

        case UserRole.HEI_MENTOR:
          const { data: mentorProfile } = await this.serviceSupabase
            .from('hei_mentor_profiles')
            .select(`
              *, 
              heis:hei_id (
                name, type, location, district
              )
            `)
            .eq('user_id', userId)
            .single();
          profile = mentorProfile;
          break;

        case UserRole.HEI_ADMIN:
          const { data: heiAdminProfile } = await this.serviceSupabase
            .from('hei_admin_profiles')
            .select(`
              *, 
              heis:hei_id (
                name, type, location, district
              )
            `)
            .eq('user_id', userId)
            .single();
          profile = heiAdminProfile;
          break;

        case UserRole.SCHOOL_ADMIN:
          const { data: schoolAdminProfile } = await this.serviceSupabase
            .from('school_admin_profiles')
            .select(`
              *, 
              schools:school_id (
                name, location, district, type
              )
            `)
            .eq('user_id', userId)
            .single();
          profile = schoolAdminProfile;
          break;
      }

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        onboarding_completed: user.onboarding_completed,
        created_at: user.created_at,
        profile,
      };
    } catch (error) {
      throw new Error('Failed to get user profile: ' + error.message);
    }
  }

  // Helper methods for dropdowns
  async getSchools() {
    try {
      const { data, error } = await this.serviceSupabase
        .from('schools')
        .select('id, name, location, district, type')
        .eq('is_active', true)
        .order('name');

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch schools: ' + error.message);
    }
  }

  async createSchool(data: {
    name: string;
    code: string;
    type?: string;
    location: string;
    district: string;
    principal_name?: string;
    total_students?: number;
  }) {
    try {
      // Check if school with same code already exists
      const { data: existingSchool } = await this.serviceSupabase
        .from('schools')
        .select('id')
        .eq('code', data.code)
        .single();

      if (existingSchool) {
        throw new BadRequestException('A school with this code already exists');
      }

      const { data: school, error } = await this.serviceSupabase
        .from('schools')
        .insert({
          name: data.name,
          code: data.code,
          type: data.type || 'Government',
          location: data.location,
          district: data.district,
          principal_name: data.principal_name || null,
          total_students: data.total_students || 0,
          is_active: true,
        })
        .select('id, name, location, district, type')
        .single();

      if (error) throw new Error(error.message);
      return school;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to create school: ' + error.message);
    }
  }

  async getHeis() {
    try {
      const { data, error } = await this.serviceSupabase
        .from('heis')
        .select('id, name, type, location, district')
        .eq('is_active', true)
        .order('name');

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch HEIs: ' + error.message);
    }
  }

  // Static data for dropdowns
  getSubjects() {
    return [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'English', 'Hindi', 'Social Science', 'Computer Science',
      'Economics', 'Political Science', 'History', 'Geography'
    ];
  }

  getCareerSuggestions() {
    return [
      'Astronaut', 'Doctor', 'Engineer', 'Scientist', 'Teacher',
      'AI Researcher', 'Data Scientist', 'Software Engineer',
      'Research Scientist', 'Space Engineer', 'Medical Researcher'
    ];
  }

  // Private helper methods
  private async validateRoleSpecificData(role: UserRole, data: any) {
    switch (role) {
      case UserRole.STUDENT:
      case UserRole.TEACHER:
      case UserRole.SCHOOL_ADMIN:
        if (!data.school_id) {
          throw new BadRequestException('school_id is required for this role');
        }
        // Validate school exists
        const { data: school } = await this.serviceSupabase
          .from('schools')
          .select('id')
          .eq('id', data.school_id)
          .single();
        if (!school) {
          throw new BadRequestException('Invalid school_id');
        }
        break;

      case UserRole.HEI_MENTOR:
      case UserRole.HEI_ADMIN:
        if (!data.hei_id) {
          throw new BadRequestException('hei_id is required for this role');
        }
        // Validate HEI exists
        const { data: hei } = await this.serviceSupabase
          .from('heis')
          .select('id')
          .eq('id', data.hei_id)
          .single();
        if (!hei) {
          throw new BadRequestException('Invalid hei_id');
        }
        break;
    }
  }

  private prepareProfileData(role: UserRole, data: any) {
    const prepared: any = {};

    switch (role) {
      case UserRole.STUDENT:
        prepared.school_id = data.school_id;
        prepared.class_level = data.class_level;
        prepared.career_aspiration = data.career_aspiration;
        prepared.parent_contact = data.parent_contact;
        prepared.address = data.address;
        break;

      case UserRole.TEACHER:
        prepared.school_id = data.school_id;
        prepared.employee_id = data.employee_id;
        prepared.subjects = Array.isArray(data.subjects)
          ? data.subjects.join(',')
          : data.subjects;
        prepared.classes = Array.isArray(data.classes)
          ? data.classes.join(',')
          : data.classes;
        prepared.qualification = data.qualification;
        prepared.experience_years = data.experience_years;
        prepared.joined_date = data.joined_date;
        break;

      case UserRole.HEI_MENTOR:
        prepared.hei_id = data.hei_id;
        prepared.employee_id = data.employee_id;
        prepared.designation = data.designation;
        prepared.department = data.department;
        prepared.expertise = Array.isArray(data.expertise)
          ? data.expertise.join(',')
          : data.expertise;
        prepared.qualification = data.qualification;
        prepared.experience_years = data.experience_years;
        prepared.research_interests = Array.isArray(data.research_interests)
          ? data.research_interests.join(',')
          : data.research_interests;
        prepared.max_students = data.max_students || 30;
        break;

      case UserRole.HEI_ADMIN:
        prepared.hei_id = data.hei_id;
        prepared.employee_id = data.employee_id;
        prepared.designation = data.designation;
        prepared.department = data.department;
        prepared.responsibilities = Array.isArray(data.responsibilities)
          ? data.responsibilities.join(',')
          : data.responsibilities;
        break;

      case UserRole.SCHOOL_ADMIN:
        prepared.school_id = data.school_id;
        prepared.employee_id = data.employee_id;
        prepared.designation = data.designation;
        prepared.responsibilities = Array.isArray(data.responsibilities)
          ? data.responsibilities.join(',')
          : data.responsibilities;
        break;
    }

    return prepared;
  }
}
