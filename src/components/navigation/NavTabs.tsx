import { useEffect, useRef, useState, useCallback } from 'react'

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

export type TabName = typeof tabs[number]

interface NavTabsProps {
  activeTab?: TabName
  onTabChange?: (tab: TabName) => void
}

export default function NavTabs({ activeTab = 'Overview', onTabChange }: NavTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const overflowRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState<number>(tabs.length)
  const [menuOpen, setMenuOpen] = useState(false)

  const calculateVisibleTabs = useCallback(() => {
    const container = containerRef.current
    const nav = navRef.current
    const overflow = overflowRef.current
    if (!container || !nav) return

    const containerWidth = container.offsetWidth
    const moreButtonWidth = overflow ? overflow.offsetWidth + 8 : 40 // 8 for gap
    let totalWidth = 0
    let count = 0

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabRefs.current[i]
      if (!tab) continue

      const tabWidth = tab.offsetWidth + 8 // 8 for gap
      const needsMore = i < tabs.length - 1 // Check if we might need more button
      const availableWidth = needsMore ? containerWidth - moreButtonWidth : containerWidth

      if (totalWidth + tab.offsetWidth <= availableWidth) {
        totalWidth += tabWidth
        count++
      } else {
        break
      }
    }

    // If all tabs fit, show all
    if (count === tabs.length) {
      setVisibleCount(tabs.length)
    } else {
      // Make sure at least 1 tab is visible
      setVisibleCount(Math.max(1, count))
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleTabs()
    })

    resizeObserver.observe(container)

    // Initial calculation
    calculateVisibleTabs()

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateVisibleTabs])

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const overflow = overflowRef.current
      if (overflow && !overflow.contains(target)) {
        setMenuOpen(false)
      }
    }

    // Delay adding listener to avoid catching the same click that opened the menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  const handleClick = (e: React.MouseEvent, tab: TabName) => {
    e.preventDefault()
    onTabChange?.(tab)
    setMenuOpen(false)
  }

  const visibleTabs = tabs.slice(0, visibleCount)
  const hiddenTabs = tabs.slice(visibleCount)
  const hasOverflow = hiddenTabs.length > 0

  return (
    <div ref={containerRef} className="pill-row-container">
      <nav ref={navRef} className="pill-row">
        {visibleTabs.map((tab, index) => (
          <a
            key={tab}
            href="#"
            ref={el => tabRefs.current[index] = el}
            className={`pill-tab ${tab === activeTab ? 'active' : ''}`}
            onClick={(e) => handleClick(e, tab)}
          >
            {tab}
          </a>
        ))}
        {/* Hidden tabs for measurement */}
        {hiddenTabs.map((tab, index) => (
          <a
            key={tab}
            href="#"
            ref={el => tabRefs.current[visibleCount + index] = el}
            className="pill-tab"
            style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
            tabIndex={-1}
          >
            {tab}
          </a>
        ))}
        {hasOverflow && (
          <div ref={overflowRef} className="pill-tab-overflow">
            <button
              className={`pill-tab pill-tab-more ${hiddenTabs.some(t => t === activeTab) ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More tabs"
              aria-expanded={menuOpen}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="13" cy="8" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <div className="pill-tab-menu">
                {hiddenTabs.map((tab) => (
                  <a
                    key={tab}
                    href="#"
                    className={`pill-tab-menu-item ${tab === activeTab ? 'active' : ''}`}
                    onClick={(e) => handleClick(e, tab)}
                  >
                    {tab}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  )
}
