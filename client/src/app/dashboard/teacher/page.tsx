'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { Assignment } from '@/types/api';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ClipboardList, Plus, Loader2, CheckCircle, AlertCircle,
  BookOpen, FileText, Users,
} from 'lucide-react';

// ── Create Assignment Form ────────────────────────────

function CreateAssignmentSection() {
  const [title, setTitle] = useState('');
  const [ncertRef, setNcertRef] = useState('');
  const [markingCriteria, setMarkingCriteria] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<Assignment | null>(null);

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
      // Reset form
      setTitle('');
      setNcertRef('');
      setMarkingCriteria('');
      setDueDate('');
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="text-blue-600" size={22} />
          Create New Assignment
        </CardTitle>
        <CardDescription>
          Create NCERT-referenced homework tasks for your students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5 — Light Reflection & Refraction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ncert">NCERT Reference</Label>
            <Input
              id="ncert"
              placeholder="e.g., NCERT Class 10 Science, Chapter 5, Pages 78-92"
              value={ncertRef}
              onChange={(e) => setNcertRef(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="criteria">Marking Criteria</Label>
            <Textarea
              id="criteria"
              placeholder="e.g., Diagrams: 5 marks, Derivations: 10 marks, MCQs: 5 marks"
              value={markingCriteria}
              onChange={(e) => setMarkingCriteria(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due">Due Date</Label>
            <Input
              id="due"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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

          <Button type="submit" disabled={loading || !title.trim()} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <ClipboardList size={16} className="mr-2" />}
            {loading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Submissions Viewer ────────────────────────────────

function SubmissionsSection() {
  // Placeholder — will be populated when GET /submissions endpoint is added
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-amber-600" size={22} />
          Recent Submissions
        </CardTitle>
        <CardDescription>View and grade student homework submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No submissions to review yet.</p>
                <p className="text-xs mt-1">Submissions will appear here when students upload their work.</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ── Main Teacher Dashboard ────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name ?? 'Teacher';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome, {name}! 📚</h1>
        <p className="text-blue-100 mt-1">
          Create assignments, track submissions, and help students grow.
        </p>
        <div className="flex gap-3 mt-4">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
            <Users size={14} className="mr-1" /> Students
          </Badge>
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
            <ClipboardList size={14} className="mr-1" /> Assignments
          </Badge>
        </div>
      </div>

      {/* Create Assignment */}
      <CreateAssignmentSection />

      {/* Submissions */}
      <SubmissionsSection />
    </div>
  );
}
