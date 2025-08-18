import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { useFinanceStore } from '../store/useFinanceStore'
import { parseAmount } from '../utils/format'
import { CategoryIcon } from './CategoryIcon'
import { SheetCard } from './Card'
import telegramAPI from '../telegram/telegram'
import type { TxType } from '../types'

interface AddTransactionSheetProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTransactionSheet: React.FC<AddTransactionSheetProps> = ({ isOpen, onClose }) => {
  const { addTransaction, categories } = useFinanceStore()

  const [type, setType] = useState<TxType>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ amount?: string }>({})

  // Filter categories by type
  const filteredCategories = categories.filter((cat) => cat.type === type)

  // Set default category when type changes or form opens
  useEffect(() => {
    const defaultCategory = filteredCategories[0]
    if (
      defaultCategory &&
      (!categoryId || !filteredCategories.some((cat) => cat.id === categoryId))
    ) {
      setCategoryId(defaultCategory.id)
    }
  }, [type, filteredCategories, categoryId])

  // Initialize category when form opens
  useEffect(() => {
    if (isOpen && !categoryId) {
      const defaultCategory = filteredCategories[0]
      if (defaultCategory) {
        setCategoryId(defaultCategory.id)
      }
    }
  }, [isOpen, categoryId, filteredCategories])

  const handleSubmit = () => {
    const newErrors: { amount?: string } = {}

    // Validate amount
    const parsedAmount = parseAmount(amount)
    if (parsedAmount <= 0) {
      newErrors.amount = 'Введите корректную сумму'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      telegramAPI.notification('error')
      return
    }

    // Add transaction
    addTransaction({
      type,
      amount: parsedAmount,
      categoryId,
      date,
      note: note.trim(),
    })

    telegramAPI.notification('success')
    handleClose()
  }

  const handleClose = () => {
    // Reset form
    setType('expense')
    setAmount('')
    setCategoryId('')
    setDate(new Date().toISOString().split('T')[0])
    setNote('')
    setErrors({})
    onClose()
  }

  const handleTypeChange = (newType: TxType) => {
    telegramAPI.selectionChanged()
    setType(newType)
    // Reset category when type changes
    setCategoryId('')
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const sheetVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SheetCard className="rounded-t-4xl rounded-b-none max-h-[90vh] overflow-hidden">
              <motion.div
                className="overflow-y-auto"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Handle bar */}
                <motion.div
                  className="w-16 h-1.5 bg-tg-hint/30 rounded-full mx-auto mb-8"
                  variants={itemVariants}
                />

                {/* Header */}
                <motion.div
                  className="flex items-center justify-between mb-8"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                      <CreditCard size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-tg-text">Новая операция</h2>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-xl bg-tg-hint/10 hover:bg-tg-hint/20 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} className="text-tg-hint" />
                  </motion.button>
                </motion.div>

                {/* Type selector */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <label className="block text-sm text-tg-hint font-medium mb-4 uppercase tracking-wide">
                    Тип операции
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => handleTypeChange('expense')}
                      className={`p-4 rounded-2xl min-h-touch flex items-center justify-center space-x-3 transition-all duration-300 ${
                        type === 'expense'
                          ? 'bg-gradient-to-br from-danger-400 to-danger-600 text-white shadow-lg shadow-danger-400/25'
                          : 'glass hover:bg-white/15'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowDownCircle size={24} />
                      <span className="font-semibold">Расход</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleTypeChange('income')}
                      className={`p-4 rounded-2xl min-h-touch flex items-center justify-center space-x-3 transition-all duration-300 ${
                        type === 'income'
                          ? 'bg-gradient-to-br from-success-400 to-success-600 text-white shadow-lg shadow-success-400/25'
                          : 'glass hover:bg-white/15'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowUpCircle size={24} />
                      <span className="font-semibold">Доход</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Amount input */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <label className="block text-sm text-tg-hint font-medium mb-4 uppercase tracking-wide">
                    Сумма <span className="text-danger-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setErrors({})
                      }}
                      placeholder="0"
                      className={`w-full p-6 text-4xl font-bold text-center glass rounded-2xl border-2 transition-all duration-300 
                                  placeholder:text-tg-hint/40 focus:border-primary-400 focus:shadow-glow ${
                                    errors.amount
                                      ? 'border-danger-400 focus:border-danger-400'
                                      : 'border-transparent'
                                  }`}
                      autoFocus
                    />
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-tg-hint text-2xl font-medium">
                      ₽
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors.amount && (
                      <motion.div
                        className="flex items-center gap-2 mt-3 text-danger-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={16} />
                        <span>{errors.amount}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Category selector */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <label className="block text-sm text-tg-hint font-medium mb-4 uppercase tracking-wide">
                    Категория <span className="text-danger-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => {
                          telegramAPI.selectionChanged()
                          setCategoryId(category.id)
                        }}
                        className={`p-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 min-h-touch ${
                          categoryId === category.id
                            ? 'glass-gradient border-2 border-primary-400/50 shadow-glow'
                            : 'glass hover:bg-white/15'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            categoryId === category.id ? 'bg-primary-400/20' : 'bg-white/10'
                          }`}
                        >
                          <CategoryIcon icon={category.icon} size={20} color={category.color} />
                        </div>
                        <span className="font-medium text-sm text-tg-text">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Date input */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <label className="block text-sm text-tg-hint font-medium mb-4 uppercase tracking-wide">
                    Дата
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-4 glass rounded-2xl border-2 border-transparent focus:border-primary-400 
                               focus:shadow-glow transition-all duration-300 text-tg-text"
                    />
                    <Calendar
                      size={20}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-tg-hint pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Note input */}
                <motion.div className="mb-10" variants={itemVariants}>
                  <label className="block text-sm text-tg-hint font-medium mb-4 uppercase tracking-wide">
                    Комментарий
                  </label>
                  <div className="relative">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Добавьте описание (необязательно)"
                      rows={3}
                      className="w-full p-4 glass rounded-2xl border-2 border-transparent focus:border-primary-400 
                               focus:shadow-glow transition-all duration-300 resize-none text-tg-text 
                               placeholder:text-tg-hint/40"
                    />
                    <FileText
                      size={20}
                      className="absolute right-4 top-4 text-tg-hint pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                  <motion.button
                    onClick={handleClose}
                    className="p-4 rounded-2xl glass hover:bg-white/15 text-tg-text font-semibold 
                             transition-all duration-300 min-h-touch"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!amount || !categoryId}
                    className={`p-4 rounded-2xl font-semibold transition-all duration-300 min-h-touch ${
                      amount && categoryId
                        ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-400/25 hover:shadow-xl'
                        : 'bg-tg-hint/20 text-tg-hint/50 cursor-not-allowed'
                    }`}
                    whileHover={amount && categoryId ? { scale: 1.02 } : {}}
                    whileTap={amount && categoryId ? { scale: 0.98 } : {}}
                  >
                    Сохранить
                  </motion.button>
                </motion.div>
              </motion.div>
            </SheetCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
