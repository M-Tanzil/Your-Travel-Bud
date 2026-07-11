const City = require('../models/City');
const Event = require('../models/Event');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Get all cities
// @route   GET /api/v1/cities
const getCities = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };

    const total = await City.countDocuments(query);
    const cities = await City.find(query)
      .select('name country description bestSeason photos coordinates')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    res.json({
      success: true,
      data: cities,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single city
// @route   GET /api/v1/cities/:id
const getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city || !city.isActive) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    // Get upcoming events for the city
    const events = await Event.find({
      cityId: city._id,
      startDate: { $gte: new Date() },
      isActive: true,
    }).sort({ startDate: 1 }).limit(5);

    res.json({ success: true, data: { ...city.toObject(), upcomingEvents: events } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create city (admin)
// @route   POST /api/v1/cities
const createCity = async (req, res, next) => {
  try {
    let photos = [];

    // Parse nested JSON fields
    if (req.body.coordinates) {
      req.body.coordinates = JSON.parse(req.body.coordinates);
    }

    if (req.body.publicTransport) {
      req.body.publicTransport = JSON.parse(req.body.publicTransport);
    }

    if (req.body.mustTryFoods) {
      req.body.mustTryFoods = JSON.parse(req.body.mustTryFoods);
    }

    // Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "travel-buddy/cities",
      });

      fs.unlinkSync(req.file.path);

      photos.push({
        url: result.secure_url,
        caption: req.body.caption || "",
      });
    }

    const city = await City.create({
      ...req.body,
      photos,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update city (admin)
// @route   PUT /api/v1/cities/:id
const updateCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Parse JSON fields
    if (req.body.coordinates) {
      req.body.coordinates = JSON.parse(req.body.coordinates);
    }

    if (req.body.publicTransport) {
      req.body.publicTransport = JSON.parse(req.body.publicTransport);
    }

    if (req.body.mustTryFoods) {
      req.body.mustTryFoods = JSON.parse(req.body.mustTryFoods);
    }

    // Remove photos from body to avoid cast error
    delete req.body.photos;

    // Update fields
    Object.keys(req.body).forEach((key) => {
      city[key] = req.body[key];
    });

    // Only replace image if new one uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "travel-buddy/cities",
        }
      );

      fs.unlinkSync(req.file.path);

      city.photos = [
        {
          url: result.secure_url,
          caption: req.body.caption || "",
        },
      ];
    }

    await city.save();

    res.json({
      success: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete city (admin)
// @route   DELETE /api/v1/cities/:id
const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });
    res.json({ success: true, message: 'City deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add photo to city (admin)
// @route   POST /api/v1/cities/:id/photos


const addCityPhoto = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "travel-buddy/cities",
    });

    // Delete temporary local file
    fs.unlinkSync(req.file.path);

    // Save Cloudinary URL
    city.photos.push({
      url: result.secure_url,
      caption: req.body.caption || "",
    });

    await city.save();

    res.json({
      success: true,
      message: "Photo uploaded successfully",
      data: city.photos,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCities, getCity, createCity, updateCity, deleteCity, addCityPhoto };
