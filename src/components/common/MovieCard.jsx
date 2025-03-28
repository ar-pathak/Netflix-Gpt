import React from 'react';
import { FaStar, FaPlay, FaClock, FaFilm } from 'react-icons/fa';

const MovieCard = ({ movie, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onClick(movie);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative overflow-hidden rounded-xl bg-gray-800 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
        >
            {/* Poster Image */}
            <div className="aspect-[2/3] relative">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No image</span>
                    </div>
                )}
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-red-600 rounded-full p-4 shadow-lg">
                        <FaPlay className="text-white text-xl" />
                    </div>
                </div>
            </div>

            {/* Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {movie.Type && (
                            <span className="px-2 py-1 bg-red-600/80 text-xs text-white rounded-full flex items-center">
                                <FaFilm className="mr-1" />
                                {movie.Type}
                            </span>
                        )}
                        {movie.Rated && (
                            <span className="px-2 py-1 bg-gray-800/80 text-xs text-gray-300 rounded-full">
                                {movie.Rated}
                            </span>
                        )}
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 drop-shadow-lg">
                        {movie.Title}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        {movie.Year && (
                            <span className="flex items-center">
                                <FaClock className="mr-1" />
                                {movie.Year}
                            </span>
                        )}
                        {movie.imdbRating && (
                            <span className="flex items-center text-yellow-400">
                                <FaStar className="mr-1" />
                                {movie.imdbRating}
                            </span>
                        )}
                    </div>

                    {movie.Genre && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {movie.Genre.split(', ').slice(0, 2).map((genre) => (
                                <span
                                    key={genre}
                                    className="px-2 py-0.5 bg-gray-800/80 text-xs text-gray-300 rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard; 