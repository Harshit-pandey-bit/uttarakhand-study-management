// server/src/auth/auth.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsUUID,
  IsDateString,
} from 'class-validator';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  HEI_MENTOR = 'hei_mentor',
  HEI_ADMIN = 'hei_admin',
  SCHOOL_ADMIN = 'school_admin',
}

// Common login DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// Base registration DTO with common fields
export class BaseRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole;
}

// Student Registration
export class StudentRegisterDto extends BaseRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  class_level: string; // '6th', '7th', '8th', etc.

  @IsString()
  @IsOptional()
  career_aspiration?: string;

  @IsString()
  @IsOptional()
  parent_contact?: string;

  @IsString()
  @IsOptional()
  address?: string;

  role: UserRole.STUDENT = UserRole.STUDENT;
}

// Teacher Registration
export class TeacherRegisterDto extends BaseRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  subjects: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  classes?: string[];

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsNumber()
  @Min(0)
  experience_years: number;

  @IsDateString()
  @IsOptional()
  joined_date?: string;

  role: UserRole.TEACHER = UserRole.TEACHER;
}

// HEI Mentor Registration
export class HeiMentorRegisterDto extends BaseRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  hei_id: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  expertise: string[];

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  experience_years?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  research_interests?: string[];

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  max_students?: number;

  role: UserRole.HEI_MENTOR = UserRole.HEI_MENTOR;
}

// HEI Admin Registration
export class HeiAdminRegisterDto extends BaseRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  hei_id: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];

  role: UserRole.HEI_ADMIN = UserRole.HEI_ADMIN;
}

// School Admin Registration
export class SchoolAdminRegisterDto extends BaseRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];

  role: UserRole.SCHOOL_ADMIN = UserRole.SCHOOL_ADMIN;
}

// Union type for all registration DTOs
export type RegisterDto = 
  | StudentRegisterDto 
  | TeacherRegisterDto 
  | HeiMentorRegisterDto 
  | HeiAdminRegisterDto 
  | SchoolAdminRegisterDto;

// Response DTOs
export class AuthResponseDto {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    onboarding_completed: boolean;
    profile?: any;
  };
}

export class RegistrationResponseDto {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
