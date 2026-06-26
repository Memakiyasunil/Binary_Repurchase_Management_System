const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  content: {
    type: String, // Stores HTML or Rich Text from the CMS editor
    required: true
  },
  metaTags: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin ID
  }
}, { timestamps: true });

// Middleware to auto-generate slug if not provided
pageSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Page', pageSchema);
