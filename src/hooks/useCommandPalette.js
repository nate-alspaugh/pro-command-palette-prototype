import { useEffect } from 'react'
import anime from 'animejs'

export function useCommandPalette({ isOpen, onClose, selectedIndex, setSelectedIndex, inputRef, overlayRef, modalRef }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % 3)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + 3) % 3)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = modalRef.current?.querySelectorAll('.cp-item')[selectedIndex]
        if (item) {
          anime({ 
            targets: item, 
            scale: [1, 0.98, 1], 
            duration: 200, 
            easing: 'easeInOutQuad' 
          })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, selectedIndex, setSelectedIndex, modalRef])

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !modalRef.current) return

    const overlay = overlayRef.current
    const modal = modalRef.current

    // Show overlay
    overlay.style.display = 'flex'

    // Animate in
    anime({
      targets: overlay,
      opacity: [0, 1],
      duration: 200,
      easing: 'easeOutQuad'
    })

    anime({
      targets: modal,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutExpo',
      delay: 50,
      complete: () => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    })

    return () => {
      // Animate out
      anime({
        targets: overlay,
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad'
      })

      anime({
        targets: modal,
        translateY: [0, -20],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInExpo',
        complete: () => {
          overlay.style.display = 'none'
        }
      })
    }
  }, [isOpen, overlayRef, modalRef, inputRef])
}
