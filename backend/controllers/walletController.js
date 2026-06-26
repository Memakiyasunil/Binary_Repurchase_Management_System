const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get wallet & transaction history
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ wallet, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all transactions (paginated)
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ user: req.user._id });
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all wallets summary
// @route   GET /api/wallet/admin/all
// @access  Private/Admin
const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find()
      .populate('user', 'username firstName lastName email status')
      .sort({ balance: -1 });

    const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
    const totalEarnings = wallets.reduce((acc, w) => acc + w.totalEarnings, 0);
    const totalWithdrawals = wallets.reduce((acc, w) => acc + w.totalWithdrawals, 0);

    res.json({ wallets, stats: { totalBalance, totalEarnings, totalWithdrawals } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWallet, getTransactions, getAllWallets };
