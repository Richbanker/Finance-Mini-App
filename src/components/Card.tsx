import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../utils/cn'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  hover?: boolean
  animated?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  hover = false,
  animated = true,
  className,
  ...props
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-300'

  const variants = {
    default: 'bg-white/5 backdrop-blur-sm border border-white/10',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20',
    elevated: 'bg-white/8 backdrop-blur-md border border-white/20 shadow-lg',
  }

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-xl hover:bg-white/10 cursor-pointer'
    : ''

  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        whileHover: hover ? { scale: 1.02 } : undefined,
        whileTap: hover ? { scale: 0.98 } : undefined,
        transition: { duration: 0.3, ease: 'easeOut' as const },
      }
    : {}

  return (
    <motion.div
      className={cn(baseClasses, variants[variant], sizes[size], hoverClasses, className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Специализированные карточки для разных случаев
export const SummaryCard: React.FC<CardProps> = (props) => (
  <Card variant="gradient" hover animated {...props} />
)

export const TransactionCard: React.FC<CardProps> = (props) => (
  <Card variant="glass" hover animated {...props} />
)

export const SheetCard: React.FC<CardProps> = (props) => (
  <Card variant="elevated" size="lg" {...props} />
)
