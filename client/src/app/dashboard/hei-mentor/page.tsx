'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { MentoringSession } from '@/types/api';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Video, Calendar, Loader2, CheckCircle, AlertCircle,
  ExternalLink, Users, ClipboardList, Clock, X,
} from 'lucide-react';

// ── Toast Notification ────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg max-w-md">
        <CheckCircle size={20} className="flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-md transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Schedule Session Form ─────────────────────────────

function ScheduleSessionSection() {
  const [studentId, setStudentId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MentoringSession | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const res = await apiClient.scheduleSession({
      student_id: studentId,
      scheduled_time: new Date(scheduledTime).toISOString(),
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setResult(res.data);
      setShowToast(true);
      // Auto-dismiss toast after 5s
      setTimeout(() => setShowToast(false), 5000);
      // Reset form
      setStudentId('');
      setScheduledTime('');
    }
  };

  // Get minimum date-time (now)
  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <>
      {showToast && (
        <Toast
          message="🎉 Session scheduled successfully! Google Meet link generated."
          onClose={() => setShowToast(false)}
        />
      )}

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-purple-600" size={22} />
            Schedule Mentoring Session
          </CardTitle>
          <CardDescription>
            Schedule a session with a student — a Google Meet link is generated automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID (UUID) *</Label>
              <Input
                id="student-id"
                placeholder="e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
                title="Enter a valid UUID"
              />
              <p className="text-xs text-gray-400">The student&apos;s account UUID from the platform</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="datetime">Session Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                min={minDateTime}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !studentId.trim() || !scheduledTime}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Video size={16} className="mr-2" />}
              {loading ? 'Scheduling...' : 'Schedule Session & Generate Meet Link'}
            </Button>
          </form>
        </CardContent>

        {/* Result Card */}
        {result && (
          <CardFooter>
            <div className="w-full p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-600" />
                  Session Scheduled
                </h4>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  {result.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Session Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(result.scheduled_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Student ID</p>
                  <p className="font-mono text-xs text-gray-700 truncate">{result.student_id}</p>
                </div>
              </div>

              {result.google_meet_link ? (
                <a
                  href={result.google_meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video size={16} />
                  Join Google Meet
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  Meet link not available — Google Calendar credentials not configured.
                </p>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

// ── Main Mentor Dashboard ─────────────────────────────

export default function HeiMentorDashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name ?? 'Mentor';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome, {name}! 🎓</h1>
        <p className="text-purple-100 mt-1">
          Schedule mentoring sessions, create assignments, and guide students to success.
        </p>
        <div className="flex gap-3 mt-4">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
            <Video size={14} className="mr-1" /> Sessions
          </Badge>
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
            <ClipboardList size={14} className="mr-1" /> Assignments
          </Badge>
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
            <Users size={14} className="mr-1" /> Mentees
          </Badge>
        </div>
      </div>

      {/* Schedule Session */}
      <ScheduleSessionSection />
    </div>
  );
}
