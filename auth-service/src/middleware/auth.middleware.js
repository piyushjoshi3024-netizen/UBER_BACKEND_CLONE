const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return next(new ApiError('Authentication required', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new ApiError('Invalid or expired token', 401));
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('Authentication required', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError('Forbidden: insufficient role', 403));
  }

  return next();
};

module.exports = {
  requireAuth,
  requireRole,
};
