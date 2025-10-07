// File path: /teacher/cpd/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CPDIndexPage() {
  const router = useRouter();

  // Automatically redirect to DIKSHA page on component mount
  useEffect(() => {
    router.push('/dashboard/teacher/cpd/diksha');
  }, [router]);

  // This content will briefly show before redirect
  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-3xl mx-auto">
     Redirecting......
    </div>
  );
}
