import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface TeacherOverviewProps {
  name: string
  assignedClasses: number
  studentsCount: number
  assignmentsPending: number
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  name, assignedClasses, studentsCount, assignmentsPending
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Hello, {name}</CardTitle>
      <p className="text-xs text-gray-500">{assignedClasses} assigned class{assignedClasses !== 1 ? 'es' : ''}</p>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-semibold">Total Students:</span> {studentsCount}
        </div>
        <div>
          <span className="font-semibold">Pending Assignments:</span> {assignmentsPending}
        </div>
      </div>
    </CardContent>
  </Card>
)