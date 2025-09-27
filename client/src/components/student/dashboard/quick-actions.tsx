import React from 'react'
import { Button } from '../../ui/button'

export const QuickActions: React.FC = () => (
  <div className="grid grid-cols-2 gap-2">
    <Button variant="primary" size="sm">Join Mentoring</Button>
    <Button variant="secondary" size="sm">Submit Assignment</Button>
    <Button variant="outline" size="sm">Start Project</Button>
    <Button variant="ghost" size="sm">View Portfolio</Button>
  </div>
)