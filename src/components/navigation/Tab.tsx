import { useRef, useEffect, ReactNode } from 'react'

interface TabProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}

export default function Tab({ children, active = false, onClick }: TabProps) {
  const tabRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const tab = tabRef.current
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
  }, [])

  return (
    <a
      ref={tabRef}
      href="#"
      onClick={(e) => {
        e.preventDefault()
        if (onClick) onClick()
      }}
      className={`pill-tab ${active ? 'active' : ''}`}
    >
      {children}
    </a>
  )
}
