const Career = require('../models/Career');

const submitCareerApplication = async (req, res) => {
  try {
    console.log('Career application received:', req.body);
    
    const application = new Career(req.body);
    await application.save();
    
    console.log('Career application saved successfully:', application._id);
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your application! We will review your profile and contact you soon.',
      data: {
        id: application._id,
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        jobRole: application.jobRole,
        submittedAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Career application error:', error);
    
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

const getCareerApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  submitCareerApplication,
  getCareerApplications
};