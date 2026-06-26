const express = require('express');
const router = express.Router();
const { registerUser, verifyOTP, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
