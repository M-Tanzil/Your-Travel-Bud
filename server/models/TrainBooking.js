const mongoose = require('mongoose');

const trainBookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    trainNumber: { type: String, required: true },
    trainName: String,
    from: { type: String, required: true },
    fromStation: String,
    to: { type: String, required: true },
    toStation: String,
    journeyDate: { type: Date, required: true },
    class: {
      type: String,
      enum: ['SL', '3A', '2A', '1A', 'CC', 'EC', 'GEN'],
      required: true,
    },
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
      enum: ['confirmed', 'waitlisted', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    bookingReference: { type: String, unique: true },
    refundStatus: {
      type: String,
      enum: ['not_requested', 'pending', 'approved', 'rejected', 'processed'],
      default: 'not_requested',
    },
    pnrNumber: String,
    cancelledAt: Date,
    confirmationEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

trainBookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'TB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TrainBooking', trainBookingSchema);
