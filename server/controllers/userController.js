const User = require('../models/User');
const Itinerary = require('../models/Itinerary');
const Booking = require('../models/Booking');
const TrainBooking = require('../models/TrainBooking');
const BusBooking = require('../models/BusBooking');

// @desc    Get user profile
// @route   GET /api/v1/users/profile/:id (public) or /api/v1/users/profile (own)
const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select('-refreshToken -resetPasswordToken -resetPasswordExpire');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile (bio)
// @route   PUT /api/v1/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true, runValidators: true }
    ).select('-refreshToken');

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings (email, password)
// @route   PUT /api/v1/users/settings
const updateSettings = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
      user.email = email;
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password is required' });
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get travel history & stats
// @route   GET /api/v1/users/history
const getTravelHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('travelHistory.cityId', 'name country');

    const trips = await Itinerary.find({ userId: req.user._id, isDeleted: false })
      .populate('cityId', 'name country')
      .sort({ createdAt: -1 });

    const hotelBookings = await Booking.countDocuments({ userId: req.user._id });
    const trainBookings = await TrainBooking.countDocuments({ userId: req.user._id });
    const busBookings = await BusBooking.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        trips,
        stats: {
          totalTrips: trips.length,
          completedTrips: trips.filter((t) => t.status === 'completed').length,
          upcomingTrips: trips.filter((t) => t.status === 'upcoming').length,
          totalBookings: hotelBookings + trainBookings + busBookings,
          hotelBookings,
          trainBookings,
          busBookings,
          citiesVisited: [...new Set(trips.map((t) => t.cityId?._id?.toString()))].length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own account
// @route   DELETE /api/v1/users/account
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateSettings, getTravelHistory, deleteAccount };
