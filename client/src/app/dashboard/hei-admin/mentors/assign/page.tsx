'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Building2,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  X,
} from 'lucide-react';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  UnassignedSchool,
  MentorCapacity,
  CreateAssignment,
} from '@/types/hei-admin-types';

export default function AssignMentorsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [unassignedSchools, setUnassignedSchools] = useState<UnassignedSchool[]>([]);
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [mentorCapacity, setMentorCapacity] = useState<MentorCapacity | null>(null);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const schoolsResponse = await heiAdminAPI.getUnassignedSchools();
      if (schoolsResponse.success && schoolsResponse.data) {
        setUnassignedSchools(schoolsResponse.data);
      }

      const mentorsResponse = await heiAdminAPI.getAvailableMentors();
      if (mentorsResponse.success && mentorsResponse.data) {
        setAvailableMentors(mentorsResponse.data);
      }

    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSelect = async (mentor: any) => {
    if (!mentor?.id) {
      console.error('Invalid mentor selected:', mentor);
      setError('Invalid mentor selected');
      return;
    }

    setSelectedMentor(mentor);
    setSelectedSchools([]);
    setError(null);
    setMentorCapacity(null);

    const createFallbackCapacity = (): MentorCapacity => {
      const maxCap = mentor.max_students || mentor.maxCapacity || 10;
      const currentCount = mentor.currentSchoolsCount || mentor.assignedSchoolsCount || 0;
      const available = Math.max(0, maxCap - currentCount);
      const workload = maxCap > 0 ? Math.round((currentCount / maxCap) * 100) : 0;

      return {
        mentorId: mentor.id,
        mentorName: mentor.name || 'Unknown',
        maxCapacity: maxCap,
        currentSchoolsCount: currentCount,
        availableCapacity: available,
        workloadPercentage: workload,
        assignedSchools: [],
      };
    };

    try {
      const capacityResponse = await heiAdminAPI.getMentorCapacity(mentor.id);
      
      if (capacityResponse.success && capacityResponse.data) {
        setMentorCapacity(capacityResponse.data);
      } else {
        setMentorCapacity(createFallbackCapacity());
      }
    } catch (err: any) {
      console.error('Error loading mentor capacity:', err);
      setMentorCapacity(createFallbackCapacity());
    }
  };

  const handleSchoolToggle = (schoolId: string) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const handleAssign = async () => {
    if (!selectedMentor || selectedSchools.length === 0) {
      setError('Please select a mentor and at least one school');
      return;
    }

    if (mentorCapacity && selectedSchools.length > mentorCapacity.availableCapacity) {
      setError(`Cannot assign: Mentor only has ${mentorCapacity.availableCapacity} available slot(s)`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const assignmentData: CreateAssignment = {
        mentorId: selectedMentor.id,
        schoolIds: selectedSchools,
        assignmentDate: new Date().toISOString(),
        sendNotification: true,
      };

      const response = await heiAdminAPI.createAssignment(assignmentData);

      if (response.success) {
        setSuccessMessage(`Successfully assigned ${selectedSchools.length} school(s) to ${selectedMentor.name}`);
        setSelectedSchools([]);
        setSelectedMentor(null);
        setMentorCapacity(null);
        loadData();
      } else {
        setError(response.error || 'Failed to create assignment');
      }
    } catch (err: any) {
      console.error('Error creating assignment:', err);
      setError(err.message || 'Failed to create assignment');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assign Mentors to Schools</h1>
        <p className="text-gray-600 mt-1">Select schools and assign them to available mentors</p>
      </div>

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <p>{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableMentors.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No mentors available</p>
                ) : (
                  availableMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      onClick={() => handleMentorSelect(mentor)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMentor?.id === mentor.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {(mentor.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{mentor.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{mentor.designation || 'N/A'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {mentor.currentSchoolsCount || 0}/{mentor.max_students || 10} schools
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedMentor && mentorCapacity && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Mentor Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Schools:</span>
                    <span className="font-medium">{mentorCapacity.currentSchoolsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Capacity:</span>
                    <span className="font-medium">{mentorCapacity.maxCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available Slots:</span>
                    <span className="font-medium text-green-600">{mentorCapacity.availableCapacity}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Workload</span>
                      <span className="text-xs font-medium">{mentorCapacity.workloadPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          mentorCapacity.workloadPercentage >= 90
                            ? 'bg-red-500'
                            : mentorCapacity.workloadPercentage >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(mentorCapacity.workloadPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Unassigned Schools</CardTitle>
                <Badge variant="outline">{selectedSchools.length} selected</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search schools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredSchools.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No unassigned schools found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try adjusting your search query' : 'All schools have been assigned mentors'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => selectedMentor && handleSchoolToggle(school.id)}
                      className={`p-4 border rounded-lg transition-all ${
                        !selectedMentor
                          ? 'opacity-50 cursor-not-allowed'
                          : selectedSchools.includes(school.id)
                          ? 'border-blue-500 bg-blue-50 cursor-pointer'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{school.name}</h3>
                            {school.urgency && (
                              <Badge
                                variant={
                                  school.urgency === 'high'
                                    ? 'destructive'
                                    : school.urgency === 'medium'
                                    ? 'default'
                                    : 'outline'
                                }
                                className="text-xs"
                              >
                                {school.urgency} priority
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{school.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{school.studentsCount} students • {school.teachersCount} teachers</span>
                            </div>
                          </div>

                          {school.principalName && (
                            <p className="text-xs text-gray-500 mt-2">Principal: {school.principalName}</p>
                          )}
                        </div>

                        {selectedSchools.includes(school.id) && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMentor &&
                mentorCapacity !== null &&
                selectedSchools.length > mentorCapacity.availableCapacity && (
                  <Card className="mt-4 border-red-200 bg-red-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Capacity Exceeded</p>
                          <p className="text-sm mt-1">
                            You've selected {selectedSchools.length} school(s), but this mentor only has{' '}
                            {mentorCapacity.availableCapacity} available slot(s).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSchools([]);
                    setSelectedMentor(null);
                    setMentorCapacity(null);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  disabled={submitting}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={
                    !selectedMentor ||
                    selectedSchools.length === 0 ||
                    submitting ||
                    (mentorCapacity !== null && selectedSchools.length > mentorCapacity.availableCapacity)
                  }
                  className="flex-1"
                >
                  {submitting ? (
                    'Assigning...'
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Assign {selectedSchools.length} School(s)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
