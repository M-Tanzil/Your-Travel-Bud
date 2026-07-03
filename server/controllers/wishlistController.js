const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, items: [] });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, items: [] });

    const exists = wishlist.items.find((i) => i.itemId.toString() === itemId && i.itemType === itemType);
    if (exists) return res.status(400).json({ success: false, message: 'Already in wishlist' });

    wishlist.items.push({ itemId, itemType });
    await wishlist.save();
    res.json({ success: true, message: 'Added to wishlist', data: wishlist });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter((i) => i._id.toString() !== req.params.itemId);
    await wishlist.save();
    res.json({ success: true, message: 'Removed from wishlist', data: wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
