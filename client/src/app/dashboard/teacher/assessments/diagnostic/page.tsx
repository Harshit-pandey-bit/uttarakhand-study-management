//  diagnostic/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DiagnosticCard from '@/components/assessments/DiagnosticCard';
import DiagnosticStats from '@/components/assessments/DiagnosticStats';
import { DiagnosticAssessment } from '@/types/assessments';
import { Brain, Plus, Search, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

// Sample data
const sampleDiagnosticAssessments: DiagnosticAssessment[] = [
  {
    id: 1,
    title: 'Mathematics Foundation Check - Algebra',
    subject: 'Mathematics',
    class: '9th A',
    type: 'pre-assessment',
    totalQuestions: 25,
    duration: 45,
    created: '2025-09-25',
    status: 'active',
    participants: 28,
    completed: 22,
    averageScore: 68.5,
    skillAreas: [
      {
        id: '1',
        name: 'Linear Equations',
        description: 'Understanding and solving linear equations',
        questions: [],
        averagePerformance: 72,
        difficultyLevel: 'intermediate',
        prerequisites: ['Basic arithmetic', 'Variables concept']
      },
      {
        id: '2',
        name: 'Algebraic Expressions',
        description: 'Working with algebraic expressions and simplification',
        questions: [],
        averagePerformance: 65,
        difficultyLevel: 'basic',
        prerequisites: ['Number operations']
      }
    ],
    insights: [
      {
        id: '1',
        type: 'weakness',
        skillArea: 'Algebraic Expressions',
        description: 'Students struggle with combining like terms',
        affectedStudents: 15,
        severity: 'medium',
        recommendations: ['Additional practice with like terms', 'Visual aids for grouping']
      }
    ],
    remediationSuggestions: ['Review basic arithmetic', 'Practice with manipulatives', 'Peer tutoring sessions']
  },
  {
    id: 2,
    title: 'Science Learning Gaps - Physics Concepts',
    subject: 'Science',
    class: '10th B',
    type: 'skill-gap',
    totalQuestions: 30,
    duration: 60,
    created: '2025-09-20',
    status: 'completed',
    participants: 25,
    completed: 25,
    averageScore: 73.2,
    skillAreas: [
      {
        id: '3',
        name: 'Motion and Forces',
        description: 'Understanding motion, velocity, and forces',
        questions: [],
        averagePerformance: 78,
        difficultyLevel: 'intermediate',
        prerequisites: ['Basic math', 'Units and measurements']
      }
    ],
    insights: [
      {
        id: '2',
        type: 'strength',
        skillArea: 'Motion and Forces',
        description: 'Students show strong understanding of velocity concepts',
        affectedStudents: 18,
        severity: 'low',
        recommendations: ['Build on this strength for acceleration concepts']
      }
    ],
    remediationSuggestions: ['Use real-world examples', 'Hands-on experiments', 'Video demonstrations']
  },
  {
    id: 3,
    title: 'English Reading Comprehension Assessment',
    subject: 'English',
    class: '8th C',
    type: 'learning-difficulty',
    totalQuestions: 20,
    duration: 40,
    created: '2025-09-18',
    status: 'active',
    participants: 24,
    completed: 18,
    averageScore: 65.8,
    skillAreas: [
      {
        id: '4',
        name: 'Reading Comprehension',
        description: 'Understanding and analyzing text passages',
        questions: [],
        averagePerformance: 62,
        difficultyLevel: 'intermediate',
        prerequisites: ['Vocabulary', 'Basic grammar']
      }
    ],
    insights: [
      {
        id: '3',
        type: 'learning-gap',
        skillArea: 'Reading Comprehension',
        description: 'Difficulty with inference and context clues',
        affectedStudents: 12,
        severity: 'high',
        recommendations: ['Explicit inference instruction', 'Context clues practice', 'Guided reading sessions']
      }
    ],
    remediationSuggestions: ['Small group reading', 'Vocabulary building exercises', 'Reading strategy instruction']
  }
];

export default function DiagnosticAssessmentsPage() {
  const router = useRouter();
  const [assessments] = useState<DiagnosticAssessment[]>(sampleDiagnosticAssessments);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'scheduled' | 'draft'>('all');
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
    router.push('/dashboard/teacher/assessments/diagnostic/create');
  };

  const handleViewAssessment = (assessment: DiagnosticAssessment) => {
    router.push(`/dashboard/teacher/assessments/diagnostic/${assessment.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-teal-500" />
            Diagnostic Assessments
          </h1>
          <p className="text-gray-600 mt-2">
            Identify learning gaps and understand student needs before instruction begins
          </p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700" 
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Diagnostic
        </Button>
      </div>

      {/* Statistics Overview */}
      <DiagnosticStats assessments={assessments} />

      {/* Filters */}
      <Card className="border-teal-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search diagnostics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-400"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-teal-200 focus:border-teal-400">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pre-assessment">Pre-Assessment</SelectItem>
                <SelectItem value="skill-gap">Skill Gap Analysis</SelectItem>
                <SelectItem value="learning-difficulty">Learning Difficulty</SelectItem>
                <SelectItem value="readiness-check">Readiness Check</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="border-teal-200 focus:border-teal-400">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="8th C">Class 8C</SelectItem>
                <SelectItem value="9th A">Class 9A</SelectItem>
                <SelectItem value="10th B">Class 10B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="border-teal-200 focus:border-teal-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
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
            <DiagnosticCard
              key={assessment.id}
              assessment={assessment}
              onView={handleViewAssessment}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No diagnostic assessments found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or create a new diagnostic assessment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
