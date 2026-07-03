const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, toggleUserStatus,
  getAllRefunds, processRefund,
  sendAnnouncement,
  getSiteSettings, updateSiteSettings,
  getActivityLog, aiChat,
  getFoodShops, createFoodShop, updateFoodShop, deleteFoodShop,
  getEvents, createEvent, updateEvent, deleteEvent,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(protect, adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/activity', getActivityLog);

router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);

router.get('/refunds', getAllRefunds);
router.put('/refunds/:id', processRefund);

router.post('/announcements', sendAnnouncement);

router.get('/settings', getSiteSettings);
router.put('/settings', updateSiteSettings);

router.post('/ai-chat', aiChat);

router.get('/food-shops', getFoodShops);
router.post('/food-shops', createFoodShop);
router.put('/food-shops/:id', updateFoodShop);
router.delete('/food-shops/:id', deleteFoodShop);

router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
