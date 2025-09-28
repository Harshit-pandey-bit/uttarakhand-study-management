import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegistrationResponse,
  UserProfile,
  School,
  HEI,
} from '@/types/api';

interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private baseURL = 'http://localhost:3001/api';

  constructor() {
    // No need to manage tokens since they're handled via httpOnly cookies [file:4]
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Critical: This sends cookies with requests [file:4]
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  // Authentication methods
  async login(loginData: LoginRequest): Promise<APIResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    // No need to manually store tokens - your backend sets httpOnly cookies [file:4]
    // The browser will automatically handle the access_token cookie
    return response;
  }

  async register(registerData: RegisterRequest): Promise<APIResponse<RegistrationResponse>> {
    const endpoints = {
      student: '/auth/register/student',
      teacher: '/auth/register/teacher',
      'hei-mentor': '/auth/register/hei-mentor',
      'hei-admin': '/auth/register/hei-admin',
      'school-admin': '/auth/register/school-admin',
    };

    const endpoint = endpoints[registerData.role];
    if (!endpoint) {
      return { error: 'Invalid role specified' };
    }

    const transformedData = this.transformRegistrationData(registerData);

    return this.request<RegistrationResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  async getProfile(): Promise<APIResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/profile');
  }

  // Helper method to check authentication status
  async checkAuth(): Promise<APIResponse<UserProfile>> {
    return this.getProfile();
  }

  // Helper data endpoints
  async getSchools(): Promise<APIResponse<School[]>> {
    return this.request<School[]>('/auth/schools');
  }

  async getHEIs(): Promise<APIResponse<HEI[]>> {
    return this.request<HEI[]>('/auth/heis');
  }

  async getSubjects(): Promise<APIResponse<string[]>> {
    return this.request<string[]>('/auth/subjects');
  }

  async getCareerSuggestions(): Promise<APIResponse<string[]>> {
    return this.request<string[]>('/auth/career-suggestions');
  }

  // Transform frontend form data to match backend DTOs exactly
  private transformRegistrationData(data: RegisterRequest): any {
    const baseData = {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      phone: data.phone || undefined,
      role: data.role,
    };

    switch (data.role) {
      case 'student':
        return {
          ...baseData,
          school_id: data.school_id,
          class_level: data.class_level,
          career_aspiration: data.career_aspiration || undefined,
          parent_contact: data.parent_contact || undefined,
          address: data.address || undefined,
        };

      case 'teacher':
        return {
          ...baseData,
          school_id: data.school_id,
          employee_id: data.employee_id || undefined,
          subjects: data.subjects || [],
          classes: data.classes || [],
          qualification: data.qualification,
          experience_years: data.experience_years,
          joined_date: data.joined_date || undefined,
        };

      case 'hei-mentor':
        return {
          ...baseData,
          hei_id: data.hei_id,
          employee_id: data.employee_id || undefined,
          designation: data.designation,
          department: data.department,
          expertise: data.expertise || [],
          qualification: data.qualification,
          experience_years: data.experience_years,
          research_interests: data.research_interests || [],
          max_students: data.max_students || 30,
        };

      case 'hei-admin':
        return {
          ...baseData,
          hei_id: data.hei_id,
          employee_id: data.employee_id || undefined,
          designation: data.designation,
          department: data.department || undefined,
          responsibilities: data.responsibilities || [],
        };

      case 'school-admin':
        return {
          ...baseData,
          school_id: data.school_id,
          employee_id: data.employee_id || undefined,
          designation: data.designation,
          responsibilities: data.responsibilities || [],
        };

      default:
        return baseData;
    }
  }

  // Logout by calling backend logout endpoint which clears httpOnly cookies
  async logout(): Promise<APIResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }
}

// Create singleton instance
export const apiClient = new APIClient();
