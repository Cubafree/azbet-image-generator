const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM generations ORDER BY created_at DESC LIMIT 100'
  );
  res.json({ generations: rows });
});

module.exports = router;
