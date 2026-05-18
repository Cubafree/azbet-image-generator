const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { generateImage } = require('../services/openai');
const { uploadImage, buildOverlayUrl } = require('../services/cloudinary');
const { sendPhotoUrl } = require('../services/telegram');

router.post('/', async (req, res) => {
  const { prompt, bannerText } = req.body;

  if (!prompt?.trim() || !bannerText?.trim()) {
    return res.status(400).json({ error: 'prompt and bannerText are required' });
  }

  try {
    // Generate image via OpenAI
    const imageBuffer = await generateImage(prompt.trim());

    // Upload to Cloudinary
    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;

    // Build final overlay URL
    const finalUrl = buildOverlayUrl(publicId, bannerText.trim());

    // Save to DB
    const { rows } = await pool.query(
      `INSERT INTO generations (prompt, banner_text, cloudinary_public_id, final_url, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [prompt.trim(), bannerText.trim(), publicId, finalUrl]
    );
    const generation = rows[0];

    // Send to Telegram (non-blocking for UX — log error if fails)
    sendPhotoUrl(finalUrl, `🎨 <b>New banner</b>\nPrompt: ${prompt.trim()}\nBanner: ${bannerText.trim()}`)
      .catch((err) => console.error('Telegram send failed:', err.message));

    res.json({ generation });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/confirm', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `UPDATE generations SET status = 'confirmed', confirmed_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json({ generation: rows[0] });
});

router.post('/:id/regenerate', async (req, res) => {
  const { id } = req.params;

  // Fetch original
  const { rows: orig } = await pool.query('SELECT * FROM generations WHERE id = $1', [id]);
  if (!orig.length) return res.status(404).json({ error: 'Not found' });

  const { prompt, banner_text: bannerText } = orig[0];

  try {
    const imageBuffer = await generateImage(prompt);
    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;
    const finalUrl = buildOverlayUrl(publicId, bannerText);

    const { rows } = await pool.query(
      `INSERT INTO generations (prompt, banner_text, cloudinary_public_id, final_url, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [prompt, bannerText, publicId, finalUrl]
    );
    const generation = rows[0];

    sendPhotoUrl(finalUrl, `♻️ <b>Regenerated banner</b>\nPrompt: ${prompt}\nBanner: ${bannerText}`)
      .catch((err) => console.error('Telegram send failed:', err.message));

    res.json({ generation });
  } catch (err) {
    console.error('Regeneration error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
