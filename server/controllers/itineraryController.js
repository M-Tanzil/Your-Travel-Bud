const Itinerary = require('../models/Itinerary');
const { generateItinerary } = require('../services/aiService');
const { getTravelTime } = require('../services/googleMapsService');
const Place = require('../models/Place');

// @desc    Get all user itineraries
// @route   GET /api/v1/itineraries
const getItineraries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id, isDeleted: false };
    if (status) query.status = status;

    const total = await Itinerary.countDocuments(query);
    const itineraries = await Itinerary.find(query)
      .populate('cityId', 'name country photos')
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: itineraries,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single itinerary
// @route   GET /api/v1/itineraries/:id
const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false,
    })
      .populate('cityId', 'name country coordinates')
      .populate('days.places.placeId');

    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });

    res.json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    Create manual itinerary
// @route   POST /api/v1/itineraries
const createItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Trip plan created', data: itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    AI generate itinerary
// @route   POST /api/v1/itineraries/ai-generate
const aiGenerateItinerary = async (req, res, next) => {
  try {
    const {
  cityId,
  cityName,
  startDate,
  endDate,
  travelers,
  preferences,
  budgetType,
} = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const aiPlan = await generateItinerary({
  city: cityName,
  days,
  travelers,
  preferences,
  budgetType,
});

    // Build itinerary days from AI response
    const itineraryDays = aiPlan.days.map((day, index) => ({
      dayNumber: day.dayNumber,
      date: new Date(start.getTime() + index * 24 * 60 * 60 * 1000),
      places: day.places.map((place, i) => ({
        order: i,
        notes: place.description,
        travelTimeFromPrev: place.travelTimeFromPrev || 0,
        travelMode: 'driving',
      })),
      notes: day.notes,
    }));

    const itinerary = await Itinerary.create({
      userId: req.user._id,
      cityId,
      title: aiPlan.title,
      startDate,
      endDate,
      travelers,
      days: itineraryDays,
      budget: aiPlan.estimatedBudget,
      isAIGenerated: true,
    });

    res.status(201).json({
      success: true,
      message: 'AI itinerary generated',
      data: { itinerary, aiPlan },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update itinerary
// @route   PUT /api/v1/itineraries/:id
const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
    res.json({ success: true, message: 'Trip plan updated', data: itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/v1/itineraries/:id
const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
    res.json({ success: true, message: 'Trip plan deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate/re-book past trip
// @route   POST /api/v1/itineraries/:id/duplicate
const duplicateItinerary = async (req, res, next) => {
  try {
    const original = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
    if (!original) return res.status(404).json({ success: false, message: 'Itinerary not found' });

    const { startDate, endDate } = req.body;
    const duplicate = await Itinerary.create({
      userId: req.user._id,
      cityId: original.cityId,
      title: `${original.title} (Copy)`,
      startDate: startDate || original.startDate,
      endDate: endDate || original.endDate,
      travelers: original.travelers,
      days: original.days,
      budget: original.budget,
      isAIGenerated: original.isAIGenerated,
    });

    res.status(201).json({ success: true, message: 'Trip duplicated successfully', data: duplicate });
  } catch (error) {
    next(error);
  }
};

// @desc    Get travel time between places in itinerary
// @route   POST /api/v1/itineraries/:id/travel-times
const getTravelTimes = async (req, res, next) => {
  try {
    const { origins, destinations, mode } = req.body;
    const travelData = await getTravelTime(origins, destinations, mode);
    res.json({ success: true, data: travelData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItineraries,
  getItinerary,
  createItinerary,
  aiGenerateItinerary,
  updateItinerary,
  deleteItinerary,
  duplicateItinerary,
  getTravelTimes,
};
