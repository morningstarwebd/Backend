/**
 * Stats Controller
 * Handles dashboard statistics and analytics
 */

const { SHEETS, count, getAll } = require('../utils/sheetHelper');
const {
    successResponse,
    errorResponse
} = require('../utils/response');

/**
 * Get dashboard statistics
 * GET /api/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get counts for all entities
        const [
            blogCount,
            productCount,
            categoryCount,
            testimonialCount,
            faqCount,
            userCount,
            imageCount,
            contactCount
        ] = await Promise.all([
            count(SHEETS.BLOG_POSTS),
            count(SHEETS.PRODUCTS),
            count(SHEETS.CATEGORIES),
            count(SHEETS.TESTIMONIALS),
            count(SHEETS.FAQS),
            count(SHEETS.ADMIN_USERS),
            count(SHEETS.IMAGES),
            count(SHEETS.CONTACT_MESSAGES)
        ]);

        // Get unread messages count
        const unreadMessages = await count(SHEETS.CONTACT_MESSAGES, { status: 'unread' });

        // Get published content counts
        const publishedBlogs = await count(SHEETS.BLOG_POSTS, { status: 'published' });
        const activeProducts = await count(SHEETS.PRODUCTS, { status: 'active' });

        const stats = {
            overview: {
                totalBlogs: blogCount,
                publishedBlogs,
                draftBlogs: blogCount - publishedBlogs,
                totalProducts: productCount,
                activeProducts,
                totalCategories: categoryCount,
                totalTestimonials: testimonialCount,
                totalFAQs: faqCount,
                totalUsers: userCount,
                totalImages: imageCount,
                totalMessages: contactCount,
                unreadMessages
            },
            quickStats: [
                { label: 'Blog Posts', value: blogCount, icon: 'article' },
                { label: 'Products', value: productCount, icon: 'shopping_bag' },
                { label: 'Users', value: userCount, icon: 'people' },
                { label: 'Messages', value: contactCount, icon: 'mail', alert: unreadMessages > 0 ? unreadMessages : null }
            ]
        };

        return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        console.error('Get dashboard stats error:', error.message);
        // return errorResponse(res, 'Failed to retrieve statistics', 500); 
        return errorResponse(res, 'Service temporarily unavailable, please retry', 503);
    }
};

/**
 * Get overview statistics
 * GET /api/stats/overview
 */
const getOverviewStats = async (req, res) => {
    try {
        // Get all data for detailed stats
        const [blogs, products, categories, users, messages] = await Promise.all([
            getAll(SHEETS.BLOG_POSTS, { page: 1, limit: 1000 }),
            getAll(SHEETS.PRODUCTS, { page: 1, limit: 1000 }),
            getAll(SHEETS.CATEGORIES, { page: 1, limit: 1000 }),
            getAll(SHEETS.ADMIN_USERS, { page: 1, limit: 1000 }),
            getAll(SHEETS.CONTACT_MESSAGES, { page: 1, limit: 1000 })
        ]);

        // Blog stats
        const blogStats = {
            total: blogs.data.length,
            byStatus: {
                published: blogs.data.filter(b => b.status === 'published').length,
                draft: blogs.data.filter(b => b.status === 'draft').length,
                archived: blogs.data.filter(b => b.status === 'archived').length
            },
            totalViews: blogs.data.reduce((sum, b) => sum + (parseInt(b.views) || 0), 0)
        };

        // Product stats
        const productStats = {
            total: products.data.length,
            byStatus: {
                active: products.data.filter(p => p.status === 'active').length,
                inactive: products.data.filter(p => p.status === 'inactive').length,
                outOfStock: products.data.filter(p => p.status === 'out_of_stock').length
            },
            totalValue: products.data.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
        };

        // Category stats
        const categoryStats = {
            total: categories.data.length,
            byType: {
                blog: categories.data.filter(c => c.type === 'blog').length,
                product: categories.data.filter(c => c.type === 'product').length,
                faq: categories.data.filter(c => c.type === 'faq').length
            }
        };

        // User stats
        const userStats = {
            total: users.data.length,
            byRole: {
                superAdmin: users.data.filter(u => u.role === 'super_admin').length,
                admin: users.data.filter(u => u.role === 'admin').length,
                editor: users.data.filter(u => u.role === 'editor').length,
                viewer: users.data.filter(u => u.role === 'viewer').length
            },
            byStatus: {
                active: users.data.filter(u => u.status === 'active').length,
                inactive: users.data.filter(u => u.status === 'inactive').length
            }
        };

        // Message stats
        const messageStats = {
            total: messages.data.length,
            byStatus: {
                unread: messages.data.filter(m => m.status === 'unread').length,
                read: messages.data.filter(m => m.status === 'read').length,
                replied: messages.data.filter(m => m.status === 'replied').length,
                archived: messages.data.filter(m => m.status === 'archived').length
            }
        };

        return successResponse(res, {
            blogs: blogStats,
            products: productStats,
            categories: categoryStats,
            users: userStats,
            messages: messageStats
        }, 'Overview statistics retrieved successfully');
    } catch (error) {
        console.error('Get overview stats error:', error.message);
        return errorResponse(res, 'Failed to retrieve overview statistics', 500);
    }
};

/**
 * Get recent activities
 * GET /api/stats/recent
 */
const getRecentActivities = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const limitNum = Math.min(parseInt(limit), 50);

        // Get recent items from each entity
        const [blogs, products, testimonials, messages] = await Promise.all([
            getAll(SHEETS.BLOG_POSTS, { page: 1, limit: limitNum, sortBy: 'created_at', sortOrder: 'desc' }),
            getAll(SHEETS.PRODUCTS, { page: 1, limit: limitNum, sortBy: 'created_at', sortOrder: 'desc' }),
            getAll(SHEETS.TESTIMONIALS, { page: 1, limit: limitNum, sortBy: 'created_at', sortOrder: 'desc' }),
            getAll(SHEETS.CONTACT_MESSAGES, { page: 1, limit: limitNum, sortBy: 'created_at', sortOrder: 'desc' })
        ]);

        // Create activity feed
        const activities = [
            ...blogs.data.map(item => ({
                type: 'blog',
                action: 'created',
                title: item.title,
                id: item.id,
                timestamp: item.created_at,
                status: item.status
            })),
            ...products.data.map(item => ({
                type: 'product',
                action: 'created',
                title: item.name,
                id: item.id,
                timestamp: item.created_at,
                status: item.status
            })),
            ...testimonials.data.map(item => ({
                type: 'testimonial',
                action: 'created',
                title: `Testimonial from ${item.name}`,
                id: item.id,
                timestamp: item.created_at,
                status: item.status
            })),
            ...messages.data.map(item => ({
                type: 'message',
                action: 'received',
                title: `Message from ${item.name}`,
                id: item.id,
                timestamp: item.created_at,
                status: item.status
            }))
        ];

        // Sort by timestamp (most recent first)
        activities.sort((a, b) => {
            const dateA = new Date(a.timestamp || 0);
            const dateB = new Date(b.timestamp || 0);
            return dateB - dateA;
        });

        // Limit results
        const recentActivities = activities.slice(0, limitNum);

        return successResponse(res, {
            activities: recentActivities,
            recentBlogs: blogs.data.slice(0, 5),
            recentProducts: products.data.slice(0, 5),
            recentMessages: messages.data.slice(0, 5)
        }, 'Recent activities retrieved successfully');
    } catch (error) {
        console.error('Get recent activities error:', error.message);
        return errorResponse(res, 'Failed to retrieve recent activities', 500);
    }
};

module.exports = {
    getDashboardStats,
    getOverviewStats,
    getRecentActivities
};
