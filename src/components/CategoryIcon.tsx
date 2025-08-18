import React from 'react'
import { 
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  Pill,
  Home,
  Package,
  Banknote,
  Gift,
  TrendingUp,
  Laptop,
  DollarSign,
  CreditCard,
  Plane,
  GraduationCap,
  Heart,
  Coffee,
  Music,
  Shirt,
  Fuel,
  type LucideIcon
} from 'lucide-react'

// Маппинг имён иконок на компоненты Lucide
const iconMap: Record<string, LucideIcon> = {
  // Expense icons
  'utensils-crossed': UtensilsCrossed,
  'car': Car,
  'shopping-bag': ShoppingBag,
  'gamepad-2': Gamepad2,
  'pill': Pill,
  'home': Home,
  'package': Package,
  'credit-card': CreditCard,
  'plane': Plane,
  'graduation-cap': GraduationCap,
  'heart': Heart,
  'coffee': Coffee,
  'music': Music,
  'shirt': Shirt,
  'fuel': Fuel,
  
  // Income icons
  'banknote': Banknote,
  'gift': Gift,
  'trending-up': TrendingUp,
  'laptop': Laptop,
  'dollar-sign': DollarSign,
}

interface CategoryIconProps {
  icon: string
  size?: number
  className?: string
  color?: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  icon, 
  size = 24, 
  className = '',
  color 
}) => {
  const IconComponent = iconMap[icon] || Package
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      style={{ color }}
    />
  )
}

// Функция для получения доступных иконок по типу
export const getAvailableIcons = (type: 'expense' | 'income') => {
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
    { name: 'utensils-crossed', label: 'Еда' },
    { name: 'car', label: 'Транспорт' },
    { name: 'shopping-bag', label: 'Покупки' },
    { name: 'gamepad-2', label: 'Развлечения' },
    { name: 'pill', label: 'Здоровье' },
    { name: 'home', label: 'ЖКХ' },
    { name: 'credit-card', label: 'Финансы' },
    { name: 'plane', label: 'Путешествия' },
    { name: 'graduation-cap', label: 'Образование' },
    { name: 'heart', label: 'Семья' },
    { name: 'coffee', label: 'Кафе' },
    { name: 'music', label: 'Музыка' },
    { name: 'shirt', label: 'Одежда' },
    { name: 'fuel', label: 'Топливо' },
    { name: 'package', label: 'Прочее' },
  ]
}
