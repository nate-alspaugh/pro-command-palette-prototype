import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RightPanelProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
  extraActions?: ReactNode
}

export default function RightPanel({ isOpen, onClose, children, extraActions }: RightPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="right-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
        >
          <div className="right-panel-header">
            <button className="right-panel-close" onClick={onClose} aria-label="Close panel">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {extraActions || (
              <div className="right-panel-actions-placeholder">
                <span className="action-label-sm">Optional Extra Actions</span>
              </div>
            )}
          </div>
          <div className="right-panel-content">
            {children || (
              <div className="right-panel-content-placeholder">
                <span className="action-label-sm">Panel Content</span>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
