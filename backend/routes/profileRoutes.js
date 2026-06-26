const express = require('express');
const router = express.Router();
const { updateProfile, updateBankDetails, updateNominee, changePassword, getReferralInfo } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.put('/', protect, updateProfile);
router.put('/bank', protect, updateBankDetails);
router.put('/nominee', protect, updateNominee);
router.put('/change-password', protect, changePassword);
router.get('/referral', protect, getReferralInfo);

module.exports = router;
