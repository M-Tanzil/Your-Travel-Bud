const express = require('express');
const router = express.Router();
const { getPlaces, getPlace, getNearbyPlacesHandler, createPlace, updatePlace, deletePlace } = require('../controllers/placeController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getPlaces);
router.get('/nearby', getNearbyPlacesHandler);
router.get('/:id', getPlace);
router.post('/', protect, adminMiddleware, createPlace);
router.put('/:id', protect, adminMiddleware, updatePlace);
router.delete('/:id', protect, adminMiddleware, deletePlace);

module.exports = router;
