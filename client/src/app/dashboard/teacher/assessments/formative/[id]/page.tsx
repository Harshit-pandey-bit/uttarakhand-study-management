'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, CheckCircle2, XCircle, Eye, Star, Search
} from 'lucide-react';

// ---------- dummy data (replace with real fetch) ----------
import { mockAssessment, mockStudentResponses } from './mockData';

// Types
interface StudentResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  submittedAt: string;
  status: 'submitted' | 'not_submitted';
  grade: number | null;
  responses: { [key: string]: string };
}

interface StudentViewProps {
  student: StudentResponse;
  onBack: () => void;
}

export default function ResponsesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<StudentResponse | null>(null);
  const [query, setQuery] = useState('');

  const list = mockStudentResponses.filter((s: StudentResponse) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  if (selected)
    return <StudentView student={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{mockAssessment.title}</h1>
          <p className="text-gray-600">
            {mockAssessment.subject} • {mockAssessment.class}
          </p>
        </div>
      </div>

      {/* search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* students list */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Student Responses</h2>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {list.map((s: StudentResponse) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelected(s)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {s.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{s.name}</h3>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {s.status === 'submitted' ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Submitted
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Submitted
                  </Badge>
                )}

                {s.grade !== null && (
                  <span className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{s.grade}%</span>
                  </span>
                )}

                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- individual student drill-down --------- */
function StudentView({ student, onBack }: StudentViewProps) {
  const [grades, setGrades] = useState<{ [k: string]: number }>({});
  const [notes, setNotes] = useState<{ [k: string]: string }>({});

  const handleSaveGrades = () => {
    console.log('Saving grades:', grades);
    console.log('Saving notes:', notes);
    // Here you would typically make an API call to save the grades
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Responses
        </Button>
        
        <div className="flex items-center space-x-2">
          {student.grade !== null && (
            <Badge className="bg-green-100 text-green-700">
              Current Grade: {student.grade}%
            </Badge>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">{student.name}</h2>
        <p className="text-gray-600">{student.email}</p>
      </div>

      {mockAssessment.questions.map((q: string, i: number) => (
        <Card key={i}>
          <CardHeader className="bg-gray-50">
            <h3 className="font-semibold">
              Question {i + 1}: {q}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Student Response:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-gray-900">
                  {student.responses[`q${i + 1}`] || 'No response provided.'}
                </p>
              </div>
            </div>

            {/* grading */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade (0-100)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter grade"
                  value={grades[`q${i + 1}`] ?? ''}
                  onChange={(e) =>
                    setGrades({ ...grades, [`q${i + 1}`]: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <Input
                  placeholder="Add feedback..."
                  value={notes[`q${i + 1}`] ?? ''}
                  onChange={(e) =>
                    setNotes({ ...notes, [`q${i + 1}`]: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveGrades}>
          <Star className="h-4 w-4 mr-1" />
          Save Grades
        </Button>
      </div>
    </div>
  );
}
