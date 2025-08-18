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

