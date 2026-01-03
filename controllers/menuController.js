/**
 * Menu Controller
 * Handles menu item CRUD operations
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
 * Get all menu items (public)
 * GET /api/menu
 */
const getAllMenuItems = async (req, res) => {
    try {
        const { status } = req.query;

        const result = await getAll(SHEETS.MENU_ITEMS, {
            page: 1,
            limit: 100,
            sortBy: 'order',
            sortOrder: 'asc',
            filters: status ? { status } : {}
        });

        // For public, only show active items
        let data = result.data;
        if (!req.user && !status) {
            data = data.filter(item => item.status === 'active');
        }

        // Build hierarchical structure
        const buildMenuTree = (items, parentId = '') => {
            return items
                .filter(item => (item.parent_id || '') === parentId)
                .map(item => ({
                    ...item,
                    children: buildMenuTree(items, item.id)
                }))
                .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        };

        const menuTree = buildMenuTree(data);

        return successResponse(res, {
            flat: data,
            tree: menuTree
        }, 'Menu items retrieved successfully');
    } catch (error) {
        console.error('Get all menu items error:', error.message);
        return errorResponse(res, 'Failed to retrieve menu items', 500);
    }
};

/**
 * Get menu item by ID
 * GET /api/menu/:id
 */
const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await getById(SHEETS.MENU_ITEMS, id);

        if (!menuItem) {
            return notFoundResponse(res, 'Menu item');
        }

        return successResponse(res, menuItem, 'Menu item retrieved successfully');
    } catch (error) {
        console.error('Get menu item by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve menu item', 500);
    }
};

/**
 * Create new menu item
 * POST /api/menu
 */
const createMenuItem = async (req, res) => {
    try {
        const { label, url, parent_id, order = 0, target = '_self', status = 'active' } = req.body;

        // Validate parent if provided
        if (parent_id) {
            const parent = await getById(SHEETS.MENU_ITEMS, parent_id);
            if (!parent) {
                return errorResponse(res, 'Parent menu item not found', 400);
            }
        }

        const menuItemData = {
            id: generateId('mnu'),
            label,
            url,
            parent_id: parent_id || '',
            order: parseInt(order) || 0,
            target,
            status
        };

        const newMenuItem = await create(SHEETS.MENU_ITEMS, menuItemData);
        return createdResponse(res, newMenuItem, 'Menu item created successfully');
    } catch (error) {
        console.error('Create menu item error:', error.message);
        return errorResponse(res, 'Failed to create menu item', 500);
    }
};

/**
 * Update menu item
 * PUT /api/menu/:id
 */
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.MENU_ITEMS, id);
        if (!existing) {
            return notFoundResponse(res, 'Menu item');
        }

        // Validate parent if provided
        if (updates.parent_id) {
            // Can't be own parent
            if (updates.parent_id === id) {
                return errorResponse(res, 'Menu item cannot be its own parent', 400);
            }
            const parent = await getById(SHEETS.MENU_ITEMS, updates.parent_id);
            if (!parent) {
                return errorResponse(res, 'Parent menu item not found', 400);
            }
        }

        // Format order
        if (updates.order !== undefined) {
            updates.order = parseInt(updates.order) || 0;
        }

        const updatedMenuItem = await update(SHEETS.MENU_ITEMS, id, updates);
        return successResponse(res, updatedMenuItem, 'Menu item updated successfully');
    } catch (error) {
        console.error('Update menu item error:', error.message);
        return errorResponse(res, 'Failed to update menu item', 500);
    }
};

/**
 * Delete menu item
 * DELETE /api/menu/:id
 */
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.MENU_ITEMS, id);
        if (!existing) {
            return notFoundResponse(res, 'Menu item');
        }

        // Delete item and its children
        const result = await getAll(SHEETS.MENU_ITEMS, {
            page: 1,
            limit: 1000,
            filters: { parent_id: id }
        });

        // Remove children first
        for (const child of result.data) {
            await remove(SHEETS.MENU_ITEMS, child.id);
        }

        // Remove the item
        await remove(SHEETS.MENU_ITEMS, id);

        return successResponse(res, null, 'Menu item deleted successfully');
    } catch (error) {
        console.error('Delete menu item error:', error.message);
        return errorResponse(res, 'Failed to delete menu item', 500);
    }
};

/**
 * Reorder menu items
 * PUT /api/menu/reorder
 */
const reorderMenuItems = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return errorResponse(res, 'Items array is required', 400);
        }

        const results = [];

        for (const item of items) {
            if (item.id && item.order !== undefined) {
                const updated = await update(SHEETS.MENU_ITEMS, item.id, {
                    order: parseInt(item.order) || 0,
                    ...(item.parent_id !== undefined && { parent_id: item.parent_id || '' })
                });
                if (updated) results.push(updated);
            }
        }

        return successResponse(res, results, 'Menu items reordered successfully');
    } catch (error) {
        console.error('Reorder menu items error:', error.message);
        return errorResponse(res, 'Failed to reorder menu items', 500);
    }
};

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems
};
