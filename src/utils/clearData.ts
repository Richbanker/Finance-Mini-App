// Утилита для очистки всех данных приложения
export function clearAllAppData() {
  // Очищаем localStorage
  localStorage.removeItem('finance-v1');
  
  // Перезагружаем страницу для применения изменений
  window.location.reload();
}

// Функция для очистки только транзакций, оставляя настройки
export function clearTransactions() {
  const stored = localStorage.getItem('finance-v1');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.state) {
        data.state.transactions = [];
        localStorage.setItem('finance-v1', JSON.stringify(data));
        window.location.reload();
      }
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  }
}
