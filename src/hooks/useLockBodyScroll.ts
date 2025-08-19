import { useLayoutEffect } from 'react';

export function useLockBodyScroll(locked: boolean) {
  useLayoutEffect(() => {
    const { body } = document;
    if (!locked) return;
    
    const prev = body.style.overflow;
    const prevPos = body.style.position;
    const prevW = body.style.width;

    // Лочим фон без сдвига контента
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';

    return () => {
      body.style.overflow = prev;
      body.style.position = prevPos;
      body.style.width = prevW;
    };
  }, [locked]);
}
