const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateSettings, getTravelHistory, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile/:id', getProfile);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);
router.get('/history', protect, getTravelHistory);
router.delete('/account', protect, deleteAccount);

module.exports = router;
