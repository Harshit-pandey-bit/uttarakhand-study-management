import React from 'react'
import { Badge } from '../../ui/badge'

interface CPDRemindersProps {
  reminders: { title: string, dueDate: string }[]
}

export const CPDReminders: React.FC<CPDRemindersProps> = ({ reminders }) => (
  <div>
    <span className="font-semibold mb-2 block">CPD Reminders</span>
    <ul className="space-y-2">
      {reminders.map((item, i) => (
        <li key={i} className="flex justify-between items-center border-b pb-1">
          <span>{item.title}</span>
          <Badge variant="warning">{item.dueDate}</Badge>
        </li>
      ))}
    </ul>
  </div>
)