/**
 * Testimonial Controller
 * Handles testimonial CRUD operations
 */

const { SHEETS, getAll, getById, create, update, remove } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Get all testimonials (public)
 * GET /api/testimonials
 */
const getAllTestimonials = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const result = await getAll(SHEETS.TESTIMONIALS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'order',
            sortOrder: 'asc',
            filters: status ? { status } : {}
        });

        // For public, only show active
        let data = result.data;
        if (!req.user && !status) {
            data = data.filter(t => t.status === 'active');
        }

        return paginatedResponse(res, data, result.pagination, 'Testimonials retrieved successfully');
    } catch (error) {
        console.error('Get all testimonials error:', error.message);
        return errorResponse(res, 'Failed to retrieve testimonials', 500);
    }
};

/**
 * Get testimonial by ID
 * GET /api/testimonials/:id
 */
const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await getById(SHEETS.TESTIMONIALS, id);

        if (!testimonial) {
            return notFoundResponse(res, 'Testimonial');
        }

        return successResponse(res, testimonial, 'Testimonial retrieved successfully');
    } catch (error) {
        console.error('Get testimonial by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve testimonial', 500);
    }
};

/**
 * Create new testimonial
 * POST /api/testimonials
 */
const createTestimonial = async (req, res) => {
    try {
        const { name, designation, review, rating = 5, image_url, status = 'active', order = 0 } = req.body;

        const testimonialData = {
            id: generateId('tst'),
            name,
            designation: designation || '',
            review,
            rating: Math.min(5, Math.max(1, parseInt(rating) || 5)).toString(),
            image_url: image_url || '',
            status,
            order: parseInt(order) || 0
        };

        const newTestimonial = await create(SHEETS.TESTIMONIALS, testimonialData);
        return createdResponse(res, newTestimonial, 'Testimonial created successfully');
    } catch (error) {
        console.error('Create testimonial error:', error.message);
        return errorResponse(res, 'Failed to create testimonial', 500);
    }
};

/**
 * Update testimonial
 * PUT /api/testimonials/:id
 */
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.TESTIMONIALS, id);
        if (!existing) {
            return notFoundResponse(res, 'Testimonial');
        }

        // Validate rating
        if (updates.rating !== undefined) {
            updates.rating = Math.min(5, Math.max(1, parseInt(updates.rating) || 5)).toString();
        }

        // Format order
        if (updates.order !== undefined) {
            updates.order = parseInt(updates.order) || 0;
        }

        const updatedTestimonial = await update(SHEETS.TESTIMONIALS, id, updates);
        return successResponse(res, updatedTestimonial, 'Testimonial updated successfully');
    } catch (error) {
        console.error('Update testimonial error:', error.message);
        return errorResponse(res, 'Failed to update testimonial', 500);
    }
};

/**
 * Delete testimonial
 * DELETE /api/testimonials/:id
 */
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.TESTIMONIALS, id);
        if (!existing) {
            return notFoundResponse(res, 'Testimonial');
        }

        await remove(SHEETS.TESTIMONIALS, id);
        return successResponse(res, null, 'Testimonial deleted successfully');
    } catch (error) {
        console.error('Delete testimonial error:', error.message);
        return errorResponse(res, 'Failed to delete testimonial', 500);
    }
};

/**
 * Reorder testimonials
 * PUT /api/testimonials/reorder
 */
const reorderTestimonials = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return errorResponse(res, 'Items array is required', 400);
        }

        const results = [];

        for (const item of items) {
            if (item.id && item.order !== undefined) {
                const updated = await update(SHEETS.TESTIMONIALS, item.id, {
                    order: parseInt(item.order) || 0
                });
                if (updated) results.push(updated);
            }
        }

        return successResponse(res, results, 'Testimonials reordered successfully');
    } catch (error) {
        console.error('Reorder testimonials error:', error.message);
        return errorResponse(res, 'Failed to reorder testimonials', 500);
    }
};

module.exports = {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    reorderTestimonials
};
