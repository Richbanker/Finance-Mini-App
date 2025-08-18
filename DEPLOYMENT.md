# 🚀 Deployment Guide

Пошаговая инструкция для деплоя Finance Mini App на GitHub и Vercel.

## 📋 Checklist перед деплоем

- [x] ✅ Создан .gitignore файл
- [x] ✅ Обновлен package.json с правильной информацией
- [x] ✅ Создана конфигурация vercel.json
- [x] ✅ Написан подробный README.md
- [x] ✅ Настроены переменные окружения
- [x] ✅ Оптимизирован build для продакшена
- [x] ✅ Создан репозиторий на GitHub
- [x] ✅ Настроен CI/CD pipeline

## 🔧 Шаг 1: Инициализация Git и загрузка на GitHub

```bash
# Инициализируем git репозиторий
git init

# Добавляем все файлы
git add .

# Делаем первый коммит
git commit -m "🎉 Initial commit: Finance Mini App ready for deployment"

# Подключаем удаленный репозиторий
git remote add origin https://github.com/Richbanker/Finance-Mini-App.git

# Загружаем код на GitHub
git branch -M main
git push -u origin main
```

## 🌐 Шаг 2: Деплой на Vercel

### Вариант A: Автоматический деплой через GitHub

1. **Перейдите на [vercel.com](https://vercel.com)**
2. **Войдите через GitHub аккаунт**
3. **Нажмите "New Project"**
4. **Выберите репозиторий** `Richbanker/Finance-Mini-App`
5. **Настройте проект:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (по умолчанию)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Вариант B: Деплой через Vercel CLI

```bash
# Установите Vercel CLI глобально
npm install -g vercel

# Войдите в аккаунт
vercel login

# Деплой проекта
vercel

# Следуйте инструкциям:
# ? Set up and deploy "~/Finance-Mini-App"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your username]
# ? Link to existing project? [y/N] N
# ? What's your project's name? finance-mini-app
# ? In which directory is your code located? ./
```

## 🔐 Шаг 3: Настройка переменных окружения в Vercel

1. **Откройте проект** в Vercel Dashboard
2. **Перейдите в Settings** → Environment Variables
3. **Добавьте переменные:**

```env
# Обязательные
VITE_APP_URL=https://your-project-name.vercel.app

# Опциональные (для аналитики)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Telegram (для продакшена)
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## 📱 Шаг 4: Настройка Telegram Mini App

### 4.1 Создание Telegram бота

1. **Найдите [@BotFather](https://t.me/botfather)** в Telegram
2. **Создайте нового бота:**
   ```
   /newbot
   Finance Mini App Bot
   finance_miniapp_bot
   ```
3. **Сохраните токен** бота

### 4.2 Настройка Mini App

1. **Настройте Mini App:**
   ```
   /newapp
   [Выберите вашего бота]
   Finance Mini App
   Личный финансовый трекер с красивым интерфейсом
   [Загрузите фото приложения]
   https://your-project-name.vercel.app
   ```

2. **Настройте Menu Button:**
   ```
   /mybots
   [Выберите бота]
   Bot Settings
   Menu Button
   Configure Menu Button
   Finance App
   https://your-project-name.vercel.app
   ```

## 🔄 Шаг 5: Настройка CI/CD (GitHub Actions)

GitHub Actions уже настроен! При каждом push в `main` ветку будет:

1. ✅ **Проверка типов** TypeScript
2. ✅ **Линтинг** кода
3. ✅ **Проверка форматирования**
4. ✅ **Сборка** приложения
5. 🚀 **Автодеплой** на Vercel

### Настройка секретов GitHub

1. **Перейдите в Settings** → Secrets and variables → Actions
2. **Добавьте секреты:**

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
PRODUCTION_URL=https://your-project-name.vercel.app
```

**Как получить токены:**
- **VERCEL_TOKEN**: Vercel Dashboard → Settings → Tokens
- **VERCEL_ORG_ID & PROJECT_ID**: Vercel CLI команда `vercel env ls`

## 📊 Шаг 6: Проверка деплоя

### Проверьте что работает:

- [ ] 🌐 **Сайт открывается** по ссылке Vercel
- [ ] 📱 **Мобильная версия** корректно отображается
- [ ] 🎨 **Сплэш-экран** показывается 2 секунды
- [ ] 💾 **Данные сохраняются** в localStorage
- [ ] 📊 **Графики отображаются** корректно
- [ ] 📤 **Экспорт в Excel** работает
- [ ] 🔄 **Анимации** плавные
- [ ] 🎯 **Touch targets** удобные для тапа

### Performance проверка:

```bash
# Локальная проверка production build
npm run build
npm run preview

# Откройте http://localhost:3001
# Проверьте в DevTools → Lighthouse
```

## 🛠️ Troubleshooting

### Проблема: Build fails

```bash
# Проверьте типы
npm run type-check

# Исправьте линтер
npm run lint:fix

# Проверьте форматирование
npm run format
```

### Проблема: Vercel deployment fails

1. **Проверьте логи** в Vercel Dashboard
2. **Убедитесь** что все зависимости установлены
3. **Проверьте** переменные окружения

### Проблема: Telegram Mini App не открывается

1. **Проверьте URL** в настройках бота
2. **Убедитесь** что сайт доступен по HTTPS
3. **Проверьте** что нет ошибок в консоли

## 🎉 Готово!

Ваше приложение успешно развернуто! 

**Ссылки:**
- 🌐 **Production**: https://your-project-name.vercel.app
- 📱 **Telegram Bot**: @your_bot_username
- 📂 **GitHub**: https://github.com/Richbanker/Finance-Mini-App
- 📊 **Vercel Dashboard**: https://vercel.com/dashboard

## 📈 Следующие шаги

1. **Добавьте аналитику** (Google Analytics, Yandex Metrica)
2. **Настройте мониторинг** ошибок (Sentry)
3. **Добавьте больше валют**
4. **Реализуйте синхронизацию** между устройствами
5. **Добавьте уведомления**

---

**🚀 Happy Deployment!**
