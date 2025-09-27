import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

interface Recommendation {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => (
  <Card>
    <CardHeader>
      <CardTitle>{recommendation.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4">{recommendation.description}</p>
      <Button onClick={recommendation.onAction}>{recommendation.actionLabel}</Button>
    </CardContent>
  </Card>
)