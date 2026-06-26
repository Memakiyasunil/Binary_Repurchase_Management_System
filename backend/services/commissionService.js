const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Income = require('../models/Income');
const Notification = require('../models/Notification');

// Direct Referral Bonus Rate
const DIRECT_REFERRAL_BONUS = 200; // Fixed ₹200 per direct referral

// Binary Matching Bonus Rate (% of matched BV)
const BINARY_MATCHING_RATE = 0.10; // 10%

// Repurchase Bonus Rate
const REPURCHASE_BONUS_RATE = 0.05; // 5% of order value to sponsor

// Helper: Credit wallet and create transaction
const creditWallet = async (userId, amount, remarks) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId });
  }

  wallet.balance += amount;
  wallet.totalEarnings += amount;
  await wallet.save();

  await Transaction.create({
    wallet: wallet._id,
    user: userId,
    type: 'credit',
    amount,
    balanceAfter: wallet.balance,
    remarks
  });

  return wallet;
};

// @desc Process Direct Referral Bonus when a new user joins under a sponsor
const processDirectReferralBonus = async (sponsorId, newUserId) => {
  try {
    const income = await Income.create({
      user: sponsorId,
      incomeType: 'Direct Referral',
      amount: DIRECT_REFERRAL_BONUS,
      sourceUser: newUserId,
      description: `Direct referral bonus for introducing a new member`,
      status: 'credited'
    });

    await creditWallet(sponsorId, DIRECT_REFERRAL_BONUS, `Direct Referral Bonus`);

    await Notification.create({
      user: sponsorId,
      title: 'Direct Referral Bonus Credited!',
      message: `₹${DIRECT_REFERRAL_BONUS} has been credited to your wallet as a Direct Referral Bonus.`,
      type: 'Income'
    });

    return income;
  } catch (error) {
    console.error('Error processing direct referral bonus:', error);
  }
};

// @desc Process Binary Matching Bonus when an order is placed
const processBinaryMatchingBonus = async (userId, orderBV, orderId) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || !user.uplineId) return;

    // Update BV for upline
    const upline = await User.findById(user.uplineId);
    if (!upline) return;

    if (user.position === 'left') {
      upline.leftBusinessVolume += orderBV;
    } else if (user.position === 'right') {
      upline.rightBusinessVolume += orderBV;
    }

    // Calculate matched BV
    const matchedBV = Math.min(upline.leftBusinessVolume, upline.rightBusinessVolume);
    const newMatchedBV = matchedBV - upline.matchedBusinessVolume;

    if (newMatchedBV > 0) {
      const bonusAmount = Math.floor(newMatchedBV * BINARY_MATCHING_RATE);
      upline.matchedBusinessVolume = matchedBV;
      await upline.save();

      if (bonusAmount > 0) {
        await Income.create({
          user: upline._id,
          incomeType: 'Binary Matching',
          amount: bonusAmount,
          matchedBV: newMatchedBV,
          bonusPercentage: BINARY_MATCHING_RATE * 100,
          sourceOrder: orderId,
          description: `Binary Matching Bonus on ${newMatchedBV} matched BV`,
          status: 'credited'
        });

        await creditWallet(upline._id, bonusAmount, `Binary Matching Bonus (${newMatchedBV} BV)`);

        await Notification.create({
          user: upline._id,
          title: 'Binary Matching Bonus Credited!',
          message: `₹${bonusAmount} has been credited as Binary Matching Bonus on ${newMatchedBV} matched BV.`,
          type: 'Income'
        });
      }
    } else {
      await upline.save();
    }

    // Update member counts for upline's upline recursively (up to 5 levels)
    await updateTreeStats(userId, orderBV, 0, 5);

  } catch (error) {
    console.error('Error processing binary matching bonus:', error);
  }
};

// @desc Process Repurchase Bonus for sponsor
const processRepurchaseBonus = async (userId, orderAmount, orderId) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || !user.sponsorId) return;

    const bonusAmount = Math.floor(orderAmount * REPURCHASE_BONUS_RATE);
    if (bonusAmount <= 0) return;

    await Income.create({
      user: user.sponsorId,
      incomeType: 'Repurchase Bonus',
      amount: bonusAmount,
      sourceUser: userId,
      sourceOrder: orderId,
      description: `Repurchase Bonus on order by ${user.username}`,
      status: 'credited'
    });

    await creditWallet(user.sponsorId, bonusAmount, `Repurchase Bonus from ${user.username}'s order`);

    await Notification.create({
      user: user.sponsorId,
      title: 'Repurchase Bonus Credited!',
      message: `₹${bonusAmount} has been credited as Repurchase Bonus.`,
      type: 'Income'
    });

  } catch (error) {
    console.error('Error processing repurchase bonus:', error);
  }
};

// @desc Recursively update tree statistics up the tree
const updateTreeStats = async (userId, bv, depth, maxDepth) => {
  if (depth >= maxDepth) return;
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || !user.uplineId) return;

    const upline = await User.findById(user.uplineId);
    if (!upline) return;

    if (user.position === 'left') {
      upline.totalLeftMembers += 1;
      upline.leftBusinessVolume += bv;
    } else {
      upline.totalRightMembers += 1;
      upline.rightBusinessVolume += bv;
    }
    await upline.save();

    await updateTreeStats(upline._id, bv, depth + 1, maxDepth);
  } catch (error) {
    console.error('Tree stats update error:', error);
  }
};

module.exports = {
  processDirectReferralBonus,
  processBinaryMatchingBonus,
  processRepurchaseBonus,
  creditWallet
};
