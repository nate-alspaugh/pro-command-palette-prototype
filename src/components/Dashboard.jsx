import Header from './Header'
import NavTabs from './NavTabs'
import AnalystConsensusCard from './AnalystConsensusCard'
import RatingMomentumCard from './RatingMomentumCard'
import TopPredictorsCard from './TopPredictorsCard'
import TrustAnalysisCard from './TrustAnalysisCard'

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="top-section">
        <Header />
        <NavTabs />
      </div>

      <main className="dashboard-main">
        <div className="dashboard-grid-top">
          <AnalystConsensusCard />
          <RatingMomentumCard />
        </div>

        <TopPredictorsCard />
        <TrustAnalysisCard />
      </main>
    </div>
  )
}

export default Dashboard
