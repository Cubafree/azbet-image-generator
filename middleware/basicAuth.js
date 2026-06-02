/**
 * HTTP Basic Auth middleware.
 *
 * Protects all routes except /api/health.
 * Configure via env vars:
 *   ADMIN_USER     — login
 *   ADMIN_PASSWORD — password
 *
 * If neither var is set the middleware passes through (dev fallback).
 */
module.exports = function basicAuth(req, res, next) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  // Not configured → skip (local dev without env vars)
  if (!expectedUser || !expectedPass) return next();

  const auth = req.headers.authorization;

  if (!auth?.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Banner Generator", charset="UTF-8"');
    return res.status(401).send('Authentication required');
  }

  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  const colonIdx = decoded.indexOf(':');
  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);

  if (user !== expectedUser || pass !== expectedPass) {
    res.set('WWW-Authenticate', 'Basic realm="Banner Generator", charset="UTF-8"');
    return res.status(401).send('Invalid credentials');
  }

  next();
};
