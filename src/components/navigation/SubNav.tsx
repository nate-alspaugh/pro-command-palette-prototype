import { ReactNode } from 'react'

interface SubNavProps {
  children?: ReactNode
  isVisible?: boolean
}

export default function SubNav({ children, isVisible = true }: SubNavProps) {
  if (!isVisible) return null

  return (
    <nav className="sub-nav">
      <div className="sub-nav-content">
        {children || (
          <div className="sub-nav-placeholder">
            <span className="action-label-sm">Sub Navigation</span>
          </div>
        )}
      </div>
    </nav>
  )
}
