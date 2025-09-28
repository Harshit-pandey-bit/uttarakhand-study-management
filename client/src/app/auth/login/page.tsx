'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/types/auth';

// Dummy users from specifications
const dummyUsers = [
  { email: 'student@school.edu', password: 'demo123', role: 'student', name: 'Rahul Sharma' },
  { email: 'teacher@school.edu', password: 'demo123', role: 'teacher', name: 'Priya Verma' },
  { email: 'mentor@hei.edu', password: 'demo123', role: 'hei-mentor', name: 'Dr. Rajesh Kumar' },
  { email: 'hei-admin@hei.edu', password: 'demo123', role: 'hei-admin', name: 'Prof. Sunita Sharma' },
  { email: 'admin@school.edu', password: 'demo123', role: 'school-admin', name: 'Mr. Amit Singh' }
];

const roleDisplayNames = {
  'student': 'Student',
  'teacher': 'Teacher', 
  'hei-mentor': 'HEI Mentor',
  'hei-admin': 'HEI Admin',
  'school-admin': 'School Admin'
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' as UserRole | ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Simulate authentication with dummy data
    const user = dummyUsers.find(
      u => u.email === formData.email && 
           u.password === formData.password && 
           u.role === formData.role
    );

    if (user) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data (in real app, this would be JWT tokens)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'teacher':
          router.push('/dashboard/teacher');
          break;
        case 'hei-mentor':
          router.push('/dashboard/hei-mentor');
          break;
        case 'hei-admin':
          router.push('/dashboard/hei-admin');
          break;
        case 'school-admin':
          router.push('/dashboard/school-admin');
          break;
      }
    } else {
      setError('Invalid credentials. Please check your email, password, and role selection.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        {/* Login Form */}
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
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

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Student:</span> student@school.edu / demo123</p>
                <p><span className="font-medium">Teacher:</span> teacher@school.edu / demo123</p>
                <p><span className="font-medium">Mentor:</span> mentor@hei.edu / demo123</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
