import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card'
import { Badge } from '../../ui/badge'

interface Feedback {
  mentorName: string
  date: string
  comments: string
  rating: number
}

interface ProjectFeedbackProps {
  feedbacks: Feedback[]
}

export const ProjectFeedback: React.FC<ProjectFeedbackProps> = ({ feedbacks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Mentor Feedback</CardTitle>
    </CardHeader>
    <CardContent>
      {feedbacks.length === 0 && <p className="text-sm text-gray-500">No feedback yet.</p>}
      {feedbacks.map((fb, idx) => (
        <div key={idx} className="mb-4 border-b pb-3 last:border-0 last:pb-0">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{fb.mentorName}</span>
            <span className="text-xs text-gray-400">{fb.date}</span>
          </div>
          <p className="mb-2 text-gray-700">{fb.comments}</p>
          <Badge variant={fb.rating > 3 ? 'success' : 'warning'}>Rating: {fb.rating} / 5</Badge>
        </div>
      ))}
    </CardContent>
    <CardFooter>
      {/* Optionally add a button for adding new feedback */}
    </CardFooter>
  </Card>
)