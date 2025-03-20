import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MovieCard = ({ movie, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (movie.Poster && movie.Poster !== 'N/A') {
            const img = new Image();
            img.src = movie.Poster;
            img.onload = () => {
                setIsLoading(false);
                setImageLoaded(true);
            };
            img.onerror = () => {
                setImageError(true);
                setIsLoading(false);
            };
        } else {
            setIsLoading(false);
        }
    }, [movie.Poster]);

    const handleClick = () => {
        if (onClick) onClick(movie);
    };

    const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

    return (
        <div 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group relative"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={`View details for ${movie.Title}`}
            tabIndex={0}
        >
            {/* Year badge */}
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded-sm">
                {movie.Year}
            </div>
            
            <div className="relative h-64">
                {/* Skeleton loader */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                
                {hasValidPoster ? (
                    <>
                        <img 
                            src={movie.Poster} 
                            alt={movie.Title}
                            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-75' : 'scale-100'}`}
                            loading="lazy"
                            style={{ opacity: imageLoaded ? 1 : 0 }}
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                        
                        {/* Play button on hover */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition-all transform hover:scale-110">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gray-700 flex flex-col items-center justify-center p-4 text-center">
                        <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            
            {/* Card info - always visible, fixed at bottom */}
            <div className="p-3">
                <h3 className="text-white font-medium mb-1 line-clamp-2">{movie.Title}</h3>
                <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">{movie.Year}</p>
                    {movie.imdbRating && (
                        <span className="text-yellow-400 text-sm flex items-center">
                            <span className="mr-1">⭐</span> {movie.imdbRating}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Year: PropTypes.string.isRequired,
        Poster: PropTypes.string,
        imdbRating: PropTypes.string,
        imdbID: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func
};

export default MovieCard; 