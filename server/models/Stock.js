const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Search performance साठी index
stockSchema.index({ symbol: 'text', name: 'text' });

module.exports = mongoose.model('Stock', stockSchema);