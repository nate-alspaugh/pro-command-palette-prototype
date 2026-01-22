interface TopPredictorCardProps {
  rank?: string
  accuracy?: number
  accuracyColor?: string
  name?: string
  firm?: string
  smartScore?: number
  smartScoreColor?: string
  sampleSize?: string
  avgError?: string
}

export default function TopPredictorCard({ 
  rank = '1st', 
  accuracy = 86, 
  accuracyColor = 'accent-green',
  name = 'Nick Mckay', 
  firm = 'Freedom Capital Markets',
  smartScore = 88,
  smartScoreColor = 'accent-green',
  sampleSize = '56 PREDICTIONS',
  avgError = '±23.4%'
}: TopPredictorCardProps) {
  return (
    <div className="predictor-col">
      <div className="predictor-left">
        <div className="motif-placeholder">{rank}</div>
        <div className="accuracy-group">
          <span className={`acc-val tabular-nums ${accuracyColor}`}>{accuracy}%</span>
          <span className="acc-lbl">Accurate</span>
        </div>
      </div>
      <div className="predictor-right">
        <h3 className="p-name">{name}</h3>
        <span className="p-firm">{firm}</span>
        <div className="data-list">
          <div className="data-row">
            <span>Smart score</span> <strong className={`tabular-nums ${smartScoreColor}`}>{smartScore}</strong>
          </div>
          <div className="data-row">
            <span>Sample size</span> <strong className="tabular-nums">{sampleSize}</strong>
          </div>
          <div className="data-row">
            <span>Avg error</span> <strong className="tabular-nums">{avgError}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
