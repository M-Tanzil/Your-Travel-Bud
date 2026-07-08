const express = require('express');
const router = express.Router();
const { searchHotelsByCity, getHotel, compareHotels, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', searchHotelsByCity);
router.get('/compare', compareHotels);
router.get('/:id', getHotel);
router.post('/',  protect, adminMiddleware, upload.single('image'), createHotel);
router.put(
  "/:id",
  protect,
  adminMiddleware,
  upload.single("image"),
  updateHotel
);
router.delete('/:id', protect, adminMiddleware, deleteHotel);

module.exports = router;
