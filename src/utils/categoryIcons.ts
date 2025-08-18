/**
 * Константы и утилиты для иконок категорий
 */

export type CategoryIconType = 'expense' | 'income'

export interface IconOption {
  name: string
  label: string
}

/**
 * Функция для получения доступных иконок по типу
 */
export const getAvailableIcons = (type: CategoryIconType): IconOption[] => {
  if (type === 'income') {
    return [
      { name: 'banknote', label: 'Банкноты' },
      { name: 'gift', label: 'Подарок' },
      { name: 'trending-up', label: 'Инвестиции' },
      { name: 'laptop', label: 'Фриланс' },
      { name: 'dollar-sign', label: 'Доход' },
    ]
  }

  return [
    { name: 'shopping-cart', label: 'Покупки' },
    { name: 'utensils', label: 'Еда' },
    { name: 'car', label: 'Транспорт' },
    { name: 'home', label: 'Дом' },
    { name: 'gamepad-2', label: 'Развлечения' },
    { name: 'shirt', label: 'Одежда' },
    { name: 'stethoscope', label: 'Здоровье' },
    { name: 'book', label: 'Образование' },
    { name: 'plane', label: 'Путешествия' },
    { name: 'package', label: 'Прочее' },
  ]
}
