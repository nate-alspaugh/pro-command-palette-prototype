import { useEffect } from 'react'

/**
 * Hook to manage window focus on mount.
 * Forces focus on the document window and body element when component mounts.
 */
export function useWindowFocus(): void {
  useEffect(() => {
    // Force focus on the document window
    if (window.focus) window.focus()
    if (document.body && document.body.focus) document.body.focus()
  }, [])
}
