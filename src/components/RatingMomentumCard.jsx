import { useRef } from 'react'
import { useCardHover } from '../hooks/useCardHover'

function RatingMomentumCard() {
  const cardRef = useRef(null)
  useCardHover(cardRef)

  return (
    <div ref={cardRef} className="card card-glow-red">
      <div className="card-header">
        <h2>Rating momentum</h2>
        <span className="badge badge-bearish">BEARISH</span>
      </div>
      <div className="card-body momentum-layout">
        <div className="momentum-boxes">
          <div className="stat-box">
            <span className="stat-val">0</span>
            <span className="stat-lbl">UPGRADES</span>
          </div>
          <div className="stat-box">
            <span className="stat-val text-red">1</span>
            <span className="stat-lbl">DOWNGRADES</span>
          </div>
        </div>

        <div className="data-list">
          <div className="data-row"><span>Net change</span> <strong>-1</strong></div>
          <div className="data-row"><span>Velocity</span> <strong>-100%</strong></div>
          <div className="data-row"><span>Price target momentum</span> <strong>-2273%</strong></div>
        </div>
      </div>
    </div>
  )
}

export default RatingMomentumCard
