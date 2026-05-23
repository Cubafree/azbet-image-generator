/**
 * API Key authentication middleware.
 *
 * Accepts the key via:
 *   - Header:  X-Api-Key: <key>
 *   - Header:  Authorization: Bearer <key>
 *
 * Set API_KEY env var on the server. If the var is not set, the middleware
 * passes through (useful during local dev without auth configured).
 */
module.exports = function apiKeyAuth(req, res, next) {
  const expected = process.env.API_KEY;

  // If no API_KEY is configured, skip auth (dev fallback)
  if (!expected) return next();

  const header = req.headers['x-api-key'] || req.headers['authorization'];
  const provided = header?.startsWith('Bearer ')
    ? header.slice(7)
    : header;

  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized — provide a valid API key' });
  }

  next();
};
