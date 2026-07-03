const User = require('../models/User');
const Booking = require('../models/Booking');
const TrainBooking = require('../models/TrainBooking');
const BusBooking = require('../models/BusBooking');
const RefundRequest = require('../models/RefundRequest');
const Blog = require('../models/Blog');
const SiteSettings = require('../models/SiteSettings');
const Announcement = require('../models/Announcement');
const FoodShop = require('../models/FoodShop');
const Event = require('../models/Event');
const { sendAnnouncementEmail } = require('../services/emailService');
const { chatWithAI } = require('../services/aiService');

// ─── DASHBOARD ANALYTICS ──────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    const now = new Date();
    const start = period === 'weekly'
      ? new Date(now - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers, newUsers, totalHotelBookings, totalTrainBookings, totalBusBookings,
      pendingRefunds, activeTrips, recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: start } }),
      Booking.countDocuments(),
      TrainBooking.countDocuments(),
      BusBooking.countDocuments(),
      RefundRequest.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
    ]);

    // Revenue calculation
    const hotelRevenue = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const trainRevenue = await TrainBooking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const busRevenue = await BusBooking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue =
      (hotelRevenue[0]?.total || 0) +
      (trainRevenue[0]?.total || 0) +
      (busRevenue[0]?.total || 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsers,
        totalBookings: totalHotelBookings + totalTrainBookings + totalBusBookings,
        totalRevenue,
        pendingRefunds,
        activeTrips,
        recentActivity,
        bookingBreakdown: {
          hotel: totalHotelBookings,
          train: totalTrainBookings,
          bus: totalBusBookings,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'user' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-refreshToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    next(error);
  }
};

// ─── REFUNDS ──────────────────────────────────────────────────────
const getAllRefunds = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const total = await RefundRequest.countDocuments(query);
    const refunds = await RefundRequest.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: refunds,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const processRefund = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const refund = await RefundRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, processedAt: new Date(), processedBy: req.user._id },
      { new: true }
    );
    if (!refund) return res.status(404).json({ success: false, message: 'Refund request not found' });

    // Update booking refund status
    const BookingModel = refund.bookingType === 'hotel' ? Booking : refund.bookingType === 'train' ? TrainBooking : BusBooking;
    await BookingModel.findByIdAndUpdate(refund.bookingId, { refundStatus: status });

    res.json({ success: true, message: `Refund ${status}`, data: refund });
  } catch (error) {
    next(error);
  }
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────
const sendAnnouncement = async (req, res, next) => {
  try {
    const { subject, body } = req.body;
    const users = await User.find({ role: 'user', isActive: true }).select('name email');

    const sentCount = await sendAnnouncementEmail(users, subject, body);

    const announcement = await Announcement.create({
      subject,
      body,
      sentBy: req.user._id,
      recipientCount: sentCount,
    });

    res.json({ success: true, message: `Announcement sent to ${sentCount} users`, data: announcement });
  } catch (error) {
    next(error);
  }
};

// ─── SITE SETTINGS ────────────────────────────────────────────────
const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, message: 'Settings updated', data: settings });
  } catch (error) {
    next(error);
  }
};

// ─── ACTIVITY LOG ─────────────────────────────────────────────────
const getActivityLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [recentUsers, recentBookings, recentBlogs, recentRefunds] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('hotelId', 'name'),
      Blog.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).populate('userId', 'name'),
      RefundRequest.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name'),
    ]);

    const activities = [
      ...recentUsers.map((u) => ({ type: 'new_user', data: u, createdAt: u.createdAt })),
      ...recentBookings.map((b) => ({ type: 'new_booking', data: b, createdAt: b.createdAt })),
      ...recentBlogs.map((b) => ({ type: 'new_blog', data: b, createdAt: b.createdAt })),
      ...recentRefunds.map((r) => ({ type: 'new_refund', data: r, createdAt: r.createdAt })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

// ─── AI CHAT ──────────────────────────────────────────────────────
const aiChat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    const reply = await chatWithAI(messages);
    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
};

// ─── FOOD SHOP MANAGEMENT ─────────────────────────────────────────
const getFoodShops = async (req, res, next) => {
  try {
    const { cityId, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    if (cityId) query.cityId = cityId;

    const total = await FoodShop.countDocuments(query);
    const shops = await FoodShop.find(query)
      .populate('cityId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: shops,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const createFoodShop = async (req, res, next) => {
  try {
    const shop = await FoodShop.create(req.body);
    res.status(201).json({ success: true, message: 'Food shop created', data: shop });
  } catch (error) {
    next(error);
  }
};

const updateFoodShop = async (req, res, next) => {
  try {
    const shop = await FoodShop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shop) return res.status(404).json({ success: false, message: 'Food shop not found' });
    res.json({ success: true, message: 'Food shop updated', data: shop });
  } catch (error) {
    next(error);
  }
};

const deleteFoodShop = async (req, res, next) => {
  try {
    await FoodShop.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Food shop deleted' });
  } catch (error) {
    next(error);
  }
};

// ─── EVENT MANAGEMENT ─────────────────────────────────────────────
const getEvents = async (req, res, next) => {
  try {
    const { cityId, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    if (cityId) query.cityId = cityId;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('cityId', 'name')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: events,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: 'Event created', data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event updated', data: event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats, getUsers, toggleUserStatus,
  getAllRefunds, processRefund,
  sendAnnouncement,
  getSiteSettings, updateSiteSettings,
  getActivityLog, aiChat,
  getFoodShops, createFoodShop, updateFoodShop, deleteFoodShop,
  getEvents, createEvent, updateEvent, deleteEvent,
};
