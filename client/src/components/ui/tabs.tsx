"use client"

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface Tab {
  id: string
  label: string
  content?: React.ReactNode
  disabled?: boolean
  badge?: number | string
}

export interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className
}) => {
  const [currentTab, setCurrentTab] = React.useState(activeTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return
    
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const tabSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    if (variant === 'pills') {
      return cn(
        baseClasses,
        tabSizeClasses[size],
        "rounded-md",
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        tab.disabled && "opacity-50 cursor-not-allowed"
      )
    }
    
    if (variant === 'underline') {
      return cn(
        baseClasses,
        tabSizeClasses[size],
        "border-b-2 rounded-none",
        isActive 
          ? "border-blue-600 text-blue-600" 
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
        tab.disabled && "opacity-50 cursor-not-allowed"
      )
    }

    // Default variant
    return cn(
      baseClasses,
      tabSizeClasses[size],
      "rounded-t-md border-x border-t",
      isActive 
        ? "bg-white border-gray-300 text-gray-900 border-b-white" 
        : "bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 border-b-gray-300",
      tab.disabled && "opacity-50 cursor-not-allowed"
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className={cn(
        "flex",
        variant === 'default' && "border-b border-gray-300",
        variant === 'pills' && "space-x-1 bg-gray-100 p-1 rounded-md",
        variant === 'underline' && "border-b border-gray-200"
      )}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={getTabClasses(tab, isActive)}
              disabled={tab.disabled}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium",
                  isActive ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-all duration-200",
              currentTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
