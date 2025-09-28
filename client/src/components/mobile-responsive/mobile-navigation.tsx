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
          { icon: Home, label: 'Home', route: '/dashboard/student', offline: true, color: 'from-blue-500 to-blue-600' },
          { icon: GraduationCap, label: 'Career', route: '/dashboard/student/career-guidance', offline: false, color: 'from-purple-500 to-purple-600' },
          { icon: BookOpen, label: 'Assignments', route: '/dashboard/student/assignments', offline: true, color: 'from-green-500 to-green-600' },
          { icon: Users, label: 'Mentoring', route: '/dashboard/student/mentoring', offline: false, color: 'from-orange-500 to-orange-600' },
          { icon: Microscope, label: 'STEM Tools', route: '/dashboard/student/stem-tools', offline: false, color: 'from-pink-500 to-pink-600' },
        ];
      // Add other roles as needed
      default:
        return [
          { icon: Home, label: 'Home', route: `/dashboard/${role}`, offline: true, color: 'from-blue-500 to-blue-600' },
          { icon: User, label: 'Profile', route: `/dashboard/${role}/profile`, offline: true, color: 'from-indigo-500 to-indigo-600' },
          { icon: Settings, label: 'Settings', route: `/dashboard/${role}/settings`, offline: true, color: 'from-gray-500 to-gray-600' },
        ];
    }
  };

  const navigationItems = getNavigationItems(userRole);

  return (
    <>
      {/* Enhanced backdrop with depth */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-3xl z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent"></div>
      </div>
      
      {/* Main Navigation with enhanced styling */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Enhanced decorative top border with animation */}
        <div className="relative h-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-orange-500 to-pink-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
        
        {/* Enhanced navigation container */}
        <div className="relative bg-white/98 backdrop-blur-3xl border-t border-gray-100/80 shadow-2xl shadow-gray-900/10">
          {/* Ambient background glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/30 to-transparent"></div>
          
          {/* Navigation items container with enhanced spacing */}
          <div className="relative flex justify-around items-end px-1 py-3">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.route;
              
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className="relative group flex-1 max-w-[75px] min-w-[60px]"
                >
                  {/* Enhanced active indicator background with animation */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 -top-3 rounded-3xl bg-gradient-to-b from-blue-50/80 to-transparent opacity-80 animate-in fade-in duration-500"></div>
                      <div className="absolute inset-0 -top-1 rounded-3xl bg-gradient-to-b from-blue-100/40 to-transparent animate-pulse"></div>
                    </>
                  )}
                  
                  {/* Enhanced navigation item container with better micro-interactions */}
                  <div className={`relative flex flex-col items-center py-2 px-2 rounded-3xl transition-all duration-500 ease-out ${
                    isActive 
                      ? 'transform -translate-y-2 scale-105' 
                      : 'group-hover:transform group-hover:-translate-y-1 group-hover:scale-102'
                  }`}>
                    
                    {/* Enhanced icon container with advanced styling */}
                    <div className={`relative mb-2 transition-all duration-500 ease-out ${
                      isActive 
                        ? 'transform scale-115' 
                        : 'group-hover:transform group-hover:scale-110'
                    }`}>
                      {/* Multiple layer background effects */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 transition-all duration-500 ${
                        isActive ? 'opacity-25 scale-125 blur-sm' : 'group-hover:opacity-15 group-hover:scale-110'
                      }`}></div>
                      
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 transition-all duration-300 ${
                        isActive ? 'opacity-30 scale-110' : 'group-hover:opacity-20 group-hover:scale-105'
                      }`}></div>
                      
                      {/* Main icon container with enhanced styling */}
                      <div className={`relative p-3 rounded-2xl transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-br ${item.color} shadow-xl shadow-blue-500/30 ring-2 ring-white/50` 
                          : 'bg-gray-100/90 group-hover:bg-gray-150 group-hover:shadow-lg group-hover:shadow-gray-400/20'
                      }`}>
                        <item.icon className={`h-6 w-6 transition-all duration-500 ${
                          isActive 
                            ? 'text-white drop-shadow-md scale-105' 
                            : 'text-gray-600 group-hover:text-gray-800 group-hover:scale-105'
                        }`} />
                        
                        {/* Enhanced shine effect with animation */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-60 animate-pulse"></div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-transparent via-white/20 to-transparent animate-pulse animation-delay-1000"></div>
                          </>
                        )}
                      </div>
                      
                      {/* Enhanced online/offline indicator with better animations */}
                      {!item.offline && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          <div className="relative w-4 h-4">
                            {/* Main indicator with gradient */}
                            <div className="w-4 h-4 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/40 animate-pulse">
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-full"></div>
                            </div>
                            {/* Enhanced pulse rings */}
                            <div className="absolute inset-0 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-40 animation-delay-0"></div>
                            <div className="absolute inset-0 w-4 h-4 bg-orange-300 rounded-full animate-ping opacity-20 animation-delay-1000"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced label with better typography and animations */}
                    <span className={`text-xs font-semibold transition-all duration-500 text-center leading-tight px-1 ${
                      isActive 
                        ? 'text-blue-700 font-bold transform scale-105' 
                        : 'text-gray-600 group-hover:text-gray-900 group-hover:font-bold'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Enhanced active state indicators with multiple layers */}
                    {isActive && (
                      <>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-blue-500/40 animate-pulse"></div>
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full opacity-60"></div>
                      </>
                    )}
                  </div>
                  
                  {/* Enhanced ripple effect with better animation */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-active:opacity-20 transition-all duration-300 rounded-3xl group-active:scale-95`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/30 opacity-0 group-active:opacity-100 transition-all duration-150 rounded-3xl"></div>
                  </div>
                  
                  {/* Long press feedback indicator */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-400/0 to-gray-600/0 opacity-0 group-active:opacity-10 transition-all duration-100 scale-95 group-active:scale-100"></div>
                </Link>
              );
            })}
          </div>
          
          {/* Enhanced bottom safe area with gradient */}
          <div className="h-safe-bottom bg-gradient-to-t from-gray-100/30 via-gray-50/20 to-transparent"></div>
        </div>
        
        {/* Enhanced shadow effects with multiple layers */}
        <div className="absolute inset-0 -z-10 shadow-2xl shadow-gray-900/15 rounded-t-3xl"></div>
        <div className="absolute inset-0 -z-20 shadow-xl shadow-gray-600/10 rounded-t-3xl blur-sm"></div>
      </nav>
      
      {/* Enhanced custom styles for safe area and animations */}
      <style jsx>{`
        .pb-safe-bottom {
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }
        .h-safe-bottom {
          height: max(0px, env(safe-area-inset-bottom));
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-0 {
          animation-delay: 0s;
        }
        .scale-102 {
          transform: scale(1.02);
        }
        .scale-115 {
          transform: scale(1.15);
        }
        .scale-125 {
          transform: scale(1.25);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out;
        }
        .bg-gray-150 {
          background-color: rgb(249 250 251);
        }
      `}</style>
    </>
  );
}
