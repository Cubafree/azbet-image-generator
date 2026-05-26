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

// Default overlay positions per image format
// plashka / logo / line1 are Y from north; frameY is distance from south
// Landscape values are in 4096×2286 coordinate space (overlayScale=4 applied to widths)
const POSITION_DEFAULTS = {
  portrait:  { logo: 55,  line1: 220, plashka: 275, frameY: 80  },
  square:    { logo: 40,  line1: 150, plashka: 185, frameY: 60  },
  landscape: { logo: 82,  line1: 327, plashka: 409, frameY: 119 },
};

// SVG plashka dimensions (matches generate-plashka-svgs.js)
const PLASHKA_W  = 680;
const PLASHKA_H  = 100;
const GAP        = 6;    // gap between plashka bottom and pill top
const PILL_H     = 68;

// Build the full Y lookup, deriving text positions from plashkaTop
// os = overlay scale (4 for landscape, 1 otherwise) — scales plashka/pill heights
function buildY(imageSize, customY = {}) {
  const d  = POSITION_DEFAULTS[imageSize] || POSITION_DEFAULTS.portrait;
  const os = imageSize === 'landscape' ? 4 : 1;
  const plashkaTop = customY.plashka ?? d.plashka;
  return {
    logo:      customY.logo    ?? d.logo,
    line1:     customY.line1   ?? d.line1,
    plashka:   plashkaTop,
    // text vertically centred inside plashka
    line2Text: plashkaTop + Math.round((PLASHKA_H * os) / 2) - Math.round(29 * os),
    // text centred in pill: plashka_bottom + gap + pill_half − font_half
    line3Text: plashkaTop + PLASHKA_H * os + GAP * os + Math.round((PILL_H * os) / 2) - Math.round(22 * os),
    frameY:    customY.frameY  ?? d.frameY,
  };
}

// Arabic Unicode range → Cairo; everything else → caller-supplied display font
function pickFont(text, displayFont = 'Oswald') {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text) ? 'Cairo' : displayFont;
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
    invalidate:    true,
  });
}

function buildOverlayUrl(imagePublicId, params) {
  const {
    accentColor  = 'cyan',
    plashkaStyle = 'filled',
    line1        = null,
    line2        = null,
    line3        = null,
    fontFamily   = 'Oswald',
    fontSize     = {},
    imageSize    = 'portrait',
    customY      = {},
  } = params;

  const { hex, textHex } = ACCENT_MAP[accentColor] || ACCENT_MAP.cyan;
  const { logoPublicId, framePublicIds, plashkaPublicIds } = CLOUDINARY_CONFIG;

  // Landscape (4096×2286) scales all overlay dimensions by 4 vs the 1024-base formats
  const os = imageSize === 'landscape' ? 4 : 1;

  const Y = buildY(imageSize, customY);

  const fs1 = fontSize.line1 || 52 * os;
  const fs2 = fontSize.line2 || 58 * os;
  const fs3 = fontSize.line3 || 44 * os;

  const t = [];

  // ── STEP 0 — Resize to final canvas (landscape only) ─────────────────────────
  if (imageSize === 'landscape') {
    t.push({ width: 4096, height: 2286, crop: 'fill', gravity: 'center' });
  }

  // ── LAYER 0 — App-store badge panel (south) ──────────────────────────────────
  const frameId = framePublicIds?.[accentColor];
  if (frameId) {
    t.push({ overlay: cldId(frameId), width: 614 * os });
    t.push({ flags: 'layer_apply', gravity: 'south', y: Y.frameY });
  }

  // ── LAYER 1 — Logo (top centre) ──────────────────────────────────────────────
  if (logoPublicId) {
    t.push({ overlay: cldId(logoPublicId), width: 240 * os });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.logo });
  }

  // ── LAYER 2 — Line 1: plain white text ───────────────────────────────────────
  if (line1?.trim()) {
    t.push({
      overlay: {
        font_family: pickFont(line1, fontFamily),
        font_size:   fs1,
        font_weight: 'bold',
        text:        line1.trim(),
      },
      color: 'rgb:ffffff',
      width: 900 * os,
      crop:  'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.line1 });
  }

  // ── LAYER 3 — SVG plashka background ─────────────────────────────────────────
  if (line2?.trim()) {
    const type    = plashkaType(plashkaStyle, !!line3?.trim());
    const plashId = plashkaPublicIds?.[type]?.[accentColor];

    if (plashId) {
      t.push({ overlay: cldId(plashId), width: PLASHKA_W * os });
      t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.plashka });
    }

    // ── LAYER 4 — Line 2 text on plashka ─────────────────────────────────────
    const line2Color = plashkaStyle === 'bordered' ? 'ffffff' : textHex;
    t.push({
      overlay: {
        font_family: pickFont(line2, fontFamily),
        font_size:   fs2,
        font_weight: 'bold',
        text:        line2.trim(),
      },
      letter_spacing: 1,
      color: `rgb:${line2Color}`,
      width: (PLASHKA_W - 40) * os,
      crop:  'fit',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', x: 0, y: Y.line2Text });
  }

  // ── LAYER 5 — Line 3 text on pill (style A only) ─────────────────────────────
  if (line3?.trim() && plashkaStyle !== 'bordered') {
    t.push({
      overlay: {
        font_family: 'Cairo',
        font_size:   fs3,
        font_weight: 'bold',
        text:        line3.trim(),
      },
      color: `rgb:${hex}`,
      width: 420 * os,
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
