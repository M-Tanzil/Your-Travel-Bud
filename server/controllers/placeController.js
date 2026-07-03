const Place = require('../models/Place');
const { getNearbyPlaces } = require('../services/googleMapsService');

const getPlaces = async (req, res, next) => {
  try {
    const { cityId, category, priceRange, sort = 'rating', page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (cityId) query.cityId = cityId;
    if (category) query.category = category;

    const sortObj = sort === 'rating' ? { rating: -1 } : sort === 'popular' ? { popularityScore: -1 } : { name: 1 };

    const total = await Place.countDocuments(query);
    const places = await Place.find(query)
      .populate('cityId', 'name country')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: places,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id).populate('cityId', 'name country');
    if (!place || !place.isActive) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

const getNearbyPlacesHandler = async (req, res, next) => {
  try {
    const { lat, lng, radius, type } = req.query;
    const data = await getNearbyPlaces({ lat, lng, radius, type });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, message: 'Place created', data: place });
  } catch (error) {
    next(error);
  }
};

const updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, message: 'Place updated', data: place });
  } catch (error) {
    next(error);
  }
};

const deletePlace = async (req, res, next) => {
  try {
    await Place.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Place deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlaces, getPlace, getNearbyPlacesHandler, createPlace, updatePlace, deletePlace };
