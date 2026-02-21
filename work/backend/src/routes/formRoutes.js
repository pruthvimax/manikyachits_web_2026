const express = require('express');
const router = express.Router();  // ← THIS LINE WAS MISSING!

const { validateChitPlanForm } = require('../middleware/validation');
const { submitChitPlan, getChitPlanSubmissions } = require('../controllers/formController');

// POST - Submit chit plan form
router.post('/chit-plan', validateChitPlanForm, submitChitPlan);

// GET - View submissions (for testing)
router.get('/chit-plan/submissions', getChitPlanSubmissions);

module.exports = router;  // Export the router