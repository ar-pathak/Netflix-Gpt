import { OMDB_CONFIG } from '../utils/constants';
import { handleApiError, validateApiResponse, buildUrl, makeApiRequest } from '../utils/apiUtils';
import { OMDB_TYPES, PLOT_TYPES } from '../types/omdb';

/**
 * OMDB API Service
 * Provides methods for searching and retrieving movie information
 */
export const omdbService = {
    /**
     * Search for movies, series, or episodes
     * @param {string} query - Search query
     * @param {MovieSearchOptions} options - Search options
     * @returns {Promise<MovieSearchResponse>} Search results
     */
    searchMovies: async (query, options = {}) => {
        try {
            if (!query?.trim()) {
                return {
                    success: false,
                    error: 'Invalid search query'
                };
            }

            const { page = 1, type = '', year = '' } = options;
            const params = { page };
            
            if (type && Object.values(OMDB_TYPES).includes(type)) {
                params.type = type;
            }
            
            if (year) {
                params.y = year;
            }
            
            const url = buildUrl(OMDB_CONFIG.SEARCH + encodeURIComponent(query.trim()), params);
            const data = await makeApiRequest(url);
            
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

    /**
     * Get detailed information about a specific movie
     * @param {string} imdbId - IMDB ID of the movie
     * @returns {Promise<Object>} Movie details
     */
    getMovieDetails: async (imdbId) => {
        try {
            if (!imdbId?.trim()) {
                return {
                    success: false,
                    error: 'Invalid movie ID'
                };
            }

            const params = {
                plot: PLOT_TYPES.FULL
            };

            const url = buildUrl(OMDB_CONFIG.DETAILS + imdbId.trim(), params);
            const data = await makeApiRequest(url);
            
            return validateApiResponse(data, 'movie details');
        } catch (err) {
            return handleApiError(err, 'fetching movie details');
        }
    },

    /**
     * Get trailer information for a movie or series
     * @param {string} title - Title of the movie/series
     * @param {string} [year=''] - Release year
     * @param {string} [type=OMDB_TYPES.MOVIE] - Content type
     * @returns {Promise<Object>} Trailer information
     */
    getTrailer: async (title, year = '', type = OMDB_TYPES.MOVIE) => {
        try {
            if (!title?.trim()) {
                return {
                    success: false,
                    error: 'Invalid title for trailer search'
                };
            }

            const searchQuery = `${title.trim()} ${year} ${type === OMDB_TYPES.SERIES ? 'TV series' : 'movie'} official trailer`;
            const encodedQuery = encodeURIComponent(searchQuery);
            
            const trailerInfo = {
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
    
    /**
     * Get popular content for the homepage
     * @param {string} [type=OMDB_TYPES.MOVIE] - Content type
     * @returns {Promise<MovieSearchResponse>} Popular content
     */
    getPopularContent: async (type = OMDB_TYPES.MOVIE) => {
        try {
            const searchTerms = type === OMDB_TYPES.MOVIE 
                ? ['marvel', 'action', 'comedy', 'thriller', 'sci-fi']
                : ['series', 'tv', 'show', 'drama'];
                
            const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
            
            return await omdbService.searchMovies(randomTerm, { type });
        } catch (err) {
            return handleApiError(err, 'fetching popular content');
        }
    },

    /**
     * Get upcoming movies and series
     * @returns {Promise<MovieSearchResponse>} Upcoming content
     */
    getUpcomingContent: async () => {
        try {
            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;
            
            // Fetch both movies and series for the next year
            const [movies, series] = await Promise.all([
                omdbService.searchMovies('', { year: nextYear, type: OMDB_TYPES.MOVIE }),
                omdbService.searchMovies('', { year: nextYear, type: OMDB_TYPES.SERIES })
            ]);

            // Combine and sort results
            const allResults = [
                ...(movies.success ? movies.data : []),
                ...(series.success ? series.data : [])
            ].sort((a, b) => {
                const ratingA = parseFloat(a.imdbRating) || 0;
                const ratingB = parseFloat(b.imdbRating) || 0;
                return ratingB - ratingA;
            });

            return {
                success: true,
                data: allResults.slice(0, 20),
                totalResults: allResults.length
            };
        } catch (err) {
            return handleApiError(err, 'fetching upcoming content');
        }
    }
}; 