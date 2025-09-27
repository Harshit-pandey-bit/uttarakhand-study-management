'use client'

import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth/login'
}) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && (!user || (requiredRole && user.role !== requiredRole))) {
      router.replace(redirectTo)
    }
  }, [user, loading, requiredRole, router, redirectTo])

  if (loading || !user) {
    return <div className="py-10 text-center text-gray-400">Authenticating…</div>
  }

  return <>{children}</>
}