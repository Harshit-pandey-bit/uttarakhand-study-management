// server/src/common/interfaces/user.interface.ts

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  HEI_MENTOR = 'hei_mentor',
  HEI_ADMIN = 'hei_admin',
  SCHOOL_ADMIN = 'school_admin',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
