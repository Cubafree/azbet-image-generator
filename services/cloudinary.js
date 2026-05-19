const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_CONFIG } = require('../config');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ACCENT_MAP = {
  cyan:   { hex: '00d4ff', textHex: '000000' },
  green:  { hex: '00e676', textHex: '000000' },
  purple: { hex: '8b5cf6', textHex: 'ffffff' },
  gold:   { hex: 'ffd700', textHex: '000000' },
};

// Image sizes (px) — must match OpenAI output
const IMG_W = 1024;
const IMG_H = 1536;

// Overlay coordinates (derived from Figma AL-17 frame 1080×1920, scaled 0.948× / 0.8×)
const Y = {
  logo:       55,   // logo top from north
  line1:      220,  // line1 text top from north
  plashka:    275,  // SVG plashka top from north (346.8 × 0.8 ≈ 277, rounded)
  // line2 text centred on 100px plashka: 275 + 50 - 30 = 295
  line2Text:  295,
  // line3 text centred on pill (100 + 12 gap + 34 pill_half): 275 + 146 - 24 = 397
  line3Text:  397,
};

// SVG plashka width (matches generate-plashka-svgs.js)
const PLASHKA_SVG_W = 750;

// Arabic Unicode → Cairo; Latin/digits → Oswald
function pickFont(text) {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text) ? 'Cairo' : 'Oswald';
}

function cldId(publicId) {
  return publicId.replace(/\//g, ':');
}

// plashkaStyle: 'filled' | 'bordered'
// hasLine3: bool
// → 'a' (filled+pill) | 'b' (filled) | 'c' (bordered)
function plashkaType(plashkaStyle, hasLine3) {
  if (plashkaStyle === 'bordered') return 'c';
  return hasLine3 ? 'a' : 'b';
}

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
    public_id:     publicId,
    resource_type: 'image',
    overwrite:     true,
    invalidate:    true,  // purge CDN cache on overwrite
  });
}

function buildOverlayUrl(imagePublicId, params) {
  const {
    accentColor  = 'cyan',
    plashkaStyle = 'filled',
    line1        = null,
    line2        = null,
    line3        = null,
  } = params;

  const { hex, textHex } = ACCENT_MAP[accentColor] || ACCENT_MAP.cyan;
  const { logoPublicId, framePublicIds, plashkaPublicIds } = CLOUDINARY_CONFIG;

  const t = [];

  // ── LAYER 0 — App-store badge panel (south, 60% width, lifted) ───────────
  const frameId = framePublicIds?.[accentColor];
  if (frameId) {
    t.push({ overlay: cldId(frameId), width: 614 });
    t.push({ flags: 'layer_apply', gravity: 'south', y: 80 });
  }

  // ── LAYER 1 — Logo (top centre) ──────────────────────────────────────────
  if (logoPublicId) {
    t.push({ overlay: cldId(logoPublicId), width: 240 });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.logo });
  }

  // ── LAYER 2 — Line 1: plain white text ───────────────────────────────────
  if (line1?.trim()) {
    t.push({
      overlay: {
        font_family: pickFont(line1),
        font_size:   52,
        font_weight: 'bold',
        text:        line1.trim(),
      },
      color: 'rgb:ffffff',
      width: 900,
      crop:  'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.line1 });
  }

  // ── LAYER 3 — SVG plashka background ─────────────────────────────────────
  if (line2?.trim()) {
    const type    = plashkaType(plashkaStyle, !!line3?.trim());
    const plashId = plashkaPublicIds?.[type]?.[accentColor];

    if (plashId) {
      t.push({ overlay: cldId(plashId), width: PLASHKA_SVG_W });
      t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.plashka });
    }

    // ── LAYER 4 — Line 2 text on top of plashka ────────────────────────────
    const line2Color = plashkaStyle === 'bordered' ? 'ffffff' : textHex;
    t.push({
      overlay: {
        font_family: pickFont(line2),
        font_size:   58,
        font_weight: 'bold',
        text:        line2.trim(),
      },
      letter_spacing: 1,
      color: `rgb:${line2Color}`,
      width: PLASHKA_SVG_W - 40,
      crop:  'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.line2Text });
  }

  // ── LAYER 5 — Line 3 text on top of pill (only for style A) ─────────────
  if (line3?.trim() && plashkaStyle !== 'bordered') {
    t.push({
      overlay: {
        font_family: 'Cairo',
        font_size:   44,
        font_weight: 'bold',
        text:        line3.trim(),
      },
      color: `rgb:${hex}`,
      width: 420,
      crop:  'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.line3Text });
  }

  return cloudinary.url(imagePublicId, {
    transformation: t,
    format:         'jpg',
    secure:         true,
  });
}

module.exports = { uploadImage, uploadAsset, buildOverlayUrl };
