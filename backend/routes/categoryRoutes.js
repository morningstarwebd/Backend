/**
 * Category Routes
 * Routes for category management
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { categoryValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public (shows only active) / Protected (shows all)
 */
router.get('/', optionalAuth, paginationValidation, validate, categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, categoryController.getCategoryById);

/**
 * @route   GET /api/categories/type/:type
 * @desc    Get categories by type (blog, product, faq)
 * @access  Public
 */
router.get('/type/:type', optionalAuth, categoryController.getCategoriesByType);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Protected
 */
router.post('/', protect, categoryValidation, validate, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, categoryController.deleteCategory);

module.exports = router;
