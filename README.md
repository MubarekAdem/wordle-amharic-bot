# Amharic Wordle Telegram Bot

Interactive Amharic Wordle game that runs inside Telegram using Bot API HTML Widgets (`sendWidget` and `answerWidgetQuery`).

## Quick Start Guide

### Step 1: Create a Bot on Telegram
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot`.
3. Choose a name (e.g. `Amharic Wordle`) and a username (e.g. `AmharicWordleBot`).
4. BotFather will give you an **API Token** like:
   `7123456789:AAF_example_token_abcdef12345`

### Step 2: Run the Bot

Open PowerShell in this project folder:

```powershell
cd "C:\Users\mubar\.gemini\antigravity\scratch\amharic-wordle-bot"
```

Set your bot token and run the bot:

```powershell
$env:BOT_TOKEN="YOUR_BOT_TOKEN_HERE"
node run_bot.js
```

### Step 3: Play in Telegram!
1. Open Telegram on your phone or desktop.
2. Search for your bot's username and press **Start** (or send `/play`).
3. The bot will send the interactive **ቃል ገምት (Wordle)** widget right inside the chat window!
4. Tap consonants to pick vowels and guess the 4-fidel word in 6 tries.
