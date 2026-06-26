const Order = require('../models/Order');
const Product = require('../models/Product');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const commissionService = require('../services/commissionService');

// @desc    Create new order (Repurchase)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Fetch product details from DB to get official prices
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
      return res.status(400).json({ message: 'One or more products not found' });
    }

    let totalPrice = 0;
    let totalBV = 0;
    let totalPV = 0;

    const enrichedItems = orderItems.map(item => {
      const product = products.find(p => p._id.toString() === item.product);
      if (!product) throw new Error('Product not found');
      totalPrice += product.price * item.qty;
      totalBV += product.bv * item.qty;
      totalPV += product.pv * item.qty;
      return {
        name: product.name,
        qty: item.qty,
        price: product.price,
        bv: product.bv,
        pv: product.pv,
        product: product._id
      };
    });

    // Handle wallet payment
    if (paymentMethod === 'Wallet' || !paymentMethod) {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet || wallet.balance < totalPrice) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      wallet.balance -= totalPrice;
      await wallet.save();

      await Transaction.create({
        wallet: wallet._id,
        user: req.user._id,
        type: 'debit',
        amount: totalPrice,
        balanceAfter: wallet.balance,
        remarks: `Order payment for ${orderItems.length} item(s)`
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: enrichedItems,
      shippingAddress: shippingAddress || { address: 'N/A', city: 'N/A', postalCode: '000000', country: 'India' },
      paymentMethod: paymentMethod || 'Wallet',
      totalPrice,
      totalBV,
      totalPV,
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'Processing'
    });

    // Fire commission engine
    await commissionService.processBinaryMatchingBonus(req.user._id, totalBV, order._id);
    await commissionService.processRepurchaseBonus(req.user._id, totalPrice, order._id);

    await Notification.create({
      user: req.user._id,
      title: 'Order Placed Successfully!',
      message: `Your order of ₹${totalPrice} has been placed and is being processed.`,
      type: 'Purchase'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username firstName lastName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username firstName lastName email');

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update order status
// @route   PUT /api/orders/admin/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    if (req.body.orderStatus === 'Completed') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    await order.save();

    await Notification.create({
      user: order.user,
      title: 'Order Status Updated',
      message: `Your order status has been updated to: ${order.orderStatus}`,
      type: 'Purchase'
    });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };
