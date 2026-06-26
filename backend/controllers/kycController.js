const Kyc = require('../models/Kyc');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Submit or update KYC documents (with base64 or URL)
// @route   POST /api/kyc
// @access  Private
const submitKyc = async (req, res) => {
  const { aadhaarCardUrl, panCardUrl, passportPhotoUrl, bankPassbookUrl } = req.body;

  try {
    let kyc = await Kyc.findOne({ user: req.user._id });

    const documents = {};
    if (aadhaarCardUrl) documents['documents.aadhaarCard'] = { url: aadhaarCardUrl, verified: false };
    if (panCardUrl) documents['documents.panCard'] = { url: panCardUrl, verified: false };
    if (passportPhotoUrl) documents['documents.passportPhoto'] = { url: passportPhotoUrl, verified: false };
    if (bankPassbookUrl) documents['documents.bankPassbook'] = { url: bankPassbookUrl, verified: false };

    if (kyc) {
      kyc.status = 'Pending';
      if (aadhaarCardUrl) kyc.documents.aadhaarCard = { url: aadhaarCardUrl, verified: false };
      if (panCardUrl) kyc.documents.panCard = { url: panCardUrl, verified: false };
      if (passportPhotoUrl) kyc.documents.passportPhoto = { url: passportPhotoUrl, verified: false };
      if (bankPassbookUrl) kyc.documents.bankPassbook = { url: bankPassbookUrl, verified: false };
      await kyc.save();
    } else {
      kyc = await Kyc.create({
        user: req.user._id,
        documents: {
          aadhaarCard: aadhaarCardUrl ? { url: aadhaarCardUrl } : {},
          panCard: panCardUrl ? { url: panCardUrl } : {},
          passportPhoto: passportPhotoUrl ? { url: passportPhotoUrl } : {},
          bankPassbook: bankPassbookUrl ? { url: bankPassbookUrl } : {}
        },
        status: 'Pending'
      });
    }

    // Update user kyc status
    await User.findByIdAndUpdate(req.user._id, { kycStatus: 'Pending' });

    await Notification.create({
      user: req.user._id,
      title: 'KYC Submitted',
      message: 'Your KYC documents have been submitted and are pending review.',
      type: 'KYC'
    });

    res.json({ message: 'KYC submitted successfully', kyc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get own KYC status
// @route   GET /api/kyc
// @access  Private
const getKycStatus = async (req, res) => {
  try {
    const kyc = await Kyc.findOne({ user: req.user._id });
    if (!kyc) {
      return res.json({ status: 'Not Submitted', documents: {} });
    }
    res.json(kyc);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all KYC applications
// @route   GET /api/kyc/admin/all
// @access  Private/Admin
const getAllKyc = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const kycs = await Kyc.find(filter)
      .populate('user', 'username firstName lastName email mobile')
      .sort({ createdAt: -1 });

    res.json(kycs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Approve or reject KYC
// @route   PUT /api/kyc/admin/:id
// @access  Private/Admin
const processKyc = async (req, res) => {
  const { status, adminRemarks } = req.body;

  try {
    const kyc = await Kyc.findById(req.params.id).populate('user');
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });

    kyc.status = status;
    kyc.adminRemarks = adminRemarks;
    if (status === 'Approved') kyc.verifiedAt = Date.now();
    await kyc.save();

    // Update user KYC status
    await User.findByIdAndUpdate(kyc.user._id, { kycStatus: status });

    await Notification.create({
      user: kyc.user._id,
      title: `KYC ${status}`,
      message: status === 'Approved'
        ? 'Congratulations! Your KYC has been approved. You can now make withdrawals.'
        : `Your KYC has been ${status.toLowerCase()}. Reason: ${adminRemarks || 'Please contact support.'}`,
      type: 'KYC'
    });

    res.json({ message: `KYC ${status.toLowerCase()} successfully`, kyc });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitKyc, getKycStatus, getAllKyc, processKyc };
