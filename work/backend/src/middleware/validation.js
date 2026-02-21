const validateContactForm = (req, res, next) => {
  const { fullName, email, phone, message } = req.body;
  const errors = [];

  // Name validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  // Phone validation
  const phoneRegex = /^\d{10,15}$/;
  if (!phone || !phoneRegex.test(phone.replace(/[+\-\s]/g, ''))) {
    errors.push('Valid phone number is required (10-15 digits)');
  }

  // Message validation
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push('Message must be at least 5 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.fullName = fullName.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.phone = phone.trim();
  req.body.message = message.trim();
  
  next();
};

const validateChitSchemeForm = (req, res, next) => {
  const { fullName, email, phone, city, chitAmount } = req.body;
  const errors = [];

  // Name validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  // Phone validation
  const phoneRegex = /^\d{10,15}$/;
  if (!phone || !phoneRegex.test(phone.replace(/[+\-\s]/g, ''))) {
    errors.push('Valid phone number is required (10-15 digits)');
  }

  // City validation
  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    errors.push('City is required');
  }

  // Chit amount validation
  const validAmounts = ['50,000', '1,00,000', '2,00,000', '5,00,000', '10,00,000', 'Other'];
  if (!chitAmount || !validAmounts.includes(chitAmount)) {
    errors.push('Please select a valid chit amount');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.fullName = fullName.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.phone = phone.trim();
  req.body.city = city.trim();
  if (req.body.message) {
    req.body.message = req.body.message.trim();
  }
  
  next();
};

const validateCareerForm = (req, res, next) => {
  const { fullName, email, phone, position, experience, qualification, currentLocation } = req.body;
  const errors = [];

  // Name validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  // Phone validation
  const phoneRegex = /^\d{10,15}$/;
  if (!phone || !phoneRegex.test(phone.replace(/[+\-\s]/g, ''))) {
    errors.push('Valid phone number is required (10-15 digits)');
  }

  // Position validation
  const validPositions = ['Sales Executive', 'Branch Manager', 'Customer Support', 'Field Officer', 'Accounts Executive', 'Other'];
  if (!position || !validPositions.includes(position)) {
    errors.push('Please select a valid position');
  }

  // Experience validation
  if (!experience || typeof experience !== 'string' || experience.trim().length < 1) {
    errors.push('Experience is required');
  }

  // Qualification validation
  if (!qualification || typeof qualification !== 'string' || qualification.trim().length < 2) {
    errors.push('Qualification is required');
  }

  // Current location validation
  if (!currentLocation || typeof currentLocation !== 'string' || currentLocation.trim().length < 2) {
    errors.push('Current location is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors 
    });
  }

  // Clean data
  req.body.fullName = fullName.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.phone = phone.trim();
  req.body.position = position;
  req.body.experience = experience.trim();
  req.body.qualification = qualification.trim();
  req.body.currentLocation = currentLocation.trim();
  if (req.body.resumeLink) {
    req.body.resumeLink = req.body.resumeLink.trim();
  }
  if (req.body.message) {
    req.body.message = req.body.message.trim();
  }
  
  next();
};

module.exports = {
  validateContactForm,
  validateChitSchemeForm,
  validateCareerForm
};