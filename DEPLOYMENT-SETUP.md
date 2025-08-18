# 🚀 Настройка автоматического деплоя на Vercel

## 📋 Текущий статус

✅ **CI/CD настроен** - код проверяется автоматически  
⚠️ **Деплой требует настройки** - нужно добавить секреты

## 🔧 Быстрая настройка (5 минут)

### Вариант 1: Автоматический деплой через GitHub Actions

1. **Получите токен Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Перейдите в **Settings** → **Tokens**
   - Создайте новый токен с именем `GitHub Actions`
   - Скопируйте токен

2. **Получите ID проекта:**
   ```bash
   # Установите Vercel CLI
   npm install -g vercel
   
   # Войдите в аккаунт
   vercel login
   
   # В папке проекта создайте проект
   vercel
   
   # Получите ID организации и проекта
   vercel env ls
   ```

3. **Добавьте секреты в GitHub:**
   - Перейдите в **Repository Settings** → **Secrets and variables** → **Actions**
   - Нажмите **New repository secret** и добавьте:

   | Name | Value |
   |------|-------|
   | `VERCEL_TOKEN` | Токен из шага 1 |
   | `VERCEL_ORG_ID` | ID организации из шага 2 |
   | `VERCEL_PROJECT_ID` | ID проекта из шага 2 |

4. **Готово!** 🎉
   - При следующем push в `main` ветку запустится автодеплой
   - Приложение будет доступно по адресу Vercel

### Вариант 2: Ручной деплой (1 клик)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Richbanker/Finance-Mini-App)

1. Нажмите кнопку выше
2. Войдите в Vercel через GitHub
3. Нажмите **Deploy**
4. Готово! ✨

## 📊 Что происходит после настройки

### GitHub Actions будет:
1. ✅ **Проверять код** (TypeScript, ESLint, Prettier)
2. ✅ **Собирать приложение**
3. 🚀 **Деплоить на Vercel** автоматически
4. 📱 **Уведомлять о статусе** деплоя

### Vercel предоставит:
- 🌐 **Production URL** - основной адрес приложения
- 🔄 **Preview URLs** - для каждого Pull Request
- 📈 **Analytics** - статистика использования
- ⚡ **CDN** - быстрая загрузка по всему миру

## 🎯 Настройка Telegram Mini App

После деплоя настройте бота:

1. **Создайте бота** через [@BotFather](https://t.me/botfather):
   ```
   /newbot
   Finance Mini App Bot
   finance_miniapp_bot
   ```

2. **Настройте Mini App:**
   ```
   /newapp
   Finance Mini App
   Личный финансовый трекер
   https://your-vercel-url.vercel.app
   ```

3. **Настройте Menu Button:**
   ```
   /mybots → Bot Settings → Menu Button
   Finance App
   https://your-vercel-url.vercel.app
   ```

## 🔍 Проверка статуса

### GitHub Actions:
- Перейдите в **Actions** tab в репозитории
- Проверьте статус последних workflow

### Vercel Dashboard:
- Зайдите на [vercel.com/dashboard](https://vercel.com/dashboard)
- Найдите проект `finance-miniapp-richbanker`
- Проверьте статус деплоя

## 🆘 Troubleshooting

### Проблема: "Secrets not found"
- Проверьте правильность названий секретов
- Убедитесь что секреты добавлены в правильный репозиторий

### Проблема: "Build failed"
- Проверьте логи в GitHub Actions
- Убедитесь что код проходит все проверки локально

### Проблема: "Deployment failed"  
- Проверьте логи в Vercel Dashboard
- Убедитесь что токен имеет правильные права

## 📞 Поддержка

- **GitHub Issues** - для вопросов по коду
- **Vercel Support** - для вопросов по деплою
- **Telegram @BotFather** - для вопросов по боту

---

**🚀 После настройки ваше приложение будет автоматически деплоиться при каждом обновлении!**
