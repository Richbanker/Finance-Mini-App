import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { hideInitialSplash, forceHideSplash } from './utils/splash';
import { initTelegramUI } from './telegram/telegram';

const mountAt = performance.now();
const MIN_SHOW = 2000;     // мс — минимальное время показа сплэша (2 секунды)
const MAX_WAIT = 4000;     // fail-safe, если что-то зависнет (4 секунды)

/**
 * Отмечает приложение как готовое и скрывает сплэш с учетом минимального времени показа
 * Гарантирует показ сплэша минимум 2 секунды для полного просмотра картинки
 */
function markReadyAndHide(): void {
  const elapsed = performance.now() - mountAt;
  const delay = Math.max(0, MIN_SHOW - elapsed);
  
  console.debug(`Splash timing: elapsed ${elapsed}ms, will hide after ${delay}ms more`);
  
  window.setTimeout(() => {
    // Уведомляем Telegram, что можно показывать контент
    try { 
      (window as any).Telegram?.WebApp?.ready?.(); 
    } catch (error) {
      console.debug('Telegram WebApp not available:', error);
    }
    
    console.debug('Hiding splash screen after 2 seconds display time');
    hideInitialSplash();
  }, delay);
}

/**
 * Основная функция инициализации приложения
 */
async function bootstrap(): Promise<void> {
  try {
    // Инициализация темы/хаптика/кнопок Telegram
    initTelegramUI();
  } catch (error) {
    console.debug('Telegram UI initialization failed:', error);
  }

  // Смонтировать React
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Дождаться первого кадра (контент отрисовался)
  requestAnimationFrame(markReadyAndHide);

  // Fail-safe: на всякий случай спрятать сплэш через MAX_WAIT
  window.setTimeout(forceHideSplash, MAX_WAIT);
}

// Запускаем инициализацию
bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  // В случае критической ошибки все равно скрываем сплэш
  forceHideSplash();
});
