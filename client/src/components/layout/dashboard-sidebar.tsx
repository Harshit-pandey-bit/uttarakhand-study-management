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
  ChevronRight,
  Circle,
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
              { icon: GraduationCap, label: 'Holland Assessment', route: '/dashboard/student/career-guidance/holland-assessment/take-test' },
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
              { icon: Users, label: 'Doubt Clearing', route: '/dashboard/student/mentoring/chat' },
            ]
          },
          {
            icon: FolderOpen,
            label: 'Projects',
            route: '/dashboard/student/projects/active',
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
          // {
          //   icon: Brain,
          //   label: 'AI Assistant',
          //   route: '/dashboard/teacher/ai-assistant',
          //   badge: 'New',
          //   children: [
          //     { icon: Brain, label: 'Assignment Generator', route: '/dashboard/teacher/ai-assistant/assignment-generator' },
          //     { icon: Brain, label: 'Lesson Planner', route: '/dashboard/teacher/ai-assistant/lesson-planner' },
          //   ]
          // },
          {
            icon: UserCheck,
            label: 'Students',
            route: '/dashboard/teacher/students',
           
          },
          {
            icon: Presentation,
            label: 'Assessments',
            route: '/dashboard/teacher/assessments',
            children: [
              { icon: Presentation, label: 'Formative', route: '/dashboard/teacher/assessments/formative' },
              // { icon: Presentation, label: 'Summative', route: '/dashboard/teacher/assessments/summative' },
              // { icon: Presentation, label: 'Diagnostic', route: '/dashboard/teacher/assessments/diagnostic' },
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
          // {
          //   icon: Building2,
          //   label: 'HEI Collaboration',
          //   route: '/dashboard/teacher/hei-collaboration',
          // },
        ];

      case 'hei_mentor':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/hei_mentor',
          },
          {
            icon: Users,
            label: 'Mentoring',
            route: '/dashboard/hei_mentor/mentoring',
            children: [
              { icon: Calendar, label: 'Sessions', route: '/dashboard/hei_mentor/mentoring/sessions' },
              { icon: Users, label: 'Doubt Clearing', route: '/dashboard/hei_mentor/mentoring/doubt-clearing' },
              { icon: GraduationCap, label: 'Career Guidance', route: '/dashboard/hei_mentor/mentoring/career-guidance' },
            ]
          },
          {
            icon: School,
            label: 'Schools',
            route: '/dashboard/hei_mentor/schools',
          },
          {
            icon: FileText,
            label: 'Content Creation',
            route: '/dashboard/hei_mentor/content-creation',
            children: [
              { icon: Brain, label: 'AI Assistant', route: '/dashboard/hei_mentor/content-creation/ai-assistant' },
              { icon: FileText, label: 'Resources', route: '/dashboard/hei_mentor/content-creation/resources' },
            ]
          },
        ];

      case 'hei_admin':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/hei_admin',
          },
          {
            icon: UsersIcon,
            label: 'Mentors',
            route: '/dashboard/hei_admin/mentors',
            children: [
              { icon: UsersIcon, label: 'Assign', route: '/dashboard/hei_admin/mentors/assign' },
              { icon: BarChart3, label: 'Performance', route: '/dashboard/hei_admin/mentors/performance' },
            ]
          },
          {
            icon: Building2,
            label: 'Partnerships',
            route: '/dashboard/hei_admin/partnerships',
            children: [
              { icon: Building2, label: 'Active', route: '/dashboard/hei_admin/partnerships/active' },
            ]
          },
          {
            icon: Target,
            label: 'Programs',
            route: '/dashboard/hei_admin/programs',
            children: [
              { icon: Award, label: 'CPD', route: '/dashboard/hei_admin/programs/cpd' },
              { icon: Microscope, label: 'STEM', route: '/dashboard/hei_admin/programs/stem' },
            ]
          },
          {
            icon: TrendingUp,
            label: 'Analytics',
            route: '/dashboard/hei_admin/analytics',
            badge: 'Live',
            children: [
              { icon: TrendingUp, label: 'Impact Metrics', route: '/dashboard/hei_admin/analytics/impact-metrics' },
              { icon: Users, label: 'Mentoring Effectiveness', route: '/dashboard/hei_admin/analytics/mentoring-effectiveness' },
              { icon: BarChart3, label: 'Partnership Health', route: '/dashboard/hei_admin/analytics/partnership-health' },
            ]
          },
        ];

      case 'school_admin':
        return [
          {
            icon: Home,
            label: 'Dashboard',
            route: '/dashboard/school_admin',
          },
          {
            icon: UsersIcon,
            label: 'Teachers',
            route: '/dashboard/school_admin/teachers',
            children: [
              { icon: Award, label: 'CPD Tracking', route: '/dashboard/school_admin/teachers/cpd-tracking' },
            ]
          },
          {
            icon: UserCheck,
            label: 'Students',
            route: '/dashboard/school_admin/students',
            children: [
              { icon: BarChart3, label: 'Progress', route: '/dashboard/school_admin/students/progress' },
            ]
          },
          {
            icon: Building2,
            label: 'HEI Partnerships',
            route: '/dashboard/school_admin/hei-partnerships',
            children: [
              { icon: Building2, label: 'Active', route: '/dashboard/school_admin/hei-partnerships/active' },
            ]
          },
          {
            icon: Settings,
            label: 'Infrastructure',
            route: '/dashboard/school_admin/infrastructure',
            children: [
              { icon: Settings, label: 'Smart Classrooms', route: '/dashboard/school_admin/infrastructure/smart-classrooms' },
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
      student: 'from-indigo-500 to-purple-500',
      teacher: 'from-purple-500 to-pink-500',
      'hei_mentor': 'from-teal-500 to-cyan-500',
      'hei_admin': 'from-orange-500 to-red-500',
      'school_admin': 'from-rose-500 to-pink-500',
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      student: 'Student Portal',
      teacher: 'Teacher Portal',
      'hei_mentor': 'HEI Mentor Portal',
      'hei_admin': 'HEI Admin Portal',
      'school_admin': 'School Admin Portal',
    };
    return labels[role] || role;
  };

  return (
    <div className="h-full w-full bg-white/95 backdrop-blur-xl border-r border-gray-100/50 shadow-2xl shadow-black/5 flex flex-col">
      {/* Decorative gradient border */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getRoleColor(userRole)}`} />

      {/* Header */}
      <div className="relative p-6 border-b border-gray-100/50 flex-shrink-0">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Role indicator with gradient */}
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getRoleColor(userRole)} shadow-lg`}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
            </div>
            
            {/* Role label */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {getRoleLabel(userRole)}
              </span>
              <span className="text-xs text-gray-500">UK-GSMP Dashboard</span>
            </div>
          </div>
          
          {/* Close button with hover effect */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group"
          >
            <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </Button>
        </div>
      </div>

      {/* Navigation with HIDDEN SCROLLBAR */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-scroll scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {navigationItems.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isParentActive = isActiveRoute(item.route);
          
          return (
            <div key={index} className="group">
              <Link
                href={item.route}
                className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group/item ${
                  isParentActive && !hasChildren
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 shadow-lg shadow-blue-500/10 border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50/80 hover:shadow-md hover:shadow-gray-500/5'
                }`}
                onClick={() => window.innerWidth < 768 && onClose()}
              >
                {/* Active indicator */}
                {isParentActive && !hasChildren && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                )}

                <div className="flex items-center space-x-4">
                  {/* Icon with enhanced styling */}
                  <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isParentActive && !hasChildren
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-100/80 text-gray-600 group-hover/item:bg-gray-200/80 group-hover/item:scale-105'
                  }`}>
                    <item.icon className="h-5 w-5 transition-transform duration-200" />
                    {/* Shine effect for active state */}
                    {isParentActive && !hasChildren && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 via-white/10 to-transparent" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`font-medium transition-colors duration-200 ${
                    isParentActive && !hasChildren ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Badge with enhanced styling */}
                  {item.badge && (
                    <Badge className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      item.badge === 'New' 
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md shadow-emerald-500/25'
                        : item.badge === 'Live'
                        ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md shadow-red-500/25 animate-pulse'
                        : 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md shadow-blue-500/25'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Expand indicator */}
                  {hasChildren && (
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-all duration-300 ${
                      isParentActive ? 'rotate-90 text-blue-500' : 'group-hover:text-gray-600'
                    }`} />
                  )}
                </div>
              </Link>

              {/* Enhanced Sub-navigation */}
              {hasChildren && isParentActive && (
                <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-left-2 duration-300">
                  {item.children?.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      href={child.route}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group/child ${
                        pathname === child.route
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100/50'
                          : 'text-gray-600 hover:bg-gray-50/60 hover:text-gray-900'
                      }`}
                      onClick={() => window.innerWidth < 768 && onClose()}
                    >
                      {/* Sub-item indicator */}
                      <div className={`transition-all duration-200 ${
                        pathname === child.route 
                          ? 'w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-md shadow-blue-500/25' 
                          : 'w-1.5 h-1.5 bg-gray-300 rounded-full group-hover/child:bg-gray-400'
                      }`} />
                      
                      <span className={`text-sm font-medium transition-colors ${
                        pathname === child.route ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {child.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Enhanced Footer */}
      <div className="p-4 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/30 to-transparent flex-shrink-0">
        <div className="text-center">
          <div className="text-xs text-gray-400 font-medium">UK-GSMP Platform</div>
          <div className="text-xs text-gray-300 mt-1">v2.0.1</div>
        </div>
      </div>
    </div>
  );
}
