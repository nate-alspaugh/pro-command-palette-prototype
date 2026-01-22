import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommandPalette, useWebGLShadow } from '../../hooks'
import CommandPaletteRow from './CommandPaletteRow'

interface StockItem {
  type: 'stock'
  symbol: string
  company: string
  change: string
  price: string
}

interface ActionItem {
  type: 'action'
  id: string
  label: string
  shortcut?: string
  avatarVariant?: 'default' | 'placeholder'
}

type CommandItem = StockItem | ActionItem

const items: CommandItem[] = [
  { type: 'stock', symbol: 'RBLX', company: 'ROBLOX CORP', change: '-0.35%', price: '$128.11' },
  { type: 'stock', symbol: 'AAPL', company: 'APPLE INC', change: '-0.35%', price: '$128.11' },
  { type: 'stock', symbol: 'MSFT', company: 'MICROSOFT CORP', change: '-0.35%', price: '$128.11' },
  { type: 'action', id: 'view-library', label: 'Component Library', avatarVariant: 'placeholder' },
  { type: 'action', id: 'view-card-explorer', label: 'Card Explorer', avatarVariant: 'placeholder' }
]

// Default Designer Controls
const DEFAULT_CONTROLS = {
  leakIntensity: 0.23,
  leakOpacity: 0.5,
  leakLength: 160.0,
  leakWideReach: 122.0,
  verticalShift: 2.0,
  auraIntensity: 0.65,
  godRayIntensity: 0.06
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  setView: (view: string) => void
  isPreview?: boolean // When true, renders without overlay for component library preview
}

export default function CommandPalette({ isOpen, onClose, setView, isPreview = false }: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Reset selection to top when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleSelect = (index: number) => {
    const item = items[index]
    if (item.type === 'action') {
      if (item.id === 'view-library') {
        setView('library')
      } else if (item.id === 'view-card-explorer') {
        setView('card-explorer')
      }
      onClose()
    } else if (item.type === 'stock' && item.symbol === 'RBLX') {
      setView('dashboard')
      onClose()
    }
  }

  // Only use hooks when not in preview mode
  useCommandPalette({ 
    isOpen: isPreview ? false : isOpen, 
    onClose, 
    selectedIndex, 
    setSelectedIndex, 
    inputRef, 
    overlayRef, 
    modalRef,
    onSelect: handleSelect,
    itemsCount: items.length
  })
  useWebGLShadow({ isOpen: isPreview ? false : isOpen, modalRef, canvasRef, overlayRef, controls: DEFAULT_CONTROLS })

  // Preview mode renders just the modal without overlay
  if (isPreview) {
    return (
      <div className="command-palette-modal command-palette-preview" role="dialog" aria-modal="false">
        <div className="cp-header">
          <svg className="cp-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="cp-search-input" 
            placeholder="Search or start a chat"
            readOnly
          />
        </div>
        
        <div className="cp-body">
          <div className="cp-section-header">RECENT & ACTIONS</div>
          <ul className="cp-list">
            {items.map((item, index) => (
              <CommandPaletteRow
                key={index}
                symbol={item.type === 'stock' ? item.symbol : item.label}
                company={item.type === 'stock' ? item.company : ''}
                isActive={index === 0}
                variant={item.type === 'stock' ? 'double' : 'single'}
                showPriceInfo={item.type === 'stock'}
                price={item.type === 'stock' ? item.price : undefined}
                change={item.type === 'stock' ? item.change : undefined}
                showKeyboardShortcut={item.type === 'action' && !!item.shortcut}
                keyboardShortcut={item.type === 'action' ? item.shortcut : undefined}
                initialsType="first"
                avatarVariant={item.type === 'action' ? item.avatarVariant : 'default'}
              />
            ))}
          </ul>
        </div>
        
        <div className="cp-footer">
          <span>Start a chat</span>
          <div className="cp-shortcuts">
            <kbd className="cp-shortcut-hint">↑↓</kbd>
            <kbd className="cp-shortcut-hint">CMD + P</kbd>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={overlayRef}
          id="command-palette-overlay" 
          className="modal-overlay"
          style={{ display: 'flex' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              onClose()
            }
          }}
        >
          <canvas 
            ref={canvasRef} 
            id="cp-shadow-canvas" 
            className="cp-shadow-canvas"
            width="1"
            height="1"
          ></canvas>

          <div className="cp-wrapper">
            <motion.div 
              ref={modalRef} 
              className="command-palette-modal" 
              role="dialog" 
              aria-modal="true"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1] // easeOutExpo
              }}
            >
              <div className="cp-header">
                <svg className="cp-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  ref={inputRef}
                  type="text" 
                  className="cp-search-input" 
                  placeholder="Search or start a chat"
                />
              </div>
              
              <div className="cp-body">
                <div className="cp-section-header">RECENT & ACTIONS</div>
                <ul className="cp-list">
                  {items.map((item, index) => (
                    <CommandPaletteRow
                      key={index}
                      symbol={item.type === 'stock' ? item.symbol : item.label}
                      company={item.type === 'stock' ? item.company : ''}
                      isActive={index === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleSelect(index)}
                      variant={item.type === 'stock' ? 'double' : 'single'}
                      showPriceInfo={item.type === 'stock'}
                      price={item.type === 'stock' ? item.price : undefined}
                      change={item.type === 'stock' ? item.change : undefined}
                      showKeyboardShortcut={item.type === 'action' && !!item.shortcut}
                      keyboardShortcut={item.type === 'action' ? item.shortcut : undefined}
                      initialsType="first"
                      avatarVariant={item.type === 'action' ? item.avatarVariant : 'default'}
                    />
                  ))}
                </ul>
              </div>
              
              <div className="cp-footer">
                <span>Start a chat</span>
                <div className="cp-shortcuts">
                  <kbd className="cp-shortcut-hint">↑↓</kbd>
                  <kbd className="cp-shortcut-hint">CMD + P</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
