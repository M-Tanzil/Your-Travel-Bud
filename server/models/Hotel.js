const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    amadeusId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    description: String,
    starRating: { type: Number, min: 1, max: 5 },
    priceRange: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
    },
    pricePerNight: { type: Number },
    currency: { type: String, default: 'INR' },
    amenities: {
      wifi: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      restaurant: { type: Boolean, default: false },
      spa: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      roomService: { type: Boolean, default: false },
      bar: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
    },
    roomTypes: [
      {
        type: { type: String, enum: ['single', 'double', 'suite', 'deluxe', 'family'] },
        price: Number,
        capacity: Number,
        description: String,
      },
    ],
    photos: [{ url: String, caption: String }],
 location: {
  address: String,
  landmark: String,
  googleMapsUrl: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
},
    distanceFromCenter: Number,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  
  { timestamps: true }
);

hotelSchema.index({ cityId: 1, priceRange: 1, rating: -1 });

module.exports = mongoose.model('Hotel', hotelSchema);
