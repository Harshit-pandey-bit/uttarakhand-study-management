import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'

interface Project {
  title: string
  status: 'active' | 'showcase'
  teamMembers: string[]
  deadline: string
}

const sampleProjects: Project[] = [
  { title: 'Solar System Model', status: 'active', teamMembers: ['Ankit', 'Neha'], deadline: '2025-10-05' },
  { title: 'Water Purification', status: 'showcase', teamMembers: ['Rahul', 'Priya'], deadline: '2025-08-30' }
]

export const ProjectCard: React.FC<{ projects?: Project[] }> = ({ projects = sampleProjects }) => (
  <div className="grid gap-3 md:grid-cols-2">
    {projects.map(p => (
      <Card key={p.title}>
        <CardHeader>
          <CardTitle>{p.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <Badge variant={p.status === 'active' ? 'success' : 'info'}>
              {p.status === 'active' ? 'In Progress' : 'Showcase'}
            </Badge>
            <span className="text-xs text-gray-500">Team: {p.teamMembers.join(', ')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">Deadline: {p.deadline}</span>
            <Button size="sm" variant="secondary">{p.status === 'active' ? 'Edit' : 'View'}</Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)