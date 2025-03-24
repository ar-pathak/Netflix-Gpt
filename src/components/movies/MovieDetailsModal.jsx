import React from 'react';

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

export default MovieDetailsModal; 