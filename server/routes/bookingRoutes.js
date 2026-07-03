const express = require('express');
const router = express.Router();
const {
  searchHotelsHandler, bookHotel, getUserHotelBookings, cancelHotelBooking,
  searchTrainsHandler, checkTrainAvailability, bookTrain, getUserTrainBookings, cancelTrainBooking,
  searchBusesHandler, getBusSeatLayoutHandler, bookBus, getUserBusBookings, cancelBusBooking,
  getAllUserBookings, getUserRefunds,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.use(protect);

// All bookings
router.get('/', getAllUserBookings);
router.get('/refunds', getUserRefunds);

// Hotel
router.get('/hotel/search', searchHotelsHandler);
router.get('/hotel', getUserHotelBookings);
router.post('/hotel', bookingLimiter, bookHotel);
router.put('/hotel/:id/cancel', cancelHotelBooking);

// Train
router.get('/train/search', searchTrainsHandler);
router.get('/train/availability', checkTrainAvailability);
router.get('/train', getUserTrainBookings);
router.post('/train', bookingLimiter, bookTrain);
router.put('/train/:id/cancel', cancelTrainBooking);

// Bus
router.get('/bus/search', searchBusesHandler);
router.get('/bus/seats/:busId', getBusSeatLayoutHandler);
router.get('/bus', getUserBusBookings);
router.post('/bus', bookingLimiter, bookBus);
router.put('/bus/:id/cancel', cancelBusBooking);

module.exports = router;
