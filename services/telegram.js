async function sendPhotoUrl(imageUrl, caption = '') {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: imageUrl,
      caption: caption ? caption.slice(0, 1024) : undefined,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.description || `Telegram API error ${response.status}`);
  }

  return response.json();
}

module.exports = { sendPhotoUrl };
