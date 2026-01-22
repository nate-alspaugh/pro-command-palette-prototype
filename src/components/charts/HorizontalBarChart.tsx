import { motion } from 'framer-motion'

interface DataPoint {
  label: string
  value: number
}

const defaultData: DataPoint[] = [
  { label: 'Category A', value: 85 },
  { label: 'Category B', value: 78 },
  { label: 'Category C', value: 70 },
  { label: 'Category D', value: 68 },
  { label: 'Category E', value: 64 }
]

interface ColorInfo {
  fill: string
  glow: string
}

// Tailwind palette colors with glow variants
const colorMap: Record<string, ColorInfo> = {
  'accent-green': {
    fill: 'var(--color-accent-green)',
    glow: 'rgba(16, 185, 129, 0.4)' // emerald-500
  },
  'accent-blue': {
    fill: 'var(--color-accent-blue)',
    glow: 'rgba(37, 99, 235, 0.4)' // blue-600
  },
  'accent-red': {
    fill: 'var(--color-accent-red)',
    glow: 'rgba(239, 68, 68, 0.4)' // red-500
  },
  'accent-yellow': {
    fill: 'var(--color-accent-yellow)',
    glow: 'rgba(250, 204, 21, 0.4)' // yellow-400
  }
}

interface RatioThresholds {
  high: number
  medium: number
}

interface HorizontalBarChartProps {
  data?: DataPoint[]
  showLabels?: boolean
  showEndLabel?: boolean
  animated?: boolean
  ratioThresholds?: RatioThresholds
  sortOrder?: 'ascending' | 'descending'
}

export default function HorizontalBarChart({ 
  data = defaultData, 
  showLabels = true,
  showEndLabel = false,
  animated = true,
  ratioThresholds = { high: 75, medium: 65 }, // Thresholds for color ranges
  sortOrder = 'descending' // 'ascending' or 'descending'
}: HorizontalBarChartProps) {
  // Sort data based on sortOrder
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === 'ascending') return a.value - b.value
    return b.value - a.value // 'descending' (default)
  })
  
  const barVariants = {
    hidden: { width: 0 },
    visible: (i: number) => ({
      width: `${sortedData[i].value}%`, // Use value directly as percentage (0-100 scale)
      transition: {
        duration: 1.2,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  }
  
  const getColors = (item: DataPoint): ColorInfo => {
    // Use the value directly (assuming values are 0-100 scale)
    // If value is 75% or higher = green
    // If value is 65-74% = yellow
    // If value is below 65% = red
    if (item.value >= ratioThresholds.high) {
      return colorMap['accent-green']
    } else if (item.value >= ratioThresholds.medium) {
      return colorMap['accent-yellow']
    } else {
      return colorMap['accent-red']
    }
  }

  return (
    <div className="horizontal-bar-chart">
      {sortedData.map((item, index) => {
        const colors = getColors(item)
        const barWidth = `${item.value}%` // Use value directly as percentage
        return (
          <div key={item.label} className="horizontal-bar-row">
            {showLabels && (
              <span className="horizontal-bar-label">{item.label}</span>
            )}
            <div className="horizontal-bar-track">
              {animated ? (
                <motion.div
                  className="horizontal-bar-fill"
                  style={{ 
                    backgroundColor: colors.fill
                  }}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={barVariants}
                />
              ) : (
                <div 
                  className="horizontal-bar-fill"
                  style={{ 
                    width: barWidth,
                    backgroundColor: colors.fill
                  }}
                />
              )}
            </div>
            {showEndLabel && (
              <span className="horizontal-bar-end-label tabular-nums">{item.value}%</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
