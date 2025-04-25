import React from 'react';
import { FaSpinner, FaStar, FaInfoCircle, FaPlay, FaClock, FaFilm, FaCalendar } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';
import Carousel from '../common/Carousel';
import MovieCard from '../common/MovieCard';
import { omdbService } from '../../services/omdbService';

const MovieSection = ({ title, movies, isLoading, error, onMovieSelect, setSelectedMovie }) => {
    // Take the first 5 movies as featured if available
    const featuredMovies = movies && movies.length > 0 ? movies.slice(0, 5) : [];
    // The rest of the movies
    const remainingMovies = movies && movies.length > 5 ? movies.slice(5) : [];

    const renderFeaturedMovie = (movie) => {
        return (
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 shadow-2xl h-full group">
                <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        {movie.Poster && movie.Poster !== 'N/A' ? (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50 z-10 md:hidden"></div>
                                <div className="absolute inset-0 bg-gradient-to-r md:from-transparent md:to-gray-900 opacity-80 z-10 hidden md:block"></div>
                                <img
                                    src={movie.Poster}
                                    alt={movie.Title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                {movie.Type && (
                                    <span className="px-3 py-1 bg-red-600/80 text-xs text-white rounded-full flex items-center">
                                        <FaFilm className="mr-1" />
                                        {movie.Type}
                                    </span>
                                )}
                                {movie.Rated && (
                                    <span className="px-3 py-1 bg-gray-800/80 text-xs text-gray-300 rounded-full">
                                        {movie.Rated}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">{movie.Title}</h3>
                            
                            <div className="flex items-center mb-4 flex-wrap gap-3 text-gray-300">
                                {movie.Year && (
                                    <span className="flex items-center">
                                        <FaCalendar className="mr-2" />
                                        {movie.Year}
                                    </span>
                                )}
                                {movie.Runtime && (
                                    <span className="flex items-center">
                                        <FaClock className="mr-2" />
                                        {movie.Runtime}
                                    </span>
                                )}
                                {movie.imdbRating && (
                                    <span className="flex items-center text-yellow-400">
                                        <FaStar className="mr-2" />
                                        {movie.imdbRating}/10
                                    </span>
                                )}
                            </div>

                            {movie.Plot && (
                                <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                                    {movie.Plot}
                                </p>
                            )}

                            {movie.Genre && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {movie.Genre.split(', ').slice(0, 3).map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-3 py-1 bg-gray-800/80 text-xs text-gray-300 rounded-full"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    const loadAndPlayTrailer = async () => {
                                        try {
                                            const response = await omdbService.getTrailer(movie.Title, movie.Year, movie.Type);
                                            if (response.success && response.data) {
                                                setSelectedMovie({ ...movie, trailer: response.data });
                                            } else {
                                                onMovieSelect(movie);
                                            }
                                        } catch (error) {
                                            console.error('Error loading trailer:', error);
                                            onMovieSelect(movie);
                                        }
                                    };
                                    loadAndPlayTrailer();
                                }}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                            >
                                <FaPlay className="text-xl" /> Watch Now
                            </button>
                            <button
                                onClick={() => onMovieSelect(movie)}
                                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                            >
                                <FaInfoCircle className="text-xl" /> More Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mb-16">
            <SectionTitle>{title}</SectionTitle>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-red-600 text-4xl" />
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-gray-400">Please try again or explore other sections.</p>
                </div>
            ) : featuredMovies.length > 0 ? (
                <>
                    {/* Featured Movies Carousel */}
                    <div className="mb-8">
                        <Carousel
                            items={featuredMovies}
                            renderItem={renderFeaturedMovie}
                            autoPlay={true}
                            interval={5000}
                            showDots={true}
                            showArrows={true}
                        />
                    </div>

                    {/* Other Movies Grid */}
                    {remainingMovies.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {remainingMovies.map((movie) => (
                                <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieSelect} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center p-8 bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-400">No content available.</p>
                </div>
            )}
        </div>
    );
};

export default MovieSection; 