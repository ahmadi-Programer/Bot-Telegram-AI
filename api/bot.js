const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { webHook: true });
const url = `https://${process.env.VERCEL_URL}/api/bot`;

bot.setWebHook(url);

const prompts = {
  wota: `Kamu adalah WOTA BOT yang dibuat oleh AHMADI DEVELOPER, kamu di buat menjadi AI yang Ceria, Sopan, Fokus membantu, Coding, Dan Selalu Menggunakan Bahasa Indonesia. Kamu adalah seorang FANS JKT48, Oshi Mu TRISHA dan developer si Ahmadi oshinya Freya.`,
  reseller: `Kamu adalah Asisten Reseller Gaming siap melayani Reseller Gaming dan pengguna lainnya, dengan bahasa yang ramah, sopan, ceria dan selalu memakai bahasa Indonesia. Reseller Gaming dan Ahmadi developer adalah pemilik mu dan pembuat Kamu.`,
  code: `Kamu adalah AI CODE Reseller Gaming hanya fokus bikin website, bikin Berbagai bahasa komputer, memperbaiki kode error dan sejenisnya. Kamu selalu menggunakan Bahasa Indonesia dan Kamu di buat oleh Reseller Gaming programer and AHMADI DEVELOPER.`
};

bot.onText(/\/start/, (msg) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💃 WOTA BOT', callback_data: 'wota' }],
        [{ text: '🎮 Asisten Reseller Gaming', callback_data: 'reseller' }],
        [{ text: '🧑‍💻 AI CODE Reseller Gaming', callback_data: 'code' }]
      ]
    },
    parse_mode: 'Markdown'
  };
  bot.sendMessage(msg.chat.id, `🎉 *Selamat datang di Bot AI Reseller Gaming!*\n\nPilih AI yang kamu inginkan:`, opts);
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const type = query.data;

  bot.sendMessage(chatId, `✅ AI *${type.toUpperCase()}* dipilih.\n\nSilakan kirim pertanyaan atau perintah:`);
  bot.once('message', async (msg) => {
    const userText = msg.text;
    const prompt = prompts[type];

    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3`, {
        params: {
          prompt: prompt,
          content: userText
        }
      });

      const reply = res.data.data;

      bot.sendMessage(chatId, reply + `\n\n---\n© 2025 *Reseller Gaming* & *AHMADI DEVELOPER*`, { parse_mode: 'Markdown' });
    } catch (err) {
      bot.sendMessage(chatId, '❌ Gagal menghubungi AI. Coba lagi nanti.');
    }
  });
});

module.exports = async (req, res) => {
  bot.processUpdate(req.body);
  res.status(200).send('O
