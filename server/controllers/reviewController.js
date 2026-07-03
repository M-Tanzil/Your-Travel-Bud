const Review = require('../models/Review');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');

const updateTargetRating = async (targetId, targetType) => {
  const reviews = await Review.find({ targetId, targetType, isDeleted: false });
  if (!reviews.length) return;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const count = reviews.length;

  if (targetType === 'place') {
    await Place.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), reviewCount: count });
  } else if (targetType === 'hotel') {
    await Hotel.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), reviewCount: count });
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { targetId, targetType, page = 1, limit = 10 } = req.query;
    const query = { targetId, targetType, isDeleted: false };

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: reviews,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;

    const existing = await Review.findOne({ userId: req.user._id, targetId, targetType, isDeleted: false });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this' });

    const review = await Review.create({ userId: req.user._id, targetId, targetType, rating, comment });
    await updateTargetRating(targetId, targetType);

    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isDeleted: false },
      { rating: req.body.rating, comment: req.body.comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    await updateTargetRating(review.targetId, review.targetType);
    res.json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, $or: [{ userId: req.user._id }, { _id: req.params.id }] },
      { isDeleted: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    await updateTargetRating(review.targetId, review.targetType);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
