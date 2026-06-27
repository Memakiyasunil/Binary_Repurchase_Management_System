const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Base Authentication Fields
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended', 'blocked'], default: 'inactive' },
  
  // OTP Fields
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  passwordResetOtp: { type: String },
  passwordResetExpires: { type: Date },
  
  // Profile Fields
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, sparse: true },   // optional, sparse avoids unique null conflicts
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  profilePic: { type: String },
  
  // Address Fields
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  
  // KYC & Documents
  panNumber: { type: String },
  aadhaarNumber: { type: String },
  kycStatus: { type: String, enum: ['Not Submitted', 'Pending', 'Approved', 'Rejected'], default: 'Not Submitted' },
  
  // Bank Details
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    accountHolderName: { type: String }
  },
  
  // Nominee Details
  nominee: {
    name: { type: String },
    relation: { type: String }
  },

  // Binary MLM Fields
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uplineId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  position: { type: String, enum: ['left', 'right'] },
  referralCode: { type: String, unique: true, sparse: true },
  
  // Rank & Recognition
  rank: { 
    type: String, 
    enum: ['Associate', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown Diamond', 'Ambassador'], 
    default: 'Associate' 
  },
  
  // Tree Statistics
  leftLegActive: { type: Boolean, default: false },
  rightLegActive: { type: Boolean, default: false },
  totalLeftMembers: { type: Number, default: 0 },
  totalRightMembers: { type: Number, default: 0 },
  leftBusinessVolume: { type: Number, default: 0 },
  rightBusinessVolume: { type: Number, default: 0 },
  matchedBusinessVolume: { type: Number, default: 0 },
  carryForwardVolume: { type: Number, default: 0 },
  totalDirectReferrals: { type: Number, default: 0 }
}, { timestamps: true });

// Generate referral code before save
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'BR' + this._id.toString().slice(-6).toUpperCase();
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
