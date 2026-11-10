import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ Error: BOT_TOKEN is missing!');
  console.error('Please run with your bot token:');
  console.error('  $env:BOT_TOKEN="123456:ABC-DEF..."; node run_bot.js');
  process.exit(1);
}

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;
const widgetHtml = fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf-8');

/**
 * Send the Wordle widget to a user chat
 */
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

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('sendWidget API returned error:', data);
    } else {
      console.log(`✅ Widget sent successfully to chat ${chatId}`);
    }
    return data;
  } catch (err) {
    console.error('Failed to call sendWidget (will retry):', err.message);
  }
}

/**
 * Answer widget queries sent back when the user interacts or finishes
 */
async function answerWidgetQuery(queryId, text) {
  const url = `${API_BASE}/answerWidgetQuery`;
  const body = {
    widget_query_id: queryId,
    message: {
      text: text
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to call answerWidgetQuery:', err);
  }
}

/**
 * Long-polling loop to listen for updates
 */
async function startPolling() {
  console.log('🤖 Fetching bot info...');
  try {
    const meRes = await fetch(`${API_BASE}/getMe`);
    const me = await meRes.json();
    if (!me.ok) {
      console.error('❌ Invalid BOT_TOKEN or Telegram API error:', me);
      process.exit(1);
    }
    console.log(`✅ Connected as @${me.result.username} (${me.result.first_name})`);
    console.log('🚀 Polling for messages & widget updates (Press Ctrl+C to stop)...');
    console.log('💡 Open Telegram, search your bot, and send /start or /play !');
  } catch (e) {
    console.error('Failed to connect to Telegram:', e);
    process.exit(1);
  }

  let offset = 0;

  while (true) {
    try {
      const url = `${API_BASE}/getUpdates?offset=${offset}&timeout=30&allowed_updates=["message","callback_query","widget_query"]`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          // 1. Check for incoming Widget queries (from inside widget)
          if (update.widget_query) {
            console.log('📥 Received WidgetQuery from user:', update.widget_query);
            let parsed = {};
            try {
              parsed = JSON.parse(update.widget_query.data || '{}');
            } catch (_) {}

            const replyMsg = parsed.status === 'won'
              ? `🎉 እንኳን ደስ አለዎት! ቃሉን በ ${parsed.tries} ሙከራ አግኝተዋል!`
              : `ተሸንፈዋል! ትክክለኛው ቃል "${parsed.word || ''}" ነበር።`;

            await answerWidgetQuery(update.widget_query.id, replyMsg);
          }

          // 2. Check for message commands (/start or /play)
          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text.trim();

            console.log(`💬 Message from ${chatId}: "${text}"`);

            if (text.startsWith('/start') || text.startsWith('/play')) {
              await sendWordleWidget(chatId);
            }
          }

          // 3. Callback queries (e.g. restart button)
          if (update.callback_query) {
            const cb = update.callback_query;
            if (cb.data === 'restart_game' && cb.message) {
              await sendWordleWidget(cb.message.chat.id);
            }
          }
        }
      }
    } catch (err) {
      console.error('Polling error (will retry in 3s):', err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

startPolling();
