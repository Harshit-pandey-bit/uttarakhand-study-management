import React from 'react'
import { cn } from '@/lib/utils/cn'

interface ProgressProps {
  value: number
  max?: number
  variant?: 'linear' | 'circular'
  showValue?: boolean
  label?: string
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'linear',
  showValue = true,
  label,
  className
}) => {
  const percent = Math.min((value / max) * 100, 100)

  if (variant === 'circular') {
    const radius = 28
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        {label && <span className="mb-2 text-sm font-medium">{label}</span>}
        <svg className="h-16 w-16" viewBox="0 0 64 64">
          <circle
            className="text-gray-200"
            strokeWidth={6}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={32}
            cy={32}
          />
          <circle
            className="text-blue-600"
            strokeWidth={6}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={32}
            cy={32}
            style={{ transition: 'stroke-dashoffset 0.4s' }}
          />
        </svg>
        {showValue && <span className="text-sm mt-1">{Math.round(percent)}%</span>}
      </div>
    )
  }

  // Linear variant
  return (
    <div className={cn('space-y-1', className)}>
      {label && <span className="block text-sm font-medium">{label}</span>}
      <div className="w-full bg-gray-200 h-3 rounded-full relative overflow-hidden">
        <div
          className="h-3 bg-blue-600 rounded-full transition-all"
          style={{ width: ${percent}% }}
        />
      </div>
      {showValue && (
        <div className="text-xs text-gray-600 mt-1">{value} / {max}</div>
      )}
    </div>
  )
}