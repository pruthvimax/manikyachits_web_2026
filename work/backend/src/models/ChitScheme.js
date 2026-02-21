const mongoose = require('mongoose');

const chitSchemeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 digits']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  chitAmount: {
    type: String,
    required: [true, 'Chit amount preference is required'],
    enum: {
      values: ['50,000', '1,00,000', '2,00,000', '5,00,000', '10,00,000', 'Other'],
      message: 'Please select a valid chit amount'
    }
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'lost'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChitScheme', chitSchemeSchema);