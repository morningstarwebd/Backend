/**
 * Content Routes
 * Routes for website content management
 */

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { contentValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/content
 * @desc    Get all content
 * @access  Protected
 */
router.get('/', protect, paginationValidation, validate, contentController.getAllContent);

/**
 * @route   GET /api/content/:id
 * @desc    Get content by ID
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, contentController.getContentById);

/**
 * @route   GET /api/content/page/:page
 * @desc    Get content by page name
 * @access  Protected
 */
router.get('/page/:page', protect, contentController.getContentByPage);

/**
 * @route   POST /api/content
 * @desc    Create new content
 * @access  Protected
 */
router.post('/', protect, contentValidation, validate, contentController.createContent);

/**
 * @route   PUT /api/content/:id
 * @desc    Update content
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, contentController.updateContent);

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, contentController.deleteContent);

module.exports = router;
