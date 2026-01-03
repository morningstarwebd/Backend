const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactController');
const { validate, sanitizeBody } = require('../../middleware/validation');
const { contactValidation } = require('../../utils/validation');

// Apply sanitization
router.use(sanitizeBody);

/**
 * @route   POST /api/public/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', contactValidation, validate, contactController.submitContactForm);

module.exports = router;
