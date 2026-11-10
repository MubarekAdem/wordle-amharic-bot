import fs from 'fs';
import path from 'path';

// Read widget HTML once
const widgetPath = path.join(process.cwd(), 'widget.html');
let widgetHtml = '';
try {
  widgetHtml = fs.readFileSync(widgetPath, 'utf-8');
} catch (e) {
  console.error('Error reading widget.html:', e);
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendWordleWidget(chatId) {
  const url = `${API_BASE}/sendWidget`;
  const body = {
    chat_id: chatId,
    html: widgetHtml,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 ዳግም ጀምር (Restart)', callback_data: 'restart_game' }
        ]
      ]
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function answerWidgetQuery(queryId, text) {
  const url = `${API_BASE}/answerWidgetQuery`;
  const body = {
    widget_query_id: queryId,
    message: { text }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

export default async function handler(req, res) {
  // Only accept POST requests from Telegram Webhook
  if (req.method !== 'POST') {
    return res.status(200).send('Amharic Wordle Telegram Webhook is active.');
  }

  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'BOT_TOKEN is not set in environment variables' });
  }

  const update = req.body;
  if (!update) {
    return res.status(400).send('No payload');
  }

  try {
    // 1. Handle incoming Widget queries
    if (update.widget_query) {
      const q = update.widget_query;
      let parsed = {};
      try {
        parsed = JSON.parse(q.data || '{}');
      } catch (_) {}

      const replyMsg = parsed.status === 'won'
        ? `🎉 እንኳን ደስ አለዎት! ቃሉን በ ${parsed.tries} ሙከራ አግኝተዋል!`
        : `ተሸንፈዋል! ትክክለኛው ቃል "${parsed.word || ''}" ነበር።`;

      await answerWidgetQuery(q.id, replyMsg);
      return res.status(200).json({ ok: true });
    }

    // 2. Handle commands (/start, /play)
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text.startsWith('/start') || text.startsWith('/play')) {
        await sendWordleWidget(chatId);
        return res.status(200).json({ ok: true });
      }
    }

    // 3. Handle inline button callbacks
    if (update.callback_query) {
      const cb = update.callback_query;
      if (cb.data === 'restart_game' && cb.message) {
        await sendWordleWidget(cb.message.chat.id);
        return res.status(200).json({ ok: true });
      }
    }

    return res.status(200).json({ ok: true, ignored: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
