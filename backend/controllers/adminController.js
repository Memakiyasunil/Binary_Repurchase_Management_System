const User = require('../models/User');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const Income = require('../models/Income');
const Kyc = require('../models/Kyc');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const commissionService = require('../services/commissionService');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      pendingWithdrawals,
      pendingKyc,
      openTickets,
      revenueData,
      newUsersToday,
      recentUsers,
      recentWithdrawals,
      recentOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'active' }),
      Order.countDocuments({ isPaid: true }),
      Withdrawal.countDocuments({ status: 'Pending' }),
      Kyc.countDocuments({ status: 'Pending' }),
      Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, totalBV: { $sum: '$totalBV' } } }
      ]),
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('username firstName lastName email status rank createdAt'),
      Withdrawal.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'username firstName lastName'),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'username firstName lastName')
    ]);

    // Income paid out
    const incomePaidData = await Income.aggregate([
      { $match: { status: 'credited' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Weekly revenue for chart (last 7 days)
    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalOrders,
        pendingWithdrawals,
        pendingKyc,
        openTickets,
        totalRevenue: revenueData[0]?.total || 0,
        totalBV: revenueData[0]?.totalBV || 0,
        totalIncomePaid: incomePaidData[0]?.total || 0,
        newUsersToday
      },
      charts: { weeklyRevenue },
      recentData: { recentUsers, recentWithdrawals, recentOrders }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users list (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { role: 'user' };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -otp -otpExpires')
      .populate('sponsorId', 'username firstName lastName');

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp -otpExpires')
      .populate('sponsorId', 'username firstName lastName');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const wallet = await Wallet.findOne({ user: user._id });
    const orderCount = await Order.countDocuments({ user: user._id });
    const directReferrals = await User.countDocuments({ sponsorId: user._id });

    res.json({ user, wallet, orderCount, directReferrals });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user status (block, activate, suspend)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['active', 'inactive', 'suspended', 'blocked'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Notification.create({
      user: user._id,
      title: 'Account Status Updated',
      message: `Your account status has been updated to: ${status}`,
      type: 'System'
    });

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Add/Update products
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const Product = require('../models/Product');
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Create user directly
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { username, password, firstName, lastName, email, sponsorId, placement, role } = req.body;

  if (!username || !password || !firstName || !email) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    let sponsorDbId = null;
    let uplineId = null;
    let position = placement ? placement.toLowerCase() : 'left';

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
        return res.status(400).json({ message: 'Invalid Sponsor ID or Referral Code' });
      }
      sponsorDbId = sponsor._id;

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      sponsorId: sponsorDbId,
      uplineId,
      position: sponsorDbId ? position : undefined,
      role: role || 'user',
      isVerified: true,
      status: 'active'
    });

    if (user) {
      await Wallet.create({ user: user._id });

      if (user.sponsorId) {
        await commissionService.processDirectReferralBonus(user.sponsorId, user._id);
        await User.findByIdAndUpdate(user.sponsorId, { $inc: { totalDirectReferrals: 1 } });
      }

      res.status(201).json({ message: 'User created successfully', user: { _id: user._id, username: user.username, email: user.email } });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { firstName, lastName, email, role, status } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (role) user.role = role;
    if (status) user.status = status;

    const updatedUser = await user.save();
    res.json({ message: 'User updated successfully', user: { _id: updatedUser._id, username: updatedUser.username, email: updatedUser.email, role: updatedUser.role, status: updatedUser.status } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure user has no downlines
    const downlines = await User.countDocuments({ uplineId: user._id });
    if (downlines > 0) {
      return res.status(400).json({ message: 'Cannot delete user because they have placed downlines in the tree. You can block or suspend them instead.' });
    }

    await Wallet.deleteOne({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct
};
