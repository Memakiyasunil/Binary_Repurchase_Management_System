const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String, // e.g., 'LOGIN', 'LOGOUT', 'PASSWORD_RESET', 'ORDER_PLACED', 'WITHDRAWAL_REQUEST'
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String // Device tracking (Browser/OS details)
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Warning'],
    default: 'Success'
  }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
