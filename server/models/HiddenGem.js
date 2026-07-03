const mongoose = require('mongoose');

const hiddenGemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    description: { type: String, required: true },
    story: String, // Local story behind the gem
    location: {
      address: String,
      coordinates: { lat: Number, lng: Number },
    },
    distanceFromCenter: Number,
    travelTime: {
      walking: String, // e.g. "25 min"
      driving: String, // e.g. "10 min"
    },
    famousFoods: [
      {
        name: { type: String, required: true },
        description: String,
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
      },
    ],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hasExpertBadge: { type: Boolean, default: false },
    expertName: String,
    photos: [{ url: String, caption: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HiddenGem', hiddenGemSchema);
