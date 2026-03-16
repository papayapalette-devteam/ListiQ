const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /logout (Supabase handles this on client, but we might log it)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// GET /me
router.get('/me', (req, res) => {
  res.json({ user: req.user });
});

// PUT /profile
router.put('/profile', (req, res) => {
  // Update logic here
  res.json({ message: 'Profile updated' });
});

module.exports = router;
