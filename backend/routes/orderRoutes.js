const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/admin/:id', protect, admin, updateOrderStatus);

module.exports = router;
