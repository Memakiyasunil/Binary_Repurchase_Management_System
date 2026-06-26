const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Registration', 'OTP', 'Purchase', 'Income', 'Withdrawal', 'Referral', 'Rank', 'System', 'KYC'],
    default: 'System'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deliveryMethods: {
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    pushSent: { type: Boolean, default: true } // Stored in DB acts as push
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
