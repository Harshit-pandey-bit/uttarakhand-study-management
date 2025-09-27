import React from 'react'
import { Progress } from '../../ui/progress'

export const ProgressRing: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex flex-col items-center">
    <div className="font-semibold text-sm mb-2">Learning Progress</div>
    <Progress value={value} max={100} showValue variant="circular" />
  </div>
)