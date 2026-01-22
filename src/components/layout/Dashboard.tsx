import { motion } from 'framer-motion'
import { Header, NavTabs } from '../navigation'
import { Card, SummaryCard, TopPredictorsCard } from '../cards'
import { HorizontalBarChart } from '../charts'
import GaugeLayout from './GaugeLayout'
import KpiLayout from './KpiLayout'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart approximation
    }
  })
}

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <motion.div 
        className="top-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Header />
        <NavTabs />
      </motion.div>

      <main className="dashboard-main">
        <div className="dashboard-grid-top">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            style={{ height: '100%', display: 'flex' }}
          >
            <SummaryCard 
              title="Analyst consensus" 
              badge="BUY" 
              variant="positive"
            >
              <GaugeLayout 
                data={[
                  { value: 88, color: 'accent-green', label: 'BUY' },
                  { value: 12, color: 'muted', label: 'Other' }
                ]}
                centerValue="88%"
                centerLabel="BUY"
                tableItems={[
                  { label: 'Target price', value: '$132.94' },
                  { label: 'Agreement', value: '94%' },
                  { label: 'Confidence', value: '92%' },
                  { label: 'Stability', value: '82%' }
                ]} 
              />
            </SummaryCard>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            style={{ height: '100%', display: 'flex' }}
          >
            <SummaryCard 
              title="Rating momentum" 
              badge="BEARISH" 
              variant="negative"
            >
              <KpiLayout 
                kpis={[
                  { label: 'UPGRADES', value: '0' },
                  { label: 'DOWNGRADES', value: '1', colorClass: 'text-red' }
                ]}
                tableItems={[
                  { label: 'Net change', value: '-1' },
                  { label: 'Velocity', value: '-100%' },
                  { label: 'Price target momentum', value: '-2273%' }
                ]}
              />
            </SummaryCard>
          </motion.div>
        </div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <TopPredictorsCard />
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card title="Trust Analysis">
            <HorizontalBarChart 
              data={[
                { label: 'Data Accuracy', value: 92 },
                { label: 'Source Reliability', value: 88 },
                { label: 'Methodology', value: 85 },
                { label: 'Transparency', value: 78 },
                { label: 'Timeliness', value: 72 }
              ]}
              showLabels={true}
              showEndLabel={true}
              sortOrder="descending"
            />
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
