const express = require('express');
const router = express.Router();
const { getHiddenGemsByCity, getHiddenGem, getTravelTimeBetweenGems, createHiddenGem, updateHiddenGem, deleteHiddenGem } = require('../controllers/hiddenGemController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/city/:cityId', getHiddenGemsByCity);
router.get('/:id', getHiddenGem);
router.post('/travel-time', getTravelTimeBetweenGems);
router.post('/', protect, adminMiddleware, createHiddenGem);
router.put('/:id', protect, adminMiddleware, updateHiddenGem);
router.delete('/:id', protect, adminMiddleware, deleteHiddenGem);

module.exports = router;
