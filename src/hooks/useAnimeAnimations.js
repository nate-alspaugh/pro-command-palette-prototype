import { useEffect } from 'react'
import anime from 'animejs'

export function useAnimeAnimations() {
  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      try {
        // Initial load animations
        const topSectionCards = document.querySelectorAll('.top-section, .card')
        if (topSectionCards.length > 0) {
          anime({ 
            targets: topSectionCards, 
            translateY: [20, 0], 
            opacity: [0, 1], 
            duration: 800, 
            easing: 'easeOutQuart', 
            delay: anime.stagger(100) 
          })
        }
        
        const barFills = document.querySelectorAll('.bar-fill')
        if (barFills.length > 0) {
          anime({ 
            targets: barFills, 
            width: [0, function(el) { return el.style.width || '100%'; }], 
            easing: 'easeOutExpo', 
            duration: 1500, 
            delay: 500 
          })
        }
        
        const gaugeCircles = document.querySelectorAll('circle.gauge-circle')
        if (gaugeCircles.length > 0) {
          anime({ 
            targets: gaugeCircles, 
            strokeDashoffset: [anime.setDashoffset, 0], 
            easing: 'easeOutExpo', 
            duration: 1500, 
            delay: 400 
          })
        }

        // Force focus on the document window
        if (window.focus) window.focus()
        if (document.body && document.body.focus) document.body.focus()
      } catch (error) {
        console.error('Animation error:', error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])
}
