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

function buildOverlayUrl(imagePublicId, params) {
  const {
    accentColor = 'cyan',
    plashkaStyle = 'filled',
    line1 = null,
    line2 = null,
    line3 = null,
  } = params;

  const { hex, textHex } = ACCENT_MAP[accentColor] || ACCENT_MAP.cyan;
  const font = CLOUDINARY_CONFIG.textFont || 'Arial';
  const { logoPublicId } = CLOUDINARY_CONFIG;

  const t = []; // transformation steps

  // ── LAYER 1 — Line 1: plain white text, no background ──────────────────────
  if (line1?.trim()) {
    t.push({
      overlay: { font_family: font, font_size: 60, font_weight: 'bold', text: line1.trim() },
      color: 'rgb:ffffff',
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 120 });
  }

  // ── LAYER 2 — Line 2: plashka (filled or bordered) ─────────────────────────
  if (line2?.trim()) {
    const step = {
      overlay: { font_family: font, font_size: 72, font_weight: 'bold', text: line2.trim() },
      radius: 30,
      angle: -4,
    };

    if (plashkaStyle === 'bordered') {
      step.color = 'rgb:ffffff';
      step.background = 'rgb:0d0d0d';
      step.border = `5px_solid_rgb:${hex}`;
    } else {
      // filled (default)
      step.color = `rgb:${textHex}`;
      step.background = `rgb:${hex}`;
      step.border = `22px_solid_rgb:${hex}`;
    }

    t.push(step);
    t.push({ flags: 'layer_apply', gravity: 'north', y: 210 });
  }

  // ── LAYER 3 — Line 3: pill (optional) ──────────────────────────────────────
  if (line3?.trim()) {
    t.push({
      overlay: { font_family: font, font_size: 48, font_weight: 'bold', text: line3.trim() },
      color: `rgb:${hex}`,
      background: 'rgb:111111',
      border: `3px_solid_rgb:${hex}`,
      radius: 25,
    });
    t.push({ flags: 'layer_apply', gravity: 'north', y: 320 });
  }

  // ── LAYER 4 — Logo ──────────────────────────────────────────────────────────
  if (logoPublicId) {
    t.push({
      overlay: logoPublicId.replace(/\//g, ':'),
      gravity: 'north',
      width: 320,
      y: 40,
      flags: 'relative',
    });
    t.push({ flags: 'layer_apply' });
  }

  return cloudinary.url(imagePublicId, {
    transformation: t,
    format: 'jpg',
    secure: true,
  });
}

module.exports = { uploadImage, uploadAsset, buildOverlayUrl };
