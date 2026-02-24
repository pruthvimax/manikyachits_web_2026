const express = require('express');
const router = express.Router();


// Add these imports at the top
const { validateCareerForm } = require('../middleware/careerValidation');
const { submitCareerApplication, getCareerApplications } = require('../controllers/careerController');


const { validateChitPlanForm } = require('../middleware/validation');
const { submitChitPlan, getChitPlanSubmissions } = require('../controllers/formController');

// Import contact validation and controller
const { validateContactForm } = require('../middleware/contactValidation');
const { submitContactForm, getContactSubmissions } = require('../controllers/contactController');

// Chit Plan routes
router.post('/chit-plan', validateChitPlanForm, submitChitPlan);
router.get('/chit-plan/submissions', getChitPlanSubmissions);

// Contact form routes - ADD THESE LINES
router.post('/contact', validateContactForm, submitContactForm);
router.get('/contact/submissions', getContactSubmissions);


// Add these routes with your other routes
router.post('/career', validateCareerForm, submitCareerApplication);
router.get('/career/submissions', getCareerApplications);

module.exports = router;