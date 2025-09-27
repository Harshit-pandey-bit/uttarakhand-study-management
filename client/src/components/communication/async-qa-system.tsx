'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface QAEntry {
  id: number
  question: string
  answer?: string
  status: 'pending' | 'answered'
}

export const AsyncQASystem: React.FC = () => {
  const [qaEntries, setQaEntries] = useState<QAEntry[]>([])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submitQuestion = () => {
    if (!input.trim()) return
    const newEntry: QAEntry = {
      id: qaEntries.length + 1,
      question: input.trim(),
      status: 'pending'
    }
    setQaEntries([...qaEntries, newEntry])
    setInput('')
    // Simulate async answer processing
    setTimeout(() => {
      setQaEntries(entries =>
        entries.map(e =>
          e.id === newEntry.id ? { ...e, status: 'answered', answer: 'This is a sample response to your question.' } : e
        )
      )
    }, 3000)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [qaEntries])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Async Q&A System</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="max-h-64 overflow-auto space-y-2">
          {qaEntries.map(({ id, question, answer, status }) => (
            <li key={id} className="border rounded p-2">
              <p className="font-semibold">{question}</p>
              <p className={`mt-1 text-sm ${status === 'answered' ? 'text-gray-700' : 'italic text-gray-400'}`}>
                {status === 'answered' ? answer : 'Waiting for answer...'}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Ask your question here"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitQuestion()}
          />
          <Button disabled={!input.trim()} onClick={submitQuestion}>Ask</Button>
        </div>
      </CardContent>
    </Card>
  )
}