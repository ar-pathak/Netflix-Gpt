import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './common/Footer';
import SearchForm from './common/SearchForm';
import MovieSection from './movies/MovieSection';
import MovieDetailsModal from './movies/MovieDetailsModal';
import ExploreSuggestions from './movies/ExploreSuggestions';
import SearchResults from './movies/SearchResults';
import { APP_CONFIG } from '../utils/constants';
import { omdbService } from '../services/omdbService';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useContent } from '../hooks/useContent';
import useUpcomingContent from '../hooks/useUpcomingContent';

const Browse = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);

    const {
        searchQuery,
        searchResults,
        searchLoading,
        searchError,
        currentPage,
        totalPages,
        contentType,
        handleSearch,
        handlePageChange,
        handleTypeChange,
        resetSearch
    } = useMovieSearch();

    // Trending content (Marvel movies)
    const {
        content: trendingContent,
        loading: trendingLoading,
        error: trendingError
    } = useContent('marvel');

    // Popular content (Star Wars)
    const {
        content: popularContent,
        loading: popularLoading,
        error: popularError
    } = useContent('star wars');

    // Action movies
    const {
        content: actionContent,
        loading: actionLoading,
        error: actionError
    } = useContent('action', 'movie');

    // Drama series
    const {
        content: dramaContent,
        loading: dramaLoading,
        error: dramaError
    } = useContent('drama', 'series');

    // Sci-Fi classics
    const {
        content: scifiContent,
        loading: scifiLoading,
        error: scifiError
    } = useContent('sci-fi', 'movie');

    // Upcoming content
    const {
        content: upcomingContent,
        loading: upcomingLoading,
        error: upcomingError
    } = useUpcomingContent();

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        }
    }, [currentPage, contentType, handleSearch, searchQuery]);

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
                                <div className="mt-4 text-sm text-gray-300">
                                    Try searching for "top rated" to see the best movies of all time
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {searchQuery ? (
                    <SearchResults
                        searchQuery={searchQuery}
                        searchResults={searchResults}
                        searchLoading={searchLoading}
                        searchError={searchError}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                        contentType={contentType}
                        onBack={resetSearch}
                        onMovieSelect={handleMovieSelect}
                                    onPageChange={handlePageChange}
                        onTypeChange={handleTypeChange}
                    />
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

                        <MovieSection
                            title="Coming Soon"
                            movies={upcomingContent}
                            isLoading={upcomingLoading}
                            error={upcomingError}
                            onMovieSelect={handleMovieSelect}
                            setSelectedMovie={setSelectedMovie}
                        />

                        <MovieSection
                            title="Action Movies"
                            movies={actionContent}
                            isLoading={actionLoading}
                            error={actionError}
                            onMovieSelect={handleMovieSelect}
                            setSelectedMovie={setSelectedMovie}
                        />

                        <MovieSection
                            title="Drama Series"
                            movies={dramaContent}
                            isLoading={dramaLoading}
                            error={dramaError}
                            onMovieSelect={handleMovieSelect}
                            setSelectedMovie={setSelectedMovie}
                        />

                        <MovieSection
                            title="Sci-Fi Classics"
                            movies={scifiContent}
                            isLoading={scifiLoading}
                            error={scifiError}
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