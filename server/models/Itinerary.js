const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    isAIGenerated: { type: Boolean, default: false },
    days: [
      {
        dayNumber: Number,
        date: Date,
        places: [
          {
            placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
            order: Number,
            notes: String,
            travelTimeFromPrev: Number, // in minutes
            travelMode: { type: String, enum: ['walking', 'driving', 'transit'] },
          },
        ],
        notes: String,
      },
    ],
    budget: {
      estimated: Number,
      hotel: Number,
      transport: Number,
      food: Number,
      activities: Number,
      currency: { type: String, default: 'INR' },
    },
    isShared: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-calculate status based on dates
itinerarySchema.pre('save', function (next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
  next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
