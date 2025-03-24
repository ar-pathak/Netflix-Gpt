import React, { useEffect, useState, useCallback } from 'react';
import { FaArrowLeft, FaSpinner, FaSearch } from 'react-icons/fa';
import Header from './Header';
import Footer from './common/Footer';
import MovieCard from './common/MovieCard';
import SearchForm from './common/SearchForm';
import SectionTitle from './common/SectionTitle';
import MovieSection from './movies/MovieSection';
import TypeFilter from './movies/TypeFilter';
import Pagination from './common/Pagination';
import MovieDetailsModal from './movies/MovieDetailsModal';
import ExploreSuggestions from './movies/ExploreSuggestions';
import { APP_CONFIG } from '../utils/constants';
import { omdbService } from '../services/omdbService';
import { getFallbackMovies } from '../utils/fallbackData';

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
                    setTrendingContent(combinedResults.slice(0, 17));
                } else {
                    setTrendingContent(getFallbackMovies('trending'));
                    console.warn('Using fallback trending content');
                }
            } catch (error) {
                console.error('Error loading trending content:', error);
                setTrendingError('Failed to load trending content');
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
                    setPopularContent(combinedResults.slice(0, 17));
                } else {
                    setPopularContent(getFallbackMovies('popular'));
                    console.warn('Using fallback popular content');
                }
            } catch (error) {
                console.error('Error loading popular content:', error);
                setPopularError('Failed to load popular content');
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
            const resultsPerPage = 26;
            const numRequests = 3;
            const startPage = (currentPage - 1) * numRequests + 1;

            let allResults = [];
            let totalFound = 0;

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
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setTotalPages(0);
                                }}
                                className="flex items-center text-white bg-gray-800/80 hover:bg-gray-700/80 py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <FaArrowLeft className="mr-2" /> Back to Browse
                            </button>
                            <div className="text-center">
                            <SectionTitle>{getContextTitle()}</SectionTitle>
                                <p className="text-gray-400 mt-1">Found {searchResults.length} results</p>
                            </div>
                            <div className="w-32"></div> {/* Empty div for balance */}
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
                        <TypeFilter activeType={contentType} onTypeChange={handleTypeChange} />
                        </div>

                        {searchLoading ? (
                            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                                <FaSpinner className="animate-spin text-red-600 text-5xl" />
                                <p className="text-gray-400">Searching for movies...</p>
                            </div>
                        ) : searchError ? (
                            <div className="text-center p-12 bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm">
                                <div className="text-red-500 text-5xl mb-4">
                                    <FaSearch />
                                </div>
                                <p className="text-red-500 text-xl mb-3">{searchError}</p>
                                <p className="text-gray-400">Try another search term or explore trending content below.</p>
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                    {searchResults.map((movie) => (
                                        <div key={movie.imdbID} className="transform transition-all duration-300 hover:-translate-y-1">
                                        <MovieCard
                                            movie={movie}
                                            onClick={handleMovieSelect}
                                        />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    isLoading={searchLoading}
                                />
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-12 bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm">
                                <div className="text-gray-500 text-5xl mb-4">
                                    <FaSearch />
                                </div>
                                <p className="text-gray-400 text-xl">No results found</p>
                                <p className="text-gray-500 mt-2">Try a different search term or explore our suggestions below.</p>
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