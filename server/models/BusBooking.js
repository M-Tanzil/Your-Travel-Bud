const mongoose = require('mongoose');

const busBookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    busOperator: String,
    busType: String,
    from: { type: String, required: true },
    to: { type: String, required: true },
    journeyDate: { type: Date, required: true },
    departureTime: String,
    arrivalTime: String,
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['M', 'F', 'T'] },
        seatNo: String,
      },
    ],
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

busBookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('BusBooking', busBookingSchema);
