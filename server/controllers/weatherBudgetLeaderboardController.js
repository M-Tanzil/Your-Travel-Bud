const { getWeatherForecast, getCurrentWeather } = require('../services/weatherService');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// ─── WEATHER ──────────────────────────────────────────────────────
const getWeather = async (req, res, next) => {
  try {
    const { city, days } = req.query;
    const [forecast, current] = await Promise.all([
      getWeatherForecast(city, days),
      getCurrentWeather(city),
    ]);
    res.json({ success: true, data: { current, forecast } });
  } catch (error) {
    next(error);
  }
};

// ─── BUDGET ───────────────────────────────────────────────────────
const estimateBudget = async (req, res, next) => {
  try {
    const { hotelId, trainPrice, busPrice, days, travelers } = req.body;

    let hotelTotal = 0;
    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (hotel) hotelTotal = (hotel.pricePerNight || 2000) * days * (travelers?.adults || 1);
    }

    const transportTotal = (trainPrice || 0) + (busPrice || 0);
    const foodEstimate = 800 * days * ((travelers?.adults || 1) + (travelers?.children || 0));
    const activitiesEstimate = 500 * days * (travelers?.adults || 1);

    res.json({
      success: true,
      data: {
        breakdown: {
          hotel: hotelTotal,
          transport: transportTotal,
          food: foodEstimate,
          activities: activitiesEstimate,
        },
        total: hotelTotal + transportTotal + foodEstimate + activitiesEstimate,
        currency: 'INR',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LEADERBOARD ──────────────────────────────────────────────────
const getPlacesLeaderboard = async (req, res, next) => {
  try {
    const { cityId, limit = 10 } = req.query;
    const query = { isActive: true };
    if (cityId) query.cityId = cityId;

    const places = await Place.find(query)
      .populate('cityId', 'name country')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

const getHotelsLeaderboard = async (req, res, next) => {
  try {
    const { cityId, limit = 10 } = req.query;
    const query = { isActive: true };
    if (cityId) query.cityId = cityId;

    const hotels = await Hotel.find(query)
      .populate('cityId', 'name country')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: hotels });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeather, estimateBudget, getPlacesLeaderboard, getHotelsLeaderboard };
