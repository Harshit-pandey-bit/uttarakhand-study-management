import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Microscope,
  User,
  Settings
} from 'lucide-react';

interface MobileNavigationProps {
  userRole: string;
}

export function MobileNavigation({ userRole }: MobileNavigationProps) {
  const pathname = usePathname();

  const getNavigationItems = (role: string) => {
    switch (role) {
      case 'student':
        return [
          { icon: Home, label: 'Home', route: '/dashboard/student', offline: true },
          { icon: GraduationCap, label: 'Career', route: '/dashboard/student/career-guidance', offline: false },
          { icon: BookOpen, label: 'Assignments', route: '/dashboard/student/assignments', offline: true },
          { icon: Users, label: 'Mentoring', route: '/dashboard/student/mentoring', offline: false },
          { icon: Microscope, label: 'STEM Tools', route: '/dashboard/student/stem-tools', offline: false },
        ];
      // Add other roles as needed
      default:
        return [
          { icon: Home, label: 'Home', route: `/dashboard/${role}`, offline: true },
          { icon: User, label: 'Profile', route: `/dashboard/${role}/profile`, offline: true },
          { icon: Settings, label: 'Settings', route: `/dashboard/${role}/settings`, offline: true },
        ];
    }
  };

  const navigationItems = getNavigationItems(userRole);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {!item.offline && (
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
