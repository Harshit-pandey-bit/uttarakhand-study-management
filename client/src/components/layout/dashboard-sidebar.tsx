'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Users,
  Video,
  GraduationCap,
  X,
} from 'lucide-react';
import { UserRole } from '@/types/api';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  STUDENT: [
    { label: 'Dashboard', href: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
    { label: 'Career Assessment', href: '/dashboard/student/assessment', icon: <GraduationCap size={20} /> },
    { label: 'My Assignments', href: '/dashboard/student/assignments', icon: <BookOpen size={20} /> },
    { label: 'Mentoring Sessions', href: '/dashboard/student/mentoring', icon: <Video size={20} /> },
  ],
  TEACHER: [
    { label: 'Dashboard', href: '/dashboard/teacher', icon: <LayoutDashboard size={20} /> },
    { label: 'Assignments', href: '/dashboard/teacher/assignments', icon: <ClipboardList size={20} /> },
    { label: 'Students', href: '/dashboard/teacher/students', icon: <Users size={20} /> },
  ],
  HEI_MENTOR: [
    { label: 'Dashboard', href: '/dashboard/hei-mentor', icon: <LayoutDashboard size={20} /> },
    { label: 'Schedule Session', href: '/dashboard/hei-mentor/schedule', icon: <Video size={20} /> },
    { label: 'Assignments', href: '/dashboard/hei-mentor/assignments', icon: <ClipboardList size={20} /> },
    { label: 'My Mentees', href: '/dashboard/hei-mentor/mentees', icon: <Users size={20} /> },
  ],
  SCHOOL_ADMIN: [
    { label: 'Dashboard', href: '/dashboard/school-admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Teachers', href: '/dashboard/school-admin/teachers', icon: <Users size={20} /> },
    { label: 'Students', href: '/dashboard/school-admin/students', icon: <GraduationCap size={20} /> },
  ],
  HEI_ADMIN: [
    { label: 'Dashboard', href: '/dashboard/hei-admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Mentors', href: '/dashboard/hei-admin/mentors', icon: <Users size={20} /> },
  ],
};

interface DashboardSidebarProps {
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ userRole, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_BY_ROLE[userRole] ?? NAV_BY_ROLE.STUDENT;

  if (!isOpen) return null;

  return (
    <aside className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">UK-GSMP</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Uttarakhand GSMP v2.0
        </p>
      </div>
    </aside>
  );
}
