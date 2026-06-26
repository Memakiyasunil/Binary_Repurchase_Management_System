const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password, firstName, email, mobile, sponsorUsername, position } = req.body;

  if (!username || !password || !firstName || !email || !mobile) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }, { mobile }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email, username, or mobile' });
    }

    let sponsorId = null;
    let uplineId = null;

    // Verify Sponsor and determine Upline placement
    if (sponsorUsername) {
      const sponsor = await User.findOne({ username: sponsorUsername });
      if (!sponsor) {
        return res.status(400).json({ message: 'Invalid Sponsor Username' });
      }
      sponsorId = sponsor._id;
      
      // Binary Tree Placement Logic: Find extreme left or right node
      let currentNode = sponsor;
      let targetPosition = position || 'left';
      
      while (true) {
        const child = await User.findOne({ uplineId: currentNode._id, position: targetPosition });
        if (!child) {
           uplineId = currentNode._id;
           break;
        }
        currentNode = child;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      firstName,
      email,
      mobile,
      password: hashedPassword,
      sponsorId,
      uplineId,
      position: position || 'left'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user email or username
    const user = await User.findOne({ 
      $or: [{ email: username }, { username: username }] 
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      if(user.status === 'blocked' || user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended or blocked.' });
      }

      res.json({
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
