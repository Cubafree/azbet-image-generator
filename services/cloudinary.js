const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_CONFIG } = require('../config');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ACCENT_MAP = {
  cyan:   { hex: '00d4ff', textHex: '000000' },
  green:  { hex: '00e676', textHex: '000000' },
  purple: { hex: '8b5cf6', textHex: 'ffffff' },
  gold:   { hex: 'ffd700', textHex: '000000' },
};

async function uploadImage(buffer, folder = 'banner-gen/generated') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', format: 'jpg' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function uploadAsset(filePath, publicId) {
  return cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
  });
}

// Arabic Unicode range → Cairo; Latin/digits → Oswald
function pickFont(text) {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text)
    ? 'Cairo'
    : 'Oswald';
}

function cldId(publicId) {
  return publicId.replace(/\//g, ':');
}

function buildOverlayUrl(imagePublicId, params) {
  const {
    accentColor = 'cyan',
    plashkaStyle = 'filled',
    line1 = null,
    line2 = null,
    line3 = null,
  } = params;

  const { hex, textHex } = ACCENT_MAP[accentColor] || ACCENT_MAP.cyan;
  const { logoPublicId, framePublicIds } = CLOUDINARY_CONFIG;

  const t = [];

  // ── LAYER 0 — Per-color badges panel (gravity south, 60% width, lifted) ──────
  const framePublicId = framePublicIds?.[accentColor];
  if (framePublicId) {
    t.push({ overlay: cldId(framePublicId), width: 614 });
    t.push({ flags: 'layer_apply', gravity: 'south', y: 80 });
  }

  // ── LAYER 1 — Logo (top center) ──────────────────────────────────────────────
  if (logoPublicId) {
    t.push({ overlay: cldId(logoPublicId), width: 240 });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 55 });
  }

  // ── LAYER 2 — Line 1: plain white text (Oswald Bold 700 / Cairo Bold) ────────
  if (line1?.trim()) {
    t.push({
      overlay: {
        font_family: pickFont(line1),
        font_size: 52,
        font_weight: 'bold',
        text: line1.trim(),
      },
      color: 'rgb:ffffff',
      width: 900,
      crop: 'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 185 });
  }

  // ── LAYER 3 — Line 2: plashka, −5° tilt, auto-width (Oswald ExtraBold / Cairo ExtraBold) ─
  if (line2?.trim()) {
    const step = {
      overlay: {
        font_family: pickFont(line2),
        font_size: 68,
        font_weight: 'extrabold',
        letter_spacing: 2,
        text: line2.trim(),
      },
      radius: 20,
      angle: -5,
    };

    if (plashkaStyle === 'bordered') {
      step.color = 'rgb:ffffff';
      step.background = 'rgb:0d0d0d';
      step.border = `5px_solid_rgb:${hex}`;
    } else {
      step.color = `rgb:${textHex}`;
      step.background = `rgb:${hex}`;
      step.border = `10px_solid_rgb:${hex}`;
    }

    t.push(step);
    t.push({ flags: 'layer_apply', gravity: 'north', y: 300 });
  }

  // ── LAYER 4 — Line 3: pill, auto-width, centered (Cairo Bold) ────────────────
  if (line3?.trim()) {
    t.push({
      overlay: {
        font_family: 'Cairo',
        font_size: 48,
        font_weight: 'bold',
        text_align: 'center',
        text: line3.trim(),
      },
      color: `rgb:${hex}`,
      background: 'rgb:111111',
      border: `3px_solid_rgb:${hex}`,
      radius: 24,
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 440 });
  }

  return cloudinary.url(imagePublicId, {
    transformation: t,
    format: 'jpg',
    secure: true,
  });
}

module.exports = { uploadImage, uploadAsset, buildOverlayUrl };
