import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Charts } from '@/components/ui/charts'

interface ImpactMetricsProps {
  testImprovement: number
  cpdParticipation: number
  stemEngagement: number
  partnershipHealth: number
  chartData?: any
}

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({
  testImprovement,
  cpdParticipation,
  stemEngagement,
  partnershipHealth,
  chartData
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Impact Metrics Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-semibold">Test Improvement</p>
          <p>{testImprovement}% improvement in student tests</p>
        </div>
        <div>
          <p className="font-semibold">CPD Participation</p>
          <p>{cpdParticipation}% of teachers completed CPD courses</p>
        </div>
        <div>
          <p className="font-semibold">STEM Engagement</p>
          <p>{stemEngagement}% increase in STEM activities</p>
        </div>
        <div>
          <p className="font-semibold">Partnership Health</p>
          <p>{partnershipHealth}% active healthy partnerships</p>
        </div>
      </div>
      {chartData && (
        <div className="mt-6">
          <Charts type="bar" data={chartData} />
        </div>
      )}
    </CardContent>
  </Card>
)