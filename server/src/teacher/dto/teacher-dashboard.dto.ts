// server/src/teacher/dto/teacher-dashboard.dto.ts

import { ApiProperty } from '@nestjs/swagger';

// ===== User & School DTOs =====
export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  avatar_url?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  onboarding_completed: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class SchoolDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  contact_email: string;

  @ApiProperty()
  contact_phone: string;

  @ApiProperty()
  principal_name: string;

  @ApiProperty()
  established_year: number;

  @ApiProperty()
  affiliation: string;
}

export class TeacherProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  school_id: string;

  @ApiProperty()
  employee_id: string;

  @ApiProperty({ type: [String] })
  subjects: string[];

  @ApiProperty({ type: [String] })
  classes: string[];

  @ApiProperty()
  qualification: string;

  @ApiProperty()
  experience_years: number;

  @ApiProperty()
  joined_date: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

// ===== Dashboard Stats DTOs =====
export class TeacherStatsDto {
  @ApiProperty()
  total_students: number;

  @ApiProperty()
  active_assignments: number;

  @ApiProperty()
  pending_grading: number;

  @ApiProperty()
  upcoming_sessions: number;

  @ApiProperty()
  lesson_plans_created: number;

  @ApiProperty()
  this_month_activities: number;

  @ApiProperty()
  average_assignment_score: number;

  @ApiProperty()
  completion_rate: number;
}

export class ActivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  timestamp: string;
}

export class AnnouncementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  badge_type: string;

  @ApiProperty()
  badge_color: string;

  @ApiProperty()
  author_name: string;

  @ApiProperty()
  author_role: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  is_pinned: boolean;

  @ApiProperty()
  is_new: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  user_has_viewed: boolean;
}

export class QuickActionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  icon: string;
}

// ===== Assignment DTOs =====
export class SubmissionStatsDto {
  @ApiProperty()
  total_students: number;

  @ApiProperty()
  submitted: number;

  @ApiProperty()
  graded: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  average_score: number;
}

export class AssignmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  class_level: string;

  @ApiProperty()
  chapter: string;

  @ApiProperty()
  teacher_id: string;

  @ApiProperty()
  total_marks: number;

  @ApiProperty()
  due_date: string;

  @ApiProperty({ required: false })
  instructions?: string;

  @ApiProperty()
  is_published: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty({ type: SubmissionStatsDto })
  submission_stats: SubmissionStatsDto;
}

export class MentoringSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mentor_id: string;

  @ApiProperty()
  mentor_name: string;

  @ApiProperty()
  session_date: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  session_type: string;

  @ApiProperty({ required: false })
  subject?: string;

  @ApiProperty()
  max_participants: number;

  @ApiProperty()
  current_participants: number;

  @ApiProperty({ required: false })
  meeting_link?: string;

  @ApiProperty({ required: false })
  meeting_room?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [String], required: false })
  agenda?: string[];

  @ApiProperty()
  created_at: string;
}

// ===== Deadlines DTOs =====
export class UpcomingDeadlinesDto {
  @ApiProperty({ type: [AssignmentDto] })
  assignments: AssignmentDto[];

  @ApiProperty({ type: [MentoringSessionDto] })
  sessions: MentoringSessionDto[];
}

// ===== Teacher Data DTO =====
export class TeacherDataDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TeacherProfileDto })
  profile: TeacherProfileDto;

  @ApiProperty({ type: SchoolDto })
  school: SchoolDto;
}

// ===== Dashboard Response DTO =====
export class TeacherDashboardResponseDto {
  @ApiProperty({ type: TeacherDataDto })
  teacher: TeacherDataDto;

  @ApiProperty({ type: TeacherStatsDto })
  stats: TeacherStatsDto;

  @ApiProperty({ type: [ActivityDto] })
  recent_activity: ActivityDto[];

  @ApiProperty({ type: UpcomingDeadlinesDto })
  upcoming_deadlines: UpcomingDeadlinesDto;

  @ApiProperty({ type: [AnnouncementDto] })
  announcements: AnnouncementDto[];

  @ApiProperty({ type: [QuickActionDto] })
  quick_actions: QuickActionDto[];
}

// ===== Profile Update DTOs =====
export class UpdateSubjectsClassesDto {
  @ApiProperty({ type: [String] })
  subjects: string[];

  @ApiProperty({ type: [String] })
  classes: string[];
}

// ===== Assignment Creation DTOs =====
export class CreateAssignmentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  class_level: string;

  @ApiProperty()
  chapter: string;

  @ApiProperty({ type: [String] })
  question_ids: string[];

  @ApiProperty()
  due_date: string;

  @ApiProperty({ required: false })
  instructions?: string;

  @ApiProperty({ required: false })
  rubric?: any;
}

// ===== Grading DTOs =====
export class QuestionGradeDto {
  @ApiProperty()
  question_id: string;

  @ApiProperty()
  marks_awarded: number;
}

export class GradeSubmissionDto {
  @ApiProperty({ type: [QuestionGradeDto] })
  answers: QuestionGradeDto[];

  @ApiProperty()
  total_score: number;

  @ApiProperty({ required: false })
  feedback?: string;
}

// ===== Gradebook DTOs =====
export class StudentAssignmentDto {
  @ApiProperty()
  assignment_id: string;

  @ApiProperty()
  assignment_name: string;

  @ApiProperty()
  max_marks: number;

  @ApiProperty()
  scored_marks: number;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  status: string;
}

export class GradebookStudentDto {
  @ApiProperty()
  student_id: string;

  @ApiProperty()
  student_name: string;

  @ApiProperty()
  roll_number: string;

  @ApiProperty({ type: [StudentAssignmentDto] })
  assignments: StudentAssignmentDto[];

  @ApiProperty()
  total_percentage: number;

  @ApiProperty({ required: false })
  grade?: string;
}

export class AssignmentAverageDto {
  @ApiProperty()
  assignment_id: string;

  @ApiProperty()
  assignment_name: string;

  @ApiProperty()
  average_score: number;

  @ApiProperty()
  completion_rate: number;
}

export class GradebookDataDto {
  @ApiProperty()
  class_level: string;

  @ApiProperty()
  subject: string;

  @ApiProperty({ type: [GradebookStudentDto] })
  students: GradebookStudentDto[];

  @ApiProperty()
  class_average: number;

  @ApiProperty({ type: [AssignmentAverageDto] })
  assignment_averages: AssignmentAverageDto[];
}

// ===== HEI Session Creation DTO =====
export class ScheduleSessionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  session_date: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  session_type: string;

  @ApiProperty({ required: false })
  subject?: string;

  @ApiProperty({ type: [String], required: false })
  agenda?: string[];
}
