import { useEffect, useCallback } from 'react'
import { Dialog } from '@base-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * @component Modal
 * @purpose Full-screen or large overlay container for page-level content (Notion-style page-as-modal)
 * @where Viewing detailed content in overlay, company profiles, detail views without navigation
 * @not-for Simple confirmations (use Dialog), tooltips, dropdown menus, toasts
 *
 * @variant size - page | lg | md | sm - Controls the modal width (default: page)
 * @variant showClose - true | false - Shows close button (default: true)
 *
 * @uses Base UI Dialog
 * @related CommandPalette (quick actions overlay), RightPanel (slide-in panel)
 */

interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean
  /** Callback when modal requests close (backdrop click, escape, close button) */
  onClose: () => void
  /** Modal content - can be full page layouts */
  children: React.ReactNode
  /** Modal size variant */
  size?: 'page' | 'lg' | 'md' | 'sm'
  /** Show close button in top-right corner */
  showClose?: boolean
  /** Optional title for accessibility (screen readers) */
  'aria-label'?: string
  /** Preview mode - renders without portal for component library */
  isPreview?: boolean
}

const sizeStyles = {
  page: {
    width: 'calc(100vw - 120px)',
    maxWidth: '1400px',
    height: 'calc(100vh - 120px)',
    maxHeight: '900px'
  },
  lg: {
    width: '900px',
    maxWidth: 'calc(100vw - 80px)',
    height: 'auto',
    maxHeight: 'calc(100vh - 120px)'
  },
  md: {
    width: '600px',
    maxWidth: 'calc(100vw - 80px)',
    height: 'auto',
    maxHeight: 'calc(100vh - 120px)'
  },
  sm: {
    width: '400px',
    maxWidth: 'calc(100vw - 32px)',
    height: 'auto',
    maxHeight: 'calc(100vh - 80px)'
  }
}

export default function Modal({
  isOpen,
  onClose,
  children,
  size = 'page',
  showClose = true,
  'aria-label': ariaLabel,
  isPreview = false
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen && !isPreview) {
      onClose()
    }
  }, [isOpen, onClose, isPreview])

  useEffect(() => {
    if (!isPreview) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape, isPreview])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen && !isPreview) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, isPreview])

  const currentSize = sizeStyles[size]

  // Preview mode renders just the modal content without backdrop/portal
  if (isPreview) {
    return (
      <div
        className="modal-content modal-preview"
        style={{
          ...currentSize,
          position: 'relative',
          transform: 'none'
        }}
        role="dialog"
        aria-modal="false"
        aria-label={ariaLabel}
      >
        {showClose && (
          <button className="modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    )
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal>
            <Dialog.Backdrop
              render={
                <motion.div
                  className="modal-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={onClose}
                />
              }
            />
            <Dialog.Popup
              render={
                <motion.div
                  className="modal-content"
                  style={currentSize}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1] // easeOutExpo
                  }}
                  aria-label={ariaLabel}
                />
              }
            >
              {showClose && (
                <Dialog.Close
                  render={
                    <button className="modal-close" aria-label="Close modal">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  }
                />
              )}
              <div className="modal-body">
                {children}
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
