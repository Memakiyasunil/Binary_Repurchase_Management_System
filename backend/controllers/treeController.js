const User = require('../models/User');

// @desc    Get user's binary tree (genealogy)
// @route   GET /api/tree/:id?
// @access  Private
const getTree = async (req, res) => {
  try {
    // If an ID is provided in params, fetch that user's tree (for admin or downline exploration)
    // Otherwise, fetch the logged-in user's tree
    const rootUserId = req.params.id || req.user._id;
    
    const rootUser = await User.findById(rootUserId).select('username firstName lastName position uplineId leftLegActive rightLegActive totalLeftMembers totalRightMembers leftBusinessVolume rightBusinessVolume status');
    
    if (!rootUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Helper function to recursively build the tree up to a certain depth (e.g., 3 levels)
    const buildTree = async (userId, currentDepth, maxDepth) => {
      if (currentDepth > maxDepth) return null;
      
      const user = await User.findById(userId).select('username firstName lastName position uplineId status leftBusinessVolume rightBusinessVolume');
      if (!user) return null;
      
      // Find left and right children
      const leftChild = await User.findOne({ uplineId: userId, position: 'left' });
      const rightChild = await User.findOne({ uplineId: userId, position: 'right' });
      
      return {
        id: user._id,
        username: user.username,
        name: `${user.firstName} ${user.lastName || ''}`,
        status: user.status,
        position: user.position,
        leftBV: user.leftBusinessVolume,
        rightBV: user.rightBusinessVolume,
        left: leftChild ? await buildTree(leftChild._id, currentDepth + 1, maxDepth) : null,
        right: rightChild ? await buildTree(rightChild._id, currentDepth + 1, maxDepth) : null,
      };
    };

    const treeData = await buildTree(rootUser._id, 1, 3); // Fetching 3 levels deep by default
    
    res.json(treeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching tree' });
  }
};

module.exports = {
  getTree,
};
