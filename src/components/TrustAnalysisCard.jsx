import { useRef } from 'react'
import { useCardHover } from '../hooks/useCardHover'

const firms = [
  { name: 'Freedom Capital Markets', width: 85, color: 'green' },
  { name: 'Truist Securities', width: 78, color: 'green' },
  { name: 'Benchmark', width: 70, color: 'yellow' },
  { name: 'Macquarie', width: 68, color: 'red' },
  { name: 'Wells Fargo', width: 65, color: 'yellow' }
]

function TrustAnalysisCard() {
  const cardRef = useRef(null)
  useCardHover(cardRef)

  return (
    <div ref={cardRef} className="card">
      <div className="card-header">
        <h2>Trust analysis</h2>
      </div>
      <div className="card-body trust-list">
        {firms.map((firm) => (
          <div key={firm.name} className="trust-row">
            <div className="firm-label">{firm.name}</div>
            <div className="bar-track">
              <div className={`bar-fill ${firm.color}`} style={{ width: `${firm.width}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrustAnalysisCard
