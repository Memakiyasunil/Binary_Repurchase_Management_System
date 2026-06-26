const express = require('express');
const router = express.Router();
const { getUserIncome, getAllIncomes } = require('../controllers/incomeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getUserIncome);
router.get('/admin/all', protect, admin, getAllIncomes);

module.exports = router;
