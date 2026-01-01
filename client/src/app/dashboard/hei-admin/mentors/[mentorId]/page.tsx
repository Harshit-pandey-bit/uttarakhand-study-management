'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import heiAdminAPI from '@/lib/api/hei-admin-client';
import {
  MentorDetails,
  MentorStatus,
  AssignmentStatus,
} from '@/types/hei-admin-types';

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params.mentorId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentor, setMentor] = useState<MentorDetails | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [assignmentToRemove, setAssignmentToRemove] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (mentorId) {
      loadMentorDetails();
    }
  }, [mentorId]);

  const loadMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await heiAdminAPI.getMentor(mentorId);

      if (response.success && response.data) {
        setMentor(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to load mentor details');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: MentorStatus) => {
    if (!mentor) return;

    try {
      const response = await heiAdminAPI.updateMentorStatus(mentor.id, newStatus);
      if (response.success) {
        setMentor({ ...mentor, status: newStatus });
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };


  const handleRemoveAssignment = async () => {
    if (!assignmentToRemove) return;

    try {
      setRemoving(true);
      const response = await heiAdminAPI.removeAssignment(assignmentToRemove);

      if (response.success) {
        // Reload mentor details
        await loadMentorDetails();
        setShowRemoveDialog(false);
        setAssignmentToRemove(null);
      }
    } catch (err) {
      console.error('Remove assignment failed:', err);
    } finally {
      setRemoving(false);
    }
  };

  const getStatusBadgeVariant = (status: MentorStatus | string) => {
    // Normalize status to lowercase string for comparison
    const statusStr = (status || 'active').toString().toLowerCase();

    switch (statusStr) {
      case 'active':
        return 'default';
      case 'away':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getAssignmentStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'reassigned':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Mentor Profile</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  Go Back
                </Button>
                <Button onClick={loadMentorDetails}>Try Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/hei-admin/mentors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Mentors
            </Button>
          </Link>
        </div>
      </div>

      {/* Mentor Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback className="text-2xl">
                  {mentor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge variant={getStatusBadgeVariant(mentor.status)} className="mb-2">
                {mentor.status}
              </Badge>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{mentor.designation}</p>
                  <p className="text-sm text-gray-500">{mentor.department}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${mentor.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  {mentor.contactNumber && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${mentor.contactNumber}`, '_blank')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{mentor.email}</span>
                </div>
                {mentor.contactNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{mentor.contactNumber}</span>
                  </div>
                )}
                {mentor.employeeId && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>ID: {mentor.employeeId}</span>
                  </div>
                )}
              </div>

              {mentor.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">{mentor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Schools Assigned</p>
                <p className="text-2xl font-bold mt-1">{mentor.assignedSchoolsCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Max: {mentor.maxStudents}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students Supervised</p>
                <p className="text-2xl font-bold mt-1">{mentor.totalStudentsSupervised}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-2xl font-bold mt-1">{mentor.experienceYears}</p>
                <p className="text-xs text-gray-500 mt-1">years</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-sm font-medium mt-1">
                  {new Date(mentor.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Professional Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{mentor.qualification}</p>
            </CardContent>
          </Card>

          {/* Expertise */}
          {mentor.expertise.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((exp, index) => (
                    <Badge key={index} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Research Interests */}
          {mentor.researchInterests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Research Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.researchInterests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Status Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mentor.status !== MentorStatus.ACTIVE && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange(MentorStatus.ACTIVE)}
                >
                  <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                  Mark as Active
                </Button>
              )}
              {mentor.status !== MentorStatus.AWAY && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange(MentorStatus.AWAY)}
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  Mark as Away
                </Button>
              )}
              {mentor.status !== MentorStatus.INACTIVE && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange(MentorStatus.INACTIVE)}
                >
                  <UserX className="h-4 w-4 mr-2 text-red-600" />
                  Mark as Inactive
                </Button>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Assigned Schools */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assigned Schools ({mentor.assignedSchools.length})</CardTitle>
                <Link href="/dashboard/hei-admin/mentors/assign">
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign More Schools
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Schools currently assigned to this mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mentor.assignedSchools.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No schools assigned yet</p>
                  <Link href="/dashboard/hei-admin/mentors/assign">
                    <Button variant="outline" size="sm">
                      Assign Schools
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Teachers</TableHead>
                        <TableHead>Assigned Date</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentor.assignedSchools.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{assignment.schoolName}</p>
                              {assignment.schoolLogo && (
                                <img
                                  src={assignment.schoolLogo}
                                  alt={assignment.schoolName}
                                  className="h-6 w-6 rounded mt-1"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{assignment.location}</p>
                              <p className="text-gray-500">{assignment.district}</p>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.studentsCount}</TableCell>
                          <TableCell>{assignment.teachersCount}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(assignment.assignmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {assignment.lastVisitDate
                              ? new Date(assignment.lastVisitDate).toLocaleDateString()
                              : 'Not visited'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getAssignmentStatusBadge(assignment.status)}>
                              {assignment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Link href={`/dashboard/hei-admin/partnerships/${assignment.schoolId}`}>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              {assignment.status === 'active' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setAssignmentToRemove(assignment.id);
                                    setShowRemoveDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Assignment Notes */}
              {mentor.assignedSchools.some((a) => a.notes) && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-sm">Assignment Notes</h4>
                  {mentor.assignedSchools
                    .filter((a) => a.notes)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <p className="font-medium text-gray-900 mb-1">
                          {assignment.schoolName}
                        </p>
                        <p className="text-gray-600">{assignment.notes}</p>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove Assignment Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove School Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this school assignment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRemoveDialog(false);
                setAssignmentToRemove(null);
              }}
              disabled={removing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveAssignment}
              disabled={removing}
            >
              {removing ? 'Removing...' : 'Remove Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
