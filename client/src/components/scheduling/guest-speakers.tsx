import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Speaker {
  name: string
  topic: string
  date: string
}

const sampleSpeakers: Speaker[] = [
  { name: 'Dr. Anil Kumar', topic: 'Career in AI', date: '2025-10-15' },
  { name: 'Ms. Leena Sharma', topic: 'Environmental Science', date: '2025-11-01' }
]

export const GuestSpeakers: React.FC = () => {
  const [speakers, setSpeakers] = useState(sampleSpeakers)
  const [name, setName] = useState('')
  const [topic, setTopic] = useState('')
  const [date, setDate] = useState('')

  const addSpeaker = () => {
    if (!name || !topic || !date) return
    setSpeakers([...speakers, { name, topic, date }])
    setName('')
    setTopic('')
    setDate('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Speaker Scheduling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Speaker Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Topic" value={topic} onChange={e => setTopic(e.target.value)} />
            <Input type="date" label="Date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <Button onClick={addSpeaker} variant="primary" size="sm">Add Speaker</Button>
          <ul className="divide-y max-h-48 overflow-auto">
            {speakers.map((s, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{s.name} - {s.topic}</span>
                <span className="text-xs text-gray-500">{s.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}