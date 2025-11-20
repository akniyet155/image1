// Пример бота (Telegraf), который принимает данные из WebApp (web_app_data)
const { Telegraf } = require('telegraf');
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Укажи BOT_TOKEN в env: export BOT_TOKEN=xxxx');
  process.exit(1);
}
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  // Отправляем кнопку для открытия WebApp (в BotFather нужно разрешить Web App URL или использовать кнопку с web_app)
  const webAppUrl = process.env.WEBAPP_URL || 'https://your-domain.com/index.html';
  return ctx.reply('Открыть каталог ботов:', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Открыть каталог', web_app: { url: webAppUrl } }]]
    }
  });
});

// Принимаем данные, отправленные из WebApp через tg.sendData
bot.on('message', async (ctx) => {
  const msg = ctx.message;
  if (msg.web_app_data) {
    const data = msg.web_app_data.data;
    let parsed;
    try { parsed = JSON.parse(data); } catch(e) { parsed = { raw: data }; }
    console.log('Получены данные из WebApp:', parsed);
    await ctx.reply(`Спасибо — я получил данные из Web App:
${JSON.stringify(parsed, null, 2)}`);
  }
});

bot.launch().then(() => console.log('Bot started (long polling)')).catch(console.error);

// graceful stop
process.once('SIGINT', () => bot.stop('SIGINT')); 
process.once('SIGTERM', () => bot.stop('SIGTERM')); 
