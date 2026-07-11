const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "items.itemType",
    },

    itemType: {
      type: String,
      required: true,
      enum: ["Place", "Hotel", "FoodShop"],
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
