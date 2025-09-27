'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface SidebarProps {
  role: string
  activeRoute?: string
  collapsed?: boolean
  className?: string
}

const menuConfig: Record<string, { label: string, path: string }[]> = {
  student: [
    { label: 'Dashboard', path: '/dashboard/student' },
    { label: 'Career Guidance', path: '/dashboard/student/career-guidance' },
    { label: 'Assignments', path: '/dashboard/student/assignments' },
    { label: 'STEM Tools', path: '/dashboard/student/stem-tools' },
    { label: 'Portfolio', path: '/dashboard/student/portfolio' }
  ],
  teacher: [
    { label: 'Dashboard', path: '/dashboard/teacher' },
    { label: 'AI Assistant', path: '/dashboard/teacher/ai-assistant' },
    { label: 'Students', path: '/dashboard/teacher/students' },
    { label: 'Assessments', path: '/dashboard/teacher/assessments' },
    { label: 'Tech Tools', path: '/dashboard/teacher/tech-tools' }
  ],
  'hei-mentor': [
    { label: 'Dashboard', path: '/dashboard/hei-mentor' },
    { label: 'Mentoring Sessions', path: '/dashboard/hei-mentor/mentoring/sessions' },
    { label: 'Content Creation', path: '/dashboard/hei-mentor/content-creation' }
  ],
  'hei-admin': [
    { label: 'Dashboard', path: '/dashboard/hei-admin' },
    { label: 'Mentors', path: '/dashboard/hei-admin/mentors' },
    { label: 'Analytics', path: '/dashboard/hei-admin/analytics' }
  ],
  'school-admin': [
    { label: 'Dashboard', path: '/dashboard/school-admin' },
    { label: 'Teachers', path: '/dashboard/school-admin/teachers' },
    { label: 'Students', path: '/dashboard/school-admin/students' },
    { label: 'Infrastructure', path: '/dashboard/school-admin/infrastructure' }
  ]
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeRoute, collapsed = false, className }) => (
  <aside className={cn('h-full min-h-screen bg-gray-50 border-r px-1 py-4 flex flex-col shadow', collapsed && 'w-16', className)}>
    <nav className="flex flex-col space-y-1 mt-2">
      {menuConfig[role]?.map(menu => (
        <Link
          href={menu.path}
          key={menu.path}
          className={cn(
            'block px-4 py-2 rounded hover:bg-blue-100 transition text-gray-700 font-medium',
            activeRoute === menu.path && 'bg-blue-50 text-blue-700'
          )}
        >
          {collapsed ? menu.label.charAt(0) : menu.label}
        </Link>
      ))}
    </nav>
  </aside>
)