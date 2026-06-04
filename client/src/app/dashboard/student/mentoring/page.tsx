'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import {
  Video, Clock, Calendar, ExternalLink, Loader2, RefreshCw,
  Users, CheckCircle, UserPlus,
} from 'lucide-react';

export default function MentoringPage() {
  const [activeTab, setActiveTab] = useState<'mentor' | 'upcoming' | 'past'>('mentor');
  const [sessions, setSessions] = useState<any[]>([]);
  const [myMentor, setMyMentor] = useState<any>(null);
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [choosing, setChoosing] = useState<string | null>(null);

  const fetchData = async () => {
    setFetching(true);
    const [sessRes, mentorRes, availRes] = await Promise.all([
      apiClient.getMentoringSessions(),
      apiClient.getMyMentor(),
      apiClient.getAvailableMentors(),
    ]);
    if (sessRes.data) setSessions(sessRes.data as any[]);
    if (mentorRes.data) setMyMentor(mentorRes.data);
    if (availRes.data) setAvailableMentors(availRes.data as any[]);
    setFetching(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChooseMentor = async (mentorId: string) => {
    setChoosing(mentorId);
    const res = await apiClient.chooseMentor(mentorId);
    if (!res.error) {
      await fetchData();
      setActiveTab('upcoming');
    }
    setChoosing(null);
  };

  const now = new Date();
  const upcoming = sessions.filter(s => new Date(s.scheduled_time) >= now && s.status !== 'CANCELLED');
  const past = sessions.filter(s => new Date(s.scheduled_time) < now || s.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentoring</h1>
          <p className="text-gray-500 mt-1">Choose your mentor and view sessions</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} className={fetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Current Mentor Banner */}
      {myMentor && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {(myMentor.mentor?.full_name || 'M')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-indigo-200">Your Mentor</p>
                <p className="text-lg font-semibold">{myMentor.mentor?.full_name || 'Mentor'}</p>
              </div>
            </div>
            <CheckCircle size={24} className="text-indigo-200" />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'mentor'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {myMentor ? 'Change Mentor' : 'Choose Mentor'}
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'past'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      {/* Content */}
      {fetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 size={28} className="animate-spin mx-auto text-indigo-500 mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : activeTab === 'mentor' ? (
        /* Mentor Selection */
        availableMentors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors available</h3>
            <p className="text-gray-500 text-sm">HEI mentors haven&apos;t registered yet. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Select a mentor to receive personalized assignments and guidance:</p>
            {availableMentors.map((m: any) => {
              const isCurrentMentor = myMentor?.mentor_id === m.id;
              return (
                <div key={m.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${
                  isCurrentMentor ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${
                        isCurrentMentor
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {(m.full_name || 'M')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{m.full_name}</p>
                        <p className="text-sm text-gray-500">HEI Mentor</p>
                      </div>
                    </div>
                    {isCurrentMentor ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        <CheckCircle size={14} /> Selected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleChooseMentor(m.id)}
                        disabled={choosing === m.id}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all"
                      >
                        {choosing === m.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <UserPlus size={14} />
                        }
                        Choose
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Sessions View (upcoming or past) */
        (() => {
          const displayed = activeTab === 'upcoming' ? upcoming : past;
          return displayed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                {activeTab === 'upcoming'
                  ? <Clock size={28} className="text-indigo-500" />
                  : <Video size={28} className="text-indigo-500" />
                }
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {activeTab === 'upcoming'
                  ? 'Your mentor will schedule sessions for you. You\'ll see them here with Google Meet links.'
                  : 'Completed sessions will appear here for your reference.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayed.map((s: any) => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-600" />
                        <span className="font-medium text-gray-900">
                          {new Date(s.scheduled_time).toLocaleDateString('en-IN', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 ml-6">
                        {new Date(s.scheduled_time).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.google_meet_link && (
                        <a
                          href={s.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink size={14} /> Join Meet
                        </a>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' :
                        s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
