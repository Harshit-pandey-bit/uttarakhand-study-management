'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DigitalTimetable from '@/components/shared/scheduling/digital-timetable';
import { useAuth } from '@/hooks/use-auth';

export default function TimetablePage() {
  const { user } = useAuth();

  const handleSessionSelect = (session: any) => {
    console.log('Selected session:', session);
    // Handle session selection - could open modal or navigate to session details
  };

  const handleScheduleSession = () => {
    // Navigate to session scheduling page
    window.location.href = '/dashboard/student/mentoring/sessions/schedule';
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard/student/mentoring">
            <Button variant="outline" className="border-gray-300 hover:border-gray-400">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mentoring
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Timetable</h1>
            <p className="text-gray-600 text-lg">
              View and manage your mentoring sessions
            </p>
          </div>
        </div>
      </div>

      {/* Digital Timetable Component */}
      <DigitalTimetable
        userRole="student"
        studentId={user?.id}
        onSessionSelect={handleSessionSelect}
        onScheduleSession={handleScheduleSession}
      />
    </div>
  );
}
