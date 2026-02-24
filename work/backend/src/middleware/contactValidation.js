const validateContactForm = (req, res, next) => {
  const { fullName, phoneNumber, email, subject, message } = req.body;
  const errors = [];

  // Full Name validation
  if (!fullName) {
    errors.push('Full name is required');
  } else if (fullName.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Phone validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phoneNumber.trim())) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  // Subject validation
  const validSubjects = ['chit-info', 'existing-customer', 'new-account', 'auction', 'payment', 'technical', 'other'];
  if (!subject) {
    errors.push('Subject is required');
  } else if (!validSubjects.includes(subject)) {
    errors.push('Please select a valid subject');
  }

  // Message validation
  if (!message) {
    errors.push('Message is required');
  } else if (message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.fullName = fullName.trim();
  req.body.phoneNumber = phoneNumber.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.message = message.trim();
  req.body.newsletter = req.body.newsletter === 'on' || req.body.newsletter === true;
  
  next();
};

module.exports = { validateContactForm };