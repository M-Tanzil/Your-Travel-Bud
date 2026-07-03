const HiddenGem = require('../models/HiddenGem');
const FoodShop = require('../models/FoodShop');
const { getTravelTime } = require('../services/googleMapsService');

const getHiddenGemsByCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const gems = await HiddenGem.find({ cityId, isActive: true }).sort({ createdAt: -1 });
    const foodShops = await FoodShop.find({ cityId, isActive: true });
    res.json({ success: true, data: { gems, foodShops } });
  } catch (error) {
    next(error);
  }
};

const getHiddenGem = async (req, res, next) => {
  try {
    const gem = await HiddenGem.findById(req.params.id).populate('addedBy', 'name');
    if (!gem) return res.status(404).json({ success: false, message: 'Hidden gem not found' });
    res.json({ success: true, data: gem });
  } catch (error) {
    next(error);
  }
};

const getTravelTimeBetweenGems = async (req, res, next) => {
  try {
    const { origins, destinations, mode } = req.body;
    const data = await getTravelTime(origins, destinations, mode || 'walking');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createHiddenGem = async (req, res, next) => {
  try {
    const gem = await HiddenGem.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, message: 'Hidden gem created', data: gem });
  } catch (error) {
    next(error);
  }
};

const updateHiddenGem = async (req, res, next) => {
  try {
    const gem = await HiddenGem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gem) return res.status(404).json({ success: false, message: 'Hidden gem not found' });
    res.json({ success: true, message: 'Hidden gem updated', data: gem });
  } catch (error) {
    next(error);
  }
};

const deleteHiddenGem = async (req, res, next) => {
  try {
    await HiddenGem.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Hidden gem deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHiddenGemsByCity, getHiddenGem, getTravelTimeBetweenGems, createHiddenGem, updateHiddenGem, deleteHiddenGem };
