import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Telegram Amharic Wordle Bot Handler
 * Demonstrates:
 * 1. Sending the Wordle widget using Bot API `sendWidget`
 * 2. Answering interactive widget queries via `answerWidgetQuery`
 * 3. Handling fallback inline keyboard or chat commands (/start, /play)
 */

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Load the compiled HTML widget
const widgetHtml = fs.readFileSync(path.join(__dirname, 'widget.html'), 'utf-8');

/**
 * Send the interactive Amharic Wordle widget into a chat
 */
export async function sendWordleWidget(chatId) {
  const url = `${TELEGRAM_API_URL}/sendWidget`;
  const payload = {
    chat_id: chatId,
    html: widgetHtml,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 አዲስ ጨዋታ ጀምር (Restart)', callback_data: 'restart_game' },
          { text: '📊 ውጤት አጋራ (Share)', switch_inline_query: 'እኔ የአማርኛ ዎርድል ተጫወትኩ!' }
        ]
      ]
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to sendWidget:', err);
    throw err;
  }
}

/**
 * Answer an incoming WidgetQuery from the user interacting with the widget
 */
export async function answerWidget(widgetQueryId, resultData) {
  const url = `${TELEGRAM_API_URL}/answerWidgetQuery`;
  const payload = {
    widget_query_id: widgetQueryId,
    // Provide feedback message or updated widget state
    message: {
      text: resultData.status === 'won' 
        ? `🎉 እንኳን ደስ አለዎት! ቃሉን በ ${resultData.tries} ሙከራ አግኝተዋል!`
        : `ተሸንፈዋል! ትክክለኛው ቃል "${resultData.word}" ነበር።`
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to answerWidgetQuery:', err);
    throw err;
  }
}

/**
 * Webhook/Polling update router
 */
export async function handleTelegramUpdate(update) {
  // Handle widget query
  if (update.widget_query) {
    const query = update.widget_query;
    console.log('Received WidgetQuery:', query);
    const data = JSON.parse(query.data || '{}');
    return await answerWidget(query.id, data);
  }

  // Handle standard message commands
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    if (text === '/start' || text === '/play') {
      console.log(`Starting Wordle widget for chat ${chatId}`);
      return await sendWordleWidget(chatId);
    }
  }
}

console.log('Amharic Wordle Bot initialized. Ready to serve via sendWidget & answerWidgetQuery.');
