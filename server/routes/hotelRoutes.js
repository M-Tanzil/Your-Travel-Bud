const express = require('express');
const router = express.Router();
const { searchHotelsByCity, getHotel, compareHotels, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', searchHotelsByCity);
router.get('/compare', compareHotels);
router.get('/:id', getHotel);
router.post('/', protect, adminMiddleware, createHotel);
router.put('/:id', protect, adminMiddleware, updateHotel);
router.delete('/:id', protect, adminMiddleware, deleteHotel);

module.exports = router;
