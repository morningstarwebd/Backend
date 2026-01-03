/**
 * Category Controller
 * Handles category CRUD operations
 */

const { SHEETS, getAll, getById, getByField, create, update, remove, exists } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const { slugify, uniqueSlug } = require('../utils/slugify');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Get all categories (public)
 * GET /api/categories
 */
const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 50, type, status } = req.query;

        const filters = {};
        if (type) filters.type = type;
        if (status) filters.status = status;

        const result = await getAll(SHEETS.CATEGORIES, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'order',
            sortOrder: 'asc',
            filters
        });

        // For public, only show active categories
        let data = result.data;
        if (!req.user && !status) {
            data = data.filter(cat => cat.status === 'active');
        }

        return paginatedResponse(res, data, result.pagination, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Get all categories error:', error.message);
        return errorResponse(res, 'Failed to retrieve categories', 500);
    }
};

/**
 * Get category by ID
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await getById(SHEETS.CATEGORIES, id);

        if (!category) {
            return notFoundResponse(res, 'Category');
        }

        return successResponse(res, category, 'Category retrieved successfully');
    } catch (error) {
        console.error('Get category by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve category', 500);
    }
};

/**
 * Get categories by type
 * GET /api/categories/type/:type
 */
const getCategoriesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const categories = await getByField(SHEETS.CATEGORIES, 'type', type);

        // Filter active only for public
        let data = categories;
        if (!req.user) {
            data = data.filter(cat => cat.status === 'active');
        }

        // Sort by order
        data.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

        return successResponse(res, data, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Get categories by type error:', error.message);
        return errorResponse(res, 'Failed to retrieve categories', 500);
    }
};

/**
 * Create new category
 * POST /api/categories
 */
const createCategory = async (req, res) => {
    try {
        const { name, type, description, order = 0, status = 'active' } = req.body;

        // Generate unique slug
        const checkSlugExists = async (slug) => exists(SHEETS.CATEGORIES, 'slug', slug);
        const slug = await uniqueSlug(name, checkSlugExists);

        const categoryData = {
            id: generateId('cat'),
            name,
            slug,
            type,
            description: description || '',
            order: parseInt(order) || 0,
            status
        };

        const newCategory = await create(SHEETS.CATEGORIES, categoryData);
        return createdResponse(res, newCategory, 'Category created successfully');
    } catch (error) {
        console.error('Create category error:', error.message);
        return errorResponse(res, 'Failed to create category', 500);
    }
};

/**
 * Update category
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.CATEGORIES, id);
        if (!existing) {
            return notFoundResponse(res, 'Category');
        }

        // Update slug if name changed
        if (updates.name && updates.name !== existing.name) {
            const checkSlugExists = async (slug) => exists(SHEETS.CATEGORIES, 'slug', slug, id);
            updates.slug = await uniqueSlug(updates.name, checkSlugExists);
        }

        // Format order
        if (updates.order !== undefined) {
            updates.order = parseInt(updates.order) || 0;
        }

        const updatedCategory = await update(SHEETS.CATEGORIES, id, updates);
        return successResponse(res, updatedCategory, 'Category updated successfully');
    } catch (error) {
        console.error('Update category error:', error.message);
        return errorResponse(res, 'Failed to update category', 500);
    }
};

/**
 * Delete category
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.CATEGORIES, id);
        if (!existing) {
            return notFoundResponse(res, 'Category');
        }

        await remove(SHEETS.CATEGORIES, id);
        return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
        console.error('Delete category error:', error.message);
        return errorResponse(res, 'Failed to delete category', 500);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory
};
