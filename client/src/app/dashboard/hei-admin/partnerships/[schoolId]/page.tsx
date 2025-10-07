'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Award,
  Clock,
  Edit,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  PartnershipDetails,
  PartnershipStatus,
} from '@/types/hei-admin-types';

export default function PartnershipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnership, setPartnership] = useState<PartnershipDetails | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (schoolId) {
      loadPartnershipDetails();
    }
  }, [schoolId]);

  const loadPartnershipDetails = async () => {
    try {
      setLoading(true);
      const response = await heiAdminAPI.getPartnership(schoolId);

      if (response.success && response.data) {
        setPartnership(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to load partnership details');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: PartnershipStatus) => {
    if (!partnership) return;

    try {
      setUpdatingStatus(true);
      const response = await heiAdminAPI.updatePartnershipStatus(schoolId, newStatus);

      if (response.success) {
        setPartnership({
          ...partnership,
          school: {
            ...partnership.school,
            partnershipStatus: newStatus,
          },
        });
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeVariant = (status: PartnershipStatus) => {
    switch (status) {
      case PartnershipStatus.ACTIVE:
        return 'default';
      case PartnershipStatus.PENDING:
        return 'secondary';
      case PartnershipStatus.INACTIVE:
        return 'outline';
      case PartnershipStatus.SUSPENDED:
        return 'destructive';
      default:
        return 'outline';
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
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Partnership</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  Go Back
                </Button>
                <Button onClick={loadPartnershipDetails}>Try Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { school, assignedMentor, mentorHistory, students, teachers, statistics } = partnership;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/hei-admin/partnerships">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Partnerships
            </Button>
          </Link>
        </div>
        <Button variant="outline" className="gap-2">
          <Send className="h-4 w-4" />
          Send Announcement
        </Button>
      </div>

      {/* School Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* School Logo */}
            <div className="flex flex-col items-center md:items-start">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="h-24 w-24 rounded-lg object-cover mb-4"
                />
              ) : (
                <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <Badge variant={getStatusBadgeVariant(school.partnershipStatus)} className="mb-2">
                {school.partnershipStatus}
              </Badge>
            </div>

            {/* School Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {school.location}, {school.district}, {school.state}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {school.principalName && (
                  <div>
                    <p className="text-sm text-gray-600">Principal</p>
                    <p className="font-medium">{school.principalName}</p>
                    {school.principalContact && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{school.principalContact}</span>
                      </div>
                    )}
                    {school.principalEmail && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{school.principalEmail}</span>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Partnership Started</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {school.partnershipStartDate
                        ? new Date(school.partnershipStartDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Not started'}
                    </span>
                  </div>
                  {school.establishedYear && (
                    <p className="text-sm text-gray-600 mt-2">
                      Established: {school.establishedYear}
                    </p>
                  )}
                  {school.schoolType && (
                    <p className="text-sm text-gray-600 mt-1">Type: {school.schoolType}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Partnership Status</p>
              <p className="text-xs text-gray-500 mt-1">
                Update the partnership status as needed
              </p>
            </div>
            <Select
              value={school.partnershipStatus}
              onValueChange={(value) => handleStatusChange(value as PartnershipStatus)}
              disabled={updatingStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PartnershipStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={PartnershipStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={PartnershipStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={PartnershipStatus.SUSPENDED}>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold mt-1">{students.total}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold mt-1">{teachers.total}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mentoring Sessions</p>
                <p className="text-2xl font-bold mt-1">{statistics.totalMentoringSessions}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold mt-1">{statistics.studentEngagementRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mentor & Demographics */}
        <div className="space-y-6">
          {/* Assigned Mentor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Assigned Mentor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedMentor ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={assignedMentor.avatar} />
                      <AvatarFallback>
                        {assignedMentor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{assignedMentor.name}</p>
                      <p className="text-sm text-gray-600">{assignedMentor.designation}</p>
                      <p className="text-xs text-gray-500">{assignedMentor.department}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${assignedMentor.email}`}
                        className="hover:text-blue-600"
                      >
                        {assignedMentor.email}
                      </a>
                    </div>
                    {assignedMentor.contactNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a
                          href={`tel:${assignedMentor.contactNumber}`}
                          className="hover:text-blue-600"
                        >
                          {assignedMentor.contactNumber}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Assigned{' '}
                        {new Date(assignedMentor.assignmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Link href={`/dashboard/hei-admin/mentors/${assignedMentor.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Mentor Profile
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">No mentor assigned</p>
                  <Link href="/dashboard/hei-admin/mentors/assign">
                    <Button size="sm">Assign Mentor</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentor History */}
          {mentorHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Mentor History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mentorHistory.map((history, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium">{history.mentorName}</p>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(history.assignedDate).toLocaleDateString()} -{' '}
                          {history.endDate
                            ? new Date(history.endDate).toLocaleDateString()
                            : 'Present'}
                        </span>
                      </div>
                      {history.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {history.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.gradeDistribution.map((grade) => (
                  <div key={grade.grade} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{grade.grade}</span>
                    <Badge variant="outline">{grade.count} students</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teacher Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teachers.subjectDistribution.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{subject.subject}</span>
                    <Badge variant="outline">{subject.count} teachers</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Statistics & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Partnership Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Partnership Statistics
              </CardTitle>
              <CardDescription>
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-blue-900 font-medium">Mentoring Sessions</p>
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {statistics.totalMentoringSessions}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Total sessions conducted</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-900 font-medium">Assignments Created</p>
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {statistics.totalAssignmentsCreated}
                  </p>
                  <p className="text-xs text-green-700 mt-1">By teachers and mentors</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-purple-900 font-medium">Student Engagement</p>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {statistics.studentEngagementRate}%
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Active participation rate</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-orange-900 font-medium">Teacher Participation</p>
                    <UserCheck className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {statistics.teacherParticipationRate}%
                  </p>
                  <p className="text-xs text-orange-700 mt-1">Program involvement rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Link href="/dashboard/hei-admin/mentors/assign">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Change Mentor
                  </Button>
                </Link>
                {assignedMentor && (
                  <>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open(`mailto:${assignedMentor.email}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Mentor
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open(`mailto:${school.principalEmail}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Principal
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Partnership Info */}
          {school.infrastructure && (
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(school.infrastructure, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
