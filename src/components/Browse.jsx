import React, { useEffect, useState, useCallback } from 'react';
import Header from './Header';
import Footer from './common/Footer';
import MovieCard from './common/MovieCard';
import SearchForm from './common/SearchForm';
import { APP_CONFIG } from '../utils/constants';
import { omdbService } from '../services/omdbService';

const MovieDetailsModal = ({ movie, onClose }) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col md:flex-row">
                    {movie.Poster && movie.Poster !== 'N/A' && (
                        <div className="md:w-1/3">
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="w-full h-auto object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-white mb-2">{movie.Title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white focus:outline-none transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-400 mr-2">⭐</span>
                                <span className="text-white">{movie.imdbRating}/10</span>
                                {movie.imdbVotes && <span className="text-gray-400 ml-2">({movie.imdbVotes} votes)</span>}
                            </div>
                        )}

                        {movie.Plot && (
                            <p className="text-gray-300 mb-4 leading-relaxed">{movie.Plot}</p>
                        )}

                        {movie.Genre && (
                            <div className="mb-4">
                                <h3 className="text-white text-sm font-medium mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.Genre.split(', ').map(genre => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 bg-red-600 bg-opacity-40 text-white text-sm rounded-full"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movie.Director && movie.Director !== 'N/A' && (
                            <div className="mb-2">
                                <span className="text-gray-400">Director: </span>
                                <span className="text-white">{movie.Director}</span>
                            </div>
                        )}

                        {movie.Actors && movie.Actors !== 'N/A' && (
                            <div className="mb-4">
                                <span className="text-gray-400">Cast: </span>
                                <span className="text-white">{movie.Actors}</span>
                            </div>
                        )}

                        {movie.Awards && movie.Awards !== 'N/A' && (
                            <div className="mt-4 p-3 bg-gray-800 rounded">
                                <span className="text-yellow-400">🏆 </span>
                                <span className="text-gray-200">{movie.Awards}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 ml-1">
        {children}
    </h2>
);

const TypeFilter = ({ selectedType, onTypeChange }) => {
    const types = [
        { id: '', label: 'All Types' },
        { id: 'movie', label: 'Movies' },
        { id: 'series', label: 'TV Series' },
        { id: 'episode', label: 'Episodes' }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {types.map(type => (
                <button
                    key={type.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === type.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    onClick={() => onTypeChange(type.id)}
                >
                    {type.label}
                </button>
            ))}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if there are 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);

            // Calculate start and end page numbers
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning or end
            if (currentPage <= 2) {
                endPage = 4;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 3;
            }

            // Add ellipsis before middle pages if needed
            if (startPage > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis after middle pages if needed
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always include last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center my-8">
            <nav aria-label="Pagination" className="flex items-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`mx-1 p-2 rounded-full flex items-center justify-center ${currentPage === 1
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-white hover:bg-gray-800'
                        }`}
                    aria-label="Previous page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="mx-1 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${currentPage === page
                                        ? 'bg-red-600 text-white'
                                        : 'text-white hover:bg-gray-800'
                                    }`}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`mx-1 p-2 rounded-full flex items-center justify-center ${currentPage === totalPages
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-white hover:bg-gray-800'
                        }`}
                    aria-label="Next page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </nav>
        </div>
    );
};

const MovieSection = ({ title, movies, totalResults, currentPage, totalPages, onPageChange, emptyMessage, onMovieClick }) => {
    if (movies.length === 0) {
        return (
            <div className="mt-8 mb-12">
                <SectionTitle>{title}</SectionTitle>
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 mb-12">
            <div className="flex justify-between items-center mb-4">
                <SectionTitle>{title}</SectionTitle>
                {totalResults > 0 && (
                    <span className="text-gray-400 text-sm">
                        {totalResults} results found
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map(movie => (
                    <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onClick={onMovieClick}
                    />
                ))}
            </div>

            {totalPages > 1 && onPageChange && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

const Browse = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [movies, setMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('trending'); // 'trending', 'popular', 'search'
    const [movieDetails, setMovieDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [selectedType, setSelectedType] = useState('');

    // Calculate total pages 
    const totalPages = Math.ceil(totalResults / 10);

    const loadTrendingMovies = useCallback(async () => {
        setIsLoading(true);
        const result = await omdbService.searchMovies('marvel', { page: 1 });
        if (result.success) {
            setTrendingMovies(result.data);
        }
        setIsLoading(false);
    }, []);

    const loadPopularMovies = useCallback(async (page = 1) => {
        setIsLoading(true);
        const result = await omdbService.searchMovies('avengers', { page });
        if (result.success) {
            setPopularMovies(result.data);
            setTotalResults(result.totalResults);
            setCurrentPage(result.currentPage);
        }
        setIsLoading(false);
    }, []);

    const searchMovies = useCallback(async (query, page = 1, type = '') => {
        setIsLoading(true);
        setError(null);

        const options = { page, type };
        const result = await omdbService.searchMovies(query, options);

        if (result.success) {
            console.log('Search results:', result);
            setMovies(result.data);
            setTotalResults(result.totalResults);
            setCurrentPage(result.currentPage);
            setActiveSection('search');
        } else {
            setError(result.error);
            setMovies([]);
            setTotalResults(0);
        }

        setIsLoading(false);
    }, []);

    const handleSearch = useCallback((query) => {
        if (query.trim()) {
            setSearchQuery(query);
            setCurrentPage(1); // Reset to first page on new search
            searchMovies(query, 1, selectedType);
        }
    }, [searchMovies, selectedType]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        if (activeSection === 'search' && searchQuery) {
            searchMovies(searchQuery, page, selectedType);
        } else if (activeSection === 'popular') {
            loadPopularMovies(page);
        }

        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchQuery, searchMovies, selectedType, activeSection, loadPopularMovies]);

    const handleTypeChange = useCallback((type) => {
        setSelectedType(type);
        setCurrentPage(1); // Reset to first page on type change
        if (searchQuery) {
            searchMovies(searchQuery, 1, type);
        }
    }, [searchQuery, searchMovies]);

    const handleMovieClick = useCallback(async (movie) => {
        setIsLoading(true);
        const result = await omdbService.getMovieDetails(movie.imdbID);

        if (result.success) {
            console.log('Movie details:', result.data);
            setMovieDetails(result.data);
            setShowModal(true);
        } else {
            console.error('Failed to load movie details:', result.error);
        }
        setIsLoading(false);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
    }, []);

    useEffect(() => {
        // Load trending movies on initial render
        loadTrendingMovies();

        // Load popular movies
        loadPopularMovies();
        setActiveSection('popular');
    }, [loadTrendingMovies, loadPopularMovies]);

    const getSearchResultsTitle = () => {
        if (movies.length === 0) {
            return 'No Results Found';
        }

        return (
            <>
                Search Results for "{searchQuery}"
                {selectedType && (
                    <span className="text-red-500 ml-2">
                        ({selectedType === 'movie' ? 'Movies Only' : selectedType === 'series' ? 'TV Series Only' : 'Episodes Only'})
                    </span>
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Header />
            <div className="pt-20 px-4 md:px-8 pb-16 flex-grow mt-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl text-white font-bold mb-6">
                        {APP_CONFIG.NAME}
                        <span className="ml-2 text-red-600">{APP_CONFIG.DESCRIPTION}</span>
                    </h1>

                    <SearchForm
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSubmit={handleSearch}
                        isLoading={isLoading}
                    />

                    {activeSection === 'search' && (
                        <TypeFilter
                            selectedType={selectedType}
                            onTypeChange={handleTypeChange}
                        />
                    )}

                    {isLoading && !showModal && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative my-6" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* Only show trending section when not searching */}
                            {activeSection !== 'search' && trendingMovies.length > 0 && (
                                <MovieSection
                                    title="Trending Now"
                                    movies={trendingMovies}
                                    emptyMessage="Unable to load trending movies"
                                    onMovieClick={handleMovieClick}
                                />
                            )}

                            {/* Show search results when searching */}
                            {activeSection === 'search' && !error && (
                                <MovieSection
                                    title={getSearchResultsTitle()}
                                    movies={movies}
                                    totalResults={totalResults}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    emptyMessage="No movies found matching your search."
                                    onMovieClick={handleMovieClick}
                                />
                            )}

                            {/* Only show popular section when not searching */}
                            {activeSection === 'popular' && !error && popularMovies.length > 0 && (
                                <MovieSection
                                    title="Popular Movies"
                                    movies={popularMovies}
                                    totalResults={totalResults}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    emptyMessage="Unable to load popular movies"
                                    onMovieClick={handleMovieClick}
                                />
                            )}
                        </>
                    )}
                </div>

                {showModal && movieDetails && (
                    <MovieDetailsModal
                        movie={movieDetails}
                        onClose={closeModal}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Browse;   