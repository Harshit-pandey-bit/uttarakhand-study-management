'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SummativeCard from '@/components/assessments/SummativeCard';
import SummativeStats from '@/components/assessments/SummativeStats';
import { SummativeAssessment } from '@/types/assessments';
import { GraduationCap, Plus, Search } from 'lucide-react';

// Sample data
const sampleSummativeAssessments: SummativeAssessment[] = [
  {
    id: 1,
    title: 'Mathematics Mid-Term Examination',
    subject: 'Mathematics',
    class: '10th A',
    type: 'mid-term',
    totalMarks: 100,
    duration: 180,
    created: '2025-09-20',
    dueDate: '2025-10-15',
    status: 'active',
    components: [],
    submitted: 18,
    total: 25,
    averageScore: 78.5,
    passingMarks: 40,
    instructions: 'Answer all questions. Show working for mathematical problems.',
    weightage: 30
  },
  {
    id: 2,
    title: 'Science Research Project',
    subject: 'Science',
    class: '9th B',
    type: 'project',
    totalMarks: 50,
    duration: 0, // No time limit for projects
    created: '2025-09-15',
    dueDate: '2025-11-30',
    status: 'active',
    components: [],
    submitted: 8,
    total: 22,
    averageScore: null,
    passingMarks: 25,
    instructions: 'Complete research project on renewable energy sources.',
    weightage: 25
  },
  {
    id: 3,
    title: 'English Literature Final Exam',
    subject: 'English',
    class: '12th A',
    type: 'final-exam',
    totalMarks: 80,
    duration: 180,
    created: '2025-09-10',
    dueDate: '2025-12-15',
    status: 'scheduled',
    components: [],
    submitted: 0,
    total: 28,
    averageScore: null,
    passingMarks: 32,
    instructions: 'Comprehensive examination covering all literature topics.',
    weightage: 40
  }
];

export default function SummativeAssessmentsPage() {
  const router = useRouter();
  const [assessments] = useState<SummativeAssessment[]>(sampleSummativeAssessments);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'scheduled' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || assessment.class === classFilter;
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    const matchesType = typeFilter === 'all' || assessment.type === typeFilter;
    return matchesSearch && matchesClass && matchesStatus && matchesType;
  });

  const handleCreateNew = () => {
    router.push('/dashboard/teacher/assessments/summative/create');
  };

  const handleViewAssessment = (assessment: SummativeAssessment) => {
    router.push(`/dashboard/teacher/assessments/summative/${assessment.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-8 w-8 mr-3 text-emerald-500" />
            Summative Assessments
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive assessments to evaluate student learning at the end of instructional units
          </p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700" 
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Statistics Overview */}
      <SummativeStats assessments={assessments} />

      {/* Filters */}
      <Card className="border-emerald-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assessments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mid-term">Mid-term</SelectItem>
                <SelectItem value="final-exam">Final Exam</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="research-paper">Research Paper</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9th B">Class 9B</SelectItem>
                <SelectItem value="10th A">Class 10A</SelectItem>
                <SelectItem value="12th A">Class 12A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessment List */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map(assessment => (
            <SummativeCard
              key={assessment.id}
              assessment={assessment}
              onView={handleViewAssessment}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or create a new summative assessment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
