const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        content: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    subject: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
