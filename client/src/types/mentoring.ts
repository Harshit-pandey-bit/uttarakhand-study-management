// src/types/mentoring.ts

// src/types/mentoring.ts

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

/* ---------- DASHBOARD TYPES ---------- */
export interface MentoringStats {
  upcomingSessions: number;
  completedSessions: number;
  assignedMentors: number;
  averageRating: number;
  totalHoursCompleted: number;
  activeWhatsAppGroups: number;
}

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  department: string;
  expertise: string[];
  qualification: string;
  experienceYears: number;
  rating: number;
  maxStudents: number;
  currentStudents: number;
  isAvailable: boolean;
  researchInterests: string[];
  avatar?: string;
  institution?: string;
  description?: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  sessionDate: string;
  duration: number;
  sessionType: SessionType;
  subject: string;
  maxParticipants: number;
  currentParticipants: number;
  meetingLink: string;
  meetingRoom: string;
  status: SessionStatus;
  mentor: Mentor;
  sessionNotes: string;
  canJoin: boolean;
  hasJoined: boolean;
  feedback?: SessionFeedback;
  recordingUrl?: string;
}

export interface MentoringDashboard {
  upcomingSessions: Session[];
  recentSessions: Session[];
  assignedMentors: Mentor[];
  stats: MentoringStats;
  recentActivity: any[];
  weeklyTimetable: any[];
}

/* ---------- SESSION MANAGEMENT TYPES ---------- */
export interface CreateSession {
  title: string;
  description: string;
  mentorId: string;
  sessionDate: string;
  duration: number;
  sessionType: SessionType;
  subject: string;
  maxParticipants: number;
  meetingLink?: string;
  meetingRoom?: string;
  sessionNotes?: string;
}

export interface UpdateSession {
  title?: string;
  description?: string;
  sessionDate?: string;
  duration?: number;
  status?: SessionStatus;
  meetingLink?: string;
  sessionNotes?: string;
}

export interface SessionFeedback {
  rating: number;
  comment: string;
}

export interface SessionList {
  sessions: Session[];
  total: number;
  page: number;
  limit: number;
}

/* ---------- MENTOR AVAILABILITY & MATCHING ---------- */
export interface MentorAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface MentorMatchRequest {
  interests: string[];
  preferredSubject: string;
  message?: string;
}

/* ---------- WHATSAPP GROUP TYPES ---------- */
export interface WhatsAppGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  whatsappLink: string;
  mentor: Mentor;
  activeHours: string;
  guidelines: string[];
  hasJoined: boolean;
  unreadCount: number;
  isPinned?: boolean;
  lastActivity?: string;
  isOnline?: boolean;
}

export interface WhatsAppQuestion {
  id: string;
  question: string;
  subject: string;
  studentName: string;
  answeredBy: string;
  answer: string;
  upvotes: number;
  isResolved: boolean;
  createdAt: string;
  askedBy?: string;
}

export interface CreateQuestion {
  groupId: string;
  question: string;
  subject: string;
}

/* ---------- CHAT SYSTEM TYPES ---------- */
export interface ChatMessage {
  id: string;
  content: string;
  messageType: MessageType;
  senderName: string;
  senderId: string;
  fileUrl?: string;
  replyTo?: ChatMessage;
  isEdited: boolean;
  createdAt: string;
  reactions: any[];
  timestamp?: string;
  sender?: {
    name: string;
    avatar: string;
    role: 'student' | 'mentor';
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  roomType: string;
  participantCount: number;
  unreadCount: number;
  lastMessage: ChatMessage;
  lastActivity: string;
  type?: 'group' | 'direct';
  participants?: number;
  lastMessageTime?: string;
  isOnline?: boolean;
  avatar?: string;
}

export interface SendMessage {
  content: string;
  messageType: MessageType;
  fileUrl?: string;
  replyToId?: string;
}

export interface CreateChatRoom {
  name: string;
  description?: string;
  roomType: string;
  participantIds: string[];
}

/* ---------- TIMETABLE & SCHEDULING TYPES ---------- */
export interface TimetableSlot {
  startTime: string;
  endTime: string;
  title: string;
  mentorName: string;
  location: string;
  type: SessionType;
  canJoin: boolean;
  time?: string;
  mentor?: {
    id: string;
    name: string;
    avatar: string;
  };
  students?: string[] | string;
  subject?: string;
  status?: SessionStatus;
  meetingLink?: string;
  id?: string;
}

export interface WeeklyTimetable {
  weekStart: string;
  weekEnd: string;
  days: TimetableSlot[][];
  sessions?: Record<string, TimetableSlot[]>;
  mentorAvailability?: MentorAvailability[];
  upcomingChanges?: any[];
  currentWeek?: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  mentor: Mentor;
  isAvailable: boolean;
  date?: string;
  timeSlots?: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  mentorId: string;
}

export interface BookSession {
  mentorId: string;
  sessionDate: string;
  duration: number;
  subject: string;
  description?: string;
  sessionType?: SessionType;
  topic?: string;
  type?: 'individual' | 'group';
}

/* ---------- PAGINATION & FILTERING ---------- */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SessionFilters {
  status?: SessionStatus;
  type?: SessionType;
  mentorId?: string;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
}

/* ---------- API RESPONSE TYPES ---------- */
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/* ---------- SOCKET EVENTS ---------- */
export interface SocketMessage {
  roomId: string;
  message: ChatMessage;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

/* ---------- FORM TYPES ---------- */
export interface SessionBookingForm {
  mentorId: string;
  date: string;
  time: string;
  type: 'individual' | 'group';
  topic: string;
  description?: string;
}

export interface QuestionSubmissionForm {
  question: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Career Guidance' | 'General';
  groupId: string;
}

/* ---------- UTILITY TYPES ---------- */
export type SessionStatusFilter = 'all' | SessionStatus;
export type SessionTypeFilter = 'all' | SessionType;
export type MessageTypeFilter = 'all' | MessageType;

/* ---------- COMPONENT PROPS TYPES ---------- */
export interface TimetableProps {
  studentId?: string;
  onSessionSelect?: (session: TimetableSlot) => void;
  onScheduleSession?: () => void;
}

export interface WhatsAppGroupsProps {
  studentId: string;
  onQuestionSubmit?: (question: string, subject: string) => void;
}
