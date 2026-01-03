/**
 * Contact Routes
 * Routes for contact form and message management
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { contactValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', contactValidation, validate, contactController.submitContactForm);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Protected
 */
router.get('/', protect, paginationValidation, validate, contactController.getAllMessages);

/**
 * @route   GET /api/contact/:id
 * @desc    Get single message
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, contactController.getMessageById);

/**
 * @route   PUT /api/contact/bulk-status
 * @desc    Bulk update message status
 * @access  Protected
 */
router.put('/bulk-status', protect, contactController.bulkUpdateStatus);

/**
 * @route   PUT /api/contact/:id/status
 * @desc    Update message status
 * @access  Protected
 */
router.put('/:id/status', protect, idParamValidation, validate, contactController.updateMessageStatus);

/**
 * @route   DELETE /api/contact
 * @desc    Bulk delete messages
 * @access  Protected
 */
router.delete('/', protect, contactController.bulkDeleteMessages);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete single message
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, contactController.deleteMessage);

module.exports = router;
