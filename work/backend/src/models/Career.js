const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: [true, 'Position applied for is required'],
    trim: true,
    enum: {
      values: ['Sales Executive', 'Branch Manager', 'Customer Support', 'Field Officer', 'Accounts Executive', 'Other'],
      message: 'Please select a valid position'
    }
  },
  experience: {
    type: String,
    required: [true, 'Years of experience is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  currentLocation: {
    type: String,
    required: [true, 'Current location is required'],
    trim: true
  },
  resumeLink: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'shortlisted', 'rejected', 'hired'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Career', careerSchema);