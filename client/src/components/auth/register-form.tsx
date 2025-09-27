'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const steps = [
  { label: 'Account Info' },
  { label: 'Personal Details' },
  { label: 'Role Selection' },
  { label: 'Confirmation' }
]

export const RegisterForm: React.FC<{ onRegister?: (data: any) => Promise<void> }> = ({ onRegister }) => {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: '' })
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function next() {
    if (step < steps.length - 1) setStep(step + 1)
  }

  function back() {
    if (step > 0) setStep(step - 1)
  }

  const handleChange = (field: string, value: string) => setForm({ ...form, [field]: value })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onRegister) {
      setLoading(true)
      setError(null)
      try {
        await onRegister(form)
      } catch (err) {
        setError((err as Error).message)
      }
      setLoading(false)
    }
  }

  return (
    <form className="w-full max-w-md bg-white p-8 rounded-xl shadow" onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-6 text-blue-800">Create Account</h1>
      <div className="flex mb-6 gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className={`w-full h-1 rounded ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        ))}
      </div>

      {step === 0 && (
        <>
          <Input type="email" label="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
          <Input type="password" label="Password" value={form.password} onChange={e => handleChange('password', e.target.value)} required minLength={6} />
        </>
      )}

      {step === 1 && (
        <>
          <Input type="text" label="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => handleChange('role', e.target.value)} required>
              <option value="">Pick a role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="hei-mentor">HEI Mentor</option>
              <option value="hei-admin">HEI Admin</option>
              <option value="school-admin">School Admin</option>
            </select>
          </div>
        </>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-semibold mb-2">Confirm Details</h2>
          <ul className="space-y-1 text-sm">
            <li><b>Email:</b> {form.email}</li>
            <li><b>Name:</b> {form.name}</li>
            <li><b>Role:</b> {form.role}</li>
          </ul>
        </div>
      )}

      {error && <div className="text-red-600 mt-3">{error}</div>}

      <div className="flex justify-between gap-2 mt-8">
        {step > 0 && <Button type="button" variant="ghost" onClick={back}>Back</Button>}
        {step < steps.length - 1 && <Button type="button" onClick={next}>Next</Button>}
        {step === steps.length - 1 && <Button type="submit" loading={loading}>Register</Button>}
      </div>
    </form>
  )
}