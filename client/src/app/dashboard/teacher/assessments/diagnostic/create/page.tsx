// diagnostic/create/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateDiagnosticForm from '@/components/assessments/CreateDiagnosticForm';
import { DiagnosticForm } from '@/types/assessments';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateDiagnosticAssessmentPage() {
  const router = useRouter();

  const handleSave = (formData: DiagnosticForm) => {
    // Here you would save to your backend/database
    console.log('Saving diagnostic assessment:', formData);
    
    // Show success message and redirect
    router.push('/dashboard/teacher/assessments/diagnostic');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Diagnostics
        </Button>

        {/* Title and Subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Diagnostic Assessment
          </h1>
          <p className="text-gray-600 mt-2">
            Design assessments to identify learning gaps and student needs
          </p>
        </div>
      </div>

      {/* Form Component */}
      <CreateDiagnosticForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
