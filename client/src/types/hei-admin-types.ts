// client/src/types/hei-admin-types.ts

/* ---------- ENUMS ---------- */

export enum MentorStatus {
  ACTIVE = 'active',
  AWAY = 'away',
  INACTIVE = 'inactive'
}

export enum PartnershipStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum AssignmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REASSIGNED = 'reassigned'
}

export enum AnnouncementPriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum AnnouncementTarget {
  HEI_MENTORS = 'hei_mentors',
  SCHOOLS = 'schools',
  TEACHERS = 'teachers',
  STUDENTS = 'students'
}

/* ---------- DASHBOARD TYPES ---------- */

export interface HEIAdminDashboard {
  stats: DashboardStats;
  recentAssignments: MentorAssignment[];
  recentAnnouncements: Announcement[];
  trendsData: TrendsData;
}

export interface DashboardStats {
  totalMentors: number;
  activeMentors: number;
  inactiveMentors: number;
  totalSchools: number;
  partnerSchools: number;
  totalStudents: number;
  totalTeachers: number;
  pendingAssignments: number;
  activeAssignments: number;
  recentAnnouncementsCount: number;
}

export interface TrendsData {
  mentorAssignmentTrend: Array<{ month: string; count: number }>;
  schoolPartnershipsByRegion: Array<{ region: string; count: number }>;
  mentorWorkloadDistribution: Array<{ range: string; count: number }>;
}

/* ---------- MENTOR TYPES ---------- */

export interface HEIMentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  employeeId?: string;
  designation: string;
  department: string;
  expertise: string[];
  qualification: string;
  experienceYears: number;
  researchInterests: string[];
  maxStudents: number;
  status: MentorStatus;
  assignedSchoolsCount: number;
  totalStudentsSupervised: number;
  lastActive?: string;
  joinDate: string;
  heiId: string;
  heiName?: string;
}

export interface MentorListItem extends HEIMentor {
  workloadStatus: 'under-assigned' | 'optimal' | 'over-assigned';
  assignedSchools: SchoolAssignmentSummary[];
}

export interface MentorDetails extends HEIMentor {
  assignedSchools: SchoolAssignmentDetails[];
  bio?: string;
  contactNumber?: string;
}

export interface SchoolAssignmentSummary {
  schoolId: string;
  schoolName: string;
  location: string;
}

export interface SchoolAssignmentDetails {
  id: string; // assignment id
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  location: string;
  district: string;
  studentsCount: number;
  teachersCount: number;
  assignmentDate: string;
  lastVisitDate?: string;
  status: AssignmentStatus;
  notes?: string;
}

/* ---------- ASSIGNMENT TYPES ---------- */

export interface MentorAssignment {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  schoolId: string;
  schoolName: string;
  schoolLocation: string;
  assignedBy: string;
  assignedByName: string;
  assignmentDate: string;
  status: AssignmentStatus;
  notes?: string;
  lastVisitDate?: string;
}

export interface CreateAssignment {
  mentorId: string;
  schoolIds: string[];
  assignmentDate: string;
  notes?: string;
  sendNotification: boolean;
}

export interface ReassignMentor {
  assignmentId: string;
  newMentorId: string;
  reason: string;
  effectiveDate: string;
}

export interface UnassignedSchool {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  studentsCount: number;
  teachersCount: number;
  principalName?: string;
  principalContact?: string;
  requestDate?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface MentorCapacity {
  mentorId: string;
  mentorName: string;
  currentSchoolsCount: number;
  maxCapacity: number;
  availableCapacity: number;
  workloadPercentage: number;
  assignedSchools: Array<{
    schoolId: string;
    schoolName: string;
  }>;
}

/* ---------- PARTNERSHIP TYPES ---------- */

// ✅ FIXED: Changed 'id' to 'schoolId' and added missing 'status' field
export interface SchoolPartnership {
  schoolId: string; // Changed from 'id'
  schoolName: string;
  schoolLogo?: string;
  location: string;
  district: string;
  state: string;
  principalName?: string;
  principalContact?: string;
  mentorId?: string; // Added - was missing
  mentorName?: string; // Changed from 'assignedMentorName'
  mentorAvatar?: string; // Changed from 'assignedMentorAvatar'
  mentorEmail?: string; // Changed from 'assignedMentorEmail'
  studentsCount: number;
  teachersCount: number;
  partnershipDate?: string; // Changed from 'partnershipStartDate'
  status: string; // Added - was missing (using string instead of PartnershipStatus for flexibility)
  lastContactDate?: string;
  programsEnrolled?: string[];
}

// ✅ FIXED: Flattened structure to match backend response
export interface PartnershipDetails {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  location: string;
  district: string;
  state: string;
  principalName?: string;
  principalContact?: string;
  principalEmail?: string;
  establishedYear?: string;
  schoolType?: string;
  infrastructure?: any;
  status: string; // Changed from partnershipStatus
  partnershipDate?: string; // Changed from partnershipStartDate
  studentsCount: number;
  teachersCount: number;
  mentorId?: string;
  mentorName?: string;
  mentorEmail?: string;
  mentorAvatar?: string;
  mentorDesignation?: string;
  mentorDepartment?: string;
  mentorContactNumber?: string;
  mentorAssignmentDate?: string;
  notes?: string;
}

export interface PartnershipOverviewStats {
  totalMentors: number;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activePartnerships: number;
  pendingRequests: number;
  inactivePartnerships?: number;
  growthRate: number;
}

/* ---------- ANNOUNCEMENT TYPES ---------- */

export interface Announcement {
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
  metadata: any;
}

export interface CreateAnnouncement {
  title: string;
  description: string;
  badgeType: string;
  badgeColor?: string;
  targetAudience: string[];
  priority: string;
  isPinned?: boolean;
  classLevel?: string;
  startsAt?: string;
  expiresAt?: string;
  metadata?: any;
}

export interface AnnouncementRecipientSummary {
  totalRecipients: number;
  breakdown: {
    mentors: number;
    schools: number;
    teachers: number;
    students: number;
  };
}

/* ---------- FILTERS & PAGINATION ---------- */

export interface MentorFilters {
  status?: MentorStatus;
  workload?: 'under-assigned' | 'optimal' | 'over-assigned';
  heiId?: string;
  expertise?: string;
  search?: string;
}

export interface PartnershipFilters {
  status?: PartnershipStatus | string;
  mentorId?: string;
  district?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ---------- API RESPONSE TYPE ---------- */

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}
