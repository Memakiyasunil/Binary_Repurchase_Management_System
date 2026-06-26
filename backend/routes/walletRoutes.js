const express = require('express');
const router = express.Router();
const { getWallet, getTransactions, getAllWallets } = require('../controllers/walletController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.get('/transactions', protect, getTransactions);
router.get('/admin/all', protect, admin, getAllWallets);

module.exports = router;
