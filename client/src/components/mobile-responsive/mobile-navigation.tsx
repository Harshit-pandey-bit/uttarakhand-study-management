'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Video,
  Users,
} from 'lucide-react';

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MOBILE_NAV: Record<string, MobileNavItem[]> = {
  STUDENT: [
    { label: 'Home', href: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
    { label: 'Assess', href: '/dashboard/student/assessment', icon: <GraduationCap size={20} /> },
    { label: 'Tasks', href: '/dashboard/student/assignments', icon: <ClipboardList size={20} /> },
    { label: 'Mentor', href: '/dashboard/student/mentoring', icon: <Video size={20} /> },
  ],
  TEACHER: [
    { label: 'Home', href: '/dashboard/teacher', icon: <LayoutDashboard size={20} /> },
    { label: 'Tasks', href: '/dashboard/teacher/assignments', icon: <ClipboardList size={20} /> },
    { label: 'Students', href: '/dashboard/teacher/students', icon: <Users size={20} /> },
  ],
  HEI_MENTOR: [
    { label: 'Home', href: '/dashboard/hei-mentor', icon: <LayoutDashboard size={20} /> },
    { label: 'Schedule', href: '/dashboard/hei-mentor/schedule', icon: <Video size={20} /> },
    { label: 'Tasks', href: '/dashboard/hei-mentor/assignments', icon: <ClipboardList size={20} /> },
    { label: 'Mentees', href: '/dashboard/hei-mentor/mentees', icon: <Users size={20} /> },
  ],
};

interface MobileNavigationProps {
  userRole: string;
}

export function MobileNavigation({ userRole }: MobileNavigationProps) {
  const pathname = usePathname();
  const items = MOBILE_NAV[userRole] ?? MOBILE_NAV.STUDENT;

  return (
    <nav className="flex items-center justify-around py-2 px-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
