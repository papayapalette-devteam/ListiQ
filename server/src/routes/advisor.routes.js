const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/chat', aiLimiter, (req, res) => {
  res.json({ response: 'Guru speaking...' });
});

router.get('/sessions', (req, res) => {
  res.json({ sessions: [] });
});

router.get('/sessions/:sessionId', (req, res) => {
  res.json({ history: [] });
});

router.delete('/sessions/:sessionId', (req, res) => {
  res.json({ message: 'Session deleted' });
});

module.exports = router;
