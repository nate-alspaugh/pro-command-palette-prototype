import { motion } from 'framer-motion'

interface DataPoint {
  label: string
  value: number
}

const defaultData: DataPoint[] = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 62 },
  { label: 'May', value: 55 },
  { label: 'Jun', value: 78 }
]

interface ColorInfo {
  stroke: string
  glow: string
}

// Tailwind palette colors with glow variants
const colorMap: Record<string, ColorInfo> = {
  'accent-green': {
    stroke: 'var(--color-accent-green)',
    glow: 'rgba(16, 185, 129, 0.5)' // emerald-500
  },
  'accent-blue': {
    stroke: 'var(--color-accent-blue)',
    glow: 'rgba(37, 99, 235, 0.5)' // blue-600
  },
  'accent-red': {
    stroke: 'var(--color-accent-red)',
    glow: 'rgba(239, 68, 68, 0.5)' // red-500
  },
  'accent-yellow': {
    stroke: 'var(--color-accent-yellow)',
    glow: 'rgba(250, 204, 21, 0.5)' // yellow-400
  }
}

interface LineChartProps {
  data?: DataPoint[]
  height?: number
  showLabels?: boolean
  showDots?: boolean
  color?: 'accent-green' | 'accent-blue' | 'accent-red' | 'accent-yellow'
  animated?: boolean
}

export default function LineChart({ 
  data = defaultData, 
  height = 200,
  showLabels = true,
  showDots = true,
  color = 'accent-green',
  animated = true
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  // ViewBox dimensions - no horizontal padding so path aligns with labels
  const viewBoxWidth = 400
  const viewBoxHeight = 200
  const paddingY = 20
  
  interface Point extends DataPoint {
    x: number
    y: number
  }
  
  const points: Point[] = data.map((item, index) => {
    // X spans full width (0 to viewBoxWidth)
    const x = (index / (data.length - 1)) * viewBoxWidth
    const y = paddingY + (1 - (item.value - minValue) / range) * (viewBoxHeight - paddingY * 2)
    return { x, y, ...item }
  })
  
  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${path} L ${point.x} ${point.y}`
  }, '')

  const colors = colorMap[color] || colorMap['accent-green']

  return (
    <div className="line-chart" style={{ height }}>
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        preserveAspectRatio="none" 
        className="line-chart-svg"
      >
        {/* Grid lines */}
        <g className="line-chart-grid">
          {[0, 25, 50, 75, 100].map(percent => (
            <line 
              key={percent}
              x1={0} 
              y1={paddingY + (percent / 100) * (viewBoxHeight - paddingY * 2)} 
              x2={viewBoxWidth} 
              y2={paddingY + (percent / 100) * (viewBoxHeight - paddingY * 2)}
              stroke="var(--color-surface-1)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        
        {/* Line */}
        {animated ? (
          <motion.path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="butt"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ) : (
          <path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        )}
        
        {/* Dots */}
        {showDots && points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={colors.stroke}
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: animated ? 0.5 + index * 0.1 : 0, duration: 0.3 }}
          />
        ))}
      </svg>
      
      {showLabels && (
        <div className="line-chart-labels">
          {data.map((item) => (
            <span key={item.label} className="line-chart-label">{item.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
