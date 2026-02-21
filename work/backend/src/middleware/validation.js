// ONLY this one function - nothing else
const validateChitPlanForm = (req, res, next) => {
  const { mobile, name, email } = req.body;
  const errors = [];

  // Mobile validation
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobile) {
    errors.push('Mobile number is required');
  } else if (!mobileRegex.test(mobile.trim())) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }

  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.mobile = mobile.trim();
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  
  next();
};

module.exports = {
  validateChitPlanForm  // Only export what you need
};