// server/src/mentoring/mentoring.service.ts
//
// Phase 6 — Hardened Google Calendar integration.
// Gracefully handles:
//   • Missing credentials (logs warning, operates without Meet links)
//   • Malformed private key / newline issues
//   • Expired or revoked service-account tokens
//   • Google API transient errors (quota, network)

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
import { google } from 'googleapis';

/** Possible states of the Google Calendar integration. */
export type CalendarStatus =
  | 'HEALTHY'
  | 'NOT_CONFIGURED'
  | 'CREDENTIAL_ERROR'
  | 'API_ERROR';

@Injectable()
export class MentoringService {
  private readonly logger = new Logger(MentoringService.name);
  private calendarClient: ReturnType<typeof google.calendar> | null = null;
  private calendarStatus: CalendarStatus = 'NOT_CONFIGURED';
  private calendarErrorDetail: string | null = null;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.initializeGoogleCalendar();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Private key normalization
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Normalize a PEM private key that may have been mangled by environment
   * variable injection (escaped \\n, missing line-breaks, etc.).
   *
   * Returns the cleaned key or throws a descriptive error.
   */
  private normalizePrivateKey(raw: string): string {
    if (!raw || raw.trim().length === 0) {
      throw new Error('Private key is empty');
    }

    let key = raw;

    // 1. Replace literal two-char sequence "\\n" with real newlines
    key = key.replace(/\\n/g, '\n');

    // 2. If the key has no newlines at all (single-line base64), reconstruct PEM
    if (!key.includes('\n')) {
      // Strip any existing header/footer that got concatenated
      key = key
        .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/g, '')
        .replace(/-----END (RSA )?PRIVATE KEY-----/g, '')
        .replace(/\s+/g, '');

      // Wrap to 64-char lines
      const lines: string[] = [];
      for (let i = 0; i < key.length; i += 64) {
        lines.push(key.substring(i, i + 64));
      }
      key =
        '-----BEGIN PRIVATE KEY-----\n' +
        lines.join('\n') +
        '\n-----END PRIVATE KEY-----\n';
    }

    // 3. Validate it at least looks like a PEM key
    if (
      !key.includes('-----BEGIN') ||
      !key.includes('-----END')
    ) {
      throw new Error(
        'Private key does not contain valid PEM headers. ' +
        'Expected -----BEGIN PRIVATE KEY----- … -----END PRIVATE KEY-----',
      );
    }

    return key;
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Google Calendar initialization
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Initialize Google Calendar client from service account credentials.
   * Gracefully skips if credentials are not configured.
   */
  private initializeGoogleCalendar() {
    try {
      const credentialsJson = this.configService.get<string>('GOOGLE_CREDENTIALS_JSON');
      const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
      const privateKeyRaw = this.configService.get<string>('GOOGLE_PRIVATE_KEY');

      let auth: InstanceType<typeof google.auth.JWT>;

      if (credentialsJson) {
        // ── Path A: Full JSON credentials blob ─────────────────────
        let creds: { client_email?: string; private_key?: string };
        try {
          creds = JSON.parse(credentialsJson);
        } catch (parseErr) {
          this.calendarStatus = 'CREDENTIAL_ERROR';
          this.calendarErrorDetail =
            'GOOGLE_CREDENTIALS_JSON is not valid JSON';
          this.logger.error(this.calendarErrorDetail, (parseErr as Error).message);
          return;
        }

        if (!creds.client_email || !creds.private_key) {
          this.calendarStatus = 'CREDENTIAL_ERROR';
          this.calendarErrorDetail =
            'GOOGLE_CREDENTIALS_JSON is missing client_email or private_key';
          this.logger.error(this.calendarErrorDetail);
          return;
        }

        const normalizedKey = this.normalizePrivateKey(creds.private_key);

        auth = new google.auth.JWT({
          email: creds.client_email,
          key: normalizedKey,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
      } else if (clientEmail && privateKeyRaw) {
        // ── Path B: Separate env vars ──────────────────────────────
        let normalizedKey: string;
        try {
          normalizedKey = this.normalizePrivateKey(privateKeyRaw);
        } catch (keyErr) {
          this.calendarStatus = 'CREDENTIAL_ERROR';
          this.calendarErrorDetail =
            `GOOGLE_PRIVATE_KEY format error: ${(keyErr as Error).message}`;
          this.logger.error(this.calendarErrorDetail);
          return;
        }

        auth = new google.auth.JWT({
          email: clientEmail,
          key: normalizedKey,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
      } else {
        // ── Path C: No credentials at all ──────────────────────────
        this.calendarStatus = 'NOT_CONFIGURED';
        this.calendarErrorDetail = null;
        this.logger.warn(
          'Google Calendar credentials not configured. ' +
          'Sessions will be saved without Meet links. ' +
          'Set GOOGLE_CREDENTIALS_JSON or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.',
        );
        return;
      }

      this.calendarClient = google.calendar({ version: 'v3', auth });
      this.calendarStatus = 'HEALTHY';
      this.calendarErrorDetail = null;
      this.logger.log('Google Calendar client initialized successfully');
    } catch (error) {
      this.calendarStatus = 'CREDENTIAL_ERROR';
      this.calendarErrorDetail = (error as Error).message;
      this.logger.error(
        'Failed to initialize Google Calendar client',
        (error as Error).stack,
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Runtime health & re-init
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Returns the current health status of the Google Calendar integration.
   * Useful for admin dashboards and the QA checklist.
   */
  getCalendarHealth(): {
    status: CalendarStatus;
    configured: boolean;
    error: string | null;
  } {
    return {
      status: this.calendarStatus,
      configured: this.calendarClient !== null,
      error: this.calendarErrorDetail,
    };
  }

  /**
   * Force re-initialization of the Calendar client (e.g. after
   * rotating credentials at runtime without restarting the server).
   */
  refreshCalendarClient(): ReturnType<MentoringService['getCalendarHealth']> {
    this.logger.log('Re-initializing Google Calendar client…');
    this.calendarClient = null;
    this.calendarStatus = 'NOT_CONFIGURED';
    this.calendarErrorDetail = null;
    this.initializeGoogleCalendar();
    return this.getCalendarHealth();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Core business logic
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Schedule a mentoring session:
   * 1. Create a Google Calendar event with auto-generated Meet link (if configured)
   * 2. Save session to database
   *
   * The database record is ALWAYS created — Calendar failures are non-blocking.
   */
  async scheduleSession(mentorId: string, dto: ScheduleSessionDto) {
    const scheduledTime = new Date(dto.scheduled_time);
    const endTime = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // 1 hour

    let googleMeetLink: string | null = null;
    let calendarWarning: string | null = null;

    // ── Attempt to create a Google Calendar event ──────────────────
    if (this.calendarClient) {
      try {
        const event = await this.calendarClient.events.insert({
          calendarId: 'primary',
          conferenceDataVersion: 1,
          requestBody: {
            summary: 'UK-GSMP Mentoring Session',
            description: `Mentoring session between mentor ${mentorId} and student ${dto.student_id}`,
            start: {
              dateTime: scheduledTime.toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
              createRequest: {
                requestId: `ukgsmp-${Date.now()}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
          },
        });

        googleMeetLink = event.data.conferenceData?.entryPoints?.find(
          ep => ep.entryPointType === 'video',
        )?.uri ?? null;

        this.logger.log(`Google Meet link created: ${googleMeetLink}`);
      } catch (error: any) {
        // ── Classify the error for logging & response ──────────────
        const status = error?.response?.status ?? error?.code;
        const message = error?.response?.data?.error?.message ?? error?.message;

        if (status === 401 || status === 403) {
          // Token expired, revoked, or insufficient scopes
          this.calendarStatus = 'API_ERROR';
          this.calendarErrorDetail = `Auth error (${status}): ${message}`;
          calendarWarning =
            'Google Calendar authentication failed — the service account token may be expired or revoked. Session saved without a Meet link.';
          this.logger.error(
            `Calendar auth error [${status}]: ${message}`,
          );
        } else if (status === 429) {
          // Rate limit / quota exceeded
          calendarWarning =
            'Google Calendar rate limit reached. Session saved without a Meet link. Please try again shortly.';
          this.logger.warn(`Calendar rate-limited: ${message}`);
        } else {
          // Generic / network error
          calendarWarning =
            'Could not reach Google Calendar. Session saved without a Meet link.';
          this.logger.error(
            `Calendar API error [${status ?? 'UNKNOWN'}]: ${message}`,
            error?.stack,
          );
        }
        // Continue — the session still gets saved to the DB
      }
    } else if (this.calendarStatus === 'CREDENTIAL_ERROR') {
      calendarWarning =
        `Google Calendar is unavailable due to credential misconfiguration: ${this.calendarErrorDetail}`;
    }

    // ── Save to database (always) via Supabase ─────────────────────
    const { data: session, error } = await this.supabase.client
      .from('mentoring_sessions')
      .insert({
        mentor_id: mentorId,
        student_id: dto.student_id,
        scheduled_time: scheduledTime.toISOString(),
        google_meet_link: googleMeetLink,
        status: 'SCHEDULED',
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to save mentoring session: ${error.message}`);
      throw new Error('Failed to save mentoring session');
    }

    return {
      id: session.id,
      mentor_id: session.mentor_id,
      student_id: session.student_id,
      scheduled_time: session.scheduled_time,
      google_meet_link: session.google_meet_link,
      status: session.status,
      created_at: session.created_at,
      // Surface warnings so the frontend can show a toast
      ...(calendarWarning ? { calendar_warning: calendarWarning } : {}),
    };
  }

  /** Get sessions for the current user (mentor or student) */
  async getSessions(userId: string, role: string) {
    const column = role === 'HEI_MENTOR' ? 'mentor_id' : 'student_id';
    const { data, error } = await this.supabase.client
      .from('mentoring_sessions')
      .select('*')
      .eq(column, userId)
      .order('scheduled_time', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch sessions: ${error.message}`);
      return [];
    }
    return data;
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Mentor-Student Linking
  // ═══════════════════════════════════════════════════════════════════

  /** List all available HEI_MENTOR users */
  async getAvailableMentors() {
    const { data, error } = await this.supabase.client
      .from('ext_users')
      .select('id, full_name, role')
      .eq('role', 'HEI_MENTOR');

    if (error) {
      this.logger.error(`Failed to fetch mentors: ${error.message}`);
      return [];
    }
    return data;
  }

  /** Student selects a mentor */
  async chooseMentor(studentId: string, mentorId: string) {
    // Remove any existing link for this student
    await this.supabase.client
      .from('mentor_student_links')
      .delete()
      .eq('student_id', studentId);

    // Create new link
    const { data, error } = await this.supabase.client
      .from('mentor_student_links')
      .insert({ mentor_id: mentorId, student_id: studentId })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to link mentor: ${error.message}`);
      throw new Error('Failed to choose mentor');
    }

    return data;
  }

  /** Get the student's current mentor */
  async getMyMentor(studentId: string) {
    // Step 1: Get the link
    const { data: link, error } = await this.supabase.client
      .from('mentor_student_links')
      .select('mentor_id')
      .eq('student_id', studentId)
      .single();

    if (error || !link) {
      return null;
    }

    // Step 2: Get mentor details from ext_users
    const { data: mentor } = await this.supabase.client
      .from('ext_users')
      .select('id, full_name, role')
      .eq('id', link.mentor_id)
      .single();

    return {
      mentor_id: link.mentor_id,
      mentor: mentor || { id: link.mentor_id, full_name: 'Mentor', role: 'HEI_MENTOR' },
    };
  }

  /** Get all mentees for a mentor */
  async getMyMentees(mentorId: string) {
    // Step 1: Get all links
    const { data: links, error } = await this.supabase.client
      .from('mentor_student_links')
      .select('student_id')
      .eq('mentor_id', mentorId);

    if (error || !links || links.length === 0) {
      if (error) this.logger.error(`Failed to fetch mentees: ${error.message}`);
      return [];
    }

    // Step 2: Get student details from ext_users
    const studentIds = links.map(l => l.student_id);
    const { data: students } = await this.supabase.client
      .from('ext_users')
      .select('id, full_name, role')
      .in('id', studentIds);

    // Step 3: Merge
    return links.map(link => ({
      student_id: link.student_id,
      student: students?.find(s => s.id === link.student_id) || {
        id: link.student_id, full_name: 'Student', role: 'STUDENT',
      },
    }));
  }
}

