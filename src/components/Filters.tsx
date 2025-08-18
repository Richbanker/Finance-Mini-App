import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Calendar, ArrowUpCircle, ArrowDownCircle, BarChart3, X, Check } from 'lucide-react'
import { useFinanceStore } from '../store/useFinanceStore'
import { getDateRangeLabel } from '../utils/format'
import { CategoryIcon } from './CategoryIcon'
import { Card } from './Card'
import telegramAPI from '../telegram/telegram'
import type { TxType } from '../types'

export const Filters: React.FC = () => {
  const { 
    categories, 
    activeFilters, 
    filteredTransactions,
    setTypeFilter, 
    setCategoryFilter, 
    setPeriodFilter, 
    clearFilters 
  } = useFinanceStore()
  
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const transactions = filteredTransactions()

  // Sync local state with global filters
  useEffect(() => {
    if (activeFilters.period?.from !== dateFrom || activeFilters.period?.to !== dateTo) {
      setPeriodFilter((dateFrom || dateTo) ? { from: dateFrom, to: dateTo } : undefined)
    }
  }, [dateFrom, dateTo, setPeriodFilter, activeFilters.period])

  const handleReset = () => {
    telegramAPI.impact('light')
    setDateFrom('')
    setDateTo('')
    clearFilters()
  }

  const handleTypeChange = (type: TxType | '') => {
    telegramAPI.selectionChanged()
    setTypeFilter(type)
  }

  const handleCategoryChange = (categoryId: string) => {
    telegramAPI.selectionChanged()
    setCategoryFilter(categoryId)
  }

  const hasFilters = activeFilters.type || activeFilters.categoryId || activeFilters.period

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }

  return (
    <motion.div 
      className="px-4 sm:px-6 py-3 sm:py-4 mobile-px-4 small-mobile-px-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-tg-text">Фильтры</h3>
              <p className="text-xs text-tg-hint/70 uppercase tracking-wide">Настройте отображение</p>
            </div>
          </div>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-danger-400/20 text-danger-400 hover:bg-danger-400/30 
                         transition-all duration-300 border border-danger-400/30 flex items-center gap-2"
                variants={chipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
                <span className="text-sm font-medium">Сбросить</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Type Filter Chips */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-sm text-tg-hint font-medium mb-3 uppercase tracking-wide">
            Тип операции
          </label>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => handleTypeChange('')}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 min-h-touch ${
                !activeFilters.type
                  ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-400/25'
                  : 'glass hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 size={18} />
              <span className="font-medium">Все</span>
              {!activeFilters.type && <Check size={16} />}
            </motion.button>
            
            <motion.button
              onClick={() => handleTypeChange('income')}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 min-h-touch ${
                activeFilters.type === 'income'
                  ? 'bg-gradient-to-br from-success-400 to-success-600 text-white shadow-lg shadow-success-400/25'
                  : 'glass hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpCircle size={18} />
              <span className="font-medium">Доходы</span>
              {activeFilters.type === 'income' && <Check size={16} />}
            </motion.button>
            
            <motion.button
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 min-h-touch ${
                activeFilters.type === 'expense'
                  ? 'bg-gradient-to-br from-danger-400 to-danger-600 text-white shadow-lg shadow-danger-400/25'
                  : 'glass hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowDownCircle size={18} />
              <span className="font-medium">Расходы</span>
              {activeFilters.type === 'expense' && <Check size={16} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Category Filter Chips */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-sm text-tg-hint font-medium mb-3 uppercase tracking-wide">
            Категория
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            <motion.button
              onClick={() => handleCategoryChange('')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                !activeFilters.categoryId
                  ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg'
                  : 'glass hover:bg-white/15 text-tg-text'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">Все</span>
              {!activeFilters.categoryId && <Check size={14} />}
            </motion.button>
            
            {categories
              .filter(cat => !activeFilters.type || cat.type === activeFilters.type)
              .map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    activeFilters.categoryId === category.id
                      ? 'glass-gradient border-2 border-primary-400/50 shadow-glow text-tg-text'
                      : 'glass hover:bg-white/15 text-tg-text'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeFilters.categoryId === category.id ? 'bg-primary-400/20' : 'bg-white/10'
                  }`}>
                    <CategoryIcon icon={category.icon} size={14} color={category.color} />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                  {activeFilters.categoryId === category.id && <Check size={14} />}
                </motion.button>
              ))}
          </div>
        </motion.div>

        {/* Date Range */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-sm text-tg-hint font-medium mb-3 uppercase tracking-wide">
            Период
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  telegramAPI.selectionChanged()
                  setDateFrom(e.target.value)
                }}
                className="w-full p-4 glass rounded-2xl border-2 border-transparent focus:border-primary-400 
                         focus:shadow-glow transition-all duration-300 text-tg-text text-sm"
                placeholder="С даты"
              />
              <Calendar size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-tg-hint pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  telegramAPI.selectionChanged()
                  setDateTo(e.target.value)
                }}
                className="w-full p-4 glass rounded-2xl border-2 border-transparent focus:border-primary-400 
                         focus:shadow-glow transition-all duration-300 text-tg-text text-sm"
                placeholder="По дату"
              />
              <Calendar size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-tg-hint pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="flex items-center justify-between p-4 rounded-2xl glass-gradient border border-primary-400/20"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-400 to-primary-500 flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BarChart3 size={20} className="text-white" />
            </motion.div>
            <div>
              <div className="text-sm font-semibold text-tg-text">
                {hasFilters ? 'Найдено операций' : 'Всего операций'}
              </div>
              <div className="text-2xl font-bold text-primary-400">
                {transactions.length}
              </div>
              {hasFilters && activeFilters.period && (
                <div className="text-xs text-tg-hint/70 mt-1">
                  {getDateRangeLabel(activeFilters.period.from, activeFilters.period.to)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
