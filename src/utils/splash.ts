/**
 * Утилита для управления сплэш-экраном
 * Обеспечивает плавное скрытие и удаление из DOM
 */

/**
 * Скрывает начальный сплэш-экран с плавной анимацией
 * После завершения анимации элемент удаляется из DOM
 */
export function hideInitialSplash(): void {
  const el = document.getElementById('initial-splash')
  if (!el) return

  // Добавляем класс для запуска CSS-анимации fade-out
  el.classList.add('hidden')

  // Удаляем элемент после завершения анимации
  // Это освобождает память и предотвращает блокировку hit-testing
  window.setTimeout(() => {
    try {
      el.remove()
      console.debug('Splash screen successfully removed')
    } catch (error) {
      // Ignore errors if element was already removed
      console.debug('Splash element already removed:', error)
    }
  }, 600) // 600ms > 500ms (duration of CSS transition)
}

/**
 * Проверяет, виден ли сплэш-экран в данный момент
 */
export function isSplashVisible(): boolean {
  const el = document.getElementById('initial-splash')
  return el !== null && !el.classList.contains('hidden')
}

/**
 * Форсированное скрытие сплэша (для fail-safe сценариев)
 */
export function forceHideSplash(): void {
  const el = document.getElementById('initial-splash')
  if (!el) return

  // Мгновенно скрываем без анимации
  el.style.display = 'none'

  // Удаляем из DOM
  window.setTimeout(() => {
    try {
      el.remove()
    } catch (error) {
      console.debug('Splash element already removed:', error)
    }
  }, 0)
}
