import { useEffect } from 'react'
import anime from 'animejs'

export function useAnimeAnimations() {
  useEffect(() => {
    // Initial load animations
    anime({ 
      targets: ['.top-section', '.card'], 
      translateY: [20, 0], 
      opacity: [0, 1], 
      duration: 800, 
      easing: 'easeOutQuart', 
      delay: anime.stagger(100) 
    })
    
    anime({ 
      targets: '.bar-fill', 
      width: [0, function(el) { return el.style.width; }], 
      easing: 'easeOutExpo', 
      duration: 1500, 
      delay: 500 
    })
    
    anime({ 
      targets: 'circle.gauge-circle', 
      strokeDashoffset: [anime.setDashoffset, 0], 
      easing: 'easeOutExpo', 
      duration: 1500, 
      delay: 400 
    })

    // Force focus on the document window
    window.focus()
    document.body.focus()
  }, [])
}
