import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Transaction, Category, Budget, Settings, FilterOptions, TxType } from '../types'

interface FinanceState {
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  settings: Settings

  // Filter state
  activeFilters: FilterOptions

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void
  removeTransaction: (id: string) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void

  addCategory: (category: Omit<Category, 'id'>) => void
  removeCategory: (id: string) => void

  setCurrency: (currency: 'RUB' | 'USD' | 'EUR') => void

  // Filter actions
  setFilters: (filters: FilterOptions) => void
  clearFilters: () => void
  setTypeFilter: (type: TxType | '') => void
  setCategoryFilter: (categoryId: string) => void
  setPeriodFilter: (period?: { from: string; to: string }) => void

  // Computed
  filtered: (options?: FilterOptions) => Transaction[]
  filteredTransactions: () => Transaction[]
  totals: (period?: { from: string; to: string }) => {
    income: number
    expense: number
    balance: number
  }

  // Seed data for dev
  seedData: () => void
  updateCategories: () => void
}

// Default categories with modern SVG icons
const defaultCategories: Category[] = [
  // Expense categories
  { id: 'food', name: 'Еда', type: 'expense', icon: 'utensils-crossed', color: '#f97316' },
  { id: 'transport', name: 'Транспорт', type: 'expense', icon: 'car', color: '#3b82f6' },
  { id: 'shopping', name: 'Покупки', type: 'expense', icon: 'shopping-bag', color: '#ec4899' },
  {
    id: 'entertainment',
    name: 'Развлечения',
    type: 'expense',
    icon: 'gamepad-2',
    color: '#8b5cf6',
  },
  { id: 'health', name: 'Здоровье', type: 'expense', icon: 'pill', color: '#ef4444' },
  { id: 'utilities', name: 'ЖКХ', type: 'expense', icon: 'home', color: '#06b6d4' },
  { id: 'finance', name: 'Финансы', type: 'expense', icon: 'credit-card', color: '#8b5cf6' },
  { id: 'travel', name: 'Путешествия', type: 'expense', icon: 'plane', color: '#06b6d4' },
  {
    id: 'education',
    name: 'Образование',
    type: 'expense',
    icon: 'graduation-cap',
    color: '#3b82f6',
  },
  { id: 'family', name: 'Семья', type: 'expense', icon: 'heart', color: '#ec4899' },
  { id: 'coffee', name: 'Кафе', type: 'expense', icon: 'coffee', color: '#a855f7' },
  { id: 'clothing', name: 'Одежда', type: 'expense', icon: 'shirt', color: '#f59e0b' },
  { id: 'fuel', name: 'Топливо', type: 'expense', icon: 'fuel', color: '#ef4444' },
  { id: 'other-expense', name: 'Прочее', type: 'expense', icon: 'package', color: '#6b7280' },

  // Income categories
  { id: 'salary', name: 'Зарплата', type: 'income', icon: 'banknote', color: '#10b981' },
  { id: 'bonus', name: 'Бонус', type: 'income', icon: 'gift', color: '#f59e0b' },
  { id: 'investment', name: 'Инвестиции', type: 'income', icon: 'trending-up', color: '#22c55e' },
  { id: 'freelance', name: 'Фриланс', type: 'income', icon: 'laptop', color: '#a855f7' },
  { id: 'other-income', name: 'Прочее', type: 'income', icon: 'dollar-sign', color: '#84cc16' },
]

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: defaultCategories,
      budgets: [],
      settings: {
        currency: 'RUB',
      },
      activeFilters: {},

      addTransaction: (tx) => {
        const newTransaction: Transaction = {
          ...tx,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }))
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
        }))
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: nanoid(),
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },

      removeCategory: (id) => {
        // Don't remove default categories
        const defaultIds = defaultCategories.map((c) => c.id)
        if (defaultIds.includes(id)) return

        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }))
      },

      setCurrency: (currency) => {
        set((state) => ({
          settings: { ...state.settings, currency },
        }))
      },

      // Filter actions
      setFilters: (filters) => {
        set({ activeFilters: filters })
      },

      clearFilters: () => {
        set({ activeFilters: {} })
      },

      setTypeFilter: (type) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            type: type || undefined,
            categoryId: undefined, // Reset category when changing type
          },
        }))
      },

      setCategoryFilter: (categoryId) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            categoryId: categoryId || undefined,
          },
        }))
      },

      setPeriodFilter: (period) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            period,
          },
        }))
      },

      filtered: (options) => {
        const { transactions } = get()
        let result = [...transactions]

        if (options?.type) {
          result = result.filter((tx) => tx.type === options.type)
        }

        if (options?.categoryId) {
          result = result.filter((tx) => tx.categoryId === options.categoryId)
        }

        if (options?.period) {
          const { from, to } = options.period
          if (from) {
            result = result.filter((tx) => tx.date >= from)
          }
          if (to) {
            result = result.filter((tx) => tx.date <= to)
          }
        }

        // Sort by date descending, then by createdAt
        result.sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date)
          if (dateCompare !== 0) return dateCompare
          return b.createdAt.localeCompare(a.createdAt)
        })

        return result
      },

      filteredTransactions: () => {
        const { activeFilters, filtered } = get()
        return filtered(activeFilters)
      },

      totals: (period) => {
        const { filtered } = get()
        const transactions = period ? filtered({ period }) : get().transactions

        const income = transactions
          .filter((tx) => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0)

        const expense = transactions
          .filter((tx) => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0)

        return {
          income,
          expense,
          balance: income - expense,
        }
      },

      seedData: () => {
        // Force update categories with colors
        set({ categories: defaultCategories })

        // Only seed if no transactions exist
        if (get().transactions.length > 0) return

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)

        const seedTransactions: Transaction[] = [
          {
            id: nanoid(),
            type: 'expense',
            amount: 1250,
            categoryId: 'food',
            date: today.toISOString().split('T')[0],
            note: 'Обед в кафе',
            createdAt: new Date().toISOString(),
          },
          {
            id: nanoid(),
            type: 'expense',
            amount: 500,
            categoryId: 'transport',
            date: yesterday.toISOString().split('T')[0],
            note: 'Такси домой',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: nanoid(),
            type: 'expense',
            amount: 2500,
            categoryId: 'shopping',
            date: yesterday.toISOString().split('T')[0],
            note: 'Покупки в магазине',
            createdAt: new Date(Date.now() - 80000000).toISOString(),
          },
          {
            id: nanoid(),
            type: 'expense',
            amount: 800,
            categoryId: 'entertainment',
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: 'Кино с друзьями',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: nanoid(),
            type: 'expense',
            amount: 3500,
            categoryId: 'utilities',
            date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: 'Коммунальные услуги',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: nanoid(),
            type: 'income',
            amount: 85000,
            categoryId: 'salary',
            date: weekAgo.toISOString().split('T')[0],
            note: 'Зарплата за ноябрь',
            createdAt: new Date(Date.now() - 604800000).toISOString(),
          },
          {
            id: nanoid(),
            type: 'income',
            amount: 15000,
            categoryId: 'freelance',
            date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: 'Проект по веб-дизайну',
            createdAt: new Date(Date.now() - 432000000).toISOString(),
          },
        ]

        set({ transactions: seedTransactions })
      },



      updateCategories: () => {
        set({ categories: defaultCategories })
      },
    }),
    {
      name: 'finance-v1',
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        budgets: state.budgets,
        settings: state.settings,
        // activeFilters не сохраняем - они должны сбрасываться при перезагрузке
      }),
    }
  )
)
