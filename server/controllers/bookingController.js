const Booking = require('../models/Booking');
const TrainBooking = require('../models/TrainBooking');
const BusBooking = require('../models/BusBooking');
const RefundRequest = require('../models/RefundRequest');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const { sendBookingConfirmation } = require('../services/emailService');
const { searchHotels, getHotelOffer } = require('../services/amadeusService');
const { searchTrains, getTrainAvailability } = require('../services/irctcService');
const { searchBuses, getBusSeatLayout } = require('../services/redBusService');

// ─── HOTEL BOOKINGS ───────────────────────────────────────────────

const searchHotelsHandler = async (req, res, next) => {
  try {
    const { cityCode, checkIn, checkOut, adults, rooms } = req.query;
    const results = await searchHotels({ cityCode, checkIn, checkOut, adults, rooms });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const bookHotel = async (req, res, next) => {
  try {
    const { hotelId, roomType, checkIn, checkOut, guests, rooms, totalPrice } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    const booking = await Booking.create({
      userId: req.user._id,
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms,
      totalPrice,
      currency: 'INR',
    });

    const user = await User.findById(req.user._id);
    await sendBookingConfirmation(user, booking, 'hotel');
    booking.confirmationEmailSent = true;
    await booking.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBookings: 1 } });

    res.status(201).json({ success: true, message: 'Hotel booked successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

const getUserHotelBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Booking.countDocuments({ userId: req.user._id });
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name location photos')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const cancelHotelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Booking already cancelled' });

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    const refund = await RefundRequest.create({
      userId: req.user._id,
      bookingId: booking._id,
      bookingType: 'hotel',
      bookingReference: booking.bookingReference,
      amount: booking.totalPrice,
      currency: booking.currency,
      reason: req.body.reason || 'User requested cancellation',
    });

    res.json({ success: true, message: 'Booking cancelled. Refund request submitted.', data: { booking, refund } });
  } catch (error) {
    next(error);
  }
};

// ─── TRAIN BOOKINGS ───────────────────────────────────────────────

const searchTrainsHandler = async (req, res, next) => {
  try {
    const { from, to, date, classType } = req.query;
    const results = await searchTrains({ from, to, date, classType });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const checkTrainAvailability = async (req, res, next) => {
  try {
    const { trainNo, from, to, date, classType, quota } = req.query;
    const results = await getTrainAvailability({ trainNo, from, to, date, classType, quota });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const bookTrain = async (req, res, next) => {
  try {
    const booking = await TrainBooking.create({ ...req.body, userId: req.user._id });
    const user = await User.findById(req.user._id);
    await sendBookingConfirmation(user, booking, 'train');
    booking.confirmationEmailSent = true;
    await booking.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBookings: 1 } });
    res.status(201).json({ success: true, message: 'Train booked successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

const getUserTrainBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await TrainBooking.countDocuments({ userId: req.user._id });
    const bookings = await TrainBooking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const cancelTrainBooking = async (req, res, next) => {
  try {
    const booking = await TrainBooking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    const refund = await RefundRequest.create({
      userId: req.user._id,
      bookingId: booking._id,
      bookingType: 'train',
      bookingReference: booking.bookingReference,
      amount: booking.totalPrice,
      currency: booking.currency,
      reason: req.body.reason || 'User requested cancellation',
    });

    res.json({ success: true, message: 'Train booking cancelled. Refund request submitted.', data: { booking, refund } });
  } catch (error) {
    next(error);
  }
};

// ─── BUS BOOKINGS ─────────────────────────────────────────────────

const searchBusesHandler = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    const results = await searchBuses({ from, to, date });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const getBusSeatLayoutHandler = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const layout = await getBusSeatLayout(busId);
    res.json({ success: true, data: layout });
  } catch (error) {
    next(error);
  }
};

const bookBus = async (req, res, next) => {
  try {
    const booking = await BusBooking.create({ ...req.body, userId: req.user._id });
    const user = await User.findById(req.user._id);
    await sendBookingConfirmation(user, booking, 'bus');
    booking.confirmationEmailSent = true;
    await booking.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBookings: 1 } });
    res.status(201).json({ success: true, message: 'Bus booked successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

const getUserBusBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await BusBooking.countDocuments({ userId: req.user._id });
    const bookings = await BusBooking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const cancelBusBooking = async (req, res, next) => {
  try {
    const booking = await BusBooking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    const refund = await RefundRequest.create({
      userId: req.user._id,
      bookingId: booking._id,
      bookingType: 'bus',
      bookingReference: booking.bookingReference,
      amount: booking.totalPrice,
      currency: booking.currency,
      reason: req.body.reason || 'User requested cancellation',
    });

    res.json({ success: true, message: 'Bus booking cancelled. Refund request submitted.', data: { booking, refund } });
  } catch (error) {
    next(error);
  }
};

// ─── ALL BOOKINGS ─────────────────────────────────────────────────

const getAllUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const [hotels, trains, buses] = await Promise.all([
      Booking.find({ userId }).populate('hotelId', 'name location').lean(),
      TrainBooking.find({ userId }).lean(),
      BusBooking.find({ userId }).lean(),
    ]);

    const all = [
      ...hotels.map((b) => ({ ...b, bookingType: 'hotel' })),
      ...trains.map((b) => ({ ...b, bookingType: 'train' })),
      ...buses.map((b) => ({ ...b, bookingType: 'bus' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + Number(limit));

    res.json({
      success: true,
      data: paginated,
      pagination: { total: all.length, page: Number(page), pages: Math.ceil(all.length / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── REFUNDS ──────────────────────────────────────────────────────

const getUserRefunds = async (req, res, next) => {
  try {
    const refunds = await RefundRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: refunds });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchHotelsHandler, bookHotel, getUserHotelBookings, cancelHotelBooking,
  searchTrainsHandler, checkTrainAvailability, bookTrain, getUserTrainBookings, cancelTrainBooking,
  searchBusesHandler, getBusSeatLayoutHandler, bookBus, getUserBusBookings, cancelBusBooking,
  getAllUserBookings, getUserRefunds,
};
