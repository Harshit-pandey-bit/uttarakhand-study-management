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
import { GraduationCap, Eye, EyeOff, Users, BookOpen, Award, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { apiClient } from '@/lib/api/client';

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

// Feature highlights for the left panel
const features = [
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Connect students with experienced mentors'
  },
  {
    icon: BookOpen,
    title: 'NCERT Aligned',
    description: 'Curriculum mapped to government standards'
  },
  {
    icon: Award,
    title: 'Track Progress',
    description: 'Monitor growth and celebrate achievements'
  }
];

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data?.user) {
        const user = response.data.user;
        
        // Redirect based on role matching your backend structure
        switch (user.role) {
          case 'student':
            router.push('/dashboard/student');
            break;
          case 'teacher':
            router.push('/dashboard/teacher');
            break;
          case 'hei_mentor':
            router.push('/dashboard/hei-mentor');
            break;
          case 'hei_admin':
            router.push('/dashboard/hei-admin');
            break;
          case 'school_admin':
            router.push('/dashboard/school-admin');
            break;
          default:
            router.push('/dashboard');
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Panel - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
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
              <span className="text-lg transition-all duration-300 group-hover:text-white">Empowering the next generation</span>
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
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </p>
            <p className="text-blue-200 font-medium transition-colors duration-300 group-hover:text-blue-100">- Malcolm X</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
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

          {/* Login Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:bg-white/90">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-white to-gray-50">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600 cursor-default">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600 text-lg transition-colors duration-300 hover:text-gray-800 cursor-default">
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Email Address</span>
                    {focusedField === 'email' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@school.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full h-12 border-2 rounded-xl transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Password</span>
                    {focusedField === 'password' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full h-12 border-2 rounded-xl pr-12 transition-all duration-300 ${
                        focusedField === 'password'
                          ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.01]'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
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

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Role</span>
                    {focusedField === 'role' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  </Label>
                  <div className="relative group">
                    <Select 
                      onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                      onOpenChange={(open) => setFocusedField(open ? 'role' : null)}
                    >
                      <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:scale-[1.01]">
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

                {/* Error Alert */}
                {error && (
                  <Alert className="border-2 border-red-200 bg-red-50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                    <AlertDescription className="text-red-700 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="rounded-md transition-all duration-200 hover:scale-110"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-200 cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-300 hover:scale-105"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
                  disabled={loading}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  <span className="relative flex items-center space-x-2">
                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                    {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />}
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  </span>
                </Button>
              </form>

             {/* Demo Credentials
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50">
                <div className="flex items-center space-x-2 mb-3 group">
                  <Sparkles className="h-4 w-4 text-blue-500 transition-all duration-300 group-hover:text-blue-600 group-hover:animate-pulse" />
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">Demo Credentials</p>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-sm cursor-pointer group">
                    <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">Student:</span>
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">student@school.edu / demo123</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-sm cursor-pointer group">
                    <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">Teacher:</span>
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">teacher@school.edu / demo123</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-sm cursor-pointer group">
                    <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">Mentor:</span>
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">mentor@hei.edu / demo123</span>
                  </div>
                </div>
              </div> */}

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/auth/register" 
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Sign up here
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
