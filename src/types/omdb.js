/**
 * @typedef {Object} MovieSearchOptions
 * @property {number} [page=1] - Page number for pagination
 * @property {string} [type] - Type of content (movie, series, episode)
 * @property {string} [year] - Year of release
 */

/**
 * @typedef {Object} MovieSearchResponse
 * @property {boolean} success - Whether the request was successful
 * @property {Array<Movie>} [data] - Array of movie results
 * @property {number} [totalResults] - Total number of results
 * @property {number} [currentPage] - Current page number
 * @property {string} [error] - Error message if request failed
 */

/**
 * @typedef {Object} Movie
 * @property {string} Title - Movie title
 * @property {string} Year - Release year
 * @property {string} imdbID - IMDB ID
 * @property {string} Type - Type of content (movie, series, episode)
 * @property {string} Poster - URL to poster image
 * @property {string} [Plot] - Movie plot
 * @property {string} [imdbRating] - IMDB rating
 * @property {string} [Genre] - Movie genres
 * @property {string} [Director] - Movie director
 * @property {string} [Actors] - Movie actors
 * @property {string} [Runtime] - Movie runtime
 * @property {string} [Rated] - Movie rating
 */

/**
 * @typedef {Object} TrailerInfo
 * @property {string} key - Trailer key or search query
 * @property {string} name - Trailer name
 * @property {string} type - Type of video
 * @property {string} site - Video platform
 */

export const OMDB_TYPES = {
    MOVIE: 'movie',
    SERIES: 'series',
    EPISODE: 'episode'
};

export const PLOT_TYPES = {
    SHORT: 'short',
    FULL: 'full'
};

export const RESPONSE_TYPES = {
    JSON: 'json',
    XML: 'xml'
}; 