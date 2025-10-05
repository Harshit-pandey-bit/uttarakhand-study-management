'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { FormativeAssessment } from '@/types/assessments';

interface Props {
  assessment: FormativeAssessment;
  onView: (a: FormativeAssessment) => void;
}

export default function FormativeCard({ assessment, onView }: Props) {
  const badge =
    assessment.status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <Card
      onClick={() => onView(assessment)}
      className="cursor-pointer hover:shadow-lg transition border-l-4 border-indigo-500"
    >
      <CardContent className="p-6 space-y-4">
        {/* big title */}
        <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
          {assessment.title}
        </h2>

        {/* subtitle */}
        <p className="text-lg text-gray-600">
          {assessment.subject} • {assessment.class}
        </p>

        {/* status + type */}
        <div className="flex items-center justify-between">
          <Badge className={`${badge} capitalize`}>{assessment.status}</Badge>
          <span className="text-sm text-gray-500 capitalize">
            {assessment.type}
          </span>
        </div>

        {/* quick stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{assessment.duration} min</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>
              {assessment.completed}/{assessment.total}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
