const express = require('express');
const router = express.Router();
const { getPlacesLeaderboard, getHotelsLeaderboard } = require('../controllers/weatherBudgetLeaderboardController');

router.get('/places', getPlacesLeaderboard);
router.get('/hotels', getHotelsLeaderboard);

module.exports = router;
