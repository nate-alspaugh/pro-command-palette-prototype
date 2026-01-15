import { useEffect, useRef } from 'react'
import { useCardHover } from '../hooks/useCardHover'

function AnalystConsensusCard() {
  const cardRef = useRef(null)
  useCardHover(cardRef)

  return (
    <div ref={cardRef} className="card card-glow-green">
      <div className="card-header">
        <h2>Analyst consensus</h2>
        <span className="badge badge-buy">BUY</span>
      </div>
      <div className="card-body consensus-layout">
        <div className="gauge-wrapper">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#00C853" 
              strokeWidth="8" 
              strokeDasharray="251.2" 
              strokeDashoffset="40" 
              transform="rotate(-90 50 50)"
              className="gauge-circle"
            />
          </svg>
          <div className="gauge-overlay-text">
            <span className="val">88%</span>
            <span className="lbl">BUY</span>
          </div>
        </div>
        <div className="data-list">
          <div className="data-row"><span>Target price</span> <strong>$132.94</strong></div>
          <div className="data-row"><span>Agreement</span> <strong>94%</strong></div>
          <div className="data-row"><span>Confidence</span> <strong>92%</strong></div>
          <div className="data-row"><span>Stability</span> <strong>82%</strong></div>
        </div>
      </div>
    </div>
  )
}

export default AnalystConsensusCard
