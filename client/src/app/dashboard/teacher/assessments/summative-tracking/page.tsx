'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teacherAPI } from '@/lib/teacher-client';
import { GradebookData } from '@/types/teacher-types';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function SummativeTrackingPage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradebook, setGradebook] = useState<GradebookData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fixed example values, replace with dynamic values as needed
  const classes = ['9', '10', '11', '12'];
  const subjects = ['mathematics', 'computer_science', 'science', 'social_studies', 'languages'];

  useEffect(() => {
    async function fetchGradebook() {
      if (!selectedClass || !selectedSubject) {
        setGradebook(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await teacherAPI.getGradebookData(selectedClass, selectedSubject);
        setGradebook(data);
      } catch (e) {
        setError('Error loading gradebook data');
      } finally {
        setLoading(false);
      }
    }
    fetchGradebook();
  }, [selectedClass, selectedSubject]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Summative Assessment Tracking</h1>
        <Link href="/dashboard/teacher/assessments/summative-tracking/create">
          <Button>Create New Report</Button>
        </Link>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="w-36">
          <label className="block mb-1 font-medium text-gray-700">Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <label className="block mb-1 font-medium text-gray-700">Subject</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subj => (
                <SelectItem key={subj} value={subj}>
                  {subj.charAt(0).toUpperCase() + subj.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" />
          <span>Loading gradebook...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {gradebook && (
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-r">Student</th>
                {gradebook.assignment_averages.map(assign => (
                  <th key={assign.assignment_id} className="py-2 px-3 border-r text-center">
                    {assign.assignment_name}
                    <div className="text-xs text-gray-500">{assign.average_score}% Avg</div>
                  </th>
                ))}
                <th className="py-2 px-3 border-r text-center">Total %</th>
                <th className="py-2 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {gradebook.students.map(student => (
                <tr key={student.student_id} className="even:bg-gray-50">
                  <td className="py-2 px-3 border-r">{student.student_name}</td>
                  {student.assignments.map(assgn => (
                    <td key={assgn.assignment_id} className="py-2 px-3 border-r text-center font-semibold">
                      {assgn.scored_marks !== undefined ? assgn.scored_marks : '-'}
                    </td>
                  ))}
                  <td className="py-2 px-3 border-r text-center font-bold">{student.total_percentage.toFixed(2)}</td>
                  <td className="py-2 px-3 text-center">{student.grade ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!gradebook && !loading && !error && (
        <p className="mt-10 text-center text-gray-600">Select a class and subject to view the gradebook.</p>
      )}
    </div>
  );
}
