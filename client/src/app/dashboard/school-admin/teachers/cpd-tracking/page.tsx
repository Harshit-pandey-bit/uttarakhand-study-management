'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Star, 
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function CPDTrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-pink-50/30 p-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-700 to-rose-800 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        
        <div className="relative z-10 p-8 lg:p-12 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-yellow-300" />
                <span className="text-rose-200 font-semibold text-lg">Professional Development</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent leading-tight">
                CPD Tracking
                <span className="inline-block ml-3 text-yellow-400 drop-shadow-lg">
                  📚
                </span>
              </h1>
              
              <p className="text-rose-100 text-lg max-w-2xl">
                Comprehensive Continuing Professional Development tracking system for teachers
              </p>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <BookOpen className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/school-admin/teachers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teachers
          </Button>
        </Link>
        <Badge variant="secondary" className="text-sm">
          Feature Development
        </Badge>
      </div>

      {/* Coming Soon Section */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-2xl w-full bg-white/70 backdrop-blur-xl border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                <Clock className="h-16 w-16 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-12 w-12 text-yellow-500 animate-bounce" />
              </div>
            </div>

            {/* Coming Soon Text */}
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Coming Soon!
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're working hard to bring you an amazing CPD Tracking system. 
              This feature will help monitor and manage teacher professional development progress.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-rose-600" />
                  What's Coming
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Track individual teacher CPD progress
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Monitor certification completions
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Set development goals and targets
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Generate progress reports
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-rose-600" />
                  Key Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    DIKSHA course integration
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    NISHTHA program tracking
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Custom training modules
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Performance analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">25</div>
                <div className="text-xs text-blue-600">Teachers</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">72%</div>
                <div className="text-xs text-green-600">Avg Progress</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">45+</div>
                <div className="text-xs text-purple-600">Certifications</div>
              </div>
            </div>

            {/* Expected Launch */}
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Expected Launch</h4>
              <p className="text-gray-700 text-sm mb-3">
                This feature is currently in development and will be available soon.
              </p>
              <Badge className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
                In Development
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/dashboard/school-admin/teachers">
                <Button size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Return to Teachers
                </Button>
              </Link>
              <Button variant="outline" size="lg" disabled>
                <Clock className="h-5 w-5 mr-2" />
                Notify When Ready
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Have questions about this feature? Contact the development team for more information.
        </p>
      </div>
    </div>
  );
}
