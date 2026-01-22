import { useState, useEffect } from 'react'
import { Sidebar, SubNav, Dashboard, RightPanel, ComponentLibrary, CardExplorer, CommandPalette, TabName } from './components'
import { useWindowFocus } from './hooks'
import { STORAGE_KEYS, KEYBOARD_SHORTCUTS } from './constants'
import './styles.css'

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [activeNavTab, setActiveNavTab] = useState('home')
  const [activeDashboardTab, setActiveDashboardTab] = useState<TabName>('Overview')
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VIEW) || 'dashboard'
  })
  const [isRightPanelDismissed, setIsRightPanelDismissed] = useState(false)

  // Show right panel only when on dashboard with Overview tab (and not dismissed)
  const isRightPanelOpen = currentView === 'dashboard' && activeDashboardTab === 'Overview' && !isRightPanelDismissed
  
  // Hide sub-nav for component library
  const isSubNavVisible = !currentView.startsWith('library')

  // Persist view to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView)
  }, [currentView])

  // Initialize window focus on mount
  useWindowFocus()

  // Handle CMD+K to toggle command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === KEYBOARD_SHORTCUTS.COMMAND_PALETTE) {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app-layout">
      <Sidebar 
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
      />
      <SubNav isVisible={isSubNavVisible} />
      <main className={`main-content ${isRightPanelOpen ? 'with-right-panel' : ''} ${!isSubNavVisible ? 'no-subnav' : ''}`}>
        {currentView === 'dashboard' && (
          <Dashboard 
            activeTab={activeDashboardTab} 
            onTabChange={setActiveDashboardTab} 
          />
        )}
        {currentView === 'card-explorer' && <CardExplorer />}
        {(currentView === 'library' || currentView.startsWith('library:')) && (
          <ComponentLibrary
            initialComponentId={currentView.startsWith('library:') ? currentView.split(':')[1] : null}
            onNavigate={(id) => setCurrentView(id ? `library:${id}` : 'library')}
          />
        )}
        <div className="scroll-spacer" />
      </main>
      <RightPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelDismissed(true)}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setView={setCurrentView}
      />
    </div>
  )
}
