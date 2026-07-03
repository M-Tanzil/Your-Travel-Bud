const express = require('express');
const router = express.Router();
const { getCities, getCity, createCity, updateCity, deleteCity, addCityPhoto } = require('../controllers/cityController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCities);
router.get('/:id', getCity);
router.post('/', protect, adminMiddleware, createCity);
router.put('/:id', protect, adminMiddleware, updateCity);
router.delete('/:id', protect, adminMiddleware, deleteCity);
router.post('/:id/photos', protect, adminMiddleware, upload.single('photo'), addCityPhoto);

module.exports = router;
