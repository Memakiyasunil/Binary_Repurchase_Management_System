const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, mobile, dob, gender, address, city, state, country, pincode } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (pincode !== undefined) user.pincode = pincode;

    await user.save();
    const updated = await User.findById(req.user._id).select('-password -otp -otpExpires -passwordResetOtp -passwordResetExpires');
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update bank details
// @route   PUT /api/profile/bank
// @access  Private
const updateBankDetails = async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, branchName, accountHolderName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bankDetails = { bankName, accountNumber, ifscCode, branchName, accountHolderName };
    await user.save();

    res.json({ message: 'Bank details updated successfully', bankDetails: user.bankDetails });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update nominee details
// @route   PUT /api/profile/nominee
// @access  Private
const updateNominee = async (req, res) => {
  try {
    const { name, relation } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.nominee = { name, relation };
    await user.save();
    res.json({ message: 'Nominee details updated successfully', nominee: user.nominee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/profile/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get referral team info
// @route   GET /api/profile/referral
// @access  Private
const getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const directReferrals = await User.find({ sponsorId: req.user._id })
      .select('username firstName lastName status createdAt rank')
      .sort({ createdAt: -1 });

    res.json({
      referralCode: user.referralCode || user.username,
      referralLink: `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${user.referralCode || user.username}`,
      totalDirectReferrals: user.totalDirectReferrals,
      totalLeftMembers: user.totalLeftMembers,
      totalRightMembers: user.totalRightMembers,
      leftBusinessVolume: user.leftBusinessVolume,
      rightBusinessVolume: user.rightBusinessVolume,
      directReferrals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile, updateBankDetails, updateNominee, changePassword, getReferralInfo };
