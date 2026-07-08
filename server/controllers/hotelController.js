const Hotel = require('../models/Hotel');
const { getNearbyPlaces } = require('../services/googleMapsService');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const searchHotelsByCity = async (req, res, next) => {
  try {
    const { cityId, priceRange, rating, sort = 'rating', page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (cityId) query.cityId = cityId;
    if (priceRange) query.priceRange = priceRange;
    if (rating) query.rating = { $gte: Number(rating) };

    const sortObj = sort === 'rating' ? { rating: -1 } : sort === 'price_asc' ? { pricePerNight: 1 } : sort === 'price_desc' ? { pricePerNight: -1 } : { popularityScore: -1 };

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('cityId', 'name country')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: hotels,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('cityId', 'name country');
    if (!hotel || !hotel.isActive) return res.status(404).json({ success: false, message: 'Hotel not found' });

    let nearbyPlaces = [];
    if (hotel.location?.coordinates?.lat) {
      try {
        const nearby = await getNearbyPlaces({
          lat: hotel.location.coordinates.lat,
          lng: hotel.location.coordinates.lng,
          radius: 2000,
        });
        nearbyPlaces = nearby.results?.slice(0, 5) || [];
      } catch (e) {}
    }

    res.json({ success: true, data: { ...hotel.toObject(), nearbyPlaces } });
  } catch (error) {
    next(error);
  }
};

const compareHotels = async (req, res, next) => {
  try {
    const { ids } = req.query;
    const hotelIds = ids.split(',').slice(0, 3);
    const hotels = await Hotel.find({ _id: { $in: hotelIds } });
    res.json({ success: true, data: hotels });
  } catch (error) {
    next(error);
  }
};

const createHotel = async (req, res, next) => {
  try {
    // Parse nested location
    if (req.body.location && typeof req.body.location === "string") {
      req.body.location = JSON.parse(req.body.location);
    }

    let photos = [];

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "travel-buddy/hotels",
      });

      fs.unlinkSync(req.file.path);

      photos.push({
        url: result.secure_url,
        caption: req.body.caption || "",
      });
    }

    const hotel = await Hotel.create({
      ...req.body,
      photos,
    });

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: hotel,
    });

  } catch (error) {
    next(error);
  }
};

const updateHotel = async (req, res, next) => {
  try {
    if (req.body.location && typeof req.body.location === "string") {
      req.body.location = JSON.parse(req.body.location);
    }

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    Object.assign(hotel, req.body);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "travel-buddy/hotels",
      });

      fs.unlinkSync(req.file.path);

      hotel.photos = [
        {
          url: result.secure_url,
          caption: req.body.caption || "",
        },
      ];
    }

    await hotel.save();

    res.json({
      success: true,
      message: "Hotel updated successfully",
      data: hotel,
    });

  } catch (error) {
    next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Hotel deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchHotelsByCity, getHotel, compareHotels, createHotel, updateHotel, deleteHotel };
