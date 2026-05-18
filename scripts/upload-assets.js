/**
 * One-time script to upload logo and per-color bottom frames to Cloudinary.
 *
 * File layout expected in ./assets/:
 *   assets/logo.png
 *   assets/frame-cyan.svg    (or .png)
 *   assets/frame-green.svg
 *   assets/frame-purple.svg
 *   assets/frame-gold.svg
 *
 * Usage:
 *   1. Copy .env.example → .env and fill in Cloudinary credentials
 *   2. Place files in ./assets/
 *   3. Run: npm run upload-assets
 *
 * The script prints the public_ids — paste them into Railway Variables.
 */
require('dotenv').config();
const { uploadAsset } = require('../services/cloudinary');
const path = require('path');
const fs = require('fs');

const ASSETS = [
  { file: 'assets/logo.png',           publicId: 'banner-gen/logo',          envVar: 'CLOUDINARY_LOGO_PUBLIC_ID' },
  { file: 'assets/frame-cyan.svg',    publicId: 'banner-gen/frame-cyan',    envVar: 'CLOUDINARY_FRAME_CYAN_PUBLIC_ID' },
  { file: 'assets/frame-green.svg',   publicId: 'banner-gen/frame-green',   envVar: 'CLOUDINARY_FRAME_GREEN_PUBLIC_ID' },
  { file: 'assets/frame-purple.svg',  publicId: 'banner-gen/frame-purple',  envVar: 'CLOUDINARY_FRAME_PURPLE_PUBLIC_ID' },
  { file: 'assets/frame-gold.svg',    publicId: 'banner-gen/frame-gold',    envVar: 'CLOUDINARY_FRAME_GOLD_PUBLIC_ID' },
];

// Also try .png fallback for frames
function resolveFile(base) {
  const full = path.join(__dirname, '..', base);
  if (fs.existsSync(full)) return full;
  const png = full.replace(/\.svg$/, '.png');
  if (fs.existsSync(png)) return png;
  return null;
}

async function run() {
  console.log('\n── Cloudinary Asset Upload ──────────────────\n');
  const results = [];

  for (const { file, publicId, envVar } of ASSETS) {
    const fullPath = resolveFile(file);
    if (!fullPath) {
      console.warn(`⚠️  Пропущено (файл не найден): ${file}`);
      continue;
    }
    process.stdout.write(`Загружаю ${path.basename(fullPath)}… `);
    const result = await uploadAsset(fullPath, publicId);
    console.log(`✅ ${result.public_id}`);
    results.push({ envVar, value: result.public_id });
  }

  if (results.length) {
    console.log('\n── Добавь в Railway Variables ───────────────\n');
    results.forEach(({ envVar, value }) => console.log(`${envVar}=${value}`));
  }
  console.log('\nГотово.\n');
}

run().catch((err) => {
  console.error('\n❌ Ошибка:', err.message);
  process.exit(1);
});
