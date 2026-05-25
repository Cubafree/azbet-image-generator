const express = require('express');
const router  = express.Router();
const { pool } = require('../db');
const { generateImage } = require('../services/openai');
const { uploadImage, buildOverlayUrl } = require('../services/cloudinary');
const { sendPhotoUrl } = require('../services/telegram');
const { buildPrompt } = require('../promptBuilder');

const VALID = {
  vertical:    ['casino', 'sport'],
  country:     ['egypt', 'morocco', 'algeria', 'libya'],
  subject:     ['woman', 'man', 'object'],
  sportType:   ['football', 'tennis', 'basketball', 'general'],
  accentColor: ['cyan', 'green', 'purple', 'gold'],
  imageSize:   ['portrait', 'square'],
};

function validate(body) {
  const { vertical, country, subject, sportType, accentColor, plashkaStyle, imageSize, variants, line2, noText } = body;
  if (!VALID.vertical.includes(vertical))       return `vertical must be one of: ${VALID.vertical.join(', ')}`;
  if (!VALID.country.includes(country))         return `country must be one of: ${VALID.country.join(', ')}`;
  if (!VALID.subject.includes(subject))         return `subject must be one of: ${VALID.subject.join(', ')}`;
  if (!VALID.accentColor.includes(accentColor)) return `accentColor must be one of: ${VALID.accentColor.join(', ')}`;
  if (imageSize && !VALID.imageSize.includes(imageSize)) return `imageSize must be one of: ${VALID.imageSize.join(', ')}`;
  if (vertical === 'sport' && subject !== 'object' && !VALID.sportType.includes(sportType)) {
    return `sportType must be one of: ${VALID.sportType.join(', ')} when vertical=sport and subject≠object`;
  }
  // line2 not required in noText mode
  if (!noText) {
    const hasLine2 = (variants && variants.length > 0)
      ? variants.some(v => v.line2?.trim())
      : !!line2?.trim();
    if (!hasLine2) return 'line2 is required';
  }
  if (!['filled', 'bordered'].includes(plashkaStyle)) return 'plashkaStyle must be filled or bordered';
  return null;
}

function log(label, data) {
  console.log(`[${new Date().toISOString()}] ${label}`, JSON.stringify(data, null, 2));
}

router.post('/', async (req, res) => {
  const validationError = validate(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const {
    vertical, country, subject, sportType, accentColor,
    scenePrompt, plashkaStyle,
    imageSize  = 'portrait',
    fontFamily = 'Oswald',
    fontSize   = {},
    customY    = {},
    variants   = null,
    noText     = false,
    // legacy single-variant fields (fallback)
    line1, line2, line3,
  } = req.body;

  // noText mode: one variant with no text overlay (logo + frame only)
  const textVariants = noText
    ? [{ line1: null, line2: null, line3: null }]
    : (variants && variants.length > 0)
        ? variants.filter(v => v.line2?.trim())
        : [{ line1: line1?.trim() || null, line2: line2?.trim() || '', line3: line3?.trim() || null }];

  log('GENERATE request', {
    vertical, country, subject, sportType, accentColor, plashkaStyle, imageSize, fontFamily,
    noText, variantCount: textVariants.length,
  });

  try {
    const { systemPrompt, userPrompt } = buildPrompt({ vertical, country, subject, sportType, accentColor, scenePrompt });
    log('PROMPT built', { userPromptLength: userPrompt.length });

    const imageBuffer = await generateImage({ systemPrompt, userPrompt, imageSize });
    log('IMAGE generated', { bytes: imageBuffer.length, imageSize });

    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;
    log('IMAGE uploaded', { publicId });

    const generations = [];

    for (const v of textVariants) {
      const overlayParams = {
        accentColor,
        plashkaStyle,
        line1:      v.line1?.trim() || null,
        line2:      v.line2.trim(),
        line3:      v.line3?.trim() || null,
        fontFamily,
        fontSize,
        imageSize,
        customY,
      };
      const finalUrl = buildOverlayUrl(publicId, overlayParams);
      log('OVERLAY URL built', { line2: v.line2.trim(), finalUrl });

      const { rows } = await pool.query(
        `INSERT INTO generations
           (prompt, banner_text, cloudinary_public_id, final_url, status,
            vertical, country, subject, sport_type, accent_color, scene_prompt,
            plashka_style, line1, line2, line3, image_size, font_family)
         VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
        [
          userPrompt, v.line2.trim(), publicId, finalUrl,
          vertical, country, subject,
          vertical === 'sport' ? (sportType || null) : null,
          accentColor, scenePrompt?.trim() || null,
          plashkaStyle, v.line1?.trim() || null, v.line2.trim(), v.line3?.trim() || null,
          imageSize, fontFamily,
        ]
      );
      generations.push(rows[0]);
      log('DB saved', { id: rows[0].id });
    }

    // Send all to Telegram
    for (let i = 0; i < generations.length; i++) {
      const g       = generations[i];
      const varTag  = generations.length > 1 ? ` (${i + 1}/${generations.length})` : '';
      const caption = `🎨 <b>New banner</b>${varTag}\n${vertical} · ${country} · ${subject}${sportType ? ` · ${sportType}` : ''} · ${imageSize}\nLine2: ${g.line2}`;
      sendPhotoUrl(g.final_url, caption).catch(err => console.error('[TG] send failed:', err.message));
    }

    res.json({ generations });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] GENERATE error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/confirm', async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE generations SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  log('CONFIRMED', { id: req.params.id });
  res.json({ generation: rows[0] });
});

router.post('/:id/regenerate', async (req, res) => {
  const { rows: orig } = await pool.query('SELECT * FROM generations WHERE id = $1', [req.params.id]);
  if (!orig.length) return res.status(404).json({ error: 'Not found' });

  const g = orig[0];
  log('REGENERATE request', { id: g.id, accentColor: g.accent_color, plashkaStyle: g.plashka_style, imageSize: g.image_size });

  try {
    let systemPrompt, userPrompt;

    if (g.vertical && g.country && g.subject && g.accent_color) {
      ({ systemPrompt, userPrompt } = buildPrompt({
        vertical:    g.vertical,
        country:     g.country,
        subject:     g.subject,
        sportType:   g.sport_type,
        accentColor: g.accent_color,
        scenePrompt: g.scene_prompt,
      }));
    } else {
      systemPrompt = '';
      userPrompt   = g.prompt;
    }

    const imageSize  = g.image_size  || 'portrait';
    const fontFamily = g.font_family || 'Oswald';

    const imageBuffer = await generateImage({ systemPrompt, userPrompt, imageSize });
    const uploadResult = await uploadImage(imageBuffer);
    const publicId = uploadResult.public_id;
    log('REGENERATE image uploaded', { publicId });

    const overlayParams = {
      accentColor:  g.accent_color  || 'cyan',
      plashkaStyle: g.plashka_style || 'filled',
      line1:        g.line1         || null,
      line2:        g.line2         || g.banner_text,
      line3:        g.line3         || null,
      fontFamily,
      imageSize,
      customY: {},
    };
    const finalUrl = buildOverlayUrl(publicId, overlayParams);
    log('REGENERATE overlay URL', { finalUrl });

    const { rows } = await pool.query(
      `INSERT INTO generations
         (prompt, banner_text, cloudinary_public_id, final_url, status,
          vertical, country, subject, sport_type, accent_color, scene_prompt,
          plashka_style, line1, line2, line3, image_size, font_family)
       VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [
        userPrompt, g.line2 || g.banner_text, publicId, finalUrl,
        g.vertical, g.country, g.subject, g.sport_type,
        g.accent_color, g.scene_prompt, g.plashka_style,
        g.line1 || null, g.line2 || g.banner_text, g.line3,
        imageSize, fontFamily,
      ]
    );
    const generation = rows[0];

    sendPhotoUrl(finalUrl, `♻️ <b>Regenerated</b>\n${g.vertical ?? ''} · ${g.line2 || g.banner_text}`)
      .catch(err => console.error('[TG] send failed:', err.message));

    res.json({ generation });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] REGENERATE error:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
