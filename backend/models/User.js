const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Base Authentication Fields
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended', 'blocked'], default: 'inactive' },
  
  // Profile Fields
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Address Fields
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  
  // KYC & Documents
  panNumber: { type: String },
  aadhaarNumber: { type: String },
  
  // Bank Details
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branchName: { type: String }
  },
  
  // Nominee Details
  nominee: {
    name: { type: String },
    relation: { type: String }
  },

  // Binary MLM Fields
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who referred them
  uplineId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Direct parent in tree (Placement ID)
  position: { type: String, enum: ['left', 'right'] }, // Placement position
  
  // Tree Statistics
  leftLegActive: { type: Boolean, default: false },
  rightLegActive: { type: Boolean, default: false },
  totalLeftMembers: { type: Number, default: 0 },
  totalRightMembers: { type: Number, default: 0 },
  leftBusinessVolume: { type: Number, default: 0 },
  rightBusinessVolume: { type: Number, default: 0 },
  matchedBusinessVolume: { type: Number, default: 0 },
  carryForwardVolume: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
