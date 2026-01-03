const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactController');
const { validate, sanitizeBody } = require('../../middleware/validation');
const { contactValidation } = require('../../utils/validation');
const { protect, optionalAuth } = require('../../middleware/auth');

// Apply sanitization
router.use(sanitizeBody);

/**
 * @route   POST /api/public/contact
 * @desc    Submit contact form
 * @access  Public (Optional Auth)
 */
router.post('/', optionalAuth, contactValidation, validate, contactController.submitContactForm);

/**
 * @route   GET /api/public/contact/my-messages
 * @desc    Get current user's messages
 * @access  Protected
 */
router.get('/my-messages', protect, contactController.getMyMessages);

module.exports = router;
