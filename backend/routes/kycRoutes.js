const express = require('express');
const router = express.Router();
const { submitKyc, getKycStatus, getAllKyc, processKyc } = require('../controllers/kycController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitKyc);
router.get('/', protect, getKycStatus);
router.get('/admin/all', protect, admin, getAllKyc);
router.put('/admin/:id', protect, admin, processKyc);

module.exports = router;
