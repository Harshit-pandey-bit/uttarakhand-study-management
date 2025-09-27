'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface LoginFormProps {
  onLogin?: (creds: { email: string; password: string }) => Promise<void>
  loading?: boolean
  error?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onLogin) await onLogin({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 bg-white p-8 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-2 text-blue-800">Sign in to your account</h1>
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        placeholder="Enter password"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 select-none">
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
          <span className="text-xs text-gray-600">Remember me</span>
        </label>
        <a href="/auth/forgot-password" className="text-xs text-blue-700 hover:underline">Forgot password?</a>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" loading={loading} className="w-full">Login</Button>
      <div className="text-xs text-center mt-2 text-gray-500">
        By signing in, you agree to our <a className="text-blue-600 underline" href="#">Terms</a> and <a className="text-blue-600 underline" href="#">Privacy Policy</a>
      </div>
    </form>
  )
}