const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS generations (
      id SERIAL PRIMARY KEY,
      prompt TEXT NOT NULL,
      banner_text TEXT NOT NULL,
      cloudinary_public_id TEXT,
      final_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      confirmed_at TIMESTAMPTZ
    )
  `);
  await pool.query(`
    ALTER TABLE generations
      ADD COLUMN IF NOT EXISTS vertical TEXT,
      ADD COLUMN IF NOT EXISTS country TEXT,
      ADD COLUMN IF NOT EXISTS subject TEXT,
      ADD COLUMN IF NOT EXISTS sport_type TEXT,
      ADD COLUMN IF NOT EXISTS accent_color TEXT,
      ADD COLUMN IF NOT EXISTS scene_prompt TEXT,
      ADD COLUMN IF NOT EXISTS plashka_style TEXT,
      ADD COLUMN IF NOT EXISTS line1 TEXT,
      ADD COLUMN IF NOT EXISTS line2 TEXT,
      ADD COLUMN IF NOT EXISTS line3 TEXT
  `);
  console.log('DB ready');
}

module.exports = { pool, initDb };
