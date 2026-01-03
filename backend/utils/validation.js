/**
 * Validation Schemas
 * Express-validator schema definitions for all entities
 */

const { body, param, query } = require('express-validator');

// ============================================
// AUTH VALIDATION
// ============================================

const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number'),
    body('role')
        .optional()
        .isIn(['super_admin', 'admin', 'editor', 'viewer']).withMessage('Invalid role')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('New password must contain a lowercase letter')
        .matches(/[A-Z]/).withMessage('New password must contain an uppercase letter')
        .matches(/[0-9]/).withMessage('New password must contain a number')
];

// ============================================
// CONTENT VALIDATION
// ============================================

const contentValidation = [
    body('page')
        .trim()
        .notEmpty().withMessage('Page is required'),
    body('section')
        .trim()
        .notEmpty().withMessage('Section is required'),
    body('content')
        .optional(),
    body('image_url')
        .optional()
        .isURL().withMessage('Invalid image URL'),
    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a positive integer')
];

// ============================================
// BLOG VALIDATION
// ============================================

const blogValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title must be under 200 characters'),
    body('content')
        .notEmpty().withMessage('Content is required'),
    body('excerpt')
        .optional()
        .isLength({ max: 500 }).withMessage('Excerpt must be under 500 characters'),
    body('category')
        .optional()
        .trim(),
    body('author')
        .optional()
        .trim(),
    body('image_url')
        .optional(),
    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
];

// ============================================
// PRODUCT VALIDATION
// ============================================

const productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 200 }).withMessage('Name must be under 200 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description')
        .optional(),
    body('category')
        .optional()
        .trim(),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    body('sku')
        .optional()
        .trim(),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'out_of_stock']).withMessage('Invalid status')
];

// ============================================
// CATEGORY VALIDATION
// ============================================

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
    body('type')
        .notEmpty().withMessage('Category type is required')
        .isIn(['blog', 'product', 'faq']).withMessage('Invalid category type'),
    body('description')
        .optional(),
    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status')
];

// ============================================
// SETTINGS VALIDATION
// ============================================

const settingsValidation = [
    body('setting_key')
        .trim()
        .notEmpty().withMessage('Setting key is required'),
    body('setting_value')
        .notEmpty().withMessage('Setting value is required'),
    body('setting_type')
        .optional()
        .isIn(['string', 'number', 'boolean', 'json']).withMessage('Invalid setting type')
];

// ============================================
// MENU VALIDATION
// ============================================

const menuValidation = [
    body('label')
        .trim()
        .notEmpty().withMessage('Menu label is required')
        .isLength({ max: 100 }).withMessage('Label must be under 100 characters'),
    body('url')
        .trim()
        .notEmpty().withMessage('URL is required'),
    body('parent_id')
        .optional(),
    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('target')
        .optional()
        .isIn(['_self', '_blank']).withMessage('Invalid target'),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status')
];

// ============================================
// TESTIMONIAL VALIDATION
// ============================================

const testimonialValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
    body('designation')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Designation must be under 100 characters'),
    body('review')
        .notEmpty().withMessage('Review is required'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('image_url')
        .optional(),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status'),
    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a positive integer')
];

// ============================================
// FAQ VALIDATION
// ============================================

const faqValidation = [
    body('question')
        .trim()
        .notEmpty().withMessage('Question is required'),
    body('answer')
        .notEmpty().withMessage('Answer is required'),
    body('category')
        .optional()
        .trim(),
    body('order')
        .optional()
        .isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status')
];

// ============================================
// CONTACT VALIDATION
// ============================================

const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('phone')
        .optional()
        .trim(),
    body('subject')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Subject must be under 200 characters'),
    body('message')
        .notEmpty().withMessage('Message is required')
];

// ============================================
// USER VALIDATION
// ============================================

const userUpdateValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format'),
    body('role')
        .optional()
        .isIn(['super_admin', 'admin', 'editor', 'viewer']).withMessage('Invalid role'),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Invalid status')
];

// ============================================
// COMMON VALIDATIONS
// ============================================

const idParamValidation = [
    param('id')
        .notEmpty().withMessage('ID is required')
];

const slugParamValidation = [
    param('slug')
        .notEmpty().withMessage('Slug is required')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Invalid slug format')
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = {
    // Auth
    registerValidation,
    loginValidation,
    changePasswordValidation,
    // Content
    contentValidation,
    // Blog
    blogValidation,
    // Product
    productValidation,
    // Category
    categoryValidation,
    // Settings
    settingsValidation,
    // Menu
    menuValidation,
    // Testimonial
    testimonialValidation,
    // FAQ
    faqValidation,
    // Contact
    contactValidation,
    // User
    userUpdateValidation,
    // Common
    idParamValidation,
    slugParamValidation,
    paginationValidation
};
