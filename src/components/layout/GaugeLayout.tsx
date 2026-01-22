import React from 'react'
import { motion } from 'framer-motion'
import DataTable from './DataTable'

interface DataTableItem {
  label: string
  value: string
  colorClass?: string
}

interface DonutSegment {
  value: number
  color: 'accent-green' | 'accent-blue' | 'accent-red' | 'accent-yellow' | 'muted'
  label?: string
}

interface GaugeLayoutProps {
  data?: DonutSegment[]
  centerLabel?: string
  centerValue?: string
  tableItems?: DataTableItem[]
}

// Color map for donut chart segments
const colorMap: Record<string, string> = {
  'accent-green': 'var(--color-accent-green)',
  'accent-blue': 'var(--color-accent-blue)',
  'accent-red': 'var(--color-accent-red)',
  'accent-yellow': 'var(--color-accent-yellow)',
  'muted': 'rgba(255, 255, 255, 0.1)'
}

export default function GaugeLayout({ data = [], centerLabel, centerValue, tableItems = [] }: GaugeLayoutProps) {
  const centerX = 50
  const centerY = 50
  const outerRadius = 40
  const innerRadius = 28 // Creates the donut hole
  const startAngle = 0 // Start from top (12 o'clock)
  
  // Calculate total and angles for each segment
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0)
  
  // Helper function to convert angle to coordinates
  // In SVG: 0° = 3 o'clock (right), angles increase clockwise
  // For charts: we want 0° = 12 o'clock (top), so we offset by -90°
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    // Convert to radians, offset by -90 to start from top
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }
  
  // Create arc path for donut segment
  const createArc = (startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle)
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle)
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle)
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
  }
  
  // Calculate segments with angles
  let currentAngle = startAngle
  const segments = data.map((item) => {
    const value = item.value || 0
    const angle = total > 0 ? (value / total) * 360 : 0
    const segmentStartAngle = currentAngle
    const segmentEndAngle = currentAngle + angle
    currentAngle = segmentEndAngle
    
    return {
      ...item,
      startAngle: segmentStartAngle,
      endAngle: segmentEndAngle,
      path: createArc(segmentStartAngle, segmentEndAngle),
      color: colorMap[item.color] || colorMap['muted']
    }
  })

  return (
    <div className="consensus-layout">
      <div className="gauge-wrapper">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <motion.path
              key={index}
              d={segment.path}
              fill={segment.color}
              initial={{ d: createArc(segment.startAngle, segment.startAngle) }}
              animate={{ d: segment.path }}
              transition={{
                duration: 1.5,
                delay: 0.4 + (index * 0.1),
                ease: [0.16, 1, 0.3, 1] // easeOutExpo approximation
              }}
              className="gauge-donut"
            />
          ))}
        </svg>
        <div className="gauge-overlay-text">
          {centerValue && <span className="val tabular-nums">{centerValue}</span>}
          {centerLabel && <span className="lbl">{centerLabel}</span>}
        </div>
      </div>
      {tableItems && tableItems.length > 0 && <DataTable items={tableItems} />}
    </div>
  )
}
