export type TxType = 'expense' | 'income'

export interface Category {
  id: string
  name: string
  type: TxType
  icon: string // Lucide icon name
  color: string
}

export interface Transaction {
  id: string
  type: TxType
  amount: number
  categoryId: string
  date: string // ISO string
  note?: string
  createdAt: string // ISO string
}

export interface Period {
  from: string
  to: string
}

export interface Budget {
  id: string
  categoryId?: string
  monthlyLimit: number
}

export interface Settings {
  currency: 'RUB' | 'USD' | 'EUR'
}

export interface PersistedStateV1 {
  version: 1
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  settings: Settings
}

export interface FilterOptions {
  period?: Period
  type?: TxType
  categoryId?: string
}
