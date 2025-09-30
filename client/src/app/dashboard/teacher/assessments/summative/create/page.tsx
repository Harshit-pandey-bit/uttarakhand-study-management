'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateSummativeForm from '@/components/assessments/CreateSummativeForm';
import { SummativeAssessmentForm } from '@/types/assessments';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateSummativeAssessmentPage() {
  const router = useRouter();

  const handleSave = (formData: SummativeAssessmentForm) => {
    // Here you would save to your backend/database
    console.log('Saving summative assessment:', formData);
    
    // Show success message and redirect
    router.push('/dashboard/teacher/assessments/summative');
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
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Summative Assessment</h1>
            <p className="text-gray-600">Build comprehensive assessments for evaluation of learning</p>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <CreateSummativeForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
