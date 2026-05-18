require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/generate', require('./routes/generate'));
app.use('/api/generations', require('./routes/generations'));

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

initDb()
  .then(() => app.listen(PORT, () => console.log(`Banner Gen running on :${PORT}`)))
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });
