import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, Download, Plus } from 'lucide-react'
import telegramAPI from '../telegram/telegram'

interface HeaderProps {
  onAddTransaction: () => void
  onExport: () => void
}

export const Header: React.FC<HeaderProps> = ({ onAddTransaction, onExport }) => {
  const handleAdd = () => {
    telegramAPI.impact('light')
    onAddTransaction()
  }

  const handleExport = () => {
    telegramAPI.impact('light')
    onExport()
  }

  return (
    <motion.header
      className="sticky top-0 z-30 glass-dark backdrop-blur-xl border-b border-white/10 safe-top"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mobile-px-4 small-mobile-px-3">
        {/* Logo & Title */}
        <motion.div
          className="flex items-center gap-3 sm:gap-4 mobile-gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-400/25 touch-target"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Wallet size={20} className="text-white sm:w-6 sm:h-6" />
          </motion.div>
          <div className="hidden sm:block">
            <motion.h1
              className="text-xl sm:text-2xl font-bold text-tg-text mobile-text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Финансы
            </motion.h1>
            <motion.p
              className="text-xs text-tg-hint/70 uppercase tracking-wide small-mobile-text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Личный трекер
            </motion.p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex items-center gap-2 sm:gap-3 mobile-gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Export Button */}
          <motion.button
            onClick={handleExport}
            className="p-2 sm:p-3 rounded-2xl glass hover:bg-white/15 transition-all duration-300 group touch-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Экспорт в Excel"
          >
            <Download
              size={18}
              className="text-tg-hint transition-all duration-300 group-hover:text-primary-400 sm:w-5 sm:h-5"
            />
          </motion.button>

          {/* Add Transaction Button */}
          <motion.button
            onClick={handleAdd}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 
                     text-white font-semibold shadow-lg shadow-primary-400/25 hover:shadow-xl hover:shadow-primary-400/30 
                     transition-all duration-300 min-h-touch mobile-gap-2"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
            </motion.div>
            <span className="text-sm sm:text-base font-medium mobile-text-sm">
              <span className="hidden sm:inline">Операция</span>
              <span className="sm:hidden">+</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  )
}
