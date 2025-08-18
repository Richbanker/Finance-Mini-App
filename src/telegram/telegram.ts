// Telegram WebApp API integration

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  onEvent: (eventType: string, callback: () => void) => void
  offEvent: (eventType: string, callback: () => void) => void
  sendData: (data: string) => void
  ready: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

class TelegramAPI {
  private tg: TelegramWebApp | null = null
  private isAvailable = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.tg = window.Telegram.WebApp
      this.isAvailable = true

      // Enable closing confirmation
      try {
        this.tg.enableClosingConfirmation()
      } catch (e) {
        console.warn('Failed to enable closing confirmation:', e)
      }

      // Expand the app
      try {
        this.tg.expand()
      } catch (e) {
        console.warn('Failed to expand app:', e)
      }

      // Apply theme
      this.applyTheme()

      // Setup MainButton
      this.setupMainButton()

      // Notify Telegram that the app is ready
      try {
        this.tg.ready()
      } catch (e) {
        console.warn('Failed to notify ready state:', e)
      }
    } else {
      console.warn('Telegram WebApp is not available. Running in standalone mode.')
      // Apply default theme for development
      this.applyDefaultTheme()
    }
  }

  private applyTheme() {
    if (!this.tg) return

    const colorScheme = this.tg.colorScheme || 'dark'
    document.documentElement.dataset.theme = colorScheme

    // Apply theme colors as CSS variables
    const themeParams = this.tg.themeParams
    if (themeParams.bg_color) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
    }
    if (themeParams.text_color) {
      document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color)
    }
    if (themeParams.hint_color) {
      document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
    }
    if (themeParams.link_color) {
      document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color)
    }
    if (themeParams.button_color) {
      document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color)
    }
    if (themeParams.button_text_color) {
      document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color)
    }
    if (themeParams.secondary_bg_color) {
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color)
    }

    // Обновляем сплэш-экран в реальном времени, если он еще виден
    this.updateSplashTheme()
  }

  /**
   * Обновляет тему сплэш-экрана в реальном времени
   * Полезно для случаев, когда пользователь меняет тему во время загрузки
   */
  private updateSplashTheme() {
    const splashElement = document.getElementById('initial-splash')
    if (!splashElement) return

    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--tg-theme-bg-color')
      .trim()

    if (bgColor) {
      splashElement.style.backgroundColor = bgColor
    }
  }

  private applyDefaultTheme() {
    // Default dark theme for development
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.style.setProperty('--tg-theme-bg-color', '#0b0b0b')
    document.documentElement.style.setProperty('--tg-theme-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-hint-color', '#999999')
    document.documentElement.style.setProperty('--tg-theme-link-color', '#3390ec')
    document.documentElement.style.setProperty('--tg-theme-button-color', '#3390ec')
    document.documentElement.style.setProperty('--tg-theme-button-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', '#151515')
  }

  private setupMainButton() {
    if (!this.tg?.MainButton) return

    try {
      this.tg.MainButton.setText('Сохранить')
      this.tg.MainButton.disable()
      this.tg.MainButton.hide()
    } catch (e) {
      console.warn('Failed to setup MainButton:', e)
    }
  }

  public impact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (this.tg?.HapticFeedback) {
      try {
        this.tg.HapticFeedback.impactOccurred(style)
      } catch (e) {
        console.warn('Failed to trigger haptic feedback:', e)
      }
    }
  }

  public notification(type: 'error' | 'success' | 'warning' = 'success') {
    if (this.tg?.HapticFeedback) {
      try {
        this.tg.HapticFeedback.notificationOccurred(type)
      } catch (e) {
        console.warn('Failed to trigger notification feedback:', e)
      }
    }
  }

  public selectionChanged() {
    if (this.tg?.HapticFeedback) {
      try {
        this.tg.HapticFeedback.selectionChanged()
      } catch (e) {
        console.warn('Failed to trigger selection feedback:', e)
      }
    }
  }

  public showMainButton(text?: string, onClick?: () => void) {
    if (!this.tg?.MainButton) return

    try {
      if (text) {
        this.tg.MainButton.setText(text)
      }
      if (onClick) {
        this.tg.MainButton.onClick(onClick)
      }
      this.tg.MainButton.enable()
      this.tg.MainButton.show()
    } catch (e) {
      console.warn('Failed to show MainButton:', e)
    }
  }

  public hideMainButton() {
    if (!this.tg?.MainButton) return

    try {
      this.tg.MainButton.hide()
    } catch (e) {
      console.warn('Failed to hide MainButton:', e)
    }
  }

  public get colorScheme() {
    return this.tg?.colorScheme || 'dark'
  }

  public get isReady() {
    return this.isAvailable
  }

  public get webapp() {
    return this.tg
  }
}

// Create singleton instance
const telegramAPI = new TelegramAPI()

/**
 * Инициализирует Telegram UI с поддержкой сплэш-экрана
 * Эта функция вызывается из main.tsx при bootstrap
 */
export function initTelegramUI(): void {
  // Singleton уже инициализирован в конструкторе
  // Дополнительно можем обновить тему, если что-то изменилось
  if (telegramAPI.isReady) {
    // Принудительно обновляем тему для сплэша
    const splashElement = document.getElementById('initial-splash')
    if (splashElement) {
      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-bg-color')
        .trim()

      if (bgColor) {
        splashElement.style.backgroundColor = bgColor
      }
    }
  }
}

export default telegramAPI
