import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

interface PrepTool {
  name: string
  description: string
}

const prepTools: PrepTool[] = [
  { name: 'Session Notes', description: 'Prepare notes and links before your mentoring session.' },
  { name: 'Student Progress', description: 'Review student’s recent progress and goals.' }
]

export const SessionPrepTools: React.FC<{ tools?: PrepTool[] }> = ({ tools = prepTools }) => (
  <Card>
    <CardHeader>
      <CardTitle>Session Preparation</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="mb-3">
        {tools.map(tool => (
          <li key={tool.name} className="mb-2">
            <div className="font-semibold">{tool.name}</div>
            <div className="text-xs text-gray-500">{tool.description}</div>
          </li>
        ))}
      </ul>
      <Button variant="primary" size="sm">Start Prep</Button>
    </CardContent>
  </Card>
)