const rateLimit = require('express-rate-limit');

// 1. globalLimiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. authLimiter: 10 requests per 15 minutes per IP (for login/signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. aiLimiter: 20 requests per hour per user ID (for AI generation)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyGenerator: (req) => {
    // Falls back to IP if user not found (though auth middleware should ensure user exists)
    return req.user ? req.user.id : req.ip;
  },
  message: { error: 'AI generation limit reached for this hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  authLimiter,
  aiLimiter
};
