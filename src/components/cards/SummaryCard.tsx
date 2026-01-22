import { useRef, ReactNode } from 'react'
import { useCardHover } from '../../hooks'
import { Chip } from '../ui'

interface SummaryCardProps {
  title: string
  badge?: string
  variant?: 'positive' | 'negative'
  children: ReactNode
}

export default function SummaryCard({ title, badge, variant = 'positive', children }: SummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  useCardHover(cardRef)

  const variantClass = variant === 'positive' ? 'card-glow-green' : 'card-glow-red'
  const chipVariant = variant === 'positive' ? 'success' : 'error'

  return (
    <div ref={cardRef} className={`card ${variantClass}`}>
      <div className="card-header">
        <h2>{title}</h2>
        {badge && <Chip variant={chipVariant}>{badge}</Chip>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}
