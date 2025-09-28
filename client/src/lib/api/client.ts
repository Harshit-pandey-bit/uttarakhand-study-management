import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegistrationResponse,
  UserProfile,
  School,
  HEI,
  StudentDashboardData,
  HollandQuestion,
  HollandResults,
  HollandSubmission,
  AssessmentStatus,
  DreamCareer,
  FeaturedCareer,
  CareerPathway,
  CareerProgress,
  SuccessStory,
  InspirationalQuote,
  QuickAction,
  NotificationDto,
  WeeklyAnalytics,
  HollandQuestionsResponse,
  HollandSubmissionResponse,
  SearchCareersResponse,
  CareerPathwayMap,
  UserProgress,
  LocalOpportunity,
  CareerProgressDto,
  LocalOpportunityDto,
  CareerPathwayMapDto,
  UpdateProgressDto
} from '@/types/api';

interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private baseURL = 'http://localhost:3001/api';

  constructor() {
    // No need to manage tokens since they're handled via httpOnly cookies
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
        credentials: 'include', // Critical: This sends cookies with requests
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

  // ===== AUTHENTICATION METHODS =====
  async login(loginData: LoginRequest): Promise<APIResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
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

  async checkAuth(): Promise<APIResponse<UserProfile>> {
    return this.getProfile();
  }

  async logout(): Promise<APIResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
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

  // ===== STUDENT DASHBOARD METHODS =====
  async getStudentDashboard(studentId: string): Promise<APIResponse<StudentDashboardData>> {
    return this.request<StudentDashboardData>(`/students/${studentId}/dashboard`);
  }

  async getMyDashboard(): Promise<APIResponse<StudentDashboardData>> {
    return this.request<StudentDashboardData>('/students/my-dashboard');
  }

  // ===== HOLLAND CODE ASSESSMENT METHODS =====
  async getHollandQuestions(): Promise<APIResponse<HollandQuestionsResponse>> {
    return this.request<HollandQuestionsResponse>('/assessment/holland-questions');
  }

  async submitHollandAssessment(submission: HollandSubmission): Promise<APIResponse<HollandSubmissionResponse>> {
    return this.request<HollandSubmissionResponse>('/assessment/holland-submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  async getHollandResults(studentId: string): Promise<APIResponse<HollandSubmissionResponse>> {
    return this.request<HollandSubmissionResponse>(`/assessment/holland-results/${studentId}`);
  }

  async getMyHollandResults(): Promise<APIResponse<HollandResults>> {
    return this.request<HollandResults>('/assessment/my-results');
  }

  async allowHollandRetake(studentId: string): Promise<APIResponse<void>> {
    return this.request<void>(`/assessment/retake/${studentId}`, {
      method: 'POST',
    });
  }

  async getCareerMatches(personalityCode: string): Promise<APIResponse<string[]>> {
    return this.request<string[]>(`/assessment/career-matches/${personalityCode}`);
  }

  async getFeaturedCareers(limit?: number): Promise<APIResponse<FeaturedCareer[]>> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<FeaturedCareer[]>(`/careers/featured${query}`);
  }

  // Search careers endpoint - matches your controller with all parameters
  async searchCareers(
    query?: string, 
    category?: string, 
    demandLevel?: string, 
    hollandCodes?: string[], 
    limit: number = 20, 
    offset: number = 0
  ): Promise<APIResponse<SearchCareersResponse>> {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (demandLevel) params.append('demand', demandLevel);
    if (hollandCodes && hollandCodes.length > 0) {
      hollandCodes.forEach(code => params.append('holland', code));
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    return this.request<SearchCareersResponse>(`/careers/search?${params.toString()}`);
  }

  // Get career categories - matches your controller
  async getCareerCategories(): Promise<APIResponse<{ categories: string[] }>> {
    return this.request<{ categories: string[] }>('/careers/categories');
  }

  // Get inspirational quotes - matches your controller
  async getInspirationalQuotes(category?: string, limit: number = 5): Promise<APIResponse<InspirationalQuote[]>> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    
    return this.request<InspirationalQuote[]>(`/careers/quotes?${params.toString()}`);
  }

  // Get career details by slug - matches your controller
  async getCareerBySlug(slug: string): Promise<APIResponse<DreamCareer>> {
    return this.request<DreamCareer>(`/careers/${slug}`);
  }

  // Get career pathway - matches your controller
  async getCareerPathway(slug: string): Promise<APIResponse<CareerPathway>> {
    return this.request<CareerPathway>(`/careers/${slug}/pathway`);
  }

  // Get featured success stories - matches your controller
  async getFeaturedSuccessStories(limit: number = 10): Promise<APIResponse<SuccessStory[]>> {
    return this.request<SuccessStory[]>(`/careers/stories/featured?limit=${limit}`);
  }

  // Get career-specific success stories - matches your controller
  async getCareerSuccessStories(slug: string, limit: number = 5): Promise<APIResponse<SuccessStory[]>> {
    return this.request<SuccessStory[]>(`/careers/${slug}/stories?limit=${limit}`);
  }

  // Get personal career progress - matches your controller (authenticated)
  async getCareerProgress(): Promise<APIResponse<CareerProgress>> {
    return this.request<CareerProgress>('/careers/my/progress');
  }

  // Get favorite careers - matches your controller (authenticated)
  async getMyFavoriteCareers(): Promise<APIResponse<DreamCareer[]>> {
    return this.request<DreamCareer[]>('/careers/my/favorites');
  }

  // Add career to favorites - matches your controller (authenticated)
  async addCareerToFavorites(slug: string): Promise<APIResponse<{ success: boolean; message: string }>> {
    return this.request<{ success: boolean; message: string }>(`/careers/${slug}/favorite`, {
      method: 'POST',
    });
  }

  // Remove career from favorites - matches your controller (authenticated)
  async removeCareerFromFavorites(slug: string): Promise<APIResponse<{ success: boolean; message: string }>> {
    return this.request<{ success: boolean; message: string }>(`/careers/${slug}/favorite`, {
      method: 'DELETE',
    });
  }

  // Get popular careers analytics - matches your controller
  async getPopularCareers(): Promise<APIResponse<{ popularCareers: any[] }>> {
    return this.request<{ popularCareers: any[] }>('/careers/analytics/popular');
  }

async getCareerPathwayBySlug(slug: string): Promise<APIResponse<CareerPathwayMap>> {
  return this.request<CareerPathwayMap>(`/careers/${slug}/pathway`);
}

async getUserCareerProgress(): Promise<APIResponse<UserProgress>> {
  return this.request<UserProgress>('/careers/my/progress');
}

async updateUserCareerProgress(progress: Partial<UserProgress>): Promise<APIResponse<UserProgress>> {
  return this.request<UserProgress>('/careers/my/progress', {
    method: 'PUT',
    body: JSON.stringify(progress),
  });
}

async getLocalOpportunities(location?: string): Promise<APIResponse<LocalOpportunity[]>> {
  const query = location ? `?location=${location}` : '';
  return this.request<LocalOpportunity[]>(`/careers/local-opportunities${query}`);
}

  // ===== COMPATIBILITY METHODS (UPDATED TO USE ACTUAL ENDPOINTS) =====
  
  // These methods provide backward compatibility while using actual endpoints
  async getDreamCareers(): Promise<APIResponse<DreamCareer[]>> {
    // Use search endpoint to get all careers (no query = all careers)
    const response = await this.searchCareers();
    if (response.data) {
      return { data: response.data.careers };
    }
    return { error: response.error };
  }

  async getSuccessStories(): Promise<APIResponse<SuccessStory[]>> {
    // Use featured success stories endpoint
    return this.getFeaturedSuccessStories();
  }

  // Legacy aliases for backward compatibility
  async getCareerDetails(slug: string): Promise<APIResponse<DreamCareer>> {
    return this.getCareerBySlug(slug);
  }

  async addToFavorites(slug: string): Promise<APIResponse<{ success: boolean; message: string }>> {
    return this.addCareerToFavorites(slug);
  }

  async removeFromFavorites(slug: string): Promise<APIResponse<{ success: boolean; message: string }>> {
    return this.removeCareerFromFavorites(slug);
  }


  // ===== DASHBOARD METHODS =====
  async getDashboard(): Promise<APIResponse<any>> {
    return this.request<any>('/dashboard');
  }

  async getDashboardStats(): Promise<APIResponse<any>> {
    return this.request<any>('/dashboard/stats');
  }

  async getQuickActions(): Promise<APIResponse<QuickAction[]>> {
    return this.request<QuickAction[]>('/dashboard/quick-actions');
  }

  async getNotifications(): Promise<APIResponse<NotificationDto[]>> {
    return this.request<NotificationDto[]>('/dashboard/notifications');
  }

  async markNotificationRead(notificationId: string): Promise<APIResponse<void>> {
    return this.request<void>(`/dashboard/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount(): Promise<APIResponse<number>> {
    return this.request<number>('/dashboard/notifications/unread-count');
  }

  async getWeeklyAnalytics(): Promise<APIResponse<WeeklyAnalytics>> {
    return this.request<WeeklyAnalytics>('/dashboard/analytics/weekly');
  }

  // Transform registration data
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

  async getCareerPathways(): Promise<APIResponse<CareerPathwayMapDto[]>> {
  return this.request<CareerPathwayMapDto[]>('/careers/pathways');
}

async getRecommendedCareerPathways(): Promise<APIResponse<CareerPathwayMapDto[]>> {
  return this.request<CareerPathwayMapDto[]>('/careers/pathways/recommended');
}

async getCareerPathwayOverview(): Promise<APIResponse<any[]>> {
  return this.request<any[]>('/careers/pathways/overview');
}

async updateMyCareerProgress(progressData: UpdateProgressDto): Promise<APIResponse<CareerProgressDto>> {
  return this.request<CareerProgressDto>('/careers/my/progress', {
    method: 'PUT',
    body: JSON.stringify(progressData),
  });
}

async markStageCompleted(stageData: { 
  careerSlug: string; 
  stageIndex: number; 
  completed: boolean; 
  notes?: string 
}): Promise<APIResponse<{ success: boolean; message: string; progressUpdated: number }>> {
  return this.request<{ success: boolean; message: string; progressUpdated: number }>(
    '/careers/my/progress/stage', 
    {
      method: 'POST',
      body: JSON.stringify(stageData),
    }
  );
}

async getMyCareerProgress(): Promise<APIResponse<CareerProgressDto>> {
  return this.request<CareerProgressDto>('/careers/my/progress');
}

async getCareerLocalOpportunities(location?: string, type?: string): Promise<APIResponse<LocalOpportunityDto[]>> {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (type) params.append('type', type);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return this.request<LocalOpportunityDto[]>(`/careers/local-opportunities${query}`);
}
}


// Create singleton instance
export const apiClient = new APIClient();
