import { useEffect, useState, useRef } from 'react'

export function useResizeRerender() {
  const [tick, setTick] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rerender = () => setTick((prev) => prev + 1)
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', rerender)
      return () => window.removeEventListener('resize', rerender)
    }

    const resizeObserver = new ResizeObserver(rerender)

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { containerRef, tick }
}
