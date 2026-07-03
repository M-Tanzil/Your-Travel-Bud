const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    location: { address: String, coordinates: { lat: Number, lng: Number } },
    category: {
      type: String,
      enum: ['Festival', 'Cultural', 'Music', 'Food', 'Sports', 'Religious', 'Other'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
