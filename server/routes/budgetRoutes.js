const express = require('express');
const router = express.Router();
const { estimateBudget } = require('../controllers/weatherBudgetLeaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/estimate', protect, estimateBudget);

module.exports = router;
