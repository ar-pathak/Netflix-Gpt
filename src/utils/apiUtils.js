import { OMDB_CONFIG } from './constants';

/**
 * Handles API errors and returns a standardized error response
 * @param {Error} error - The error object
 * @param {string} context - The context where the error occurred
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return {
        success: false,
        error: `Error ${context}. Please try again later.`
    };
};

/**
 * Validates API response data
 * @param {Object} data - The API response data
 * @param {string} context - The context of the validation
 * @returns {Object} Validation result
 */
export const validateApiResponse = (data, context) => {
    if (!data || typeof data !== 'object') {
        return {
            success: false,
            error: `Invalid response format from ${context}`
        };
    }

    if (data.Response === "False") {
        return {
            success: false,
            error: data.Error || `No results found for ${context}`
        };
    }

    return { success: true, data };
};

/**
 * Builds a URL with query parameters for OMDB API
 * @param {string} path - The API endpoint path
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL with query parameters
 */
export const buildUrl = (path, params = {}) => {
    const baseUrl = `${OMDB_CONFIG.BASE_URL}${path}`;
    const queryParams = new URLSearchParams({
        apikey: OMDB_CONFIG.API_KEY,
        r: OMDB_CONFIG.RESPONSE_TYPE,
        v: OMDB_CONFIG.API_VERSION,
        ...params
    });
    return `${baseUrl}&${queryParams.toString()}`;
};

/**
 * Makes an API request with error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
export const makeApiRequest = async (url, options = {}) => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}; 