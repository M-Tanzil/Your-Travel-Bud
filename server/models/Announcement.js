const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
