import { useState, useRef, useEffect } from 'react'
import { useCommandPalette } from '../hooks/useCommandPalette'
import { useWebGLShadow } from '../hooks/useWebGLShadow'

const items = [
  { type: 'stock', symbol: 'RBLX', company: 'ROBLOX CORP', change: '-0.35%', price: '$128.11' },
  { type: 'stock', symbol: 'AAPL', company: 'APPLE INC', change: '-0.35%', price: '$128.11' },
  { type: 'stock', symbol: 'MSFT', company: 'MICROSOFT CORP', change: '-0.35%', price: '$128.11' },
  { type: 'action', id: 'view-catalogue', symbol: '⌘', company: 'View Component Catalogue', shortcut: 'G C' },
  { type: 'action', id: 'view-card-explorer', symbol: '◈', company: 'Card Explorer', shortcut: 'G E' }
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

function CommandPalette({ isOpen, onClose, setView }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const canvasRef = useRef(null)

  // Reset selection to top when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleSelect = (index) => {
    const item = items[index]
    if (item.type === 'action') {
      if (item.id === 'view-catalogue') {
        setView('catalogue')
      } else if (item.id === 'view-card-explorer') {
        setView('card-explorer')
      }
      onClose()
    } else if (item.type === 'stock' && item.symbol === 'RBLX') {
      setView('dashboard')
      onClose()
    }
  }

  useCommandPalette({ 
    isOpen, 
    onClose, 
    selectedIndex, 
    setSelectedIndex, 
    inputRef, 
    overlayRef, 
    modalRef,
    onSelect: handleSelect,
    itemsCount: items.length
  })
  useWebGLShadow({ isOpen, modalRef, canvasRef, overlayRef, controls: DEFAULT_CONTROLS })

  return (
    <div 
      ref={overlayRef}
      id="command-palette-overlay" 
      className="modal-overlay"
      style={{ display: isOpen ? 'flex' : 'none' }}
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
        {isOpen && (
          <div ref={modalRef} className="command-palette-modal" role="dialog" aria-modal="true">
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
                  <li
                    key={index}
                    className={`cp-item ${index === selectedIndex ? 'active' : ''} ${item.type === 'action' ? 'cp-action-item' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelect(index)}
                  >
                    <div className="cp-sheen"></div>
                    <div className="cp-item-left">
                      <div className="cp-logo-placeholder">{item.symbol[0]}</div>
                      <div className="cp-item-info">
                        <span className="cp-symbol">{item.symbol}</span>
                        <span className="cp-company">{item.company}</span>
                      </div>
                    </div>
                    <div className="cp-item-right">
                      {item.type === 'stock' ? (
                        <div className="cp-price-info text-red">
                          <span className="cp-change">▼ {item.change}</span>
                          <span className="cp-price">{item.price}</span>
                        </div>
                      ) : (
                        <kbd className="cp-enter-hint">{item.shortcut || 'GO'}</kbd>
                      )}
                      <kbd className="cp-enter-hint">ENTER</kbd>
                    </div>
                  </li>
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
        )}
      </div>
    </div>
  )
}

export default CommandPalette
