export function formatCurrency(amount: number, currency: 'RUB' | 'USD' | 'EUR' = 'RUB'): string {
  const currencySymbols = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  }

  const formatted = Math.abs(amount).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const symbol = currencySymbols[currency]
  
  if (currency === 'USD' || currency === 'EUR') {
    return `${symbol}${formatted}`
  }
  
  return `${formatted} ${symbol}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function parseAmount(value: string): number {
  // Replace comma with dot for decimal separator
  const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '')
  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? 0 : parsed
}

export function getDateRangeLabel(from?: string, to?: string): string {
  if (!from && !to) return 'Весь период'
  if (from && to) {
    return `${formatDateShort(from)} - ${formatDateShort(to)}`
  }
  if (from) return `С ${formatDateShort(from)}`
  if (to) return `До ${formatDateShort(to)}`
  return 'Весь период'
}

export function getMonthStartEnd(date: Date = new Date()): { start: string; end: string } {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const start = new Date(year, month, 1).toISOString().split('T')[0]
  const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
  
  return { start, end }
}

export function getWeekStartEnd(date: Date = new Date()): { start: string; end: string } {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
  
  const start = new Date(date.setDate(diff))
  const end = new Date(date.setDate(diff + 6))
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}
