import React from 'react'

interface ChipProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  filled?: boolean
  className?: string
}

/**
 * Chip component for status indicators and badges.
 */
export default function Chip({ children, variant = 'neutral', filled = true, className = '' }: ChipProps) {
  const variantClass = `chip-${variant}`
  const styleClass = filled ? 'chip-filled' : 'chip-outline'
  
  return (
    <span className={`chip ${variantClass} ${styleClass} ${className}`}>
      {children}
    </span>
  )
}
