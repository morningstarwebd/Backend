const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactController');
const { protect } = require('../../middleware/auth');
const { validate, sanitizeBody } = require('../../middleware/validation');
const { idParamValidation, paginationValidation } = require('../../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/admin/contact
 * @desc    Get all contact messages
 * @access  Protected
 */
router.get('/', protect, paginationValidation, validate, contactController.getAllMessages);

/**
 * @route   GET /api/admin/contact/:id
 * @desc    Get single message
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, contactController.getMessageById);

/**
 * @route   PUT /api/admin/contact/bulk-status
 * @desc    Bulk update message status
 * @access  Protected
 */
router.put('/bulk-status', protect, contactController.bulkUpdateStatus);

/**
 * @route   PUT /api/admin/contact/:id/status
 * @desc    Update message status
 * @access  Protected
 */
router.put('/:id/status', protect, idParamValidation, validate, contactController.updateMessageStatus);

/**
 * @route   DELETE /api/admin/contact
 * @desc    Bulk delete messages
 * @access  Protected
 */
router.delete('/', protect, contactController.bulkDeleteMessages);

/**
 * @route   DELETE /api/admin/contact/:id
 * @desc    Delete single message
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, contactController.deleteMessage);

module.exports = router;
