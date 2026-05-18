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

  // ── LAYER 0 — Per-color badges panel (Google Play + App Store, gravity south) ─
  const framePublicId = framePublicIds?.[accentColor];
  if (framePublicId) {
    t.push({
      overlay: cldId(framePublicId),
      gravity: 'south',
      width: 1.0,
      flags: 'relative',
    });
    t.push({ flags: 'layer_apply' });
  }

  // ── LAYER 2 — Logo (top center) ──────────────────────────────────────────────
  if (logoPublicId) {
    t.push({
      overlay: cldId(logoPublicId),
      gravity: 'north',
      width: 260,
      y: 55,
    });
    t.push({ flags: 'layer_apply' });
  }

  // ── LAYER 3 — Line 1: plain white text (Oswald Bold 700 / Cairo Bold) ────────
  if (line1?.trim()) {
    t.push({
      overlay: {
        font_family: pickFont(line1),
        font_size: 64,
        font_weight: 'bold',
        text: line1.trim(),
      },
      color: 'rgb:ffffff',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 150 });
  }

  // ── LAYER 4 — Line 2: plashka, −5° tilt (Oswald ExtraBold / Cairo ExtraBold) ─
  if (line2?.trim()) {
    const step = {
      overlay: {
        font_family: pickFont(line2),
        font_size: 84,
        font_weight: 'extrabold',
        text: line2.trim(),
      },
      radius: 28,
      angle: -5,   // slight counterclockwise tilt, matching example
    };

    if (plashkaStyle === 'bordered') {
      step.color = 'rgb:ffffff';
      step.background = 'rgb:0d0d0d';
      step.border = `5px_solid_rgb:${hex}`;
    } else {
      step.color = `rgb:${textHex}`;
      step.background = `rgb:${hex}`;
      step.border = `20px_solid_rgb:${hex}`;
    }

    t.push(step);
    t.push({ flags: 'layer_apply', gravity: 'north', y: 245 });
  }

  // ── LAYER 5 — Line 3: pill (Cairo Bold — works for Arabic + Latin numbers) ───
  if (line3?.trim()) {
    t.push({
      overlay: {
        font_family: 'Cairo',
        font_size: 54,
        font_weight: 'bold',
        text: line3.trim(),
      },
      color: `rgb:${hex}`,
      background: 'rgb:111111',
      border: `3px_solid_rgb:${hex}`,
      radius: 24,
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 370 });
  }

  return cloudinary.url(imagePublicId, {
    transformation: t,
    format: 'jpg',
    secure: true,
  });
}

module.exports = { uploadImage, uploadAsset, buildOverlayUrl };
