import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, BarChart3 } from 'lucide-react'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatCurrency, formatDate, formatTime } from '../utils/format'
import { CategoryIcon } from './CategoryIcon'
import { TransactionCard } from './Card'
import telegramAPI from '../telegram/telegram'

export const TransactionList: React.FC = () => {
  const { filteredTransactions, removeTransaction, categories, settings, activeFilters } = useFinanceStore()
  const transactions = filteredTransactions()
  const { currency } = settings

  const handleDelete = (id: string) => {
    telegramAPI.impact('medium')
    if (confirm('Удалить операцию?')) {
      removeTransaction(id)
      telegramAPI.notification('success')
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category || { name: 'Без категории', icon: 'package', color: '#6b7280' }
  }

  if (transactions.length === 0) {
    return (
      <motion.div 
        className="px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 rounded-4xl glass flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <BarChart3 size={48} className="text-tg-hint/50" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-tg-text">Нет операций</h3>
            <p className="text-tg-hint text-sm max-w-sm mx-auto leading-relaxed">
              Добавьте первую операцию, чтобы начать отслеживать свои финансы
            </p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, typeof transactions>)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const dateGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const transactionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, scale: 0.95 }
  }

  const getFilterDescription = () => {
    const parts = []
    if (activeFilters.type) {
      parts.push(activeFilters.type === 'income' ? 'Доходы' : 'Расходы')
    }
    if (activeFilters.categoryId) {
      const category = categories.find(c => c.id === activeFilters.categoryId)
      if (category) {
        parts.push(`категория "${category.name}"`)
      }
    }
    if (activeFilters.period) {
      parts.push('за период')
    }
    return parts.length > 0 ? parts.join(', ') : null
  }

  const filterDescription = getFilterDescription()

  return (
    <motion.div 
      className="px-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Filter indicator */}
      {filterDescription && (
        <motion.div
          className="mb-4 p-3 rounded-2xl glass border border-primary-400/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary-400" />
            <span className="text-tg-text font-medium">Фильтр:</span>
            <span className="text-tg-hint">{filterDescription}</span>
            <div className="ml-auto text-primary-400 font-semibold">
              {transactions.length} операц{transactions.length === 1 ? 'ия' : 'ий'}
            </div>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <motion.div 
            key={date} 
            className="mb-8"
            variants={dateGroupVariants}
          >
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-glow"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="text-sm text-tg-hint font-semibold uppercase tracking-wider">
                {formatDate(date)}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              <div className="text-xs text-tg-hint/60 bg-white/5 px-3 py-1 rounded-full">
                {dayTransactions.length} операц{dayTransactions.length === 1 ? 'ия' : 'ий'}
              </div>
            </div>
            
            {/* Transactions */}
            <motion.div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {dayTransactions.map((transaction, index) => {
                  const category = getCategoryInfo(transaction.categoryId)
                  const isIncome = transaction.type === 'income'

                  return (
                    <motion.div
                      key={transaction.id}
                      variants={transactionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <TransactionCard className="group relative overflow-hidden">
                        {/* Hover gradient overlay */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          isIncome 
                            ? 'bg-gradient-to-r from-success-400/5 to-transparent' 
                            : 'bg-gradient-to-r from-danger-400/5 to-transparent'
                        }`} />
                        
                        <div className="relative z-10 flex items-center gap-4">
                          {/* Category Icon */}
                          <motion.div 
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                              isIncome 
                                ? 'bg-gradient-to-br from-success-400/10 to-success-600/5' 
                                : 'bg-gradient-to-br from-danger-400/10 to-danger-600/5'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className={`absolute inset-0 rounded-2xl border ${
                              isIncome ? 'border-success-400/20' : 'border-danger-400/20'
                            }`} />
                            <CategoryIcon 
                              icon={category.icon} 
                              size={24} 
                              color={category.color}
                            />
                          </motion.div>
                          
                          {/* Transaction Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="font-semibold text-lg text-tg-text mb-1">
                                  {category.name}
                                </div>
                                {transaction.note && (
                                  <div className="text-sm text-tg-hint/80 mb-2 leading-relaxed line-clamp-2">
                                    {transaction.note}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-tg-hint/60">
                                  <Clock size={12} />
                                  <span>{formatTime(transaction.createdAt)}</span>
                                </div>
                              </div>
                              
                              {/* Amount */}
                              <div className="text-right flex-shrink-0">
                                <motion.div 
                                  className={`text-2xl font-bold ${
                                    isIncome ? 'text-success-400' : 'text-danger-400'
                                  }`}
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200 }}
                                >
                                  {isIncome ? '+' : '-'}
                                  {formatCurrency(transaction.amount, currency)}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <motion.div 
                          className="mt-4 flex justify-end"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.button
                            onClick={() => handleDelete(transaction.id)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-danger-400 
                                     bg-danger-400/10 hover:bg-danger-400/20 rounded-xl border border-danger-400/20
                                     transition-all duration-200 min-h-touch"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={14} />
                            <span>Удалить</span>
                          </motion.button>
                        </motion.div>
                      </TransactionCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
