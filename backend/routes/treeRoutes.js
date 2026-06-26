const express = require('express');
const router = express.Router();
const { getTree } = require('../controllers/treeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTree);
router.get('/:id', protect, getTree);

module.exports = router;
