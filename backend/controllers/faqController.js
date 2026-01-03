/**
 * FAQ Controller
 * Handles FAQ CRUD operations
 */

const { SHEETS, getAll, getById, getByField, create, update, remove } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Get all FAQs (public)
 * GET /api/faq
 */
const getAllFAQs = async (req, res) => {
    try {
        const { page = 1, limit = 50, status, category } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;

        const result = await getAll(SHEETS.FAQS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'order',
            sortOrder: 'asc',
            filters
        });

        // For public, only show active
        let data = result.data;
        if (!req.user && !status) {
            data = data.filter(faq => faq.status === 'active');
        }

        // Group by category
        const groupedByCategory = {};
        data.forEach(faq => {
            const cat = faq.category || 'General';
            if (!groupedByCategory[cat]) {
                groupedByCategory[cat] = [];
            }
            groupedByCategory[cat].push(faq);
        });

        return successResponse(res, {
            flat: data,
            grouped: groupedByCategory
        }, 'FAQs retrieved successfully');
    } catch (error) {
        console.error('Get all FAQs error:', error.message);
        return errorResponse(res, 'Failed to retrieve FAQs', 500);
    }
};

/**
 * Get FAQ by ID
 * GET /api/faq/:id
 */
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await getById(SHEETS.FAQS, id);

        if (!faq) {
            return notFoundResponse(res, 'FAQ');
        }

        return successResponse(res, faq, 'FAQ retrieved successfully');
    } catch (error) {
        console.error('Get FAQ by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve FAQ', 500);
    }
};

/**
 * Get FAQs by category
 * GET /api/faq/category/:cat
 */
const getFAQsByCategory = async (req, res) => {
    try {
        const { cat } = req.params;
        const faqs = await getByField(SHEETS.FAQS, 'category', cat);

        // Filter active only for public
        let data = faqs;
        if (!req.user) {
            data = data.filter(faq => faq.status === 'active');
        }

        // Sort by order
        data.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

        return successResponse(res, data, 'FAQs retrieved successfully');
    } catch (error) {
        console.error('Get FAQs by category error:', error.message);
        return errorResponse(res, 'Failed to retrieve FAQs', 500);
    }
};

/**
 * Create new FAQ
 * POST /api/faq
 */
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, order = 0, status = 'active' } = req.body;

        const faqData = {
            id: generateId('faq'),
            question,
            answer,
            category: category || 'General',
            order: parseInt(order) || 0,
            status
        };

        const newFAQ = await create(SHEETS.FAQS, faqData);
        return createdResponse(res, newFAQ, 'FAQ created successfully');
    } catch (error) {
        console.error('Create FAQ error:', error.message);
        return errorResponse(res, 'Failed to create FAQ', 500);
    }
};

/**
 * Update FAQ
 * PUT /api/faq/:id
 */
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.FAQS, id);
        if (!existing) {
            return notFoundResponse(res, 'FAQ');
        }

        // Format order
        if (updates.order !== undefined) {
            updates.order = parseInt(updates.order) || 0;
        }

        const updatedFAQ = await update(SHEETS.FAQS, id, updates);
        return successResponse(res, updatedFAQ, 'FAQ updated successfully');
    } catch (error) {
        console.error('Update FAQ error:', error.message);
        return errorResponse(res, 'Failed to update FAQ', 500);
    }
};

/**
 * Delete FAQ
 * DELETE /api/faq/:id
 */
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.FAQS, id);
        if (!existing) {
            return notFoundResponse(res, 'FAQ');
        }

        await remove(SHEETS.FAQS, id);
        return successResponse(res, null, 'FAQ deleted successfully');
    } catch (error) {
        console.error('Delete FAQ error:', error.message);
        return errorResponse(res, 'Failed to delete FAQ', 500);
    }
};

/**
 * Reorder FAQs
 * PUT /api/faq/reorder
 */
const reorderFAQs = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return errorResponse(res, 'Items array is required', 400);
        }

        const results = [];

        for (const item of items) {
            if (item.id && item.order !== undefined) {
                const updated = await update(SHEETS.FAQS, item.id, {
                    order: parseInt(item.order) || 0
                });
                if (updated) results.push(updated);
            }
        }

        return successResponse(res, results, 'FAQs reordered successfully');
    } catch (error) {
        console.error('Reorder FAQs error:', error.message);
        return errorResponse(res, 'Failed to reorder FAQs', 500);
    }
};

/**
 * Cleanup empty/invalid FAQ rows
 * DELETE /api/faq/cleanup
 */
const cleanupFAQs = async (req, res) => {
    try {
        const { cleanupEmptyRows, SHEETS } = require('../config/googleSheets');
        const deletedCount = await cleanupEmptyRows(SHEETS.FAQS, 'question');

        return successResponse(res, { deletedCount }, `Cleaned up ${deletedCount} empty FAQ rows`);
    } catch (error) {
        console.error('Cleanup FAQs error:', error.message);
        return errorResponse(res, 'Failed to cleanup FAQs', 500);
    }
};

module.exports = {
    getAllFAQs,
    getFAQById,
    getFAQsByCategory,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
    cleanupFAQs
};
