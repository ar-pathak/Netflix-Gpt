import { API_ENDPOINTS } from '../utils/constants';

const handleApiError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return {
        success: false,
        error: `Error ${context}. Please try again later.`
    };
};

const validateApiResponse = (data, context) => {
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

export const omdbService = {
    searchMovies: async (query, options = {}) => {
        try {
            if (!query || typeof query !== 'string') {
                return {
                    success: false,
                    error: 'Invalid search query'
                };
            }

            const { page = 1, type = '', year = '' } = options;
            
            let url = `${API_ENDPOINTS.OMDB.BASE_URL}${API_ENDPOINTS.OMDB.SEARCH}${encodeURIComponent(query)}&apikey=${API_ENDPOINTS.OMDB.API_KEY}&page=${page}`;
            
            // Add type filter if specified
            if (type && ['movie', 'series', 'episode'].includes(type)) {
                url += `&type=${type}`;
            }
            
            // Add year filter if specified
            if (year) {
                url += `&y=${year}`;
            }
            
            console.log('Fetching from URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            const validation = validateApiResponse(data, 'search');
            if (!validation.success) return validation;

            if (!Array.isArray(data.Search)) {
                return {
                    success: false,
                    error: 'Invalid search results format'
                };
            }

            return {
                success: true,
                data: data.Search,
                totalResults: parseInt(data.totalResults, 10) || 0,
                currentPage: page
            };
        } catch (err) {
            return handleApiError(err, 'fetching movies');
        }
    },

    getMovieDetails: async (imdbId) => {
        try {
            if (!imdbId || typeof imdbId !== 'string') {
                return {
                    success: false,
                    error: 'Invalid movie ID'
                };
            }

            const url = `${API_ENDPOINTS.OMDB.BASE_URL}${API_ENDPOINTS.OMDB.DETAILS}${imdbId}&apikey=${API_ENDPOINTS.OMDB.API_KEY}&plot=full`;
            console.log('Fetching details from URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Details Response:', data);
            
            return validateApiResponse(data, 'movie details');
        } catch (err) {
            return handleApiError(err, 'fetching movie details');
        }
    },

    // Find trailer using YouTube API and movie/show title
    getTrailer: async (title, year = '', type = 'movie') => {
        try {
            if (!title) {
                return {
                    success: false,
                    error: 'Invalid title for trailer search'
                };
            }

            // Construct search query for best trailer results
            const searchQuery = `${title} ${year} ${type === 'series' ? 'TV series' : 'movie'} official trailer`;
            const encodedQuery = encodeURIComponent(searchQuery);
            
            // For more reliable trailer loading, create a direct search URL
            // This will open in a new window instead of failing in the embed
            const trailerInfo = {
                // This is a special key format our VideoPlayer will recognize
                key: `direct_search:${encodedQuery}`,
                name: `${title} Official Trailer`,
                type: 'Trailer',
                site: 'YouTube'
            };
            
            return {
                success: true,
                data: trailerInfo
            };
        } catch (err) {
            return handleApiError(err, 'finding trailer');
        }
    },
    
    // Get popular movies/shows for homepage
    getPopularContent: async (type = 'movie') => {
        try {
            // Use some popular search terms to get good content
            const searchTerms = type === 'movie' 
                ? ['marvel', 'action', 'comedy', 'thriller', 'sci-fi']
                : ['series', 'tv', 'show', 'drama'];
                
            // Pick a random search term
            const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
            
            const result = await omdbService.searchMovies(randomTerm, { type });
            return result;
        } catch (err) {
            return handleApiError(err, 'fetching popular content');
        }
    }
}; 