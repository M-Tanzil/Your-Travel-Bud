const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    roomType: {
      type: String,
      enum: ['single', 'double', 'suite', 'deluxe', 'family'],
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0 },
    },
    rooms: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    bookingReference: { type: String, unique: true },
    refundStatus: {
      type: String,
      enum: ['not_requested', 'pending', 'approved', 'rejected', 'processed'],
      default: 'not_requested',
    },
    cancelledAt: Date,
    confirmationEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate booking reference
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'HB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
