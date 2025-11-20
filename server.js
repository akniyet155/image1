// Простой сервер для локальной разработки: отдаёт статику и принимает трекинг
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.json({ limit: '128kb' }));

// Эндпоинт для трекинга (опционально)
app.post('/track', (req, res) => {
  console.log('TRACK:', new Date().toISOString(), req.body);
  // Здесь можно сохранять в файл/базу или пересылать в аналитики
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Dev server started at http://localhost:${PORT}`));
