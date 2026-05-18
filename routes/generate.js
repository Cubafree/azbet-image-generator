const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { generateImage } = require('../services/openai');
const { uploadImage, buildOverlayUrl } = require('../services/cloudinary');
const { sendPhotoUrl } = require('../services/telegram');
const { buildPrompt } = require('../promptBuilder');

const VALID = {
  vertical: ['casino', 'sport'],
  country: ['egypt', 'morocco', 'algeria', 'libya'],
  subject: ['woman', 'man', 'object'],
  sportType: ['football', 'tennis', 'basketball', 'general'],
  accentColor: ['cyan', 'green', 'purple'],
};

function validate(body) {
  const { vertical, country, subject, sportType, accentColor, bannerText, plashkaStyle } = body;
  if (!VALID.vertical.includes(vertical)) return `vertical must be one of: ${VALID.vertical.join(', ')}`;
  if (!VALID.country.includes(country)) return `country must be one of: ${VALID.country.join(', ')}`;
  if (!VALID.subject.includes(subject)) return `subject must be one of: ${VALID.subject.join(', ')}`;
  if (!VALID.accentColor.includes(accentColor)) return `accentColor must be one of: ${VALID.accentColor.join(', ')}`;
  if (vertical === 'sport' && subject !== 'object' && !VALID.sportType.includes(sportType)) {
    return `sportType must be one of: ${VALID.sportType.join(', ')} when vertical=sport and subject≠object`;
  }
  if (!bannerText?.trim()) return 'bannerText is required';
  if (!['filled', 'bordered'].includes(plashkaStyle)) return 'plashkaStyle must be filled or bordered';
  return null;
}

router.post('/', async (req, res) => {
  const validationError = validate(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { vertical, country, subject, sportType, accentColor, scenePrompt, bannerText, plashkaStyle, line3 } = req.body;

  try {
    const { systemPrompt, userPrompt } = buildPrompt({ vertical, country, subject, sportType, accentColor, scenePrompt });

    const imageBuffer = await generateImage({ systemPrompt, userPrompt });

    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;
    const finalUrl = buildOverlayUrl(publicId, {
      accentColor,
      plashkaStyle,
      line1: null,
      line2: bannerText.trim(),
      line3: line3?.trim() || null,
    });

    const { rows } = await pool.query(
      `INSERT INTO generations
         (prompt, banner_text, cloudinary_public_id, final_url, status,
          vertical, country, subject, sport_type, accent_color, scene_prompt,
          plashka_style, line3)
       VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        userPrompt, bannerText.trim(), publicId, finalUrl,
        vertical, country, subject,
        vertical === 'sport' ? (sportType || null) : null,
        accentColor, scenePrompt?.trim() || null,
        plashkaStyle, line3?.trim() || null,
      ]
    );
    const generation = rows[0];

    const tgCaption = `🎨 <b>New banner</b>\n${vertical} · ${country} · ${subject}${sportType ? ` · ${sportType}` : ''}\nBanner: ${bannerText.trim()}`;
    sendPhotoUrl(finalUrl, tgCaption).catch((err) => console.error('Telegram send failed:', err.message));

    res.json({ generation });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/confirm', async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE generations SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json({ generation: rows[0] });
});

router.post('/:id/regenerate', async (req, res) => {
  const { rows: orig } = await pool.query('SELECT * FROM generations WHERE id = $1', [req.params.id]);
  if (!orig.length) return res.status(404).json({ error: 'Not found' });

  const g = orig[0];

  try {
    let systemPrompt, userPrompt;

    if (g.vertical && g.country && g.subject && g.accent_color) {
      ({ systemPrompt, userPrompt } = buildPrompt({
        vertical: g.vertical,
        country: g.country,
        subject: g.subject,
        sportType: g.sport_type,
        accentColor: g.accent_color,
        scenePrompt: g.scene_prompt,
      }));
    } else {
      // fallback for rows created before the schema migration
      systemPrompt = '';
      userPrompt = g.prompt;
    }

    const imageBuffer = await generateImage({ systemPrompt, userPrompt });
    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;
    const finalUrl = buildOverlayUrl(publicId, {
      accentColor: g.accent_color || 'cyan',
      plashkaStyle: g.plashka_style || 'filled',
      line1: null,
      line2: g.banner_text,
      line3: g.line3 || null,
    });

    const { rows } = await pool.query(
      `INSERT INTO generations
         (prompt, banner_text, cloudinary_public_id, final_url, status,
          vertical, country, subject, sport_type, accent_color, scene_prompt,
          plashka_style, line3)
       VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [userPrompt, g.banner_text, publicId, finalUrl, g.vertical, g.country, g.subject, g.sport_type, g.accent_color, g.scene_prompt, g.plashka_style, g.line3]
    );
    const generation = rows[0];

    sendPhotoUrl(finalUrl, `♻️ <b>Regenerated</b>\n${g.vertical ?? ''} · ${g.banner_text}`)
      .catch((err) => console.error('Telegram send failed:', err.message));

    res.json({ generation });
  } catch (err) {
    console.error('Regeneration error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
