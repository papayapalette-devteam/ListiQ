const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/research', aiLimiter, (req, res) => {
  res.json({ message: 'Research logic here' });
});

router.get('/history', (req, res) => {
  res.json({ history: [] });
});

module.exports = router;
