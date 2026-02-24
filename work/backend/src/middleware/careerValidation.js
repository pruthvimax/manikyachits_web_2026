const validateCareerForm = (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, jobRole, comments } = req.body;
  const errors = [];

  // First Name validation
  if (!firstName) {
    errors.push('First name is required');
  } else if (firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  // Last Name validation
  if (!lastName) {
    errors.push('Last name is required');
  } else if (lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneNumber) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phoneNumber.trim())) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }

  // Job Role validation
  const validRoles = ['Business Development Manager', 'Assistant Manager', 'Sales Executive', 'Customer Support'];
  if (!jobRole) {
    errors.push('Job role is required');
  } else if (!validRoles.includes(jobRole)) {
    errors.push('Please select a valid job role');
  }

  // Comments validation (optional)
  if (comments && comments.trim().length > 500) {
    errors.push('Comments cannot exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.phoneNumber = phoneNumber.trim();
  req.body.comments = comments ? comments.trim() : '';
  
  next();
};

module.exports = { validateCareerForm };