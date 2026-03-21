const { body, validationResult } = require('express-validator');

const validateFeedback = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('category').isIn(['general', 'service', 'app', 'payment', 'chit', 'suggestion', 'complaint']).withMessage('Invalid category'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('message').notEmpty().withMessage('Message is required').trim().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateFeedback };