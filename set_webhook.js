import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.argv[2];

if (!BOT_TOKEN || !WEBHOOK_URL) {
  console.log('Usage:');
  console.log('  $env:BOT_TOKEN="YOUR_TOKEN"');
  console.log('  node set_webhook.js https://your-project.vercel.app/api/webhook');
  process.exit(1);
}

async function registerWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  console.log(`Setting webhook to: ${WEBHOOK_URL}...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query', 'widget_query']
    })
  });

  const data = await res.json();
  console.log('Response:', data);
  if (data.ok) {
    console.log('✅ Webhook registered successfully!');
  } else {
    console.error('❌ Failed to register webhook:', data.description);
  }
}

registerWebhook();
