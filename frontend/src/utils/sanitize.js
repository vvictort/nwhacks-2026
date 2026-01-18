/**
 * Input sanitization utilities to prevent XSS and clean user input
 */

/**
 * Sanitize text input - removes HTML tags and dangerous characters
 * @param {string} value - The input value to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeText = (value) => {
    if (typeof value !== 'string') return value;
    return value
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>]/g, ''); // Remove angle brackets
};

/**
 * Sanitize for display - escapes HTML entities
 * @param {string} value - The input value to escape
 * @returns {string} HTML-escaped string
 */
export const escapeHtml = (value) => {
    if (typeof value !== 'string') return value;
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
    };
    return value.replace(/[&<>"'`]/g, (char) => htmlEntities[char]);
};

/**
 * Sanitize phone number - keeps only digits, +, -, (, ), and spaces
 * @param {string} value - The phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export const sanitizePhone = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/[^\d+\-() ]/g, '');
};

/**
 * Sanitize email - basic cleanup (trimming and lowercase)
 * @param {string} value - The email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
};

/**
 * Sanitize a form data object
 * @param {Object} formData - Object with form field values
 * @param {Object} fieldTypes - Object mapping field names to types ('text', 'email', 'phone', 'password')
 * @returns {Object} Sanitized form data
 */
export const sanitizeFormData = (formData, fieldTypes = {}) => {
    const sanitized = {};

    for (const [key, value] of Object.entries(formData)) {
        const fieldType = fieldTypes[key] || 'text';

        switch (fieldType) {
            case 'email':
                sanitized[key] = sanitizeEmail(value);
                break;
            case 'phone':
                sanitized[key] = sanitizePhone(value);
                break;
            case 'password':
                sanitized[key] = value; // Don't sanitize passwords
                break;
            case 'text':
            default:
                sanitized[key] = sanitizeText(value);
                break;
        }
    }

    return sanitized;
};

export default {
    sanitizeText,
    escapeHtml,
    sanitizePhone,
    sanitizeEmail,
    sanitizeFormData,
};
