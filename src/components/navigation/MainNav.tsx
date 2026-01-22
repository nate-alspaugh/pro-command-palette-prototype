import { ReactNode } from 'react'

interface NavTabProps {
  icon?: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function NavTab({ icon, label, active = false, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={`nav-tab ${active ? 'active' : ''}`}
    >
      <div className="nav-tab-icon">
        {icon || (
          <div className="nav-tab-icon-placeholder" />
        )}
      </div>
      <span className="action-label-sm">{label}</span>
    </button>
  )
}

interface MainNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const defaultTabs = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore' },
  { id: 'settings', label: 'Settings' }
]

export default function MainNav({ activeTab = 'home', onTabChange }: MainNavProps) {
  return (
    <nav className="main-nav">
      {defaultTabs.map((tab) => (
        <NavTab
          key={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onTabChange?.(tab.id)}
        />
      ))}
    </nav>
  )
}

export { NavTab }
