'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Eye, EyeOff, X, Users, BookOpen, Award, Sparkles, ArrowRight, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { UserRole } from '@/types/auth';

// Dummy data for dropdowns
const dummySchools = [
  { id: 'SCH001', name: 'Govt Senior Secondary School Dehradun' },
  { id: 'SCH002', name: 'Govt High School Rishikesh' },
  { id: 'SCH003', name: 'Rajkiya Inter College Haridwar' },
  { id: 'SCH004', name: 'Government School Nainital' }
];

const dummyHEIs = [
  { id: 'HEI001', name: 'Indian Institute of Technology Roorkee' },
  { id: 'HEI002', name: 'Doon University Dehradun' },
  { id: 'HEI003', name: 'Gurukula Kangri Vishwavidyalaya' },
  { id: 'HEI004', name: 'Uttarakhand Technical University' }
];

const classLevels = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 
  'Social Science', 'Computer Science', 'Sanskrit', 'Physical Education'
];

const qualifications = [
  'Bachelor of Education (B.Ed)', 'Master of Education (M.Ed)', 
  'Bachelor of Science (B.Sc)', 'Master of Science (M.Sc)',
  'Bachelor of Arts (B.A)', 'Master of Arts (M.A)', 'Ph.D'
];

const designations = [
  'Principal', 'Vice Principal', 'Head Teacher', 'Assistant Teacher',
  'Professor', 'Assistant Professor', 'Associate Professor', 'Lecturer'
];

const careerSuggestions = [
  'Astronaut', 'Doctor', 'Engineer', 'Scientist', 'Teacher', 'AI Researcher',
  'Environmental Scientist', 'Data Scientist', 'Software Developer'
];

const responsibilities = [
  'Academic Administration', 'Student Affairs', 'Infrastructure Management',
  'Staff Management', 'Partnership Coordination', 'Finance Management'
];

const roleDisplayNames = {
  'student': 'Student',
  'teacher': 'Teacher',
  'hei-mentor': 'HEI Mentor', 
  'hei-admin': 'HEI Admin',
  'school-admin': 'School Admin'
};

// Features for left panel
const features = [
  {
    icon: Users,
    title: 'Join Our Community',
    description: 'Connect with students, teachers, and mentors across the UK'
  },
  {
    icon: BookOpen,
    title: 'Quality Education',
    description: 'Access NCERT-aligned curriculum and resources'
  },
  {
    icon: Award,
    title: 'Growth Tracking',
    description: 'Monitor your academic progress and achievements'
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
    full_name: '',
    phone: '',
    // Role-specific fields will be added dynamically
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleCommonFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTagToggle = (tag: string, field: string) => {
    const currentTags = formData[field] || [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    setFormData({ ...formData, [field]: newTags });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.role || !formData.full_name) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    // Updated validation for simplified fields
    switch (formData.role) {
      case 'student':
        if (!formData.school_id || !formData.class_level) {
          setError('Please select school and class level');
          return false;
        }
        break;
      case 'teacher':
        if (!formData.school_id || !formData.qualification || 
            !formData.experience_years || !formData.primary_subject) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 'hei-mentor':
        if (!formData.hei_id || !formData.designation || !formData.department ||
            !formData.qualification || !formData.experience_years || !formData.primary_expertise) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 'hei-admin':
        if (!formData.hei_id || !formData.designation) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 'school-admin':
        if (!formData.school_id || !formData.designation) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateStep2()) {
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, this would create the user account
    console.log('Registration data:', formData);
    
    // Redirect to login with success message
    router.push('/auth/login?registered=true');
    
    setLoading(false);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Class Level *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('class_level', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {classLevels.map(level => (
                    <SelectItem key={level} value={level} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Career Aspiration</Label>
              <Input
                placeholder="What do you want to become? (e.g., Astronaut, Doctor)"
                value={formData.career_aspiration || ''}
                onChange={(e) => handleCommonFieldChange('career_aspiration', e.target.value)}
                list="career-suggestions"
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
              <datalist id="career-suggestions">
                {careerSuggestions.map(career => (
                  <option key={career} value={career} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Parent Contact</Label>
              <Input
                type="tel"
                placeholder="Parent's phone number"
                value={formData.parent_contact || ''}
                onChange={(e) => handleCommonFieldChange('parent_contact', e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Address</Label>
              <Textarea
                placeholder="Your address"
                value={formData.address || ''}
                onChange={(e) => handleCommonFieldChange('address', e.target.value)}
                rows={3}
                className="border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
            </div>
          </div>
        );

      case 'teacher':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Employee ID</Label>
              <Input
                placeholder="Your employee ID"
                value={formData.employee_id || ''}
                onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>

            {/* Simplified Subject Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Primary Subject *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('primary_subject', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your main subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Additional Subjects (Optional)</Label>
              <Textarea
                placeholder="List any additional subjects you teach (comma-separated)"
                value={formData.additional_subjects || ''}
                onChange={(e) => handleCommonFieldChange('additional_subjects', e.target.value)}
                rows={2}
                className="border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Qualification *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('qualification', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    {qualifications.map(qual => (
                      <SelectItem key={qual} value={qual} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        {qual}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Experience (Years) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Years of experience"
                  value={formData.experience_years || ''}
                  onChange={(e) => handleCommonFieldChange('experience_years', parseInt(e.target.value))}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 'hei-mentor':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Institution *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('hei_id', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {dummyHEIs.map(hei => (
                    <SelectItem key={hei.id} value={hei.id} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {hei.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    {designations.slice(4).map(designation => (
                      <SelectItem key={designation} value={designation} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Department *</Label>
              <Input
                placeholder="Department name"
                value={formData.department || ''}
                onChange={(e) => handleCommonFieldChange('department', e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>

            {/* Simplified Areas of Expertise */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Primary Area of Expertise *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('primary_expertise', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your main expertise" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Additional Areas of Expertise</Label>
              <Textarea
                placeholder="List additional areas of expertise (comma-separated)"
                value={formData.additional_expertise || ''}
                onChange={(e) => handleCommonFieldChange('additional_expertise', e.target.value)}
                rows={2}
                className="border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Qualification *</Label>
                <Input
                  placeholder="Your highest qualification"
                  value={formData.qualification || ''}
                  onChange={(e) => handleCommonFieldChange('qualification', e.target.value)}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Experience (Years) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Years of experience"
                  value={formData.experience_years || ''}
                  onChange={(e) => handleCommonFieldChange('experience_years', parseInt(e.target.value))}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Max Students</Label>
              <Input
                type="number"
                min="1"
                max="100"
                placeholder="30"
                value={formData.max_students || ''}
                onChange={(e) => handleCommonFieldChange('max_students', parseInt(e.target.value))}
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>
          </div>
        );

      case 'hei-admin':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Institution *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('hei_id', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {dummyHEIs.map(hei => (
                    <SelectItem key={hei.id} value={hei.id} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {hei.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    {designations.map(designation => (
                      <SelectItem key={designation} value={designation} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Department</Label>
              <Input
                placeholder="Department name"
                value={formData.department || ''}
                onChange={(e) => handleCommonFieldChange('department', e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>

            {/* Simplified Responsibilities */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Primary Responsibility</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('primary_responsibility', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your main responsibility" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {responsibilities.map(responsibility => (
                    <SelectItem key={responsibility} value={responsibility} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {responsibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Additional Responsibilities</Label>
              <Textarea
                placeholder="Describe any additional responsibilities (optional)"
                value={formData.additional_responsibilities || ''}
                onChange={(e) => handleCommonFieldChange('additional_responsibilities', e.target.value)}
                rows={2}
                className="border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
            </div>
          </div>
        );

      case 'school-admin':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                  className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    {designations.slice(0, 4).map(designation => (
                      <SelectItem key={designation} value={designation} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Simplified Responsibilities */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Primary Responsibility</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('primary_responsibility', value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Select your main responsibility" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {responsibilities.map(responsibility => (
                    <SelectItem key={responsibility} value={responsibility} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      {responsibility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Additional Responsibilities</Label>
              <Textarea
                placeholder="Describe any additional responsibilities (optional)"
                value={formData.additional_responsibilities || ''}
                onChange={(e) => handleCommonFieldChange('additional_responsibilities', e.target.value)}
                rows={2}
                className="border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Panel - Similar to Login Page */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-16 w-24 h-24 bg-white rounded-full blur-lg animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full blur-md animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
          {/* Logo Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6 group">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 transition-all duration-500 group-hover:bg-white/30 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/20">
                <GraduationCap className="h-9 w-9 text-white transition-transform duration-500 group-hover:rotate-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold transition-all duration-300 hover:text-blue-200 cursor-default">UK-GSMP</h1>
                <p className="text-blue-100 text-lg transition-all duration-300 hover:text-white cursor-default">UK Government School Mentoring Program</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-100 group cursor-default">
              <Sparkles className="h-5 w-5 transition-all duration-300 group-hover:text-yellow-300 group-hover:animate-pulse" />
              <span className="text-lg transition-all duration-300 group-hover:text-white">Join our educational community</span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 group hover:transform hover:translate-x-3 transition-all duration-500 cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/25 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-white/20 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-blue-200">{feature.title}</h3>
                  <p className="text-blue-100 leading-relaxed transition-colors duration-300 group-hover:text-white">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Quote */}
          <div className="mt-16 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 cursor-default group">
            <p className="text-lg italic text-blue-50 mb-3 transition-colors duration-300 group-hover:text-white">
              "The best way to predict the future is to create it through education."
            </p>
            <p className="text-blue-200 font-medium transition-colors duration-300 group-hover:text-blue-100">- Peter Drucker</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4 group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-blue-700 group-hover:scale-105 group-hover:shadow-lg">
                <GraduationCap className="h-7 w-7 text-white transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-300 hover:text-blue-600 cursor-default">UK-GSMP</h1>
                <p className="text-sm text-gray-500 transition-colors duration-300 hover:text-gray-700 cursor-default">UK Government School Mentoring Program</p>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:bg-white/90">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-white to-gray-50">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600 cursor-default">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg transition-colors duration-300 hover:text-gray-800 cursor-default">
                Step {step} of 2: {step === 1 ? 'Basic Information' : `${roleDisplayNames[formData.role as UserRole]} Details`}
              </CardDescription>
              
              {/* Enhanced Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${(step / 2) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span className={`transition-colors duration-300 ${step >= 1 ? 'text-blue-600 font-medium' : ''}`}>
                  {step >= 1 && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  Basic Info
                </span>
                <span className={`transition-colors duration-300 ${step >= 2 ? 'text-blue-600 font-medium' : ''}`}>
                  {step >= 2 && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  Role Details
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {step === 1 ? (
                  // Step 1: Enhanced Common Fields
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Full Name *</span>
                        </Label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.full_name}
                          onChange={(e) => handleCommonFieldChange('full_name', e.target.value)}
                          onFocus={() => setFocusedField('full_name')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-12 border-2 rounded-xl transition-all duration-300 ${
                            focusedField === 'full_name' 
                              ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Role *</Label>
                        <Select onValueChange={(value: UserRole) => handleCommonFieldChange('role', value)}>
                          <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-2 shadow-xl">
                            {Object.entries(roleDisplayNames).map(([value, label]) => (
                              <SelectItem key={value} value={value} className="rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>Email Address *</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="your.email@school.edu"
                        value={formData.email}
                        onChange={(e) => handleCommonFieldChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`h-12 border-2 rounded-xl transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleCommonFieldChange('phone', e.target.value)}
                        className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-gray-500" />
                          <span>Password *</span>
                        </Label>
                        <div className="relative group">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleCommonFieldChange('password', e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={`h-12 border-2 rounded-xl pr-12 transition-all duration-300 ${
                              focusedField === 'password' 
                                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]' 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Confirm Password *</Label>
                        <div className="relative group">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleCommonFieldChange('confirmPassword', e.target.value)}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            className={`h-12 border-2 rounded-xl pr-12 transition-all duration-300 ${
                              focusedField === 'confirmPassword' 
                                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]' 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Step 2: Enhanced Role-specific Fields
                  <>
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 transition-all duration-300 hover:shadow-md">
                      <p className="text-sm font-semibold text-blue-800 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete your {roleDisplayNames[formData.role as UserRole]} profile</span>
                      </p>
                    </div>
                    {renderRoleSpecificFields()}
                  </>
                )}

                {/* Enhanced Error Alert */}
                {error && (
                  <Alert className="border-2 border-red-200 bg-red-50 rounded-xl animate-in slide-in-from-top-4 duration-500 mt-6">
                    <AlertDescription className="text-red-700 font-semibold">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Form Actions */}
                <div className="flex justify-between mt-8">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-md hover:scale-105"
                    >
                      Back
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    className={`h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden ${step === 1 ? 'ml-auto' : ''}`}
                    disabled={loading}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    <span className="relative flex items-center space-x-2">
                      <span>{loading ? 'Creating Account...' : step === 1 ? 'Next' : 'Create Account'}</span>
                      {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />}
                      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    </span>
                  </Button>
                </div>
              </form>

              {/* Enhanced Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
