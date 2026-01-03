/**
 * Product Routes
 * Routes for product management
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { productValidation, idParamValidation, slugParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public (shows only active) / Protected (shows all)
 */
router.get('/', optionalAuth, paginationValidation, validate, productController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public (active only) / Protected (all)
 */
router.get('/:id', optionalAuth, idParamValidation, validate, productController.getProductById);

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get product by slug
 * @access  Public (active only) / Protected (all)
 */
router.get('/slug/:slug', optionalAuth, slugParamValidation, validate, productController.getProductBySlug);

/**
 * @route   GET /api/products/category/:cat
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:cat', paginationValidation, validate, productController.getProductsByCategory);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Protected
 */
router.post('/', protect, productValidation, validate, productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, productController.deleteProduct);

module.exports = router;
