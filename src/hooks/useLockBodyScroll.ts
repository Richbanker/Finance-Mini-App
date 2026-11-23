import { useLayoutEffect } from 'react'

export function useLockBodyScroll(locked: boolean) {
  useLayoutEffect(() => {
    const { body } = document
    if (!locked) return

    const prev = body.style.overflow
    const prevPos = body.style.position
    const prevW = body.style.width
    const prevTop = body.style.top
    const scrollY = window.scrollY

    // Закрепляем body на текущем положении, не прокручивая страницу вверх.
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.width = '100%'
    body.style.top = `-${scrollY}px`

    return () => {
      body.style.overflow = prev
      body.style.position = prevPos
      body.style.width = prevW
      body.style.top = prevTop
      if (prevPos !== 'fixed') window.scrollTo(0, scrollY)
    }
  }, [locked])
}
