import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin({ email, password }: { email: string; password: string }) {
    setError(null)
    setLoading(true)

    // Replace below with real API call for auth
    if (email === 'student@school.edu' && password === 'demo123') {
      setLoading(false)
      // On success navigate to dashboard (student role assumed)
      router.push('/dashboard/student')
    } else {
      setLoading(false)
      setError('Invalid email or password')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
    </div>
  )
}