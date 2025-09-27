import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export const LessonPlanner: React.FC = () => {
  const [topic, setTopic] = useState('')
  const [lessonPlan, setLessonPlan] = useState('')
  const [loading, setLoading] = useState(false)

  async function generatePlan() {
    setLoading(true)
    // Placeholder: Call AI API with topic input here
    setTimeout(() => {
      setLessonPlan(`Lesson plan for: ${topic}\n\n- Introduction\n- Main content\n- Activities\n- Assessment`)
      setLoading(false)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Lesson Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          label="Lesson Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter lesson topic"
        />
        <Button onClick={generatePlan} disabled={!topic} loading={loading} className="mt-4">
          Generate Plan
        </Button>
        {lessonPlan && (
          <pre className="mt-4 bg-gray-50 p-4 rounded whitespace-pre-wrap">{lessonPlan}</pre>
        )}
      </CardContent>
    </Card>
  )
}