import React from 'react';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onClick(movie);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative overflow-hidden rounded-lg bg-gray-800 cursor-pointer transition-transform hover:scale-105"
        >
            {/* Poster Image */}
            <div className="aspect-[2/3] relative">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No image</span>
                    </div>
                )}
            </div>

            {/* Overlay with movie info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                        {movie.Title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>{movie.Year}</span>
                        {movie.imdbRating && (
                            <span className="flex items-center text-yellow-400">
                                <FaStar className="mr-1" /> {movie.imdbRating}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard; 