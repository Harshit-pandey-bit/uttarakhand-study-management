'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api/client';
import { Assignment } from '@/types/api';
import {
  BookOpen, Clock, FileText, Calendar, Loader2, RefreshCw, Upload,
  X, CheckCircle, ArrowLeft, File, AlertCircle,
} from 'lucide-react';

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Single assignment detail view
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setFetching(true);
    const [assignRes, subRes] = await Promise.all([
      apiClient.getAssignments(),
      apiClient.getMySubmissions(),
    ]);
    if (assignRes.data) setAssignments(assignRes.data as Assignment[]);
    if (subRes.data) setSubmissions(subRes.data as any[]);
    setFetching(false);
  };

  useEffect(() => { fetchData(); }, []);

  const submittedIds = new Set(submissions.map((s: any) => s.assignment_id));
  const pendingAssignments = assignments.filter(a => !submittedIds.has(a.id));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedFile) return;

    setUploading(true);
    setUploadError('');

    const res = await apiClient.submitHomework(selectedAssignment.id, selectedFile);

    setUploading(false);

    if (res.error) {
      setUploadError(res.error);
    } else {
      setUploadSuccess(true);
      setTimeout(() => {
        setSelectedAssignment(null);
        setSelectedFile(null);
        setUploadSuccess(false);
        fetchData(); // Refresh data
      }, 1500);
    }
  };

  const closeDetail = () => {
    setSelectedAssignment(null);
    setSelectedFile(null);
    setUploadError('');
    setUploadSuccess(false);
  };

  // ── Assignment Detail / Submit View ────────────────────
  if (selectedAssignment) {
    const isSubmitted = submittedIds.has(selectedAssignment.id);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={closeDetail}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Assignments
        </button>

        {/* Assignment Details Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-xl font-bold">{selectedAssignment.title}</h1>
            {selectedAssignment.due_date && (
              <div className="flex items-center gap-1.5 mt-2 text-blue-100 text-sm">
                <Calendar size={14} />
                Due: {new Date(selectedAssignment.due_date).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            {selectedAssignment.ncert_reference && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">NCERT Reference</h3>
                <p className="text-gray-900 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  {selectedAssignment.ncert_reference}
                </p>
              </div>
            )}

            {selectedAssignment.marking_criteria && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Marking Criteria</h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg text-sm">
                  {selectedAssignment.marking_criteria}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                Created {new Date(selectedAssignment.created_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Submission Section */}
        {isSubmitted ? (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-emerald-900">Already Submitted ✓</h3>
            <p className="text-emerald-600 text-sm mt-1">You have already submitted your work for this assignment.</p>
          </div>
        ) : uploadSuccess ? (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-emerald-900">Submitted Successfully! 🎉</h3>
            <p className="text-emerald-600 text-sm mt-1">Your work has been uploaded and sent to your teacher.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" />
              Submit Your Work
            </h2>

            {/* File Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <File size={24} className="text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload your file</p>
                  <p className="text-gray-400 text-sm mt-1">PDF, Word, JPG, PNG — max 10 MB</p>
                </>
              )}
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg mt-4">
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Uploading...' : 'Submit Assignment'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Main Assignments List ──────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-500 mt-1">View and submit your assignments</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} className={fetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending ({pendingAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'submitted'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Submitted ({submissions.length})
        </button>
      </div>

      {/* Loading */}
      {fetching ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 size={28} className="animate-spin mx-auto text-blue-500 mb-3" />
          <p className="text-gray-500 text-sm">Loading assignments...</p>
        </div>
      ) : activeTab === 'pending' ? (
        pendingAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up! 🎉</h3>
            <p className="text-gray-500 text-sm">No pending assignments. Check back later for new tasks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAssignments.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAssignment(a)}
                className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    {a.ncert_reference && (
                      <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <FileText size={14} /> {a.ncert_reference}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {a.due_date && (
                      <div className="flex items-center gap-1 text-sm text-amber-600">
                        <Calendar size={14} />
                        {new Date(a.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        Open →
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )
      ) : (
        submissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500 text-sm">Complete your pending assignments to see them here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s: any) => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.assignments?.title ?? 'Assignment'}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted on {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    {s.grade ? `Grade: ${s.grade}` : 'Submitted ✓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
