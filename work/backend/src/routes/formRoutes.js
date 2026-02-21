const express = require('express');
const router = express.Router();
const {
  validateContactForm,
  validateChitSchemeForm,
  validateCareerForm
} = require('../middleware/validation');
const {
  submitContact,
  submitChitScheme,
  submitCareer,
  getContactSubmissions,
  getChitSchemeSubmissions,
  getCareerSubmissions,
  updateContactStatus,
  updateChitSchemeStatus,
  updateCareerStatus
} = require('../controllers/formController');

// Public routes (for form submissions)
router.post('/contact', validateContactForm, submitContact);
router.post('/chit-scheme', validateChitSchemeForm, submitChitScheme);
router.post('/career', validateCareerForm, submitCareer);

// Admin routes (to view submissions) - You can add authentication later
router.get('/admin/contact', getContactSubmissions);
router.get('/admin/chit-scheme', getChitSchemeSubmissions);
router.get('/admin/career', getCareerSubmissions);

// Admin routes to update status
router.patch('/admin/contact/:id/status', updateContactStatus);
router.patch('/admin/chit-scheme/:id/status', updateChitSchemeStatus);
router.patch('/admin/career/:id/status', updateCareerStatus);

module.exports = router;