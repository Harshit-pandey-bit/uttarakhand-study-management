'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface AssessmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  classFilter: string;
  onClassChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  subjectFilter?: string;
  onSubjectChange?: (value: string) => void;
}

export default function AssessmentFilters({
  searchTerm,
  onSearchChange,
  classFilter,
  onClassChange,
  statusFilter,
  onStatusChange,
  subjectFilter = 'all',
  onSubjectChange
}: AssessmentFiltersProps) {
  return (
    <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-indigo-200 focus:border-indigo-400"
          />
        </div>

        {/* Subject Filter */}
        {onSubjectChange && (
          <Select value={subjectFilter} onValueChange={onSubjectChange}>
            <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Social Science">Social Science</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Class Filter */}
        <Select value={classFilter} onValueChange={onClassChange}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="6th">Class 6</SelectItem>
            <SelectItem value="7th">Class 7</SelectItem>
            <SelectItem value="8th">Class 8</SelectItem>
            <SelectItem value="9th">Class 9</SelectItem>
            <SelectItem value="10th">Class 10</SelectItem>
            <SelectItem value="11th">Class 11</SelectItem>
            <SelectItem value="12th">Class 12</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="border-indigo-200 focus:border-indigo-400">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
