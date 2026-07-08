const mongoose = require('mongoose');

const foodShopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    description: String,
    famousDishes: [
      {
        name: { type: String, required: true },
        description: String,
        price: Number,
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
      },
    ],
  location: {
  address: String,
  landmark: String,
  googleMapsUrl: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
},
    openingHours: {
      open: String,
      close: String,
      closedOn: [String],
    },
    priceRange: {
      type: String,
      enum: ['budget', 'mid-range', 'expensive'],
    },
    photos: [{ url: String, caption: String }],
    isHiddenGem: { type: Boolean, default: false },
    hiddenGemId: { type: mongoose.Schema.Types.ObjectId, ref: 'HiddenGem' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodShop', foodShopSchema);
