import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { Filters } from './components/Filters'
import { Charts } from './components/Charts'
import { TransactionList } from './components/TransactionList'
import { AddTransactionSheet } from './components/AddTransactionSheet'
import { useFinanceStore } from './store/useFinanceStore'
import { exportToXlsx } from './utils/exportExcel'
import telegramAPI from './telegram/telegram'

function App() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const { transactions, categories, settings } = useFinanceStore()

  useEffect(() => {
    // Initialize Telegram WebApp
    console.log('Telegram WebApp initialized:', telegramAPI.isReady)

    // Пользователи начинают с чистого листа - без тестовых данных
    // seedData() больше не вызывается автоматически
  }, [])

  const handleExport = () => {
    if (transactions.length === 0) {
      telegramAPI.notification('warning')
      alert('Нет данных для экспорта')
      return
    }

    try {
      exportToXlsx(transactions, categories, settings.currency)
      telegramAPI.notification('success')
    } catch (error) {
      console.error('Export failed:', error)
      telegramAPI.notification('error')
      alert('Ошибка при экспорте')
    }
  }

  return (
    <div className="min-h-screen bg-tg mobile-scroll">
      <Header onAddTransaction={() => setIsAddSheetOpen(true)} onExport={handleExport} />

      <main className="pb-6 sm:pb-8 safe-bottom mobile-py-4">
        <SummaryCards />
        <Filters />
        <Charts />
        <TransactionList />
      </main>

      <AddTransactionSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} />
    </div>
  )
}

export default App
