const express = require('express');
const router = express.Router();
const multer = require('multer');
const { aiLimiter } = require('../middleware/rateLimit');
const { checkUsage } = require('../middleware/usageControl');
const authMiddleware = require('../middleware/auth');
const listingController = require('../controllers/listing.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

// POST /generate — upload image + form data, generate listing
router.post('/generate', aiLimiter, checkUsage('generate_listing'), upload.single('image'), listingController.generateListing);

// GET / — get user's listing history
router.get('/', (req, res) => {
  res.json({ listings: [] });
});

// GET /:id — get single listing
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// DELETE /:id — delete listing
router.delete('/:id', (req, res) => {
  res.json({ message: 'Deleted' });
});

module.exports = router;
