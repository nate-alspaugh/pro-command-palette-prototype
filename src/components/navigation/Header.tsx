import { ReactNode } from 'react'
import { Avatar } from '../ui'

interface HeaderProps {
  title?: string
  subtitle?: string
  showLogo?: boolean
  actionArea?: ReactNode
}

export default function Header({ title = "RBLX", subtitle = "Company Profile", showLogo = true, actionArea }: HeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-left">
        {showLogo && (
          <Avatar size="md" shape="rounded" className="avatar-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M2 2h20v20H2z"/>
              <path d="M7 7h10v10H7z" fill="#000"/>
            </svg>
          </Avatar>
        )}
        <div className="page-header-info">
          <h1 className="company-name">{title}</h1>
          <span className="company-ticker">{subtitle}</span>
        </div>
      </div>
      <div className="page-header-right">
        {actionArea || (
          <div className="action-area-placeholder">
            <span className="action-label-sm">action area</span>
          </div>
        )}
      </div>
    </header>
  )
}
