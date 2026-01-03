/**
 * Product Controller
 * Handles product CRUD operations
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
 * Get all products (public)
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, category, minPrice, maxPrice, search } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;

        const result = await getAll(SHEETS.PRODUCTS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'created_at',
            sortOrder: 'desc',
            filters
        });

        let data = result.data;

        // Filter by price range
        if (minPrice || maxPrice) {
            data = data.filter(product => {
                const price = parseFloat(product.price) || 0;
                if (minPrice && price < parseFloat(minPrice)) return false;
                if (maxPrice && price > parseFloat(maxPrice)) return false;
                return true;
            });
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(product =>
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.sku?.toLowerCase().includes(searchLower)
            );
        }

        // For public, only show active products unless specified
        if (!req.user && !status) {
            data = data.filter(product => product.status === 'active');
        }

        return paginatedResponse(res, data, result.pagination, 'Products retrieved successfully');
    } catch (error) {
        console.error('Get all products error:', error.message);
        return errorResponse(res, 'Failed to retrieve products', 500);
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getById(SHEETS.PRODUCTS, id);

        if (!product) {
            return notFoundResponse(res, 'Product');
        }

        // For public, only show active
        if (!req.user && product.status !== 'active') {
            return notFoundResponse(res, 'Product');
        }

        // Parse gallery URLs if stored as JSON string
        if (product.gallery_urls && typeof product.gallery_urls === 'string') {
            try {
                product.gallery_urls = JSON.parse(product.gallery_urls);
            } catch {
                product.gallery_urls = product.gallery_urls.split(',').map(url => url.trim());
            }
        }

        return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
        console.error('Get product by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve product', 500);
    }
};

/**
 * Get product by slug
 * GET /api/products/slug/:slug
 */
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const products = await getByField(SHEETS.PRODUCTS, 'slug', slug);

        if (!products || products.length === 0) {
            return notFoundResponse(res, 'Product');
        }

        const product = products[0];

        // For public, only show active
        if (!req.user && product.status !== 'active') {
            return notFoundResponse(res, 'Product');
        }

        // Parse gallery URLs
        if (product.gallery_urls && typeof product.gallery_urls === 'string') {
            try {
                product.gallery_urls = JSON.parse(product.gallery_urls);
            } catch {
                product.gallery_urls = product.gallery_urls.split(',').map(url => url.trim());
            }
        }

        return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
        console.error('Get product by slug error:', error.message);
        return errorResponse(res, 'Failed to retrieve product', 500);
    }
};

/**
 * Get products by category
 * GET /api/products/category/:cat
 */
const getProductsByCategory = async (req, res) => {
    try {
        const { cat } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await getAll(SHEETS.PRODUCTS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'created_at',
            sortOrder: 'desc',
            filters: { category: cat, status: 'active' }
        });

        return paginatedResponse(res, result.data, result.pagination, 'Products retrieved successfully');
    } catch (error) {
        console.error('Get products by category error:', error.message);
        return errorResponse(res, 'Failed to retrieve products', 500);
    }
};

/**
 * Create new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const {
            name, price, description, image_url, gallery_urls,
            category, stock, sku, status = 'active'
        } = req.body;

        // Generate unique slug
        const checkSlugExists = async (slug) => exists(SHEETS.PRODUCTS, 'slug', slug);
        const slug = await uniqueSlug(name, checkSlugExists);

        // Convert gallery URLs to string for storage
        let galleryUrlsStr = '';
        if (gallery_urls) {
            galleryUrlsStr = Array.isArray(gallery_urls)
                ? JSON.stringify(gallery_urls)
                : gallery_urls;
        }

        const productData = {
            id: generateId('prd'),
            name,
            slug,
            price: parseFloat(price).toFixed(2),
            description: description || '',
            image_url: image_url || '',
            gallery_urls: galleryUrlsStr,
            category: category || '',
            stock: parseInt(stock) || 0,
            sku: sku || '',
            status
        };

        const newProduct = await create(SHEETS.PRODUCTS, productData);

        // Parse gallery URLs for response
        if (newProduct.gallery_urls) {
            try {
                newProduct.gallery_urls = JSON.parse(newProduct.gallery_urls);
            } catch {
                // Keep as string if parsing fails
            }
        }

        return createdResponse(res, newProduct, 'Product created successfully');
    } catch (error) {
        console.error('Create product error:', error.message);
        return errorResponse(res, 'Failed to create product', 500);
    }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.PRODUCTS, id);
        if (!existing) {
            return notFoundResponse(res, 'Product');
        }

        // Update slug if name changed
        if (updates.name && updates.name !== existing.name) {
            const checkSlugExists = async (slug) => exists(SHEETS.PRODUCTS, 'slug', slug, id);
            updates.slug = await uniqueSlug(updates.name, checkSlugExists);
        }

        // Format price
        if (updates.price !== undefined) {
            updates.price = parseFloat(updates.price).toFixed(2);
        }

        // Format stock
        if (updates.stock !== undefined) {
            updates.stock = parseInt(updates.stock) || 0;
        }

        // Convert gallery URLs to string
        if (updates.gallery_urls) {
            updates.gallery_urls = Array.isArray(updates.gallery_urls)
                ? JSON.stringify(updates.gallery_urls)
                : updates.gallery_urls;
        }

        const updatedProduct = await update(SHEETS.PRODUCTS, id, updates);

        // Parse gallery URLs for response
        if (updatedProduct.gallery_urls) {
            try {
                updatedProduct.gallery_urls = JSON.parse(updatedProduct.gallery_urls);
            } catch {
                // Keep as string if parsing fails
            }
        }

        return successResponse(res, updatedProduct, 'Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error.message);
        return errorResponse(res, 'Failed to update product', 500);
    }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.PRODUCTS, id);
        if (!existing) {
            return notFoundResponse(res, 'Product');
        }

        await remove(SHEETS.PRODUCTS, id);
        return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error.message);
        return errorResponse(res, 'Failed to delete product', 500);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
