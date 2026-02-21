const Contact = require('../models/Contact');
const ChitScheme = require('../models/ChitScheme');
const Career = require('../models/Career');

// Submit Contact Form
const submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      data: {
        id: contact._id,
        name: contact.fullName,
        email: contact.email,
        submittedAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle duplicate key errors or validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// Submit Chit Scheme Inquiry
const submitChitScheme = async (req, res) => {
  try {
    const chitScheme = new ChitScheme(req.body);
    await chitScheme.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your interest! Our representative will contact you within 24 hours with more details.',
      data: {
        id: chitScheme._id,
        name: chitScheme.fullName,
        email: chitScheme.email,
        chitAmount: chitScheme.chitAmount,
        submittedAt: chitScheme.createdAt
      }
    });
  } catch (error) {
    console.error('Chit scheme form error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// Submit Career Application
const submitCareer = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review your profile and contact you if your qualifications match our requirements.',
      data: {
        id: career._id,
        name: career.fullName,
        email: career.email,
        position: career.position,
        submittedAt: career.createdAt
      }
    });
  } catch (error) {
    console.error('Career form error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// Get all contact submissions (for admin)
const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all chit scheme submissions (for admin)
const getChitSchemeSubmissions = async (req, res) => {
  try {
    const submissions = await ChitScheme.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all career submissions (for admin)
const getCareerSubmissions = async (req, res) => {
  try {
    const submissions = await Career.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update submission status (for admin)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Similar status update functions for other models
const updateChitSchemeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const chitScheme = await ChitScheme.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!chitScheme) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: chitScheme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCareerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const career = await Career.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitContact,
  submitChitScheme,
  submitCareer,
  getContactSubmissions,
  getChitSchemeSubmissions,
  getCareerSubmissions,
  updateContactStatus,
  updateChitSchemeStatus,
  updateCareerStatus
};