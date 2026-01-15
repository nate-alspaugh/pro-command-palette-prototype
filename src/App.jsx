import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CommandPalette from './components/CommandPalette'
import { useAnimeAnimations } from './hooks/useAnimeAnimations'
import './styles.css'

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

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
      <Dashboard />
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  )
}

export default App
