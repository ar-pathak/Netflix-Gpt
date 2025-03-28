import React, { useState } from 'react';
import { FaPlay, FaTimes, FaStar, FaClock, FaCalendar, FaFilm, FaUser, FaPen, FaUsers } from 'react-icons/fa';

const MovieDetailsModal = ({ movie, onClose }) => {
    const [isTrailerLoading, setIsTrailerLoading] = useState(false);
    
    if (!movie) return null;

    const handleWatchTrailer = async () => {
        setIsTrailerLoading(true);
        try {
            // Here you would typically fetch the trailer URL from your backend
            // For now, we'll use a placeholder URL
            const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' trailer')}`;
            window.open(trailerUrl, '_blank');
        } catch (error) {
            console.error('Error loading trailer:', error);
        } finally {
            setIsTrailerLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
                <div className="flex flex-col md:flex-row">
                    {movie.Poster && movie.Poster !== 'N/A' && (
                        <div className="md:w-1/3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div>
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <button
                                    onClick={handleWatchTrailer}
                                    disabled={isTrailerLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform hover:scale-110 transition-all duration-300 shadow-lg flex items-center gap-2"
                                >
                                    <FaPlay className="text-xl" />
                                    <span>Watch Trailer</span>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="p-8 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{movie.Title}</h2>
                                <div className="flex items-center flex-wrap gap-3 mb-4">
                                    {movie.Year && (
                                        <span className="flex items-center text-gray-300">
                                            <FaCalendar className="mr-2" />
                                            {movie.Year}
                                        </span>
                                    )}
                                    {movie.Runtime && (
                                        <span className="flex items-center text-gray-300">
                                            <FaClock className="mr-2" />
                                            {movie.Runtime}
                                        </span>
                                    )}
                                    {movie.Rated && (
                                        <span className="px-3 py-1 bg-gray-800 text-sm text-gray-300 rounded-full">
                                            {movie.Rated}
                                        </span>
                                    )}
                                    {movie.Type && (
                                        <span className="px-3 py-1 bg-red-600 bg-opacity-50 text-sm text-white rounded-full capitalize flex items-center">
                                            <FaFilm className="mr-2" />
                                            {movie.Type}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white focus:outline-none transition-colors bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                                aria-label="Close"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {movie.imdbRating && (
                            <div className="flex items-center mb-6 bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                                <FaStar className="text-yellow-400 text-3xl mr-3" />
                                <div>
                                    <span className="text-white text-2xl font-bold">{movie.imdbRating}/10</span>
                                    {movie.imdbVotes && (
                                        <span className="text-gray-400 text-sm ml-2 block md:inline">({movie.imdbVotes} votes)</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {movie.Plot && (
                            <div className="bg-gray-800 bg-opacity-30 rounded-lg p-6 mb-6 border-l-4 border-red-600">
                                <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                            </div>
                        )}

                        {movie.Genre && (
                            <div className="mb-6">
                                <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.Genre.split(', ').map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-sm text-white rounded-full hover:from-gray-700 hover:to-gray-600 transition-colors"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {movie.Director && movie.Director !== 'N/A' && (
                                <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg border border-gray-700">
                                    <span className="text-gray-400 text-sm block mb-2 uppercase tracking-wider">Director</span>
                                    <span className="text-white flex items-center">
                                        <FaUser className="mr-2" />
                                        {movie.Director}
                                    </span>
                                </div>
                            )}

                            {movie.Writer && movie.Writer !== 'N/A' && (
                                <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg border border-gray-700">
                                    <span className="text-gray-400 text-sm block mb-2 uppercase tracking-wider">Writer</span>
                                    <span className="text-white flex items-center">
                                        <FaPen className="mr-2" />
                                        {movie.Writer}
                                    </span>
                                </div>
                            )}
                        </div>

                        {movie.Actors && movie.Actors !== 'N/A' && (
                            <div className="mb-6">
                                <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Cast</h3>
                                <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg border border-gray-700">
                                    <span className="text-white flex items-center">
                                        <FaUsers className="mr-2" />
                                        {movie.Actors}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleWatchTrailer}
                                disabled={isTrailerLoading}
                                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2 hover:scale-105"
                            >
                                <FaPlay className="text-xl" />
                                <span>Watch Trailer</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors shadow-lg"
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

export default MovieDetailsModal; 