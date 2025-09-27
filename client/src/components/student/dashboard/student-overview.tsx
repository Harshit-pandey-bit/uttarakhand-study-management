'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
const steps = [
  { id: 'intro', label: 'Welcome', content: 'Welcome to the school mentoring platform! Let’s get you set up.' },
  { id: 'details', label: 'Profile', content: 'Please complete your profile before accessing the dashboard.' },
  { id: 'tour', label: 'Tour', content: 'Here’s a quick tour of your new dashboard!' },
  { id: 'done', label: 'Ready', content: 'You’re good to go. Start exploring the platform!' }
]

export const OnboardingWizard: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0)

  function next() {
    if (step < steps.length - 1) setStep(s => s + 1)
    else onFinish?.()
  }

  function back() {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <div className="mx-auto max-w-md mt-10 bg-white p-8 rounded-lg shadow">
      <div className="mb-6">
        <ol className="flex space-x-4 text-xs text-gray-400">
          {steps.map((s, i) => (
            <li key={s.id} className={step === i ? 'text-blue-600 font-bold' : undefined}>{s.label}</li>
          ))}
        </ol>
      </div>
      <div className="mb-6 min-h-[60px]">{steps[step].content}</div>
      <div className="flex justify-between">
        {step > 0 && <Button variant="ghost" onClick={back}>Back</Button>}
        <Button onClick={next}>{step === steps.length - 1 ? 'Finish' : 'Next'}</Button>
      </div>
    </div>
  )
}