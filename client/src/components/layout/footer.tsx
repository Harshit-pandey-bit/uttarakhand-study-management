import React from 'react'
import { cn } from '@/lib/utils/cn'

interface FooterProps {
  minimal?: boolean
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ minimal = false, className }) => (
  <footer className={cn('w-full border-t bg-white py-4 px-4 flex justify-between items-center', className)}>
    <div>
      <span className="text-xs text-gray-500">© {new Date().getFullYear()} Government School Mentoring Platform</span>
    </div>
    {!minimal && (
      <div className="flex gap-3">
        <a href="https://diksha.gov.in/" className="text-blue-600 hover:underline text-xs" target="_blank" rel="noopener noreferrer">DIKSHA</a>
        <a href="https://www.careerpathways.gov.in/" className="text-blue-600 hover:underline text-xs" target="_blank" rel="noopener noreferrer">Career Pathways</a>
        <a href="https://www.mhrd.gov.in/" className="text-blue-600 hover:underline text-xs" target="_blank" rel="noopener noreferrer">MHRD</a>
      </div>
    )}
  </footer>
)