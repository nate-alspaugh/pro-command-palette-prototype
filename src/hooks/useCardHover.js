import { useEffect } from 'react'

export function useCardHover(cardRef) {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    let originalTransform = ''

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
      card.style.setProperty('--angle', `${angle}deg`)
    }

    const handleMouseEnter = () => {
      originalTransform = card.style.transform || ''
      
      if (originalTransform) {
        const scaleMatch = originalTransform.match(/scale\([^)]+\)/)
        if (scaleMatch) {
          card.style.transform = originalTransform.replace(/scale\([^)]+\)/, 'scale(1.05)')
        } else {
          card.style.transform = `${originalTransform} scale(1.05)`
        }
      } else {
        card.style.transform = 'scale(1.05)'
      }
    }

    const handleMouseLeave = () => {
      card.style.transform = originalTransform
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cardRef])
}
