import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'

interface Career {
  icon: string
  title: string
  description: string
  tags?: string[]
}

const sampleCareers: Career[] = [
  { icon: '/icons/career-icons/engineer.svg', title: 'Engineer', description: 'Design and build technology solutions.', tags: ['STEM', 'Math'] },
  { icon: '/icons/career-icons/doctor.svg', title: 'Doctor', description: 'Help people stay healthy.', tags: ['Biology', 'Science'] },
  { icon: '/icons/career-icons/scientist.svg', title: 'Scientist', description: 'Conduct experiments to discover new knowledge.', tags: ['Experiment', 'Research'] }
]

export const CareerCards: React.FC<{ careers?: Career[] }> = ({ careers = sampleCareers }) => (
  <div className="grid gap-3 md:grid-cols-2">
    {careers.map(career => (
      <Card key={career.title}>
        <CardHeader>
          <div className="flex gap-2 items-center">
            <img src={career.icon} alt={career.title} className="w-8 h-8" />
            <CardTitle>{career.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mb-2">{career.description}</div>
          <div className="space-x-1">
            {career.tags?.map(tag => (
              <Badge key={tag} variant="info">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)