const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    category: {
      type: String,
      enum: ['Historical', 'Nature', 'Religious', 'Entertainment', 'Shopping', 'Food', 'Museum', 'Beach', 'Adventure', 'Other'],
      required: true,
    },
    description: String,
    openingHours: {
      open: String,
      close: String,
      closedOn: [String],
    },
    bestTimeToVisit: String,
    ticketPrice: {
      adult: Number,
      child: Number,
      currency: { type: String, default: 'INR' },
      isFree: { type: Boolean, default: false },
    },
  location: {
  address: String,
  landmark: String,
  googleMapsUrl: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
},
photos: [
  {
    url: String,
    caption: String,
  },
],
    distanceFromCenter: Number, // in km
    photos: [{ url: String, caption: String }],
    googlePlaceId: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placeSchema.index({ name: 'text', description: 'text' });
placeSchema.index({ cityId: 1, category: 1 });

module.exports = mongoose.model('Place', placeSchema);
