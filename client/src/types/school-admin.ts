// Basic DTOs matching your backend
export interface SchoolOverviewDto {
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  location: string;
  district: string;
}

export interface ClassStatsDto {
  classLevel: string;
  studentCount: number;
  averageGrade: number;
  completionRate: number;
}

export interface ActivityStatsDto {
  totalActivities: number;
  recentActivities: number;
  topActivityTypes: string[];
  studentParticipation: number;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  description: string;
  badgeType: string;
  badgeColor: string;
  authorName: string;
  authorRole: string;
  priority: string;
  isPinned: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface DashboardResponseDto {
  schoolOverview: SchoolOverviewDto;
  classStats: ClassStatsDto[];
  activityStats: ActivityStatsDto;
  announcements: AnnouncementDto[];
}

export interface TeacherDto {
  id: string;
  name: string;
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experienceYears: number;
  totalStudents: number;
  joinedDate: string;
  profileImage?: string;
}

export interface TeachersResponseDto {
  teachers: TeacherDto[];
  totalTeachers: number;
  averageExperience: number;
  totalStudentsAssigned: number;
}

export interface StudentDto {
  id: string;
  name: string;
  classLevel: string;
  overallGrade: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  stemProjects: number;
  careerAspiration: string;
  profileImage?: string;
}

export interface StudentsResponseDto {
  students: StudentDto[];
  totalStudents: number;
  averageGrade: number;
  completionRate: number;
}

// Filter DTOs
export interface AnnouncementsFiltersDto {
  badgeType?: string;
  priority?: string;
  pinnedOnly?: boolean;
  limit?: number;
  offset?: number;
}

// Create/Update DTOs
export interface CreateAnnouncementDto {
  title: string;
  description: string;
  badgeType: string;
  priority: string;
  isPinned?: boolean;
  isNew?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  description?: string;
  badgeType?: string;
  priority?: string;
  isPinned?: boolean;
  isNew?: boolean;
}
