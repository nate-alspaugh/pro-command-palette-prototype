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
  fill: string
  glow: string
}

// Tailwind default palette colors with rgba fills and glow
const colorMap: Record<string, ColorInfo> = {
  'accent-green': {
    stroke: 'var(--color-accent-green)',
    fill: 'rgba(16, 185, 129, 0.2)', // emerald-500 @ 20%
    glow: 'rgba(16, 185, 129, 0.5)'
  },
  'accent-blue': {
    stroke: 'var(--color-accent-blue)',
    fill: 'rgba(37, 99, 235, 0.2)', // blue-600 @ 20%
    glow: 'rgba(37, 99, 235, 0.5)'
  },
  'accent-red': {
    stroke: 'var(--color-accent-red)',
    fill: 'rgba(239, 68, 68, 0.2)', // red-500 @ 20%
    glow: 'rgba(239, 68, 68, 0.5)'
  },
  'accent-yellow': {
    stroke: 'var(--color-accent-yellow)',
    fill: 'rgba(250, 204, 21, 0.2)', // yellow-400 @ 20%
    glow: 'rgba(250, 204, 21, 0.5)'
  }
}

interface AreaChartProps {
  data?: DataPoint[]
  height?: number
  showLabels?: boolean
  color?: 'accent-green' | 'accent-blue' | 'accent-red' | 'accent-yellow'
  animated?: boolean
}

export default function AreaChart({ 
  data = defaultData, 
  height = 200,
  showLabels = true,
  color = 'accent-green',
  animated = true
}: AreaChartProps) {
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
  
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${path} L ${point.x} ${point.y}`
  }, '')
  
  // Create area path (line + bottom closure)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${viewBoxHeight - paddingY} L ${points[0].x} ${viewBoxHeight - paddingY} Z`

  const colors = colorMap[color] || colorMap['accent-green']

  return (
    <div className="area-chart" style={{ height }}>
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        preserveAspectRatio="none" 
        className="area-chart-svg"
      >
        {/* Grid lines */}
        <g className="area-chart-grid">
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
        
        {/* Area fill */}
        {animated ? (
          <motion.path
            d={areaPath}
            fill={colors.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        ) : (
          <path d={areaPath} fill={colors.fill} />
        )}
        
        {/* Line - uses same path as top of area fill */}
        {animated ? (
          <motion.path
            d={linePath}
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
            d={linePath}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        )}
      </svg>
      
      {showLabels && (
        <div className="area-chart-labels">
          {data.map((item) => (
            <span key={item.label} className="area-chart-label">{item.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
