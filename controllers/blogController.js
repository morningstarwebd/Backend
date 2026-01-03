/**
 * Blog Controller
 * Handles blog post CRUD operations
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
 * Get all blog posts (public)
 * GET /api/blog
 */
const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, category, search } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;

        const result = await getAll(SHEETS.BLOG_POSTS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'date',
            sortOrder: 'desc',
            filters
        });

        // Filter by search if provided
        let data = result.data;
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(post =>
                post.title?.toLowerCase().includes(searchLower) ||
                post.content?.toLowerCase().includes(searchLower) ||
                post.excerpt?.toLowerCase().includes(searchLower)
            );
        }

        // For public, only show published posts unless specified
        if (!req.user && !status) {
            data = data.filter(post => post.status === 'published');
        }

        return paginatedResponse(res, data, result.pagination, 'Posts retrieved successfully');
    } catch (error) {
        console.error('Get all posts error:', error.message);
        return errorResponse(res, 'Failed to retrieve posts', 500);
    }
};

/**
 * Get single post by ID
 * GET /api/blog/:id
 */
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await getById(SHEETS.BLOG_POSTS, id);

        if (!post) {
            return notFoundResponse(res, 'Post');
        }

        // For public, only show published
        if (!req.user && post.status !== 'published') {
            return notFoundResponse(res, 'Post');
        }

        return successResponse(res, post, 'Post retrieved successfully');
    } catch (error) {
        console.error('Get post by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve post', 500);
    }
};

/**
 * Get post by slug
 * GET /api/blog/slug/:slug
 */
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const posts = await getByField(SHEETS.BLOG_POSTS, 'slug', slug);

        if (!posts || posts.length === 0) {
            return notFoundResponse(res, 'Post');
        }

        const post = posts[0];

        // For public, only show published
        if (!req.user && post.status !== 'published') {
            return notFoundResponse(res, 'Post');
        }

        return successResponse(res, post, 'Post retrieved successfully');
    } catch (error) {
        console.error('Get post by slug error:', error.message);
        return errorResponse(res, 'Failed to retrieve post', 500);
    }
};

/**
 * Get posts by category
 * GET /api/blog/category/:cat
 */
const getPostsByCategory = async (req, res) => {
    try {
        const { cat } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await getAll(SHEETS.BLOG_POSTS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'date',
            sortOrder: 'desc',
            filters: { category: cat, status: 'published' }
        });

        return paginatedResponse(res, result.data, result.pagination, 'Posts retrieved successfully');
    } catch (error) {
        console.error('Get posts by category error:', error.message);
        return errorResponse(res, 'Failed to retrieve posts', 500);
    }
};

/**
 * Create new post
 * POST /api/blog
 */
const createPost = async (req, res) => {
    try {
        const { title, content, excerpt, category, author, image_url, status = 'draft' } = req.body;

        // Generate unique slug
        const checkSlugExists = async (slug) => exists(SHEETS.BLOG_POSTS, 'slug', slug);
        const slug = await uniqueSlug(title, checkSlugExists);

        const postData = {
            id: generateId('pst'),
            title,
            slug,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            category: category || '',
            author: author || req.user?.username || 'Admin',
            date: new Date().toISOString().split('T')[0],
            image_url: image_url || '',
            status,
            views: '0'
        };

        const newPost = await create(SHEETS.BLOG_POSTS, postData);
        return createdResponse(res, newPost, 'Post created successfully');
    } catch (error) {
        console.error('Create post error:', error.message);
        return errorResponse(res, 'Failed to create post', 500);
    }
};

/**
 * Update post
 * PUT /api/blog/:id
 */
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.BLOG_POSTS, id);
        if (!existing) {
            return notFoundResponse(res, 'Post');
        }

        // Update slug if title changed
        if (updates.title && updates.title !== existing.title) {
            const checkSlugExists = async (slug) => exists(SHEETS.BLOG_POSTS, 'slug', slug, id);
            updates.slug = await uniqueSlug(updates.title, checkSlugExists);
        }

        const updatedPost = await update(SHEETS.BLOG_POSTS, id, updates);
        return successResponse(res, updatedPost, 'Post updated successfully');
    } catch (error) {
        console.error('Update post error:', error.message);
        return errorResponse(res, 'Failed to update post', 500);
    }
};

/**
 * Delete post
 * DELETE /api/blog/:id
 */
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.BLOG_POSTS, id);
        if (!existing) {
            return notFoundResponse(res, 'Post');
        }

        await remove(SHEETS.BLOG_POSTS, id);
        return successResponse(res, null, 'Post deleted successfully');
    } catch (error) {
        console.error('Delete post error:', error.message);
        return errorResponse(res, 'Failed to delete post', 500);
    }
};

/**
 * Increment view count
 * PUT /api/blog/:id/view
 */
const incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.BLOG_POSTS, id);
        if (!existing) {
            return notFoundResponse(res, 'Post');
        }

        const currentViews = parseInt(existing.views) || 0;
        await update(SHEETS.BLOG_POSTS, id, { views: (currentViews + 1).toString() });

        return successResponse(res, { views: currentViews + 1 }, 'View count updated');
    } catch (error) {
        console.error('Increment view count error:', error.message);
        return errorResponse(res, 'Failed to update view count', 500);
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostBySlug,
    getPostsByCategory,
    createPost,
    updatePost,
    deletePost,
    incrementViewCount
};
