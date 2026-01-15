import { useRef } from 'react'
import { useCardHover } from '../hooks/useCardHover'

const predictors = [
  {
    rank: '1st',
    accuracy: 86,
    accuracyColor: 'accent-green',
    name: 'Nick Mckay',
    firm: 'Freedom Capital Markets',
    smartScore: 88,
    smartScoreColor: 'accent-green',
    sampleSize: '56 PREDICTIONS',
    avgError: '±23.4%'
  },
  {
    rank: '2nd',
    accuracy: 75,
    accuracyColor: 'accent-green',
    name: 'Mathew Thorton',
    firm: 'Truist Securities',
    smartScore: 77,
    smartScoreColor: 'accent-green',
    sampleSize: '44 PREDICTIONS',
    avgError: '±23.4%'
  },
  {
    rank: '3rd',
    accuracy: 73,
    accuracyColor: 'accent-yellow',
    name: 'Mike Hickey',
    firm: 'Benchmark Company',
    smartScore: 73,
    smartScoreColor: 'accent-yellow',
    sampleSize: '48 PREDICTIONS',
    avgError: '±23.4%'
  }
]

function TopPredictorsCard() {
  const cardRef = useRef(null)
  useCardHover(cardRef)

  return (
    <div ref={cardRef} className="card">
      <div className="card-header">
        <h2>Top analyst predictors</h2>
      </div>
      <div className="card-body predictors-layout">
        {predictors.map((predictor) => (
          <div key={predictor.rank} className="predictor-col">
            <div className="predictor-left">
              <div className="motif-placeholder">{predictor.rank}</div>
              <div className="accuracy-group">
                <span className={`acc-val ${predictor.accuracyColor}`}>{predictor.accuracy}%</span>
                <span className="acc-lbl">Accurate</span>
              </div>
            </div>
            <div className="predictor-right">
              <h3 className="p-name">{predictor.name}</h3>
              <span className="p-firm">{predictor.firm}</span>
              <div className="p-stats-grid">
                <div className="p-stat-row">
                  <span>Smart score</span> <strong className={predictor.smartScoreColor}>{predictor.smartScore}</strong>
                </div>
                <div className="p-stat-row">
                  <span>Sample size</span> <strong>{predictor.sampleSize}</strong>
                </div>
                <div className="p-stat-row">
                  <span>Avg error</span> <strong>{predictor.avgError}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPredictorsCard
