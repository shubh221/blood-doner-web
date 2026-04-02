const express = require('express');
const router = express.Router();
const { getDonors } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

// Protected route - must be logged in to search donors
router.get('/donors', protect, getDonors);

module.exports = router;
