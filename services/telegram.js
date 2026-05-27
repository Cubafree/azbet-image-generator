async function sendPhotoUrl(imageUrl, caption = '') {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  // Try URL-based sendPhoto first (fast, works for images < 5MB)
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    chatId,
      photo:      imageUrl,
      caption:    caption ? caption.slice(0, 1024) : undefined,
      parse_mode: 'HTML',
    }),
  });

  if (res.ok) return res.json();

  const err = await res.json().catch(() => ({}));
  const msg = err.description || '';

  // Telegram couldn't fetch the URL (file too large or URL issue) — download and re-upload
  if (msg.includes('failed to get HTTP URL content') || msg.includes('wrong file identifier')) {
    return sendPhotoBuffer(token, chatId, imageUrl, caption);
  }

  throw new Error(msg || `Telegram API error ${res.status}`);
}

async function sendPhotoBuffer(token, chatId, imageUrl, caption) {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
  const buffer     = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
  const ext         = contentType.includes('png') ? 'png' : 'jpg';

  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('photo',   new Blob([buffer], { type: contentType }), `banner.${ext}`);
  if (caption) form.append('caption', caption.slice(0, 1024));
  form.append('parse_mode', 'HTML');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    body:   form,
  });

  if (res.ok) return res.json();

  // If still too large (> 10MB), send as document (50MB limit)
  const err = await res.json().catch(() => ({}));
  const msg = err.description || '';
  if (msg.includes('photo is too big') || msg.includes('PHOTO_INVALID_DIMENSIONS')) {
    return sendDocumentBuffer(token, chatId, buffer, contentType, ext, caption);
  }

  throw new Error(msg || `Telegram API error ${res.status}`);
}

async function sendDocumentBuffer(token, chatId, buffer, contentType, ext, caption) {
  const form = new FormData();
  form.append('chat_id',  chatId);
  form.append('document', new Blob([buffer], { type: contentType }), `banner.${ext}`);
  if (caption) form.append('caption', caption.slice(0, 1024));
  form.append('parse_mode', 'HTML');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: 'POST',
    body:   form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.description || `Telegram API error ${res.status}`);
  }
  return res.json();
}

module.exports = { sendPhotoUrl };
