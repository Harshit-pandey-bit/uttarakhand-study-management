import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Charts } from '@/components/ui/charts'

export const TrackingAnalytics: React.FC<{ chartData: any }> = ({ chartData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Analytics Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <Charts type="line" data={chartData} responsive />
    </CardContent>
  </Card>
)