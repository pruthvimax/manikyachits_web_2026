const ChitScheme = require('../models/ChitScheme');

// ONLY this one function
const submitChitPlan = async (req, res) => {
  try {
    const chitPlan = new ChitScheme(req.body);
    await chitPlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you! Our advisor will contact you shortly.',
      data: {
        id: chitPlan._id,
        name: chitPlan.name,
        mobile: chitPlan.mobile,
        email: chitPlan.email,
        submittedAt: chitPlan.createdAt
      }
    });
  } catch (error) {
    console.error('Chit plan form error:', error);
    
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

// Optional: To view submissions (for testing)
const getChitPlanSubmissions = async (req, res) => {
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

module.exports = {
  submitChitPlan,
  getChitPlanSubmissions  // Optional, for testing
};