import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Transaction, Category } from '../types'
import { formatCurrency, formatDate } from './format'

export function exportToXlsx(
  transactions: Transaction[],
  categories: Category[],
  currency: 'RUB' | 'USD' | 'EUR' = 'RUB'
): void {
  // Create category map for quick lookup
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]))

  // Transform transactions to export format
  const exportData = transactions.map(tx => {
    const category = categoryMap.get(tx.categoryId)
    return {
      'Дата': formatDate(tx.date),
      'Тип': tx.type === 'income' ? 'Доход' : 'Расход',
      'Категория': category?.name || 'Без категории',
      'Сумма': tx.amount,
      'Валюта': currency,
      'Форматированная сумма': formatCurrency(tx.amount, currency),
      'Комментарий': tx.note || '',
      'Создано': new Date(tx.createdAt).toLocaleString('ru-RU'),
    }
  })

  // Sort by date descending
  exportData.sort((a, b) => {
    const dateA = new Date(transactions.find(t => 
      formatDate(t.date) === a['Дата'])?.date || 0)
    const dateB = new Date(transactions.find(t => 
      formatDate(t.date) === b['Дата'])?.date || 0)
    return dateB.getTime() - dateA.getTime()
  })

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(exportData)
  
  // Set column widths
  const colWidths = [
    { wch: 12 }, // Дата
    { wch: 10 }, // Тип
    { wch: 20 }, // Категория
    { wch: 12 }, // Сумма
    { wch: 8 },  // Валюта
    { wch: 18 }, // Форматированная сумма
    { wch: 30 }, // Комментарий
    { wch: 20 }, // Создано
  ]
  ws['!cols'] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Транзакции')

  // Add summary sheet
  const incomeTotal = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  const expenseTotal = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const summaryData = [
    { 'Показатель': 'Всего доходов', 'Значение': formatCurrency(incomeTotal, currency) },
    { 'Показатель': 'Всего расходов', 'Значение': formatCurrency(expenseTotal, currency) },
    { 'Показатель': 'Баланс', 'Значение': formatCurrency(incomeTotal - expenseTotal, currency) },
    { 'Показатель': 'Количество операций', 'Значение': transactions.length },
  ]

  const ws2 = XLSX.utils.json_to_sheet(summaryData)
  ws2['!cols'] = [{ wch: 20 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Сводка')

  // Generate file name with current date
  const today = new Date().toISOString().split('T')[0]
  const fileName = `finance_${today}.xlsx`

  // Write and save file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, fileName)
}
