import { motion } from 'framer-motion'

interface DataPoint {
  label: string
  value: number
}

const defaultData: DataPoint[] = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 85 },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 92 }
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

interface BarChartProps {
  data?: DataPoint[]
  height?: number
  showLabels?: boolean
  showValues?: boolean
  color?: 'accent-green' | 'accent-blue' | 'accent-red' | 'accent-yellow'
  animated?: boolean
}

export default function BarChart({ 
  data = defaultData, 
  height = 200,
  showLabels = true,
  showValues = false,
  color = 'accent-green',
  animated = true
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const colors = colorMap[color] || colorMap['accent-green']

  const barVariants = {
    hidden: { height: 0 },
    visible: (i: number) => ({
      height: `${(data[i].value / maxValue) * 100}%`,
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  }

  return (
    <div className="bar-chart" style={{ height }}>
      <div className="bar-chart-container">
        {data.map((item, index) => (
          <div key={item.label} className="bar-chart-column">
            <div className="bar-chart-bar-wrapper">
              {showValues && (
                <span className="bar-chart-value">{item.value}%</span>
              )}
              {animated ? (
                <motion.div
                  className="bar-chart-bar"
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
                  className="bar-chart-bar"
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: colors.fill
                  }}
                />
              )}
            </div>
            {showLabels && (
              <span className="bar-chart-label">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
