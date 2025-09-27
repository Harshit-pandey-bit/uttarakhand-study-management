import React from 'react'
import { Button } from '../../ui/button'

interface MentoringSession {
  date: string
  mentor: string
  topic: string
  status: 'upcoming' | 'completed'
}

const sessions: MentoringSession[] = [
  { date: '2025-09-30', mentor: 'Dr. Priya Verma', topic: 'STEM Exploration', status: 'upcoming' },
  { date: '2025-09-20', mentor: 'Dr. Rajesh Kumar', topic: 'Career Guidance', status: 'completed' }
]

export const SessionScheduler: React.FC<{ sessions?: MentoringSession[] }> = ({ sessions: propSessions }) => {
  const allSessions = propSessions || sessions
  return (
    <div>
      <h3 className="font-semibold text-base mb-2">Your Mentoring Sessions</h3>
      <ul className="divide-y">
        {allSessions.map((s, i) => (
          <li key={i} className={`py-2 flex items-center justify-between ${s.status === 'upcoming' ? 'font-bold' : 'opacity-70'}`}>
            <div>
              <div>{s.topic}</div>
              <div className="text-xs text-gray-500">With {s.mentor}, {s.date}</div>
            </div>
            {s.status === 'upcoming' ? (
              <Button size="sm" variant="primary">Join</Button>
            ) : (
              <Button size="sm" variant="outline">View</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}