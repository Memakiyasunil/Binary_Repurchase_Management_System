const express = require('express');
const router = express.Router();
const { requestWithdrawal, getUserWithdrawals, getAllWithdrawals, processWithdrawal } = require('../controllers/withdrawalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, requestWithdrawal);
router.get('/', protect, getUserWithdrawals);
router.get('/admin/all', protect, admin, getAllWithdrawals);
router.put('/admin/:id', protect, admin, processWithdrawal);

module.exports = router;
