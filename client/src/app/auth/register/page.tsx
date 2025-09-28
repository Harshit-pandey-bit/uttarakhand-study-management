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
import { GraduationCap, Eye, EyeOff, X } from 'lucide-react';
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
    // Role-specific validation
    switch (formData.role) {
      case 'student':
        if (!formData.school_id || !formData.class_level) {
          setError('Please select school and class level');
          return false;
        }
        break;
      case 'teacher':
        if (!formData.school_id || !formData.qualification || 
            !formData.experience_years || !formData.subjects?.length) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 'hei-mentor':
        if (!formData.hei_id || !formData.designation || !formData.department ||
            !formData.qualification || !formData.experience_years || !formData.expertise?.length) {
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Class Level *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('class_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  {classLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Career Aspiration</Label>
              <Input
                placeholder="What do you want to become? (e.g., Astronaut, Doctor)"
                value={formData.career_aspiration || ''}
                onChange={(e) => handleCommonFieldChange('career_aspiration', e.target.value)}
                list="career-suggestions"
              />
              <datalist id="career-suggestions">
                {careerSuggestions.map(career => (
                  <option key={career} value={career} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Parent Contact</Label>
              <Input
                type="tel"
                placeholder="Parent's phone number"
                value={formData.parent_contact || ''}
                onChange={(e) => handleCommonFieldChange('parent_contact', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <Textarea
                placeholder="Your address"
                value={formData.address || ''}
                onChange={(e) => handleCommonFieldChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 'teacher':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Employee ID</Label>
              <Input
                placeholder="Your employee ID"
                value={formData.employee_id || ''}
                onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Subjects You Teach *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {subjects.map(subject => (
                  <Badge
                    key={subject}
                    variant={formData.subjects?.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleTagToggle(subject, 'subjects')}
                  >
                    {subject}
                    {formData.subjects?.includes(subject) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Classes You Teach</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {classLevels.map(level => (
                  <Badge
                    key={level}
                    variant={formData.classes?.includes(level) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleTagToggle(level, 'classes')}
                  >
                    {level}
                    {formData.classes?.includes(level) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Qualification *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('qualification', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your highest qualification" />
                </SelectTrigger>
                <SelectContent>
                  {qualifications.map(qual => (
                    <SelectItem key={qual} value={qual}>
                      {qual}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Experience (Years) *</Label>
              <Input
                type="number"
                min="0"
                max="50"
                placeholder="Years of teaching experience"
                value={formData.experience_years || ''}
                onChange={(e) => handleCommonFieldChange('experience_years', parseInt(e.target.value))}
              />
            </div>
          </div>
        );

      case 'hei-mentor':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Institution *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('hei_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  {dummyHEIs.map(hei => (
                    <SelectItem key={hei.id} value={hei.id}>
                      {hei.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.slice(4).map(designation => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Department *</Label>
              <Input
                placeholder="Department name"
                value={formData.department || ''}
                onChange={(e) => handleCommonFieldChange('department', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Areas of Expertise *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {subjects.map(subject => (
                  <Badge
                    key={subject}
                    variant={formData.expertise?.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleTagToggle(subject, 'expertise')}
                  >
                    {subject}
                    {formData.expertise?.includes(subject) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Qualification *</Label>
              <Input
                placeholder="Your highest qualification"
                value={formData.qualification || ''}
                onChange={(e) => handleCommonFieldChange('qualification', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Experience (Years) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Years of experience"
                  value={formData.experience_years || ''}
                  onChange={(e) => handleCommonFieldChange('experience_years', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Max Students</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="30"
                  value={formData.max_students || ''}
                  onChange={(e) => handleCommonFieldChange('max_students', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );

      case 'hei-admin':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Institution *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('hei_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  {dummyHEIs.map(hei => (
                    <SelectItem key={hei.id} value={hei.id}>
                      {hei.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map(designation => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Department</Label>
              <Input
                placeholder="Department name"
                value={formData.department || ''}
                onChange={(e) => handleCommonFieldChange('department', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Responsibilities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {responsibilities.map(responsibility => (
                  <Badge
                    key={responsibility}
                    variant={formData.responsibilities?.includes(responsibility) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleTagToggle(responsibility, 'responsibilities')}
                  >
                    {responsibility}
                    {formData.responsibilities?.includes(responsibility) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'school-admin':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">School *</Label>
              <Select onValueChange={(value) => handleCommonFieldChange('school_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {dummySchools.map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Employee ID</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleCommonFieldChange('employee_id', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Designation *</Label>
                <Select onValueChange={(value) => handleCommonFieldChange('designation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.slice(0, 4).map(designation => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Responsibilities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {responsibilities.map(responsibility => (
                  <Badge
                    key={responsibility}
                    variant={formData.responsibilities?.includes(responsibility) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleTagToggle(responsibility, 'responsibilities')}
                  >
                    {responsibility}
                    {formData.responsibilities?.includes(responsibility) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EduBridge</h1>
              <p className="text-sm text-gray-500">Government School Mentoring</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Step {step} of 2: {step === 1 ? 'Basic Information' : `${roleDisplayNames[formData.role as UserRole]} Details`}
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {step === 1 ? (
                // Step 1: Common Fields
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={(e) => handleCommonFieldChange('full_name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Role *</Label>
                      <Select onValueChange={(value: UserRole) => handleCommonFieldChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleDisplayNames).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="your.email@school.edu"
                      value={formData.email}
                      onChange={(e) => handleCommonFieldChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleCommonFieldChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleCommonFieldChange('password', e.target.value)}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleCommonFieldChange('confirmPassword', e.target.value)}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Step 2: Role-specific Fields
                <>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800">
                      Complete your {roleDisplayNames[formData.role as UserRole]} profile
                    </p>
                  </div>
                  {renderRoleSpecificFields()}
                </>
              )}

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 mt-4">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex justify-between mt-6">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-gray-300"
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white ${step === 1 ? 'ml-auto' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : step === 1 ? 'Next' : 'Create Account'}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
