require('dotenv').config();
const express   = require('express');
const path      = require('path');
const { initDb } = require('./db');
const apiKeyAuth = require('./middleware/auth');
const basicAuth  = require('./middleware/basicAuth');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Public — no auth
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'banner-gen' }));

// Everything else requires Basic Auth (ADMIN_USER / ADMIN_PASSWORD env vars)
app.use(basicAuth);

app.use(express.static(path.join(__dirname, 'public')));

// Protected — also require API key for mutation routes
app.use('/api/generate',    apiKeyAuth, require('./routes/generate'));
app.use('/api/generations', apiKeyAuth, require('./routes/generations'));

// SPA fallback
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

initDb()
  .then(() => app.listen(PORT, () => console.log(`Banner Gen running on :${PORT}`)))
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });
