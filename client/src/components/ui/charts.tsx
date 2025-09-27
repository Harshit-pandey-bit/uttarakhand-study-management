'use client'

import React from 'react'

export interface ChartProps {
  data: any
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area'
  config?: any
  responsive?: boolean
  className?: string
}

// Uses next/dynamic to load a light chart lib only on client, e.g., react-chartjs-2
import dynamic from 'next/dynamic'
const ChartJS = dynamic(() => import('react-chartjs-2').then(m => m.Chart), { ssr: false })

export const Charts: React.FC<ChartProps> = ({
  data,
  type,
  config,
  responsive = true,
  className
}) => {
  if (!data) return null

  const chartProps = {
    type,
    data,
    options: { ...config, responsive }
  } as any

  return (
    <div className={className}>
      <ChartJS {...chartProps} />
    </div>
  )
}