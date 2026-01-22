import { useEffect, RefObject } from 'react'

interface UseCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  selectedIndex: number
  setSelectedIndex: (value: number | ((prev: number) => number)) => void
  inputRef: RefObject<HTMLInputElement>
  overlayRef: RefObject<HTMLDivElement>
  modalRef: RefObject<HTMLDivElement>
  onSelect?: (index: number) => void
  itemsCount?: number
}

export function useCommandPalette({
  isOpen,
  onClose,
  selectedIndex,
  setSelectedIndex,
  inputRef,
  overlayRef,
  modalRef,
  onSelect,
  itemsCount = 3
}: UseCommandPaletteProps): void {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % itemsCount)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + itemsCount) % itemsCount)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (onSelect) onSelect(selectedIndex)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, selectedIndex, setSelectedIndex, modalRef, onSelect, itemsCount])

  useEffect(() => {
    if (!isOpen || !inputRef.current) return

    // Focus input after animation completes
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 350)

    return () => {
      clearTimeout(focusTimer)
    }
  }, [isOpen, inputRef])
}
