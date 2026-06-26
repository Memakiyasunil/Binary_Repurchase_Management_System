const Income = require('../models/Income');

// @desc    Get user income history
// @route   GET /api/income
// @access  Private
const getUserIncome = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { type } = req.query;

    const filter = { user: req.user._id, status: 'credited' };
    if (type) filter.incomeType = type;

    const total = await Income.countDocuments(filter);
    const incomes = await Income.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sourceUser', 'username firstName lastName')
      .populate('sourceOrder', 'totalPrice');

    // Summary by type
    const summary = await Income.aggregate([
      { $match: { user: req.user._id, status: 'credited' } },
      {
        $group: {
          _id: '$incomeType',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = summary.reduce((acc, s) => acc + s.total, 0);

    res.json({ incomes, total, page, pages: Math.ceil(total / limit), summary, totalIncome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all incomes
// @route   GET /api/income/admin/all
// @access  Private/Admin
const getAllIncomes = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = type ? { incomeType: type } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Income.countDocuments(filter);
    const incomes = await Income.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username firstName lastName email')
      .populate('sourceUser', 'username firstName lastName');

    const totalPaid = await Income.aggregate([
      { $match: { status: 'credited' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      incomes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      totalPaid: totalPaid[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserIncome, getAllIncomes };
