'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AIAssistantPage() {
  const router = useRouter();

  // Automatically redirect to NCERT Generator on component mount
  useEffect(() => {
    router.push('/dashboard/teacher/ai-assistant/ncert-generator');
  }, [router]);

  // Show only redirecting state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        <p className="text-gray-600 text-lg">Redirecting to NCERT Lesson Planner...</p>
      </div>
    </div>
  );
}
