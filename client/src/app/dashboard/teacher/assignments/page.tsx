'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { Assignment } from '@/types/api';
import {
  ClipboardList, Plus, Loader2, CheckCircle, AlertCircle,
  FileText, Calendar, RefreshCw,
} from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [ncertRef, setNcertRef] = useState('');
  const [markingCriteria, setMarkingCriteria] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchAssignments = async () => {
    setFetching(true);
    const res = await apiClient.getAssignments();
    if (res.data) setAssignments(res.data as Assignment[]);
    setFetching(false);
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    const res = await apiClient.createAssignment({
      title,
      ncert_reference: ncertRef || undefined,
      marking_criteria: markingCriteria || undefined,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setSuccess(res.data);
      setTitle('');
      setNcertRef('');
      setMarkingCriteria('');
      setDueDate('');
      fetchAssignments(); // Refresh list
      setTimeout(() => setShowCreateForm(false), 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 mt-1">Create and manage homework for your students</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAssignments}
            className="p-2.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={18} className={fetching ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Plus size={18} />
            New Assignment
          </button>
        </div>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Create New Assignment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assignment Title *</label>
              <input
                type="text"
                placeholder="e.g., Chapter 5 — Light Reflection & Refraction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">NCERT Reference</label>
              <input
                type="text"
                placeholder="e.g., NCERT Class 10 Science, Chapter 5, Pages 78-92"
                value={ncertRef}
                onChange={(e) => setNcertRef(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Marking Criteria</label>
              <textarea
                placeholder="e.g., Diagrams: 5 marks, Derivations: 10 marks, MCQs: 5 marks"
                value={markingCriteria}
                onChange={(e) => setMarkingCriteria(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-emerald-700 text-sm p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle size={16} />
                <span>Assignment &quot;<strong>{success.title}</strong>&quot; created successfully!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ClipboardList size={16} />}
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      {fetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 size={28} className="animate-spin mx-auto text-blue-500 mb-3" />
          <p className="text-gray-500 text-sm">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-500 text-sm">Click &quot;New Assignment&quot; to create your first NCERT-referenced homework task.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  {a.ncert_reference && (
                    <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                      <FileText size={14} /> {a.ncert_reference}
                    </p>
                  )}
                  {a.marking_criteria && (
                    <p className="text-sm text-gray-500 mt-1">{a.marking_criteria}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {a.due_date && (
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <Calendar size={14} />
                      {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Created {new Date(a.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
