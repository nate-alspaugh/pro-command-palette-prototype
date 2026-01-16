import { useState, useRef, useEffect } from 'react'
import { useCommandPalette } from '../hooks/useCommandPalette'
import { useWebGLShadow } from '../hooks/useWebGLShadow'

const items = [
  { symbol: 'RBLX', company: 'ROBLOX CORP', change: '-0.35%', price: '$128.11' },
  { symbol: 'AAPL', company: 'APPLE INC', change: '-0.35%', price: '$128.11' },
  { symbol: 'MSFT', company: 'MICROSOFT CORP', change: '-0.35%', price: '$128.11' }
]

function CommandPalette({ isOpen, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const canvasRef = useRef(null)

  useCommandPalette({ isOpen, onClose, selectedIndex, setSelectedIndex, inputRef, overlayRef, modalRef })
  useWebGLShadow({ isOpen, modalRef, canvasRef, overlayRef })

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
      <div className="cp-wrapper">
        <canvas 
          ref={canvasRef} 
          id="cp-shadow-canvas" 
          className="cp-shadow-canvas"
          width="1"
          height="1"
        ></canvas>
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
              <div className="cp-section-header">RECENT</div>
              <ul className="cp-list">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className={`cp-item ${index === selectedIndex ? 'active' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
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
                      <div className="cp-price-info text-red">
                        <span className="cp-change">▼ {item.change}</span>
                        <span className="cp-price">{item.price}</span>
                      </div>
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
