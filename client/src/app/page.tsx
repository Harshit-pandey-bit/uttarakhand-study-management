import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Microscope,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  School,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="w-full px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">UK-GSMP</h1>
                <p className="text-sm text-gray-500">Government School Mentoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 transform">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 cursor-default">
              Bridging Rural Education with Higher Learning
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-in slide-in-from-bottom duration-1000">
              Empowering Rural Students Through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Virtual Mentoring</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-1000 delay-200">
              Connect government schools with Higher Education Institutions for AI-assisted learning, 
              career guidance, and STEM education. Building tomorrow's innovators today.
            </p>
            
            {/* Interactive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <StatCard number="500+" label="Schools Connected" icon={<School className="h-5 w-5" />} />
              <StatCard number="10K+" label="Students Mentored" icon={<Users className="h-5 w-5" />} />
              <StatCard number="95%" label="Success Rate" icon={<Award className="h-5 w-5" />} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform group">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transforming Rural Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive platform designed to bridge the educational gap between rural government schools and premier institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Virtual Mentoring"
              description="One-on-one and group sessions with HEI mentors for personalized guidance"
              color="blue"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
              title="AI-Powered Learning"
              description="NCERT-aligned assignments generated by AI for enhanced learning outcomes"
              color="emerald"
            />
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8 text-purple-600" />}
              title="Career Guidance"
              description="Holland Code assessments and dream career pathways for future planning"
              color="purple"
            />
            <FeatureCard
              icon={<Microscope className="h-8 w-8 text-teal-600" />}
              title="STEM Tools"
              description="Interactive tools like Scratch, GeoGebra, and TinkerCAD for hands-on learning"
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive dashboards and tools designed for students, teachers, mentors, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UserRoleCard
              role="Students"
              color="indigo"
              features={[
                "Interactive career guidance",
                "Virtual mentoring sessions", 
                "STEM tools integration",
                "Project-based learning"
              ]}
            />
            <UserRoleCard
              role="Teachers" 
              color="purple"
              features={[
                "AI assignment generator",
                "Professional development",
                "Student progress tracking",
                "HEI collaboration tools"
              ]}
            />
            <UserRoleCard
              role="HEI Mentors"
              color="teal"
              features={[
                "Multi-school management",
                "Advanced scheduling",
                "Content creation tools",
                "Impact analytics"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Rural Education?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join students, teachers, and mentors making a difference in government school education
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform group">
                Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 group cursor-pointer">
                <GraduationCap className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-xl font-bold group-hover:text-blue-300 transition-colors">UK-GSMP</span>
              </div>
              <p className="text-gray-400">
                Empowering rural education through technology and mentorship.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">For Students</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">For Teachers</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">For Mentors</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">For Institutions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Documentation</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Training Materials</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Partnership</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 EduBridge - Government School Mentoring Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Supporting Components
function StatCard({ number, label, icon }: { number: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-center group cursor-default">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 group-hover:bg-blue-200 transition-colors duration-300">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'group-hover:bg-blue-100',
    emerald: 'group-hover:bg-emerald-100',
    purple: 'group-hover:bg-purple-100',
    teal: 'group-hover:bg-teal-100'
  };

  return (
    <Card className="bg-white shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform group cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 bg-gray-50 ${colorClasses[color as keyof typeof colorClasses]} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function UserRoleCard({ role, color, features }: {
  role: string;
  color: string;
  features: string[];
}) {
  const colorClasses = {
    indigo: 'bg-indigo-600 text-indigo-600 border-indigo-200 bg-indigo-50 group-hover:bg-indigo-100',
    purple: 'bg-purple-600 text-purple-600 border-purple-200 bg-purple-50 group-hover:bg-purple-100', 
    teal: 'bg-teal-600 text-teal-600 border-teal-200 bg-teal-50 group-hover:bg-teal-100'
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform group cursor-pointer">
      <CardHeader>
        <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses].split(' ')[3]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[4]} rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110`}>
          <Users className={`h-6 w-6 ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]} transition-transform duration-300 group-hover:rotate-12`} />
        </div>
        <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{role}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2 group/item">
              <CheckCircle className="h-4 w-4 text-emerald-500 group-hover/item:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ name, role, quote, rating }: {
  name: string;
  role: string; 
  quote: string;
  rating: number;
}) {
  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
          ))}
        </div>
        <blockquote className="text-gray-700 mb-4 italic group-hover:text-gray-900 transition-colors duration-300">"{quote}"</blockquote>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-sm font-medium text-white">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{name}</div>
            <div className="text-sm text-gray-500">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
