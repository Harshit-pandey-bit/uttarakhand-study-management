// server/src/mentoring/dto/mentoring.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

/* ---------- ENUMS ---------- */
export enum SessionType {
  ONE_ON_ONE = 'one_on_one',
  GROUP = 'group',
  WORKSHOP = 'workshop',
  DOUBT_SESSION = 'doubt_session',
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ParticipantStatus {
  REGISTERED = 'registered',
  JOINED = 'joined',
  COMPLETED = 'completed',
  MISSED = 'missed',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

/* ---------- DASHBOARD DTOS ---------- */
export class MentoringStatsDto {
  @ApiProperty({ example: 5 })                 upcomingSessions: number;
  @ApiProperty({ example: 12 })                completedSessions: number;
  @ApiProperty({ example: 3 })                 assignedMentors: number;
  @ApiProperty({ example: 4.2 })               averageRating: number;
  @ApiProperty({ example: 8 })                 totalHoursCompleted: number;
  @ApiProperty({ example: 2 })                 activeWhatsAppGroups: number;
}

export class MentorDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               name: string;
  @ApiProperty()                               designation: string;
  @ApiProperty()                               department: string;
  @ApiProperty({ type: [String] })              expertise: string[];
  @ApiProperty()                               qualification: string;
  @ApiProperty()                               experienceYears: number;
  @ApiProperty()                               rating: number;
  @ApiProperty()                               maxStudents: number;
  @ApiProperty()                               currentStudents: number;
  @ApiProperty()                               isAvailable: boolean;
  @ApiProperty({ type: [String] })              researchInterests: string[];
}

export class SessionDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               title: string;
  @ApiProperty()                               description: string;
  @ApiProperty()                               sessionDate: string;
  @ApiProperty()                               duration: number;
  @ApiProperty({ enum: SessionType })           sessionType: SessionType;
  @ApiProperty()                               subject: string;
  @ApiProperty()                               maxParticipants: number;
  @ApiProperty()                               currentParticipants: number;
  @ApiProperty()                               meetingLink: string;
  @ApiProperty()                               meetingRoom: string;
  @ApiProperty({ enum: SessionStatus })         status: SessionStatus;
  @ApiProperty({ type: MentorDto })             mentor: MentorDto;
  @ApiProperty()                               sessionNotes: string;
  @ApiProperty()                               canJoin: boolean;
  @ApiProperty()                               hasJoined: boolean;
}

export class MentoringDashboardDto {
  @ApiProperty({ type: [SessionDto] })          upcomingSessions: SessionDto[];
  @ApiProperty({ type: [SessionDto] })          recentSessions: SessionDto[];
  @ApiProperty({ type: [MentorDto] })           assignedMentors: MentorDto[];
  @ApiProperty({ type: MentoringStatsDto })     stats: MentoringStatsDto;
  @ApiProperty({ type: [Object] })              recentActivity: any[];
  @ApiProperty({ type: [Object] })              weeklyTimetable: any[];
}

/* ---------- SESSION MANAGEMENT DTOS ---------- */
export class CreateSessionDto {
  @ApiProperty() @IsString()                   title: string;
  @ApiProperty() @IsString()                   description: string;
  @ApiProperty() @IsUUID()                     mentorId: string;
  @ApiProperty() @IsDateString()               sessionDate: string;
  @ApiProperty() @IsInt() @Min(30) @Max(240)   duration: number;
  @ApiProperty({ enum: SessionType })
  @IsEnum(SessionType)                         sessionType: SessionType;
  @ApiProperty() @IsString()                   subject: string;
  @ApiProperty() @IsInt() @Min(1) @Max(100)    maxParticipants: number;
  @ApiProperty({ required: false })
  @IsOptional() @IsString()                    meetingLink?: string;
  @ApiProperty({ required: false })
  @IsOptional() @IsString()                    meetingRoom?: string;
  @ApiProperty({ required: false })
  @IsOptional() @IsString()                    sessionNotes?: string;
}

export class UpdateSessionDto {
  @ApiProperty({ required: false })            @IsOptional() @IsString()       title?: string;
  @ApiProperty({ required: false })            @IsOptional() @IsString()       description?: string;
  @ApiProperty({ required: false })            @IsOptional() @IsDateString()   sessionDate?: string;
  @ApiProperty({ required: false })            @IsOptional() @IsInt()          duration?: number;
  @ApiProperty({ required: false, enum: SessionStatus })
  @IsOptional() @IsEnum(SessionStatus)         status?: SessionStatus;
  @ApiProperty({ required: false, description: 'Google Meet link or other meeting URL' })
  @IsOptional() @IsString() meetingLink?: string;
  @ApiProperty({ required: false })            @IsOptional() @IsString()       sessionNotes?: string;
}

export class SessionFeedbackDto {
  @ApiProperty() @IsInt() @Min(1) @Max(5)      rating: number;
  @ApiProperty() @IsString()                   comment: string;
}

export class SessionListDto {
  @ApiProperty({ type: [SessionDto] })         sessions: SessionDto[];
  @ApiProperty()                               total: number;
  @ApiProperty()                               page: number;
  @ApiProperty()                               limit: number;
}

/* ---------- MENTOR AVAILABILITY & MATCHING ---------- */
export class MentorAvailabilityDto {
  @ApiProperty() @IsInt() @Min(0) @Max(6)      dayOfWeek: number;
  @ApiProperty() @IsString()                   startTime: string;
  @ApiProperty() @IsString()                   endTime: string;
  @ApiProperty() @IsBoolean()                  isAvailable: boolean;
}

export class MentorMatchRequestDto {
  @ApiProperty({ type: [String] }) @IsArray()  @IsString({ each: true })        interests: string[];
  @ApiProperty() @IsString()                   preferredSubject: string;
  @ApiProperty({ required: false })
  @IsOptional() @IsString()                    message?: string;
}

/* ---------- WHATSAPP GROUP DTOS ---------- */
export class WhatsAppGroupDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               name: string;
  @ApiProperty()                               subject: string;
  @ApiProperty()                               description: string;
  @ApiProperty()                               memberCount: number;
  @ApiProperty()                               maxMembers: number;
  @ApiProperty()                               whatsappLink: string;
  @ApiProperty({ type: MentorDto })             mentor: MentorDto;
  @ApiProperty()                               activeHours: string;
  @ApiProperty({ type: [String] })              guidelines: string[];
  @ApiProperty()                               hasJoined: boolean;
  @ApiProperty()                               unreadCount: number;
}

export class WhatsAppQuestionDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               question: string;
  @ApiProperty()                               subject: string;
  @ApiProperty()                               studentName: string;
  @ApiProperty()                               answeredBy: string;
  @ApiProperty()                               answer: string;
  @ApiProperty()                               upvotes: number;
  @ApiProperty()                               isResolved: boolean;
  @ApiProperty()                               createdAt: string;
}

export class CreateQuestionDto {
  @ApiProperty() @IsUUID()                     groupId: string;
  @ApiProperty() @IsString()                   question: string;
  @ApiProperty() @IsString()                   subject: string;
}

/* ---------- CHAT SYSTEM DTOS ---------- */
export class ChatMessageDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               content: string;
  @ApiProperty({ enum: MessageType })           messageType: MessageType;
  @ApiProperty()                               senderName: string;
  @ApiProperty()                               senderId: string;
  @ApiProperty({ required: false })            fileUrl?: string;
  @ApiProperty({ type: ChatMessageDto, required: false })
  replyTo?: ChatMessageDto;
  @ApiProperty()                               isEdited: boolean;
  @ApiProperty()                               createdAt: string;
  @ApiProperty({ type: [Object] })             reactions: any[];
}

export class ChatRoomDto {
  @ApiProperty()                               id: string;
  @ApiProperty()                               name: string;
  @ApiProperty()                               description: string;
  @ApiProperty()                               roomType: string;
  @ApiProperty()                               participantCount: number;
  @ApiProperty()                               unreadCount: number;
  @ApiProperty({ type: ChatMessageDto })        lastMessage: ChatMessageDto | null;
  @ApiProperty()                               createdBy: string;   // ✅ ADD: Missing property
  @ApiProperty()                               createdAt: string;   // ✅ ADD: Missing property
  @ApiProperty()                               isActive: boolean;   // ✅ ADD: Missing property
  participants: Array<{
    userId: string;
    role: 'mentor' | 'student';
    isAdmin: boolean;
  }>;
}

// Update SendMessageDto in mentoring.dto.ts to remove file fields
export class SendMessageDto {
  @ApiProperty()
  @IsString()
  messagecontent: string;

  @ApiProperty({ enum: MessageType })
  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType; // Will be forced to TEXT

  // ❌ REMOVED FILE FIELDS:
  // @IsOptional()
  // @IsString()
  // fileUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  replyToId?: string;
}


export class CreateChatRoomDto {
  @ApiProperty() @IsString()                   name: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString()
                                              description?: string;
  @ApiProperty() @IsString()                   roomType: string;
  @ApiProperty({ type: [String] }) @IsArray()  @IsUUID('4', { each: true })
                                              participantIds: string[];
}

/* ---------- TIMETABLE & SCHEDULING DTOS ---------- */
export class TimetableSlotDto {
  @ApiProperty()                               startTime: string;
  @ApiProperty()                               endTime: string;
  @ApiProperty()                               title: string;
  @ApiProperty()                               mentorName: string;
  @ApiProperty()                               location: string;
  @ApiProperty({ enum: SessionType })           type: SessionType;
  @ApiProperty()                               canJoin: boolean;
}

export class WeeklyTimetableDto {
  @ApiProperty()                               weekStart: string;
  @ApiProperty()                               weekEnd: string;
  days: TimetableSlotDto[][];
}

export class AvailableSlotDto {
  @ApiProperty()                               startTime: string;
  @ApiProperty()                               endTime: string;
  @ApiProperty({ type: MentorDto })             mentor: MentorDto;
  @ApiProperty()                               isAvailable: boolean;
}

export class BookSessionDto {
  @ApiProperty() @IsUUID()                     mentorId: string;
  @ApiProperty() @IsDateString()               sessionDate: string;
  @ApiProperty() @IsInt() @Min(30) @Max(180)   duration: number;
  @ApiProperty() @IsString()                   subject: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString()
                                              description?: string;
}

/* ---------- HEI-MENTOR SPECIFIC DTOS ---------- */

export class HEIMentorDashboardDto {
  @ApiProperty({ example: 25 })
  totalAssignedStudents: number;

  @ApiProperty({ example: 5 })
  assignedSchools: number;

  @ApiProperty({ example: 15 })
  activeSessions: number;

  @ApiProperty({ example: 120 })
  completedSessions: number;

  @ApiProperty({ example: 4.2 })
  averageRating: number;

  @ApiProperty({ example: 45 })
  totalTeachingHours: number;

  @ApiProperty({ type: [SessionDto] })
  upcomingSessions: SessionDto[];

  @ApiProperty({ type: [Object] })
  recentActivities: any[];

  @ApiProperty({ 
    example: { 'Class 10': 12, 'Class 11': 8, 'Class 12': 5 },
    description: 'Student distribution by class'
  })
  studentDistribution: Record<string, number>;
}

export class AssignedStudentDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Rahul Sharma' })
  name: string;

  @ApiProperty({ example: 'rahul.sharma@student.edu' })
  email: string;

  @ApiProperty({ example: 'Class 10' })
  classLevel: string;

  @ApiProperty({ example: 'Greenfield High School' })
  schoolName: string;

  @ApiProperty({ example: '9876543210' })
  phoneNumber?: string;

  @ApiProperty({ example: 'Mathematics, Science' })
  subjects: string;

  @ApiProperty({ example: 4.1 })
  averageScore: number;

  @ApiProperty({ example: 8 })
  completedSessions: number;

  @ApiProperty({ example: 2 })
  upcomingSessions: number;

  @ApiProperty({ example: '2024-09-15T10:30:00.000Z' })
  lastSessionDate?: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-08-01T00:00:00.000Z' })
  assignedAt: string;
}

export class StudentDetailDto extends AssignedStudentDto {
  @ApiProperty({ example: 'Strong in problem-solving, needs help with theory' })
  notes?: string;

  @ApiProperty({ type: [Object] })
  recentSessions: any[];

  @ApiProperty({ type: [Object] })
  assignments: any[];

  @ApiProperty({ type: [Object] })
  progressHistory: any[];

  @ApiProperty({ 
    example: { mathematics: 85, science: 78, english: 82 },
    description: 'Subject-wise performance scores'
  })
  subjectPerformance: Record<string, number>;

  @ApiProperty({ example: 75.5 })
  attendanceRate: number;
}

export class AssignedSchoolDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Greenfield High School' })
  name: string;

  @ApiProperty({ example: 'Delhi' })
  city: string;

  @ApiProperty({ example: 'Delhi' })
  state: string;

  @ApiProperty({ example: 'CBSE' })
  board: string;

  @ApiProperty({ example: 'government' })
  type: string;

  @ApiProperty({ example: 1200 })
  totalStudents: number;

  @ApiProperty({ example: 25 })
  assignedStudents: number;

  @ApiProperty({ example: 'Dr. Priya Mehta' })
  principalName: string;

  @ApiProperty({ example: 'principal@greenfield.edu' })
  contactEmail: string;

  @ApiProperty({ example: '9876543210' })
  contactPhone: string;

  @ApiProperty({ example: '2024-08-01T00:00:00.000Z' })
  assignedAt: string;

  @ApiProperty({ example: 'active' })
  status: string;
}

export class SchoolDetailDto extends AssignedSchoolDto {
  @ApiProperty({ example: '123 Education Street, New Delhi - 110001' })
  address: string;

  @ApiProperty({ example: 'Established in 1985, known for academic excellence' })
  description?: string;

  @ApiProperty({ type: [AssignedStudentDto] })
  students: AssignedStudentDto[];

  @ApiProperty({ type: [Object] })
  recentActivities: any[];

  @ApiProperty({ 
    example: { 'Class 10': 12, 'Class 11': 8, 'Class 12': 5 },
    description: 'Student count by class level'
  })
  classDistribution: Record<string, number>;

  @ApiProperty({ example: 4.3 })
  averagePerformance: number;

  @ApiProperty({ example: 15 })
  completedSessions: number;

  @ApiProperty({ example: 3 })
  upcomingSessions: number;
}

export class StudentFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ required: false })
  @IsOptional()  
  @IsString()
  classLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class SchoolFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  board?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class AssignedStudentsResponseDto {
  @ApiProperty({ type: [AssignedStudentDto] })
  students: AssignedStudentDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 15 })
  activeStudents: number;

  @ApiProperty({ example: 10 })
  inactiveStudents: number;
}

export class AssignedSchoolsResponseDto {
  @ApiProperty({ type: [AssignedSchoolDto] })
  schools: AssignedSchoolDto[];

  @ApiProperty({ example: 5 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 125 })
  totalStudentsAcrossSchools: number;
}