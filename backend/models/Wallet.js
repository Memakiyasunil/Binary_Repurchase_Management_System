const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalEarnings: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalWithdrawals: {
    type: Number,
    required: true,
    default: 0.0
  },
  pendingWithdrawals: {
    type: Number,
    required: true,
    default: 0.0
  }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
