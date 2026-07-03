const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    destination: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: String, enum: ['user', 'admin'] },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', content: 'text', destination: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
