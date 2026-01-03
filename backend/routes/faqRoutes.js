/**
 * FAQ Routes
 * Routes for FAQ management
 */

const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { faqValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/faq
 * @desc    Get all FAQs
 * @access  Public (shows only active) / Protected (shows all)
 */
router.get('/', optionalAuth, paginationValidation, validate, faqController.getAllFAQs);

/**
 * @route   GET /api/faq/:id
 * @desc    Get FAQ by ID
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, faqController.getFAQById);

/**
 * @route   GET /api/faq/category/:cat
 * @desc    Get FAQs by category
 * @access  Public
 */
router.get('/category/:cat', optionalAuth, faqController.getFAQsByCategory);

/**
 * @route   POST /api/faq
 * @desc    Create new FAQ
 * @access  Protected
 */
router.post('/', protect, faqValidation, validate, faqController.createFAQ);

/**
 * @route   PUT /api/faq/reorder
 * @desc    Reorder FAQs
 * @access  Protected
 */
router.put('/reorder', protect, faqController.reorderFAQs);

/**
 * @route   PUT /api/faq/:id
 * @desc    Update FAQ
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, faqController.updateFAQ);

/**
 * @route   DELETE /api/faq/:id
 * @desc    Delete FAQ
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, faqController.deleteFAQ);

/**
 * @route   DELETE /api/faq/cleanup/empty
 * @desc    Cleanup empty/invalid FAQ rows
 * @access  Protected
 */
router.delete('/cleanup/empty', faqController.cleanupFAQs); // Temporarily public for one-time cleanup

module.exports = router;
