# Telegram Mini App — Каталог ботов (локальная версия)

Что сделано
- Разделил проект: index.html, styles.css, app.js, catalog.json.
- app.js динамически рендерит категории и ботов из catalog.json.
- При клике на карточку бота отправляется payload в бот через Telegram.WebApp.sendData и открывается ссылка через tg.openLink.
- server.js — простой dev-сервер для отдачи файлов и приёма /track (опционально).
- bot.js — пример Telegraf-бота, который принимает web_app_data.

Как запускать (локально)
1. Положи все файлы в одну папку.
2. Установи зависимости:
   npm install
3. Запусти сервер:
   npm start
   (сервер доступен по http://localhost:3000)
4. Опубликуй публичный HTTPS URL (нужно для Telegram Web App). Для разработки удобно использовать ngrok:
   ngrok http 3000
   и возьми https://<your-ngrok>.ngrok.io
5. Укажи WEBAPP_URL в bot.js / BotFather:
   export WEBAPP_URL="https://<your-ngrok>.ngrok.io/index.html"
6. Запусти бота:
   export BOT_TOKEN="токен_бота"
   npm run bot
7. В Telegram отправь боту /start и нажми кнопку "Открыть каталог". Web App откроется в клиенте Telegram.

Дальше (возможные улучшения)
- Поиск по каталогу.
- Админ-панель для управления catalog.json.
- Хранение каталога в базе данных.
- Аналитика кликов и статистика.
