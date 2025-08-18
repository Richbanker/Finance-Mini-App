import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatCurrency } from '../utils/format'
import { SummaryCard } from './Card'

export const SummaryCards: React.FC = () => {
  const { totals, settings } = useFinanceStore()
  const { income, expense, balance } = totals()
  const { currency } = settings

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 mobile-px-4 small-mobile-px-3">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mobile-gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Income Card */}
        <motion.div variants={cardVariants}>
          <SummaryCard className="group relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-success-400/10 to-success-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-success-400 shadow-glow-green" />
                  <span className="text-sm text-tg-hint font-medium uppercase tracking-wide">Доход</span>
                </div>
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowUpCircle size={24} className="text-white" />
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <motion.div 
                  className="text-3xl font-bold text-success-400"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  +{formatCurrency(income, currency)}
                </motion.div>
                <div className="text-xs text-tg-hint/70 flex items-center space-x-1">
                  <TrendingUp size={12} className="text-success-400" />
                  <span>За весь период</span>
                </div>
              </div>
            </div>
          </SummaryCard>
        </motion.div>

        {/* Expense Card */}
        <motion.div variants={cardVariants}>
          <SummaryCard className="group relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-danger-400/10 to-danger-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-danger-400 shadow-glow-red" />
                  <span className="text-sm text-tg-hint font-medium uppercase tracking-wide">Расход</span>
                </div>
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-danger-400 to-danger-600 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowDownCircle size={24} className="text-white" />
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <motion.div 
                  className="text-3xl font-bold text-danger-400"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  -{formatCurrency(expense, currency)}
                </motion.div>
                <div className="text-xs text-tg-hint/70 flex items-center space-x-1">
                  <TrendingDown size={12} className="text-danger-400" />
                  <span>За весь период</span>
                </div>
              </div>
            </div>
          </SummaryCard>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={cardVariants}>
          <SummaryCard className="group relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
              balance >= 0 
                ? 'bg-gradient-to-br from-primary-400/10 to-primary-600/5' 
                : 'bg-gradient-to-br from-warning-400/10 to-warning-600/5'
            }`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    balance >= 0 ? 'bg-primary-400 shadow-glow' : 'bg-warning-400'
                  }`} />
                  <span className="text-sm text-tg-hint font-medium uppercase tracking-wide">Баланс</span>
                </div>
                <motion.div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    balance >= 0 
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600' 
                      : 'bg-gradient-to-br from-warning-400 to-warning-600'
                  }`}
                  whileHover={{ scale: 1.1, rotate: balance >= 0 ? 10 : -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Wallet size={24} className="text-white" />
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <motion.div 
                  className={`text-3xl font-bold ${
                    balance >= 0 ? 'text-primary-400' : 'text-warning-400'
                  }`}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {balance >= 0 ? '+' : ''}{formatCurrency(balance, currency)}
                </motion.div>
                <div className="text-xs text-tg-hint/70 flex items-center space-x-1">
                  {balance >= 0 ? (
                    <>
                      <TrendingUp size={12} className="text-primary-400" />
                      <span>Положительный</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={12} className="text-warning-400" />
                      <span>Требует внимания</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SummaryCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
