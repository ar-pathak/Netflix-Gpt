import React, { useEffect, useState, useCallback } from 'react';
import Header from './Header';
import Footer from './common/Footer';
import MovieCard from './common/MovieCard';
import SearchForm from './common/SearchForm';
import { APP_CONFIG } from '../utils/constants';
import { omdbService } from '../services/omdbService';
import { FaArrowLeft, FaArrowRight, FaSpinner, FaStar, FaInfoCircle, FaPlay } from 'react-icons/fa';

const MovieDetailsModal = ({ movie, onClose }) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
                <div className="flex flex-col md:flex-row">
                    {movie.Poster && movie.Poster !== 'N/A' && (
                        <div className="md:w-1/3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{movie.Title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white focus:outline-none transition-colors bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 mb-4">
                            {movie.Year && <span className="text-gray-400">{movie.Year}</span>}
                            {movie.Runtime && <span className="text-gray-400">{movie.Runtime}</span>}
                            {movie.Rated && <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">{movie.Rated}</span>}
                            {movie.Type && (
                                <span className="px-2 py-1 bg-red-600 bg-opacity-50 text-xs text-white rounded capitalize">
                                    {movie.Type}
                                </span>
                            )}
                        </div>

                        {movie.imdbRating && (
                            <div className="flex items-center mb-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                <span className="text-yellow-400 text-2xl mr-2">★</span>
                                <div>
                                    <span className="text-white text-lg font-bold">{movie.imdbRating}/10</span>
                                    {movie.imdbVotes && (
                                        <span className="text-gray-400 text-sm ml-2 block md:inline">({movie.imdbVotes} votes)</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {movie.Plot && (
                            <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4 mb-4 border-l-2 border-red-600">
                                <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                            </div>
                        )}

                        {movie.Genre && (
                            <div className="mb-4">
                                <h3 className="text-gray-400 text-sm mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.Genre.split(', ').map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-700 text-xs text-white rounded-full"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {movie.Director && movie.Director !== 'N/A' && (
                                <div className="bg-gray-800 bg-opacity-30 p-3 rounded">
                                    <span className="text-gray-400 text-sm block mb-1">Director</span>
                                    <span className="text-white">{movie.Director}</span>
                                </div>
                            )}

                            {movie.Writer && movie.Writer !== 'N/A' && (
                                <div className="bg-gray-800 bg-opacity-30 p-3 rounded">
                                    <span className="text-gray-400 text-sm block mb-1">Writer</span>
                                    <span className="text-white">{movie.Writer}</span>
                                </div>
                            )}
                        </div>

                        {movie.Actors && movie.Actors !== 'N/A' && (
                            <div className="mb-6">
                                <h3 className="text-gray-400 text-sm mb-2">Cast</h3>
                                <div className="bg-gray-800 bg-opacity-30 p-3 rounded">
                                    <span className="text-white">{movie.Actors}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{children}</h2>
        <div className="h-[1px] flex-grow ml-4 bg-gradient-to-r from-red-600 to-transparent"></div>
    </div>
);

const TypeFilter = ({ activeType, onTypeChange }) => {
    const types = [
        { id: '', label: 'All' },
        { id: 'movie', label: 'Movies' },
        { id: 'series', label: 'TV Shows' },
        { id: 'episode', label: 'Episodes' }
    ];

    return (
        <div className="flex justify-center mb-6 bg-gray-850 rounded-lg p-1">
            <div className="flex space-x-1">
                {types.map((type) => (
                    <button
                        key={type.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeType === type.id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                        onClick={() => onTypeChange(type.id)}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    if (totalPages <= 1) return null;
    
    // Calculate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Show ellipsis if not on first few pages
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Calculate start and end of middle pages
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if we're near beginning or end
            if (currentPage <= 3) {
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            // Show ellipsis if not near last page
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        return pages;
    };
    
    return (
        <div className="mt-8 mb-6">
            <div className="flex justify-center items-center flex-wrap gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className={`flex items-center justify-center h-10 px-4 rounded-lg transition-colors ${
                        currentPage <= 1 || isLoading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    aria-label="Previous page"
                >
                    <FaArrowLeft size={16} className="mr-2" /> Previous
                </button>
                
                <div className="hidden md:flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="text-gray-400 px-2">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    disabled={isLoading}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                                        currentPage === page
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                
                <div className="flex md:hidden items-center bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-300 mr-1">Page</span>
                    <span className="text-white font-medium">{currentPage}</span>
                    <span className="text-gray-300 mx-1">of</span>
                    <span className="text-white font-medium">{totalPages}</span>
                </div>
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className={`flex items-center justify-center h-10 px-4 rounded-lg transition-colors ${
                        currentPage >= totalPages || isLoading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    aria-label="Next page"
                >
                    Next <FaArrowRight size={16} className="ml-2" />
                </button>
            </div>
            
            <div className="text-center mt-4 text-gray-400 text-sm">
                Showing results {Math.min((currentPage - 1) * 24 + 1, totalPages * 24)} 
                - {Math.min(currentPage * 24, totalPages * 24)} 
                {totalPages > 0 ? ` of ${totalPages * 24}` : ''}
            </div>
        </div>
    );
};

const MovieSection = ({ title, movies, isLoading, error, onMovieSelect, setSelectedMovie }) => {
    // Take the first movie as featured if available
    const featuredMovie = movies && movies.length > 0 ? movies[0] : null;
    // The rest of the movies
    const remainingMovies = movies && movies.length > 1 ? movies.slice(1) : [];
    
    return (
        <div className="mb-12">
            <SectionTitle>{title}</SectionTitle>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-red-600 text-4xl" />
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-gray-400">Please try again or explore other sections.</p>
                </div>
            ) : featuredMovie ? (
                <>
                    {/* Featured Movie */}
                    <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 shadow-xl">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto relative">
                                {featuredMovie.Poster && featuredMovie.Poster !== 'N/A' ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50 z-10 md:hidden"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r md:from-transparent md:to-gray-900 opacity-80 z-10 hidden md:block"></div>
                                        <img 
                                            src={featuredMovie.Poster} 
                                            alt={featuredMovie.Title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <span className="text-gray-500">No image available</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{featuredMovie.Title}</h3>
                                    <div className="flex items-center mb-4 flex-wrap gap-2">
                                        <span className="text-gray-400">{featuredMovie.Year}</span>
                                        {featuredMovie.imdbRating && (
                                            <span className="flex items-center text-yellow-400">
                                                <FaStar className="mr-1" /> {featuredMovie.imdbRating}
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-red-600 bg-opacity-50 text-xs text-white rounded capitalize">
                                            {featuredMovie.Type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Try to play the movie immediately
                                            const loadAndPlayTrailer = async () => {
                                                try {
                                                    const response = await omdbService.getTrailer(featuredMovie.Title, featuredMovie.Year, featuredMovie.Type);
                                                    if (response.success && response.data) {
                                                        setSelectedMovie({...featuredMovie, trailer: response.data});
                                                    } else {
                                                        // Fall back to info if trailer not available
                                                        onMovieSelect(featuredMovie);
                                                    }
                                                } catch (error) {
                                                    console.error('Error loading trailer:', error);
                                                    onMovieSelect(featuredMovie);
                                                }
                                            };
                                            loadAndPlayTrailer();
                                        }}
                                        className="px-5 py-2 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                                    >
                                        <FaPlay className="text-red-600" /> Play
                                    </button>
                                    <button 
                                        onClick={() => onMovieSelect(featuredMovie)}
                                        className="px-5 py-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white rounded-md transition-colors flex items-center gap-2"
                                    >
                                        <FaInfoCircle /> More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Other Movies Grid */}
                    {remainingMovies.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {remainingMovies.map((movie) => (
                                <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieSelect} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center p-8 bg-gray-800 bg-opacity-50 rounded-lg">
                    <p className="text-gray-400">No content available.</p>
                </div>
            )}
        </div>
    );
};

// Explore More Component
const ExploreSuggestions = ({ onExplore }) => {
    const suggestions = [
        { query: 'action', label: 'Action Movies', icon: '🎬' },
        { query: 'comedy', label: 'Comedy', icon: '😂' },
        { query: 'thriller', label: 'Thrillers', icon: '🔍' },
        { query: 'horror', label: 'Horror', icon: '👻' },
        { query: 'romance', label: 'Romance', icon: '❤️' },
        { query: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
        { query: 'documentary', label: 'Documentaries', icon: '📽️' },
        { query: 'animation', label: 'Animation', icon: '🧸' }
    ];
    
    return (
        <div className="mb-12">
            <SectionTitle>Explore More Categories</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.query}
                        onClick={() => onExplore(suggestion.query)}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg p-6 text-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-black/30 border border-gray-700"
                    >
                        <span className="block text-3xl mb-2">{suggestion.icon}</span>
                        <span className="text-lg font-medium">{suggestion.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Browse = () => {
    const [trendingContent, setTrendingContent] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const [trendingError, setTrendingError] = useState(null);
    
    const [popularContent, setPopularContent] = useState([]);
    const [popularLoading, setPopularLoading] = useState(true);
    const [popularError, setPopularError] = useState(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [contentType, setContentType] = useState('');
    
    const [selectedMovie, setSelectedMovie] = useState(null);
    
    const getContextTitle = () => {
        if (searchQuery) {
            return `Search Results for "${searchQuery}"`;
        }
        return 'Browse All Content';
    };
    
    useEffect(() => {
        const loadTrendingContent = async () => {
            setTrendingLoading(true);
            setTrendingError(null);
            
            try {
                // Using a popular search term that's likely to return many results
                // Make two API calls to get more results
                const result1 = await omdbService.searchMovies('marvel', { type: 'movie' });
                const result2 = await omdbService.searchMovies('marvel', { type: 'movie', page: 2 });
                
                let combinedResults = [];
                
                if (result1.success && result1.data && result1.data.length > 0) {
                    combinedResults = [...result1.data];
                }
                
                if (result2.success && result2.data && result2.data.length > 0) {
                    combinedResults = [...combinedResults, ...result2.data];
                }
                
                if (combinedResults.length > 0) {
                    // Limit to 13 movies for a clean display
                    setTrendingContent(combinedResults.slice(0, 13));
                } else {
                    // Fallback to default trending movies if API fails
                    setTrendingContent(getFallbackMovies('trending'));
                    console.warn('Using fallback trending content');
                }
            } catch (error) {
                console.error('Error loading trending content:', error);
                setTrendingError('Failed to load trending content');
                // Use fallback content on error
                setTrendingContent(getFallbackMovies('trending'));
            } finally {
                setTrendingLoading(false);
            }
        };
        
        loadTrendingContent();
    }, []);
    
    useEffect(() => {
        const loadPopularContent = async () => {
            setPopularLoading(true);
            setPopularError(null);
            
            try {
                // Try different popular search terms for variety
                const result1 = await omdbService.searchMovies('star wars', { type: 'movie' });
                const result2 = await omdbService.searchMovies('star wars', { type: 'movie', page: 2 });
                
                let combinedResults = [];
                
                if (result1.success && result1.data && result1.data.length > 0) {
                    combinedResults = [...result1.data];
                }
                
                if (result2.success && result2.data && result2.data.length > 0) {
                    combinedResults = [...combinedResults, ...result2.data];
                }
                
                if (combinedResults.length > 0) {
                    // Limit to 13 movies for a clean display
                    setPopularContent(combinedResults.slice(0, 13));
                } else {
                    // Fallback to default popular movies if API fails
                    setPopularContent(getFallbackMovies('popular'));
                    console.warn('Using fallback popular content');
                }
            } catch (error) {
                console.error('Error loading popular content:', error);
                setPopularError('Failed to load popular content');
                // Use fallback content on error
                setPopularContent(getFallbackMovies('popular'));
            } finally {
                setPopularLoading(false);
            }
        };
        
        loadPopularContent();
    }, []);
    
    const handleSearch = useCallback(async (query) => {
        if (!query) {
            setSearchResults([]);
            setTotalPages(0);
            setSearchQuery('');
            return;
        }
        
        setSearchLoading(true);
        setSearchError(null);
        setSearchQuery(query);
        
        try {
            // Request 26 results per page instead of the default 10
            // Note: OMDB API actually only supports 10 items per page, but we're making multiple requests
            const resultsPerPage = 26;
            const numRequests = 3; // Make 3 requests to get 30 results total
            const startPage = (currentPage - 1) * numRequests + 1;
            
            let allResults = [];
            let totalFound = 0;
            
            // Make multiple requests in parallel
            const requests = [];
            for (let i = 0; i < numRequests; i++) {
                requests.push(
                    omdbService.searchMovies(query, { 
                        page: startPage + i,
                        type: contentType
                    })
                );
            }
            
            const responses = await Promise.all(requests);
            
            // Process all successful responses
            responses.forEach(result => {
                if (result.success) {
                    allResults = [...allResults, ...result.data];
                    if (totalFound === 0 && result.totalResults) {
                        totalFound = result.totalResults;
                    }
                }
            });
            
            if (allResults.length > 0) {
                setSearchResults(allResults);
                setTotalPages(Math.ceil(totalFound / resultsPerPage));
            } else {
                setSearchResults([]);
                setTotalPages(0);
                
                // Only show error if all requests failed
                if (responses.every(r => !r.success)) {
                    setSearchError(responses[0].error);
                }
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            setSearchError('Failed to search movies');
            setSearchResults([]);
            setTotalPages(0);
        } finally {
            setSearchLoading(false);
        }
    }, [currentPage, contentType]);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        }
    }, [currentPage, contentType, handleSearch, searchQuery]);
    
    const handleTypeChange = (type) => {
        setContentType(type);
        setCurrentPage(1);
    };
    
    const handleMovieSelect = async (movie) => {
        try {
            const result = await omdbService.getMovieDetails(movie.imdbID);
            if (result.success) {
                setSelectedMovie(result.data);
            } else {
                console.error('Error loading movie details:', result.error);
            }
        } catch (error) {
            console.error('Error loading movie details:', error);
        }
    };
    
    // Add this function to provide fallback movies if API fails
    const getFallbackMovies = (category) => {
        if (category === 'trending') {
            return [
                {
                    Title: "Avengers: Endgame",
                    Year: "2019",
                    imdbID: "tt4154796",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
                    imdbRating: "8.4"
                },
                {
                    Title: "The Dark Knight",
                    Year: "2008",
                    imdbID: "tt0468569",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
                    imdbRating: "9.0"
                },
                {
                    Title: "Spider-Man: No Way Home",
                    Year: "2021",
                    imdbID: "tt10872600",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg",
                    imdbRating: "8.2"
                },
                {
                    Title: "Inception",
                    Year: "2010",
                    imdbID: "tt1375666",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "Interstellar",
                    Year: "2014",
                    imdbID: "tt0816692",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "The Matrix",
                    Year: "1999",
                    imdbID: "tt0133093",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.7"
                },
                {
                    Title: "Forrest Gump",
                    Year: "1994",
                    imdbID: "tt0109830",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "The Shawshank Redemption",
                    Year: "1994",
                    imdbID: "tt0111161",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
                    imdbRating: "9.3"
                },
                {
                    Title: "Fight Club",
                    Year: "1999",
                    imdbID: "tt0137523",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
                    imdbRating: "8.8"
                },
                {
                    Title: "The Godfather",
                    Year: "1972",
                    imdbID: "tt0068646",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "9.2"
                },
                {
                    Title: "Goodfellas",
                    Year: "1990",
                    imdbID: "tt0099685",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "8.7"
                },
                {
                    Title: "The Silence of the Lambs",
                    Year: "1991",
                    imdbID: "tt0102926",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.6"
                }
            ];
        } else if (category === 'popular') {
            return [
                {
                    Title: "Star Wars: Episode IV - A New Hope",
                    Year: "1977",
                    imdbID: "tt0076759",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "Jurassic Park",
                    Year: "1993",
                    imdbID: "tt0107290",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg",
                    imdbRating: "8.2"
                },
                {
                    Title: "The Lord of the Rings: The Fellowship of the Ring",
                    Year: "2001",
                    imdbID: "tt0120737",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
                    imdbRating: "8.9"
                },
                {
                    Title: "Pulp Fiction",
                    Year: "1994",
                    imdbID: "tt0110912",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                    imdbRating: "8.9"
                },
                {
                    Title: "Avatar",
                    Year: "2009",
                    imdbID: "tt0499549",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmMjcxYzI1MzlmXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
                    imdbRating: "7.9"
                },
                {
                    Title: "Titanic",
                    Year: "1997",
                    imdbID: "tt0120338",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
                    imdbRating: "7.9"
                },
                {
                    Title: "The Green Mile",
                    Year: "1999",
                    imdbID: "tt0120689",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg",
                    imdbRating: "8.6"
                },
                {
                    Title: "The Departed",
                    Year: "2006",
                    imdbID: "tt0407887",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "Gladiator",
                    Year: "2000",
                    imdbID: "tt0172495",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "The Lion King",
                    Year: "1994",
                    imdbID: "tt0110357",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg",
                    imdbRating: "8.5"
                },
                {
                    Title: "Schindler's List",
                    Year: "1993",
                    imdbID: "tt0108052",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
                    imdbRating: "9.0"
                },
                {
                    Title: "Saving Private Ryan",
                    Year: "1998",
                    imdbID: "tt0120815",
                    Type: "movie",
                    Poster: "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg",
                    imdbRating: "8.6"
                }
            ];
        }
        return [];
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
                <Header />  
            
            <main className="container mx-auto px-4 py-6 pt-[100px]">
                {!searchQuery && (
                    <div className="relative rounded-xl overflow-hidden mb-12">
                        {/* Hero banner */}
                        <div className="relative h-80 md:h-96 w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/80 to-transparent z-10"></div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center"></div>
                            
                            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:max-w-2xl">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {APP_CONFIG.NAME}
                    </h1>
                                <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
                                    {APP_CONFIG.DESCRIPTION}
                                </p>
                                <div className="w-full md:w-3/4">
                                    <SearchForm onSearch={handleSearch} />
                                </div>
                            </div>
                </div>
            </div>
                )}
                
                {searchQuery ? (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setTotalPages(0);
                                }} 
                                className="flex items-center text-white bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-md transition-colors shadow-md"
                            >
                                <FaArrowLeft className="mr-2" /> Back to Browse
                            </button>
                            <SectionTitle>{getContextTitle()}</SectionTitle>
                            <div className="w-32"></div> {/* Empty div for balance */}
                        </div>
                        
                        <TypeFilter activeType={contentType} onTypeChange={handleTypeChange} />
                        
                        {searchLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <FaSpinner className="animate-spin text-red-600 text-4xl" />
                            </div>
                        ) : searchError ? (
                            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
                                <p className="text-red-500 mb-2">{searchError}</p>
                                <p className="text-gray-400">Try another search term or explore trending content below.</p>
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {searchResults.map((movie) => (
                                        <MovieCard 
                                            key={movie.imdbID} 
                                            movie={movie} 
                                            onClick={handleMovieSelect}
                                        />
                                    ))}
                                </div>
                                
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    isLoading={searchLoading}
                                />
                            </>
                        ) : (
                            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
                                <p className="text-gray-400">No results found. Try a different search term.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <MovieSection 
                            title="Trending Now" 
                            movies={trendingContent} 
                            isLoading={trendingLoading} 
                            error={trendingError} 
                            onMovieSelect={handleMovieSelect}
                            setSelectedMovie={setSelectedMovie}
                        />
                        
                        <MovieSection 
                            title="Popular Movies" 
                            movies={popularContent} 
                            isLoading={popularLoading} 
                            error={popularError} 
                            onMovieSelect={handleMovieSelect}
                            setSelectedMovie={setSelectedMovie}
                        />
                        
                        <ExploreSuggestions onExplore={handleSearch} />
                    </>
                )}
            </main>
            
            <Footer />
            
            {selectedMovie && (
                <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
};

export default Browse;   