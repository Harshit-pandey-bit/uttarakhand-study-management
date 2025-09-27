import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { ProgressRing } from '../dashboard/progress-ring'

interface PortfolioAnalyticsProps {
  achievements: number
  completedProjects: number
  learningHours: number
  progressPercent: number
}

export const ProgressAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  achievements,
  completedProjects,
  learningHours,
  progressPercent
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Portfolio Analytics</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-around text-center space-x-6">
        <div>
          <div className="text-2xl font-bold">{achievements}</div>
          <div className="text-xs text-gray-500">Badges Earned</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{completedProjects}</div>
          <div className="text-xs text-gray-500">Projects Completed</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{learningHours}</div>
          <div className="text-xs text-gray-500">Learning Hours</div>
        </div>
      </div>
      <ProgressRing value={progressPercent} />
    </CardContent>
  </Card>
)