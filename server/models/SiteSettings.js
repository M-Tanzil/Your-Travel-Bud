const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Travel Buddy' },
    logo: String,
    contactEmail: String,
    refundPolicies: {
      hotel: {
        fullRefundDays: { type: Number, default: 7 },
        partialRefundDays: { type: Number, default: 3 },
        partialRefundPercent: { type: Number, default: 50 },
        noRefundDays: { type: Number, default: 1 },
      },
      train: {
        fullRefundDays: { type: Number, default: 3 },
        partialRefundDays: { type: Number, default: 1 },
        partialRefundPercent: { type: Number, default: 50 },
      },
      bus: {
        fullRefundDays: { type: Number, default: 2 },
        partialRefundDays: { type: Number, default: 1 },
        partialRefundPercent: { type: Number, default: 50 },
      },
    },
    aboutUs: String,
    termsOfService: String,
    privacyPolicy: String,
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
