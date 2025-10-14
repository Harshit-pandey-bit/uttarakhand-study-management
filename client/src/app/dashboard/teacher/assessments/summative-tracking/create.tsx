'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function AssessmentsCreatePage() {
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [score, setScore] = useState<number | ''>('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isNaN(val)) setScore('');
    else setScore(val);
  };

  const handleAddReport = () => {
    if (!studentName.trim() || !assignmentName.trim() || score === '' || score < 0 || score > 100) {
      setError('Please fill all fields correctly.');
      return;
    }
    setError(null);
    setSaving(true);
    setTimeout(() => {
      alert(`Assessment report for ${studentName} saved!`);
      setStudentName('');
      setAssignmentName('');
      setScore('');
      setComments('');
      setSaving(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Assessment Report</h1>

      {error && (
        <div className="mb-4 flex items-center text-red-600">
          <AlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      <Card className="p-4 space-y-4">
        <CardHeader>
          <CardTitle>Input Student Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <Input
              placeholder="Assignment Name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
            />
            <Input
              placeholder="Score (0-100)"
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={handleChangeScore}
            />
            <Textarea
              placeholder="Comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
            <Button onClick={handleAddReport} disabled={saving}>
              {saving ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
