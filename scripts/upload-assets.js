/**
 * One-time script to upload logo and promo frame SVG to Cloudinary.
 * Usage:
 *   1. Place your files as: assets/logo.png and assets/promo-frame.svg
 *   2. Copy .env.example to .env and fill in Cloudinary credentials
 *   3. Run: npm run upload-assets
 *
 * The script will print the public_ids — paste them into .env as:
 *   CLOUDINARY_LOGO_PUBLIC_ID=...
 *   CLOUDINARY_FRAME_PUBLIC_ID=...
 */
require('dotenv').config();
const { uploadAsset } = require('../services/cloudinary');
const path = require('path');
const fs = require('fs');

const ASSETS = [
  { file: 'assets/logo.png', publicId: 'banner-gen/logo' },
  { file: 'assets/promo-frame.svg', publicId: 'banner-gen/promo-frame' },
];

async function run() {
  for (const { file, publicId } of ASSETS) {
    const fullPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Missing: ${file} — skipping`);
      continue;
    }
    console.log(`Uploading ${file}...`);
    const result = await uploadAsset(fullPath, publicId);
    console.log(`✅ Uploaded: public_id = ${result.public_id}`);
    console.log(`   URL: ${result.secure_url}\n`);
  }
  console.log('Done. Update .env with the public_ids above.');
}

run().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
