'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Building2,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Search,
  UserCheck,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  UnassignedSchool,
  HEIMentor,
  MentorCapacity,
  CreateAssignment,
} from '@/types/hei-admin-types';

export default function AssignMentorPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [unassignedSchools, setUnassignedSchools] = useState<UnassignedSchool[]>([]);
  const [availableMentors, setAvailableMentors] = useState<HEIMentor[]>([]);
  
  // Selection states
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [mentorCapacity, setMentorCapacity] = useState<MentorCapacity | null>(null);
  
  // Form states
  const [assignmentDate, setAssignmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedMentorId) {
      loadMentorCapacity(selectedMentorId);
    } else {
      setMentorCapacity(null);
    }
  }, [selectedMentorId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schoolsResponse, mentorsResponse] = await Promise.all([
        heiAdminAPI.getUnassignedSchools(),
        heiAdminAPI.getAvailableMentors(),
      ]);

      if (schoolsResponse.success && schoolsResponse.data) {
        setUnassignedSchools(schoolsResponse.data);
      }

      if (mentorsResponse.success && mentorsResponse.data) {
        setAvailableMentors(mentorsResponse.data);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadMentorCapacity = async (mentorId: string) => {
    try {
      const response = await heiAdminAPI.getMentorCapacity(mentorId);
      if (response.success && response.data) {
        setMentorCapacity(response.data);
      }
    } catch (err) {
      console.error('Failed to load mentor capacity:', err);
    }
  };

  const handleSchoolToggle = (schoolId: string) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSchools.length === filteredSchools.length) {
      setSelectedSchools([]);
    } else {
      setSelectedSchools(filteredSchools.map((s) => s.id));
    }
  };

  const handleAssignMentor = async () => {
    if (!selectedMentorId || selectedSchools.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      const assignmentData: CreateAssignment = {
        mentorId: selectedMentorId,
        schoolIds: selectedSchools,
        assignmentDate,
        notes: notes.trim() || undefined,
        sendNotification,
      };

      const response = await heiAdminAPI.createAssignment(assignmentData);

      if (response.success) {
        setSuccessMessage(
          `Successfully assigned ${selectedSchools.length} school(s) to mentor`
        );
        // Reset form
        setSelectedSchools([]);
        setSelectedMentorId('');
        setNotes('');
        setShowConfirmDialog(false);
        // Reload data
        loadData();
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || 'Failed to create assignment');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchools = unassignedSchools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMentor = availableMentors.find((m) => m.id === selectedMentorId);

  const canAssign =
    selectedSchools.length > 0 &&
    selectedMentorId &&
    mentorCapacity &&
    selectedSchools.length <= mentorCapacity.availableCapacity;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/hei-admin/mentors">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Mentors
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Assign Mentors to Schools</h1>
          <p className="text-gray-600 mt-1">
            Select schools and assign them to available mentors
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Schools Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Unassigned Schools ({filteredSchools.length})</span>
                {selectedSchools.length > 0 && (
                  <Badge variant="default">
                    {selectedSchools.length} selected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Select one or more schools to assign to a mentor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search schools by name, location, or district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {filteredSchools.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedSchools.length === filteredSchools.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                )}
              </div>

              {/* Schools List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredSchools.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No unassigned schools found</p>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'All schools have been assigned mentors'}
                    </p>
                  </div>
                ) : (
                  filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedSchools.includes(school.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => handleSchoolToggle(school.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedSchools.includes(school.id)}
                          onCheckedChange={() => handleSchoolToggle(school.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {school.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>
                                  {school.location}, {school.district}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={getUrgencyColor(school.urgency)}
                              variant="outline"
                            >
                              {school.urgency} priority
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{school.studentsCount} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-4 w-4" />
                              <span>{school.teachersCount} teachers</span>
                            </div>
                            {school.requestDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Requested{' '}
                                  {new Date(school.requestDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          {school.principalName && (
                            <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                              <span className="font-medium">Principal: </span>
                              {school.principalName}
                              {school.principalContact && (
                                <span className="ml-2">({school.principalContact})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Mentor Selection & Assignment */}
        <div className="space-y-4">
          {/* Mentor Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Mentor</CardTitle>
              <CardDescription>
                Choose an available mentor for assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mentor-select">Available Mentors</Label>
                <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                  <SelectTrigger id="mentor-select">
                    <SelectValue placeholder="Choose a mentor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMentors.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No mentors available
                      </SelectItem>
                    ) : (
                      availableMentors.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name} - {mentor.designation}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Mentor Details */}
              {selectedMentor && mentorCapacity && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedMentor.avatar} />
                      <AvatarFallback>
                        {selectedMentor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedMentor.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedMentor.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Schools:</span>
                      <span className="font-medium">
                        {mentorCapacity.currentSchoolsCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Capacity:</span>
                      <span className="font-medium">
                        {mentorCapacity.maxCapacity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <Badge
                        variant={
                          mentorCapacity.availableCapacity > 5
                            ? 'default'
                            : mentorCapacity.availableCapacity > 0
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {mentorCapacity.availableCapacity} slots
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Workload:</span>
                      <span className="font-medium">
                        {mentorCapacity.workloadPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Workload Warning */}
                  {selectedSchools.length > mentorCapacity.availableCapacity && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-semibold">Capacity Exceeded</p>
                        <p>
                          You've selected {selectedSchools.length} school(s), but this
                          mentor only has {mentorCapacity.availableCapacity} available
                          slot(s).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Expertise */}
                  {selectedMentor.expertise.length > 0 && (
                    <div>
                      <Label className="text-xs text-gray-600 mb-2">Expertise</Label>
                      <div className="flex flex-wrap gap-1">
                        {selectedMentor.expertise.slice(0, 3).map((exp) => (
                          <Badge key={exp} variant="outline" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                        {selectedMentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedMentor.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assignment-date">Assignment Date</Label>
                <Input
                  id="assignment-date"
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notification"
                  checked={sendNotification}
                  onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                />
                <Label
                  htmlFor="notification"
                  className="text-sm font-normal cursor-pointer"
                >
                  Send email notification to mentor
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Summary & Action */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Schools Selected:</span>
                  <Badge variant="outline">{selectedSchools.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mentor Selected:</span>
                  <span className="font-medium">
                    {selectedMentor ? 'Yes' : 'No'}
                  </span>
                </div>
                {selectedMentor && mentorCapacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">New Workload:</span>
                    <Badge
                      variant={
                        mentorCapacity.workloadPercentage +
                          (selectedSchools.length /
                            mentorCapacity.maxCapacity) *
                            100 >
                        100
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {Math.round(
                        mentorCapacity.workloadPercentage +
                          (selectedSchools.length /
                            mentorCapacity.maxCapacity) *
                            100
                      )}
                      %
                    </Badge>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!canAssign || submitting}
                onClick={() => setShowConfirmDialog(true)}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign Mentor
                  </>
                )}
              </Button>

              {!canAssign && selectedSchools.length > 0 && selectedMentorId && (
                <p className="text-sm text-red-600 text-center">
                  Cannot assign: Mentor capacity exceeded
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Mentor Assignment</DialogTitle>
            <DialogDescription>
              Please review the assignment details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-600">Mentor</Label>
              <p className="font-semibold">{selectedMentor?.name}</p>
              <p className="text-sm text-gray-600">{selectedMentor?.designation}</p>
            </div>
            <div>
              <Label className="text-gray-600">Schools ({selectedSchools.length})</Label>
              <ul className="mt-2 space-y-1">
                {selectedSchools.slice(0, 5).map((schoolId) => {
                  const school = unassignedSchools.find((s) => s.id === schoolId);
                  return school ? (
                    <li key={schoolId} className="text-sm">
                      • {school.name}
                    </li>
                  ) : null;
                })}
                {selectedSchools.length > 5 && (
                  <li className="text-sm text-gray-600">
                    ... and {selectedSchools.length - 5} more
                  </li>
                )}
              </ul>
            </div>
            <div>
              <Label className="text-gray-600">Assignment Date</Label>
              <p className="font-medium">
                {new Date(assignmentDate).toLocaleDateString()}
              </p>
            </div>
            {notes && (
              <div>
                <Label className="text-gray-600">Notes</Label>
                <p className="text-sm">{notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignMentor} disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
