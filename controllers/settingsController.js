/**
 * Settings Controller
 * Handles application settings CRUD operations
 */

const { SHEETS, getAll, getById, getByField, create, update } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    notFoundResponse
} = require('../utils/response');

/**
 * Get all settings
 * GET /api/settings
 */
const getAllSettings = async (req, res) => {
    try {
        const result = await getAll(SHEETS.SETTINGS, {
            page: 1,
            limit: 1000, // Get all settings
            sortBy: 'setting_key',
            sortOrder: 'asc'
        });

        // Convert to key-value object for easier use
        const settingsObj = {};
        result.data.forEach(setting => {
            let value = setting.setting_value;

            // Parse value based on type
            if (setting.setting_type === 'number') {
                value = parseFloat(value) || 0;
            } else if (setting.setting_type === 'boolean') {
                value = value === 'true' || value === '1';
            } else if (setting.setting_type === 'json') {
                try {
                    value = JSON.parse(value);
                } catch {
                    // Keep as string if parsing fails
                }
            }

            settingsObj[setting.setting_key] = {
                id: setting.id,
                value,
                type: setting.setting_type,
                updated_at: setting.updated_at
            };
        });

        return successResponse(res, settingsObj, 'Settings retrieved successfully');
    } catch (error) {
        console.error('Get all settings error:', error.message);
        return errorResponse(res, 'Failed to retrieve settings', 500);
    }
};

/**
 * Get setting by key
 * GET /api/settings/:key
 */
const getSettingByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const settings = await getByField(SHEETS.SETTINGS, 'setting_key', key);

        if (!settings || settings.length === 0) {
            return notFoundResponse(res, 'Setting');
        }

        const setting = settings[0];
        let value = setting.setting_value;

        // Parse value based on type
        if (setting.setting_type === 'number') {
            value = parseFloat(value) || 0;
        } else if (setting.setting_type === 'boolean') {
            value = value === 'true' || value === '1';
        } else if (setting.setting_type === 'json') {
            try {
                value = JSON.parse(value);
            } catch {
                // Keep as string
            }
        }

        return successResponse(res, { ...setting, parsed_value: value }, 'Setting retrieved successfully');
    } catch (error) {
        console.error('Get setting by key error:', error.message);
        return errorResponse(res, 'Failed to retrieve setting', 500);
    }
};

/**
 * Update single setting
 * PUT /api/settings/:key
 */
const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value, type } = req.body;

        // Find existing setting
        const settings = await getByField(SHEETS.SETTINGS, 'setting_key', key);

        let result;
        if (settings && settings.length > 0) {
            // Update existing
            const existingSetting = settings[0];
            const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

            result = await update(SHEETS.SETTINGS, existingSetting.id, {
                setting_value: settingValue,
                setting_type: type || existingSetting.setting_type || 'string'
            });
        } else {
            // Create new
            const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

            result = await create(SHEETS.SETTINGS, {
                id: generateId('set'),
                setting_key: key,
                setting_value: settingValue,
                setting_type: type || 'string'
            });
        }

        return successResponse(res, result, 'Setting updated successfully');
    } catch (error) {
        console.error('Update setting error:', error.message);
        return errorResponse(res, 'Failed to update setting', 500);
    }
};

/**
 * Bulk update settings
 * PUT /api/settings
 */
const bulkUpdateSettings = async (req, res) => {
    try {
        const { settings } = req.body;

        if (!settings || typeof settings !== 'object') {
            return errorResponse(res, 'Settings object is required', 400);
        }

        const results = [];

        for (const [key, data] of Object.entries(settings)) {
            const value = typeof data === 'object' && data.value !== undefined ? data.value : data;
            const type = typeof data === 'object' && data.type ? data.type : 'string';

            const existingSettings = await getByField(SHEETS.SETTINGS, 'setting_key', key);
            const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

            if (existingSettings && existingSettings.length > 0) {
                const updated = await update(SHEETS.SETTINGS, existingSettings[0].id, {
                    setting_value: settingValue,
                    setting_type: type
                });
                results.push(updated);
            } else {
                const created = await create(SHEETS.SETTINGS, {
                    id: generateId('set'),
                    setting_key: key,
                    setting_value: settingValue,
                    setting_type: type
                });
                results.push(created);
            }
        }

        return successResponse(res, results, 'Settings updated successfully');
    } catch (error) {
        console.error('Bulk update settings error:', error.message);
        return errorResponse(res, 'Failed to update settings', 500);
    }
};

module.exports = {
    getAllSettings,
    getSettingByKey,
    updateSetting,
    bulkUpdateSettings
};
