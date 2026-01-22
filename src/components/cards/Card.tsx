import { useRef, ReactNode } from 'react'
import { useCardHover } from '../../hooks'

interface CardProps {
  title: string
  badge?: ReactNode
  children: ReactNode
}

export default function Card({ title, badge, children }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  useCardHover(cardRef)

  return (
    <div ref={cardRef} className="card">
      <div className="card-header">
        <h2>{title}</h2>
        {badge && badge}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}
