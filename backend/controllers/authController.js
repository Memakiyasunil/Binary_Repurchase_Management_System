const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const commissionService = require('../services/commissionService');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user (Step 1 - Send OTP)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password, firstName, lastName, email, sponsorId, placement } = req.body;

  if (!username || !password || !firstName || !email) {
    console.log('400 ERROR: Missing required fields');
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log('400 ERROR: User already exists');
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    let sponsorDbId = null;
    let uplineId = null;
    let position = placement ? placement.toLowerCase() : 'left';

    // Verify Sponsor - accept either sponsorId (username) or referral code
    if (sponsorId) {
      let trimmedSponsorId = sponsorId.trim();
      if (trimmedSponsorId.startsWith('@')) {
        trimmedSponsorId = trimmedSponsorId.substring(1);
      }
      const sponsor = await User.findOne({
        $or: [
          { username: { $regex: new RegExp('^' + trimmedSponsorId + '$', 'i') } },
          { referralCode: { $regex: new RegExp('^' + trimmedSponsorId + '$', 'i') } },
          { _id: trimmedSponsorId.match(/^[0-9a-fA-F]{24}$/) ? trimmedSponsorId : null }
        ]
      });
      if (!sponsor) {
        console.log('400 ERROR: Invalid Sponsor ID', trimmedSponsorId);
        return res.status(400).json({ message: 'Invalid Sponsor ID or Referral Code' });
      }
      sponsorDbId = sponsor._id;

      // Binary Tree Placement Logic: Find first open slot in specified leg
      let currentNode = sponsor;
      while (true) {
        const child = await User.findOne({ uplineId: currentNode._id, position });
        if (!child) {
          uplineId = currentNode._id;
          break;
        }
        currentNode = child;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user (unverified initially)
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      sponsorId: sponsorDbId,
      uplineId,
      position: sponsorDbId ? position : undefined,
      otp,
      otpExpires,
      isVerified: false,
      status: 'inactive'
    });

    if (user) {
      // Send OTP Email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your Registration OTP - Binary Repurchase',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
              <h1 style="color: #103A26; text-align: center;">Welcome to Binary Repurchase</h1>
              <p style="color: #666;">Dear <strong>${firstName}</strong>,</p>
              <p style="color: #666;">Your OTP for account verification is:</p>
              <div style="background: #103A26; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Email sending failed', err);
      }

      res.status(201).json({
        message: 'OTP sent to your email. Please verify to complete registration.',
        isOtpSent: true,
        email: user.email
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified
    user.isVerified = true;
    user.status = 'active';
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create wallet for user
    await Wallet.create({ user: user._id });

    // Fire commission engine for sponsor (Direct Referral Bonus)
    if (user.sponsorId) {
      await commissionService.processDirectReferralBonus(user.sponsorId, user._id);
      // Update sponsor's referral count
      await User.findByIdAndUpdate(user.sponsorId, { $inc: { totalDirectReferrals: 1 } });
    }

    // Create welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to Binary Repurchase!',
      message: `Your account has been verified successfully. Start your journey to financial freedom!`,
      type: 'Registration'
    });

    res.json({
      _id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      rank: user.rank,
      referralCode: user.referralCode,
      token: generateToken(user._id),
      message: 'Account verified successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  let { username, password } = req.body;
  if (username) username = username.trim();

  try {
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }]
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email via OTP first.' });
      }
      if (user.status === 'blocked' || user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended or blocked.' });
      }

      res.json({
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        rank: user.rank,
        profilePic: user.profilePic,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpires -passwordResetOtp -passwordResetExpires')
      .populate('sponsorId', 'username firstName lastName')
      .populate('uplineId', 'username firstName lastName');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot Password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const otp = generateOTP();
    user.passwordResetOtp = otp;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - Binary Repurchase',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h1 style="color: #103A26; text-align: center;">Password Reset Request</h1>
            <p style="color: #666;">Dear <strong>${user.firstName}</strong>,</p>
            <p style="color: #666;">Your OTP for password reset is:</p>
            <div style="background: #103A26; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 12px;">This OTP is valid for 10 minutes. If you did not request a password reset, ignore this email.</p>
          </div>
        `
      });
    } catch (err) {
      console.error('Email sending failed', err);
    }

    res.json({ message: 'Password reset OTP sent to your email.', isOtpSent: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.passwordResetOtp !== otp || user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetOtp = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'Resend OTP - Binary Repurchase',
        html: `<div style="font-family: Arial; padding: 20px;"><h2 style="color:#103A26">Your new OTP</h2><p>Your new OTP is: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p style="color:#999;font-size:12px">Valid for 10 minutes.</p></div>`
      });
    } catch (err) {
      console.error('Email failed', err);
    }

    res.json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  resendOTP,
};
