const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One KYC profile per user
  },
  documents: {
    aadhaarCard: {
      url: { type: String },
      verified: { type: Boolean, default: false }
    },
    panCard: {
      url: { type: String },
      verified: { type: Boolean, default: false }
    },
    passportPhoto: {
      url: { type: String },
      verified: { type: Boolean, default: false }
    },
    bankPassbook: {
      url: { type: String },
      verified: { type: Boolean, default: false }
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Reupload Requested', 'Not Submitted'],
    default: 'Not Submitted'
  },
  adminRemarks: {
    type: String
  },
  verifiedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Kyc', kycSchema);
