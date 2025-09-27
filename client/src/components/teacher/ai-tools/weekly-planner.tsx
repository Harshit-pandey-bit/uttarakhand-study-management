import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const WeeklyPlanner: React.FC = () => {
  const [plan, setPlan] = useState<Record<string, string>>({})

  const updateDayPlan = (day: string, text: string) => {
    setPlan(prev => ({ ...prev, [day]: text }))
  }

  const savePlan = () => {
    // Save or submit the weekly plan via API
    alert('Weekly plan saved!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Lesson Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {days.map(day => (
            <div key={day}>
              <label className="block mb-1 font-semibold">{day}</label>
              <textarea
                rows={3}
                className="w-full border rounded p-2 resize-none"
                value={plan[day] || ''}
                onChange={e => updateDayPlan(day, e.target.value)}
                placeholder={`Plan for ${day}`}
              />
            </div>
          ))}
          <Button variant="primary" onClick={savePlan}>Save Weekly Plan</Button>
        </div>
      </CardContent>
    </Card>
  )
}