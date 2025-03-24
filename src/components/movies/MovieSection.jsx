import React from 'react';
import { FaSpinner, FaStar, FaInfoCircle, FaPlay } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';
import Carousel from '../common/Carousel';
import MovieCard from '../common/MovieCard';
import { omdbService } from '../../services/omdbService';

const MovieSection = ({ title, movies, isLoading, error, onMovieSelect, setSelectedMovie }) => {
    // Take the first 5 movies as featured if available
    const featuredMovies = movies && movies.length > 0 ? movies.slice(0, 5) : [];
    // The rest of the movies
    const remainingMovies = movies && movies.length > 5 ? movies.slice(5) : [];

    console.log('MovieSection:', {
        title,
        totalMovies: movies?.length,
        featuredMoviesCount: featuredMovies.length,
        featuredMovies,
        isLoading,
        error
    });

    const renderFeaturedMovie = (movie) => {
        console.log('Rendering featured movie:', movie);
        return (
            <div className="overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 shadow-xl h-full">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                        {movie.Poster && movie.Poster !== 'N/A' ? (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50 z-10 md:hidden"></div>
                                <div className="absolute inset-0 bg-gradient-to-r md:from-transparent md:to-gray-900 opacity-80 z-10 hidden md:block"></div>
                                <img
                                    src={movie.Poster}
                                    alt={movie.Title}
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
                            <h3 className="text-2xl font-bold text-white mb-2">{movie.Title}</h3>
                            <div className="flex items-center mb-4 flex-wrap gap-2">
                                <span className="text-gray-400">{movie.Year}</span>
                                {movie.imdbRating && (
                                    <span className="flex items-center text-yellow-400">
                                        <FaStar className="mr-1" /> {movie.imdbRating}
                                    </span>
                                )}
                                <span className="px-2 py-1 bg-red-600 bg-opacity-50 text-xs text-white rounded capitalize">
                                    {movie.Type}
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
                                            const response = await omdbService.getTrailer(movie.Title, movie.Year, movie.Type);
                                            if (response.success && response.data) {
                                                setSelectedMovie({ ...movie, trailer: response.data });
                                            } else {
                                                // Fall back to info if trailer not available
                                                onMovieSelect(movie);
                                            }
                                        } catch (error) {
                                            console.error('Error loading trailer:', error);
                                            onMovieSelect(movie);
                                        }
                                    };
                                    loadAndPlayTrailer();
                                }}
                                className="px-5 py-2 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                            >
                                <FaPlay className="text-red-600" /> Play
                            </button>
                            <button
                                onClick={() => onMovieSelect(movie)}
                                className="px-5 py-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white rounded-md transition-colors flex items-center gap-2"
                            >
                                <FaInfoCircle /> More Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
            ) : featuredMovies.length > 0 ? (
                <>
                    {/* Featured Movies Carousel */}
                    <div className="mb-6">
                        <Carousel
                            items={featuredMovies}
                            renderItem={renderFeaturedMovie}
                            autoPlay={true}
                            interval={5000}
                        />
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

export default MovieSection; 