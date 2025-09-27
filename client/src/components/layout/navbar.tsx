'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Button } from '../ui/button'

interface NavbarProps {
  user?: { name: string, role: string }
  role?: string
  onLogout?: () => void
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({ user, role, onLogout, className }) => {
  // Example navigation for each role, replace with your actual routes
  const roleMenus: Record<string, { path: string, label: string }[]> = {
    student: [
      { path: '/dashboard/student', label: 'Dashboard' },
      { path: '/dashboard/student/assignments', label: 'Assignments' },
      { path: '/dashboard/student/projects', label: 'Projects' },
    ],
    teacher: [
      { path: '/dashboard/teacher', label: 'Dashboard' },
      { path: '/dashboard/teacher/ai-assistant', label: 'AI Tools' },
    ],
    'hei-mentor': [{ path: '/dashboard/hei-mentor', label: 'Mentor Hub' }],
    'hei-admin': [{ path: '/dashboard/hei-admin', label: 'Admin Dashboard' }],
    'school-admin': [{ path: '/dashboard/school-admin', label: 'School Admin' }]
  }

  return (
    <nav className={cn('bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg text-blue-700">Govt School Mentoring</Link>
        {role && (
          <div className="flex gap-2">
            {roleMenus[role]?.map(menu => (
              <Link key={menu.path} href={menu.path} className="text-gray-700 hover:text-blue-700 px-2 py-1 rounded transition">
                {menu.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3 items-center">
        {user && (
          <span className="text-gray-600 text-sm">
            Welcome, {user.name} <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs capitalize">{user.role}</span>
          </span>
        )}
        {onLogout && (
          <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
        )}
      </div>
    </nav>
  )
}