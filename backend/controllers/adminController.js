const User = require('../models/User');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const Income = require('../models/Income');
const Kyc = require('../models/Kyc');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');

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

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  createProduct,
  updateProduct,
  deleteProduct
};
