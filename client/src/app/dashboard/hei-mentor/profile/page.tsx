// src/app/dashboard/hei-mentor/profile/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Users,
  Award,
  BookOpen,
  Edit,
  Save,
  X
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { HEIMentorDashboardData } from '@/types/hei-mentor';

export default function HEIMentorProfile() {
  const [mentorData, setMentorData] = useState<HEIMentorDashboardData['mentor'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    designation: '',
    department: '',
    qualification: '',
    experience_years: 0,
    max_students: 30,
    expertise: [] as string[],
    research_interests: [] as string[]
  });

  // Fix for page.tsx profile page

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        
        // ✅ FIX: API returns APIResponse<any> with .data property
        const response = await heiMentorAPI.getMentorProfile();
        
        // Add logging to see structure
        console.log('📦 Full API Response:', response);
        console.log('📦 Response Data:', response.data);
        
        // Check if response has error
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Extract the actual mentor data from response.data
        const mentorData = response.data.data;
        
        console.log('✅ Mentor Data:', mentorData);
        
        setMentorData(mentorData);
        setFormData({
          designation: mentorData.profile.designation || '',
          department: mentorData.profile.department || '',
          qualification: mentorData.profile.qualification || '',
          experience_years: mentorData.profile.experience_years || 0,
          max_students: mentorData.profile.max_students,
          expertise: mentorData.profile.expertise,
          research_interests: mentorData.profile.research_interests
        });
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, []);


  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update profile
      await heiMentorAPI.updateMentorProfile(formData);
      
      setEditing(false);
      
      // ✅ FIX: Extract .data from the APIResponse
      const response = await heiMentorAPI.getMentorProfile();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Extract mentor data from response.data
      const updatedData = response.data.data;
      setMentorData(updatedData);
      
    } catch (err) {
      setError('Failed to update profile');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    if (mentorData) {
      setFormData({
        designation: mentorData.profile.designation || '',
        department: mentorData.profile.department || '',
        qualification: mentorData.profile.qualification || '',
        experience_years: mentorData.profile.experience_years || 0,
        max_students: mentorData.profile.max_students,
        expertise: mentorData.profile.expertise,
        research_interests: mentorData.profile.research_interests
      });
    }
    setEditing(false);
  };

  const handleExpertiseChange = (value: string) => {
    const expertise = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, expertise }));
  };

  const handleResearchInterestsChange = (value: string) => {
    const research_interests = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, research_interests }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !mentorData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Failed to load profile'}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { user, profile, hei } = mentorData;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                  {user.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-lg text-gray-600">
                  {profile.designation} • {profile.department}
                </p>
                <p className="text-sm text-gray-500">{hei.name}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <span className="text-sm text-gray-500">
                    {profile.experience_years} years experience
                  </span>
                </div>
              </div>
            </div>
            
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{user.phone_number || 'Not provided'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{hei.location}, {hei.district}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Mentoring Capacity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maximum Students</span>
              {editing ? (
                <Input
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    max_students: parseInt(e.target.value) || 30
                  }))}
                  className="w-20 h-8 text-right"
                  min="1"
                  max="100"
                />
              ) : (
                <span className="font-semibold">{profile.max_students}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Employee ID</span>
              <span className="font-semibold">{profile.employee_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Joined</span>
              <span className="font-semibold">
                {new Date(profile.created_at).toLocaleDateString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <span>Professional Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Designation</Label>
              {editing ? (
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="e.g., Assistant Professor"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.designation || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Department</Label>
              {editing ? (
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Computer Science and Engineering"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.department || 'Not specified'}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Experience (Years)</Label>
              {editing ? (
                <Input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    experience_years: parseInt(e.target.value) || 0
                  }))}
                  placeholder="Years of experience"
                  className="mt-1"
                  min="0"
                  max="50"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.experience_years || 0} years</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Qualification</Label>
              {editing ? (
                <Textarea
                  value={formData.qualification}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                  placeholder="e.g., Ph.D. in Computer Science from IIT Delhi"
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.qualification || 'Not specified'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <span>Expertise & Interests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Areas of Expertise</Label>
              {editing ? (
                <Textarea
                  value={formData.expertise.join(', ')}
                  onChange={(e) => handleExpertiseChange(e.target.value)}
                  placeholder="e.g., Artificial Intelligence, Data Science, Python Programming"
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Research Interests</Label>
              {editing ? (
                <Textarea
                  value={formData.research_interests.join(', ')}
                  onChange={(e) => handleResearchInterestsChange(e.target.value)}
                  placeholder="e.g., Machine Learning, Educational Technology"
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.research_interests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institution Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span>Institution Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Institution Name</Label>
              <p className="mt-1 text-sm text-gray-900">{hei.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Type</Label>
              <p className="mt-1 text-sm text-gray-900">{hei.type || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Location</Label>
              <p className="mt-1 text-sm text-gray-900">{hei.location}, {hei.district}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
