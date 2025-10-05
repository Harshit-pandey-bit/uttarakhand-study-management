// formative/create/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateFormativeForm from '@/components/assessments/CreateFormativeForm';
import { FormativeAssessmentForm } from '@/types/assessments';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateFormativeAssessmentPage() {
  const router = useRouter();

  const handleSave = (formData: FormativeAssessmentForm) => {
    // Here you would save to your backend/database
    console.log('Saving formative assessment:', formData);
    
    // Show success message and redirect
    router.push('/dashboard/teacher/assessments/formative');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Formative Assessment</h1>
            <p className="text-gray-600">Build a quick check for understanding</p>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <CreateFormativeForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
