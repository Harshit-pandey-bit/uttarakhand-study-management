export type UserRole = 'student' | 'teacher' | 'hei_mentor' | 'hei_admin' | 'school_admin';

export interface CommonFields {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  full_name: string;
  phone?: string;
}

export interface StudentFields extends CommonFields {
  school_id: string;
  class_level: string;
  career_aspiration?: string;
  parent_contact?: string;
  address?: string;
}

export interface TeacherFields extends CommonFields {
  school_id: string;
  employee_id?: string;
  subjects: string[];
  classes?: string[];
  qualification: string;
  experience_years: number;
  joined_date?: Date;
}

export interface HEIMentorFields extends CommonFields {
  hei_id: string;
  employee_id?: string;
  designation: string;
  department: string;
  expertise: string[];
  qualification: string;
  experience_years: number;
  research_interests?: string[];
  max_students?: number;
}

export interface HEIAdminFields extends CommonFields {
  hei_id: string;
  employee_id?: string;
  designation: string;
  department?: string;
  responsibilities?: string[];
}

export interface SchoolAdminFields extends CommonFields {
  school_id: string;
  employee_id?: string;
  designation: string;
  responsibilities?: string[];
}
