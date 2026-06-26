const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getUserById, updateUserStatus, createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const { getAllWithdrawals, processWithdrawal } = require('../controllers/withdrawalController');
const { getAllKyc, processKyc } = require('../controllers/kycController');
const { getAllTickets } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard
router.get('/stats', protect, admin, getDashboardStats);

// Users
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id/status', protect, admin, updateUserStatus);

// Withdrawals
router.get('/withdrawals', protect, admin, getAllWithdrawals);
router.put('/withdrawals/:id', protect, admin, processWithdrawal);

// KYC
router.get('/kyc', protect, admin, getAllKyc);
router.put('/kyc/:id', protect, admin, processKyc);

// Tickets
router.get('/tickets', protect, admin, getAllTickets);

// Products
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);

module.exports = router;
