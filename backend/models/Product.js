const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Health Products', 'Digital Products', 'Educational Products', 'Membership Plans', 'Subscription Packages'],
    required: true
  },
  image: {
    type: String, // URL to S3 or Cloudinary
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  bv: { // Business Volume
    type: Number,
    required: true,
    default: 0
  },
  pv: { // Point Value
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
