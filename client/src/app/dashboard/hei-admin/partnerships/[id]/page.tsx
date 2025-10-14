'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MapPin,
  Users,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  UserCheck,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import heiAdminAPI from '@/lib/api/hei-admin-client';

export default function PartnershipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnership, setPartnership] = useState<any>(null);

  useEffect(() => {
    if (schoolId) {
      loadPartnershipDetails();
    }
  }, [schoolId]);

  const loadPartnershipDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching partnership details for school:', schoolId);
      const response = await heiAdminAPI.getPartnership(schoolId);

      console.log('📊 Partnership API Response:', response);

      if (response.success && response.data) {
        setPartnership(response.data);
      } else {
        setError(response.error || 'Failed to load partnership details');
      }
    } catch (err: any) {
      console.error('❌ Error loading partnership:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partnership details...</p>
        </div>
      </div>
    );
  }

  if (error || !partnership) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  {error || 'Partnership not found'}
                </h3>
                <p className="text-red-700 mb-4">Please check the partnership ID and try again.</p>
                <Button onClick={() => router.push('/dashboard/hei-admin/partnerships')}>
                  Back to Partnerships
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const school = partnership.school || partnership;
  const mentor = partnership.assignedMentor;
  const students = partnership.students || { total: partnership.studentsCount || 0, gradeDistribution: [] };
  const teachers = partnership.teachers || { total: partnership.teachersCount || 0, subjectDistribution: [] };
  const statistics = partnership.statistics || {
    totalMentoringSessions: 0,
    totalAssignmentsCreated: 0,
    studentEngagementRate: 0,
    teacherParticipationRate: 0,
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge className={`${statusColors[status?.toLowerCase()] || statusColors.pending}`}>
        {status || 'Pending'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/hei-admin/partnerships')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {school.location || 'Location not available'}
            </p>
          </div>
        </div>
        {getStatusBadge(school.partnershipStatus || partnership.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - School Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* School Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{school.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">District</p>
                  <p className="font-medium">{school.district || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="font-medium">{school.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Principal</p>
                  <p className="font-medium">{school.principalName || 'N/A'}</p>
                  {school.principalContact && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {school.principalContact}
                    </p>
                  )}
                  {school.principalEmail && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {school.principalEmail}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Partnership Started</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {school.partnershipStartDate
                      ? new Date(school.partnershipStartDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">School Details</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {school.establishedYear && (
                      <Badge variant="outline" className="text-xs">
                        Established: {school.establishedYear}
                      </Badge>
                    )}
                    {school.schoolType && (
                      <Badge variant="outline" className="text-xs">
                        Type: {school.schoolType}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold">{students.total || 0}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold">{teachers.total || 0}</p>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold">{statistics.totalMentoringSessions}</p>
                  <p className="text-sm text-gray-600">Mentoring Sessions</p>
                  <p className="text-xs text-gray-500 mt-1">Total sessions conducted</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                  <p className="text-2xl font-bold">{statistics.studentEngagementRate}%</p>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-xs text-gray-500 mt-1">Active participation rate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure */}
          {school.infrastructure && (
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure & Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(school.infrastructure, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Assigned Mentor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Assigned Mentor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mentor ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                      {mentor.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{mentor.email}</p>
                      {mentor.designation && (
                        <Badge variant="outline" className="mt-2">
                          {mentor.designation}
                        </Badge>
                      )}
                      {mentor.department && (
                        <p className="text-xs text-gray-500 mt-1">{mentor.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {mentor.contactNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{mentor.contactNumber}</span>
                      </div>
                    )}
                    {mentor.assignmentDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Assigned on: {new Date(mentor.assignmentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* <Button className="w-full" variant="outline">
                    View Mentor Profile
                  </Button> */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No mentor assigned</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Assign a mentor to this school to begin mentoring activities
                  </p>
                  <Button className="w-full">Assign Mentor</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {partnership.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{partnership.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
