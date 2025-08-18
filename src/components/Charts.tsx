import React from 'react'
import { motion } from 'framer-motion'
import { PieChart as PieChartIcon, TrendingUp, BarChart3 } from 'lucide-react'
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatCurrency, formatDateShort } from '../utils/format'
import { CategoryIcon } from './CategoryIcon'
import { Card } from './Card'

export const Charts: React.FC = () => {
  const { transactions: allTransactions, categories, settings } = useFinanceStore()
  const { currency } = settings

  // Prepare data for PieChart (expenses by category) - use ALL transactions, not filtered
  const expensesByCategory = allTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce(
      (acc, tx) => {
        const category = categories.find((c) => c.id === tx.categoryId)
        const name = category?.name || 'Без категории'
        const icon = category?.icon || 'package'
        const color = category?.color || '#6b7280'

        if (!acc[tx.categoryId]) {
          acc[tx.categoryId] = {
            name,
            icon,
            value: 0,
            color,
            categoryId: tx.categoryId,
          }
        }
        acc[tx.categoryId].value += tx.amount
        return acc
      },
      {} as Record<
        string,
        { name: string; icon: string; value: number; color: string; categoryId: string }
      >
    )

  const pieData = Object.values(expensesByCategory)
    .map((item) => ({
      name: item.name,
      icon: item.icon,
      value: Math.round(item.value),
      color: item.color,
      categoryId: item.categoryId,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Show top 8 categories

  // Note: colors are handled individually in the Cell components below

  // Prepare data for LineChart (daily balance)
  const dailyData = allTransactions.reduce(
    (acc, tx) => {
      const date = tx.date
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 }
      }
      if (tx.type === 'income') {
        acc[date].income += tx.amount
      } else {
        acc[date].expense += tx.amount
      }
      return acc
    },
    {} as Record<string, { income: number; expense: number }>
  )

  const lineData = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30) // Last 30 days
    .map(([date, { income, expense }]) => ({
      date: formatDateShort(date),
      income: Math.round(income),
      expense: Math.round(expense),
      balance: Math.round(income - expense),
    }))

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          className="glass rounded-2xl p-4 shadow-xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-semibold text-tg-text mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-tg-text">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  const PieTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: { name: string; value: number; color: string; icon: string } }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          className="glass rounded-2xl p-4 shadow-xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <CategoryIcon icon={data.icon} size={16} color={data.color} />
            </div>
            <span className="font-semibold text-tg-text">{data.name}</span>
          </div>
          <div className="text-xl font-bold" style={{ color: data.color }}>
            {formatCurrency(data.value, currency)}
          </div>
          <div className="text-xs text-tg-hint mt-1">
            {((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </div>
        </motion.div>
      )
    }
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (pieData.length === 0 && lineData.length === 0) {
    return (
      <motion.div
        className="px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="text-center py-12">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl glass flex items-center justify-center"
          >
            <BarChart3 size={40} className="text-tg-hint/50" />
          </motion.div>
          <h3 className="text-xl font-semibold text-tg-text mb-2">Недостаточно данных</h3>
          <p className="text-tg-hint">Добавьте транзакции для просмотра аналитики</p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="px-6 py-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Pie Chart */}
      {pieData.length > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                <PieChartIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-tg-text">Расходы по категориям</h3>
                <p className="text-sm text-tg-hint/70">Топ-8 категорий трат</p>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`gradient-${index}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {pieData.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.categoryId}
                  className="flex items-center gap-3 p-3 rounded-xl glass-dark hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-tg-text truncate">{item.name}</div>
                    <div className="text-xs text-tg-hint">
                      {formatCurrency(item.value, currency)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Line Chart */}
      {lineData.length > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-tg-text">Динамика баланса</h3>
                <p className="text-sm text-tg-hint/70">Последние 30 дней</p>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                  horizontal={true}
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="var(--tg-theme-hint-color)"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: 'var(--tg-theme-hint-color)' }}
                />

                <YAxis
                  stroke="var(--tg-theme-hint-color)"
                  fontSize={11}
                  tickFormatter={(value) =>
                    `${Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
                  }
                  tick={{ fill: 'var(--tg-theme-hint-color)' }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  name="Доход"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#ffffff' }}
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  name="Расход"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />

                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  name="Баланс"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {[
                { key: 'income', color: '#22c55e', name: 'Доход' },
                { key: 'expense', color: '#ef4444', name: 'Расход' },
                { key: 'balance', color: '#3b82f6', name: 'Баланс' },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-tg-text font-medium">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
