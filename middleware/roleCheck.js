/**
 * Role Check Middleware
 * Role-based access control for protected routes
 */

const { errorResponse } = require('../utils/response');

// Available roles
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = [ROLES.VIEWER, ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN];

/**
 * Check if user has required role
 * @param {...string} allowedRoles - Roles that are allowed to access
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return errorResponse(res, 'Not authenticated', 401);
            }

            const userRole = req.user.role;

            // Check if user's role is in allowed roles
            if (!allowedRoles.includes(userRole)) {
                return errorResponse(
                    res,
                    'Access denied. Insufficient permissions.',
                    403
                );
            }

            next();
        } catch (error) {
            console.error('Role check error:', error.message);
            return errorResponse(res, 'Authorization error', 500);
        }
    };
};

/**
 * Check if user has minimum role level
 * @param {string} minRole - Minimum required role
 */
const requireMinRole = (minRole) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Not authenticated', 401);
            }

            const userRoleIndex = ROLE_HIERARCHY.indexOf(req.user.role);
            const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole);

            if (userRoleIndex < minRoleIndex) {
                return errorResponse(
                    res,
                    'Access denied. Insufficient permissions.',
                    403
                );
            }

            next();
        } catch (error) {
            console.error('Role check error:', error.message);
            return errorResponse(res, 'Authorization error', 500);
        }
    };
};

/**
 * Check if user is the owner or has admin role
 * @param {string} ownerField - Field name that contains owner ID
 */
const requireOwnerOrAdmin = (ownerField = 'user_id') => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Not authenticated', 401);
            }

            // Admins and super admins can access anything
            if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role)) {
                return next();
            }

            // Check if the record belongs to the user
            // This assumes the record is attached to req.resource
            if (req.resource && req.resource[ownerField] === req.user.id) {
                return next();
            }

            return errorResponse(
                res,
                'Access denied. You can only access your own resources.',
                403
            );
        } catch (error) {
            console.error('Owner check error:', error.message);
            return errorResponse(res, 'Authorization error', 500);
        }
    };
};

/**
 * Super Admin only access
 */
const superAdminOnly = requireRole(ROLES.SUPER_ADMIN);

/**
 * Admin or Super Admin access
 */
const adminOnly = requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);

/**
 * Editor and above access
 */
const editorOnly = requireRole(ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN);

module.exports = {
    ROLES,
    ROLE_HIERARCHY,
    requireRole,
    requireMinRole,
    requireOwnerOrAdmin,
    superAdminOnly,
    adminOnly,
    editorOnly
};
