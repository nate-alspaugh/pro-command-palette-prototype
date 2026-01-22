import { useEffect, useRef } from 'react'

const tabs = [
  'Overview',
  'Stories',
  'Market Predictions',
  'Monitors',
  'People',
  'Financials',
  'Company Info',
  'Related'
] as const

export default function NavTabs() {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const tabElements = tabRefs.current
    tabElements.forEach(tab => {
      if (!tab) return
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = tab.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        tab.style.setProperty('--x', `${x}px`)
        tab.style.setProperty('--y', `${y}px`)
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
        tab.style.setProperty('--angle', `${angle}deg`)
      }
      
      tab.addEventListener('mousemove', handleMouseMove)
      
      return () => {
        tab.removeEventListener('mousemove', handleMouseMove)
      }
    })
  }, [])

  return (
    <nav className="pill-row">
      {tabs.map((tab, index) => (
        <a
          key={tab}
          href="#"
          ref={el => tabRefs.current[index] = el}
          className={`pill-tab ${tab === 'Financials' ? 'active' : ''}`}
        >
          {tab}
        </a>
      ))}
    </nav>
  )
}
