function authMiddleware(req, res, next) {
  if (
    req.path === '/auth' ||
    req.path.startsWith('/api-docs') ||
    req.path.startsWith('/swagger-ui')
  ) return next();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  next();
}

module.exports = authMiddleware;
