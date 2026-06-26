const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  incomeType: {
    type: String,
    enum: ['Direct Referral', 'Binary Matching', 'Repurchase Bonus', 'Leadership Bonus', 'Reward'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  // Specific to Binary Matching
  matchedBV: {
    type: Number,
    default: 0
  },
  bonusPercentage: {
    type: Number,
    default: 0
  },
  // Specific to Direct Referral / Repurchase
  sourceUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sourceOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'credited', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
