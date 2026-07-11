const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    population: String,
    languages: String,
    climate: String,
    culture: String,
    bestSeason: {
      type: String,
      enum: ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'],
    },
    bestSeasonDetails: String,
    photos: [
      {
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    mustTryFoods: [
      {
        name: String,
        description: String,
        image: String,
      },
    ],
    publicTransport: {
      metro: { available: Boolean, mapUrl: String, description: String },
      bus: { available: Boolean, description: String },
      taxi: { available: Boolean, description: String },
      rickshaw: { available: Boolean, description: String },
      other: String,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hotelBudgetPrice: Number,
hotelMidRangePrice: Number,
hotelLuxuryPrice: Number,

averageFoodCostPerDay: Number,
averageLocalTransportPerDay: Number,

  },
  { timestamps: true }
);

citySchema.index({ name: 'text', country: 'text' });

module.exports = mongoose.model('City', citySchema);
