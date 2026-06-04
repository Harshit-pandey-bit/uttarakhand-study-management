'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { Users, Loader2, RefreshCw, GraduationCap, Mail } from 'lucide-react';

export default function MenteesPage() {
  const [mentees, setMentees] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchMentees = async () => {
    setFetching(true);
    const res = await apiClient.getMyMentees();
    if (res.data) setMentees(res.data as any[]);
    setFetching(false);
  };

  useEffect(() => { fetchMentees(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-500 mt-1">Students who have chosen you as their mentor</p>
        </div>
        <button
          onClick={fetchMentees}
          className="p-2.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} className={fetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold">{mentees.length}</p>
            <p className="text-indigo-200 text-sm">Total Mentees</p>
          </div>
        </div>
      </div>

      {/* Mentees List */}
      {fetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 size={28} className="animate-spin mx-auto text-indigo-500 mb-3" />
          <p className="text-gray-500 text-sm">Loading mentees...</p>
        </div>
      ) : mentees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentees yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Students will appear here once they choose you as their mentor from the mentoring page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mentees.map((m: any, i: number) => {
            const student = m.student || {};
            return (
              <div key={m.student_id || i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {(student.full_name || 'S')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{student.full_name || 'Student'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <GraduationCap size={14} /> {student.role || 'STUDENT'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex-shrink-0">
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
