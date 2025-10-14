'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Bell, 
  Video, 
  MessageSquare, 
  Loader2, 
  AlertTriangle,
  CalendarPlus,
  Megaphone,
  CalendarOff,
  BellOff
} from 'lucide-react';
import { teacherAPI } from '@/lib/teacher-client';
import { MentoringSession, Announcement } from '@/types/teacher-types';
import Link from 'next/link';

export default function HEICoordinationPage() {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [errorSessions, setErrorSessions] = useState<string | null>(null);
  const [errorAnnouncements, setErrorAnnouncements] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const data = await teacherAPI.getHEISessions();
        setSessions(data);
      } catch (err) {
        console.error('Sessions error:', err);
        setErrorSessions('Failed to load scheduled sessions.');
      } finally {
        setLoadingSessions(false);
      }
    };

    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const data = await teacherAPI.getAnnouncements({});
        setAnnouncements(data);
      } catch (err) {
        console.error('Announcements error:', err);
        setErrorAnnouncements('Failed to load announcements.');
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchSessions();
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">HEI Coordination</h1>

      {/* Scheduled Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle>Scheduled Sessions</CardTitle>
                <CardDescription>
                  View and manage your upcoming virtual mentoring sessions with HEI partners.
                </CardDescription>
              </div>
            </div>
            <Link href="/teacher/virtual-collaboration/schedule-session">
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarPlus className="h-4 w-4" />
                Schedule New
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loadingSessions ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading sessions...</p>
              </div>
            </div>
          ) : /* Error State */
          errorSessions ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Error Loading Sessions</h3>
                  <p className="text-red-700 mt-1">{errorSessions}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          ) : /* Empty State */
          sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <CalendarOff className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Sessions</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any upcoming mentoring sessions scheduled. Book a session with an HEI partner to get started.
              </p>
              <Link href="/teacher/virtual-collaboration/schedule-session">
                <Button className="gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  Schedule Your First Session
                </Button>
              </Link>
            </div>
          ) : /* Success State - Sessions List */
          (
            <ul className="space-y-4">
              {sessions.map(session => (
                <li key={session.id} className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{session.title}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {session.session_type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{session.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.session_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {session.duration && (
                      <span>{session.duration} mins</span>
                    )}
                  </div>
                  {session.meeting_link && (
                    <a 
                      href={session.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="gap-2">
                        <Video className="h-4 w-4" />
                        Join Session
                      </Button>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-yellow-600" />
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Important messages from HEI and school admins.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loadingAnnouncements ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading announcements...</p>
              </div>
            </div>
          ) : /* Error State */
          errorAnnouncements ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Error Loading Announcements</h3>
                  <p className="text-red-700 mt-1">{errorAnnouncements}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          ) : /* Empty State */
          announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <BellOff className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are no announcements at the moment. Check back later for important updates from your school and HEI partners.
              </p>
            </div>
          ) : /* Success State - Announcements List */
          (
            <ul className="space-y-4">
              {announcements.map(announcement => (
                <li 
                  key={announcement.id} 
                  className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                    <Badge 
                      className="capitalize"
                      style={{ 
                        backgroundColor: announcement.badge_color || '#6B7280',
                        color: 'white'
                      }}
                    >
                      {announcement.badge_type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{announcement.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium">{announcement.author_name}</span>
                    <span>•</span>
                    <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    {announcement.is_new && (
                      <Badge variant="destructive" className="ml-2">New</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
