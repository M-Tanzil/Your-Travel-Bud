const express = require('express');
const router = express.Router();
const {
  getItineraries, getItinerary, createItinerary, aiGenerateItinerary,
  updateItinerary, deleteItinerary, duplicateItinerary, getTravelTimes,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getItineraries);
router.get('/:id', getItinerary);
router.post('/', createItinerary);
router.post('/ai-generate', aiGenerateItinerary);
router.post('/:id/duplicate', duplicateItinerary);
router.post('/:id/travel-times', getTravelTimes);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

module.exports = router;
