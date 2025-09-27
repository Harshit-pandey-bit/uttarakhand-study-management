import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CalendarProps {
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
  rangeSelection?: boolean
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  className,
  rangeSelection = false
}) => {
  // Minimal - replace with react-day-picker or your custom logic as needed for real project
  return (
    <input
      type="date"
      value={value ? value.toISOString().substring(0, 10) : ''}
      onChange={e => {
        if (!e.target.value) return onChange(null)
        onChange(new Date(e.target.value))
      }}
      min={minDate ? minDate.toISOString().substring(0, 10) : undefined}
      max={maxDate ? maxDate.toISOString().substring(0, 10) : undefined}
      disabled={disabled}
      className={cn(
        'rounded border-gray-300 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500',
        className
      )}
    />
  )
}