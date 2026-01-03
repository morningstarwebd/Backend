/**
 * Blog Routes
 * Routes for blog post management
 */

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { blogValidation, idParamValidation, slugParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/blog
 * @desc    Get all blog posts
 * @access  Public (shows only published) / Protected (shows all)
 */
router.get('/', optionalAuth, paginationValidation, validate, blogController.getAllPosts);

/**
 * @route   GET /api/blog/:id
 * @desc    Get single blog post by ID
 * @access  Public (published only) / Protected (all)
 */
router.get('/:id', optionalAuth, idParamValidation, validate, blogController.getPostById);

/**
 * @route   GET /api/blog/slug/:slug
 * @desc    Get blog post by slug
 * @access  Public (published only) / Protected (all)
 */
router.get('/slug/:slug', optionalAuth, slugParamValidation, validate, blogController.getPostBySlug);

/**
 * @route   GET /api/blog/category/:cat
 * @desc    Get blog posts by category
 * @access  Public
 */
router.get('/category/:cat', paginationValidation, validate, blogController.getPostsByCategory);

/**
 * @route   POST /api/blog
 * @desc    Create new blog post
 * @access  Protected
 */
router.post('/', protect, blogValidation, validate, blogController.createPost);

/**
 * @route   PUT /api/blog/:id
 * @desc    Update blog post
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, blogController.updatePost);

/**
 * @route   DELETE /api/blog/:id
 * @desc    Delete blog post
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, blogController.deletePost);

/**
 * @route   PUT /api/blog/:id/view
 * @desc    Increment view count
 * @access  Public
 */
router.put('/:id/view', idParamValidation, validate, blogController.incrementViewCount);

module.exports = router;
