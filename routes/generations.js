const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const PAGE_SIZE = 50;

router.get('/', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));
  const offset = (page - 1) * limit;

  const [{ rows }, { rows: countRows }] = await Promise.all([
    pool.query('SELECT * FROM generations ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
    pool.query('SELECT COUNT(*)::int AS total FROM generations'),
  ]);

  res.json({ generations: rows, total: countRows[0].total, page, limit });
});

module.exports = router;
