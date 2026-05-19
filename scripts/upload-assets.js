/**
 * Uploads logo, frame badges, and plashka SVGs to Cloudinary.
 *
 * File layout:
 *   assets/logo.png
 *   assets/frame-cyan.svg / .png   (app store badge panels)
 *   assets/frame-green.svg / .png
 *   assets/frame-purple.svg / .png
 *   assets/frame-gold.svg / .png
 *   assets/plashkas/plashka-[a|b|c]-[cyan|green|purple|gold].svg
 *
 * Usage:
 *   node scripts/generate-plashka-svgs.js   ← generate plashkas first
 *   npm run upload-assets                    ← then upload everything
 */
require('dotenv').config();
const { uploadAsset } = require('../services/cloudinary');
const path = require('path');
const fs   = require('fs');

const COLORS = ['cyan', 'green', 'purple', 'gold'];
const STYLES = ['a', 'b', 'c'];

const ASSETS = [
  { file: 'assets/logo.png', publicId: 'banner-gen/logo', envVar: 'CLOUDINARY_LOGO_PUBLIC_ID' },
  ...COLORS.map((c) => ({
    file:     `assets/frame-${c}.svg`,
    publicId: `banner-gen/frame-${c}`,
    envVar:   `CLOUDINARY_FRAME_${c.toUpperCase()}_PUBLIC_ID`,
  })),
  ...STYLES.flatMap((s) =>
    COLORS.map((c) => ({
      file:     `assets/plashkas/plashka-${s}-${c}.svg`,
      publicId: `banner-gen/plashka-${s}-${c}`,
      envVar:   `CLOUDINARY_PLASHKA_${s.toUpperCase()}_${c.toUpperCase()}_PUBLIC_ID`,
    }))
  ),
];

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
