'use client';

import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/api';

interface DashboardHeaderProps {
  user: UserProfile;
  onMenuClick: () => void;
  isMobile: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  HEI_MENTOR: 'HEI Mentor',
  SCHOOL_ADMIN: 'School Admin',
  HEI_ADMIN: 'HEI Admin',
};

const ROLE_COLORS: Record<string, string> = {
  STUDENT: 'bg-emerald-100 text-emerald-700',
  TEACHER: 'bg-blue-100 text-blue-700',
  HEI_MENTOR: 'bg-purple-100 text-purple-700',
  SCHOOL_ADMIN: 'bg-amber-100 text-amber-700',
  HEI_ADMIN: 'bg-rose-100 text-rose-700',
};

export function DashboardHeader({ user, onMenuClick, isMobile }: DashboardHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const userRole = user.user_metadata?.role ?? 'STUDENT';
  const userName = user.user_metadata?.full_name ?? user.email ?? 'User';

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between border-b border-gray-200 bg-white">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        {!isMobile && (
          <h1 className="text-lg font-semibold text-gray-900">
            Government School Mentoring Platform
          </h1>
        )}
      </div>

      {/* Right: Role badge + User + Logout */}
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[userRole] ?? 'bg-gray-100 text-gray-700'}`}>
          {ROLE_LABELS[userRole] ?? userRole}
        </span>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          {!isMobile && (
            <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
              {userName}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
