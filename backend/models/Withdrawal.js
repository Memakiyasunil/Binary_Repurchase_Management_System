const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Wallet'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Approved', 'Rejected', 'Hold'],
    default: 'Pending'
  },
  adminRemarks: {
    type: String
  },
  userRemarks: {
    type: String
  },
  processedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
