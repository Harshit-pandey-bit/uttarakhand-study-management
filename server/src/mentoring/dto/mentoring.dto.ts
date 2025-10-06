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

export class SendMessageDto {
  @ApiProperty() @IsString()                   content: string;
  @ApiProperty({ enum: MessageType }) @IsEnum(MessageType)
                                              messageType: MessageType;
  @ApiProperty({ required: false }) @IsOptional() @IsString()
                                              fileUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID()
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
