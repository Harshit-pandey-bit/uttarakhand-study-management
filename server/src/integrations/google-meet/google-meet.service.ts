// src/integrations/google-meet/google-meet.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

export interface MeetingData {
  title: string;
  description: string;
  startTime: string;
  duration: number;
  mentorEmail: string;
  participantEmails?: string[];
}

export interface MeetingResult {
  meetLink: string;
  meetingId: string;
  calendarEventId: string;
}

@Injectable()
export class GoogleMeetService {
  private readonly logger = new Logger(GoogleMeetService.name);
  private calendar: any = null;
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    this.initializeService();
  }

  private async initializeService(): Promise<void> {
    try {
      const googleCredentials = this.configService.get('GOOGLE_CREDENTIALS_JSON');
      
      if (!googleCredentials) {
        this.logger.warn('⚠️  GOOGLE_CREDENTIALS_JSON not found - Google Meet integration disabled');
        this.logger.warn('💡 To enable Google Meet, add your service account JSON to .env file');
        this.isEnabled = false;
        return;
      }

      const credentials = JSON.parse(googleCredentials);

      // FIXED: Use correct JWT constructor for newer googleapis versions
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ]
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.isEnabled = true;
      this.logger.log('✅ Google Meet service initialized successfully');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Google Meet service:', error);
      this.logger.warn('🔄 Google Meet integration disabled - using fallback links');
      this.isEnabled = false;
    }
  }

  async createMeetingForSession(sessionData: MeetingData): Promise<MeetingResult> {
    // If Google Meet is not enabled, return a fallback
    if (!this.isEnabled || !this.calendar) {
      this.logger.warn('📞 Google Meet disabled - generating fallback meeting info');
      return this.generateFallbackMeeting(sessionData);
    }

    try {
      const endTime = new Date(new Date(sessionData.startTime).getTime() + sessionData.duration * 60000);

      const event = {
        summary: `🎓 ${sessionData.title}`,
        description: `${sessionData.description}\n\n📚 Mentoring Session\n⏰ Duration: ${sessionData.duration} minutes\n\n🔗 Join the session using the Google Meet link above.`,
        start: {
          dateTime: sessionData.startTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        attendees: [
          { email: sessionData.mentorEmail, displayName: 'Mentor', responseStatus: 'accepted' },
          ...(sessionData.participantEmails?.map(email => ({ 
            email, 
            displayName: 'Student',
            responseStatus: 'needsAction'
          })) || [])
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 1440 }, // 24 hours
            { method: 'email', minutes: 60 },   // 1 hour
            { method: 'popup', minutes: 15 },   // 15 minutes
          ],
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      });

      const meetLink = response.data.conferenceData?.entryPoints?.find(
        (entry: any) => entry.entryPointType === 'video'
      )?.uri || response.data.hangoutLink || '';

      const meetingId = response.data.conferenceData?.conferenceId || '';
      const calendarEventId = response.data.id || '';

      if (!meetLink) {
        this.logger.warn('⚠️ No meeting link generated - using fallback');
        return this.generateFallbackMeeting(sessionData);
      }

      this.logger.log(`✅ Google Meet created: ${meetingId}`);
      return { meetLink, meetingId, calendarEventId };
    } catch (error) {
      this.logger.error('❌ Error creating Google Meet:', error);
      this.logger.warn('🔄 Using fallback meeting info');
      return this.generateFallbackMeeting(sessionData);
    }
  }

  /**
   * Generate fallback meeting info when Google Meet is not available
   */
  private generateFallbackMeeting(sessionData: MeetingData): MeetingResult {
    const fallbackId = `fallback-${Date.now()}`;
    const meetLink = `https://meet.google.com/new`; // Generic Google Meet link
    
    this.logger.log(`📞 Generated fallback meeting for: ${sessionData.title}`);
    
    return {
      meetLink,
      meetingId: fallbackId,
      calendarEventId: fallbackId,
    };
  }

  async deleteMeeting(calendarEventId: string): Promise<void> {
    if (!this.isEnabled || !this.calendar || calendarEventId.startsWith('fallback-')) {
      this.logger.log(`🗑️ Skipping deletion of fallback meeting: ${calendarEventId}`);
      return;
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: calendarEventId,
        sendUpdates: 'all',
      });

      this.logger.log(`✅ Meeting deleted: ${calendarEventId}`);
    } catch (error) {
      this.logger.error('❌ Error deleting Google Meet:', error);
      // Don't throw error - deletion failure shouldn't break the app
    }
  }

  /**
   * Check if Google Meet integration is enabled
   */
  isGoogleMeetEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get service status for debugging
   */
  getServiceStatus(): {
    enabled: boolean;
    message: string;
    instructions?: string[];
  } {
    if (this.isEnabled) {
      return {
        enabled: true,
        message: 'Google Meet integration is active',
      };
    }

    return {
      enabled: false,
      message: 'Google Meet integration is disabled',
      instructions: [
        '1. Create a Google Cloud Project at https://console.cloud.google.com/',
        '2. Enable the Google Calendar API',
        '3. Create a service account and download the JSON credentials',
        '4. Add the entire JSON as GOOGLE_CREDENTIALS_JSON in your .env file',
        '5. Restart the server',
      ],
    };
  }
}
