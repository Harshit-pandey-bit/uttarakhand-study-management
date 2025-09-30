'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormativeCard from '@/components/assessments/FormativeCard';
import FormativeStats from '@/components/assessments/FormativeStats';
import { Activity, Plus, Search } from 'lucide-react';

// Types
import { FormativeAssessment } from '@/types/assessments';

// Sample data
const sampleFormatives: FormativeAssessment[] = [
  {
    id: 1,
    title: 'Daily Quiz – Quadratics',
    subject: 'Mathematics',
    class: '10A',
    type: 'quiz',
    questions: 10,
    duration: 12,
    created: '2025-09-26',
    due: '2025-09-26',
    status: 'active',
    completed: 18,
    total: 25,
    avg: null
  },
  {
    id: 2,
    title: 'Exit Ticket – Acids & Bases',
    subject: 'Chemistry',
    class: '9A',
    type: 'exit-ticket',
    questions: 4,
    duration: 5,
    created: '2025-09-24',
    due: '2025-09-24',
    status: 'closed',
    completed: 22,
    total: 22,
    avg: 83
  },
  {
    id: 3,
    title: 'Vocabulary Poll',
    subject: 'English',
    class: '8C',
    type: 'poll',
    questions: 3,
    duration: 4,
    created: '2025-09-22',
    due: '2025-09-22',
    status: 'closed',
    completed: 20,
    total: 24,
    avg: 76
  }
];

export default function FormativeAssessmentsPage() {
  const router = useRouter();
  const [assessments] = useState<FormativeAssessment[]>(sampleFormatives);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || assessment.class === classFilter;
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleCreateNew = () => {
    router.push('/dashboard/teacher/assessments/formative/create');
  };

  const handleViewAssessment = (assessment: FormativeAssessment) => {
    router.push(`/dashboard/teacher/assessments/formative/${assessment.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="h-8 w-8 mr-3 text-indigo-500" />
            Formative Assessments
          </h1>
          <p className="text-gray-600 mt-2">
            Quick checks for understanding to inform daily instruction
          </p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700" 
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Formative
        </Button>
      </div>

      {/* Statistics Overview */}
      <FormativeStats assessments={assessments} />

      {/* Filters */}
      <Card className="border-indigo-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assessments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-indigo-200 focus:border-indigo-400"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10A">Class 10A</SelectItem>
                <SelectItem value="9A">Class 9A</SelectItem>
                <SelectItem value="8C">Class 8C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessment List */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map(assessment => (
            <FormativeCard
              key={assessment.id}
              assessment={assessment}
              onView={handleViewAssessment}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or create a new formative assessment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
