import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  // Student Icons
  Home,
  GraduationCap,
  BookOpen,
  Users,
  Microscope,
  FolderOpen,
  Trophy,
  User,
  
  // Teacher Icons
  Presentation,
  Brain,
  UserCheck,
  Award,
  Settings,
  
  // HEI Mentor Icons
  School,
  Calendar,
  FileText,
  BarChart3,
  
  // Admin Icons
  Building2,
  UsersIcon,
  Target,
  TrendingUp,
  
  // Shared Icons
  X,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '@/types/api';

interface DashboardSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  icon: any;
  label: string;
  route: string;
  badge?: string;
  children?: NavigationItem[];
}

export function DashboardSidebar({ userRole, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const getNavigationItems = (role: UserRole): NavigationItem[] => {
    switch (role) {
      case 'student':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/student',
          },
          {
            icon: GraduationCap,
            label: 'Career Guidance',
            route: '/dashboard/student/career-guidance',
            children: [
              { icon: GraduationCap, label: 'Career Hub', route: '/dashboard/student/career-guidance' },
              { icon: GraduationCap, label: 'Holland Assessment', route: '/dashboard/student/career-guidance/holland-assessment' },
              { icon: GraduationCap, label: 'Dream Explorer', route: '/dashboard/student/career-guidance/dream-explorer' },
              { icon: GraduationCap, label: 'Career Map', route: '/dashboard/student/career-guidance/career-map' },
            ]
          },
          {
            icon: BookOpen,
            label: 'Assignments',
            route: '/dashboard/student/assignments',
            badge: '3',
            children: [
              { icon: BookOpen, label: 'All Assignments', route: '/dashboard/student/assignments' },
              { icon: BookOpen, label: 'Pending', route: '/dashboard/student/assignments/pending' },
              { icon: BookOpen, label: 'Completed', route: '/dashboard/student/assignments/completed' },
            ]
          },
          {
            icon: Users,
            label: 'Mentoring',
            route: '/dashboard/student/mentoring',
            children: [
              { icon: Users, label: 'Sessions', route: '/dashboard/student/mentoring/sessions' },
              { icon: Users, label: 'Doubt Clearing', route: '/dashboard/student/mentoring/doubt-clearing' },
            ]
          },
          {
            icon: FolderOpen,
            label: 'Projects',
            route: '/dashboard/student/projects',
            children: [
              { icon: FolderOpen, label: 'Active Projects', route: '/dashboard/student/projects/active' },
              { icon: FolderOpen, label: 'Showcase', route: '/dashboard/student/projects/showcase' },
            ]
          },
          {
            icon: Microscope,
            label: 'STEM Tools',
            route: '/dashboard/student/stem-tools',
          },
          {
            icon: Trophy,
            label: 'Portfolio',
            route: '/dashboard/student/portfolio',
          },
        ];

      case 'teacher':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/teacher',
          },
          {
            icon: Brain,
            label: 'AI Assistant',
            route: '/dashboard/teacher/ai-assistant',
            badge: 'New',
            children: [
              { icon: Brain, label: 'Assignment Generator', route: '/dashboard/teacher/ai-assistant/assignment-generator' },
              { icon: Brain, label: 'Lesson Planner', route: '/dashboard/teacher/ai-assistant/lesson-planner' },
            ]
          },
          {
            icon: UserCheck,
            label: 'Students',
            route: '/dashboard/teacher/students',
            children: [
              { icon: UserCheck, label: 'Portfolios', route: '/dashboard/teacher/students/portfolios' },
              { icon: UserCheck, label: 'Progress', route: '/dashboard/teacher/students/progress' },
            ]
          },
          {
            icon: Presentation,
            label: 'Assessments',
            route: '/dashboard/teacher/assessments',
            children: [
              { icon: Presentation, label: 'Formative', route: '/dashboard/teacher/assessments/formative' },
              { icon: Presentation, label: 'Summative', route: '/dashboard/teacher/assessments/summative' },
              { icon: Presentation, label: 'Diagnostic', route: '/dashboard/teacher/assessments/diagnostic' },
            ]
          },
          {
            icon: Award,
            label: 'Professional Development',
            route: '/dashboard/teacher/cpd',
            children: [
              { icon: Award, label: 'DIKSHA', route: '/dashboard/teacher/cpd/diksha' },
              { icon: Award, label: 'NISHTHA', route: '/dashboard/teacher/cpd/nishtha' },
              { icon: Award, label: 'Certificates', route: '/dashboard/teacher/cpd/certificates' },
            ]
          },
          {
            icon: Building2,
            label: 'HEI Collaboration',
            route: '/dashboard/teacher/hei-collaboration',
          },
        ];

      case 'hei-mentor':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/hei-mentor',
          },
          {
            icon: Users,
            label: 'Mentoring',
            route: '/dashboard/hei-mentor/mentoring',
            children: [
              { icon: Calendar, label: 'Sessions', route: '/dashboard/hei-mentor/mentoring/sessions' },
              { icon: Users, label: 'Doubt Clearing', route: '/dashboard/hei-mentor/mentoring/doubt-clearing' },
              { icon: GraduationCap, label: 'Career Guidance', route: '/dashboard/hei-mentor/mentoring/career-guidance' },
            ]
          },
          {
            icon: School,
            label: 'Schools',
            route: '/dashboard/hei-mentor/schools',
          },
          {
            icon: FileText,
            label: 'Content Creation',
            route: '/dashboard/hei-mentor/content-creation',
            children: [
              { icon: Brain, label: 'AI Assistant', route: '/dashboard/hei-mentor/content-creation/ai-assistant' },
              { icon: FileText, label: 'Resources', route: '/dashboard/hei-mentor/content-creation/resources' },
            ]
          },
        ];

      case 'hei-admin':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/hei-admin',
          },
          {
            icon: UsersIcon,
            label: 'Mentors',
            route: '/dashboard/hei-admin/mentors',
            children: [
              { icon: UsersIcon, label: 'Assign', route: '/dashboard/hei-admin/mentors/assign' },
              { icon: BarChart3, label: 'Performance', route: '/dashboard/hei-admin/mentors/performance' },
            ]
          },
          {
            icon: Building2,
            label: 'Partnerships',
            route: '/dashboard/hei-admin/partnerships',
            children: [
              { icon: Building2, label: 'Active', route: '/dashboard/hei-admin/partnerships/active' },
            ]
          },
          {
            icon: Target,
            label: 'Programs',
            route: '/dashboard/hei-admin/programs',
            children: [
              { icon: Award, label: 'CPD', route: '/dashboard/hei-admin/programs/cpd' },
              { icon: Microscope, label: 'STEM', route: '/dashboard/hei-admin/programs/stem' },
            ]
          },
          {
            icon: TrendingUp,
            label: 'Analytics',
            route: '/dashboard/hei-admin/analytics',
            badge: 'Live',
            children: [
              { icon: TrendingUp, label: 'Impact Metrics', route: '/dashboard/hei-admin/analytics/impact-metrics' },
              { icon: Users, label: 'Mentoring Effectiveness', route: '/dashboard/hei-admin/analytics/mentoring-effectiveness' },
              { icon: BarChart3, label: 'Partnership Health', route: '/dashboard/hei-admin/analytics/partnership-health' },
            ]
          },
        ];

      case 'school-admin':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/school-admin',
          },
          {
            icon: UsersIcon,
            label: 'Teachers',
            route: '/dashboard/school-admin/teachers',
            children: [
              { icon: Award, label: 'CPD Tracking', route: '/dashboard/school-admin/teachers/cpd-tracking' },
            ]
          },
          {
            icon: UserCheck,
            label: 'Students',
            route: '/dashboard/school-admin/students',
            children: [
              { icon: BarChart3, label: 'Progress', route: '/dashboard/school-admin/students/progress' },
            ]
          },
          {
            icon: Building2,
            label: 'HEI Partnerships',
            route: '/dashboard/school-admin/hei-partnerships',
            children: [
              { icon: Building2, label: 'Active', route: '/dashboard/school-admin/hei-partnerships/active' },
            ]
          },
          {
            icon: Settings,
            label: 'Infrastructure',
            route: '/dashboard/school-admin/infrastructure',
            children: [
              { icon: Settings, label: 'Smart Classrooms', route: '/dashboard/school-admin/infrastructure/smart-classrooms' },
            ]
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems(userRole);

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + '/');
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      student: 'text-indigo-600 bg-indigo-50',
      teacher: 'text-purple-600 bg-purple-50',
      'hei-mentor': 'text-teal-600 bg-teal-50',
      'hei-admin': 'text-orange-600 bg-orange-50',
      'school-admin': 'text-rose-600 bg-rose-50',
    };
    return colors[role] || 'text-gray-600 bg-gray-50';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      student: 'Student Portal',
      teacher: 'Teacher Portal',
      'hei-mentor': 'HEI Mentor Portal',
      'hei-admin': 'HEI Admin Portal',
      'school-admin': 'School Admin Portal',
    };
    return labels[role] || role;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getRoleColor(userRole)}`}>
            {getRoleLabel(userRole)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.route}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActiveRoute(item.route)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => window.innerWidth < 768 && onClose()}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {item.badge}
                      </Badge>
                    )}
                    {item.children && (
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </Link>

                {/* Sub-navigation */}
                {item.children && isActiveRoute(item.route) && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link
                          href={child.route}
                          className={`flex items-center space-x-2 px-3 py-1 rounded text-xs transition-colors ${
                            pathname === child.route
                              ? 'text-blue-600 bg-blue-25'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          onClick={() => window.innerWidth < 768 && onClose()}
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            EduBridge Platform v1.0
          </div>
        </div>
      </div>
    </>
  );
}
