'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  Video, Calendar, Loader2, CheckCircle, AlertCircle,
  Clock, ExternalLink, RefreshCw, Users,
} from 'lucide-react';

export default function ScheduleSessionPage() {
  const { user } = useAuth();
  const [mentees, setMentees] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const fetchData = async () => {
    setFetching(true);
    const [menteesRes, sessionsRes] = await Promise.all([
      apiClient.getMyMentees(),
      apiClient.getMentoringSessions(),
    ]);
    if (menteesRes.data) setMentees(menteesRes.data as any[]);
    if (sessionsRes.data) setSessions(sessionsRes.data as any[]);
    setFetching(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    const res = await apiClient.scheduleSession({
      student_id: selectedStudent,
      scheduled_time: new Date(scheduledTime).toISOString(),
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setSuccess(res.data);
      setSelectedStudent('');
      setScheduledTime('');
      fetchData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Session</h1>
          <p className="text-gray-500 mt-1">Schedule mentoring sessions with your mentees</p>
        </div>
        <button onClick={fetchData} className="p-2.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
          <RefreshCw size={18} className={fetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Schedule Form */}
      <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video size={20} className="text-indigo-600" /> New Session
        </h2>

        {mentees.length === 0 ? (
          <div className="text-center py-6">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No mentees yet. Students need to choose you as their mentor first.</p>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Mentee *</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm bg-white"
              >
                <option value="">Choose a student...</option>
                {mentees.map((m: any) => (
                  <option key={m.student_id} value={m.student_id}>
                    {m.student?.full_name || m.student_id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time *</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              />
            </div>

            {error && <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg"><AlertCircle size={16} /> {error}</div>}
            {success && (
              <div className="text-emerald-700 text-sm p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} /> Session scheduled!</div>
                {success.google_meet_link && (
                  <a href={success.google_meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                    {success.google_meet_link}
                  </a>
                )}
                {success.calendar_warning && <p className="text-amber-600 text-xs mt-1">{success.calendar_warning}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedStudent || !scheduledTime}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
              {loading ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </form>
        )}
      </div>

      {/* Sessions List */}
      <h2 className="text-lg font-semibold text-gray-900">Scheduled Sessions</h2>
      {fetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Loader2 size={24} className="animate-spin mx-auto text-indigo-500" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Clock size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No sessions scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <span className="font-medium text-gray-900">
                      {new Date(s.scheduled_time).toLocaleDateString('en-IN', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' at '}
                      {new Date(s.scheduled_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-6">Student: {s.student_id?.slice(0, 8)}...</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.google_meet_link && (
                    <a href={s.google_meet_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                      <ExternalLink size={12} /> Meet
                    </a>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    s.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' :
                    s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{s.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
