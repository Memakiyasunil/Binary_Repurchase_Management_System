const Withdrawal = require('../models/Withdrawal');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Request a withdrawal
// @route   POST /api/withdrawals
// @access  Private
const requestWithdrawal = async (req, res) => {
  const { amount, userRemarks } = req.body;
  const minWithdrawal = 500;

  if (!amount || amount < minWithdrawal) {
    return res.status(400).json({ message: `Minimum withdrawal amount is ₹${minWithdrawal}` });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct from wallet (hold)
    wallet.balance -= amount;
    wallet.pendingWithdrawals += amount;
    await wallet.save();

    // Create transaction record
    await Transaction.create({
      wallet: wallet._id,
      user: req.user._id,
      type: 'debit',
      amount,
      balanceAfter: wallet.balance,
      remarks: 'Withdrawal request submitted'
    });

    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      wallet: wallet._id,
      amount,
      userRemarks,
      status: 'Pending'
    });

    await Notification.create({
      user: req.user._id,
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request of ₹${amount} has been submitted and is pending admin approval.`,
      type: 'Withdrawal'
    });

    res.status(201).json({ message: 'Withdrawal request submitted successfully', withdrawal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's withdrawal history
// @route   GET /api/withdrawals
// @access  Private
const getUserWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Withdrawal.countDocuments({ user: req.user._id });
    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ withdrawals, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all withdrawal requests
// @route   GET /api/withdrawals/admin/all
// @access  Private/Admin
const getAllWithdrawals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Withdrawal.countDocuments(filter);
    const withdrawals = await Withdrawal.find(filter)
      .populate('user', 'username firstName lastName email bankDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ withdrawals, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Approve or reject a withdrawal
// @route   PUT /api/withdrawals/admin/:id
// @access  Private/Admin
const processWithdrawal = async (req, res) => {
  const { status, adminRemarks } = req.body;
  const validStatuses = ['Approved', 'Rejected', 'Processing', 'Hold'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const withdrawal = await Withdrawal.findById(req.params.id).populate('user');
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    if (withdrawal.status !== 'Pending' && withdrawal.status !== 'Processing') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = status;
    withdrawal.adminRemarks = adminRemarks;
    withdrawal.processedAt = Date.now();
    await withdrawal.save();

    const wallet = await Wallet.findById(withdrawal.wallet);

    if (status === 'Approved') {
      wallet.pendingWithdrawals -= withdrawal.amount;
      wallet.totalWithdrawals += withdrawal.amount;
      await wallet.save();

      await Notification.create({
        user: withdrawal.user._id,
        title: 'Withdrawal Approved!',
        message: `Your withdrawal of ₹${withdrawal.amount} has been approved and will be transferred to your bank account.`,
        type: 'Withdrawal'
      });
    } else if (status === 'Rejected') {
      // Refund amount back to wallet
      wallet.balance += withdrawal.amount;
      wallet.pendingWithdrawals -= withdrawal.amount;
      await wallet.save();

      await Transaction.create({
        wallet: wallet._id,
        user: withdrawal.user._id,
        type: 'credit',
        amount: withdrawal.amount,
        balanceAfter: wallet.balance,
        remarks: `Withdrawal rejected - Amount refunded. Reason: ${adminRemarks || 'Not specified'}`
      });

      await Notification.create({
        user: withdrawal.user._id,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal of ₹${withdrawal.amount} has been rejected. Reason: ${adminRemarks || 'Contact support for details'}. Amount refunded to wallet.`,
        type: 'Withdrawal'
      });
    }

    res.json({ message: `Withdrawal ${status.toLowerCase()} successfully`, withdrawal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requestWithdrawal, getUserWithdrawals, getAllWithdrawals, processWithdrawal };
