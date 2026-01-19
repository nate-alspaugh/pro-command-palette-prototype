import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ComponentCatalogue from './components/ComponentCatalogue'
import CardExplorer from './components/CardExplorer'
import CommandPalette from './components/CommandPalette'
import { useAnimeAnimations } from './hooks/useAnimeAnimations'
import './styles.css'

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'catalogue'

  // Initialize animations on mount
  useAnimeAnimations()

  // Handle CMD+K to toggle command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
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
        {(currentView === 'catalogue' || currentView.startsWith('catalogue:')) && (
          <ComponentCatalogue 
            initialComponentId={currentView.startsWith('catalogue:') ? currentView.split(':')[1] : null} 
            onNavigate={(id) => setCurrentView(id ? `catalogue:${id}` : 'catalogue')}
          />
        )}
      </main>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        setView={setCurrentView}
      />
    </div>
  )
}

export default App
