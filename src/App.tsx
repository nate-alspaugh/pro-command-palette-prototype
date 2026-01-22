import { useState, useEffect } from 'react'
import { Sidebar, Dashboard, ComponentLibrary, CardExplorer, CommandPalette } from './components'
import { useWindowFocus } from './hooks'
import { STORAGE_KEYS, KEYBOARD_SHORTCUTS } from './constants'
import './styles.css'

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VIEW) || 'dashboard'
  })

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
      <Sidebar />
      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'card-explorer' && <CardExplorer />}
        {(currentView === 'library' || currentView.startsWith('library:')) && (
          <ComponentLibrary 
            initialComponentId={currentView.startsWith('library:') ? currentView.split(':')[1] : null} 
            onNavigate={(id) => setCurrentView(id ? `library:${id}` : 'library')}
          />
        )}
        <div className="scroll-spacer" />
      </main>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        setView={setCurrentView}
      />
    </div>
  )
}
