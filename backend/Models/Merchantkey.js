const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true
  },
  apiKey: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(10).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  balance:{
    type:Number,
    default:0,
  },
  total_payin:{
    type:Number,
    default:0,
  },
  total_payout:{
    type:Number,
    default:0,
  },
    withdrawCommission: {
    type: Number,
  },
  depositCommission: {
    type: Number,
  },
  getwaycost:{
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Merchant', merchantSchema);