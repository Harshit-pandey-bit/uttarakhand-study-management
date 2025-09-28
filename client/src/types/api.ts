// Base User Types
export type UserRole = 'student' | 'teacher' | 'hei-mentor' | 'hei-admin' | 'school-admin';

// Authentication Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  
  // Student fields
  school_id?: string;
  class_level?: string;
  career_aspiration?: string;
  parent_contact?: string;
  address?: string;
  
  // Teacher fields
  employee_id?: string;
  subjects?: string[];
  classes?: string[];
  qualification?: string;
  experience_years?: number;
  joined_date?: string;
  
  // HEI Mentor fields
  hei_id?: string;
  designation?: string;
  department?: string;
  expertise?: string[];
  research_interests?: string[];
  max_students?: number;
  
  // Admin fields
  responsibilities?: string[];
}

// Basic user info from login response
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  onboarding_completed: boolean;
  profile?: any;
}

// Full user profile (from profile endpoint)
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  profile?: any;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser; // Different from UserProfile - only has basic info
}

export interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Institution Types
export interface School {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  type: 'Government' | 'Private' | 'Aided';
  classes_offered: string[];
  established_year?: number;
  principal_name?: string;
  contact_email?: string;
  contact_phone?: string;
  facilities?: string[];
  student_count?: number;
  teacher_count?: number;
}

export interface HEI {
  id: string;
  name: string;
  type: 'University' | 'Institute' | 'College';
  location: string;
  district: string;
  state: string;
  established_year?: number;
  accreditation?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  departments?: string[];
  programs_offered?: string[];
  ranking?: number;
}

// Generic API Response
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
