/**
 * Retroactively rebuild final_url for all existing generations.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/rebuild-urls.js [--dry-run]
 *
 * What it does:
 *   - Fetches every row from `generations`
 *   - Rebuilds final_url via buildOverlayUrl (picks up any new Cloudinary transforms)
 *   - Updates the row if the URL changed
 *
 * Stored columns used: cloudinary_public_id, accent_color, plashka_style,
 *   line1, line2, line3, font_family, image_size.
 * Columns NOT stored (use defaults): customY={}, customW={}, noFrame=false, presetBanner=false.
 */

require('dotenv').config();
const { Pool } = require('pg');
const { buildOverlayUrl } = require('../services/cloudinary');

const DRY_RUN = process.argv.includes('--dry-run');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function main() {
  const { rows } = await pool.query(
    `SELECT id, cloudinary_public_id, accent_color, plashka_style,
            line1, line2, line3, font_family, image_size, final_url, country
     FROM generations
     WHERE image_size = 'portrait' OR image_size IS NULL
     ORDER BY id`
  );

  console.log(`Found ${rows.length} rows. DRY_RUN=${DRY_RUN}\n`);

  let updated = 0;
  let skipped = 0;
  let errors  = 0;

  for (const g of rows) {
    try {
      const newUrl = buildOverlayUrl(g.cloudinary_public_id, {
        accentColor:  g.accent_color  || 'cyan',
        plashkaStyle: g.plashka_style || 'filled',
        line1:        g.line1         || null,
        line2:        g.line2         || null,
        line3:        g.line3         || null,
        fontFamily:   g.font_family   || 'Oswald',
        imageSize:    g.image_size    || 'portrait',
        country:      g.country       || null,
        customY:      {},
        customW:      {},
        noFrame:      false,
        presetBanner: false,
      });

      if (newUrl === g.final_url) {
        skipped++;
        continue;
      }

      if (!DRY_RUN) {
        await pool.query(
          'UPDATE generations SET final_url = $1 WHERE id = $2',
          [newUrl, g.id]
        );
      }

      console.log(`[${DRY_RUN ? 'DRY' : 'OK'}] id=${g.id} (${g.image_size || 'portrait'})`);
      if (DRY_RUN) {
        console.log(`  OLD: ${g.final_url}`);
        console.log(`  NEW: ${newUrl}`);
      }
      updated++;
    } catch (err) {
      console.error(`[ERR] id=${g.id}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped} errors=${errors}`);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
