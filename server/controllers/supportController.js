const SupportMessage = require('../models/SupportMessage');
const { sendAdminSupportAlert } = require('../services/emailService');
const User = require('../models/User');

const getUserConversation = async (req, res, next) => {
  try {
    let conversation = await SupportMessage.findOne({ userId: req.user._id });
    if (!conversation) conversation = await SupportMessage.create({ userId: req.user._id, messages: [] });
    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

const sendUserMessage = async (req, res, next) => {
  try {
    const { content, subject } = req.body;
    let conversation = await SupportMessage.findOne({ userId: req.user._id });

    if (!conversation) {
      conversation = await SupportMessage.create({
        userId: req.user._id,
        subject,
        messages: [{ sender: 'user', content }],
      });
    } else {
      conversation.messages.push({ sender: 'user', content });
      conversation.status = 'open';
      await conversation.save();
    }

    const user = await User.findById(req.user._id);
    await sendAdminSupportAlert(user, content);

    res.json({ success: true, message: 'Message sent', data: conversation });
  } catch (error) {
    next(error);
  }
};

// Admin: get all conversations
const getAllConversations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const total = await SupportMessage.countDocuments(query);
    const conversations = await SupportMessage.find(query)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: conversations,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: reply to conversation
const adminReply = async (req, res, next) => {
  try {
    const conversation = await SupportMessage.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    conversation.messages.push({ sender: 'admin', content: req.body.content });
    await conversation.save();

    res.json({ success: true, message: 'Reply sent', data: conversation });
  } catch (error) {
    next(error);
  }
};

// Admin: close conversation
const closeConversation = async (req, res, next) => {
  try {
    const conversation = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );
    res.json({ success: true, message: 'Conversation closed', data: conversation });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserConversation, sendUserMessage, getAllConversations, adminReply, closeConversation };
