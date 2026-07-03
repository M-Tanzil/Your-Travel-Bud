const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherBudgetLeaderboardController');

router.get('/', getWeather);

module.exports = router;
