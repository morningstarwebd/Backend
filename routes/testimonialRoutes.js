/**
 * Testimonial Routes
 * Routes for testimonial management
 */

const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { testimonialValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials
 * @access  Public (shows only active) / Protected (shows all)
 */
router.get('/', optionalAuth, paginationValidation, validate, testimonialController.getAllTestimonials);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get testimonial by ID
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, testimonialController.getTestimonialById);

/**
 * @route   POST /api/testimonials
 * @desc    Create new testimonial
 * @access  Protected
 */
router.post('/', protect, testimonialValidation, validate, testimonialController.createTestimonial);

/**
 * @route   PUT /api/testimonials/reorder
 * @desc    Reorder testimonials
 * @access  Protected
 */
router.put('/reorder', protect, testimonialController.reorderTestimonials);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, testimonialController.updateTestimonial);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, testimonialController.deleteTestimonial);

module.exports = router;
